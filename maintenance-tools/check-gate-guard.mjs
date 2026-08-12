#!/usr/bin/env node
// check-gate-guard - the guard's constants must agree with the rules it enforces.
//
// Usage: node maintenance-tools/check-gate-guard.mjs
//
// gate-guard.mjs is the only mechanism in the framework that refuses work. Its
// three tables -- which paths are guarded, which perspectives each gate needs,
// which transition each gate stands at -- restate what Process Rules 9.4.1, the
// porting guide and the review Form Block already say. Nothing compared them,
// so the guard could be weakened or disabled and every check would stay green:
// emptying ALWAYS_ALLOWED lets every write through, and the CI does not notice.
//
// This reads the constants out of the source rather than importing them,
// because gate-guard exits the process on load.

import { join } from "node:path";
import { existsSync } from "node:fs";
import { ROOT, SRC, languages, read, finish } from "./lib/framework.mjs";

const problems = [];
let checkedGates = 0;

const GUARD = join(ROOT, "tools", "gate-guard.mjs");

/** The array literal assigned to `name`, as raw source. */
function constantSource(source, name) {
  const start = source.indexOf(`const ${name} = `);
  if (start === -1) return null;
  const open = source.indexOf(source[source.indexOf("=", start) + 2] === "{" ? "{" : "[", start);
  if (open === -1) return null;
  const closer = source[open] === "{" ? "}" : "]";
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === source[open]) depth += 1;
    else if (source[i] === closer) {
      depth -= 1;
      if (depth === 0) return source.slice(open, i + 1);
    }
  }
  return null;
}

/** Every "quoted string" in a fragment, in order. */
function strings(fragment) {
  return [...(fragment ?? "").matchAll(/"([^"]*)"/g)].map((match) => match[1]);
}

if (!existsSync(GUARD)) {
  problems.push("tools/gate-guard.mjs が存在しない。ゲートの強制機構そのものが無い");
  finish("check-gate-guard", problems, "");
}

const guard = read(GUARD);

// -- The guard must still be wired, and still refuse ------------------------
const settingsPath = join(ROOT, ".claude", "settings.json");
if (existsSync(settingsPath)) {
  const settings = read(settingsPath);
  if (!settings.includes("gate-guard.mjs")) {
    problems.push(".claude/settings.json が gate-guard.mjs をフックに登録していない");
  }
} else {
  problems.push(".claude/settings.json が無い。フックが 1 つも配線されない");
}

// -- The escape hatch must stay exactly as wide as the rules say -----------
// ALWAYS_ALLOWED is checked before GUARDED, so a prefix added here silently
// overrides every gate below it: adding "src/" opens GATE-DESIGN, "docs/"
// opens GATE-PLANNING. Emptying the list is harmless by comparison. The list
// is therefore compared for equality, not for containment.
const EXPECTED_ALWAYS_ALLOWED = ["project-management/", "project-records/reviews/"];

const alwaysAllowed = strings(constantSource(guard, "ALWAYS_ALLOWED"));
if (alwaysAllowed.includes("")) {
  problems.push("tools/gate-guard.mjs: ALWAYS_ALLOWED が空文字を含む。全書込みが素通しになる");
}
for (const required of EXPECTED_ALWAYS_ALLOWED) {
  if (!alwaysAllowed.includes(required)) {
    problems.push(`tools/gate-guard.mjs: ALWAYS_ALLOWED に "${required}" が無い（進行記録が書けなくなる）`);
  }
}
for (const extra of alwaysAllowed) {
  if (extra !== "" && !EXPECTED_ALWAYS_ALLOWED.includes(extra)) {
    problems.push(
      `tools/gate-guard.mjs: ALWAYS_ALLOWED に "${extra}" が増えている。GUARDED より先に評価されるため、覆うゲートを無条件に開ける`
    );
  }
}

