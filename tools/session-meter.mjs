#!/usr/bin/env node
// session-meter - record context usage where an agent can read it.
//
// Registered as the statusLine in .claude/settings.json. Claude Code specific;
// see "Claude Code specific machinery" in the porting guide.
//
// Auxiliary, and CLI only
// -----------------------
// The status line runs only where Claude Code draws one, and it does not fire
// in the desktop app. A five day trial produced no measurement at all because
// this was the only path. Cost and tokens now come from tools/otel-sink.mjs
// over OpenTelemetry (Process Rules 3.2.7), which runs in both.
//
// What this still adds is the one figure telemetry does not carry at all: no
// metric or event reports context window usage, and the status line payload
// does.
//
// Who owns which field
// --------------------
// otel-sink owns cost and tokens; this file owns context usage. So it merges
// into session-state.json rather than rewriting it, and it does not write cost
// even though the payload carries it. Two producers writing one cost figure
// would be the second source that 3.2.7 forbids, and on the CLI both of these
// run at once.
//
// No threshold appears in this file on purpose. CLAUDE.md is the single source
// for thresholds; a copy here would be a second one that silently disagrees.

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const STATE = ["project-management", "progress", "session-state.json"];

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

let payload = null;
try {
  payload = JSON.parse(readStdin());
} catch {
  payload = null;
}

const context = payload?.context_window ?? {};
const cost = payload?.cost ?? {};
const projectDir = payload?.workspace?.project_dir ?? payload?.cwd ?? process.cwd();

// model is deliberately absent: otel-sink records the model id, cost-log.json
// is written from that, and the display name here would overwrite an id with a
// label whenever both producers run.
const state = {
  session_id: payload?.session_id ?? null,
  context_used_pct: context.used_percentage ?? null,
  context_remaining_pct: context.remaining_percentage ?? null,
  context_window_size: context.context_window_size ?? null,
  statusline_updated_at: new Date().toISOString(),
};

/** Whatever is already on disk, so otel-sink's fields survive this write. */
function existingState(path) {
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

// The status line is drawn after every response. It must never fail loudly: a
// stack trace in place of the status line would be permanent visual noise, and
// losing the measurement is a smaller loss than losing the display.
let recorded = false;
try {
  if (payload) {
    mkdirSync(join(projectDir, STATE[0], STATE[1]), { recursive: true });
    const path = join(projectDir, ...STATE);
    const merged = { ...existingState(path), ...state };
    writeFileSync(path, JSON.stringify(merged, null, 2) + "\n", "utf8");
    recorded = true;
  }
} catch {
  // fall through to the status line
}

const parts = [];
const modelLabel = payload?.model?.display_name ?? payload?.model?.id ?? null;
if (modelLabel) parts.push(modelLabel);
if (state.context_used_pct !== null) parts.push(`ctx ${state.context_used_pct}%`);
// Shown, not written. The figure on screen is for the person watching; the one
// an agent reads comes from otel-sink.
if (typeof cost.total_cost_usd === "number") parts.push(`$${cost.total_cost_usd.toFixed(2)}`);
// A status line that renders while the file behind it was never written would
// report health it cannot back up. progress-monitor would then read a stale
// session-state.json, or none, and say nothing about it.
if (payload && !recorded) parts.push("meter: NOT RECORDED");
process.stdout.write(parts.length ? parts.join("  |  ") : "session-meter: no session data");
