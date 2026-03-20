# プロジェクト: [プロジェクト名]

## プロジェクト概要

[ユーザーが提示するコンセプトをここに記載]

## 開発方針

- 本プロジェクトはほぼ全自動開発で進行する
- ユーザーへの確認は重要判断のみに限定する
- 軽微な技術的判断はClaude Codeが自律的に行う
- 仕様書はdocs/spec/配下に出力する（形式はプロジェクト規模に応じてANMS/ANPSを選択）。その他の設計成果物はdocs/配下にMarkdownで出力する
- プロセス文書（パイプライン状態、引継ぎ、進捗）はproject-management/配下に出力する
- プロセス記録（レビュー、意思決定、リスク、defect、CR、トレーサビリティ）はproject-records/配下に出力する
- コードはsrc/配下、テストはtests/配下、IaCはinfra/配下に配置する
- 運用規則は以下を参照する:
  - process-rules/full-auto-dev-process-rules-ja.md（プロセス規則: フェーズ定義・品質管理）
  - process-rules/full-auto-dev-document-rules-ja.md **v0.0.0**（文書管理規則: 命名・ブロック構造・バージョニング。PoC前のPre-release）
  - process-rules/agent-list-ja.md（エージェント一覧: 名簿・オーナーシップ・データフロー）
  - process-rules/prompt-structure-ja.md（プロンプト構造規約: S0-S6）
  - process-rules/glossary-ja.md（用語集: 選定理由・略称判定・紛らわしい対の区別）
  - process-rules/defect-taxonomy-ja.md（不具合系用語の体系: error/fault/failure/defect/incident/hazard の定義と使い分け）
  - process-rules/review-standards-ja.md（レビュー観点規約: R1-R6）

## 言語設定

- プロジェクト主言語: [例: ja]
- 翻訳言語: [例: en（空欄 = 単一言語プロジェクト）]
- 主言語のファイルはサフィックスなし。翻訳版のみ `-{lang}.md` を付与する
- フィールド名・名前空間は英語固定。フィールド値・Detail Block・エージェントプロンプトは主言語で記述する

## 仕様形式の選択

プロジェクト規模に応じて仕様形式を選択する:

| レベル | 略称 | 正式名称 | 表現 | 規模 |
|--------|------|----------|------|------|
| 1 | ANMS | AI-Native Minimal Spec | 単一Markdownファイル | 1コンテキストウィンドウに収まる |
| 2 | ANPS | AI-Native Plural Spec | 複数Markdownファイル + Common Block | 収まらない、GraphDB不要 |
| 3 | ANGS | AI-Native Graph Spec | GraphDB + Git（MDはビュー） | 大規模 |

- テンプレート: process-rules/spec-template-ja.md
- setup フェーズでユーザーと規模を判断し、形式を決定する

## 技術スタック

- 言語: [例: TypeScript]
- フレームワーク: [例: Next.js 15]
- データベース: [例: PostgreSQL]
- テストフレームワーク: [例: Vitest]
- 性能テスト: [例: k6]
- コンテナ: [例: Docker / docker-compose]
- IaC: [例: Terraform]
- CI/CD: [例: GitHub Actions]
- 可観測性: [例: OpenTelemetry + Grafana]

## ブランチ戦略

- メインブランチ: main（直接コミット禁止）
- 開発ブランチ: develop（統合ブランチ）
- 機能ブランチ: feature/{issue番号}-{説明}（develop から分岐）
- defect 修正ブランチ: fix/{issue番号}-{説明}
- リリースブランチ: release/v{バージョン}（develop から分岐）
- PRマージ: develop → main は review-agent PASS 後にのみ許可
- Agent Teams の並列実装: git worktree を使用し、各エージェントは専用ブランチで作業

## コーディング規約

- [プロジェクト固有のルール]
- ESLint設定に従う
- すべての公開関数にJSDocコメントを付与する
- エラーハンドリングは明示的に行う
- 構造化ログ（JSON形式）を使用する（console.logは禁止）
- **命名は言霊:** `type`, `data`, `info`, `value` 等の意味を持たない汎用語は禁止。名前は「それが何か」を一目で伝えること。何の種別かをドメインで限定する（例: `status` → `decision_status`）
- **AI/LLMプロンプト配置原則:** 製品のプロンプトは `src/` 配下（コードと同等）。プロジェクトを回すプロンプトは `.claude/` 配下（メタレイヤー）。混在させない

## セキュリティ要求

