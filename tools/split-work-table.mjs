// Split the single work-table source into the files that ship to a user project.
//
// The matrix is the only source. These outputs are generated, never hand-edited:
// editing them by hand is exactly the double management the split is meant to avoid.
//
// Usage: node tools/split-work-table.mjs [--check]
//   --check  regenerate into memory and fail if any shipped file differs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const SRC = "maintenance/2026-08-10/00-mode-matrix.md";
const DEST = join("framework-src", "ja", "process-rules");
const BANNER = [
  "<!-- GENERATED FILE. Do not edit by hand. -->",
  "<!-- Source: maintenance/2026-08-10/00-mode-matrix.md -->",
  "<!-- Regenerate: node tools/split-work-table.mjs -->",
  "",
];

// heading text -> { file, title }. Sections not listed stay in development-mode.md.
const PHASES = [
  ["### 4.1 ", "work-table-0-install.md"],
  ["### 4.2 ", "work-table-1-setup.md"],
  ["### 4.3 ", "work-table-2-planning.md"],
  ["### 4.4 ", "work-table-3-dependency.md"],
  ["### 4.5 ", "work-table-4-design.md"],
  ["### 4.6 ", "work-table-5-implementation.md"],
  ["### 4.7 ", "work-table-6-test.md"],
  ["### 4.8 ", "work-table-7-delivery.md"],
  ["### 4.9 ", "work-table-8-operation.md"],
];
const COMMON = "work-table-common.md";
const MODE = "development-mode.md";

const lines = readFileSync(SRC, "utf8").split(/\r?\n/);

// --- carve the source into labelled blocks
const blocks = new Map(); // file -> string[]
const push = (file, ls) => blocks.set(file, (blocks.get(file) || []).concat(ls));

let current = MODE;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const phase = PHASES.find(([h]) => l.startsWith(h));
  if (phase) current = phase[1];
  else if (l.startsWith("## 5. ")) current = COMMON;
  else if (l.startsWith("## 6. ")) current = MODE;
  else if (l.startsWith("### 4.10 ")) current = MODE;
  else if (l.startsWith("## 4. ")) current = MODE; // the section 4 preamble is shared guidance
  push(current, [l]);
}

// --- every work-table file needs the column contract and the reading rules
const preamble = (title) =>
  BANNER.concat([
    `# ${title}`,
    "",
    "**列の意味と `入力` に使ってよい語は `development-mode.md` が持つ。本書に再掲しない。**",
    "",
    "**方式ごとの実施・免除は `development-mode.md` の表 M が引く。** 本書に方式の列は無い。",
    "",
    "**このフェーズの表だけを読む。** 前のフェーズの表を読み直してはならない —— 済んだ手順の成果物は `入力` 列が場所で指している。",
    "",
    "---",
    "",
  ]);

const TITLES = {
  [COMMON]: "作業表 —— 並行して回るもの",
  [MODE]: "開発方式と作業表の読み方",
};
for (const [h, f] of PHASES) {
  const head = lines.find((l) => l.startsWith(h)) || h;
  TITLES[f] = head.replace(/^### [0-9.]+ /, "作業表 —— ");
}

const out = new Map();
for (const [file, body] of blocks) {
  const trimmed = body.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  const head = file === MODE ? BANNER.concat([`# ${TITLES[file]}`, "", "---", ""]) : preamble(TITLES[file]);
  out.set(file, head.join("\n") + "\n" + trimmed + "\n");
}

const check = process.argv.includes("--check");
let stale = 0;
if (!check && !existsSync(DEST)) mkdirSync(DEST, { recursive: true });
for (const [file, text] of out) {
  const path = join(DEST, file);
  const old = existsSync(path) ? readFileSync(path, "utf8") : null;
  if (old === text) continue;
  if (check) {
    console.log(`  STALE ${path}`);
    stale++;
  } else writeFileSync(path, text);
}
const verb = check ? "checked" : "written";
console.log(`split-work-table: ${verb} ${out.size} file(s) into ${DEST}${check ? `, ${stale} stale` : ""}`);
process.exit(check && stale ? 1 : 0);
