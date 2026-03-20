``````markdown
# Council Review: gr-sw-maker フレームワーク横断レビュー

- **レビュー日:** 2026-03-20
- **レビュー対象:** F01-F24（全24ファイル群）
- **判定:** **FAIL**（Critical = 2, High = 3）

---

# Phase 0: レビュー計画

## 0.1 全図表の列挙

### Mermaid 図

| ID | ファイル | 種別 | タイトル/概要 | 行番号 |
|:--:|---------|------|-------------|:------:|
| D01 | [F02] process-rules | flowchart TB | §1.2 全体アーキテクチャ | 124-213 |
| D02 | [F02] process-rules | flowchart LR | §2.2 開発フェーズフロー | 268-357 |
| D03 | [F02] process-rules | flowchart TD | §3.2.1 変更管理フロー | 386-400 |
| D04 | [F02] process-rules | stateDiagram-v2 | §3.2.4 defect 状態遷移 | 444-453 |
| D05 | [F02] process-rules | flowchart TD | §4.2 PoCプロセス | ~480付近 |
| D06 | [F02] process-rules | gantt | §4.3 designフェーズWBS例 | ~910付近 |
| D07 | [F02] process-rules | flowchart TD | §9.1 レビューゲートフロー | 1765-1819 |
| D08 | [F02] process-rules | flowchart LR | §5.5 推奨ディレクトリ構造 | ~1380付近 |
| D09 | [F02] process-rules | sequenceDiagram | 付録A Agent Teams コミュニケーション | ~2380付近 |
| D10 | [F02] process-rules | flowchart TD | §3.3.3 ふりかえり・プロセス改善サイクル | ~470付近 |
| D11 | [F02] process-rules | flowchart LR | §2.2 designフェーズ詳細 | ~295付近 |
| D12 | [F03] document-rules | flowchart TB | §5 文書ライフサイクル状態遷移 | ~480付近 |
| D13 | [F03] document-rules | flowchart LR | §7 external-dependency-spec 継承関係 | 674-679 |
| D14 | [F03] document-rules | flowchart TB | §10 バージョニング判定フロー | ~1430付近 |
| D15 | [F04] agent-list | flowchart TD | §3 エージェント間データフロー | 186-259 |
| D16 | [F06] defect-taxonomy | flowchart LR | §1 因果連鎖図 | — |
| D17 | [F06] defect-taxonomy | flowchart TD | §3 詳細因果連鎖図 | — |
| D18 | [F06] defect-taxonomy | flowchart TD | §7 安全性分析フロー | — |
| D19 | [F06] defect-taxonomy | flowchart TD | §7 FTA例（Fault Tree） | — |
| D20 | [F09] spec-template | flowchart LR | Clean Architecture 層構成 | — |
| D21 | [F13] ANMS論文(ja) | flowchart LR | STFB構造図 | — |
| D22 | [F13] ANMS論文(ja) | flowchart TD | 仕様書作成フロー | — |
| D23 | [F14] ANMS論文(en) | flowchart LR | STFB structure diagram | — |
| D24 | [F14] ANMS論文(en) | flowchart TD | Spec creation flow | — |
| D25 | [F15] ANGS論文(ja) | 複数 | スケーリング・グラフ構造等（9図） | — |
| D26 | [F16] ANGS論文(en) | 複数 | Scaling, graph structure etc. (9 diagrams) | — |
| D27 | [F17] SDD比較 | flowchart | full-auto-devフロー概要 | — |
| D28 | [F19] GraphDB比較 | 複数 | グラフスキーマ比較（2図） | — |
| D29 | [F20] ANMS GraphSchema | 複数 | グラフスキーマ定義（4図） | — |
| D30 | [F21] Scaling要点 | 複数 | スケーリングフロー（2図） | — |
| D31 | [F22] Claude Chat Review | 複数 | 先行研究分析（5図） | — |

### Markdown テーブル

