#!/usr/bin/env node
// progress-log - record when each work-table step started and finished, who ran
// it, and how long it took.
//
// Registered as PreToolUse and PostToolUse hooks on the Task tool in
// .claude/settings.json. Claude Code specific; see "Claude Code specific
// machinery" in the porting guide.
//
// Why a hook and not an agent
// ---------------------------
// Agent Orchestration Rules 4.5.3 splits progress by material. Start, end,
// owner and elapsed time need no judgement, so a hook collects them for free.
// Spawning project-manager per step would pay the 27k-35k floor twice per
// step -- the most expensive shape there is. Fa and Fc read what this writes
// and spend their agent budget on the judgement instead.
//
// What this does not collect
// --------------------------
// Tokens and cost. A hook has no defined access to them; main passes the Agent
// return value to progress-monitor at the phase boundary instead (same rule).
//
// Failure direction
// -----------------
// A logger must never block work. Every unexpected condition exits 0 without
// writing. A missing entry costs a line in a report; a blocked write costs the
// run. Set GR_SW_MAKER_SKIP_PROGRESS_LOG=1 to disable it outright.
//
// Concurrency
// -----------
// Strict mode runs implementers in parallel, so two hooks can read-modify-write
// this file at once. The write is staged through a temporary file and renamed,
// which keeps the file from ever being observed half-written. A losing racer
// drops its own entry rather than corrupting the log -- the same direction as
// every other failure here.

import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

const LOG = ["project-management", "progress", "progress-log.json"];

// Work-table step symbols: 0a-8f for the phases, Fa-Fk for the common steps.
// Anchored on a word boundary so an id inside a longer token is not mistaken
// for a step.
const STEP = /\b([0-8][a-n]|F[a-k])\b/;

function done() {
  process.exit(0);
}

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

/**
 * The step symbol this Task is carrying out.
 *
 * The work table says one row is one request, and Development Mode requires the
 * step symbol to travel in the request. It is looked for in the description
 * first because that field is short and deliberate; the prompt is a fallback and
 * only its head is searched, so a symbol quoted deep in pasted context does not
 * win over the real one.
 */
function stepSymbol(input) {
  if (!input) return null;
  const description = typeof input.description === "string" ? input.description : "";
  const prompt = typeof input.prompt === "string" ? input.prompt.slice(0, 400) : "";
  const match = STEP.exec(description) || STEP.exec(prompt);
  return match ? match[1] : null;
}

function readLog(path) {
  if (!existsSync(path)) return [];
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // An unreadable log is treated as absent. Overwriting beats refusing to
    // record anything for the rest of the run.
    return [];
  }
}

function writeLog(path, entries) {
  mkdirSync(dirname(path), { recursive: true });
  const staging = `${path}.${process.pid}.tmp`;
  writeFileSync(staging, JSON.stringify(entries, null, 2) + "\n", "utf8");
  renameSync(staging, path);
}

if (process.env.GR_SW_MAKER_SKIP_PROGRESS_LOG === "1") done();

let hook;
try {
  hook = JSON.parse(readStdin());
} catch {
  done();
}
if (!hook || hook.tool_name !== "Task") done();

const event = hook.hook_event_name;
if (event !== "PreToolUse" && event !== "PostToolUse") done();

const projectDir = hook.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
const path = resolve(projectDir, ...LOG);
const at = new Date().toISOString();
const input = hook.tool_input || {};
const agent = typeof input.subagent_type === "string" ? input.subagent_type : null;
const step = stepSymbol(input);

let entries;
try {
  entries = readLog(path);
} catch {
  done();
}

if (event === "PreToolUse") {
  entries.push({
    step,
    agent,
    started_at: at,
    ended_at: null,
    duration_ms: null,
    tool_use_id: hook.tool_use_id || null,
  });
} else {
  // Close the matching open entry. Prefer the tool_use_id when the runtime
  // supplies one, since parallel siblings share both step and agent; otherwise
  // fall back to the newest open entry for the same agent.
  const id = hook.tool_use_id || null;
  const index = findOpen(entries, id, agent);
  if (index === -1) done();
  const entry = entries[index];
  entry.ended_at = at;
  const started = Date.parse(entry.started_at);
  entry.duration_ms = Number.isNaN(started) ? null : Date.parse(at) - started;
}

/**
 * Newest open entry matching this tool_use_id, or failing that, this agent.
 *
 * The fallback runs even when an id was supplied: the runtime may attach one to
 * PostToolUse and not to PreToolUse, and a matcher that gave up there would
 * leave every entry open forever -- which reads as "nothing ran" rather than
 * "duration unknown", the confusion the progress rules exist to prevent.
 */
function findOpen(list, id, who) {
  if (id) {
    for (let i = list.length - 1; i >= 0; i -= 1) {
      if (!list[i].ended_at && list[i].tool_use_id === id) return i;
    }
  }
  for (let i = list.length - 1; i >= 0; i -= 1) {
    if (!list[i].ended_at && list[i].agent === who) return i;
  }
  return -1;
}

try {
  writeLog(path, entries);
} catch {
  done();
}

done();
