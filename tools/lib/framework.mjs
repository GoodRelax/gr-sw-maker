// Shared helpers for the framework consistency checks.
//
// These run against framework-src/, the originals. They never look at the
// setup.js output under .claude/ or process-rules/, because checking a
// generated copy cannot detect a defect in the original.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative } from "node:path";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SRC = join(ROOT, "framework-src");

/** Language codes that have an originals tree, sorted. */
export function languages() {
  if (!existsSync(SRC)) return [];
  return readdirSync(SRC, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** Every .md file under dir, as paths relative to dir, with "/" separators. */
export function markdownFiles(dir) {
  const found = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort((a, b) =>
      a.name < b.name ? -1 : 1
    )) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".md")) found.push(relative(dir, full).split("\\").join("/"));
    }
  };
  if (existsSync(dir)) walk(dir);
  return found;
}

export function read(path) {
  return readFileSync(path, "utf8");
}

/** Drop fenced code blocks so their contents are not mistaken for prose. */
export function stripFences(text) {
  return text.replace(/```[\s\S]*?```/g, "");
}

/**
 * Structural counts that a translation must preserve. Headings, table rows and
 * code fences describe the shape of the document; prose wording does not.
 */
export function structure(text) {
  const lines = text.split("\n");
  return {
    lines: lines.length,
    headings: lines.filter((line) => /^#{1,6} /.test(line)).length,
    tableRows: lines.filter((line) => line.startsWith("|")).length,
    fences: lines.filter((line) => line.startsWith("```")).length,
  };
}

/**
 * Relative link targets, anchors stripped. External URLs are skipped because
 * they are not resolvable on disk, and targets containing "{" are skipped
 * because they are placeholders such as images/{screen-name}.png.
 */
export function relativeLinks(text) {
  const targets = [];
  for (const [, target] of stripFences(text).matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const path = target.split("#")[0];
    if (!path || path.includes("{")) continue;
    targets.push(path);
  }
  return targets;
}

/** Section numbers that appear as numbered headings, e.g. "## 9.4.1 ..." -> "9.4.1". */
export function sectionNumbers(text) {
  const numbers = new Set();
  for (const line of text.split("\n")) {
    const match = /^#{1,6}\s+(\d+(?:\.\d+)*)[.\s]/.exec(line);
    if (match) numbers.add(match[1]);
  }
  return numbers;
}

/** Print the outcome and exit. Any problem is a failure; there are no warnings-only runs. */
export function finish(checkName, problems, summary) {
  for (const problem of problems) console.error(`  ${problem}`);
  if (problems.length > 0) {
    console.error(`${checkName}: FAIL (${problems.length} problem(s))`);
    process.exit(1);
  }
  console.log(`${checkName}: PASS${summary ? ` (${summary})` : ""}`);
}
