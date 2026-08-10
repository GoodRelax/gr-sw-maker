// citations - turn the "rule sections to read" table of an agent definition
// into the documents and line ranges it actually names.
//
// Every agent definition carries a table that says, per decision, which section
// of which rule document answers it. The table is prose: a label such as
// "process rules", then one or more section keys. This module reads that prose
// and resolves each key to a heading and the lines that heading owns.
//
// Four citation forms appear in the tables, and all four have to resolve, because
// a form that cannot be resolved leaves the agent no choice but to load the whole
// rule document - the cost the table exists to avoid:
//
//   section     "文書管理規則 §9.14（spec-architecture）"   -> numbered heading
//   perspective "レビュー観点規約 R2（設計原則）"            -> review perspective id
//   chapters    "仕様テンプレート Ch3-6"                     -> a range of chapters
//   heading     "CLAUDE.md「重要判断の基準」"                -> heading quoted by title
//
// check-links.mjs checks the section form only, and against a deliberately
// narrower label map, so that the labels it does not yet know stay visible as a
// finding. This module needs every label to resolve, so it carries the complete
// map. The two are expected to merge once the labels are settled.

import { join } from "node:path";
import { existsSync } from "node:fs";
import { SRC, read, headings, sectionSpan } from "./framework.mjs";

// Per language: the heading that introduces the table, and every label an agent
// may cite, mapped to the file it names relative to framework-src/{lang}/.
//
// Only ja is registered. The en definitions write their notes in round brackets
// and drop the corner brackets around quoted headings ("CLAUDE.md Coding
// Standards"), so the heading form cannot be told from surrounding prose there
// yet. Registering en before that is fixed would produce numbers that silently
// omit those citations.
export const CITATION_SOURCES = {
  ja: {
    tableHeading: "読むべき規則の節",
    labels: {
      "文書管理規則": "process-rules/full-auto-dev-document-rules.md",
      "プロセス規則": "process-rules/full-auto-dev-process-rules.md",
      "実機テスト フィードバック管理規則": "process-rules/field-issue-handling-rules.md",
      "レビュー観点規約": "process-rules/review-standards.md",
      "プロンプト構造規約": "process-rules/prompt-structure.md",
      "仕様テンプレート": "process-rules/spec-template.md",
      "defect 分類": "process-rules/defect-taxonomy.md",
      "用語集": "process-rules/glossary.md",
      "CLAUDE.md": "CLAUDE.md",
    },
  },
};

const ESCAPE = /[.*+?^${}()|[\]\\]/g;
const quote = (text) => text.replace(ESCAPE, "\\$&");

/**
 * A citation key, followed optionally by a note in full-width brackets. The note
 * is the only thing that identifies a perspective whose id is not a heading of
 * its own, so it is kept alongside the key.
 */
const CITATION_KEY =
  /§(\d+(?:\.\d+)*)|\bR(\d+(?:\.\d+)*)|\bCh(\d+)(?:-(\d+))?|「([^」]+)」/g;

/** Notes may contain a label or a key of their own; blank them, keeping offsets. */
function withoutNotes(cell) {
  return cell.replace(/（[^）]*）/g, (note) => " ".repeat(note.length));
}

/**
 * Reader for one language. Documents are read once and kept, because a rule
 * document is cited by many agents and reparsing it per citation is the bulk of
 * the work.
 */
