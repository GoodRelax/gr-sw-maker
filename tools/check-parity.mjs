#!/usr/bin/env node
// check-parity - every language tree must have the same files with the same shape.
//
// Usage: node tools/check-parity.mjs [reference-language]   (default: ja)
//
// What it compares, and why only these:
//   file set     a document that exists in one language and not another is an
//                omission, whichever side is missing
//   line count   catches a dropped paragraph, which the counts below do not
//   headings     the section structure must survive translation
//   table rows   a missing row is a missing rule
//   code fences  an unbalanced fence renders the whole file as one code block
//   link targets prose is translated, link targets are not
//
// Word and character counts are deliberately absent: they differ by language by
// design. So are numeric tokens, which drift legitimately (en writes "OpenAPI 3.0"
// where ja does not) and would produce noise on almost every file.

import { join } from "node:path";
import {
  SRC,
  languages,
  markdownFiles,
  read,
  structure,
  relativeLinks,
  finish,
} from "./lib/framework.mjs";

const reference = process.argv[2] ?? "ja";
const langs = languages();
const problems = [];

if (!langs.includes(reference)) {
  console.error(`No originals for "${reference}" under framework-src/.`);
  process.exit(1);
}

const others = langs.filter((lang) => lang !== reference);
if (others.length === 0) {
  finish("check-parity", [], `only one language (${reference}), nothing to compare`);
}

const referenceFiles = markdownFiles(join(SRC, reference));
let compared = 0;

for (const file of referenceFiles) {
  const fences = structure(read(join(SRC, reference, file))).fences;
  if (fences % 2 !== 0) {
    problems.push(`${file}: ${reference} has ${fences} code fences, an unclosed block`);
  }
}

for (const lang of others) {
  const files = markdownFiles(join(SRC, lang));
  const here = new Set(files);
  const there = new Set(referenceFiles);

  for (const file of referenceFiles) {
    if (!here.has(file)) problems.push(`${lang}: missing ${file} (present in ${reference})`);
  }
  for (const file of files) {
    if (!there.has(file)) problems.push(`${lang}: extra ${file} (absent in ${reference})`);
  }

  for (const file of referenceFiles) {
    if (!here.has(file)) continue;
    compared++;

    const referenceText = read(join(SRC, reference, file));
    const text = read(join(SRC, lang, file));
    const a = structure(referenceText);
    const b = structure(text);

    for (const key of ["lines", "headings", "tableRows", "fences"]) {
      if (a[key] !== b[key]) {
        problems.push(`${file}: ${key} ${reference}=${a[key]} ${lang}=${b[key]}`);
      }
    }
    if (b.fences % 2 !== 0) {
      problems.push(`${file}: ${lang} has ${b.fences} code fences, an unclosed block`);
    }

    const referenceTargets = relativeLinks(referenceText).sort();
    const targets = relativeLinks(text).sort();
    if (referenceTargets.join("\n") !== targets.join("\n")) {
      const missing = referenceTargets.filter((t) => !targets.includes(t));
      const extra = targets.filter((t) => !referenceTargets.includes(t));
      problems.push(
        `${file}: link targets differ` +
          (missing.length ? ` | only in ${reference}: ${missing.join(", ")}` : "") +
          (extra.length ? ` | only in ${lang}: ${extra.join(", ")}` : "")
      );
    }
  }
}

finish(
  "check-parity",
  problems,
  `${compared} file pair(s), ${reference} vs ${others.join(", ")}`
);
