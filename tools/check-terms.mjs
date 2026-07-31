#!/usr/bin/env node
// check-terms - a term the glossary rejected must not appear in the framework.
//
// Usage: node tools/check-terms.mjs
//
// Section 1 of the glossary chooses one term out of several synonyms and records
// the ones it rejected. Nothing enforced that. A rejected term got into four
// separate phases of the trial, and in delivery the declaration of the term
// convention itself used a rejected word -- four different writers walked into
// the same structure independently, which is what a missing check looks like.
//
// The list is not maintained here. It is the "not adopted" column of the
// glossary table, so adding a term there is what arms this check, and there is
// no second list to drift from the first.
//
// What is deliberately not flagged
// --------------------------------
// The glossary itself, which has to name what it rejects, and the taxonomy that
// explains the causal chain behind those choices. Rejections with no listed
// alternative contribute nothing. Fenced code is skipped: an identifier is not
// prose, and renaming code to satisfy a glossary would be the tail wagging the
// dog.

import { join } from "node:path";
import { existsSync } from "node:fs";
import { SRC, languages, markdownFiles, read, stripFences, finish } from "./lib/framework.mjs";

const GLOSSARY = "process-rules/glossary.md";

// Files whose subject is the terminology itself. They must be able to write a
// rejected term in order to reject it: kotodama-kun's severity table cites
// "mixing bug and defect" as the mistake it looks for, and council-review asks
// whether the taxonomy and the glossary still agree.
const ALLOWED = new Set([
  GLOSSARY,
  "process-rules/defect-taxonomy.md",
  "agents/kotodama-kun.md",
  "commands/council-review.md",
]);

// Terms too common in ordinary technical English to match on their own. `state`
// is rejected in favour of `status` for a workflow position, but it is also the
// only word for a state machine, a document state and pipeline-state. A checker
// that cannot tell those apart would be turned off within a day, so it does not
// try; kotodama-kun keeps the judgement calls.
const NOT_MECHANICAL = new Set(["state"]);

const problems = [];
let termsChecked = 0;
let filesScanned = 0;

/**
 * The rejected terms of a glossary table row: column 4, comma separated.
 * Parentheticals are romaji glosses for the reader, not terms to search for.
 */
function rejectedTerms(glossary) {
  const terms = new Set();
  for (const line of glossary.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").map((cell) => cell.trim());
    // | term | english | definition | not adopted | reason |
    if (cells.length < 7) continue;
    const column = cells[4];
    // Skip the header and the separator row, whose cell is a run of dashes.
    if (!column || /^[-—:\s]*$/.test(column) || /^Not Adopted$|^非採用$/.test(column)) continue;
    for (const raw of column.split(/[,、]/)) {
      const term = raw.replace(/\([^)]*\)/g, "").replace(/`/g, "").trim();
      if (term && !/^[-—:\s]*$/.test(term) && !NOT_MECHANICAL.has(term)) terms.add(term);
    }
  }
  return [...terms].sort();
}

/** Latin terms need word boundaries; CJK has none, so match those literally. */
function occurrences(text, term) {
  const isLatin = /^[\x20-\x7E]+$/.test(term);
  const pattern = isLatin
    ? new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi")
    : new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  return [...text.matchAll(pattern)].length;
}

for (const lang of languages()) {
  const glossaryPath = join(SRC, lang, GLOSSARY);
  if (!existsSync(glossaryPath)) {
    problems.push(`${lang}: ${GLOSSARY} is missing`);
    continue;
  }

  const terms = rejectedTerms(read(glossaryPath));
  termsChecked += terms.length;

  for (const file of markdownFiles(join(SRC, lang))) {
    if (ALLOWED.has(file)) continue;
    filesScanned++;
    const text = stripFences(read(join(SRC, lang, file)));
    for (const term of terms) {
      const count = occurrences(text, term);
      if (count > 0) {
        problems.push(
          `${lang}/${file}: "${term}" is not adopted (${count} occurrence(s)); see ${GLOSSARY} section 1`
        );
      }
    }
  }
}

finish("check-terms", problems, `${termsChecked} rejected term(s) over ${filesScanned} file(s)`);
