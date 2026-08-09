// split-spec - produce the three layouts the framework promises (ANMS 1 file,
// ANPS-part 3 files, ANPS-chapter 15 files) from the one-file skeleton, applying
// only the transformations the framework actually names, and report every
// transformation that turned out to be required beyond a plain cut.
//
// The claim under test: "the notation is the same, only the unit of division
// changes, so no rewrite is needed - you just cut."

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const [source, outRoot, anmsGrammar, fullGrammar] = process.argv.slice(2);
if (!source || !outRoot || !anmsGrammar || !fullGrammar) {
  console.error("usage: node split-spec.mjs <skeleton.md> <out-root> <spec-anms.sgra> <spec.sgra>");
  process.exit(2);
}

const anmsName = anmsGrammar.split(/[\\/]/).pop();
const fullName = fullGrammar.split(/[\\/]/).pop();
const lines = readFileSync(source, "utf8").split(/\r?\n/);
const notes = [];

const firstChapter = lines.findIndex((l) => /^## /.test(l));
const body = lines.slice(firstChapter);

const blocks = [];
let block = null;
for (const line of body) {
  if (/^## /.test(line)) {
    const match = /^## Chapter (\d+)\./.exec(line);
    block = { number: match ? Number(match[1]) : null, heading: line, lines: [line] };
    blocks.push(block);
    continue;
  }
  block.lines.push(line);
}

const chapter = (n) => blocks.find((b) => b.number === n);
const appendix = blocks.find((b) => b.number === null);
const range = (from, to) => {
  const out = [];
  for (let n = from; n <= to; n += 1) out.push(...chapter(n).lines);
  return out;
};

/** Cut a chapter at its section headings, keeping one part per "### " heading. */
function sections(chapterBlock) {
  const parts = [];
  let current = null;
  for (const line of chapterBlock.lines) {
    if (/^### /.test(line)) {
      current = { lines: [line] };
      parts.push(current);
      continue;
    }
    if (current !== null) current.lines.push(line);
  }
  return parts;
}

/**
 * The ANPS grammar makes four fields mandatory that ANMS leaves optional. They
 * go between RESULT and EVIDENCE because field order must follow the grammar's
 * declaration order, and EVIDENCE stays a paragraph of its own so that Relations
 * has somewhere to sit.
 */
function addAnpsFields(text) {
  return text.replace(
    /(\*\*RESULT\*\*: PASS\n)\n(\*\*EVIDENCE\*\*)/g,
    "$1**EXECUTED_ON**: [UTC の ISO 8601 日時を記入する]\n" +
      "**TESTED_VERSION**: [被試験ソフトを一意に特定する commit SHA を記入する]\n" +
      "**ENVIRONMENT**: [測った環境を記入する]\n\n$2",
  );
}

function write(dir, filename, title, uid, contentLines, grammar, anps) {
  const head = ["# " + title, "", "**Grammar**: " + grammar, "**UID**: " + uid, "**Version**: 0.1", ""];
  let text = head.concat(contentLines).join("\n") + "\n";
  if (anps) text = addAnpsFields(text);
  writeFileSync(join(dir, filename), text, "utf8");
}

function prepare(name, grammarPath) {
  const dir = join(outRoot, name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  copyFileSync(grammarPath, join(dir, grammarPath.split(/[\\/]/).pop()));
  return dir;
}

// ---- ANMS: one file, nothing to do ---------------------------------------
{
  const dir = prepare("anms", anmsGrammar);
  copyFileSync(source, join(dir, "01-11-spec.md"));
}

// ---- ANPS-part: three files ----------------------------------------------
{
  const dir = prepare("anps-part", fullGrammar);
  write(dir, "01-04-requirements.md", "Requirements", "DOC-REQUIREMENTS", range(1, 4), fullName, true);
  write(dir, "05-08-design.md", "Design", "DOC-DESIGN", range(5, 8), fullName, true);
  write(dir, "09-11-test.md", "Test", "DOC-TEST", range(9, 11), fullName, true);
  write(dir, "A-appendix.md", "Appendix", "DOC-APPENDIX", appendix.lines, fullName, true);
  notes.push("ANPS-part: the template's file list names three files, but the appendix has no home in it. Emitted as A-appendix.md, so the layout is four files.");
}

// ---- ANPS-chapter: fifteen files -----------------------------------------
{
  const dir = prepare("anps-chapter", fullGrammar);
  const whole = [
    [1, "01-foundation.md", "Foundation", "DOC-FOUNDATION"],
    [2, "02-overview.md", "Overview", "DOC-OVERVIEW"],
    [3, "03-use-cases.md", "Use Cases", "DOC-USE-CASES"],
    [4, "04-requirements.md", "Requirements", "DOC-REQUIREMENTS"],
    [5, "05-design.md", "Design", "DOC-DESIGN"],
    [6, "06-software-specification.md", "Software Specification", "DOC-SOFTWARE-SPECIFICATION"],
    [7, "07-test-strategy.md", "Test Strategy", "DOC-TEST-STRATEGY"],
    [8, "08-design-principles-check.md", "Design Principles Check", "DOC-DESIGN-PRINCIPLES-CHECK"],
  ];
  for (const [n, file, title, uid] of whole) write(dir, file, title, uid, chapter(n).lines, fullName, true);

  const paired = [
    [9, "09-uc-test-cases.md", "09-uc-test-results.md", "UC Test Cases", "UC Test Results"],
    [10, "10-sws-test-cases.md", "10-sws-test-results.md", "SWS Test Cases", "SWS Test Results"],
    [11, "11-nfr-test-cases.md", "11-nfr-test-results.md", "NFR Test Cases", "NFR Test Results"],
  ];
  for (const [n, caseFile, resultFile, caseTitle, resultTitle] of paired) {
    const [cases, results] = sections(chapter(n));
    // A cut inside a chapter leaves the file starting at "### N.1", and H1 -> H3
    // is a forbidden level jump. Carrying the chapter heading into both halves is
    // the smallest repair: one duplicated line, no heading promoted.
    const carried = [chapter(n).heading, ""];
    const uid = (t) => "DOC-" + t.toUpperCase().replace(/ /g, "-");
    write(dir, caseFile, caseTitle, uid(caseTitle), carried.concat(cases.lines), fullName, true);
    write(dir, resultFile, resultTitle, uid(resultTitle), carried.concat(results.lines), fullName, true);
  }
  write(dir, "A-appendix.md", "Appendix", "DOC-APPENDIX", appendix.lines, fullName, true);
  notes.push("ANPS-chapter: the six test files are cut inside a chapter, so each must carry its chapter heading. Plus the unlisted appendix, the layout is fifteen files, not fourteen.");
}

console.log("transformations required beyond a plain cut:");
console.log("  1. every file needs its own H1 plus Grammar / UID / Version header");
console.log("  2. ANPS switches the grammar to " + fullName + ", which makes four TEST_RESULT fields mandatory");
console.log("  3. a cut inside a chapter must carry the chapter heading, or H1 -> H3 stops the export");
console.log("  4. the appendix has no file in the template's lists");
for (const note of notes) console.log("note: " + note);
