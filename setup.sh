#!/usr/bin/env bash
# gr-sw-maker セットアップスクリプト
# 使い方: bash setup.sh ja    (日本語)
#         bash setup.sh en    (英語)

set -euo pipefail

LANG_CODE="${1:-}"

if [ -z "$LANG_CODE" ]; then
  echo "使い方: bash setup.sh <言語コード>"
  echo ""
  echo "  bash setup.sh ja    日本語でセットアップ"
  echo "  bash setup.sh en    英語でセットアップ"
  echo ""
  echo "他の言語は /translate-framework コマンドで翻訳後に実行してください。"
  exit 1
fi

AGENTS_DIR=".claude/agents"
COMMANDS_DIR=".claude/commands"
ERRORS=0

deploy() {
  local dir="$1"
  local count=0

  for f in "$dir"/*-"${LANG_CODE}".md; do
    [ -e "$f" ] || continue
    local base
    base=$(basename "$f" "-${LANG_CODE}.md")
    cp "$f" "$dir/${base}.md"
    count=$((count + 1))
  done

  if [ "$count" -eq 0 ]; then
    echo "  警告: ${dir}/*-${LANG_CODE}.md が見つかりません"
    ERRORS=$((ERRORS + 1))
  else
    echo "  ${dir}/ ... ${count} ファイルをデプロイ"
  fi
}

echo "gr-sw-maker セットアップ (言語: ${LANG_CODE})"
echo "---"

deploy "$AGENTS_DIR"
deploy "$COMMANDS_DIR"
deploy "process-rules"

echo "---"
if [ "$ERRORS" -gt 0 ]; then
  echo "完了（警告あり）。対象言語のファイルが存在するか確認してください。"
  exit 1
else
  echo "完了。次のステップ:"
  echo "  1. user-order.md にコンセプトを記述"
  echo "  2. /full-auto-dev で起動"
fi
