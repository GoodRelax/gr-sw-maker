user-order.mdを読み込み、ほぼ全自動ソフトウェア開発を開始してください。

**参照規則:** process-rules/full-auto-dev-document-rules.md（文書管理規則）、process-rules/full-auto-dev-process-rules.md（プロセス規則）に従うこと。

以下のフェーズを順次実行します:

## Phase 0: 条件付きプロセスの評価（必須・仕様書作成前に実行）
0a. user-order.md を読み込む
0b. user-order.mdのバリデーション: 以下の必須項目が記載されているか確認する
    - 何を作りたいか（What）、それはどうしてか（Why）
    → 不足項目がある場合: ユーザーに対話で補完してから次へ進む
0b2. user-order.md の内容を基に CLAUDE.md を提案する（プロジェクト名、技術スタック、コーディング規約、セキュリティ方針、ブランチ戦略、言語設定など）
    - 言語設定: プロジェクト主言語（ISO 639-1）と翻訳言語を決定する
    → ユーザーの承認後に CLAUDE.md を配置する
0c. 機能安全の要否を評価する（人命・インフラへの影響、安全規格準拠）
    → 該当する場合: 即座にユーザーに確認を求め、安全要求を確定してから次へ進む
0d. 法規調査の要否を評価する（個人情報・医療・金融・通信・EU市場・公共）
    → 該当する場合: CLAUDE.mdに追記し、仕様書の非機能要求に規制要求を含める
0e. 特許調査の要否を評価する（新規アルゴリズム・AIモデル・商用販売）
    → 該当する場合: WBSの design フェーズ開始前に特許調査タスクを追加する
0f. 技術動向調査の要否を評価する（6ヶ月超・急変技術領域・EOL近接）
    → 該当する場合: 各フェーズ開始時に技術動向確認ステップをWBSに追加する
0g. アクセシビリティ（WCAG 2.1）の要否を評価する（Webアプリ・EU市場向け等）
    → 該当する場合: CLAUDE.mdに追記し、仕様書のNFRにアクセシビリティ要求を含める
0h. HW連携の要否を評価する（組込み/IoT・物理デバイス制御・センサー/アクチュエータ）
    → 該当する場合: CLAUDE.mdに追記し、planningフェーズのインタビューにHW要求を含める
0i. AI/LLM連携の要否を評価する（AI機能組込み・プロンプトエンジニアリング・推論結果の利用）
    → 該当する場合: CLAUDE.mdに追記し、planningフェーズのインタビューにAI要求を含める
0j. フレームワーク要求定義の要否を評価する（非標準I/Fフレームワーク・差し替え想定・EOLリスク）
    → 該当する場合: CLAUDE.mdに追記し、dependency-selectionフェーズで評価・選定を実施する
0k. HW生産工程管理の要否を評価する（HW連携かつ量産・サプライチェーン管理）
    → 該当する場合: WBSにサプライチェーン管理・受入検査タスクを追加する
0l. 製品i18n/l10nの要否を評価する（多言語対応・RTL言語・ローカライゼーション）
    → 該当する場合: 仕様書Ch2のNFRにi18n要求を追加する
0m. 認証取得の要否を評価する（CE/FCC/医療機器認証等の公的認証）
    → 該当する場合: WBSに認証取得タスクを追加し、提出文書作成を計画する
0n. 運用・保守の要否を評価する（本番環境運用・SLA保証・リリース後保守）
    → 該当する場合: operationフェーズを有効化し、designフェーズでRPO/RTO・監視体制を設計に含める
0n2. 実機テストの要否を評価する（HW連携が有効かつユーザー立会での実機動作確認が必要）
    → 該当する場合: testing フェーズで field-test-engineer / feedback-classifier / field-issue-analyst をアクティベートする
0o. 評価結果をユーザーに報告し、条件付きプロセスの追加について確認を求める
0p. project-manager を起動し、project-management/pipeline-state.md を初期化する

## Phase 1: 企画（インタビュー＆仕様）
1a. user-order.md を解析する
1b. srs-writer を起動し、user-order.md を基にユーザーへ構造化インタビューを実施する
    - ドメイン深堀、スコープ境界、エッジケース、優先度、制約、既知の妥協、非機能要求
    - **ドメイン境界識別**: 「このプロジェクト固有のコアロジックは何か？」「この理論/アルゴリズムはドメインか、既存ライブラリとして使うだけか？」を明確化する
    - 1回の質問は3〜5個まで。回答を要約して確認しながら進める
    - ユーザーが「もう十分」と判断したら終了する