| ID | ファイル | セクション/概要 | 行番号 |
|:--:|---------|---------------|:------:|
| T01 | [F01] CLAUDE.md | Agent Teams 設定（18エージェント） | ~113-170 |
| T02 | [F01] CLAUDE.md | 条件付きプロセス（12項目） | ~177-188 |
| T03 | [F01] CLAUDE.md | 仕様形式の選択（ANMS/ANPS/ANGS） | ~62-68 |
| T04 | [F02] process-rules | §1.3 Claude Code主要機能 | 219 |
| T05 | [F02] process-rules | §2.1 フェーズ定義テーブル | 242-251 |
| T06 | [F02] process-rules | §3.2.4 defect severity/priority | ~456付近 |
| T07 | [F02] process-rules | §4.3 design フェーズ成果物 | ~870付近 |
| T08 | [F02] process-rules | §9.2 R1-R6 概要テーブル | 1828-1835 |
| T09 | [F02] process-rules | §7 エージェント一覧テーブル | ~1525付近 |
| T10 | [F02] process-rules | §7 各エージェントロール定義 | ~1560付近 |
| T11 | [F02] process-rules | 付録B コスト試算 | ~2540付近 |
| T12 | [F03] document-rules | §7 file_type マスターテーブル（31行） | 634-667 |
| T13 | [F03] document-rules | §7.1 ワークフロー参照テーブル（32行） | 724-757 |
| T14 | [F03] document-rules | §8 名前空間プレフィックス | 765-779 |
| T15 | [F03] document-rules | §9.1-§9.31 Form Block 定義（31セクション） | 852-1425 |
| T16 | [F03] document-rules | §11 オーナーシップモデル | 1448-1481 |
| T17 | [F03] document-rules | §12 言語ポリシー | 1497 |
| T18 | [F04] agent-list | §1 エージェント一覧（18行） | 11-30 |
| T19 | [F04] agent-list | §2 orchestrator オーナーシップ | 40-47 |
| T20 | [F04] agent-list | §2 srs-writer オーナーシップ | 51-55 |
| T21 | [F04] agent-list | §2 architect オーナーシップ | 59-66 |
| T22 | [F04] agent-list | §2 security-reviewer オーナーシップ | 70-74 |
| T23 | [F04] agent-list | §2 implementer オーナーシップ | 78-81 |
| T24 | [F04] agent-list | §2 test-engineer オーナーシップ | 87-92 |
| T25 | [F04] agent-list | §2 review-agent オーナーシップ | 96-98 |
| T26 | [F04] agent-list | §2 progress-monitor オーナーシップ | 102-105 |
| T27 | [F04] agent-list | §2 change-manager オーナーシップ | 109-111 |
| T28 | [F04] agent-list | §2 risk-manager オーナーシップ | 115-117 |
| T29 | [F04] agent-list | §2 license-checker オーナーシップ | 121-123 |
| T30 | [F04] agent-list | §2 kotodama-kun（file_type非所有） | 129-134 |
| T31 | [F04] agent-list | §2 framework-translation-verifier（file_type非所有） | 140-143 |
| T32 | [F04] agent-list | §2 user-manual-writer オーナーシップ | 147-149 |
| T33 | [F04] agent-list | §2 runbook-writer オーナーシップ | 153-155 |
| T34 | [F04] agent-list | §2 incident-reporter オーナーシップ | 159-161 |
| T35 | [F04] agent-list | §2 process-improver オーナーシップ | 165-167 |
| T36 | [F04] agent-list | §2 decree-writer（file_type非所有） | 173-176 |
| T37 | [F04] agent-list | §4 フェーズ別アクティベーションマップ | 269-278 |
| T38 | [F05] glossary | §1 意図的に選定した用語（18行） | 12-28 |
| T39 | [F05] glossary | §2 フレームワーク固有概念（13行） | 34-46 |
| T40 | [F05] glossary | §3 略称の許可判定（8行） | 52-60 |
| T41 | [F05] glossary | §4 紛らわしい対の区別（12行） | 66-76 |
| T42 | [F06] defect-taxonomy | 各セクション（14+テーブル） | — |
| T43 | [F07] review-standards | R1-R6 チェックリスト（テキスト形式） | — |
| T44 | [F08] prompt-structure | S0-S6 構造定義テーブル | 20-42 |
| T45 | [F08] prompt-structure | YAML フロントマターフィールド | 67-72 |
| T46 | [F08] prompt-structure | In/Out/Work 判定基準 | 176-182 |
| T47 | [F08] prompt-structure | 必須/任意マトリクス | 242-250 |
| T48 | [F08] prompt-structure | セクション順序根拠 | 256-263 |
| T49 | [F09] spec-template | Ch1-6 テンプレートテーブル（11個） | — |
| T50 | [F10] porting-guide | プラットフォーム別変換テーブル（7個） | — |
| T51 | [F10] porting-guide | モデルマッピング推奨値 | 165-169 |
| T52 | [F11] 各エージェント | In/Out/Exception テーブル（×18） | — |
| T53 | [F13/F14] ANMS論文 | 各テーブル（×6） | — |
| T54 | [F15/F16] ANGS論文 | 各テーブル（×12+） | — |
| T55 | [F17] SDD比較 | 比較テーブル群 | — |
| T56 | [F18] ランドスケープ | 比較テーブル群 | — |
| T57 | [F23] handoff | 未完了タスクA-F | — |

---

## 0.2 クロスチェックマトリクス

### 必須ペア（X01-X18）

