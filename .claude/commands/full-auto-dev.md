user-order.mdを読み込み、ほぼ全自動ソフトウェア開発を開始してください。

**参照規則:** process-rules/full-auto-dev-document-rules-ja.md（文書管理規則）、process-rules/full-auto-dev-process-rules-ja.md（プロセス規則）に従うこと。

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
0o. 評価結果をユーザーに報告し、条件付きプロセスの追加について確認を求める

## Phase 1: 企画（インタビュー＆仕様）
1a. user-order.md を解析する
1b. user-order.md を基にユーザーへ構造化インタビューを実施する
    - ドメイン深堀、スコープ境界、エッジケース、優先度、制約、既知の妥協、非機能要求
    - **ドメイン境界識別**: 「このプロジェクト固有のコアロジックは何か？」「この理論/アルゴリズムはドメインか、既存ライブラリとして使うだけか？」を明確化する
    - 1回の質問は3〜5個まで。回答を要約して確認しながら進める
    - ユーザーが「もう十分」と判断したら終了する
1c. インタビュー結果を project-management/interview-record.md に記録し、ユーザーに確認を求める
1d. モック/サンプル/PoCを作成し、ユーザーにフィードバックを求める（UI系: ワイヤーフレーム/HTMLモック、API系: OpenAPIスニペット、データ系: ER図/サンプルJSON）。フィードバックを反映し、ユーザーが「イメージ通り」と判断するまでイテレーションする
1e. process-rules/spec-template-ja.md を参照し、インタビュー結果 + user-order.md を入力に仕様書を docs/spec/[project-name]-spec.md に作成する（Ch1-2: Foundation・Requirements、形式はsetupフェーズで選定）
1f. Ch3-6 のスケルトン（見出しのみ）を同一ファイルに配置する
1g. 仕様書の概要をユーザーに報告し承認を求める
1h. review-agentで仕様書 Ch1-2 の品質レビュー（R1観点: R1a構造品質 + R1b表現品質）を実施し、PASS後に次へ進む

## Phase 2: 外部依存選定（条件付き — HW/AI/Framework連携がある場合のみ）
2a. Phase 0 の条件付きプロセス評価結果を確認する
    → HW連携・AI/LLM連携・フレームワーク要求定義のいずれも該当しない場合: Phase 3 へスキップ
2b. 外部依存（HW/AI/フレームワーク）の評価・選定を行う
2c. 各外部依存の requirement-spec を docs/ 配下に作成する（hw-requirement-spec, ai-requirement-spec, framework-requirement-spec）
2d. Adapter層のI/F設計（DIPに基づく抽象化）を行う
2e. 選定結果を project-records/decisions/ に記録する
2f. ユーザーに選定結果を報告し承認を求める

## Phase 3: 設計（仕様書 Ch1-2 承認後）
3a. docs/spec/ の仕様書 Ch3 (Architecture) を詳細化する（レイヤー仕訳を先行実施: 全コンポーネントをEntity/UseCase/Adapter/Frameworkに分類し、Ch3冒頭に明記）
3b. docs/spec/ の仕様書 Ch4 (Specification) を Gherkin で詳細化する
3c. docs/spec/ の仕様書 Ch5 (Test Strategy) を定義する
3d. docs/spec/ の仕様書 Ch6 (Design Principles Compliance) を設定する
3e. docs/api/openapi.yaml にOpenAPI 3.0仕様を生成する
3f. docs/security/ にセキュリティ設計を作成する
3g. docs/observability/observability-design.md に可観測性設計（ログ・メトリクス・トレーシング・アラート）を作成する
3h. project-management/progress/wbs.md にWBSとガントチャートを作成する
3i. risk-managerでリスク台帳を project-records/risks/ に作成する
3j. [機能安全が有効な場合] 安全分析を実施する（詳細は defect-taxonomy-ja.md §7 参照）:
    - HARA: Ch3 詳細化の前に hazard 一覧・safety goal・ASIL/SIL 割当を実施 → project-records/safety/hara-*.md
    - safety requirement を spec-foundation Ch2 NFR に追加
    - FMEA: Ch3 確定後にコンポーネント別 failure mode 分析を実施 → project-records/safety/fmea-*.md
    - FTA: ASIL C 以上の hazard がある場合、原因の論理構造を分析 → project-records/safety/fta-*.md
3k. review-agentで仕様書 Ch3-4・設計の品質レビュー（R2/R4/R5観点）を実施し、PASS後に次へ進む

## Phase 4: 実装
4a. 仕様書に基づきsrc/にコードを実装する（Git worktreeで並列実装）
4b. 可観測性設計に基づき構造化ログ・メトリクス計装・トレーシングをコードに組み込む
4c. tests/に単体テストを作成・実行する
4d. review-agentで実装コードのレビュー（R2/R3/R4/R5観点）を実施し、PASS後に次へ進む
4e. security-reviewerでSCAスキャン（npm audit等）を実行し、Critical/High脆弱性がゼロか確認する
4f. license-checkerでライセンス確認を実施する

## Phase 5: テスト
5a. 結合テストを作成・実行する
5b. システムテストを可能な範囲で作成・実行する
5c. 性能テストを仕様書 Ch2 のNFR数値目標に基づき実行し、結果をproject-records/performance/に記録する
5d. テスト消化曲線とdefect curveを更新する
5e. review-agentでテストコードのレビュー（R6観点）を実施する
5f. 品質基準を評価する

## Phase 6: 納品
6a. review-agentで全成果物の最終レビュー（R1〜R6全観点）を実施する
    → FAILした場合: 指摘の観点に応じた該当フェーズへ戻り修正する
6b. コンテナイメージをビルドし、infra/のIaC構成を確認する
6c. デプロイメントを実行し、スモークテストで基本動作を確認する
6d. 監視・アラート設定が可観測性設計と一致しているか確認する
6e. ロールバック手順を確認・文書化する
6f. final-report.md に最終レポートを作成する
6g. 受入テスト手順書を作成する
6h. ユーザーに完了報告する

## Phase 7: 運用・保守（条件付き — 運用・保守が有効な場合のみ）
7a. incident management 体制を確立する（incident-report テンプレート配置）
7b. パッチ適用・セキュリティスキャンの定期実行を設定する
7c. SLA 監視（可観測性設計に基づくアラート・ダッシュボード）を確認する
7d. disaster-recovery-plan に基づく復旧手順の訓練を計画する
7e. 本番 incident 発生時は incident-report を作成し、根本原因分析を実施する

各フェーズ完了時に進捗を報告してください。
重要な判断が必要な場合はユーザーに確認を求めてください。
軽微な技術的判断は自律的に行ってください。