1c. srs-writer がインタビュー結果を project-management/interview-record.md に記録し、ユーザーに確認を求める
1d. srs-writer がモック/サンプル/PoCを作成し、ユーザーにフィードバックを求める（UI系: ワイヤーフレーム/HTMLモック、API系: OpenAPIスニペット、データ系: ER図/サンプルJSON）。フィードバックを反映し、ユーザーが「イメージ通り」と判断するまでイテレーションする
1e. srs-writer が process-rules/spec-template.md を参照し、インタビュー結果 + user-order.md を入力に仕様書を docs/spec/[project-name]-spec.md に作成する（Ch1-2: Foundation・Requirements、形式はsetupフェーズで選定）
1f. srs-writer が Ch3-6 のスケルトン（見出しのみ）を同一ファイルに配置する
1g. 仕様書の概要をユーザーに報告し承認を求める
1h. review-agentで仕様書 Ch1-2 の品質レビュー（R1観点: R1a構造品質 + R1b表現品質）を実施する
1i. technical-authority を起動し GATE-INTERVIEW と GATE-PLANNING を判定する（プロセス規則 §9.4.1）。**この遷移は 2 つのゲートを持つ。**PASS後に次へ進む

## Phase 2: 外部依存選定（条件付き — HW/AI/Framework連携がある場合のみ）
2a. Phase 0 の条件付きプロセス評価結果を確認する
    → HW連携・AI/LLM連携・フレームワーク要求定義のいずれも該当しない場合: Phase 3 へスキップ
2b. architect を起動し、外部依存（HW/AI/フレームワーク）の評価・選定を行う
2c. architect が各外部依存の requirement-spec を docs/ 配下に作成する（hw-requirement-spec, ai-requirement-spec, framework-requirement-spec）
2d. architect が Adapter層のI/F設計（DIPに基づく抽象化）を行う
2e. project-manager を起動し、選定結果を project-records/decisions/ に記録する
2f. ユーザーに選定結果を報告し承認を求める
2g. technical-authority を起動し GATE-DEPENDENCY を判定する（プロセス規則 §9.4.1）

## Phase 3: 設計（仕様書 Ch1-2 承認後）
3a. architect を起動し、docs/spec/ の仕様書 Ch3 (Architecture) を詳細化する（レイヤー仕訳を先行実施: 全コンポーネントをEntity/UseCase/Adapter/Frameworkに分類し、Ch3冒頭に明記）
3b. architect が docs/spec/ の仕様書 Ch4 (Specification) を Gherkin で詳細化する
3c. architect が docs/spec/ の仕様書 Ch5 (Test Strategy) を定義する
3d. architect が docs/spec/ の仕様書 Ch6 (Design Principles Compliance) を設定する
3e. architect が docs/api/openapi.yaml にOpenAPI 3.0仕様を生成する
3f. security-reviewer を起動し、docs/security/ に threat-model（STRIDE）と security-architecture を作成する
3g. architect が docs/observability/observability-design.md に可観測性設計（ログ・メトリクス・トレーシング・アラート）を作成する
3g2. architect が docs/operations/deployment-design.md にデプロイ設計（環境定義・デプロイ手順・ロールバック・シークレット管理）を作成する
3h. progress-monitor を起動し、project-management/progress/wbs.md にWBSとガントチャートを作成する
3i. risk-managerでリスク台帳を project-records/risks/ に作成する
3j. [機能安全が有効な場合] 安全分析を実施する（詳細は defect-taxonomy.md §7 参照）:
    - HARA: Ch3 詳細化の前に hazard 一覧・safety goal・ASIL/SIL 割当を実施 → project-records/safety/hara-*.md
    - safety requirement を spec-foundation Ch2 NFR に追加
    - FMEA: Ch3 確定後にコンポーネント別 failure mode 分析を実施 → project-records/safety/fmea-*.md
    - FTA: ASIL C 以上の hazard がある場合、原因の論理構造を分析 → project-records/safety/fta-*.md
3k. review-agentで仕様書 Ch3-4・設計の品質レビュー（R2/R4/R5/R7観点）を実施する
3l. technical-authority を起動し GATE-DESIGN を判定する（プロセス規則 §9.4.1）。PASS後に次へ進む

