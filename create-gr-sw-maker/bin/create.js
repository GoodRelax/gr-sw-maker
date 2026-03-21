#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const https = require("https");

const REPO = "GoodRelax/gr-sw-maker";
const BRANCH = "main";
const TARBALL_URL = `https://github.com/${REPO}/archive/refs/heads/${BRANCH}.tar.gz`;

const projectName = process.argv[2];

if (!projectName) {
  console.error("Usage: npm init gr-sw-maker <project-name>");
  console.error("");
  console.error("  npm init gr-sw-maker my-app");
  process.exit(1);
}

const targetDir = path.resolve(projectName);

if (fs.existsSync(targetDir)) {
  console.error(`Error: ${targetDir} already exists`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

console.log("Downloading gr-sw-maker...");

const tarball = path.join(targetDir, "_template.tar.gz");

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const follow = (url) => {
      https
        .get(url, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            follow(res.headers.location);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`Download failed: HTTP ${res.statusCode}`));
            return;
          }
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
        })
        .on("error", reject);
    };
    follow(url);
  });
}

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

async function main() {
  try {
    await download(TARBALL_URL, tarball);

    console.log("Extracting...");
    execSync(`tar -xzf _template.tar.gz --strip-components=1`, {
      cwd: targetDir,
      stdio: "pipe",
    });
    fs.unlinkSync(tarball);

    // Remove template's package.json (not needed in user's project)
    const templatePkg = path.join(targetDir, "package.json");
    if (fs.existsSync(templatePkg)) {
      fs.unlinkSync(templatePkg);
    }

    // Remove package-lock.json if present
    const lockFile = path.join(targetDir, "package-lock.json");
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
    }

    // Clean project-records/ — keep only .gitkeep files
    const recordsDir = path.join(targetDir, "project-records");
    if (fs.existsSync(recordsDir)) {
      cleanDir(recordsDir);
    }

    // Remove create-gr-sw-maker/ (scaffold source, not needed in user's project)
    const scaffoldDir = path.join(targetDir, "create-gr-sw-maker");
    if (fs.existsSync(scaffoldDir)) {
      fs.rmSync(scaffoldDir, { recursive: true, force: true });
    }

    console.log("");
    console.log(`Done! Created ${projectName}`);
    console.log("");
    console.log("Next steps:");
    console.log(`  cd ${projectName}`);
    console.log("  node setup.js");
    console.log("");
    console.log("(npx may take a moment to finish. You can start the next steps in another terminal.)");
  } catch (err) {
    console.error(`Error: ${err.message}`);
    // Cleanup
    if (fs.existsSync(tarball)) fs.unlinkSync(tarball);
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    process.exit(1);
  }
}

main();
