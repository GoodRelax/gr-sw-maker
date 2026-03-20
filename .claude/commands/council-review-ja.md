あなたは gr-sw-maker フレームワークの品質を横断的にレビューする諮問団（Council）の統括者です。
サブエージェントへの機械的チェックの委任と、自身の俯瞰的レビューを組み合わせて矛盾・不整合・欠落を検出してください。

---

## レビュー対象ファイル

| # | パス | 内容 |
|:-:|------|------|
| F01 | `CLAUDE.md` | プロジェクト指示テンプレート |
| F02 | `process-rules/full-auto-dev-process-rules-ja.md` | プロセス規則 |
| F03 | `process-rules/full-auto-dev-document-rules-ja.md` | 文書管理規則 |
| F04 | `process-rules/agent-list-ja.md` | エージェント一覧（Single Source of Truth） |
| F05 | `process-rules/glossary-ja.md` | 用語集 |
| F06 | `process-rules/defect-taxonomy-ja.md` | 不具合分類 |
| F07 | `process-rules/review-standards-ja.md` | レビュー基準（R1-R6） |
| F08 | `process-rules/prompt-structure-ja.md` | プロンプト構造規約（S0-S6） |
| F09 | `process-rules/spec-template-ja.md` | 仕様テンプレート |
| F10 | `process-rules/porting-guide-ja.md` | 移植ガイド |
| F11 | `.claude/agents/*-ja.md`（全18本） | エージェント定義 |
| F12 | `.claude/commands/*-ja.md` | カスタムコマンド |
| F13 | `essays/anms-essay-ja.md` | ANMS 論文（日本語） |
| F14 | `essays/anms-essay-en.md` | ANMS 論文（英語） |
| F15 | `essays/angs-essay-ja.md` | ANGS 論文（日本語） |
| F16 | `essays/angs-essay-en.md` | ANGS 論文（英語） |
| F17 | `user-order.md` | ユーザー要求テンプレート |

> **スコープ外:** `essays/research/*.md`（調査レポート）、`prompt/next-session-handoff.md`（作業メモ）

---

## Phase 0: サブエージェント委任

以下の3つのサブエージェントを **Agent tool で並列にバックグラウンド起動（run_in_background: true）** する。メイン諮問団のコンテキストを温存するため、機械的・局所的チェックを委任する。

**3つすべてを同時に起動した後、完了を待たずに Phase 1 に進むこと。**

### Sub-agent A: プロンプト品質チェッカー

**起動方法:** `Agent tool`（description: "Prompt quality check for 18 agents", run_in_background: true）

**プロンプト（以下をそのまま渡す）:**

```
gr-sw-maker フレームワークの全18エージェント定義ファイルの品質チェックを行う。
コードを書く必要はない。読み取りと分析のみ。

## 読み込むファイル

1. process-rules/agent-list-ja.md の §1（エージェント一覧テーブル）と §2（オーナーシップ全セクション）
2. process-rules/prompt-structure-ja.md（S0-S6 構造規約）
3. .claude/agents/*-ja.md 全18ファイル

## チェック項目

- [ ] C1: 全18エージェントが S0-S6 構造に準拠しているか（Activation/Ownership/Procedure/Rules/Exception の全セクション存在、順序正しい）
- [ ] C2: 各エージェントの YAML フロントマター（name, description, tools, model）が agent-list §1 テーブルと一致しているか
- [ ] C3: 全エージェントの Out テーブルの file_type が、agent-list §2 で当該エージェントの所有として登録されているか
- [ ] C4: 全エージェントの In テーブルの file_type が、提供元エージェントの Out に存在するか
- [ ] C5: Procedure の各ステップが Start Conditions → End Conditions を満たす論理的な手順になっているか
- [ ] C6: Exception テーブルが現実的な異常ケースをカバーしているか
- [ ] C7: tools フロントマターが責務と整合しているか（read-only エージェントに Write がないか等）
- [ ] C8: process-improver に Write/Edit がないこと、decree-writer に Write/Edit があることを確認
- [ ] C9: kotodama-kun チェックが必要なエージェントの Procedure に用語チェック手順が含まれているか（対象外: orchestrator, review-agent, change-manager, license-checker, framework-translation-verifier, decree-writer）

## 出力形式

各チェック項目の結果を PASS/FAIL で記録し、FAIL の場合は具体的な指摘を以下の形式で一覧化する。
全チェック PASS の場合は「ALL PASS」と返す。

| # | 重大度 | 対象エージェント | チェック項目 | 指摘内容 | 修正提案 |
|:-:|:------:|----------------|:----------:|---------|---------|

重大度定義:
- Critical: データフローの断絶、所有権の重複など実行時に誤動作する
- High: 矛盾が存在するが回避可能
- Medium: 不整合だが影響は限定的
- Low: 改善推奨
```