## Phase 4: 実装
4a. implementer を起動し、仕様書に基づきsrc/にコードを実装する（Git worktreeで並列実装）
4b. implementer が可観測性設計に基づき構造化ログ・メトリクス計装・トレーシングをコードに組み込む
4c. implementer が tests/に単体テストを作成・実行する
4c2. implementer が deployment-design に基づき infra/ の IaC コードを実装する
4d. review-agentで実装コードのレビュー（R2/R3/R4/R5/R7観点）を実施し、PASS後に次へ進む
4e. security-reviewerでSCAスキャン（npm audit等）を実行し、Critical/High脆弱性がゼロか確認する
4f. license-checkerでライセンス確認を実施する
4g. technical-authority を起動し GATE-IMPL を判定する（プロセス規則 §9.4.1）

## Phase 5: テスト
5a. test-engineer を起動し、結合テストを作成・実行する
5b. test-engineer がシステムテストを可能な範囲で作成・実行する
5c. test-engineer が性能テストを仕様書 Ch2 のNFR数値目標に基づき実行し、結果をproject-records/performance/に記録する
5c2. [実機テストが有効な場合] field-test-engineer を起動して実機テストを実施し、feedback-classifier で分類、field-issue-analyst で原因分析と対策立案を行う（実機テスト フィードバック管理規則に従う）
5d. progress-monitor を起動し、テスト消化曲線とdefect curveを更新する
5e. review-agentでテストコードのレビュー（R6観点）を実施する
5f. technical-authority を起動し GATE-TEST を判定する（プロセス規則 §9.4.1）

## Phase 6: 納品
6a. review-agentで全成果物の最終レビュー（R1〜R7全観点）を実施する
    → FAILした場合: 指摘の観点に応じた該当フェーズへ戻り修正する
6b. implementer がコンテナイメージをビルドし、infra/のIaC構成を確認する
6c. デプロイメントを実行し、スモークテストで基本動作を確認する
6d. 監視・アラート設定が可観測性設計と一致しているか確認する
6e. ロールバック手順を確認・文書化する
6f. project-manager を起動し、final-report.md に最終レポートを作成する
6f2. user-manual-writer を起動し、docs/ にユーザーマニュアルを作成する
6f3. runbook-writer を起動し、docs/operations/ に運用手順書を作成する
6g. test-engineer が受入テスト手順書を作成する
6g2. technical-authority を起動し GATE-DELIVERY を判定する（プロセス規則 §9.4.1）
6h. ユーザーに完了報告する

## Phase 7: 運用・保守（条件付き — 運用・保守が有効な場合のみ）
7a. incident management 体制を確立する（incident-report テンプレート配置）
7b. パッチ適用・セキュリティスキャンの定期実行を設定する
7c. SLA 監視（可観測性設計に基づくアラート・ダッシュボード）を確認する
7d. disaster-recovery-plan に基づく復旧手順の訓練を計画する
7e. 本番 incident 発生時は incident-reporter を起動し、incident-report の作成と根本原因分析を実施する
7f. プロジェクトを終了する場合は technical-authority を起動し GATE-EOL を判定する（プロセス規則 §9.4.1）

## 各フェーズ完了時の共通手順（全フェーズに適用）
Fa. kotodama-kun を起動し、当該フェーズの全 Out の用語・命名を一括チェックする
Fb. progress-monitor を起動し、project-management/progress/session-state.json を読んで当該フェーズのトークン消費とコストを cost-log.json に追記する
    → session-state.json が無い、または sink_heartbeat_at が古い場合: 計測経路が停止している。計測不能である旨を cost-log.json に記録し、ユーザーに報告する。**消費量を推測で書いてはならない（MUST NOT）**
Fc. session-state.json の compaction_count が前フェーズより増えていたら文脈の圧縮が起きている。handoff を作成して再開点を残す
    → コンテキスト使用率は観測できない。使用率の推定値で中断を判断してはならない（MUST NOT）。中断の要否はユーザーが判断する
Fd. project-manager を起動し、pipeline-state.md と executive-dashboard.md を更新してユーザーに報告する
Fe. process-improver を起動し、ふりかえりと defect パターンの根本原因分析を実施する
Ff. Fe の改善策がユーザーに承認された場合のみ、decree-writer を起動してガバナンスファイルに適用する
Fg. 仕様書承認後にユーザーから変更要求が出た場合は、change-manager を起動して影響分析と記録を行う

> framework-translation-verifier はフレームワーク文書そのものの保守用であり、本パイプラインでは起動しない。

各フェーズ完了時に進捗を報告してください。
重要な判断が必要な場合はユーザーに確認を求めてください。
軽微な技術的判断は自律的に行ってください。
