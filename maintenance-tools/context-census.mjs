#!/usr/bin/env node
// context-census - how many lines of rule documents one launch of each agent
// puts into context, and how many it would put there if it read only the
// sections its own table names.
//
// Usage: node maintenance-tools/context-census.mjs [--lang ja] [--out PATH]
//
// Every agent definition ends with a table of the rule sections it should read.
// Nothing today can read a section on its own, so an agent that needs one reads
// the document that holds it - the whole document. This measures both numbers so
// the difference stops being an argument and becomes a figure:
//
//   full load   the whole of every rule document the agent cites
//   cited only  only the sections the table names
//   definition+ the agent definition itself plus its cited sections
//
// The tool is meant to be re-run. Nothing here is specific to the measurement it
// was first written for, and the report records the commit it was taken at so two
// runs can be told apart.
//
// A citation that resolves to nothing is a failure, not a zero. Counting it as
// zero would report the cheapest possible context for the agent whose table is
// the most broken.

import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { ROOT, SRC, markdownFiles, read } from "./lib/framework.mjs";
import { citationReader } from "./lib/citations.mjs";

const DEFAULT_OUT = "maintenance/2026-08-10/census-before.txt";

function options(argv) {
  const chosen = { lang: "ja", out: DEFAULT_OUT };
  for (let index = 0; index < argv.length; index++) {
    const flag = argv[index];
    if (flag === "--lang" || flag === "--out") {
      const given = argv[++index];
      if (given === undefined) fail(`${flag} needs a value`);
      chosen[flag.slice(2)] = given;
    } else {
      fail(`unknown option: ${flag}`);
    }
  }
  return chosen;
}

function fail(message) {
  console.error(`context-census: ${message}`);
  process.exit(1);
}

function git(...args) {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

const number = (count) => count.toLocaleString("en-US");
const percent = (part, whole) => (whole === 0 ? "-" : `${((1 - part / whole) * 100).toFixed(1)}%`);

const chosen = options(process.argv.slice(2));
let reader;
try {
  reader = citationReader(chosen.lang);
} catch (error) {
  fail(error.message);
}

/* -- Measure --------------------------------------------------------------- */

const agentsDir = join(SRC, chosen.lang, "agents");
const agentFiles = markdownFiles(agentsDir).filter((file) => !file.includes("/"));
if (agentFiles.length === 0) fail(`${chosen.lang}/agents/ holds no agent definitions`);

const problems = [];
const measured = [];

for (const file of agentFiles) {
  const name = file.replace(/\.md$/, "");
  const text = read(join(agentsDir, file));
  const definitionLines = text.split("\n").length;

  const references = reader.tableReferences(text);
  if (references === null) {
    problems.push(`${name}: no "rule sections to read" table`);
    continue;
  }

  const citations = references.flatMap((cell) => reader.cellCitations(cell));
  if (citations.length === 0) {
    problems.push(`${name}: its table names no rule section`);
    continue;
  }

  let citedLines = 0;
  for (const citation of citations) {
    const spans = reader.resolve(citation);
    if (spans === null) {
      problems.push(`${name}: ${reader.describe(citation)} resolves to no heading`);
      continue;
    }
    for (const span of spans) citedLines += span.lines;
  }

  const cited = new Set(citations.map((citation) => citation.document));
  let fullLoadLines = 0;
  for (const document of cited) fullLoadLines += reader.documentLines(document);

  measured.push({
    name,
    definitionLines,
    documents: cited.size,
    fullLoadLines,
    citedLines,
    expandedLines: definitionLines + citedLines,
  });
}

if (problems.length > 0) {
  for (const problem of problems) console.error(`  ${problem}`);
  fail(`FAIL (${problems.length} problem(s)); no report was written`);
}

measured.sort((left, right) => right.fullLoadLines - left.fullLoadLines || (left.name < right.name ? -1 : 1));

const total = measured.reduce(
  (running, agent) => ({
    definitionLines: running.definitionLines + agent.definitionLines,
    fullLoadLines: running.fullLoadLines + agent.fullLoadLines,
    citedLines: running.citedLines + agent.citedLines,
    expandedLines: running.expandedLines + agent.expandedLines,
  }),
  { definitionLines: 0, fullLoadLines: 0, citedLines: 0, expandedLines: 0 }
);

/* -- Report ---------------------------------------------------------------- */

const columns = [
  { head: "agent", width: 34, left: true, of: (agent) => agent.name },
  { head: "definition", width: 11, of: (agent) => number(agent.definitionLines) },
  { head: "docs", width: 5, of: (agent) => String(agent.documents) },
  { head: "full load", width: 11, of: (agent) => number(agent.fullLoadLines) },
  { head: "cited only", width: 11, of: (agent) => number(agent.citedLines) },
  { head: "definition+", width: 12, of: (agent) => number(agent.expandedLines) },
  { head: "reduction", width: 10, of: (agent) => percent(agent.citedLines, agent.fullLoadLines) },
];

const row = (cells) =>
  columns.map((column, index) => (column.left ? cells[index].padEnd(column.width) : cells[index].padStart(column.width))).join(" ");

const divider = "-".repeat(columns.reduce((width, column) => width + column.width + 1, -1));
const dirty = git("status", "--porcelain", "framework-src");

const report = [
  "context-census - rule document lines per agent launch",
  "",
  `measured:  ${new Date().toISOString().slice(0, 10)}`,
  `commit:    ${git("rev-parse", "HEAD") || "(not a git checkout)"}`,
  `tree:      ${dirty ? "framework-src HAS UNCOMMITTED CHANGES; the numbers below are not the commit's" : "framework-src matches the commit"}`,
  `language:  ${chosen.lang}`,
  `agents:    ${measured.length}`,
  "",
  "full load    the whole of every rule document the agent cites, which is what it",
  "             reads today, because no means of reading one section exists",
  "cited only   only the sections its \"rule sections to read\" table names",
  "definition+  the agent definition itself plus its cited sections",
  "reduction    cited only, against full load",
  "",
  row(columns.map((column) => column.head)),
  divider,
  ...measured.map((agent) => row(columns.map((column) => column.of(agent)))),
  divider,
  row([
    `total (${measured.length} agents, one launch each)`,
    number(total.definitionLines),
    "-",
    number(total.fullLoadLines),
    number(total.citedLines),
    number(total.expandedLines),
    percent(total.citedLines, total.fullLoadLines),
  ]),
  "",
].join("\n");

const outPath = join(ROOT, chosen.out);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, report, "utf8");

console.log(report);
console.log(`written to ${chosen.out}`);
