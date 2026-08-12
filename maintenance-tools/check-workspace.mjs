#!/usr/bin/env node
// Usage: node maintenance-tools/check-workspace.mjs [--clean]
//
// Reports whether the working tree is in the state a run starts from, and with
// --clean puts it back there.
//
// Two different kinds of file end up in this tree and neither belongs to a
// fresh run:
//
//   deployed  - what setup.js writes from framework-src/. It is gitignored, so
//               git status never mentions it, and it goes stale silently: this
//               repository carried 22 agent definitions while framework-src/ja
//               had 24. Copying it into a trial project would ship the old set
//               alongside the new one.
//
//   generated - what a run writes into the scaffold directories. Those start as
//               .gitkeep and nothing else. create.js empties them for a
//               generated project (cleanDir), but a manual copy never calls it,
//               so anything left here travels.
//
// Tracked files are reported and never deleted, even with --clean: a tracked
// file under project-records/ is repository content, not run output, and
// deciding between the two is not this tool's call.

import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative } from "node:path";
import { ROOT, finish, languages } from "./lib/framework.mjs";

const clean = process.argv.includes("--clean");

// setup.js DIR_TARGETS and FILE_TARGETS. Kept as literals rather than parsed
// out of setup.js: this tool has to keep working when setup.js cannot be read.
const DEPLOYED_DIRS = [join(".claude", "agents"), join(".claude", "commands"), "process-rules"];
const DEPLOYED_FILES = ["CLAUDE.md", "user-order.md"];

const problems = [];
let deployedCount = 0;
let generatedCount = 0;
let trackedCount = 0;
let editedCount = 0;
const baseLanguage = languages()[0] ?? "ja";

/** Paths git knows about, relative to ROOT, with "/" separators. */
function trackedPaths() {
  try {
    const out = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" });
    return new Set(out.split("\n").filter(Boolean));
  } catch {
    // No git, or not a repository. Treat everything as untracked and say so:
    // silently deleting tracked files is the one outcome worth preventing.
    problems.push("git ls-files failed; run without --clean and inspect by hand");
    return null;
  }
}

/** Every file under dir, as paths relative to ROOT with "/" separators. */
function filesUnder(dir) {
  const found = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else found.push(relative(ROOT, full).split("\\").join("/"));
    }
  };
  if (existsSync(dir)) walk(dir);
  return found;
}

/** Directories the framework writes into. Marked by .gitkeep, so the tree
 *  itself is the list - no second copy to fall out of date. */
function scaffoldDirs() {
  const found = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      const full = join(current, entry.name);
      if (!entry.isDirectory()) continue;
      if (existsSync(join(full, ".gitkeep"))) found.push(full);
      walk(full);
    }
  };
  walk(ROOT);
  return found;
}

const tracked = trackedPaths();

/* -- deployed: setup.js output ---------------------------------------------- */

for (const rel of DEPLOYED_DIRS) {
  const dir = join(ROOT, rel);
  if (!existsSync(dir)) continue;
  const entries = readdirSync(dir);
  if (entries.length === 0) continue;
  deployedCount += entries.length;
  problems.push(`${rel.split("\\").join("/")}/ holds ${entries.length} deployed file(s)`);
  if (clean) rmSync(dir, { recursive: true, force: true });
}

// CLAUDE.md and user-order.md are deployed, but they are also the two files a
// user edits: user-order.md carries the concept, CLAUDE.md the project
// configuration. setup.js moves an edited user-order.md aside as .bak rather
// than overwriting it. Match that care - delete only what still matches the
// original, and report the rest for a human to look at.
for (const rel of DEPLOYED_FILES) {
  const file = join(ROOT, rel);
  if (!existsSync(file)) continue;
  const source = join(ROOT, "framework-src", baseLanguage, rel);
  const pristine =
    existsSync(source) && readFileSync(file, "utf8") === readFileSync(source, "utf8");
  if (pristine) {
    deployedCount += 1;
    problems.push(`${rel} is deployed and unedited`);
    if (clean) rmSync(file, { force: true });
  } else {
    editedCount += 1;
    problems.push(`${rel} differs from framework-src/${baseLanguage}/ - edited, not removed`);
  }
}

/* -- generated: run output in the scaffold directories ---------------------- */

for (const dir of scaffoldDirs()) {
  for (const rel of filesUnder(dir)) {
    if (rel.endsWith("/.gitkeep")) continue;
    if (tracked && tracked.has(rel)) {
      trackedCount += 1;
      problems.push(`${rel} is tracked - review by hand, not removed`);
      continue;
    }
    generatedCount += 1;
    problems.push(`${rel} was written by a run`);
    if (clean) rmSync(join(ROOT, rel), { force: true });
  }
}

/* -- report ----------------------------------------------------------------- */

const summary = clean
  ? `removed ${deployedCount} deployed + ${generatedCount} generated file(s), ` +
    `left ${editedCount} edited + ${trackedCount} tracked file(s) alone`
  : `${deployedCount} deployed, ${generatedCount} generated, ` +
    `${editedCount} edited, ${trackedCount} tracked file(s)`;

if (clean) {
  // With --clean the problems were the work list, not a verdict. Re-running
  // without --clean is what tells you whether the tree is now clean.
  console.log(`check-workspace: ${summary}`);
  for (const line of problems) console.log(`  ${line}`);
  console.log("");
  console.log("Re-run without --clean to confirm, then `node setup.js <lang>` to deploy again.");
} else {
  finish("check-workspace", problems, summary);
}
