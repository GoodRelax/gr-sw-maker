#!/usr/bin/env node
// gate-guard - refuse to write a phase's artifacts before that phase's gate has
// a passing review on record.
//
// Registered as a PreToolUse hook in .claude/settings.json. Claude Code specific;
// see "Claude Code specific machinery" in the porting guide.
//
// What this does and does not do
// ------------------------------
// A quality gate whose only evidence is the same model asserting it passed is
// not a gate. This checks the one thing a machine can check without judgement:
// that a passing review for the required gate exists on disk. Whether that
// review was any good stays a judgement call, made by technical-authority.
//
// So it closes:
//   - claiming a gate passed without producing a review
//   - forgetting the gate exists because the rules fell out of context
//   - starting the next phase's work before the previous gate
// and it does not close:
//   - a review that says pass on thin evidence
//   - findings graded low to dodge a threshold
//
// Failure direction
// -----------------
// Every unexpected condition allows the write. A guard that blocks work when
// its own input is malformed would make a bug here indistinguishable from a
// gate failure, and the framework already rejected designs that fail silently
// in the blocking direction. Set GR_SW_MAKER_SKIP_GATE_GUARD=1 to disable it
// outright when it is wrong.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, relative, sep } from "node:path";

const ALLOW = 0;
const WRITE_TOOLS = new Set(["Write", "Edit", "MultiEdit", "NotebookEdit"]);

// Written before any gate, and never gated: pipeline state must stay writable
// or an interrupted session cannot record where it stopped, and the reviews
// directory must stay writable or passing a gate would require passing it first.
const ALWAYS_ALLOWED = ["project-management/", "project-records/reviews/"];

// Destination -> the gate that must already have passed. Ordered longest first
// so a specific path wins over a broader one.
const GUARDED = [
  ["project-records/performance/", "GATE-IMPL"],
  ["docs/observability/", "GATE-PLANNING"],
  ["docs/security/", "GATE-PLANNING"],
  ["docs/api/", "GATE-PLANNING"],
  ["final-report.md", "GATE-TEST"],
  ["infra/", "GATE-DESIGN"],
  ["tests/", "GATE-DESIGN"],
  ["src/", "GATE-DESIGN"],
];

// Used only when a review does not name its gate. The gate ids and the
// perspective sets are defined in Process Rules 9.4.1.
const GATE_PERSPECTIVES = {
  "GATE-PLANNING": ["R1"],
  "GATE-DESIGN": ["R2", "R4", "R5", "R7"],
  "GATE-IMPL": ["R2", "R3", "R4", "R5", "R7"],
  "GATE-TEST": ["R6"],
};

// The transition each gate stands at, as review:gate_phase records it. This is
// what keeps the perspective fallback from leaking across gates: GATE-DESIGN
// applies R2/R4/R5/R7, which is four of the five GATE-IMPL wants, so without
// scoping a single R3 review would open implementation on design's evidence.
// dependency-selection is conditional, so planning hands off to design whenever
// the external-dependency flags are all inapplicable. Both spellings name the
// same gate; rejecting the second would keep GATE-PLANNING shut for every
// project that has no external dependencies -- most of them.
const GATE_TRANSITIONS = {
  "GATE-PLANNING": ["planning->dependency-selection", "planning->design"],
  "GATE-DESIGN": ["design->implementation"],
  "GATE-IMPL": ["implementation->testing"],
  "GATE-TEST": ["testing->delivery"],
};

function allow() {
  process.exit(ALLOW);
}

function deny(reason) {
  // Both forms are documented as blocking. Emitting each covers the version
  // that reads structured output and the version that reads exit code 2.
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    })
  );
  process.stderr.write(reason + "\n");
  process.exit(2);
}

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

/**
 * The Form Block of a managed file, taken from its YAML frontmatter.
 *
 * This is not a YAML parser. It returns the indented lines under one top-level
 * key, which is all this guard needs and is what keeps it dependency-free.
 * Anything it cannot read is treated as absent, and an absent review reads as a
 * gate that has not passed -- the direction the rules already take.
 */
function formBlock(text, namespace) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!frontmatter) return null;

  const lines = frontmatter[1].split(/\r?\n/);
  const start = lines.findIndex((line) => line.trimEnd() === `${namespace}:`);
  if (start === -1) return null;

  const body = [];
  for (const line of lines.slice(start + 1)) {
    // An unindented, non-empty line is the next top-level key.
    if (line.trim() !== "" && !/^\s/.test(line)) break;
    body.push(line);
  }
  return body.join("\n");
}