| # | 突合ペア | 検証観点 |
|:-:|---------|---------|
| X01 | F04 §3 データフロー図 (D15) ↔ F02 §1.2 全体アーキテクチャ図 (D01) | ノード数、矢印、ラベルの一致 |
| X02 | F04 §1 エージェント一覧 (T18) ↔ F11 全18エージェントファイル | name, model, 役割の一致 |
| X03 | F04 §2 オーナーシップ (T19-T36) ↔ F03 §7.1 ワークフロー参照テーブル (T13) | file_type の owner 一致 |
| X04 | F04 §2 オーナーシップ (T19-T36) ↔ F03 §11 オーナーシップモデル (T16) | 同上 |
| X05 | F04 §4 アクティベーションマップ (T37) ↔ F02 §2 フェーズ定義 (T05) | フェーズ名、起動エージェントの整合 |
| X06 | F11 各エージェントの In/Out ↔ F04 §3 データフロー図 (D15) | file_type の流れの整合 |
| X07 | F11 各エージェントの In/Out ↔ F04 §2 オーナーシップ (T19-T36) | Out = owner の一致 |
| X08 | F05 用語集 ↔ F06 不具合分類 | 用語定義の矛盾なし |
| X09 | F02 §3.3/§9 品質管理 ↔ F07 レビュー基準 R1-R6 | 観点・対象フェーズの整合 |
| X10 | F01 CLAUDE.md Agent Teams (T01) ↔ F04 §1 エージェント一覧 (T18) | エージェント数、名前、役割の一致 |
| X11 | F10 移植ガイド モデルマッピング (T51) ↔ F04 §1 model 列 (T18) | モデル割当の一致 |
| X12 | F17 SDD比較 Mermaid図 (D27) ↔ F04 §1 エージェント一覧 (T18) | エージェント数・構成の一致 |
| X13 | F18 ランドスケープ 比較テーブル (T56) ↔ F04 §1 (T18) | エージェント数の一致 |
| X14 | F13/F14 ANMS 論文（日英） | 構造・図表・用語の翻訳一致 |
| X15 | F15/F16 ANGS 論文（日英） | 構造・図表・用語の翻訳一致 |
| X16 | F02 付録A シーケンス図 (D09) ↔ F04 §3 データフロー図 (D15) | 参加者・メッセージの整合 |
| X17 | F08 S0-S6 構造規約 (T44) ↔ F11 全エージェントファイル | 構造準拠（全セクション存在） |
| X18 | F02 §5.5 推奨構造 ↔ 実ファイル構成 | ファイル名の一致 |

### 追加ペア

| # | 突合ペア | 検証観点 |
|:-:|---------|---------|
| X19 | F03 §7 file_type マスター (T12) ↔ F03 §7.1 ワークフロー参照 (T13) | 全 file_type が両方に存在するか |
| X20 | F03 §7 file_type マスター (T12) ↔ F03 §9 Form Block 定義 (T15) | 全 file_type に Form Block が定義されているか |
| X21 | F04 §2 process-improver オーナーシップ (T35) ↔ F03 §7 file_type マスター (T12) | retrospective-report の登録整合 |
| X22 | F11 architect Out ↔ F11 implementer In / F11 test-engineer In | openapi.yaml の追跡 |
| X23 | F01 条件付きプロセス (T02) ↔ F02 条件付きプロセス | 項目一致 |

---

## 0.3 レビュー計画

### 担当割り当て

| 専門家 | 担当クロスチェック | 重点領域 |
|-------|-----------------|---------|
| Expert 1: プロセス工学 | X05, X09, X23 | フェーズ遷移・品質ゲート・エスカレーション |
| Expert 2: エージェントアーキテクチャ | X01, X02, X06, X07, X10, X16, X22 | SRP・データフロー・所有権 |
| Expert 3: 用語統制 | X08, X14, X15 | 用語一貫性・命名規約 |
| Expert 4: 文書構造 | X03, X04, X19, X20, X21 | Common/Form/Detail Block整合 |
| Expert 5: 図表整合性 | X01, X11, X12, X13, X16, X18 | 全図表クロスチェック |
| Expert 6: プロンプト品質 | X02, X06, X07, X17 | S0-S6準拠・In/Out完全性 |

### レビュー順序

1. Expert 4（文書構造）→ §7 マスターテーブルの整合が他すべての基盤
2. Expert 2（エージェントアーキテクチャ）→ データフローの整合
3. Expert 6（プロンプト品質）→ エージェント定義の検証
4. Expert 1（プロセス工学）→ フェーズ遷移の整合
5. Expert 3（用語統制）→ 横断的用語チェック
6. Expert 5（図表整合性）→ 全図表の最終突合

---

# Phase 1: 専門家レビュー

## Expert 1: プロセス工学（Process Engineering）

- [x] 8フェーズ（setup→operation）の遷移条件が F02 内で矛盾していないか
  - **PASS.** §2.1 のフェーズ定義テーブル（T05）と §2.2 のフロー図（D02）の遷移条件は一致。各フェーズの Entry/Exit Criteria が明確。
- [x] 品質ゲート（R1-R6）の適用フェーズが F02 と F07 で一致しているか
  - **PASS.** F02 §9.2（T08: line 1828-1835）の R1-R6 適用フェーズと F07 のレビュー基準記述は整合。
- [x] エスカレーション基準（リスク≧6、コスト80%、impact_level=high）が F02 と F11 orchestrator で一致しているか
  - **PASS.** F02 §1.2（D01 line 208: E1 エスカレーション）と F11 orchestrator の Exception テーブルの閾値が一致。
- [x] 変更管理フロー（F02 §3.2）と change-manager エージェントの Procedure が整合しているか
  - **PASS.** F02 §3.2.1（D03）のフローと F11 change-manager の Procedure は整合。ユーザー起点のみを受付、impact_level=high はユーザー承認必須。
- [x] defect 状態遷移（F02 stateDiagram D04）と test-engineer / review-agent の手順が整合しているか
  - **PASS.** 状態遷移 open→investigating→fixing→verified→closed が F11 test-engineer の Procedure と整合。
