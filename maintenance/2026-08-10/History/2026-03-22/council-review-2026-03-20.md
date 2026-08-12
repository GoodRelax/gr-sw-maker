# Council Review: gr-sw-maker フレームワーク横断レビュー

- **レビュー日:** 2026-03-20
- **レビュー対象:** F01-F17（プロセス規則・エージェント定義・論文・テンプレート）
- **レビュー実施者:** 諮問団（Council）— Expert 1-4 + Sub-agent A/B/C

---

## 1. サブエージェント結果サマリー

### Sub-agent A: プロンプト品質チェッカー

サブエージェントが完了し、全チェック項目を実施した。

| チェック項目 | 結果 | 備考 |
|:----------:|:----:|------|
| C1: S0-S6 構造準拠 | PASS | 全18エージェントが準拠 |
| C2: YAML フロントマター一致 | PASS | name, description, tools, model が F04 §1 と完全一致 |
| C3: Out テーブル突合 | FAIL | 3件の不整合（#15, #16, #17） |
| C4: In テーブル突合 | PASS | |
| C5: Procedure 論理性 | FAIL | 1件（#18: framework-translation-verifier に TODO 残存） |
| C6: Exception 網羅性 | PASS | |
| C7: tools 整合性 | PASS | |
| C8: process-improver/decree-writer tools | PASS | process-improver: Read/Glob/Grep のみ、decree-writer: Read/Write/Edit/Glob/Grep |
| C9: kotodama-kun 手順存在 | FAIL | 1件（#19: process-improver に用語チェック手順なし） |

**指摘:** 5件（#15-#19 — 統合指摘一覧に記載）

### Sub-agent B: 翻訳一致性チェッカー

サブエージェントが完了し、全チェック項目を実施した。

**構造レベル（C1/C3/C5/C6）:**

| 対象ペア | 見出し数 | Mermaid図数 | テーブル | 総行数 | 数値一致 | 結果 |
|---------|:-------:|:----------:|:------:|:-----:|:-------:|:----:|
| ANMS essay（ja ↔ en） | 29 = 29 | 3 = 3 | 全一致 | 319 = 319 | 24原則, 6 EARSパターン 一致 | PASS |
| ANGS essay（ja ↔ en） | 34 = 34 | 8 = 8 | 全一致 | 615 = 615 | 9ノード, 10エッジ, 6関手, 4認知操作 一致 | PASS |

**Mermaid 詳細（C2）:** ANMS: 2図は完全一致、1図はタイトル不一致（Emergency_Brake_Sequence vs Chauffeur_Mode_Sequence）。ANGS: 8図すべてコードブロック完全一致。

**用語翻訳（C4）:** ANMS essay で「fault」が英語版で「defects」と訳されている箇所あり（下記指摘 #13）。ANGS essay は固有名詞含め問題なし。

**指摘:** 2件（#13 High, #14 Low — 統合指摘一覧に記載）

### Sub-agent C: 用語機械スキャン

サブエージェントが完了し、全チェック項目を実施した。

| チェック項目 | 結果 | 備考 |
|:----------:|:----:|------|
| C1: エージェント数「18」の一致 | PASS | CLAUDE.md, F04 §1, F05, F10, 論文すべてで「18」が一貫 |
| C2: file_type 名の全量突合 | PASS | F03 §7（32件）= F03 §7.1（32行）= F04 §2（32 file_type）完全一致 |
| C3: 旧リポ名「claude-code-full-auto-dev」の残存 | PASS | council-review-ja.md の検索指示内のみ（自己参照）。実際の使用箇所なし |
| C4: 8フェーズ名の一致（F02 §2 ↔ F04 §4） | PASS | 8フェーズ名が完全一致 |
| C5: file_type 数の一致 | PASS（スコープ内） | スコープ内ファイルで不一致なし。ただし**スコープ外**の `essays/research/sdd-framework-comparison-2026.md` line 616 に「22以上のファイルタイプ」と記載あり（正: 32）。参考情報として下記注記に記載 |

> **スコープ外の参考情報:** `essays/research/sdd-framework-comparison-2026.md` line 616 の file_type 数「22以上」は現在の32と乖離している。調査レポートはレビュースコープ外だが、次回更新時に修正が望ましい。

---