/** A scalar field inside a Form Block. */
function fieldValue(block, name) {
  if (!block) return null;
  const match = new RegExp(`^\\s+${name}:\\s*(.*)$`, "m").exec(block);
  if (!match) return null;
  return match[1].trim().replace(/^["']|["']$/g, "") || null;
}

/**
 * A field plus any lines nested under it, so a value written either as a flow
 * list or as a block list comes back as one string to search.
 */
function fieldRegion(block, name) {
  if (!block) return null;
  const start = new RegExp(`^(\\s+)${name}:(.*)$`, "m").exec(block);
  if (!start) return null;

  const indent = start[1].length;
  const parts = [start[2]];
  for (const line of block.slice(start.index + start[0].length).split(/\r?\n/)) {
    if (line.trim() === "") continue;
    if (line.match(/^\s*/)[0].length <= indent) break;
    parts.push(line);
  }
  return parts.join("\n");
}

/**
 * Is there passing review evidence on record for this gate?
 *
 * Strict mode splits one review step into one agent per perspective, so the
 * evidence for a single gate arrives as several files that each carry one
 * dimension. Perspectives are therefore accumulated across every passing
 * review rather than being required to appear in one file -- demanding all of
 * them from a single review would keep the gate shut for the whole of strict
 * mode. A review that names its gate outright still short-circuits, which is
 * the simple and standard case.
 *
 * Accumulation is scoped to the transition the gate stands at. Gates share
 * perspectives -- GATE-IMPL wants the four GATE-DESIGN already applies, plus
 * R3 -- so pooling every review on disk would let one gate open on the
 * evidence collected for an earlier one.
 */
function gatePassed(projectDir, gate) {
  const dir = resolve(projectDir, "project-records", "reviews");
  if (!existsSync(dir)) return false;

  const applied = new Set();
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".md")) continue;
    let text;
    try {
      text = readFileSync(resolve(dir, name), "utf8");
    } catch {
      continue;
    }
    const block = formBlock(text, "review");
    if (fieldValue(block, "result") !== "pass") continue;

    const named = fieldValue(block, "gate");
    if (named === gate) return true;
    if (named) continue;

    // review:gate is optional in the Form Block spec, so fall back to the
    // perspectives the review applied -- but only from reviews standing at
    // this gate's transition. A review that names neither gate nor transition
    // cannot be attributed, and unattributable evidence opens nothing.
    if (!GATE_TRANSITIONS[gate].includes(fieldValue(block, "gate_phase"))) continue;

    const dimensions = fieldRegion(block, "dimensions");
    if (!dimensions) continue;
    for (const id of dimensions.match(/R\d+/g) ?? []) applied.add(id);
  }
  return GATE_PERSPECTIVES[gate].every((id) => applied.has(id));
}

/* -- main ----------------------------------------------------------------- */

if (process.env.GR_SW_MAKER_SKIP_GATE_GUARD === "1") allow();

let payload;
try {
  payload = JSON.parse(readStdin());
} catch {
  allow();
}
if (!payload || typeof payload !== "object") allow();

if (!WRITE_TOOLS.has(payload.tool_name)) allow();

const input = payload.tool_input ?? {};
const target = input.file_path ?? input.notebook_path;
if (typeof target !== "string" || target.length === 0) allow();

const projectDir = payload.cwd ?? process.cwd();
const inProject = relative(projectDir, resolve(projectDir, target));
// "" means the project root itself; a leading ".." means outside it. Neither is
// ours to police.
if (inProject === "" || inProject.startsWith("..")) allow();

const path = inProject.split(sep).join("/");
if (ALWAYS_ALLOWED.some((prefix) => path.startsWith(prefix))) allow();

const guard = GUARDED.find(([prefix]) => path === prefix || path.startsWith(prefix));
if (!guard) allow();

const [, gate] = guard;
if (gatePassed(projectDir, gate)) allow();

deny(
  `gate-guard: ${gate} has not passed, so ${path} cannot be written yet.\n` +
    `No review in project-records/reviews/ records result=pass for ${gate} ` +
    `(perspectives ${GATE_PERSPECTIVES[gate].join("/")}).\n` +
    `Run review-agent for that phase, then technical-authority to rule on the gate ` +
    `(Process Rules 9.4.1). If this guard is wrong, set GR_SW_MAKER_SKIP_GATE_GUARD=1.`
);
