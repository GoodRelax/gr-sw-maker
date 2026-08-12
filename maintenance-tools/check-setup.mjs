#!/usr/bin/env node
// check-setup - setup.js must deploy every original, stay idempotent, survive a
// language switch, and never destroy an edited user-order.md.
//
// Usage: node maintenance-tools/check-setup.mjs
//
// The run happens in a throwaway copy holding only setup.js and framework-src/,
// which is everything setup.js reads. Running it in place would overwrite the
// working CLAUDE.md and user-order.md of whoever invoked the check, so a check
// that is safe to run at any time is worth the copy.

import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ROOT, SRC, languages, finish } from "./lib/framework.mjs";

const problems = [];
const langs = languages();
const sandbox = mkdtempSync(join(tmpdir(), "gr-sw-maker-setup-"));

const names = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")).sort() : []);
const deploy = (lang, extra = []) =>
  execFileSync(process.execPath, ["setup.js", lang, ...extra], { cwd: sandbox, stdio: "pipe" });

// Where each originals directory lands after deployment.
const TARGETS = [
  ["agents", join(".claude", "agents")],
  ["commands", join(".claude", "commands")],
  ["process-rules", "process-rules"],
];

try {
  cpSync(join(ROOT, "setup.js"), join(sandbox, "setup.js"));
  cpSync(SRC, join(sandbox, "framework-src"), { recursive: true });

  for (const lang of langs) {
    deploy(lang);

    // Every original is deployed, and nothing else appears alongside it.
    for (const [kind, destination] of TARGETS) {
      const expected = names(join(SRC, lang, kind));
      const actual = names(join(sandbox, destination));
      if (expected.join(",") !== actual.join(",")) {
        const missing = expected.filter((f) => !actual.includes(f));
        const extra = actual.filter((f) => !expected.includes(f));
        problems.push(
          `${lang}: ${destination}/ does not match framework-src/${lang}/${kind}/` +
            (missing.length ? ` | missing: ${missing.join(", ")}` : "") +
            (extra.length ? ` | unexpected: ${extra.join(", ")}` : "")
        );
      }
    }
    for (const file of ["CLAUDE.md", "user-order.md"]) {
      if (!existsSync(join(sandbox, file))) problems.push(`${lang}: ${file} was not deployed`);
    }

    // A second run must land in the same place. A deploy that is not idempotent
    // makes "run setup.js again" an unsafe instruction.
    const before = TARGETS.map(([, d]) => names(join(sandbox, d)).join(",")).join("|");
    deploy(lang);
    const after = TARGETS.map(([, d]) => names(join(sandbox, d)).join(",")).join("|");
    if (before !== after) problems.push(`${lang}: a second deploy changed the result`);
  }

  // Switching language must leave nothing from the previous one behind. The
  // loop above already deployed each language in turn, so its set comparison
  // covers every switch except the one back to the first language.
  if (langs.length > 1) {
    const first = langs[0];
    deploy(first);
    for (const [kind, destination] of TARGETS) {
      const expected = names(join(SRC, first, kind));
      const actual = names(join(sandbox, destination));
      if (expected.join(",") !== actual.join(",")) {
        const residue = actual.filter((f) => !expected.includes(f));
        problems.push(
          `switching back to ${first}: ${destination}/ ` +
            (residue.length ? `keeps ${residue.join(", ")}` : "does not match the originals")
        );
      }
    }
  }

  // The stale sweep only fires when the incoming language lacks a file the
  // destination holds, or when a file from the old suffixed layout is still
  // sitting there. Every real language carries identical filenames, so without
  // a language that deliberately differs this code path is never executed and a
  // regression in it would go unnoticed.
  const probeLang = "zz";
  const probeDir = join(sandbox, "framework-src", probeLang);
  cpSync(join(sandbox, "framework-src", langs[0]), probeDir, { recursive: true });
  const dropped = names(join(probeDir, "agents"))[0];
  rmSync(join(probeDir, "agents", dropped));
  const legacy = `${dropped.replace(/\.md$/, "")}-${langs[0]}.md`;
  writeFileSync(join(sandbox, ".claude", "agents", legacy), "left over from the suffixed layout\n");

  deploy(probeLang);
  const deployed = names(join(sandbox, ".claude", "agents"));
  if (deployed.includes(dropped)) {
    problems.push(`deploying ${probeLang}, which has no ${dropped}, left the previous copy in place`);
  }
  if (deployed.includes(legacy)) {
    problems.push(`a file from the suffixed layout (${legacy}) was not cleaned up`);
  }
  rmSync(probeDir, { recursive: true, force: true });
  deploy(langs[0]);

  // An edited user-order.md is the user's own work. It may be replaced, but not
  // without leaving the edit behind in a .bak.
  const edited = "# edited by the user, must survive\n";
  writeFileSync(join(sandbox, "user-order.md"), edited);
  deploy(langs[0]);
  const backup = join(sandbox, "user-order.md.bak");
  if (!existsSync(backup)) {
    problems.push("an edited user-order.md was overwritten without a .bak");
  } else if (readFileSync(backup, "utf8") !== edited) {
    problems.push("user-order.md.bak does not hold the edit that was replaced");
  }

  // --force is the documented way to skip that backup.
  rmSync(backup, { force: true });
  writeFileSync(join(sandbox, "user-order.md"), edited);
  deploy(langs[0], ["--force"]);
  if (existsSync(backup)) problems.push("--force still wrote a .bak");
} catch (err) {
  problems.push(`setup.js failed: ${err.stderr?.toString().trim() || err.message}`);
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}

/* -- What a generated project ends up with -------------------------------- */
// .claude/settings.json is shipped, and it names the scripts Claude Code runs
// inside a user project. create.js keeps only an allowlist of tools/ and drops
// maintenance-tools/ whole, so a hook pointing at either a non-allowlisted tool
// or anything under maintenance-tools/ would leave every generated project with
// a hook whose target does not exist. Nothing at runtime would say so.
//
// Both directory names are matched, and which one matched decides the message:
// "tools/" alone would also match the tail of "maintenance-tools/" and report a
// missing tools/<name> that was never meant to be there.
const settingsPath = join(ROOT, ".claude", "settings.json");
const createPath = join(ROOT, "create-gr-sw-maker", "bin", "create.js");
if (existsSync(settingsPath) && existsSync(createPath)) {
  const allowlist = /const USER_TOOLS = new Set\(\[([^\]]*)\]\)/.exec(readFileSync(createPath, "utf8"));
  if (!allowlist) {
    problems.push("create.js no longer declares USER_TOOLS; the tools allowlist cannot be checked");
  } else {
    const shipped = new Set([...allowlist[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]));
    const settings = readFileSync(settingsPath, "utf8");
    for (const [, dir, name] of settings.matchAll(/(maintenance-tools|tools)\/([A-Za-z0-9._-]+)/g)) {
      if (dir === "maintenance-tools") {
        problems.push(
          `.claude/settings.json runs maintenance-tools/${name}, which create.js removes from a generated project`
        );
        continue;
      }
      if (!shipped.has(name)) {
        problems.push(`.claude/settings.json runs tools/${name}, which create.js does not ship`);
      }
      if (!existsSync(join(ROOT, "tools", name))) {
        problems.push(`.claude/settings.json runs tools/${name}, which does not exist`);
      }
    }
  }
} else if (!existsSync(settingsPath)) {
  problems.push(".claude/settings.json is missing; the hook and statusLine are not registered");
}

finish("check-setup", problems, `${langs.length} language(s): ${langs.join(", ")}`);