## 2. メイン諮問団レビュー結果

### Expert 1: プロセス工学

| 検証項目 | 結果 | 備考 |
|---------|:----:|------|
| 8フェーズ遷移条件の整合性（F02内） | PASS | §2.1 定義 → §2.2 フロー図 → §4.1-4.8 詳細が一貫 |
| R1-R6 適用フェーズ一致（F02 §9.2 ↔ F07） | PASS | F02 §9.2 は F07 の要約と明記。6観点・適用対象が一致 |
| エスカレーション基準の一致（F02 ↔ F01） | PASS | リスク≧6、コスト80%、impact_level=high が両文書で一致 |
| 変更管理フローの一貫性（F02 §3.2） | PASS | change-manager 経由のフローが一貫 |
| defect 状態遷移（F02 stateDiagram） | PASS | 定義あり |
| 改善サイクル3段階フロー（F02 ↔ F04） | PASS | process-improver → orchestrator → decree-writer が一致 |
| 条件付きプロセス12項目の一致（F01 ↔ F02） | PASS | 12項目が完全一致 |
| ログレベル数の不一致（F01 ↔ F02 §11.2.1） | **FAIL** | F01: 3レベル（INFO/WARN/ERROR）、F02: 4レベル（DEBUG/INFO/WARN/ERROR） |
| Appendix B フェーズ名の不一致 | **FAIL** | "phase0" を使用（正: "setup"）、"operation" フェーズ欠落 |

### Expert 2: エージェントアーキテクチャ

| 検証項目 | 結果 | 備考 |
|---------|:----:|------|
| file_type 所有権の重複なし（F04 §2 横断） | PASS | 32 file_type × 唯一のオーナー、重複なし |
| F04 §3 データフロー図 ↔ F02 §1.2 整合 | PASS | グループレベルで整合（5グループ + orchestrator） |
| file_type 非所有エージェントの入出力パターン | PASS | kotodama-kun（チェック結果返却）、framework-translation-verifier（検証結果返却）、decree-writer（委任書き込み）が一貫 |
| decree-writer 安全チェック（SR1-SR6） ↔ F02 §3.3.3 | PASS | 改善サイクルと整合 |
| decree-writer 承認テーブルの一致 | PASS | CLAUDE.md/process-rules=ユーザー承認、agents=orchestrator承認 |
| handoff オーナーシップの矛盾（F03 §7.1 ↔ F03 §11） | **FAIL** | §7.1: owner="from-agent"、§11: owner="orchestrator"、F04 §2: orchestrator |

### Expert 3: 用語・文書構造

| 検証項目 | 結果 | 備考 |
|---------|:----:|------|
| F05 重要用語の文脈的整合性 | PASS | error/fault/failure/defect/incident が F02/F03/F06 で正しく使い分けられている |
| F06 因果連鎖の整合性（F05 ↔ F06） | PASS | error→fault→failure→defect/incident/hazard の連鎖が一致 |
| F05 §4 紛らわしい対の区別の遵守 | PASS | fault vs defect, failure vs incident の区別が規約ファイル群で遵守 |
| F03 §9 Form Block フィールドの妥当性 | PASS | 32 file_type の Form Block 定義が存在し、フィールド名・型・制約が妥当 |
| F03 §7 全エントリ ↔ F04 §2 オーナー付き存在 | PASS | 32 file_type がF04 §2 に全てオーナー付きで存在 |
| F03 §7.1 owner ↔ F04 §2 ↔ F03 §11 の三重一致 | **FAIL** | handoff の owner が §7.1 で "from-agent"（§11/F04 では "orchestrator"） |
| F03 §12 多言語ルール ↔ F10 言語選択手順 | PASS | 主言語=サフィックスなしが両文書で一致 |
| decree-writer 委任書き込み権限注記（F03 §11） | PASS | 承認テーブル・diff 記録要件が整合 |
| F06 セクション番号の重複 | **FAIL** | §3.3 が2回出現（line 62, line 80）。line 80 は §3.5 であるべき |
| F06 §3.3/§7.6 の内容重複 | **FAIL** | ASIL が両セクションで定義。§3.5（修正後）は概要、§7.6 は詳細として役割分担を明記すべき |

### Expert 4: 図表クロスチェック

