#!/usr/bin/env node
// check-mode-matrix - the work tables must refer to things that exist.
//
// Usage: node maintenance-tools/check-mode-matrix.mjs
//
// The work tables are the run path: one row is one request, and the cells
// become the request itself. A row naming an agent that was retired, a
// file_type that was never registered, or an owner that no longer matches
// produces a request that cannot be carried out -- and nothing else notices,
// because the other checks only compare documents against each other.
//
// This implements the machine-decidable subset of the checks declared in
// 00-mode-matrix.md section 11. Checks needing judgement (whether a verb is a
// verb, whether a return value is a location) stay with the reviewer.
//
// Check 8 of that section is deliberately absent: it required every step symbol
// to exist in commands/full-auto-dev.md, but that document is defined as
// holding no step symbols at all, so the check could never pass.

import { join } from "node:path";
import { existsSync } from "node:fs";
import { readdirSync } from "node:fs";
import { SRC, languages, read, finish } from "./lib/framework.mjs";

const problems = [];
let checkedRows = 0;

// Values allowed in the 依頼元 / 担当者 columns that are not in the roster,
// each for a stated reason in section 11 check 12.
const NON_ROSTER = new Set([
  "main-agent", // the session itself; has no definition file
  "利用者", // the human
  "setup.js", // a script, used only in Phase 0
  "各 file_type のオーナー", // resolved through the roster at run time
  "指摘を受けた成果物のオーナー", // same, for Fi
]);

// Outputs that are real artifacts but not file_types. The roster lists these
// explicitly as "file_type ではない生成物"; they have no Form Block by design.
const NOT_FILE_TYPES = new Set([
  "src",
  "tests",
  "infra",
  "openapi",
  "container-image",
  "settings.json",
  "agents",
  "commands",
  "process-rules",
  "CLAUDE.md",
  "全 file_type", // Fh writes whichever type it is versioning
]);

// main-agent may own only artifacts a subagent cannot reconstruct, which is
// why check 18d has exactly one exception (Document Rules section 11).
const MAIN_AGENT_OUTPUTS = new Set(["session-handoff"]);

/** Cells of a work-table row, or null if the line is not one. */
function row(line) {
  if (!line.startsWith("| `")) return null;
  const cells = line.split("|").map((cell) => cell.trim());
  if (cells.length < 10) return null;
  const step = /`([0-9A-Fa-z]+)`/.exec(cells[1]);
  if (!step) return null;
  return {
    step: step[1],
    from: cells[3],
    owner: cells[4],
    model: cells[5],
    input: cells[6],
    output: cells[7],
    returns: cells[8],
    remark: cells[9],
  };
}

/** Strip the emphasis, backticks and "x N" suffix an actor cell may carry. */
function actor(cell) {
  return cell
    .replace(/\*\*/g, "")
    .replace(/<br \/>[\s\S]*$/, "")
    .replace(/`/g, "")
    .replace(/ ×.*$/, "")
    .trim();
}

/** Outputs listed in one cell, already normalised. */
function outputs(cell) {
  return cell
    .split(/<br \/>/)
    .map((part) => part.replace(/\*\*/g, "").replace(/`/g, "").trim())
    .filter((part) => part && part !== "—");
}

