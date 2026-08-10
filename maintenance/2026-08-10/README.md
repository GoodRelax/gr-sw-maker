# 改善作業の現物

生きているファイルは 5 つ。`History/` は検討記録であり、**書き換えない。**

| ファイル | 何か | 行数 | 適用先 |
|---|---|---:|---|
| `00-mode-matrix.md` | 開発方式 対応表。`簡易` / `標準` / `厳格` の 1 つを決めれば、仕様書・フェーズ・エージェント・プロセス・成果物・レビューがすべて決まる。**4 ファイルのうち本書が正である** | 360 | `framework-src/{lang}/process-rules/full-auto-dev-process-rules.md` §3.1.1 |
| `01-spec-template.md` | Spec テンプレート（骨格）。そのまま `strictdoc export` が通る 11 章構成の 1 枚 | 664 | `framework-src/ja/process-rules/spec-template.md` を置換 |
| `01-spec-template-en.md` | 同上の英語版。ja と構造が完全に一致する | 664 | `framework-src/en/process-rules/spec-template.md` を置換 |
| `02-spec-writing-rules.md` | Spec 解説書。章ごとの規則・EARS・Cockburn・記入例・検査 | 1,510 | `framework-src/ja/process-rules/spec-writing-rules.md` を新設 |
| `03-glossary-state.md` | 用語集の適用状態。登録済みの新語 19 と紛らわしい対 7、**非採用欄に置けない語 3**、**これから非採用にする語 2** | 151 | `framework-src/{lang}/process-rules/glossary.md` へ追加適用 |

## 2 つの柱の関係

`00` はプロセスを決める。`01` と `02` は仕様書の書き方を決める。両者は独立しており、どちらから着手してもよい。

```mermaid
flowchart LR
    MODE["00_mode-matrix<br/>開発方式"] -->|"仕様形式を選ぶ"| FORM["ANMS_ANPS-part_ANPS-chapter"]
    FORM -->|"どの形式でも同じ骨格"| TPL["01_spec-template<br/>骨格"]
    TPL -->|"書き方を引く"| RULE["02_spec-writing-rules<br/>解説書"]
```

## 前提

- 文法と検出クエリは `tools/spec-query/` にある（`spec.sgra` / `spec-anms.sgra` / `checks.jq`）。**仕様形式を決めた時点で仕様書のフォルダへ複製する**
- `01` は整形の不動点である。Prettier をかけても差分が出ない
- `History/` 配下の文書に書かれた `maintenance/2026-08-XX/...` というパスは移動前のものである
- 適用先はいずれも `framework-src/{lang}/` である。リポジトリ直下の `process-rules/` と `.claude/` は `setup.js` の配置物で `.gitignore` の対象であり、正本ではない
