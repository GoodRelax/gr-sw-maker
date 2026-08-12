<!-- GENERATED FILE. Do not edit by hand. -->
<!-- Source: maintenance/2026-08-10/00-mode-matrix.md -->
<!-- Regenerate: node maintenance-tools/split-work-table.mjs -->

# 作業表 —— Phase 0 インストール

**列の意味と `入力` に使ってよい語は `development-mode.md` が持つ。本書に再掲しない。**

**方式ごとの実施・免除は `development-mode.md` の表 M が引く。** 本書に方式の列は無い。

**このフェーズの表だけを読む。** 前のフェーズの表を読み直してはならない —— 済んだ手順の成果物は `入力` 列が場所で指している。

---

### 4.1 Phase 0 インストール

**この段だけ依頼元が利用者である。** エージェントの名簿がまだ配置されていないため、外注先が無い。**担当者も利用者と道具だけである**。

| フェーズ | 作業 | 依頼元 | 担当者 | モデル | 入力 | 出力 | 依頼元へ返す | 備考 |
|---|---|---|---|---|---|---|---|---|
| `0a`<br />インストール<br />**新設** | gr-sw-maker を取得し、<br />主言語を選ぶ | **利用者** | **利用者** | — | — | — | — | 主言語は `setup.js` の引数になる。<br />翻訳言語は空でよい。 |
| `0b`<br />インストール<br />**新設** | `node setup.js {lang}` を実行し、<br />規則・エージェント・命令を配置する | **利用者** | `setup.js` | — | `framework-src/{lang}/` | process-rules<br />agents<br />commands<br />CLAUDE.md<br />user-order | 配置したファイルの一覧 | **道具の配布経路はまだ無い**。<br />現在の `setup.js` は `tools/` を配らない。 |
| `0c`<br />インストール<br />**新設** | `.claude/settings.json` を生成し、<br />既存の設定に併合する | **利用者** | `setup.js` | — | 既存の `.claude/settings.json` | settings.json | 併合の結果 | **丸ごと置き換えてはならない（MUST NOT）。**<br />利用者の権限設定と MCP 設定が消える。<br />配線するのはフック・statusLine・`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH: 1` である。 |
| `0d`<br />インストール<br />**新設** | 配置物を数え、<br />不足を洗い出す | **利用者** | **利用者** | — | `0b` の一覧<br />settings.json | — | 不足の一覧 | **そろっていなくても以降は黙って進む。**<br />フックも statusLine も、届いていなければ何も言わずに沈黙する。<br />**「0 件」と「動いていない」を区別できるのはここだけである。** |
| `0e`<br />インストール<br />**新設** | `user-order.md` の 3 問に答えを書く | **利用者** | **利用者** | — | user-order のひな形 | user-order | — | `1a` の入力になる。<br />**`CLAUDE.md` の中身は `1c` で埋める。ここでは触らない。** |

> **§11 の検査に例外が要る。** `利用者` と `setup.js` は `agent-list.md` §1 の名簿に無く、`settings.json` は §2 の file_type に無い。**Phase 0 の全行を検査 12 と検査 18 の対象外とする**（他の検査は Phase 0 でも効く）。
