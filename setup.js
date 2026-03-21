#!/usr/bin/env node
// gr-sw-maker setup script
// Usage: node setup.js [lang]
//
// File conventions:
//   Source files use language suffixes (*-ja.md, *-en.md) — these are git tracked.
//   This script copies the selected language to suffix-less files (e.g. CLAUDE-ja.md -> CLAUDE.md).
//   Suffix-less copies are in .gitignore and must not be committed to the framework repo.
//   Exception: README.md is tracked directly (required by GitHub).
//
// Targets: .claude/agents/, .claude/commands/, process-rules/, and rootFiles below.

const fs = require("fs");
const path = require("path");
const readline = require("readline");

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

async function main() {
  let langCode = process.argv[2];
  let showPortingGuide = null;

  if (!langCode) {
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
      case "1": langCode = "en"; break;
      case "2": langCode = "ja"; break;
      case "3":
        console.log("");
        console.log("For other languages:");
        console.log("  1. Run /translate-framework en <lang-code> to translate");
        console.log("  2. Then run: node setup.js <lang-code>");
        process.exit(0);
      case "4": langCode = "en"; showPortingGuide = "en"; break;
      case "5": langCode = "ja"; showPortingGuide = "ja"; break;
      case "6":
        console.log("");
        console.log("For other languages:");
        console.log("  1. Have your AI read process-rules/porting-guide-en.md to convert the framework");
        console.log("  2. Then translate: see README.md > Language Selection for details");
        console.log("  3. Then run: node setup.js <lang-code>");
        process.exit(0);
      default:
        console.error("Invalid selection.");
        process.exit(1);
    }
  }

  deploy(langCode, showPortingGuide);
}

function deploy(langCode, portingGuideLang) {
  const dirs = [
    path.join(".claude", "agents"),
    path.join(".claude", "commands"),
    "process-rules",
  ];

  let errors = 0;

  console.log("");
  console.log(`gr-sw-maker setup (lang: ${langCode})`);
  console.log("---");

  for (const dir of dirs) {
    const suffix = `-${langCode}.md`;
    let count = 0;

    if (!fs.existsSync(dir)) {
      console.log(`  warning: ${dir}/ not found`);
      errors++;
      continue;
    }

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(suffix)) continue;
      const base = file.slice(0, -suffix.length);
      fs.copyFileSync(path.join(dir, file), path.join(dir, `${base}.md`));
      count++;
    }

    if (count === 0) {
      console.log(`  warning: ${dir}/*${suffix} not found`);
      errors++;
    } else {
      console.log(`  ${dir}/ ... ${count} files deployed`);
    }
  }

  // Deploy root-level single files
  const rootFiles = ["user-order", "CLAUDE"];
  for (const name of rootFiles) {
    const src = `${name}-${langCode}.md`;
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, `${name}.md`);
      console.log(`  ${name}.md ... deployed`);
    } else {
      console.log(`  warning: ${src} not found`);
      errors++;
    }
  }

  console.log("---");
  if (errors > 0) {
    console.log("Done (with warnings). Check that files for the selected language exist.");
    process.exit(1);
  } else {
    if (portingGuideLang) {
      console.log("");
      console.log("IMPORTANT: You selected a non-Claude AI platform.");
      console.log(`  Have your AI read process-rules/porting-guide-${portingGuideLang}.md`);
      console.log("  to convert the framework for your AI platform.");
      console.log("");
    }
    console.log("Done! Next steps:");
    console.log("  1. Write your concept in user-order.md");
    console.log("  2. Start Claude Code (or your AI coding agent)");
    console.log("  3. Run /full-auto-dev");
  }
}

main();