- OWASP Top 10 への対策を必須とする
- 認証にはJWTを使用する
- 入力値は必ずバリデーションする
- SQLインジェクション対策としてパラメタライズドクエリを使用する
- SAST: CodeQL（GitHub Actions で自動実行）
- SCA: npm audit / Snyk（依存関係追加時に必ず実行）
- シークレットスキャン: git-secrets または truffleHog（コミット前フック）
- スキャン結果: project-records/security/ に記録する（SAST/SCA/シークレットスキャン）

## テスト方針

- カバレッジ目標: 80%以上
- 単体テスト: すべてのビジネスロジック（合格率95%以上）
- 結合テスト: API エンドポイント（合格率100%）
- E2Eテスト: 主要ユーザーフロー
- 性能テスト: 非機能要求の数値目標をk6で検証

## APIドキュメント

- OpenAPI 3.0形式で docs/api/ に出力する
- architect エージェントが仕様書 Ch3 詳細化と同時に生成する
- 実装完了後 test-engineer がエンドポイントとの整合性を検証する

## 可観測性要求

- ログ: 構造化JSON形式、INFO/WARN/ERROR の3レベル
- メトリクス: RED（Rate/Error/Duration）メトリクスを全APIに計装
- トレーシング: OpenTelemetryでリクエスト追跡
- アラート: エラーレート1%超、P99レイテンシがSLA超過でアラート

## Agent Teams 設定

Agent Teamsで作業する場合、以下のロール定義を使用する:

- **Lead Agent（orchestrator）**: プロジェクト全体のオーケストレーション。pipeline-state.md / executive-dashboard.md / final-report.md / decision記録を管理する。フェーズ遷移と品質ゲートを制御する。`.claude/agents/lead.md` で定義
- **SRS Agent（srs-writer）**: user-order.md（3問形式）+ process-rules/spec-template-ja.md を基に、仕様書を docs/spec/ に作成（Ch1-2 Foundation・Requirements、形式はsetupフェーズで選定）。ユーザーコンセプトを構造化する
- **Architect Agent（architect）**: docs/spec/ の ANMS 仕様書 Ch3-6 を詳細化（Architecture・Specification・Test Strategy・Design Principles）。docs/api/ にOpenAPI仕様を生成する
- **Security Agent（security-reviewer）**: docs/security/ にセキュリティ設計を作成。実装コードの脆弱性レビューを行う。スキャン結果はproject-records/security/にsecurity-scan-reportとして記録する
- **Implementer Agent（implementer）**: src/ 配下にコードを実装する。設計文書に従い、Clean Architecture・DIPを遵守する。単体テストも作成する
- **Test Agent（test-engineer）**: tests/ 配下にテストを作成・実行する。カバレッジレポートを生成する
- **Review Agent（review-agent）**: project-records/reviews/ にレビュー報告を出力する。R1〜R6の観点（SW工学原則・並行性・パフォーマンス）でレビューし、Critical/High指摘がゼロになるまで次フェーズへの移行をブロックする
- **PM Agent（progress-monitor）**: project-management/progress/ に進捗レポートを出力する。WBS/defect curve/コストを管理する
- **Change Manager Agent（change-manager）**: 仕様書承認後のユーザー起点の変更要求をproject-records/change-requests/に記録し、影響分析を行う。impact_level=highはユーザー承認必須。AI側の技術的変更はdefect/decisionで管理する
- **Risk Manager Agent（risk-manager）**: project-records/risks/にリスクエントリを記録し、risk-register.mdを管理する。score≧6はユーザーに通知
- **License Checker Agent（license-checker）**: 依存ライブラリ追加時にライセンス互換性を確認し、帰属表示を管理する
- **Kotodama-kun Agent（kotodama-kun）**: 成果物の用語・命名がフレームワーク用語集およびプロジェクト用語集に準拠しているかチェックする

## 重要判断の基準

以下の場合はユーザーに確認を求めること:

- アーキテクチャに関する根本的な選択
- 外部依存（HW/AI/フレームワーク）の選定（dependency-selection フェーズ）
- 外部サービス/APIの選定
- セキュリティモデルの重大な変更
- 予算やスケジュールに影響する判断
- 要求の曖昧さにより複数の解釈が可能な場合
- リスクスコア6以上のリスクが発生した場合
- コスト予算の80%に到達した場合
- 変更要求の影響度がHighの場合

以下の場合はClaude Codeが自律的に判断してよい:

