# 用語集

> **本文書の位置づけ:** full-auto-dev フレームワークで使用する用語の定義。辞書的な一般用語は含まない。フレームワーク固有の意味・選定理由・非採用の代替を記録する。
> **関連文書:** [プロセス規則](full-auto-dev-process-rules-ja.md)、[文書管理規則](full-auto-dev-document-rules-ja.md)、[エージェント一覧](agent-list-ja.md)、[不具合系用語の体系](defect-taxonomy-ja.md)

---

## 1. 意図的に選定した用語

同義語が複数ある中で、意図的に1つを選んだ用語。非採用の代替とその理由を記録する。

| 用語 | English | 定義 | 非採用 | 理由 |
|------|---------|------|--------|------|
| 要求 | requirement | システムが満たすべき条件。EARS 構文で形式化する | 要件 | 要求が根源（求めるもの）。要件は派生（満たすべき条件）。Requirements = 要求で統一 |
| インタビュー | interview | ユーザーへの構造化質問による要求抽出 | ヒアリング | hearing は和製英語。英語では法廷審問・聴覚の意味 |
| status | ステータス | ワークフロー上の現在位置を示す値 | state | state（存在モード）と status（進捗位置）の区別は実務上不要。status に統一 |
| error | error | 人間の認識・判断・操作のミス。fault の原因（IEEE 1044）。詳細は [defect-taxonomy](defect-taxonomy-ja.md) 参照 | 誤り | 英単語で統一。日本語の「誤り」は日常語で技術的精度が低い |
| fault | fault | error の結果、コード・設計・仕様に潜在する不正状態。発見されるまで発現しない（IEEE 1044, IEC 61508） | フォールト, 欠陥 | 英単語で統一。カタカナも不採用 |
| failure | failure | fault が実行時に発現し、要求を満たさなくなった事象（IEEE 1044, IEC 61508） | フェイラー, 故障, 障害 | 「故障」はHW寄り、「障害」は多義的。英単語で統一 |
| defect | defect | テスト・運用で発見された failure（または fault）の正式記録（file_type）。因果連鎖: error → fault → failure → defect | 障害, bug, バグ, 不具合 | 「障害」は failure/incident と混同するため廃止。英単語で統一 |
| incident | incident | 本番環境で発生した計画外のサービス影響事象（ITIL, ISO 20000）。file_type: incident-report | 障害, インシデント | 英単語で統一。カタカナも不採用 |
| hazard | hazard | failure が人命・財産・環境に害を及ぼしうる危険源（IEC 61508）。条件付きプロセス「機能安全」が有効な場合に使用 | ハザード | 英単語で統一 |
| fault origin | fault origin | fault が混入したフェーズ。requirements fault / design fault / implementation fault の3分類（IEEE 1044）。defect の root cause analysis で使用 | — | 因果連鎖における fault の発生源を特定するための分類軸 |
| HARA | HARA | Hazard Analysis and Risk Assessment（ISO 26262）。システムレベルで hazard を特定し safety goal を導出する分析手法。機能安全が有効な場合に必須 | — | トップダウン分析。詳細は [defect-taxonomy §7](defect-taxonomy-ja.md) |
| FMEA | FMEA | Failure Mode and Effects Analysis（IEC 60812）。コンポーネントレベルで fault のモードと影響を網羅的に分析する手法 | — | ボトムアップ分析。Ch3 確定後に実施 |
| FTA | FTA | Fault Tree Analysis（IEC 61025）。特定の top event から原因を AND/OR ゲートで逆探索する分析手法 | — | トップダウン分析。高リスク hazard または重大 incident の原因分析に使用 |
| interview-record | インタビュー記録 | ユーザーインタビューの構造化記録（file_type） | hearing-record | 上記 interview の選定に連動 |
| disaster-recovery-plan | 災害復旧計画 | RPO/RTO に基づく復旧手順の定義（file_type） | dr-plan | 名前空間の略称禁止ルールに従う |

## 2. フレームワーク固有概念

辞書に載っていない、このフレームワークで定義される概念。