### Sub-agent B: 翻訳一致性チェッカー

**起動方法:** `Agent tool`（subagent_type: "framework-translation-verifier", description: "Essay translation consistency check", run_in_background: true）

**プロンプト（以下をそのまま渡す）:**

```
以下の日英ペア2組の翻訳一致性を検証する。
コードを書く必要はない。読み取りと分析のみ。

## 対象

1. essays/anms-essay-ja.md（日本語） ↔ essays/anms-essay-en.md（英語）
2. essays/angs-essay-ja.md（日本語） ↔ essays/angs-essay-en.md（英語）

## チェック項目

- [ ] C1: 見出し構造（h1-h4）が対応しているか
- [ ] C2: Mermaid 図のノード数・矢印数・構造が同一か（ラベルは言語が異なるので内容の対応を確認）
- [ ] C3: テーブルの行数・列数が一致しているか
- [ ] C4: 重要な用語（エージェント名、file_type名、フェーズ名等）が正しく翻訳されているか
- [ ] C5: 片方にしか存在しないセクション・図表がないか
- [ ] C6: 論文内で参照している数値（エージェント数、file_type数、フェーズ数等）が日英で一致しているか

## 出力形式

各ペアの結果を以下の形式で返す。全チェック PASS の場合は「ALL PASS」と返す。

| # | 重大度 | 対象ペア | チェック項目 | 指摘内容 | 修正提案 |
|:-:|:------:|---------|:----------:|---------|---------|

重大度定義:
- Critical: 構造的な欠落（セクションや図が片方にない）
- High: 数値の不一致、重要用語の誤訳
- Medium: 軽微な表現差異
- Low: 表記揺れ
```

### Sub-agent C: 用語機械スキャン

**起動方法:** `Agent tool`（description: "Terminology mechanical scan", run_in_background: true）

**プロンプト（以下をそのまま渡す）:**

```
gr-sw-maker フレームワーク全体で用語の機械的一致性をチェックする。
コードを書く必要はない。Grep/Glob/Read での検索と分析のみ。

## チェック項目

### C1: エージェント数の一致
全ファイルで「18」（エージェント数）に関する記載を検索し、異なる数値がないか確認する。
対象: CLAUDE.md, process-rules/*.md, essays/anms-essay-ja.md, essays/angs-essay-ja.md, essays/anms-essay-en.md, essays/angs-essay-en.md

### C2: file_type 名の一致
process-rules/full-auto-dev-document-rules-ja.md §7 の file_type マスターテーブルと process-rules/agent-list-ja.md §2 のオーナーシップセクションで、file_type 名が完全一致するか突合する。

### C3: フレームワーク名の使い分け
全ファイルで以下を検索する:
- "claude-code-full-auto-dev"（旧リポ名）が残っていないか → 残っていれば Critical
- "gr-sw-maker" がツール名/リポ名/パッケージ名の文脈で使われているか
- "full-auto-dev" が方法論名の文脈で使われているか
対象: 全 .md ファイル

### C4: フェーズ名の一致
process-rules/full-auto-dev-process-rules-ja.md §2 の8フェーズ名（setup, planning, dependency-selection, design, implementation, testing, delivery, operation）が process-rules/agent-list-ja.md §4 アクティベーションマップで一致しているか。

### C5: file_type 数の一致
file_type の総数（32）に関する記載が全ファイルで一致しているか検索する。

## 出力形式

| # | 重大度 | チェック項目 | 指摘内容 | 修正提案 |
|:-:|:------:|:----------:|---------|---------|

全チェック PASS の場合は「ALL PASS」と返す。

重大度定義:
- Critical: 旧リポ名の残存、file_type の欠落
- High: 数値の不一致
- Medium: 軽微な表現差異
- Low: 表記揺れ
```