- [x] ふりかえりサイクル（process-improver → orchestrator → decree-writer）の3段階フローが F02, F04, F11 で矛盾なく記述されているか
  - **PASS.** F02 §3.3.3、F04 §3（D15 line 235-238: R1-R4）、F11 の3エージェント定義が整合。
- [x] 条件付きプロセス（12項目）が F01 と F02 で一致しているか
  - **PASS.** F01（T02）の12項目と F02 §2.3 の条件付きプロセス定義が一致。

**Expert 1 総括:** プロセスフローに致命的な矛盾なし。ただし F02 §8.3 のふりかえりコマンド説明で decree-writer への言及が欠落（Medium）。

---

## Expert 2: エージェントアーキテクチャ（Agent Architecture）

- [x] 18エージェントの名前・model・役割が F04 §1, F01, F10, F17, F18, F23 で一致しているか
  - **PASS.** 全6ファイルで18エージェントの名前・モデル・役割が一致。
- [x] 各エージェントの file_type 所有権に重複がないか（F04 §2 の全セクション横断）
  - **PASS.** 全 file_type のオーナーが一意。implementer はコード（src/, tests/）のみで Common Block 管理対象外であることが明記（F04 §2 line 83）。
- [x] F04 §3 データフロー図の全矢印が、F11 各エージェントの In/Out と整合しているか（X06）
  - **FAIL.** 後述の Critical/High 指摘参照。
- [x] F02 §1.2 全体アーキテクチャ図のノード・矢印が F04 §3 と整合しているか（X01）
  - **PASS.** D01 と D15 のノード数（18エージェント + User）、矢印ラベルは構造的に一致。D01 は番号付き（1-22, E1, R1-R4）で補足的だが、file_type の流れは同一。
- [x] file_type を所有しないエージェント（kotodama-kun, framework-translation-verifier, decree-writer）の入出力パターンが一貫しているか
  - **PASS.** 3エージェントとも F04 §2 で「file_type を所有しない」ことが明記され、代替手段（口頭報告、review 借用、diff 記録）が定義されている。
- [x] decree-writer の安全チェック（SR1-SR6）が F02 §3.3.3 の改善サイクルと整合しているか
  - **PASS.** F11 decree-writer の SR1-SR6 チェックリストは F02 の改善適用フローと整合。
- [x] decree-writer の承認テーブル（CLAUDE.md=ユーザー, agents=orchestrator, process-rules=ユーザー）が F11 process-improver, orchestrator, decree-writer の3ファイルで一致しているか
  - **PASS.** 3ファイルの承認テーブル記述が一致。F03 §11 line 1485 の記述とも整合。

**Expert 2 総括:** データフロー図に非 file_type ラベルの混在（High）、kotodama-kun 経由フローの実態不一致（High）を検出。

---

## Expert 3: 用語統制（Terminology Governance）

- [x] F05 用語集の全用語が、F02/F03/F06/F07 で正しく使われているか
  - **PASS.** error/fault/failure/defect/incident/hazard の使い分けが全ファイルで一貫。
- [x] F06 不具合分類の因果連鎖（error→fault→failure→defect/incident/hazard）が F05 と矛盾していないか
  - **PASS.** F05 §1 の定義と F06 の因果連鎖図が完全に整合。
- [x] 「エージェント数」の記載が全ファイルで18に統一されているか
  - **PASS.** F01, F02, F04, F10, F11, F17, F18 いずれも18エージェント。
- [x] file_type 名が F03 §7 の定義と F04 §2 で一致しているか
  - **FAIL.** `retrospective-report` が F04 §2 に存在するが F03 §7 に不在。後述の Critical 指摘参照。
- [x] F05 §3 略称許可判定に違反する略称が使われていないか
  - **PASS.** WBS, HW, AI は許可済み。不許可略称（DR, CR, FW）の使用なし。
- [x] F05 §4「紛らわしい対の区別」が全ファイルで遵守されているか
  - **PASS.** fault vs defect, failure vs incident 等の区別が全文書で遵守。
- [x] フレームワーク名「gr-sw-maker」「full-auto-dev」の使い分けが正しいか
  - **PASS.** gr-sw-maker = ツール/リポ名、full-auto-dev = 手法論名。混同なし。

**Expert 3 総括:** `retrospective-report` の §7 未登録は用語統制の観点からも問題（名前空間が定義されない）。

---

## Expert 4: 文書構造（Document Structure）

- [x] F03 §9 で定義された全 file_type の Form Block フィールドが、F11 各エージェントの「出力規則」と整合しているか
  - **PASS.** §9.1-§9.31 の31 Form Block 定義は、対応するエージェントの出力規則と整合。
- [x] F03 §7 file_type テーブルの全エントリが F04 §2 にオーナー付きで存在するか
  - **FAIL.** F03 §7（T12）は31 file_type を定義。F04 §2 はこれに加え `retrospective-report` を含む。逆に F03 §7 には `retrospective-report` が欠落。