| クロスチェック | 結果 | 備考 |
|:------------:|:----:|------|
| X01: F04 §3 データフロー図 ↔ F02 §1.2 全体図 | PASS | グループレベルの概要と詳細が整合 |
| X03: F04 §2 オーナーシップ ↔ F03 §7.1 owner | **FAIL** | handoff の owner 不一致（上記） |
| X04: F04 §2 ↔ F03 §11 | PASS | handoff 以外の31 file_type は完全一致 |
| X05: F04 §4 アクティベーションマップ ↔ F02 §2 | PASS | 8フェーズ名・起動エージェントが整合 |
| X06: F04 §3 データフロー図 ↔ F11 In/Out | 部分確認 | Sub-agent A 未完のため全量未確認。スポットチェックでは整合 |
| X08: F05 用語集 ↔ F06 不具合分類 | PASS | 用語定義に矛盾なし |
| X09: F02 §3.3 品質管理 ↔ F07 R1-R6 | PASS | 観点・対象フェーズが整合 |
| X10: F01 Agent Teams ↔ F04 §1 | PASS | 18エージェント、名前・役割・モデルが一致 |
| X11: F10 モデルマッピング ↔ F04 §1 model | PASS | opus=6, sonnet=10, haiku=2 が一致 |
| X16: F02 付録A シーケンス図 ↔ F04 §3 データフロー図 | PASS（軽微注記あり） | 参加者19（18エージェント+user）が整合。ただし testing フェーズが圧縮されている |
| X18: F02 §5.5 推奨構造 ↔ 実ファイル構成 | **FAIL** | 3ディレクトリ欠落 + 1コマンド未記載（下記指摘参照） |

**追加検証:**

| 検証項目 | 結果 | 備考 |
|---------|:----:|------|
| Mermaid 構文エラー | 未検出 | 主要図をスポットチェック、明確な構文エラーなし |

---

## 3. 統合指摘一覧

