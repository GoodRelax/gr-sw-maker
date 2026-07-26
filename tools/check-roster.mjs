#!/usr/bin/env node
// check-roster - the agent list must describe the agents that actually exist,
// and every review perspective that is defined must be required somewhere.
//
// Usage: node tools/check-roster.mjs
//
// An agent's identity comes from the `name:` field in its frontmatter, not from
// its filename, so a rename that touches only one of the two produces an agent
// that is silently unreachable. The model column is checked for the same reason:
// a model reassignment recorded in the roster but not in the definition changes
// nothing at runtime.

import { join } from "node:path";
import { existsSync } from "node:fs";
import { SRC, languages, markdownFiles, read, finish } from "./lib/framework.mjs";

const problems = [];
let checkedAgents = 0;

/** Rows of the "1. Agent List" table: | 7 | review-agent | ... | opus | ... | */
function rosterRows(text) {
  const rows = [];
  for (const line of text.split("\n")) {
    const cells = line.split("|").map((cell) => cell.trim());
    // ["", "7", "review-agent", role, "opus", phases, ""]
    if (cells.length >= 7 && /^\d+$/.test(cells[1]) && /^[a-z][a-z0-9-]*$/.test(cells[2])) {
      rows.push({ number: Number(cells[1]), name: cells[2], model: cells[4] });
    }
  }
  return rows;
}

function frontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split("\n")) {
    const field = /^([a-z_]+):\s*(.*)$/.exec(line);
    if (field) fields[field[1]] = field[2].trim();
  }
  return fields;
}

for (const lang of languages()) {
  const agentsDir = join(SRC, lang, "agents");
  const rosterPath = join(SRC, lang, "process-rules", "agent-list.md");
  if (!existsSync(agentsDir) || !existsSync(rosterPath)) {
    problems.push(`${lang}: agents/ or process-rules/agent-list.md is missing`);
    continue;
  }

  const roster = rosterRows(read(rosterPath));
  const files = markdownFiles(agentsDir).filter((file) => !file.includes("/"));
  const fileNames = files.map((file) => file.replace(/\.md$/, ""));

  if (roster.length !== files.length) {
    problems.push(
      `${lang}: agent-list section 1 has ${roster.length} rows but agents/ has ${files.length} files`
    );
  }

  const expectedNumbers = roster.map((_, index) => index + 1).join(",");
  if (roster.map((row) => row.number).join(",") !== expectedNumbers) {
    problems.push(`${lang}: agent-list section 1 numbering is not 1..${roster.length}`);
  }

  const listed = new Map(roster.map((row) => [row.name, row]));
  for (const name of fileNames) {
    if (!listed.has(name)) problems.push(`${lang}: ${name}.md is not listed in agent-list section 1`);
  }
  for (const row of roster) {
    if (!fileNames.includes(row.name)) {
      problems.push(`${lang}: agent-list lists ${row.name}, but agents/${row.name}.md does not exist`);
    }
  }

  for (const file of files) {
    checkedAgents++;
    const base = file.replace(/\.md$/, "");
    const fields = frontmatter(read(join(agentsDir, file)));
    if (!fields) {
      problems.push(`${lang}: agents/${file} has no YAML frontmatter`);
      continue;
    }
    if (fields.name !== base) {
      problems.push(`${lang}: agents/${file} declares name: ${fields.name ?? "(none)"}`);
    }
    const row = listed.get(base);
    if (row && fields.model !== row.model) {
      problems.push(
        `${lang}: ${base} is model: ${fields.model ?? "(none)"} but agent-list says ${row.model}`
      );
    }
  }

  // -- Review perspective wiring ------------------------------------------
  // review-standards defines the perspectives; review-agent applies them. A
  // perspective defined but never applied is a MUST nobody executes, which is
  // exactly how R7 sat unused between its definition and its wiring.
  const standardsPath = join(SRC, lang, "process-rules", "review-standards.md");
  const reviewAgentPath = join(agentsDir, "review-agent.md");
  if (!existsSync(standardsPath) || !existsSync(reviewAgentPath)) {
    problems.push(`${lang}: review-standards.md or agents/review-agent.md is missing`);
    continue;
  }

  const defined = new Set(
    [...read(standardsPath).matchAll(/^## R(\d+):/gm)].map((match) => match[1])
  );
  const applied = new Set(
    [...read(reviewAgentPath).matchAll(/\bR(\d+)\b/g)].map((match) => match[1])
  );
  for (const id of defined) {
    if (!applied.has(id)) problems.push(`${lang}: review-standards defines R${id}, review-agent never applies it`);
  }
  for (const id of applied) {
    if (!defined.has(id)) problems.push(`${lang}: review-agent applies R${id}, review-standards does not define it`);
  }
}

// -- Perspective sets that must not omit R7 --------------------------------
// R7 applies to Ch3-4 and to code, so any design-level or implementation-level
// perspective set has to include it. These sets are written out in gate
// conditions, routing tables and phase transitions across many documents, and
// a grep for the old "R1-R6" range does not see them.
const staleSet = /R2\/R3\/R4\/R5(?!\/R7)|R2\/R4\/R5(?!\/R7)|R3\/R5(?!\/R7)|R2,R4,R5(?!,R7)|R1-R6|R1〜R6/;
for (const lang of languages()) {
  for (const file of markdownFiles(join(SRC, lang))) {
    const lines = read(join(SRC, lang, file)).split("\n");
    lines.forEach((line, index) => {
      const match = staleSet.exec(line);
      if (match) problems.push(`${lang}/${file}:${index + 1}: perspective set omits R7: ${match[0]}`);
    });
  }
}

finish("check-roster", problems, `${checkedAgents} agent definition(s)`);