- [x] F03 §7.1 ワークフロー参照テーブルの owner 列が F04 §2, F03 §11 と三重に一致しているか（X03, X04）
  - **PARTIAL.** §7.1（T13 line 757）には `retrospective-report | フェーズ完了時（随時） | orchestrator | process-improver` が存在し、F04 §2（T35）と F03 §11（T16 line 1481）とも一致。しかし §7（T12）に未登録のため三重一致が不成立。
- [x] F03 §12 多言語ルール（主言語=サフィックスなし）が F10 の言語選択手順と整合しているか
  - **PASS.** F03 §12 の「主言語=サフィックスなし」ルールと F10 のデプロイ手順が整合。
- [x] F03 のバージョニングルール（§2）が F01 の文書管理規則参照（v0.0.0）と整合しているか
  - **PASS.** F01 に `v0.0.0`（PoC前のPre-release）と明記、F03 §2 と整合。
- [x] decree-writer の「委任書き込み権限」注記（F03 §11 line 1485）が decree-writer 定義（F11）の承認テーブルと一致しているか
  - **PASS.** 一致。

**Expert 4 総括:** `retrospective-report` の §7 未登録が最重要指摘。§9 に Form Block 定義も欠落。

---

## Expert 5: 図表整合性（Diagram & Table Consistency）

- [x] X01: D15 (F04 §3) ↔ D01 (F02 §1.2) — **PASS.** ノード18+User、矢印パターン一致。D01は番号ラベル付加。
- [x] X02: T18 (F04 §1) ↔ F11 全18ファイル — **PASS.** name/model/役割が全件一致。
- [x] X03: T19-T36 (F04 §2) ↔ T13 (F03 §7.1) — **PASS（retrospective-report を除く）.** 31 file_type の owner は完全一致。
- [x] X04: T19-T36 (F04 §2) ↔ T16 (F03 §11) — **PASS（retrospective-report を除く）.** 同上。
- [x] X11: T51 (F10 モデルマッピング) ↔ T18 (F04 §1 model列) — **PASS.** opus/sonnet/haiku の割当が一致。
- [x] X12: D27 (F17 SDD比較) ↔ T18 (F04 §1) — **PASS.** エージェント数18、構成一致。
- [x] X14: F13 ↔ F14 (ANMS日英) — **PASS.** 図2個・テーブル6個、構造的に同一。
- [x] X15: F15 ↔ F16 (ANGS日英) — **PASS.** 図9個・テーブル12+個、構造的に同一。
- [x] X16: D09 (F02 付録A) ↔ D15 (F04 §3) — **PASS.** シーケンス図の参加者とデータフロー図のノードが一致。メッセージラベルも整合。
- [x] Mermaid構文エラーチェック — **PASS.** 全図に構文エラーなし（未定義ノード参照、不正スタイル等なし）。
- [x] D15 のラベルが全て file_type か — **FAIL.** 後述のHigh指摘参照。

**Expert 5 総括:** データフロー図の非file_typeラベル混在を検出。それ以外の図表整合は良好。

---

## Expert 6: プロンプト品質（Prompt Quality）

- [x] F11 全18エージェントが F08 の S0-S6 構造に準拠しているか
  - **PASS.** 全18エージェントに S0(YAML), S1(Identity), S2(Activation), S3(Ownership), S4(Procedure), S5(Rules), S6(Exception) が存在し、順序も正しい。
- [x] 全エージェントの In テーブルの file_type が、提供元エージェントの Out に存在するか
  - **FAIL.** `openapi.yaml` が implementer と test-engineer の In に存在するが、architect の Out テーブルに未登録。後述の Critical 指摘参照。
- [x] 全エージェントの Out テーブルの file_type が、F04 §2 で当該エージェントの所有として登録されているか
  - **PASS.** Out テーブルの全エントリが F04 §2 のオーナーシップと一致。
- [x] Procedure の各ステップが Start Conditions → End Conditions を満たす論理的な手順になっているか
  - **PASS.** 全18エージェントで Start → Procedure → End の論理的整合を確認。
- [x] Exception テーブルが現実的な異常ケースをカバーしているか
  - **PASS.** 主要な異常パターン（入力不足、矛盾検出、外部サービス障害等）がカバーされている。
- [x] tools フロントマターが責務と整合しているか（read-only エージェントに Write がないか等）
  - **PASS.** process-improver は Read, Glob, Grep のみ（Write/Edit なし）。decree-writer は Read, Write, Edit, Glob, Grep（Write/Edit あり）。両者の権限分離が正しい。
- [x] process-improver に Write/Edit がないこと、decree-writer に Write/Edit があることを確認
  - **PASS.** 上記の通り確認済み。

**Expert 6 総括:** openapi.yaml の Out テーブル未登録は、In/Out の追跡可能性を破壊する Critical 問題。

---

# Phase 2: クロスチェック実行

### X01: F04 §3 データフロー図 ↔ F02 §1.2 全体アーキテクチャ図
- 結果: **PASS**
- ノード18+User、主要矢印パターンが一致。D01 は番号付きラベルで補足情報を含むが、file_type の流れは D15 と同一。

### X02: F04 §1 エージェント一覧 ↔ F11 全18エージェントファイル
- 結果: **PASS**
- 全18エージェントの name, model, 役割説明が一致。

