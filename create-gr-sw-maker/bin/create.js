#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const https = require("https");

const REPO = "GoodRelax/gr-sw-maker";
const DEFAULT_REF = "main";
const MAX_REDIRECTS = 5;
const DOWNLOAD_TIMEOUT_MS = 30000;

// Paths that exist only for framework development and must not reach a user project.
// framework-src/ is NOT in this list: setup.js deploys from it, and re-running
// setup.js to switch languages requires it to stay.
const FRAMEWORK_ONLY = [
  "package.json",
  "package-lock.json",
  "LICENSE",
  "README-ja.md",
  "create-gr-sw-maker",
  "essays",
  "maintenance",
  // Framework CI: it checks framework-src parity and the agent roster, neither
  // of which a user project is responsible for.
  ".github",
];

// tools/ cannot be removed wholesale: gate-guard and session-meter are
// registered in .claude/settings.json and run inside a user project, while the
// rest exist only to check this repository. An allowlist means a framework tool
// added later stays behind by default, which is the safe direction: a check
// script leaking into a user project is harmless noise, but a missing runtime
// script leaves settings.json pointing at a file that does not exist.
const USER_TOOLS = new Set(["gate-guard.mjs", "session-meter.mjs"]);

function usage() {
  console.error("Usage: npm init gr-sw-maker <project-name> [-- --ref <branch|tag|commit>]");
  console.error("");
  console.error("  npm init gr-sw-maker my-app");
  console.error("  npm init gr-sw-maker my-app -- --ref v0.2.0");
}

function parseArgs(argv) {
  let projectName = null;
  let ref = DEFAULT_REF;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--ref") {
      ref = argv[++i];
      if (!ref) throw new Error("--ref requires a branch, tag, or commit");
    } else if (arg.startsWith("--ref=")) {
      ref = arg.slice("--ref=".length);
      if (!ref) throw new Error("--ref requires a branch, tag, or commit");
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    } else if (projectName === null) {
      projectName = arg;
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  return { projectName, ref };
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const fail = (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    };

    const follow = (currentUrl, redirectsLeft) => {
      const request = https.get(currentUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          if (redirectsLeft === 0) {
            fail(new Error(`Too many redirects (limit ${MAX_REDIRECTS})`));
            return;
          }
          follow(new URL(res.headers.location, currentUrl).toString(), redirectsLeft - 1);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          fail(new Error(`Download failed: HTTP ${res.statusCode}`));
          return;
        }

        const file = fs.createWriteStream(dest);
        file.on("error", fail);
        res.on("error", fail);
        // Resolve on "close", not "finish": the descriptor is still open at
        // "finish", and extracting the archive while it is open fails on Windows.
        file.on("close", () => {
          if (settled) return;
          settled = true;
          resolve();
        });
        res.pipe(file);
      });

      request.on("error", fail);
      request.setTimeout(DOWNLOAD_TIMEOUT_MS, () => {
        request.destroy(
          new Error(`Download timed out after ${DOWNLOAD_TIMEOUT_MS / 1000}s`)
        );
      });
    };

    follow(url, MAX_REDIRECTS);
  });
}

function extract(targetDir, archiveName) {
  try {
    execSync(`tar -xzf ${archiveName} --strip-components=1`, {
      cwd: targetDir,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    const detail = err.stderr ? err.stderr.toString().trim() : err.message;
    throw new Error(`Extraction failed: ${detail}`);
  }
}

function removePath(targetDir, relative) {
  const full = path.join(targetDir, relative);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true });
  }
}

function pruneTools(targetDir) {
  const dir = path.join(targetDir, "tools");
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    if (USER_TOOLS.has(entry)) continue;
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
}

// Empty the tree but keep its shape: .gitkeep files mark the directories the
// framework writes into, and removing them would delete the directories too.
function cleanDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      cleanDir(full);
    } else if (entry.name !== ".gitkeep") {
      fs.unlinkSync(full);
    }
  }
}

function installUserGitignore(targetDir) {
  // The framework repo's .gitignore ignores setup.js output, which in a user
  // project ARE the working files, so the two cannot be shared. They ship as
  // separate files so that editing one can never silently break the other.
  const template = path.join(targetDir, "gitignore-user.template");
  if (!fs.existsSync(template)) {
    throw new Error("gitignore-user.template is missing from the template");
  }
  fs.copyFileSync(template, path.join(targetDir, ".gitignore"));
  fs.unlinkSync(template);
}

async function main() {
  const { projectName, ref } = parseArgs(process.argv.slice(2));

  if (!projectName) {
    usage();
    process.exit(1);
  }

  const targetDir = path.resolve(projectName);
  if (fs.existsSync(targetDir)) {
    throw new Error(`${targetDir} already exists`);
  }

  const tarballUrl = `https://github.com/${REPO}/archive/${encodeURIComponent(ref)}.tar.gz`;
  const archiveName = "_template.tar.gz";
  const tarball = path.join(targetDir, archiveName);

  fs.mkdirSync(targetDir, { recursive: true });

  try {
    console.log(`Downloading gr-sw-maker (${ref})...`);
    await download(tarballUrl, tarball);

    console.log("Extracting...");
    extract(targetDir, archiveName);
    fs.unlinkSync(tarball);

    for (const relative of FRAMEWORK_ONLY) {
      removePath(targetDir, relative);
    }
    pruneTools(targetDir);

    const recordsDir = path.join(targetDir, "project-records");
    if (fs.existsSync(recordsDir)) {
      cleanDir(recordsDir);
    }

    installUserGitignore(targetDir);

    fs.writeFileSync(
      path.join(targetDir, "README.md"),
      `# ${projectName}\n\n<!-- Write description for your application -->\n`
    );

    console.log("");
    console.log(`Done! Created ${projectName}`);
    console.log("");
    console.log("Next steps:");
    console.log(`  cd ${projectName}`);
    console.log("  node setup.js");
    console.log("");
    console.log("(npx may take a moment to finish. You can start the next steps in another terminal.)");
  } catch (err) {
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    throw err;
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
