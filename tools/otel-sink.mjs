#!/usr/bin/env node
// otel-sink - receive Claude Code telemetry and record the cost figures where an
// agent can read them.
//
// Claude Code specific; see "Claude Code specific machinery" in the porting
// guide. Run it from the project root alongside the session:
//
//   node tools/otel-sink.mjs
//
// Why this exists
// ---------------
// A model cannot observe its own token consumption. The statusLine was supposed
// to close that gap, but it only runs where Claude Code draws a status line, and
// the desktop app does not. A five day trial produced no measurement at all and
// nothing said so. OpenTelemetry runs in the same environment the statusLine
// does not, so it becomes the primary path and the statusLine becomes a CLI-only
// auxiliary.
//
// What is recorded, and what is refused
// -------------------------------------
// Every metric and event carries user.email, organization.id and user.id, and
// the last two cannot be disabled by any setting. session-state.json is written
// inside the project and can be committed and published. So the payload is read
// through a fixed allowlist: an attribute whose key is not in ALLOWED never
// reaches a JavaScript object this file can serialize, let alone disk. The raw
// payload is never written anywhere (MUST NOT), not to a log, not to a temp
// file, not on error.
//
// Freshness, not just presence
// ----------------------------
// A receiver that is not running drops everything in silence, which is the exact
// failure the statusLine already made once. So the file carries sink_heartbeat_at,
// refreshed on a timer whether or not traffic arrives. An idle sink and a dead
// sink then look different, and the gate can tell them apart rather than reading
// a stale file as if it were current.
//
// Cost comes from Claude Code
// ---------------------------
// cost_usd is taken as given. Deriving it from a local price table was tried and
// produced a wrong figure; a table that has to be maintained is a second source
// that silently disagrees with the first.
//
// Context usage is not available here
// -----------------------------------
// No metric or event reports context window usage. What is observable is that a
// compaction happened, as query_source="compact" on an api_request, so that is
// what gets counted. It is an after-the-fact signal, not a warning.

import { createServer } from "node:http";
import { gunzipSync, inflateSync } from "node:zlib";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const STATE = ["project-management", "progress", "session-state.json"];

// The allowlist. Anything not named here is dropped while the payload is still
// being read. Adding a key to this set publishes it, so add nothing that names
// a person, an account or an organization.
const ALLOWED = new Set([
  "event.name",
  "model",
  "cost_usd",
  "duration_ms",
  "input_tokens",
  "output_tokens",
  "cache_read_tokens",
  "cache_creation_tokens",
  "query_source",
  "agent.name",
  "session.id",
]);

const HEARTBEAT_MS = 30_000;
const WRITE_THROTTLE_MS = 1_000;

/* -- options -------------------------------------------------------------- */

function parseArgs(argv) {
  const options = { port: null, projectDir: process.cwd(), quiet: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--port") options.port = Number(argv[++i]);
    else if (arg === "--project-dir") options.projectDir = resolve(argv[++i]);
    else if (arg === "--quiet") options.quiet = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
  }
  return options;
}

/** The port Claude Code will POST to, taken from the endpoint it was given. */
function portFromEndpoint() {
  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!endpoint) return 4318;
  try {
    return Number(new URL(endpoint).port) || 4318;
  } catch {
    return 4318;
  }
}

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  process.stdout.write(
    "otel-sink - record Claude Code cost telemetry into session-state.json\n\n" +
      "  node tools/otel-sink.mjs [--port <n>] [--project-dir <path>] [--quiet]\n\n" +
      "Set the matching env in .claude/settings.local.json:\n" +
      "  CLAUDE_CODE_ENABLE_TELEMETRY=1, OTEL_METRICS_EXPORTER=otlp,\n" +
      "  OTEL_LOGS_EXPORTER=otlp, OTEL_EXPORTER_OTLP_PROTOCOL=http/json,\n" +
      "  OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318\n"
  );
  process.exit(0);
}

const port = options.port ?? portFromEndpoint();
const statePath = join(options.projectDir, ...STATE);

/* -- OTLP/JSON reading ----------------------------------------------------- */

/**
 * An OTLP anyValue. int64 arrives as a string under the proto3 JSON mapping, so
 * numbers are taken from either form.
 */