### X03: F04 §2 オーナーシップ ↔ F03 §7.1 ワークフロー参照テーブル
- 結果: **CONDITIONAL PASS**
- 31 file_type の owner は完全一致。ただし `retrospective-report` は F04 §2 と F03 §7.1 の両方に存在するが、F03 §7 マスターテーブルに未登録。

### X04: F04 §2 オーナーシップ ↔ F03 §11 オーナーシップモデル
- 結果: **PASS**
- F04 §2 の全エントリが F03 §11 に一致（retrospective-report 含む: F03 §11 line 1481）。

### X05: F04 §4 アクティベーションマップ ↔ F02 §2 フェーズ定義
- 結果: **PASS**
- 8フェーズ名が一致。各フェーズで起動されるエージェントが F02 の定義と整合。

### X06: F11 各エージェントの In/Out ↔ F04 §3 データフロー図
- 結果: **FAIL**
- 不整合1: D15 では `SRS -->|"spec-foundation<br/>interview-record"| Koto` → `Koto -->|"用語チェック済"| Arch` と、kotodama-kun を経由するフローが描かれているが、F11 architect の In テーブルには srs-writer（直接）と記載されており、kotodama-kun からの受け渡しは記載なし。
- 不整合2: 同様に `Arch -->|"spec-architecture<br/>observability-design"| Koto` → `Koto -->|"用語チェック済"| Impl` だが、F11 implementer の In テーブルには architect（直接）と記載。
- 不整合3: D15 のラベル「用語チェック済」「用語指摘」「ふりかえり起動」「承認済み改善策」「適用完了報告」は file_type ではなく自然言語のアクション名。D15 は「file_type の流れ」と説明（line 182）されているにもかかわらず、非 file_type ラベルが混在している。
- 修正提案: (a) kotodama-kun の経由パターンをエージェント定義の In に反映するか、D15 のフローを直接フロー（SRS→Arch, Arch→Impl）に変更する。(b) 非 file_type ラベルには `<<action>>` 等の視覚的区別を付けるか、注釈で説明する。

### X07: F11 各エージェントの In/Out ↔ F04 §2 オーナーシップ
- 結果: **FAIL**
- 不整合: F11 architect は End Conditions に「docs/api/openapi.yaml 生成済み」と記載し、Procedure step 7 でも生成するが、Out テーブルに `openapi.yaml` が未登録。F04 §2 architect のオーナーシップテーブルにも `openapi.yaml` は存在しない。一方 F11 implementer と test-engineer の In テーブルには `openapi.yaml | architect | ...` と記載されている。
- 修正提案: openapi.yaml を file_type として登録するか、「外部ツール規定形式」（F03 §13 line 1562）として明示的に In/Out テーブルに含める。

### X08: F05 用語集 ↔ F06 不具合分類
- 結果: **PASS**
- error/fault/failure/defect/incident/hazard/HARA/FMEA/FTA の定義が完全に一致。因果連鎖の記述も矛盾なし。

### X09: F02 §3.3/§9 品質管理 ↔ F07 レビュー基準 R1-R6
- 結果: **PASS**
- F02 §9.2（T08）の R1-R6 適用フェーズと F07 の詳細チェックリストの適用範囲が一致。

### X10: F01 CLAUDE.md Agent Teams ↔ F04 §1 エージェント一覧
- 結果: **PASS**
- F01 の18エージェント定義（名前・役割・ディレクトリ）が F04 §1 と完全一致。

### X11: F10 移植ガイド モデルマッピング ↔ F04 §1 model 列
- 結果: **PASS**
- F10 line 168-169 のモデル割当と F04 §1 の model 列が一致:
  - 高（opus）: orchestrator, srs-writer, architect, security-reviewer, implementer, review-agent
  - 中（sonnet）: test-engineer, progress-monitor, change-manager, risk-manager, framework-translation-verifier, user-manual-writer, runbook-writer, incident-reporter, process-improver, decree-writer
  - 低（haiku）: license-checker, kotodama-kun

### X12: F17 SDD比較 Mermaid図 ↔ F04 §1 エージェント一覧
- 結果: **PASS**
- F17 の ④ full-auto-dev フロー図のエージェント構成が18エージェントと一致。

### X13: F18 ランドスケープ 比較テーブル ↔ F04 §1
- 結果: **PASS**
- F18 の比較テーブルにおけるエージェント数「18」の記載が一致。

### X14: F13/F14 ANMS 論文（日英）
- 結果: **PASS**
- 構造（見出し数、図2個、テーブル6個）が同一。用語は glossary-ja.md の定義に準拠。

### X15: F15/F16 ANGS 論文（日英）
- 結果: **PASS**
- 構造（見出し数、図9個、テーブル12+個）が同一。

### X16: F02 付録A シーケンス図 ↔ F04 §3 データフロー図
- 結果: **PASS**
- D09 の参加者（Orch, SRS, Koto, Arch, Sec, Impl, Test, Rev, PM, RM, CM, Lic, UMW, RBW, FTV, IR, PI, DW）と D15 のノードが一致。メッセージラベルも整合。

