#!/usr/bin/env node
// session-meter - record context usage and cost where an agent can read them.
//
// Registered as the statusLine in .claude/settings.json. Claude Code specific;
// see "Claude Code specific machinery" in the porting guide.
//
// A model cannot observe its own token consumption during a conversation. The
// statusLine can: it receives context_window and cost on stdin and runs after
// every assistant response. Writing that to a file turns an unobservable
// quantity into one any agent can read, never more than one turn stale.
//
// Consumers: progress-monitor appends the per-phase figures to cost-log.json at
// each phase boundary, and the main session compares context_used_pct against
// the handoff threshold in CLAUDE.md "Quality Targets" (Process Rules 3.2.7).
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

const state = {
  session_id: payload?.session_id ?? null,
  model: payload?.model?.display_name ?? payload?.model?.id ?? null,
  context_used_pct: context.used_percentage ?? null,
  context_remaining_pct: context.remaining_percentage ?? null,
  context_window_size: context.context_window_size ?? null,
  total_input_tokens: context.total_input_tokens ?? null,
  total_output_tokens: context.total_output_tokens ?? null,
  total_cost_usd: cost.total_cost_usd ?? null,
  total_duration_ms: cost.total_duration_ms ?? null,
  updated_at: new Date().toISOString(),
};

// The status line is drawn after every response. It must never fail loudly: a
// stack trace in place of the status line would be permanent visual noise, and
// losing the measurement is a smaller loss than losing the display.
try {
  if (payload) {
    mkdirSync(join(projectDir, STATE[0], STATE[1]), { recursive: true });
    writeFileSync(join(projectDir, ...STATE), JSON.stringify(state, null, 2) + "\n", "utf8");
  }
} catch {
  // fall through to the status line
}

const parts = [];
if (state.model) parts.push(state.model);
if (state.context_used_pct !== null) parts.push(`ctx ${state.context_used_pct}%`);
if (state.total_cost_usd !== null) parts.push(`$${state.total_cost_usd.toFixed(2)}`);
process.stdout.write(parts.length ? parts.join("  |  ") : "session-meter: no session data");
