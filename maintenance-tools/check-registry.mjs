#!/usr/bin/env node
// check-registry - a file_type must be registered in every table that describes
// it, and the counts stated in prose must match what is actually there.
//
// Usage: node maintenance-tools/check-registry.mjs
//
// A file_type is described five times: the register (section 7), the workflow
// reference (7.1), the namespace list (8), the Form Block spec (9.x) and the
// ownership model (11). Adding a type and forgetting one of the five leaves an
// agent with no way to decide what to write, and the omission is invisible --
// each table is internally consistent, so nothing contradicts anything.
//
// Counts are checked for the same reason. "38 の file_type" written in prose
// stops being true the moment a type is added, and a stale count is read as
// permission to stop looking.

import { join } from "node:path";
import { existsSync } from "node:fs";
import { SRC, languages, read, finish } from "./lib/framework.mjs";

const problems = [];
let checkedTypes = 0;

/** Section boundaries by top-level heading, e.g. "# 8. " -> "# 9. ". */
function section(lines, from, to) {
  const start = lines.findIndex((line) => line.startsWith(from));
  if (start === -1) return [];
  const end = lines.findIndex((line, index) => index > start && line.startsWith(to));
  return lines.slice(start, end === -1 ? lines.length : end);
}

for (const lang of languages()) {
  const rulesPath = join(SRC, lang, "process-rules", "full-auto-dev-document-rules.md");
  if (!existsSync(rulesPath)) continue;
  const text = read(rulesPath);
  const lines = text.split("\n");

  // Section 7: the register. Rows are "| name | `name:` | ... | Tier |".
  const registered = new Map();
  for (const line of lines) {
    const match = /^\| ([a-z][a-z0-9-]*) \| `([a-z-]+):` \|/.exec(line);
    if (!match) continue;
    if (match[1] !== match[2]) {
      problems.push(`${lang}: file_type "${match[1]}" の名前空間が "${match[2]}:" で一致しない`);
    }
    const tier = /\| (Core|Standard|Conditional) \|/.exec(line);
    registered.set(match[1], tier ? tier[1] : null);
  }
  checkedTypes += registered.size;

  // Section 7.1: the workflow reference, ending where section 8 begins.
  const workflow = new Set();
  for (const line of section(lines, "# 8. ", "# 8. ").length ? [] : []) workflow.add(line);
  const beforeEight = lines.slice(0, lines.findIndex((line) => line.startsWith("# 8. ")));
  const wfStart = beforeEight.findIndex((line) => line.includes("| file_type | commissioned_by"));
  if (wfStart !== -1) {
    for (const line of beforeEight.slice(wfStart)) {
      const match = /^\| ([a-z][a-z0-9-]*) \|/.exec(line);
      if (match && registered.has(match[1])) workflow.add(match[1]);
    }
  }

  // Section 8: the namespace list.
  const namespaces = new Set();
  for (const line of section(lines, "# 8. ", "# 9. ")) {
    const match = /^\| `([a-z-]+):`/.exec(line);
    if (match) namespaces.add(match[1]);
  }

  // Section 9: one Form Block spec per type.
  const forms = new Set(
    [...text.matchAll(/^## 9\.\d+ ([a-z-]+)（/gm)].map((match) => match[1])
  );

  // Section 11: exactly one owner per type.
  const owners = new Map();
  for (const line of section(lines, "# 11.", "# 12.")) {
    const match = /^\| ([a-z-]+) \| ([a-z][a-z0-9-]*) \|/.exec(line);
    if (match && registered.has(match[2])) {
      if (owners.has(match[2])) {
        problems.push(`${lang}: file_type "${match[2]}" のオーナーが §11 に 2 行ある`);
      }
      owners.set(match[2], match[1]);
    }
  }

  for (const type of registered.keys()) {
    if (!workflow.has(type)) problems.push(`${lang}: "${type}" が §7.1 ワークフロー参照表に無い`);
    if (!namespaces.has(type)) problems.push(`${lang}: "${type}" が §8 名前空間表に無い`);
    if (!forms.has(type)) problems.push(`${lang}: "${type}" の Form Block 定義（§9.x）が無い`);
    if (!owners.has(type)) problems.push(`${lang}: "${type}" のオーナーが §11 に無い`);
  }
  for (const type of forms) {
    if (!registered.has(type)) problems.push(`${lang}: §9.x に "${type}" があるが §7 に登録が無い`);
  }

  // Counts stated in prose, against what the register actually holds.
  const tiers = [...registered.values()];
  const measured = {
    total: registered.size,
    Core: tiers.filter((tier) => tier === "Core").length,
  };
  const declaredTotal = /(\d+) の file_type を一度に覚える/.exec(text);
  if (declaredTotal && Number(declaredTotal[1]) !== measured.total) {
    problems.push(
      `${lang}: §7 が「${declaredTotal[1]} の file_type」と書くが実測 ${measured.total} 件`
    );
  }
  const declaredCore = /\*\*Core の (\d+) 種を理解すれば/.exec(text);
  if (declaredCore && Number(declaredCore[1]) !== measured.Core) {
    problems.push(`${lang}: §7 が「Core の ${declaredCore[1]} 種」と書くが実測 ${measured.Core} 件`);
  }

  // The roster restates the same total and must not drift from it.
  const rosterPath = join(SRC, lang, "process-rules", "agent-list.md");
  if (existsSync(rosterPath)) {
    const roster = read(rosterPath);
    const restated = /\| Common Block 管理対象の file_type（文書管理規則 §7） \| (\d+) \|/.exec(roster);
    if (restated && Number(restated[1]) !== measured.total) {
      problems.push(
        `${lang}: 名簿 §5 が「${restated[1]}」と書くが文書管理規則 §7 の実測は ${measured.total} 件`
      );
    }
    const agentCount = (roster.match(/^\| \d+ \| [a-z][a-z0-9-]* \|/gm) || []).length;
    const declaredAgents = [...roster.matchAll(/名簿は現在 (\d+) 件/g)].map((m) => Number(m[1]));
    for (const declared of declaredAgents) {
      if (declared !== agentCount) {
        problems.push(`${lang}: 名簿が「現在 ${declared} 件」と書くが §1 の実測は ${agentCount} 件`);
      }
    }
  }
}

finish("check-registry", problems, `${checkedTypes} file_type(s)`);