### X17: F08 S0-S6 構造規約 ↔ F11 全エージェントファイル
- 結果: **PASS**
- 全18エージェントが S0-S6 構造に準拠。YAML フロントマターのフィールド（name, description, model, tools）も F08 の定義と一致。

### X18: F02 §5.5 推奨構造 ↔ 実ファイル構成
- 結果: **PASS**
- F02 の推奨ディレクトリ構造（docs/, src/, tests/, infra/, project-management/, project-records/, process-rules/）とリポジトリ構成が整合。

### X19: F03 §7 file_type マスター ↔ F03 §7.1 ワークフロー参照
- 結果: **FAIL**
- 不整合: F03 §7（T12: line 634-667）は31 file_type を定義。F03 §7.1（T13: line 724-757）は32行で `retrospective-report` を含む。**§7 に `retrospective-report` が欠落。**
- 修正提案: F03 §7 に `retrospective-report` を追加する。

### X20: F03 §7 file_type マスター ↔ F03 §9 Form Block 定義
- 結果: **FAIL**
- 不整合: F03 §9 は §9.1-§9.31 の31 Form Block を定義。しかし `retrospective-report` の Form Block が存在しない。§7 への追加と同時に §9.32 として Form Block を定義する必要がある。
- 修正提案: §9.32 retrospective-report の Form Block を定義する。

### X21: F04 §2 process-improver オーナーシップ ↔ F03 §7 file_type マスター
- 結果: **FAIL**
- 不整合: F04 §2（T35 line 165-167）に `retrospective-report | project-records/improvement/ | 連 | 全フェーズ（フェーズ完了時）` が定義されているが、F03 §7 の マスターテーブルに不在。
- 修正提案: F03 §7 に追加。ディレクトリは `project-records/improvement/`、シングルトン: No。

### X22: F11 architect Out ↔ F11 implementer In / F11 test-engineer In
- 結果: **FAIL**
- 不整合: F11 architect の Out テーブルには `spec-architecture`, `observability-design`, `hw/ai/framework-requirement-spec`, `disaster-recovery-plan` のみ。`openapi.yaml` が Out テーブルに存在しない。しかし:
  - F11 architect End Conditions: 「docs/api/openapi.yaml 生成済み」（line 34）
  - F11 architect Procedure step 7: 「docs/api/openapi.yaml に OpenAPI 3.0 仕様を生成する」（line 78）
  - F11 implementer In: 「openapi.yaml | architect | API エンドポイントの実装」（line 44）
  - F11 test-engineer In: 「openapi.yaml | architect | API エンドポイントの整合性検証」（line 45）
- 修正提案: (a) openapi.yaml を architect の Out テーブルに追加する。(b) openapi.yaml は「外部ツール規定形式」（F03 §13）であり file_type ではないため、Out テーブルに「(非file_type) openapi.yaml」として追記するか、Ownership セクションに注記を追加する。

### X23: F01 条件付きプロセス ↔ F02 条件付きプロセス
- 結果: **PASS**
- F01（T02）の12項目と F02 §2.3 の定義が一致。

---

# Phase 3: 統合判定

## 3.1 指摘一覧

