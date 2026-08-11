gr-sw-maker フレームワーク文書を $ARGUMENTS に翻訳してください。

引数の形式: `{ソース言語} {ターゲット言語}`（例: `ja fr`、`en fr`、`ja en`）

---

## 1. 翻訳対象ファイルの収集

以下の glob パターンで翻訳対象を収集する（`{src}` = ソース言語サフィックス）:

| 種別 | パス |
|------|------|
| プロセス規則 | `framework-src/{src}/process-rules/*.md` |
| エージェント定義 | `framework-src/{src}/agents/*.md` |
| カスタムコマンド | `framework-src/{src}/commands/*.md` |
| プロジェクト指示テンプレート | `framework-src/{src}/CLAUDE.md` |
| ユーザー要求テンプレート | `framework-src/{src}/user-order.md` |

**出力先は `framework-src/{target}/` であり、同一のディレクトリ構成をそのまま作る。** ファイル名は変えない（サフィックスを付けない）。

> `.claude/` 配下と `process-rules/` 直下は `setup.js` の出力であり翻訳対象ではない。生成物を翻訳しても、次回の `setup.js` 実行で上書きされる。

### 任意（論文）

| glob パターン |
|--------------|
| `essays/anms-essay-{src}.md` |
| `essays/angs-essay-{src}.md` |

---

## 2. 翻訳時に英語のまま維持する要素

以下は言語に依存しない機械的な識別子であり、翻訳してはならない（文書管理規則 §12.4 準拠）:

| 要素 | 例 | 理由 |
|------|---|------|
| YAML フロントマターのキー | `name:`, `description:`, `tools:`, `model:` | 機械パース |
| YAML `name` フィールドの値 | `project-manager`, `srs-writer` | エージェント名は英語固定 |
| file_type 名 | `spec-foundation`, `pipeline-state`, `defect` | 名前空間として機能 |
| フェーズ名 | `setup`, `planning`, `design` | enum 値 |
| S0-S6 セクション見出し | `## Activation`, `## Ownership`, `## Procedure`, `## Rules`, `## Exception` | プロンプト構造規約で規定 |
| サブセクション見出し | `### Purpose`, `### Start Conditions`, `### End Conditions`, `### In`, `### Out`, `### Work` | 同上 |
| フィールド名・名前空間プレフィックス | `type`, `impact_level` | 機械パース |
| HTML コメント（FIELD 注釈） | `<!-- FIELD: ... -->` | 機械パース |
| ソースコード識別子 | 変数名、関数名 | 国際慣習 |

---

## 3. 翻訳対象の要素

| 要素 | 例 |
|------|---|
| YAML `description` フィールドの値 | `プロジェクト全体のオーケストレーション` → ターゲット言語 |
| エージェントプロンプト本文 | 手順説明、ルール説明、例外対応 |
| テーブル内の説明列 | 役割、用途、備考 |
| Mermaid 図のラベル | ノード名、矢印ラベル（非ASCII平文可） |
| process-rules の規約説明文 | 定義、手順、注記 |
| CLAUDE.md のセクション説明・コメント | テンプレートの記入案内 |
| user-order.md の質問文 | 3問の質問と記入例 |

---

## 4. 翻訳ルール

1. 上記§2「英語のまま維持する要素」に該当する要素は翻訳しない
2. `process-rules/glossary-{src}.md` の用語定義を参照し、専門用語の翻訳を一貫させる。用語集自体も翻訳する
3. `process-rules/defect-taxonomy-{src}.md` の技術用語（error, fault, failure, defect, incident, hazard）はターゲット言語に定訳がある場合のみ翻訳し、なければ英語のまま使用する
4. Mermaid 図のラベルはターゲット言語で記述してよい。ただし特殊記号（`\`, `/`, `|`, `<`, `>`, `{`, `}`）は使用禁止
5. ファイル命名: `*-{src}.md` → `*-{target}.md`（例: `project-manager-ja.md` → `project-manager-fr.md`）
6. `CLAUDE.md` → `CLAUDE-{target}.md`、`user-order.md` → `user-order-{target}.md` として出力する

---

## 5. 実行手順

1. glob パターンで翻訳対象ファイルを収集する
2. `process-rules/glossary-{src}.md` を読み込み、用語の対訳表を作成する
3. 各ファイルを翻訳し、`*-{target}.md` として出力する
4. 品質セルフチェックを実施する（§6）
5. 原文との一致性を検証する。**検証エージェント `framework-translation-verifier` は退避中である**（`maintenance/2026-08-10/suspended/`）。en が出来た時点で一部を改修して名簿へ戻す

---

## 6. 品質セルフチェック

全ファイルの翻訳完了後、以下をチェックする:

- [ ] 英語固定要素（§2）が翻訳されていないこと
- [ ] file_type 名、エージェント名、フェーズ名が原文と同一であること
- [ ] テーブルの行数・列数が原文と一致すること
- [ ] Mermaid 図のノード数・矢印数が原文と一致すること
- [ ] 用語集の用語が全ファイルで一貫して使用されていること
- [ ] 見出し構造（h1-h4）の数と順序が原文と一致すること
- [ ] 文書内の数値（エージェント数、file_type 数、フェーズ数等）が原文と一致すること
- [ ] リンク先（`.md` ファイルへの参照）が原文と一致すること

### 不一致を発見した場合

原文と翻訳先のどちらが正しいかを自動判断しない。不一致箇所をレポートに記録し、ユーザーに確認を求めること。将来的に翻訳版側がメンテナンスの主体になる可能性があるため、ソース言語を常に正とする運用は行わない。