/** file_type -> owner, from Document Rules section 11. */
function ownership(rules) {
  const lines = rules.split("\n");
  const registered = new Set();
  for (const line of lines) {
    const match = /^\| ([a-z][a-z0-9-]*) \| `[a-z-]+:`/.exec(line);
    if (match) registered.add(match[1]);
  }
  const owners = new Map();
  let inSection = false;
  for (const line of lines) {
    if (/^# 11\./.test(line)) inSection = true;
    else if (inSection && /^# \d+\./.test(line)) break; // section 11 ends here
    if (!inSection) continue;
    const match = /^\| ([a-z-]+) \| ([a-z][a-z0-9-]*) \|/.exec(line);
    if (match && registered.has(match[2]) && !owners.has(match[2])) {
      owners.set(match[2], match[1]);
    }
  }
  return { registered, owners };
}

/** Step symbols in the mode table (section 6), expanding "0a〜0e" ranges. */
function modeTableSteps(text) {
  const lines = text.split("\n");
  // Anchor on the section heading, not on the first mention of the table: the
  // legend and the phase-history tables also say "表 M", and starting there
  // would let their step symbols stand in for the real ones.
  const start = lines.findIndex((line) => /^## 6\. .*表 M/.test(line));
  if (start === -1) return new Set();
  const end = lines.findIndex((line, index) => index > start && /^## 7\./.test(line));
  const steps = new Set();
  for (let i = start; i < (end === -1 ? lines.length : end); i += 1) {
    if (!lines[i].startsWith("| `")) continue;
    const key = lines[i].split("|")[1].replace(/`/g, "").trim();
    const range = /^([0-9A-F])([a-z])〜([0-9A-F])([a-z])$/.exec(key);
    if (range) {
      for (let c = range[2].charCodeAt(0); c <= range[4].charCodeAt(0); c += 1) {
        steps.add(range[1] + String.fromCharCode(c));
      }
    } else if (/^[0-9A-F][a-z]$/.test(key)) {
      steps.add(key);
    }
  }
  return steps;
}

for (const lang of languages()) {
  const rulesDir = join(SRC, lang, "process-rules");
  const agentsDir = join(SRC, lang, "agents");
  if (!existsSync(rulesDir) || !existsSync(agentsDir)) continue;

  const agents = new Set(
    readdirSync(agentsDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/, ""))
  );
  const { registered, owners } = ownership(read(join(rulesDir, "full-auto-dev-document-rules.md")));

  const tables = readdirSync(rulesDir).filter((file) => file.startsWith("work-table-"));
  const workSteps = new Set();
  const requesters = new Map();

  for (const file of tables) {
    const where = `${lang}/process-rules/${file}`;
    const lines = read(join(rulesDir, file)).split("\n");

    lines.forEach((line, index) => {
      const cells = row(line);
      if (!cells) return;
      checkedRows += 1;
      const at = `${where}:${index + 1}`;
      workSteps.add(cells.step);

      // Check 12: the assignee exists.
      const assignee = actor(cells.owner);
      if (!agents.has(assignee) && !NON_ROSTER.has(assignee)) {
        problems.push(`${at}: 担当者 "${assignee}" は agents/ にも許可リストにも無い`);
      }

      // Check 16: requests come only from main-agent or the user.
      const from = actor(cells.from);
      if (from !== "main-agent" && from !== "利用者") {
        problems.push(`${at}: 依頼元 "${from}" はエージェントである。main-agent か利用者だけが依頼できる`);
      }

      // Check 14: siblings of one step share a requester.
      if (requesters.has(cells.step) && requesters.get(cells.step) !== from) {
        problems.push(`${at}: 手順 ${cells.step} の依頼元が行ごとに違う（兄弟の規則）`);
      }
      requesters.set(cells.step, from);

      // Check 19: every row returns something, unless it does the work itself.
      if (!cells.returns && from !== assignee) {
        problems.push(`${at}: 依頼元へ返す が空である`);
      }

      // Check 23: chapter numbers do not belong in the input column.
      if (/\bCh\d/.test(cells.input)) {
        problems.push(`${at}: 入力に章番号がある。観点と章の対応は review-standards が持つ`);
      }

      for (const output of outputs(cells.output)) {
        if (NOT_FILE_TYPES.has(output)) continue;

        // Check 18: the output is a registered file_type.
        if (!registered.has(output)) {
          problems.push(`${at}: 出力 "${output}" は文書管理規則 §7 に登録が無い`);
          continue;
        }

        // Check 20: outputs are files, return values are not. The comparison is
        // on whole values, not substrings: "wbs の場所" is a location, which is
        // exactly what a return value is supposed to be.
        const returned = cells.returns
          .split(/<br \/>/)
          .map((part) => part.replace(/\*\*/g, "").replace(/`/g, "").trim());
        if (returned.includes(output)) {
          problems.push(`${at}: "${output}" が 出力 と 依頼元へ返す の両方にある（成果物を返させている）`);
        }

        // Check 18d: main-agent records nothing, bar the one stated exception.
        if (assignee === "main-agent" && !MAIN_AGENT_OUTPUTS.has(output)) {
          problems.push(`${at}: main-agent の行が "${output}" を書いている`);
        }

        // Check 18c: reviewers do not fix what they review.
        if (assignee === "review-agent" && output !== "review") {
          problems.push(`${at}: review-agent の出力は review だけである（"${output}" がある）`);
        }

        // Check 18b: a non-owner writing a type must declare the transfer.
        const owner = owners.get(output);
        if (owner && owner !== assignee && !NON_ROSTER.has(assignee)) {
          if (!/オーナー|移管|一致/.test(cells.remark)) {
            problems.push(
              `${at}: "${output}" のオーナーは ${owner} だが担当者は ${assignee}。備考に移管の宣言が無い`
            );
          }
        }
      }
    });
  }

  // Check 7: the work tables and the mode table cover the same steps.
  const modeSteps = modeTableSteps(read(join(rulesDir, "development-mode.md")));
  for (const step of workSteps) {
    if (!modeSteps.has(step)) problems.push(`${lang}: 手順 ${step} が表 M に無い`);
  }
  for (const step of modeSteps) {
    if (!workSteps.has(step)) problems.push(`${lang}: 表 M の手順 ${step} が作業表に無い`);
  }
}

finish("check-mode-matrix", problems, `${checkedRows} work-table row(s)`);