- ライブラリの具体的なバージョン選定
- コードのリファクタリング方針
- テストケースの設計
- ドキュメントの構成
- defect 修正の方法

## 必須プロセス設定（process-rules/full-auto-dev-process-rules-ja.md 第3章参照）

- 変更管理: 仕様書承認後の変更はchange-managerエージェント経由で処理する
- リスク管理: planning フェーズ完了時にリスク台帳を作成し、各フェーズ開始時に更新する
- トレーサビリティ: 要求ID→設計ID→テストIDの対応をproject-records/traceability/に記録する
- 問題管理: defect は project-records/defects/ に defect 票として記録し、根本原因分析を行う
- ライセンス管理: 依存ライブラリ追加時にlicense-checkerエージェントを実行する
- 監査記録: 重要判断はproject-records/decisions/に記録する
- コスト管理: APIトークン消費をproject-management/progress/cost-log.jsonに記録する

## 条件付きプロセス（setup フェーズで判断）

以下は該当する条件が存在する場合のみ有効化する:
- 法規調査: [有効/無効] - 理由: [記載]
- 特許調査: [有効/無効] - 理由: [記載]
- 技術動向調査: [有効/無効] - 理由: [記載]
- 機能安全(HARA/FMEA/FTA): [有効/無効] - 理由: [記載]
- アクセシビリティ(WCAG 2.1): [有効/無効] - 理由: [記載]
- HW連携: [有効/無効] - 理由: [記載]
- AI/LLM連携: [有効/無効] - 理由: [記載]
- フレームワーク要求定義: [有効/無効] - 理由: [記載]
- HW生産工程管理: [有効/無効] - 理由: [記載]
- 製品i18n/l10n: [有効/無効] - 理由: [記載]
- 認証取得: [有効/無効] - 理由: [記載]
- 運用・保守: [有効/無効] - 理由: [記載]

## ドキュメントの基本形式 (MCBSMD)

- Output the entire content **as a single Markdown code block** so it can be copied in one go.
- **Enclose the entire Markdown with six backticks ` `````` ` at the beginning and end.** Specify its language as markdown.
- **Use these six backticks only once as the outermost enclosure.**
- **Never output speculation or fabrications.** If something is unclear or requires investigation, explicitly state so.
- This method is called **MCBSMD** (Multiple Code Blocks in a Single Markdown)

### Code and Diagram Block Rules

- As a rule, use Mermaid for diagrams. Use PlantUML only when the diagram cannot be expressed in Mermaid.
- Any diagrams or software code inside the Markdown must each be enclosed in their own code blocks using triple backticks ` ``` `.
- Each code block must specify a language or file type (e.g., ` ```python ` or ` ```mermaid `).
- Each code or diagram block must be preceded by a descriptive title in the format **title:**
  (e.g., `**System Architecture:**`, `**Login Flow:**`)
- Always follow the structure below for every code or diagram block:

  > **title:**
  >
  > ```language
  > (code or diagram content here without truncation or abbreviation)
  > ```
  >
  > Write the explanation for the code block here, immediately after the block, following a blank line.

- Do not write explanations inside the code blocks.
- In all diagrams, use alphanumeric characters and underscores (`_`) by default; non-ASCII plain text (no spaces) is permitted when necessary. Special symbols (e.g., `\`, `/`, `|`, `<`, `>`, `{`, `}`) are strictly prohibited.
- Output all diagram content without omission. Never use `...` or any shorthand.

### Diagram Label and Notation Rules

- All arrows and relationship lines in diagrams MUST have labels. Follow these notation rules:
  1. Mermaid `flowchart` and `graph`: place the label inside the arrow using pipes (e.g., `A -->|Label| B`)
  2. Other Mermaid diagrams / All PlantUML: place the label after the arrow using a colon (e.g., `A --> B : Label`)
- For line breaks in labels or node text:
  1. Mermaid: use `<br/>` inside a quoted string (e.g., `A -->|"Line1<br/>Line2"| B`, `A["Line1<br/>Line2"]`)
  2. PlantUML: use `\n` (e.g., `A -> B : Line1\nLine2`)

### Math Rules

- Use standard LaTeX notation for all mathematical formulas.
  1. Inline math: always use single dollar signs. Place a space before the opening `$`
     and a space after the closing `$`
     (e.g., `The function is $y = x + 1$ here.`)
  2. Block equations: always place `$$` on its own line, above and below the formula.
     Example:
     > $$
     > E = mc^2
     > $$