export function citationReader(lang) {
  const source = CITATION_SOURCES[lang];
  if (!source) {
    throw new Error(
      `citations: language "${lang}" has no citation labels registered in tools/lib/citations.mjs`
    );
  }

  const documents = new Map();
  const document = (relativePath) => {
    if (!documents.has(relativePath)) {
      const path = join(SRC, lang, relativePath);
      if (!existsSync(path)) {
        throw new Error(`citations: ${lang}/${relativePath} is cited but does not exist`);
      }
      const text = read(path);
      documents.set(relativePath, {
        totalLines: text.split("\n").length,
        headingList: headings(text),
      });
    }
    return documents.get(relativePath);
  };

  const labelPattern = new RegExp(
    Object.keys(source.labels)
      .sort((left, right) => right.length - left.length)
      .map(quote)
      .join("|"),
    "g"
  );

  /** Rows of the citation table, as the text of their second column. */
  const tableReferences = (agentText) => {
    const lines = agentText.split("\n");
    const heading = new RegExp(`^#{1,6}\\s+${quote(source.tableHeading)}\\s*$`);
    const start = lines.findIndex((line) => heading.test(line));
    if (start < 0) return null;
    const rows = [];
    for (let index = start + 1; index < lines.length; index++) {
      if (/^#{1,6}\s/.test(lines[index])) break;
      if (!lines[index].startsWith("|")) continue;
      rows.push(lines[index].split("|").map((cell) => cell.trim()));
    }
    const separator = rows.findIndex((cells) => cells.every((cell) => /^[\s:-]*$/.test(cell)));
    return rows.slice(separator + 1).filter((cells) => cells.length >= 4).map((cells) => cells[2]);
  };

  /**
   * Citations in one table cell. A label opens a run that lasts until the next
   * label, so "field issue rules §7, defect taxonomy §3" reads as two documents
   * and not as one document with two sections.
   */
  const cellCitations = (cell) => {
    const masked = withoutNotes(cell);
    const runs = [];
    let open = null;
    for (const match of masked.matchAll(labelPattern)) {
      if (open) runs.push({ ...open, until: match.index });
      open = { label: match[0], from: match.index + match[0].length };
    }
    if (open) runs.push({ ...open, until: masked.length });

    const found = [];
    for (const run of runs) {
      const text = masked.slice(run.from, run.until);
      for (const match of text.matchAll(CITATION_KEY)) {
        const after = run.from + match.index + match[0].length;
        const note = /^（([^）]*)）/.exec(cell.slice(after));
        const citation = {
          label: run.label,
          document: source.labels[run.label],
          note: note ? note[1] : null,
        };
        if (match[1]) found.push({ ...citation, form: "section", key: match[1] });
        else if (match[2]) found.push({ ...citation, form: "perspective", key: match[2] });
        else if (match[3]) found.push({ ...citation, form: "chapters", key: match[3], last: match[4] ?? match[3] });
        else found.push({ ...citation, form: "heading", key: match[5] });
      }
    }
    return found;
  };

  const headingStarting = (relativePath, pattern) =>
    document(relativePath).headingList.findIndex((heading) => pattern.test(heading.title));

  const headingTitled = (relativePath, title) => {
    const list = document(relativePath).headingList;
    const exact = list.findIndex((heading) => heading.title.startsWith(title));
    return exact >= 0 ? exact : list.findIndex((heading) => heading.title.includes(title));
  };

  const spanOf = (relativePath, index) => {
    const { headingList, totalLines } = document(relativePath);
    return sectionSpan(headingList, index, totalLines);
  };

  /**
   * The line ranges a citation resolves to, or null when it resolves to nothing.
   * A chapter range resolves to one span per chapter; every other form to one.
   */
  const resolve = (citation) => {
    const path = citation.document;
    if (citation.form === "section") {
      const index = headingStarting(path, new RegExp(`^${quote(citation.key)}[.\\s]`));
      return index < 0 ? null : [spanOf(path, index)];
    }
    if (citation.form === "heading") {
      const index = headingTitled(path, citation.key);
      return index < 0 ? null : [spanOf(path, index)];
    }
    if (citation.form === "perspective") {
      // R2 is a heading of its own; R2.1 is a checklist id whose text lives in a
      // heading named by the note ("R2.1（命名）" -> "Naming（命名）").
      let index = headingStarting(path, new RegExp(`^R${quote(citation.key)}[:.\\s]`));
      if (index < 0 && citation.note) index = headingTitled(path, citation.note);
      return index < 0 ? null : [spanOf(path, index)];
    }
    if (citation.form === "chapters") {
      const spans = [];
      for (let chapter = Number(citation.key); chapter <= Number(citation.last); chapter++) {
        const index = headingStarting(path, new RegExp(`^Chapter ${chapter}[.\\s]`));
        if (index < 0) return null;
        spans.push(spanOf(path, index));
      }
      return spans;
    }
    return null;
  };

  /** How the citation reads in the definition, for error messages. */
  const describe = (citation) => {
    if (citation.form === "section") return `${citation.label} §${citation.key}`;
    if (citation.form === "perspective") return `${citation.label} R${citation.key}`;
    if (citation.form === "chapters") {
      const range = citation.key === citation.last ? citation.key : `${citation.key}-${citation.last}`;
      return `${citation.label} Ch${range}`;
    }
    return `${citation.label}「${citation.key}」`;
  };

  const documentLines = (relativePath) => document(relativePath).totalLines;

  return { tableReferences, cellCitations, resolve, describe, documentLines };
}