// -- The guard must still contain the parts that make it refuse -------------
// The three constants describe what to guard; these are what actually guards.
// Replacing gatePassed with `return true`, emptying WRITE_TOOLS, or turning
// deny() into exit(0) leaves every constant intact.
const MECHANISM = [
  [/const WRITE_TOOLS = new Set\(\[[^\]]*"Write"/, "WRITE_TOOLS が Write を含まない。書込みを一切見なくなる"],
  [/process\.exit\(2\)/, "deny() が exit(2) を返さない。PreToolUse の非 2 終了は書込みを止めない"],
  [/GR_SW_MAKER_SKIP_GATE_GUARD === "1"/, "無効化フラグの判定が規定の形でない"],
  [/if \(gatePassed\(projectDir, gate\)\) allow\(\);/, "gatePassed() の結果で分岐していない"],
  [/return GATE_PERSPECTIVES\[gate\]\.every/, "gatePassed() が観点の充足を判定していない"],
];
for (const [pattern, message] of MECHANISM) {
  if (!pattern.test(guard)) problems.push(`tools/gate-guard.mjs: ${message}`);
}

const guarded = strings(constantSource(guard, "GUARDED"));
const guardedPairs = new Map();
for (let i = 0; i + 1 < guarded.length; i += 2) guardedPairs.set(guarded[i], guarded[i + 1]);

const perspectiveSource = constantSource(guard, "GATE_PERSPECTIVES") ?? "";
const transitionSource = constantSource(guard, "GATE_TRANSITIONS") ?? "";

for (const lang of languages()) {
  const rulesDir = join(SRC, lang, "process-rules");
  const processPath = join(rulesDir, "full-auto-dev-process-rules.md");
  const portingPath = join(rulesDir, "porting-guide.md");
  if (!existsSync(processPath)) continue;

  // Transition -> gate, so an extra value can be told from a wrong one. Built
  // first because the per-gate loop below consults it.
  // One transition can carry more than one gate -- GATE-PLANNING and
  // GATE-INTERVIEW both stand at planning's exit -- so this maps a transition
  // to the set of gates that legitimately claim it.
  const knownTransitions = new Map();
  for (const line of read(processPath).split("\n")) {
    const row = /^\| (GATE-[A-Z]+) \| ([a-z-]+) → ([a-z-]+) \|/.exec(line);
    if (!row) continue;
    const key = `${row[2]}->${row[3]}`;
    if (!knownTransitions.has(key)) knownTransitions.set(key, new Set());
    knownTransitions.get(key).add(row[1]);
  }

  // -- Perspectives and transitions, against the gate table in 9.4.1 --------
  for (const line of read(processPath).split("\n")) {
    const row = /^\| (GATE-[A-Z]+) \| ([a-z-]+) → ([a-z-]+) \| (.*?) \|/.exec(line);
    if (!row) continue;
    const [, gate, from, to, conditions] = row;
    checkedGates += 1;

    const declared = [...conditions.matchAll(/R(\d+)/g)].map((match) => `R${match[1]}`);
    const block = new RegExp(`"${gate}":\\s*\\[([^\\]]*)\\]`).exec(perspectiveSource);
    const trans = new RegExp(`"${gate}":\\s*\\[([^\\]]*)\\]`).exec(transitionSource);

    // A gate the guard does not know about is fine only if it guards no path.
    const guardsSomething = [...guardedPairs.values()].includes(gate);
    if (!guardsSomething) {
      if (block) problems.push(`${gate}: 守る対象が無いのに GATE_PERSPECTIVES に登録されている`);
      continue;
    }

    if (!block) {
      problems.push(`${gate}: 書込みを守っているのに GATE_PERSPECTIVES に無い`);
      continue;
    }
    const guardSet = new Set(strings(block[1]));
    for (const id of declared) {
      if (!guardSet.has(id)) {
        problems.push(
          `${gate}: §9.4.1 が ${id} を要求するが gate-guard の GATE_PERSPECTIVES に無い（ゲートが早く開く）`
        );
      }
    }
    for (const id of guardSet) {
      if (!declared.includes(id)) {
        problems.push(`${gate}: gate-guard が ${id} を要求するが §9.4.1 の条件に無い`);
      }
    }

    if (!trans) {
      problems.push(`${gate}: GATE_TRANSITIONS に無い。gate_phase による証拠の絞り込みができない`);
    } else {
      const listed = strings(trans[1]);
      if (!listed.includes(`${from}->${to}`)) {
        problems.push(
          `${gate}: §9.4.1 の遷移 "${from} → ${to}" が GATE_TRANSITIONS に無い（証拠が一致せず永久に閉じる）`
        );
      }
      // Every extra value widens what counts as this gate's evidence. Adding
      // another gate's transition undoes the scoping entirely.
      for (const value of listed) {
        if (!knownTransitions.has(value)) {
          problems.push(`${gate}: GATE_TRANSITIONS の "${value}" が §9.4.1 のどの遷移でもない`);
        } else if (!knownTransitions.get(value).has(gate)) {
          problems.push(
            `${gate}: GATE_TRANSITIONS が他ゲート（${[...knownTransitions.get(value)].join("/")}）の遷移 "${value}" を受け入れている（証拠の絞り込みが効かなくなる）`
          );
        }
      }
    }
  }

  // -- Guarded paths, against the porting guide's table ---------------------
  if (!existsSync(portingPath)) continue;
  const documented = new Map();
  for (const line of read(portingPath).split("\n")) {
    const row = /^\| ((?:`[^`]+` ?)+) \| (GATE-[A-Z]+) \|/.exec(line);
    if (!row) continue;
    for (const path of row[1].matchAll(/`([^`]+)`/g)) documented.set(path[1], row[2]);
  }
  if (documented.size === 0) continue;

  for (const [path, gate] of documented) {
    if (!guardedPairs.has(path)) {
      problems.push(`${lang}: 移植ガイドが "${path}" を ${gate} で守ると書くが GUARDED に無い`);
    } else if (guardedPairs.get(path) !== gate) {
      problems.push(
        `${lang}: "${path}" のゲートが移植ガイドは ${gate}、gate-guard は ${guardedPairs.get(path)}`
      );
    }
  }
  for (const [path, gate] of guardedPairs) {
    if (!documented.has(path)) {
      problems.push(`${lang}: gate-guard が "${path}" を ${gate} で守るが移植ガイドの表に無い`);
    }
  }
}

// Zero gates read means the table was not found, not that everything agreed.
// A single notation change in 9.4.1 -- the arrow, a space -- would otherwise
// turn every comparison above into a silent no-op and still print PASS.
if (checkedGates === 0) {
  problems.push(
    "プロセス規則 §9.4.1 のゲート条件表を 1 行も読めなかった。表の書式が変わった可能性がある（照合が全件素通りする）"
  );
}

finish("check-gate-guard", problems, `${checkedGates} gate(s)`);