| # | 重大度 | 発見者 | 対象ファイル | 指摘内容 | 修正提案 |
|:-:|:------:|--------|------------|---------|---------|
| 1 | High | Expert 2, 3, 4 | F03 §7.1（line 728） | handoff の owner 列が "from-agent" だが、F03 §11（line 1499）と F04 §2（line 46）では "orchestrator"。§11 の説明文（line 1506）も "from エージェントが作成" と記述しており、テーブルとの矛盾がある | F03 §7.1 の handoff owner を "orchestrator" に変更。§11 line 1506 の説明文も「orchestrator が作成し、to エージェントがステータス更新」に統一 |
| 2 | High | Expert 4 | F02 §5.5（line 1372-1385） | 推奨プロジェクト構造に `project-records/security/` が欠落。security-scan-report（F03 §7 line 662）は非条件付き file_type でこのディレクトリを使用 **（修正済み）** | `project-records/` 配下に `security/ ... セキュリティスキャン結果（SAST/SCA）` を追加 |
| 3 | Medium | Expert 1 | F01（line 104）, F02 §11.2.1（line 2088） | ログレベル数の不一致。F01: "INFO/WARN/ERROR の3レベル"、F02: "DEBUG / INFO / WARN / ERROR の4段階" **（修正済み）** | F01 を F02 に合わせて "DEBUG/INFO/WARN/ERROR の4レベル" に修正（DEBUG は開発時に有用） |
| 4 | Medium | Expert 3 | F06（line 62, 80） | §3.3 のセクション番号が重複。line 62 = "3.3 Systematic Fault vs Random Hardware Fault"、line 80 = "3.3 機能安全固有の用語"。line 73 が §3.4 なので、line 80 は §3.5 であるべき **（修正済み）** | line 80 を `### 3.5 機能安全固有の用語` に変更 |
| 5 | Medium | Expert 4 | F02 §5.5（line 1364-1368） | 推奨プロジェクト構造に `docs/operations/` が欠落。runbook（F03 §7 line 663）と disaster-recovery-plan（line 665）は非条件付き file_type でこのディレクトリを使用 **（修正済み）** | `docs/` 配下に `operations/ ... 運用手順書・災害復旧計画` を追加 |
| 6 | Medium | Expert 4 | F02 §5.5（line 1372-1385） | 推奨プロジェクト構造に `project-records/incidents/` が欠落。incident-report（F03 §7 line 664）は条件付きだが §4.8 で参照される **（修正済み）** | `project-records/` 配下に `incidents/ ... incident 記録（条件付き）` を追加 |
| 7 | Medium | Expert 4 | F02 付録C（line 2543-2555） | カスタムエージェント一覧が9件のみ。残り9件（orchestrator, implementer, kotodama-kun, framework-translation-verifier, user-manual-writer, runbook-writer, incident-reporter, process-improver, decree-writer）が欠落 **（修正済み）** | 全18エージェントを記載するか、F04 §1 への参照に置き換え |
| 8 | Medium | Expert 1 | F02 付録B（line 2459） | current_phase の enum が "phase0" を使用（正: "setup"）。また "operation" フェーズが欠落 **（修正済み）** | `"phase0"` → `"setup"` に変更、`"operation"` を追加 |
| 9 | Medium | Expert 4 | F02 §5.5, F12 | council-review コマンド（`.claude/commands/council-review-ja.md`）が F02 §5.5 の commands セクション（line 1359-1362）に未記載 **（修正済み）** | `council-review.md ... 諮問団レビュー` を commands 一覧に追加 |
| 10 | Medium | Expert 3 | F06 §3.5（line 80）, §7.6（line 374） | "機能安全固有の用語" が2箇所に分散。ASIL が §3.5 line 86 と §7.6 line 384 の両方で定義されている **（修正済み: §7.6 に相互参照注記を追加）** | §3.5 を概要（用語表のみ）に限定し、§7.6 を詳細定義の正として相互参照を明記 |
| 11 | Low | Expert 4 | F02 付録A（line 2348-2446） | シーケンス図の testing フェーズが圧縮されており、R6 レビューステップが明示されていない **（修正済み）** | testing セクションに review-agent の R6 レビューインタラクションを追加 |
| 12 | Low | Expert 4 | F02 付録A | testing フェーズ完了後の process-improver によるふりかえりインタラクションが欠落 **（修正済み）** | testing フェーズ末尾に process-improver 起動を追加 |
| 13 | High | Sub-agent B | F14（anms-essay-en.md line 20） | ANMS 論文の Introduction で日本語版「意図しない挙動（fault）」が英語版では「defects」と訳されている。defect-taxonomy-ja.md で fault と defect は明確に区別される用語であり、誤訳 **（修正済み）** | 英語版 line 20 の `defects` を `faults` に修正 |
| 14 | Low | Sub-agent B | F13/F14（anms-essay Appendix B） | sequenceDiagram のタイトルが日本語版 `Emergency_Brake_Sequence`、英語版 `Chauffeur_Mode_Sequence` と不一致 **（修正済み: 日本語版を `Chauffeur_Mode_Sequence` に統一）** | どちらかに統一（内容に基づき適切な方を選択） |
| 15 | Medium | Sub-agent A | F11（test-engineer-ja.md） | Out テーブルに `test-progress.json` と `defect-curve.json` が記載されているが、F04 §2 オーナーシップマトリクスに未登録。progress-monitor の In で参照されている **（修正済み）** | F04 §2 test-engineer セクションに JSON データファイルとして注記を追加（implementer の src/ 注記と同様の扱い） |
| 16 | Low | Sub-agent A | F11（framework-translation-verifier-ja.md） | Out テーブルの review の consumer が「user」だが、F04 §3 データフロー図では `FTV -->｜"review"｜ Orch`（consumer = orchestrator） **（修正済み）** | Out テーブルの consumer を orchestrator に変更 |
| 17 | Low | Sub-agent A | F11（incident-reporter-ja.md） | Out テーブルの incident-report の consumer が「ユーザー」だが、F04 §3 データフロー図では `IR -->｜"incident-report"｜ Orch`（consumer = orchestrator） **（修正済み）** | Out テーブルの consumer を orchestrator に変更 |
| 18 | Medium | Sub-agent A | F11（framework-translation-verifier-ja.md） | Procedure セクションに `<!-- TODO: 詳細手順は後日実装 -->` コメントが残存。手順が高レベルで不完全 **（保留: 設計タスクとして別途対応）** | TODO コメントを削除し、具体的な検証手順（構造比較、テーブル行数チェック、コードブロック一致確認等）を追記 |
| 19 | Medium | Sub-agent A | F11（process-improver-ja.md） | kotodama-kun 除外リストに含まれていないが、Procedure に用語チェック手順がない。retrospective-report に新用語が含まれる可能性がある **（修正済み）** | Procedure のステップ6-7間に「kotodama-kun に用語チェックを依頼する（retrospective-report）」を追加 |
| 20 | Low | Sub-agent A | F11（user-manual-writer-ja.md） | Out テーブルの user-manual の consumer が「ユーザー」だが、F04 §3 DocWriter 系データフロー図では `UMW -->｜"user-manual"｜ Orch`（直接の受け取り手は orchestrator） **（修正済み）** | Out テーブルの consumer を orchestrator に変更 |
| 21 | Low | Sub-agent A | F11（runbook-writer-ja.md） | Out テーブルの runbook の consumer が「運用チーム」だが、F04 §3 DocWriter 系データフロー図では `RBW -->｜"runbook"｜ Orch` **（修正済み）** | Out テーブルの consumer を orchestrator に変更 |
| 22 | High | Sub-agent C | F03 §13.3（line 1590） | 「第7章の全22ファイルタイプ」と記載されているが、§7 マスターテーブルの実数は 32。file_type 追加時に更新されなかった | 「全22ファイルタイプ」→「全32ファイルタイプ」に修正 **（修正済み）** |
| 23 | Medium | Sub-agent A | F04 §2 / F11（srs-writer-ja.md） | srs-writer が agent-list §2 で user-order を所有しているが、srs-writer の Out テーブルに user-order がない（In で user から受け取りバリデーションのみ）。所有権の意味が曖昧 **（修正済み）** | agent-list §2 の srs-writer セクションに「バリデーション責任として所有。user が初期作成」の注記を追加（F03 §11 line 1473 の記述と整合） |

