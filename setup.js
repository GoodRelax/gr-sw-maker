#!/usr/bin/env node
// gr-sw-maker setup script
// Usage: node setup.js [lang] [--force]
//
// File conventions:
//   Originals live under framework-src/{lang}/ with no language suffix and are git tracked.
//   This script copies the selected language into the locations the tooling reads:
//
//     framework-src/{lang}/agents/        -> .claude/agents/
//     framework-src/{lang}/commands/      -> .claude/commands/
//     framework-src/{lang}/process-rules/ -> process-rules/
//     framework-src/{lang}/CLAUDE.md      -> CLAUDE.md
//     framework-src/{lang}/user-order.md  -> user-order.md
//
//   In the framework repo those copies are gitignored. In a user project they ARE
//   the working files and are committed.
//
//   CLAUDE.md and user-order.md are backed up to *.bak before being overwritten,
//   unless --force is given. Everything else is regenerated from the originals.

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const ROOT = __dirname;
const SRC_ROOT = path.join(ROOT, "framework-src");
const LANG_PATTERN = /^[a-z]{2,3}(-[A-Za-z0-9]+)?$/;
const LEGACY_SUFFIX = /^(.*)-(?:ja|en)\.md$/;

const DIR_TARGETS = [
  { kind: "agents", dest: path.join(".claude", "agents") },
  { kind: "commands", dest: path.join(".claude", "commands") },
  { kind: "process-rules", dest: "process-rules" },
];
const FILE_TARGETS = ["CLAUDE.md", "user-order.md"];

function ask(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function availableLanguages() {
  if (!fs.existsSync(SRC_ROOT)) return [];
  return fs
    .readdirSync(SRC_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function resolveSourceDir(langCode) {
  if (!LANG_PATTERN.test(langCode)) {
    throw new Error(
      `Invalid language code "${langCode}". Expected a form like "en", "ja", or "pt-BR".`
    );
  }
  const srcDir = path.join(SRC_ROOT, langCode);
  if (!fs.existsSync(srcDir)) {
    const available = availableLanguages();
    throw new Error(
      `No originals for "${langCode}" under framework-src/.` +
        (available.length ? ` Available: ${available.join(", ")}` : "")
    );
  }
  return srcDir;
}

// Every file name this target owns, across all languages. Used to decide what may
// be deleted from the destination: framework files can be cleaned up, files the
// user added themselves are left alone.
function frameworkOwnedNames(kind) {
  const names = new Set();
  for (const lang of availableLanguages()) {
    const dir = path.join(SRC_ROOT, lang, kind);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith(".md")) names.add(file);
    }
  }
  return names;
}

function deployDir(langCode, kind, destRelative) {
  const srcDir = path.join(SRC_ROOT, langCode, kind);
  const destDir = path.join(ROOT, destRelative);

  if (!fs.existsSync(srcDir)) {
    throw new Error(`Missing originals: framework-src/${langCode}/${kind}/`);
  }
  const sources = fs.readdirSync(srcDir).filter((file) => file.endsWith(".md"));
  if (sources.length === 0) {
    throw new Error(`No .md files in framework-src/${langCode}/${kind}/`);
  }

  fs.mkdirSync(destDir, { recursive: true });

  // Remove framework files that the selected language does not provide, plus
  // suffixed leftovers from the pre-framework-src layout, so switching languages
  // leaves no residue. Files the framework does not own are never touched.
  const owned = frameworkOwnedNames(kind);
  const current = new Set(sources);
  let removed = 0;
  for (const existing of fs.readdirSync(destDir)) {
    if (!existing.endsWith(".md")) continue;
    const legacy = LEGACY_SUFFIX.exec(existing);
    const isStale = owned.has(existing) && !current.has(existing);
    const isLegacy = legacy !== null && owned.has(`${legacy[1]}.md`);
    if (!isStale && !isLegacy) continue;
    fs.unlinkSync(path.join(destDir, existing));
    removed++;
  }

  for (const file of sources) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
  }
  return { copied: sources.length, removed };
}

function deployFile(langCode, name, force) {
  const srcFile = path.join(SRC_ROOT, langCode, name);
  const destFile = path.join(ROOT, name);

  if (!fs.existsSync(srcFile)) {
    throw new Error(`Missing original: framework-src/${langCode}/${name}`);
  }

  let backedUp = false;
  if (!force && fs.existsSync(destFile)) {
    const differs =
      fs.readFileSync(destFile, "utf8") !== fs.readFileSync(srcFile, "utf8");
    if (differs) {
      fs.copyFileSync(destFile, `${destFile}.bak`);
      backedUp = true;
    }
  }

  fs.copyFileSync(srcFile, destFile);
  return backedUp;
}

function deploy(langCode, force) {
  resolveSourceDir(langCode);

  console.log("");
  console.log(`gr-sw-maker setup (lang: ${langCode})`);
  console.log("---");

  for (const target of DIR_TARGETS) {
    const { copied, removed } = deployDir(langCode, target.kind, target.dest);
    const note = removed > 0 ? ` (${removed} stale file(s) removed)` : "";
    console.log(`  ${target.dest}/ ... ${copied} files deployed${note}`);
  }

  for (const name of FILE_TARGETS) {
    const backedUp = deployFile(langCode, name, force);
    const note = backedUp ? ` (previous version saved as ${name}.bak)` : "";
    console.log(`  ${name} ... deployed${note}`);
  }

  console.log("---");
}

function printTranslationGuide() {
  console.log("");
  console.log("To work in another language:");
  console.log("  1. Start Claude Code and run: /translate-framework en <lang-code>");
  console.log("     (this writes framework-src/<lang-code>/)");
  console.log("  2. Then run: node setup.js <lang-code>");
}

function printPortingGuide() {
  console.log("");
  console.log("IMPORTANT: You selected a non-Claude AI platform.");
  console.log("  Have your AI read process-rules/porting-guide.md");
  console.log("  to convert the framework for your AI platform.");
}

async function selectFromMenu() {
  console.log("");
  console.log("Select your environment:");
  console.log("");
  console.log("  Claude Code:");
  console.log("    1) en (English)");
  console.log("    2) ja (Japanese)");
  console.log("    3) Other language");
  console.log("");
  console.log("  Other AI:");
  console.log("    4) en (English)");
  console.log("    5) ja (Japanese)");
  console.log("    6) Other language");
  console.log("");

  const answer = await ask("> ");

  switch (answer) {
    case "1": return { langCode: "en", porting: false, translate: false };
    case "2": return { langCode: "ja", porting: false, translate: false };
    case "3": return { langCode: "en", porting: false, translate: true };
    case "4": return { langCode: "en", porting: true, translate: false };
    case "5": return { langCode: "ja", porting: true, translate: false };
    case "6": return { langCode: "en", porting: true, translate: true };
    default:
      throw new Error(`Invalid selection: "${answer}"`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const positional = args.filter((arg) => !arg.startsWith("--"));

  if (positional.length > 1) {
    throw new Error(`Expected at most one language code, got: ${positional.join(", ")}`);
  }

  let langCode = positional[0];
  let porting = false;
  let translate = false;

  if (!langCode) {
    ({ langCode, porting, translate } = await selectFromMenu());
    if (translate) {
      console.log("");
      console.log("Deploying the English version first, so the framework is usable now.");
    }
  }

  deploy(langCode, force);

  if (porting) printPortingGuide();
  if (translate) printTranslationGuide();

  console.log("");
  console.log("Done! Next steps:");
  console.log("  1. Write your concept in user-order.md");
  console.log("  2. Start Claude Code (or your AI coding agent)");
  console.log("  3. Run /full-auto-dev");
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