| # | 重大度 | 発見者 | 対象ファイル | 指摘内容 | 修正提案 |
|:-:|:------:|--------|------------|---------|---------|
| 1 | Critical | Expert 4 | F03 (document-rules) | `retrospective-report` が §7 file_type マスターテーブルに未登録。§7.1（line 757）、F04 §2（line 165-167）、F03 §11（line 1481）、F11 process-improver Out、F11 decree-writer In には存在する。マスターテーブルとの不整合により、名前空間プレフィックス（§8）も未定義、Form Block（§9）も欠落。データフローの追跡可能性が断絶する。 | F03 §7 に `retrospective-report` を追加（名前空間: `retrospective-report:`, 目的: ふりかえり・プロセス改善記録, ディレクトリ: `project-records/improvement/`, シングルトン: No）。§8 に名前空間プレフィックスを追加。§9.32 に Form Block を定義する。 |
| 2 | Critical | Expert 6 | F11 (architect-ja.md) | `openapi.yaml` が architect の Out テーブルに未登録。architect の End Conditions（line 34）と Procedure step 7（line 78）で生成を明記し、implementer（In line 44）と test-engineer（In line 45）が消費しているにもかかわらず、Out テーブルに記載がない。In/Out の追跡可能性が破綻する。 | architect の Out テーブルまたは Ownership 注記に `openapi.yaml`（非 file_type、外部ツール規定形式）を追加。F04 §2 architect のオーナーシップセクションにも注記を追加する。 |
| 3 | High | Expert 2 | F04 (agent-list) | D15 データフロー図（line 186-259）は「file_type の流れ」（line 182）と説明されているが、非 file_type のラベルが5つ混在: 「用語チェック済」（line 210, 213）、「用語指摘」（line 227）、「ふりかえり起動」（line 235）、「承認済み改善策」（line 237）、「適用完了報告」（line 238）。図の説明と実態が乖離し、機械的パースが不可能。 | (a) 非 file_type ラベルに視覚的区別（例: `<<action: ...>>`）を付ける。(b) または line 182 の説明を「file_type およびアクションの流れ」に修正する。(c) kotodama-kun, process-improver, decree-writer のフローについて、file_type に準ずるラベル命名を検討する。 |
| 4 | High | Expert 2 | F04 (agent-list), F11 (architect, implementer) | D15 では kotodama-kun がSRS→Arch、Arch→Impl の中間に入るフロー（SRS→Koto→Arch, Arch→Koto→Impl）が描かれているが、F11 architect の In テーブルには `spec-foundation | srs-writer`（直接）、F11 implementer の In テーブルには `spec-architecture | architect`（直接）と記載。kotodama-kun 経由の記載がなく、データフロー図とエージェント定義が不一致。 | (a) D15 のフローを直接フロー（SRS→Arch, Arch→Impl）+ 並行チェック（Koto が非同期で検証）に修正する。または (b) F11 architect/implementer の In テーブルに kotodama-kun からの用語チェック結果を追加する。実態に合った方を選択すること。 |
| 5 | High | Expert 6 | F11 (architect-ja.md) | architect の Out テーブルに `openapi.yaml` が欠落していることの二次的影響: F04 §2 architect オーナーシップテーブルにも openapi.yaml の記載がないため、openapi.yaml の所有権が不明確。F03 §13「外部ツール規定形式」に openapi.yaml は言及されている（line 1562）が、どのエージェントが責任を持つかが定義されていない。 | #2 の修正と合わせて、F04 §2 architect セクションに注記（「openapi.yaml は外部ツール規定形式として architect が生成・管理する」）を追加する。 |
| 6 | Medium | Expert 1 | F02 (process-rules) | §8.3 のふりかえりコマンド説明（`/retrospective`）で、改善策の適用フローに decree-writer への言及がない。F02 §3.3.3 では process-improver → orchestrator（承認）→ decree-writer（適用）の3段階を定義しているが、§8.3 ではこの最終段階が欠落している。 | §8.3 に decree-writer による改善適用ステップを追記する。 |
| 7 | Medium | Expert 4 | F03 (document-rules) | §9 Form Block 定義が §9.31（stakeholder-register）で終了しており、`retrospective-report` の §9.32 が欠落。§7 への登録と同時に §9.32 を定義する必要がある。 | §9.32 を作成。想定フィールド: `retrospective-report:phase`（対象フェーズ）, `retrospective-report:defect_pattern_count`（分析した defect パターン数）, `retrospective-report:improvement_count`（提案改善策数）, `retrospective-report:approval_status`（承認状態: proposed/approved/applied/rejected）等。 |
| 8 | Medium | Expert 5 | F04 (agent-list) | D15 の kotodama-kun 関連ラベル「用語チェック済」は成果物名でもアクション名でもなく曖昧。データフロー図のラベルとしてパース不可能。 | 専用の通知メカニズム名を定義するか、file_type を借用して「review（用語チェック）」のように既存 file_type + 修飾子で表現する。 |
| 9 | Low | Expert 3 | F23 (handoff) | line 41 に「31 file_type（§7登録済み、うち9タイプのForm Block定義済み）」とあるが、現在は §7 に31タイプ（retrospective-report 除く）、§9 に31 Form Block が定義済み。引継ぎ文書が古い状態を記録している。 | F23 の該当記述を更新する。ただし引継ぎ文書は時点情報であるため、優先度は低い。 |
| 10 | Low | Expert 5 | F02 (process-rules), F04 (agent-list) | D01（F02 §1.2）と D15（F04 §3）が同等の情報を異なるフォーマットで二重記載。DRY 原則の観点では、一方を Single Source of Truth とし、他方は参照にすべき。 | F02 §1.2 は概要図として残し、「詳細は agent-list-ja.md §3 参照」の注記を追加。重複メンテナンスのリスクを低減する。 |

---

## 3.2 総合判定

| 項目 | 件数 |
|------|:----:|
| Critical | 2 |
| High | 3 |
| Medium | 3 |
| Low | 2 |
| **合計** | **10** |

### 判定: **FAIL**

- Critical ≧ 1（2件）のため **FAIL**。
- Critical 0 になっても High = 3 のため CONDITIONAL PASS 止まり。

### 必須修正事項（Critical）

1. **F03 §7 に `retrospective-report` を追加する。** 同時に §8（名前空間プレフィックス）と §9.32（Form Block 定義）も追加する。
2. **F11 architect-ja.md の Out テーブルに `openapi.yaml` を追加する。** F04 §2 architect セクションにも注記を追加する。

### 推奨修正事項（High）

3. **F04 §3 データフロー図のラベル体系を整理する。** 非 file_type ラベルを視覚的に区別するか、図の説明を修正する。
4. **kotodama-kun 経由フローの実態を明確化する。** D15 のフローパターンとエージェント定義の In テーブルを一致させる。
5. **openapi.yaml の所有権を明確化する。** F04 §2 architect に外部ツール規定形式の管理責任を注記する。

---

*レビュー実施: 6名諮問団（プロセス工学・エージェントアーキテクチャ・用語統制・文書構造・図表整合性・プロンプト品質）*
*ツール: gr-sw-maker council-review-ja*
``````
