#!/usr/bin/env node
// gr-sw-maker セットアップスクリプト
// 使い方: node setup.js ja    (日本語)
//         node setup.js en    (英語)

const fs = require("fs");
const path = require("path");

const langCode = process.argv[2];

if (!langCode) {
  console.error("使い方: node setup.js <言語コード>");
  console.error("");
  console.error("  node setup.js ja    日本語でセットアップ");
  console.error("  node setup.js en    英語でセットアップ");
  console.error("");
  console.error("他の言語は /translate-framework コマンドで翻訳後に実行してください。");
  process.exit(1);
}

const dirs = [
  path.join(".claude", "agents"),
  path.join(".claude", "commands"),
  "process-rules",
];

let errors = 0;

console.log(`gr-sw-maker セットアップ (言語: ${langCode})`);
console.log("---");

for (const dir of dirs) {
  const suffix = `-${langCode}.md`;
  let count = 0;

  if (!fs.existsSync(dir)) {
    console.log(`  警告: ${dir}/ が見つかりません`);
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
    console.log(`  警告: ${dir}/*${suffix} が見つかりません`);
    errors++;
  } else {
    console.log(`  ${dir}/ ... ${count} ファイルをデプロイ`);
  }
}

console.log("---");
if (errors > 0) {
  console.log("完了（警告あり）。対象言語のファイルが存在するか確認してください。");
  process.exit(1);
} else {
  console.log("完了。次のステップ:");
  console.log("  1. user-order.md にコンセプトを記述");
  console.log("  2. /full-auto-dev で起動");
}
