#!/usr/bin/env node
// check-links - every reference must resolve to something that exists.
//
// Usage: node maintenance-tools/check-links.mjs
//
// Two kinds of reference are checked:
//   1. relative Markdown links, which break silently when files move
//   2. "{rule document} section N" citations in the agent definitions. An agent
//      told to read a section that does not exist will read the whole rule
//      document instead, which is the context cost the citations exist to avoid.
//
// The citation labels are localised, so the map below is per language. A label
// that is not in the map is not skipped: the section number is then required to
// exist in some rule document of that language, and the unmapped label is
// reported so it can be added.

import { join, dirname, resolve } from "node:path";
import { existsSync } from "node:fs";
import {
  ROOT,
  SRC,
  languages,
  markdownFiles,
  read,
  relativeLinks,
  sectionNumbers,
  finish,
} from "./lib/framework.mjs";

// Citation label -> file under framework-src/{lang}/process-rules/.
// When adding a language, add its labels here.
const CITATION_LABELS = {
  ja: {
    "文書管理規則": "full-auto-dev-document-rules",
    "プロセス規則": "full-auto-dev-process-rules",
    "実機テスト フィードバック管理規則": "field-issue-handling-rules",
    "不具合分類": "defect-taxonomy",
    "用語集": "glossary",
    "プロンプト構造規約": "prompt-structure",
  },
  en: {
    "Document Rules": "full-auto-dev-document-rules",
    "Process Rules": "full-auto-dev-process-rules",
    "Field Issue Handling Rules": "field-issue-handling-rules",
    "Defect Taxonomy": "defect-taxonomy",
    "Glossary": "glossary",
    "Prompt Structure Convention": "prompt-structure",
  },
};

const problems = [];

/* -- 1. Relative Markdown links ------------------------------------------- */

const linkScope = ["README.md", "README-ja.md"];
for (const dir of ["framework-src", "essays"]) {
  for (const file of markdownFiles(join(ROOT, dir))) linkScope.push(`${dir}/${file}`);
}

let linksChecked = 0;
for (const file of linkScope) {
  const full = join(ROOT, file);
  if (!existsSync(full)) continue;
  for (const target of relativeLinks(read(full))) {
    linksChecked++;
    if (!existsSync(resolve(dirname(full), target))) {
      problems.push(`${file}: dead link -> ${target}`);
    }
  }
}

/* -- 2. Section citations in the agent definitions ------------------------- */

let citationsChecked = 0;
for (const lang of languages()) {
  const labels = CITATION_LABELS[lang];
  const rulesDir = join(SRC, lang, "process-rules");
  const sections = new Map();
  const sectionsOf = (name) => {
    if (!sections.has(name)) {
      const path = join(rulesDir, `${name}.md`);
      sections.set(name, existsSync(path) ? sectionNumbers(read(path)) : new Set());
    }
    return sections.get(name);
  };

  let anySection = null;
  const anySectionOf = () => {
    if (anySection === null) {
      anySection = new Set();
      for (const file of markdownFiles(rulesDir)) {
        for (const number of sectionNumbers(read(join(rulesDir, file)))) anySection.add(number);
      }
    }
    return anySection;
  };

  const known = Object.keys(labels ?? {})
    .sort((a, b) => b.length - a.length)
    .map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  // "<label> §9.1, §9.4" and also a bare "§9.1" with no label before it.
  const cited = known
    ? new RegExp(`(?:(${known})\\s*)?((?:§\\d+(?:\\.\\d+)*\\s*[,、]?\\s*)+)`, "g")
    : /()((?:§\d+(?:\.\d+)*\s*[,、]?\s*)+)/g;

  for (const file of markdownFiles(join(SRC, lang, "agents"))) {
    const text = read(join(SRC, lang, "agents", file));
    for (const match of text.matchAll(cited)) {
      const label = match[1];
      const target = label ? labels[label] : null;
      for (const [, number] of match[2].matchAll(/§(\d+(?:\.\d+)*)/g)) {
        citationsChecked++;
        const pool = target ? sectionsOf(target) : anySectionOf();
        if (!pool.has(number)) {
          problems.push(
            target
              ? `${lang}/agents/${file}: ${label} §${number} does not exist`
              : `${lang}/agents/${file}: §${number} matches no section in any rule document`
          );
        }
      }
    }
  }

  if (!labels) {
    problems.push(
      `${lang}: no citation labels registered in maintenance-tools/check-links.mjs; ` +
        `section numbers were checked against every rule document instead`
    );
  }
}

finish(
  "check-links",
  problems,
  `${linksChecked} link(s), ${citationsChecked} section citation(s)`
);