---

## Phase 1: メイン諮問団レビュー

サブエージェントの完了を待たずに、以下のコアルールファイルを読み込みレビューを開始する:
**F01, F02, F03, F04, F05, F06, F07, F09, F10, F12, F17**

> F08（プロンプト構造規約）と F11（エージェント定義18本）は Sub-agent A に委任済み。
> F13-F16（論文）は Sub-agent B に委任済み。
> ただし F04 §3 データフロー図の検証で F11 の In/Out を参照する必要がある場合は、必要なエージェント定義のみ読み込むこと。

以下の4名の専門家が、俯瞰的視座からレビューを実施する。

### Expert 1: プロセス工学（Process Engineering）

**視座:** SDLC フェーズ遷移、品質ゲート、承認フローの整合性

**検証項目:**
- [ ] 8フェーズ（setup→operation）の遷移条件が F02 内で矛盾していないか
- [ ] 品質ゲート（R1-R6）の適用フェーズが F02 と F07 で一致しているか
- [ ] エスカレーション基準（リスク≧6、コスト80%、impact_level=high）が F02 と F01 で一致しているか
- [ ] 変更管理フロー（F02 §3.2）の記述が一貫しているか
- [ ] defect 状態遷移（F02 stateDiagram）が定義されているか
- [ ] ふりかえりサイクル（process-improver → orchestrator → decree-writer）の3段階フローが F02 と F04 で矛盾なく記述されているか
- [ ] 条件付きプロセス（12項目）が F01 と F02 で一致しているか

### Expert 2: エージェントアーキテクチャ（Agent Architecture）

**視座:** SRP（単一責任）、データフロー、所有権、エージェント間依存関係

**検証項目:**
- [ ] 各エージェントの file_type 所有権に重複がないか（F04 §2 の全セクション横断）
- [ ] F04 §3 データフロー図（メイン図 + DocWriter系図 + kotodama-kun図）の矢印が、対応するエージェントの In/Out と整合しているか
- [ ] F02 §1.2 全体アーキテクチャ図（グループレベル概要）が F04 §3（詳細図）と矛盾していないか
- [ ] file_type を所有しないエージェント（kotodama-kun, framework-translation-verifier, decree-writer）の入出力パターンが一貫しているか
- [ ] decree-writer の安全チェック（SR1-SR6）が F02 §3.3.3 の改善サイクルと整合しているか
- [ ] decree-writer の承認テーブル（CLAUDE.md=ユーザー, agents=orchestrator, process-rules=ユーザー）が関連ファイルで一致しているか

### Expert 3: 用語・文書構造（Terminology & Document Structure）

**視座:** 用語の文脈的整合性、Common Block / Form Block / Detail Block の構造規約遵守

**検証項目（用語）:**
- [ ] F05 用語集の重要用語が、F02/F03/F06/F07 で正しい文脈で使われているか
- [ ] F06 不具合分類の因果連鎖（error→fault→failure→defect/incident/hazard）が F05 と矛盾していないか
- [ ] F05 §4「紛らわしい対の区別」が規約ファイル群で遵守されているか（fault vs defect, failure vs incident 等）

**検証項目（文書構造）:**
- [ ] F03 §9 で定義された全 file_type の Form Block フィールドが妥当か（フィールド名・型・制約の整合性）
- [ ] F03 §7 file_type テーブルの全エントリが F04 §2 にオーナー付きで存在するか
- [ ] F03 §7.1 ワークフロー参照テーブルの owner 列が F04 §2, F03 §11 と三重に一致しているか
- [ ] F03 §12 多言語ルール（主言語=サフィックスなし）が F10 の言語選択手順と整合しているか
- [ ] decree-writer の「委任書き込み権限」注記（F03 §11）が整合しているか

