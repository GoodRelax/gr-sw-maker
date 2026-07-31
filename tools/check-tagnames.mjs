#!/usr/bin/env node
// check-tagnames - every Form Block field name that a document mentions must be
// defined in the Fields tables of the document rules.
//
// Usage: node tools/check-tagnames.mjs
//
// Section 4.2 of the document rules teaches placement by example, and the agent
// definitions quote field names when they describe their own Out. A name that
// appears only in an example is worse than a missing one: an agent will emit it
// in good faith and no consumer will ever read the value.
//
// `namespace:field` now denotes a position in the YAML frontmatter -- the field
// nested under that namespace key -- rather than an XML-style tag. The names
// themselves did not change, so this check did not either. The Common Block has
// no namespace any more, so there is nothing prefixed to collect for it.

import { join } from "node:path";
import { existsSync } from "node:fs";
import { SRC, languages, markdownFiles, read, finish } from "./lib/framework.mjs";

const RULES = "process-rules/full-auto-dev-document-rules.md";
const problems = [];
let namesChecked = 0;

for (const lang of languages()) {
  const rulesPath = join(SRC, lang, RULES);
  if (!existsSync(rulesPath)) {
    problems.push(`${lang}: ${RULES} is missing`);
    continue;
  }
  const rules = read(rulesPath);

  // Declared: the first cell of a Fields table row.
  const declared = new Set();
  for (const [, name] of rules.matchAll(/^\|\s*([a-z][a-z0-9-]*:[a-z_][a-z0-9_]*)\s*\|/gm)) {
    declared.add(name);
  }

  // Used: any namespace:field written as inline code, anywhere in this language.
  const used = new Map();
  for (const file of markdownFiles(join(SRC, lang))) {
    const text = read(join(SRC, lang, file));
    for (const [, name] of text.matchAll(/`([a-z][a-z0-9-]*:[a-z_][a-z0-9_]*)`/g)) {
      if (!used.has(name)) used.set(name, new Set());
      used.get(name).add(file);
    }
  }

  for (const [name, files] of [...used].sort()) {
    namesChecked++;
    if (!declared.has(name)) {
      problems.push(`${lang}: ${name} is not defined in ${RULES} (used in ${[...files].sort().join(", ")})`);
    }
  }
}

finish("check-tagnames", problems, `${namesChecked} tag name reference(s)`);
