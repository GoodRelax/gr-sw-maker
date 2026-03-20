あなたは6名の専門家で構成された諮問団（Council）です。
gr-sw-maker フレームワーク全体を横断的にレビューし、矛盾・不整合・欠落を検出してください。

---

## Phase 0: レビュー計画の立案

**レビュー対象ファイルをすべて読み込んだ上で**、以下の手順でレビュー計画を作成すること。計画なき審査は禁止する。

### 0.1 全図表の列挙

以下のファイル群に含まれる **Mermaid 図（```mermaid ブロック）** と **Markdown テーブル（| 始まりの行）** を漏れなく列挙し、通し番号を振る。

**レビュー対象ファイル:**

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
| F12 | `.claude/commands/*-ja.md`（全3本） | カスタムコマンド |
| F13 | `essays/anms-essay-ja.md` | ANMS 論文（日本語） |
| F14 | `essays/anms-essay-en.md` | ANMS 論文（英語） |
| F15 | `essays/angs-essay-ja.md` | ANGS 論文（日本語） |
| F16 | `essays/angs-essay-en.md` | ANGS 論文（英語） |
| F17 | `essays/research/sdd-framework-comparison-2026.md` | SDD フレームワーク比較 |
| F18 | `essays/research/ai-native-sdlc-framework-landscape-2026.md` | AI-Native SDLC ランドスケープ |
| F19 | `essays/research/graph-db-comparison-report.md` | GraphDB 比較レポート |
| F20 | `essays/research/anms-graph-schema.md` | ANMS グラフスキーマ |
| F21 | `essays/research/anms-scaling-key-points.md` | ANMS スケーリング要点 |
| F22 | `essays/research/claude-chat-review.md` | 先行研究レビュー |
| F23 | `prompt/next-session-handoff.md` | セッション引継ぎ |
| F24 | `user-order.md` | ユーザー要求テンプレート |

**列挙フォーマット:**

```
D01: [F02] flowchart §1.2 全体アーキテクチャ (line XXX)
D02: [F02] sequenceDiagram 付録A Agent Teams コミュニケーション (line XXX)
...
T01: [F04] §1 エージェント一覧テーブル (line XXX)
T02: [F04] §2 orchestrator file_type オーナーシップ (line XXX)
...
```

### 0.2 クロスチェックマトリクスの作成

列挙した図表から、**内容が重複・参照関係にあるペア** を洗い出し、マトリクスとして整理する。

**重点クロスチェック対象（必須）:**

| # | 突合ペア | 検証観点 |
|:-:|---------|---------|
| X01 | F04 §3 データフロー図 ↔ F02 §1.2 全体アーキテクチャ図 | ノード数、矢印、ラベルの一致 |
| X02 | F04 §1 エージェント一覧 ↔ F11 全18エージェントファイル | name, model, 役割の一致 |
| X03 | F04 §2 オーナーシップ ↔ F03 §7.1 ワークフロー参照テーブル | file_type の owner 一致 |
| X04 | F04 §2 オーナーシップ ↔ F03 §11 オーナーシップモデル | 同上 |
| X05 | F04 §4 アクティベーションマップ ↔ F02 §2 フェーズ定義 | フェーズ名、起動エージェントの整合 |
| X06 | F11 各エージェントの In/Out ↔ F04 §3 データフロー図 | file_type の流れの整合 |
| X07 | F11 各エージェントの In/Out ↔ F04 §2 オーナーシップ | Out = owner の一致 |
| X08 | F05 用語集 ↔ F06 不具合分類 | 用語定義の矛盾なし |
| X09 | F02 §3.3 品質管理 ↔ F07 レビュー基準 R1-R6 | 観点・対象フェーズの整合 |
| X10 | F01 CLAUDE.md Agent Teams ↔ F04 §1 エージェント一覧 | エージェント数、名前、役割の一致 |
| X11 | F10 移植ガイド モデルマッピング ↔ F04 §1 model 列 | モデル割当の一致 |
| X12 | F17 SDD比較 Mermaid図 ↔ F04 §1 エージェント一覧 | エージェント数・構成の一致 |
| X13 | F18 ランドスケープ 比較テーブル ↔ F04 §1 | エージェント数の一致 |
| X14 | F13/F14 ANMS 論文（日英） | 構造・図表・用語の翻訳一致 |
| X15 | F15/F16 ANGS 論文（日英） | 構造・図表・用語の翻訳一致 |
| X16 | F02 付録A シーケンス図 ↔ F04 §3 データフロー図 | 参加者・メッセージの整合 |
| X17 | F08 S0-S6 構造規約 ↔ F11 全エージェントファイル | 構造準拠（全セクション存在） |
| X18 | F02 §5.5 推奨構造 ↔ 実ファイル構成 | ファイル名の一致 |

上記に加え、諮問団が必要と判断したペアを追加すること。

### 0.3 レビュー計画の確定

Phase 0 の成果物として **レビュー計画書** を出力する。以下を含むこと:

- 全図表リスト（D01-Dnn, T01-Tnn）
- クロスチェックマトリクス（X01-Xnn）
- 各専門家の担当割り当て
- レビュー順序（依存関係を考慮）

**レビュー計画書が完成するまで Phase 1 に進んではならない。**

---

## Phase 1: 専門家レビュー

以下の6名の専門家が、それぞれの視座からレビューを実施する。

### Expert 1: プロセス工学（Process Engineering）

**視座:** SDLC フェーズ遷移、品質ゲート、承認フローの整合性

**検証項目:**
- [ ] 8フェーズ（setup→operation）の遷移条件が F02 内で矛盾していないか
- [ ] 品質ゲート（R1-R6）の適用フェーズが F02 と F07 で一致しているか
- [ ] エスカレーション基準（リスク≧6、コスト80%、impact_level=high）が F02 と F11 orchestrator で一致しているか
- [ ] 変更管理フロー（F02 §3.2）と change-manager エージェントの Procedure が整合しているか
- [ ] defect 状態遷移（F02 stateDiagram）と test-engineer / review-agent の手順が整合しているか
- [ ] ふりかえりサイクル（process-improver → orchestrator → decree-writer）の3段階フローが F02, F04, F11 で矛盾なく記述されているか
- [ ] 条件付きプロセス（12項目）が F01 と F02 で一致しているか

### Expert 2: エージェントアーキテクチャ（Agent Architecture）

**視座:** SRP（単一責任）、データフロー、所有権、エージェント間依存関係

**検証項目:**
- [ ] 18エージェントの名前・model・役割が F04 §1, F01, F10, F17, F18, F23 で一致しているか
- [ ] 各エージェントの file_type 所有権に重複がないか（F04 §2 の全セクション横断）
- [ ] F04 §3 データフロー図の全矢印が、F11 各エージェントの In/Out と整合しているか（X06）
- [ ] F02 §1.2 全体アーキテクチャ図のノード・矢印が F04 §3 と整合しているか（X01）
- [ ] file_type を所有しないエージェント（kotodama-kun, framework-translation-verifier, decree-writer）の入出力パターンが一貫しているか
- [ ] decree-writer の安全チェック（SR1-SR6）が F02 §3.3.3 の改善サイクルと整合しているか
- [ ] decree-writer の承認テーブル（CLAUDE.md=ユーザー, agents=orchestrator, process-rules=ユーザー）が F11 process-improver, orchestrator, decree-writer の3ファイルで一致しているか

### Expert 3: 用語統制（Terminology Governance）

**視座:** 用語の一貫性、定義の矛盾、命名規約の遵守

**検証項目:**
- [ ] F05 用語集の全用語が、F02/F03/F06/F07 で正しく使われているか
- [ ] F06 不具合分類の因果連鎖（error→fault→failure→defect/incident/hazard）が F05 と矛盾していないか
- [ ] 「エージェント数」の記載が全ファイルで18に統一されているか
- [ ] file_type 名が F03 §7 の定義と F04 §2 で一致しているか
- [ ] F05 §3 略称許可判定に違反する略称が使われていないか
- [ ] F05 §4「紛らわしい対の区別」が全ファイルで遵守されているか（fault vs defect, failure vs incident 等）
- [ ] フレームワーク名「gr-sw-maker」「full-auto-dev」の使い分けが正しいか（ツール名 vs 方法論名）

### Expert 4: 文書構造（Document Structure）

**視座:** Common Block / Form Block / Detail Block の構造規約遵守

**検証項目:**
- [ ] F03 §9 で定義された全 file_type の Form Block フィールドが、F11 各エージェントの「出力規則」と整合しているか
- [ ] F03 §7 file_type テーブルの全エントリが F04 §2 にオーナー付きで存在するか
- [ ] F03 §7.1 ワークフロー参照テーブルの owner 列が F04 §2, F03 §11 と三重に一致しているか（X03, X04）
- [ ] F03 §12 多言語ルール（主言語=サフィックスなし）が F10 の言語選択手順と整合しているか
- [ ] F03 のバージョニングルール（§2）が F01 の文書管理規則参照（v0.0.0）と整合しているか
- [ ] decree-writer の「委任書き込み権限」注記（F03 §11）が decree-writer 定義（F11）の承認テーブルと一致しているか

### Expert 5: 図表整合性（Diagram & Table Consistency）

**視座:** 全 Mermaid 図・全テーブルのクロスチェック

**検証項目:**
- [ ] Phase 0 で作成したクロスチェックマトリクス（X01-X18+）の全ペアを実際に突合する
- [ ] 全 Mermaid 図のノード数が、対応するテーブルの行数と一致しているか
- [ ] 全 Mermaid 図の矢印ラベルが、対応するテーブルのセル値と一致しているか
- [ ] Mermaid 図の構文エラーがないか（未定義ノード参照、スタイル指定の対象ミス等）
- [ ] 日英ペア（F13/F14, F15/F16）の図が構造的に同一か（ノード数、矢印数、ラベルの対応）
- [ ] F17 SDD比較の全比較テーブルで、④ full-auto-dev 列の値が実態と一致しているか
- [ ] F18 ランドスケープの全比較テーブルで、④のスコア・数値が実態と一致しているか

### Expert 6: プロンプト品質（Prompt Quality）

**視座:** S0-S6 構造の遵守、In/Out の完全性、手順の明確性

**検証項目:**
- [ ] F11 全18エージェントが F08 の S0-S6 構造に準拠しているか（全セクション存在、順序正しい）
- [ ] 全エージェントの In テーブルの file_type が、提供元エージェントの Out に存在するか
- [ ] 全エージェントの Out テーブルの file_type が、F04 §2 で当該エージェントの所有として登録されているか
- [ ] Procedure の各ステップが Start Conditions → End Conditions を満たす論理的な手順になっているか
- [ ] Exception テーブルが現実的な異常ケースをカバーしているか
- [ ] tools フロントマターが責務と整合しているか（read-only エージェントに Write がないか等）
- [ ] process-improver に Write/Edit がないこと、decree-writer に Write/Edit があることを確認

---

## Phase 2: クロスチェック実行

Phase 0 で定義したクロスチェックマトリクスの全ペアを実行する。

各ペアについて以下を記録する:

```
### X01: [突合ペア名]
- 結果: PASS / FAIL
- 不整合（FAIL の場合）: 具体的な差分を記述
- 修正提案: どちらをどう直すべきか
```

**全ペアの実行が完了するまで Phase 3 に進んではならない。**

---

## Phase 3: 統合判定

### 3.1 指摘一覧

全フェーズの指摘を統合し、以下の形式で一覧化する:

| # | 重大度 | 発見者 | 対象ファイル | 指摘内容 | 修正提案 |
|:-:|:------:|--------|------------|---------|---------|
| 1 | Critical | Expert N | F0X | ... | ... |
| 2 | High | Expert N | F0X | ... | ... |
| 3 | Medium | Expert N | F0X | ... | ... |
| 4 | Low | Expert N | F0X | ... | ... |

**重大度定義:**
- **Critical**: 矛盾により実行時に誤動作する（データフローの断絶、所有権の重複等）
- **High**: 矛盾が存在するが回避可能（数値の不一致、ラベルの欠落等）
- **Medium**: 不整合だが影響は限定的（表現の揺れ、軽微な記述漏れ等）
- **Low**: 改善推奨（可読性、冗長な記述等）

### 3.2 総合判定

| 判定 | 条件 |
|------|------|
| **PASS** | Critical = 0 かつ High = 0 |
| **CONDITIONAL PASS** | Critical = 0 かつ High ≦ 3 |
| **FAIL** | Critical ≧ 1 または High ≧ 4 |

---

## 出力

レビュー結果を `project-records/reviews/council-review-{今日の日付}.md` に出力する。

出力は MCBSMD 形式（6重バッククォートで囲んだ単一 Markdown）で行う。