### Expert 4: 図表クロスチェック（Diagram & Table Cross-check）

**視座:** コアルールファイル間の Mermaid 図・テーブルの突合

**クロスチェック対象（必須）:**

| # | 突合ペア | 検証観点 |
|:-:|---------|---------|
| X01 | F04 §3 データフロー図 ↔ F02 §1.2 全体アーキテクチャ図 | グループレベルの整合（F02は概要、F04は詳細） |
| X03 | F04 §2 オーナーシップ ↔ F03 §7.1 ワークフロー参照テーブル | file_type の owner 一致 |
| X04 | F04 §2 オーナーシップ ↔ F03 §11 オーナーシップモデル | 同上 |
| X05 | F04 §4 アクティベーションマップ ↔ F02 §2 フェーズ定義 | フェーズ名、起動エージェントの整合 |
| X06 | F04 §3 データフロー図 ↔ F11 各エージェントの In/Out | file_type の流れの整合（必要なエージェント定義のみ読み込む） |
| X08 | F05 用語集 ↔ F06 不具合分類 | 用語定義の矛盾なし |
| X09 | F02 §3.3 品質管理 ↔ F07 レビュー基準 R1-R6 | 観点・対象フェーズの整合 |
| X10 | F01 CLAUDE.md Agent Teams ↔ F04 §1 エージェント一覧 | エージェント数、名前、役割の一致 |
| X11 | F10 移植ガイド モデルマッピング ↔ F04 §1 model 列 | モデル割当の一致 |
| X16 | F02 付録A シーケンス図 ↔ F04 §3 データフロー図 | 参加者・メッセージの整合 |
| X18 | F02 §5.5 推奨構造 ↔ 実ファイル構成 | ファイル名の一致 |

**追加検証:**
- [ ] 全 Mermaid 図の構文エラーがないか（未定義ノード参照、スタイル指定の対象ミス等）
- [ ] 諮問団が必要と判断したクロスチェックペアを追加すること

---

## Phase 2: 統合判定

### 2.1 サブエージェント結果の統合

3つのサブエージェント（A: プロンプト品質, B: 翻訳一致性, C: 用語機械スキャン）の結果を受け取り、Phase 1 の指摘と統合する。

### 2.2 指摘一覧

全指摘を以下の形式で一覧化する:

| # | 重大度 | 発見者 | 対象ファイル | 指摘内容 | 修正提案 |
|:-:|:------:|--------|------------|---------|---------|
| 1 | Critical | Expert N / Sub-agent X | F0X | ... | ... |

**重大度定義:**
- **Critical**: 矛盾により実行時に誤動作する（データフローの断絶、所有権の重複等）
- **High**: 矛盾が存在するが回避可能（数値の不一致、ラベルの欠落等）
- **Medium**: 不整合だが影響は限定的（表現の揺れ、軽微な記述漏れ等）
- **Low**: 改善推奨（可読性、冗長な記述等）

### 2.3 総合判定

| 判定 | 条件 |
|------|------|
| **PASS** | Critical = 0 かつ High = 0 |
| **CONDITIONAL PASS** | Critical = 0 かつ High ≦ 3 |
| **FAIL** | Critical ≧ 1 または High ≧ 4 |

---

## 出力

レビュー結果を `project-records/reviews/council-review-{今日の日付}.md` に出力する。

出力は MCBSMD 形式（6重バッククォートで囲んだ単一 Markdown）で行う。

出力構成:
1. サブエージェント結果サマリー（A/B/C 各結果の要約）
2. メイン諮問団レビュー結果（Expert 1-4 各結果）
3. クロスチェック結果（X01-X18 各 PASS/FAIL）
4. 統合指摘一覧
5. 総合判定