function anyValue(value) {
  if (!value || typeof value !== "object") return null;
  if ("stringValue" in value) return value.stringValue;
  if ("intValue" in value) return Number(value.intValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("boolValue" in value) return value.boolValue;
  return null;
}

/**
 * OTLP attributes as a plain object, keeping only allowed keys. This is the one
 * place payload data crosses into this program, so it is the one place the
 * allowlist has to hold.
 */
function attributes(list) {
  const out = {};
  if (!Array.isArray(list)) return out;
  for (const entry of list) {
    if (!entry || !ALLOWED.has(entry.key)) continue;
    const value = anyValue(entry.value);
    if (value !== null) out[entry.key] = value;
  }
  return out;
}

/** Claude Code names the event in event.name; older builds put it in the body. */
function eventName(record, attrs) {
  if (attrs["event.name"]) return String(attrs["event.name"]);
  const body = anyValue(record?.body);
  return typeof body === "string" ? body : "";
}

function* logRecords(payload) {
  for (const resourceLog of payload?.resourceLogs ?? []) {
    for (const scopeLog of resourceLog?.scopeLogs ?? []) {
      for (const record of scopeLog?.logRecords ?? []) yield record;
    }
  }
}

/* -- accumulation ---------------------------------------------------------- */

const sessions = new Map();
const startedAt = new Date().toISOString();

let lastEventAt = null;
let lastWriteMs = 0;
let currentSession = null;
let pendingWrite = false;

function blankSession() {
  return {
    total_cost_usd: 0,
    total_input_tokens: 0,
    total_output_tokens: 0,
    total_cache_read_tokens: 0,
    total_cache_creation_tokens: 0,
    total_duration_ms: 0,
    api_request_count: 0,
    compaction_count: 0,
    last_compaction_at: null,
    model: null,
    by_query_source: {},
    by_agent: {},
  };
}

function bucket(container, key) {
  if (!container[key]) container[key] = { cost_usd: 0, api_request_count: 0 };
  return container[key];
}

function recordApiRequest(attrs, at) {
  const id = attrs["session.id"] ?? "unknown";
  if (!sessions.has(id)) sessions.set(id, blankSession());
  const session = sessions.get(id);
  currentSession = id;

  const cost = Number(attrs.cost_usd) || 0;
  session.total_cost_usd += cost;
  session.total_input_tokens += Number(attrs.input_tokens) || 0;
  session.total_output_tokens += Number(attrs.output_tokens) || 0;
  session.total_cache_read_tokens += Number(attrs.cache_read_tokens) || 0;
  session.total_cache_creation_tokens += Number(attrs.cache_creation_tokens) || 0;
  session.total_duration_ms += Number(attrs.duration_ms) || 0;
  session.api_request_count += 1;
  if (attrs.model) session.model = String(attrs.model);

  const source = String(attrs.query_source ?? "unknown");
  const perSource = bucket(session.by_query_source, source);
  perSource.cost_usd += cost;
  perSource.api_request_count += 1;

  // The only observable trace of context exhaustion. Counted rather than
  // converted into a percentage: the window size is not reported, and inferring
  // it would mean maintaining the number here.
  if (source === "compact") {
    session.compaction_count += 1;
    session.last_compaction_at = at;
  }

  if (attrs["agent.name"]) {
    const perAgent = bucket(session.by_agent, String(attrs["agent.name"]));
    perAgent.cost_usd += cost;
    perAgent.api_request_count += 1;
  }
}

/* -- writing --------------------------------------------------------------- */

function readExisting() {
  try {
    const parsed = JSON.parse(readFileSync(statePath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Merge rather than overwrite. The statusLine writes the same file where it
 * runs, and it holds the one figure telemetry does not carry, so its fields are
 * left alone instead of being nulled out on every export.
 */
function writeState() {
  const now = new Date().toISOString();
  const session = currentSession ? sessions.get(currentSession) : blankSession();

  const state = {
    ...readExisting(),
    source: "otel-sink",
    session_id: currentSession,
    ...session,
    sessions_seen: sessions.size,
    sink_started_at: startedAt,
    sink_heartbeat_at: now,
    last_event_at: lastEventAt,
    updated_at: now,
  };

  try {
    mkdirSync(join(options.projectDir, STATE[0], STATE[1]), { recursive: true });
    writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n", "utf8");
  } catch (error) {
    // The message names the path and the errno only. Nothing from the payload
    // goes to stderr, on this path or any other.
    process.stderr.write(`otel-sink: cannot write ${statePath} (${error.code ?? "error"})\n`);
  }
  lastWriteMs = Date.now();
  pendingWrite = false;
}

/** Exports arrive every few seconds; writing on each one buys nothing. */
function scheduleWrite() {
  if (pendingWrite) return;
  const wait = Math.max(0, WRITE_THROTTLE_MS - (Date.now() - lastWriteMs));
  pendingWrite = true;
  setTimeout(writeState, wait).unref();
}

/* -- server ---------------------------------------------------------------- */

function decode(chunks, encoding) {
  const body = Buffer.concat(chunks);
  if (encoding === "gzip") return gunzipSync(body);
  if (encoding === "deflate") return inflateSync(body);
  return body;
}

function handle(pathname, payload) {
  lastEventAt = new Date().toISOString();
  if (pathname !== "/v1/logs") return;

  for (const record of logRecords(payload)) {
    const attrs = attributes(record?.attributes);
    if (eventName(record, attrs).endsWith("api_request")) {
      recordApiRequest(attrs, lastEventAt);
    }
  }
}

const server = createServer((request, response) => {
  const chunks = [];
  request.on("data", (chunk) => chunks.push(chunk));
  request.on("end", () => {
    // Always answer 200. A receiver that rejects an export makes the exporter
    // retry and back off, and a bug in the parsing below is not the session's
    // problem to absorb.
    response.writeHead(200, { "content-type": "application/json" });
    response.end("{}");

    try {
      const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
      const raw = decode(chunks, request.headers["content-encoding"]);
      handle(pathname, JSON.parse(raw.toString("utf8")));
      scheduleWrite();
    } catch {
      // A malformed export is dropped. It must not be echoed or stored.
    }
  });
});

// Loopback only. The payload carries an email address and an organization id,
// and this process has no authentication of any kind.
server.listen(port, "127.0.0.1", () => {
  if (!options.quiet) {
    process.stdout.write(
      `otel-sink: listening on http://127.0.0.1:${port}\n` +
        `otel-sink: writing ${statePath}\n`
    );
  }
  writeState();
});

server.on("error", (error) => {
  process.stderr.write(
    `otel-sink: cannot listen on 127.0.0.1:${port} (${error.code ?? "error"}).\n` +
      `Another receiver may already be running, or the port may be in use.\n`
  );
  process.exit(1);
});

// The heartbeat is the whole point of the freshness marker: it separates "the
// sink is running and the session is quiet" from "the sink is gone".
setInterval(writeState, HEARTBEAT_MS).unref();

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    // Record the stop so a reader can tell a clean shutdown from a crash. After
    // this the heartbeat stops advancing, which is what makes the gap visible.
    const state = { ...readExisting(), sink_stopped_at: new Date().toISOString() };
    try {
      writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n", "utf8");
    } catch {
      // Nothing useful left to do while exiting.
    }
    process.exit(0);
  });
}