| 用語 | 定義 |
|------|------|
| STFB | Stable Top, Flexible Bottom（上剛下柔）。安定依存の原則に基づく仕様書の章構成。上位章は安定・抽象、下位章は可変・具体 |
| ANMS | AI-Native Minimal Spec。単一 Markdown ファイルの仕様書形式。1コンテキストウィンドウに収まる規模向け |
| ANPS | AI-Native Plural Spec。複数 Markdown ファイル + Common Block の仕様書形式。中規模向け |
| ANGS | AI-Native Graph Spec。GraphDB + Git の仕様書形式。大規模向け。MD はビュー |
| Common Block | 全 file_type 共通のメタデータブロック。ファイルの身元証明（識別・状態・ワークフロー・コンテキスト・出自） |
| Form Block | file_type 固有の構造化フィールドブロック。エージェントがパースして判断・アクションに使う |
| Detail Block | 詳細説明ゾーン。ドメイン知識の本体。人間とエージェントが理解のために読む |
| Footer | 更新履歴ブロック。append-only。監査用 |
| In | エージェントの入力。仕事開始時に存在するファイル。イミュータブル（読むだけ） |
| Out | エージェントの出力。仕事終了時の最終成果物。End Conditions に対応。次のエージェントの In になる |
| Work | エージェントの作業用一時ファイル。Out 完成後に削除する。再利用しない |

## 3. 略称の許可判定

名前空間（file_type 名）での略称使用の判定記録。原則: 略称禁止（document-rules §7）。

| 略称 | 正式名 | 判定 | 理由 |
|------|--------|:----:|------|
| WBS | Work Breakdown Structure | 許可 | PM の一般用語。「Work Breakdown Structure」と書く人はいない |
| SRS | Software Requirements Specification | エージェント名のみ許可 | `srs-writer` はエージェント名（名前空間ルール対象外）。名前空間には使用不可 |
| DR | Disaster Recovery | 不許可 | `disaster-recovery-plan` に改名済み。3語で上限内 |
| CR | Change Request | 不許可 | フィールド名 `change_request_status` に改名済み |
| HW | Hardware | 許可 | file_type `hw-requirement-spec` で使用。`hardware-requirement-spec` は4語で上限超過 |
| AI | Artificial Intelligence | 許可 | 一般用語。`ai-requirement-spec` で使用 |
| FW | Framework | 不許可 | `framework-requirement-spec` は3語で上限内。略称不要 |

## 4. 紛らわしい対の区別

似ているが異なる概念の区別を明確にする。

| 対 | 区別 |
|---|------|
| 要求 vs 変更要求 | 要求 = requirement（システムが満たすべき条件）。変更要求 = change request（仕様承認後のユーザー起点の変更リクエスト）。同じ「要求」だが英語では requirement vs request で別語 |
| 仕様書 vs テンプレート | 仕様書 = プロジェクト固有の成果物（docs/spec/）。テンプレート = フレームワークが提供する雛形（process-rules/spec-template-ja.md） |
| エージェント vs サブエージェント | エージェント = agent-list に登録された12のロール定義。サブエージェント = Claude Code が起動する子プロセス（エージェントを含む） |
| lead vs organizer | lead = プロセス規則で定義されたオーケストレーターエージェント。organizer = ANGS 論文で提案されたグラフ走査エージェント。現時点では同一の役割を異なる文脈で呼んだもの |
| document_status vs {type}_status | 同じ status。document_status = Common Block（文書ライフサイクル: draft/review/approved/archived）。{type}_status = Form Block（ドメイン固有のワークフロー位置） |
| fault vs defect | fault = コードに潜在する不正状態（未発見）。defect = 発見後に記録された正式な問題票（file_type）。fault が発見されて defect として起票される |
| failure vs incident | failure = 要求を満たさなくなった技術的事象（テスト中含む）。incident = failure が本番でサービスに影響した運用的事象。テスト中の failure は incident ではない |
| defect vs incident | defect = テスト・開発中の発見記録（file_type: defect, owner: test-engineer）。incident = 本番での発生記録（file_type: incident-report, owner: lead）。フェーズが異なる |
| hazard vs risk | hazard = 人命・財産への危険源（IEC 61508）。risk = プロジェクト目標への影響（file_type: risk）。hazard は機能安全固有、risk は全プロジェクト共通 |