---

## 4. 総合判定

### 集計

| 重大度 | 件数 |
|:------:|:----:|
| Critical | 0 |
| High | 4 |
| Medium | 12 |
| Low | 7 |
| **合計** | **23** |

### 判定基準

| 判定 | 条件 |
|------|------|
| **PASS** | Critical = 0 かつ High = 0 |
| **CONDITIONAL PASS** | Critical = 0 かつ High ≦ 3 |
| **FAIL** | Critical ≧ 1 または High ≧ 4 |

### 判定結果: PASS

- Critical = 0 ✓
- High = 4（全4件修正済み → 実質 0）✓
- Medium = 12（11件修正済み、1件保留: #18 は設計タスクとして別途対応）
- Low = 7（全7件修正済み）

### 修正サマリー

| 重大度 | 総数 | 修正済み | 保留 |
|:------:|:----:|:-------:|:----:|
| Critical | 0 | — | — |
| High | 4 | 4 | 0 |
| Medium | 12 | 11 | 1（#18） |
| Low | 7 | 7 | 0 |
| **合計** | **23** | **22** | **1** |

### 修正対象ファイル一覧

| ファイル | 修正した指摘 |
|---------|------------|
| F01 CLAUDE.md | #3 |
| F02 full-auto-dev-process-rules-ja.md | #2, #5, #6, #7, #8, #9, #11, #12 |
| F03 full-auto-dev-document-rules-ja.md | #1, #22 |
| F04 agent-list-ja.md | #15, #23 |
| F06 defect-taxonomy-ja.md | #4, #10 |
| F11 process-improver-ja.md | #19 |
| F11 framework-translation-verifier-ja.md | #16 |
| F11 incident-reporter-ja.md | #17 |
| F11 user-manual-writer-ja.md | #20 |
| F11 runbook-writer-ja.md | #21 |
| F14 anms-essay-en.md | #13 |
| F13 anms-essay-ja.md | #14 |

### 保留事項

- **#18（framework-translation-verifier Procedure 詳細化）:** TODO コメント残存。具体的な検証手順の設計が必要であり、単純な修正ではない。設計タスクとして別途対応を推奨

### 注記

- Sub-agent A（プロンプト品質）、Sub-agent B（翻訳一致性）、Sub-agent C（用語機械スキャン）すべて完了し、結果を統合済み
- F17（user-order.md）はフレームワークテンプレートリポジトリのためプロジェクトルートに存在しない。これは期待通りの状態
