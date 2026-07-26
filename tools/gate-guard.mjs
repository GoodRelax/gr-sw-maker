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

/** A tag value as written by the Form Block spec: <ns:field>value</ns:field>. */
function tagValue(text, tag) {
  const match = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(text);
  return match ? match[1].trim() : null;
}

/** Is there a passing review on record for this gate? */
function gatePassed(projectDir, gate) {
  const dir = resolve(projectDir, "project-records", "reviews");
  if (!existsSync(dir)) return false;

  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".md")) continue;
    let text;
    try {
      text = readFileSync(resolve(dir, name), "utf8");
    } catch {
      continue;
    }
    if (tagValue(text, "review:result") !== "pass") continue;

    const named = tagValue(text, "review:gate");
    if (named) {
      if (named === gate) return true;
      continue;
    }
    // review:gate is optional in the Form Block spec, so fall back to the
    // perspectives the review applied. A review covering every perspective the
    // gate requires is the same evidence under a different field.
    const dimensions = tagValue(text, "review:dimensions");
    if (!dimensions) continue;
    const applied = new Set(dimensions.match(/R\d+/g) ?? []);
    if (GATE_PERSPECTIVES[gate].every((id) => applied.has(id))) return true;
  }
  return false;
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
