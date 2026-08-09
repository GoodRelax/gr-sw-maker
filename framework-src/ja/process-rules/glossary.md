# 用語集

> **本文書の位置づけ:** full-auto-dev フレームワークで使用する用語の定義。辞書的な一般用語は含まない。フレームワーク固有の意味・選定理由・非採用の代替を記録する。
> **関連文書:** [プロセス規則](full-auto-dev-process-rules.md)、[文書管理規則](full-auto-dev-document-rules.md)、[エージェント一覧](agent-list.md)、[不具合系用語の体系](defect-taxonomy.md)

---

## 1. 意図的に選定した用語

同義語が複数ある中で、意図的に1つを選んだ用語。非採用の代替とその理由を記録する。

| 用語 | English | 定義 | 非採用 | 理由 |
|------|---------|------|--------|------|
| 要求 | requirement | システムが満たすべき条件。EARS 構文で形式化する | 要件 | 要求が根源（求めるもの）。要件は派生（満たすべき条件）。Requirements = 要求で統一 |
| インタビュー | interview | ユーザーへの構造化質問による要求抽出 | ヒアリング | hearing は和製英語。英語では法廷審問・聴覚の意味 |
| ステータス | status | ワークフロー上の現在位置を示す値 | state | state（存在モード）と status（進捗位置）の区別は実務上不要。status に統一 |
| error | error | 人間の認識・判断・操作のミス。fault の原因（IEEE 1044）。詳細は [defect-taxonomy](defect-taxonomy.md) 参照 | 誤り | 英単語で統一。日本語の「誤り」は日常語で技術的精度が低い |
| fault | fault | error の結果、コード・設計・仕様に潜在する不正状態。発見されるまで発現しない（IEEE 1044, IEC 61508） | フォールト, 欠陥 | 英単語で統一。カタカナも不採用 |
| failure | failure | fault が実行時に発現し、要求を満たさなくなった事象（IEEE 1044, IEC 61508） | フェイラー, 故障, 障害 | 「故障」はHW寄り、「障害」は多義的。英単語で統一 |
| defect | defect | テスト・運用で発見された failure（または fault）の正式記録（file_type）。因果連鎖: error → fault → failure → defect | 障害, bug, バグ, 不具合 | 「障害」は failure/incident と混同するため廃止。英単語で統一 |
| incident | incident | 本番環境で発生した計画外のサービス影響事象（ITIL, ISO 20000）。file_type: incident-report | 障害, インシデント | 英単語で統一。カタカナも不採用 |
| hazard | hazard | failure が人命・財産・環境に害を及ぼしうる危険源（IEC 61508）。条件付きプロセス「機能安全」が有効な場合に使用 | ハザード | 英単語で統一 |
| fault origin | fault origin | fault が混入したフェーズ。requirements fault / design fault / implementation fault の3分類（IEEE 1044）。defect の root cause analysis で使用 | — | 因果連鎖における fault の発生源を特定するための分類軸 |
| HARA | HARA | Hazard Analysis and Risk Assessment（ISO 26262）。システムレベルで hazard を特定し safety goal を導出する分析手法。機能安全が有効な場合に必須 | — | トップダウン分析。詳細は [defect-taxonomy §7](defect-taxonomy.md) |
| FMEA | FMEA | Failure Mode and Effects Analysis（IEC 60812）。コンポーネントレベルで fault のモードと影響を網羅的に分析する手法 | — | ボトムアップ分析。Ch5 確定後に実施 |
| FTA | FTA | Fault Tree Analysis（IEC 61025）。特定の top event から原因を AND/OR ゲートで逆探索する分析手法 | — | トップダウン分析。高リスク hazard または重大 incident の原因分析に使用 |
| インタビュー記録 | interview-record | ユーザーインタビューの構造化記録（file_type） | hearing-record | 上記 interview の選定に連動 |
| 災害復旧計画 | disaster-recovery-plan | RPO/RTO に基づく復旧手順の定義（file_type） | dr-plan | 名前空間の略称禁止ルールに従う |

## 2. フレームワーク固有概念

辞書に載っていない、このフレームワークで定義される概念。

| 用語 | 定義 |
|------|------|
| STFB | Stable Top, Flexible Bottom（上剛下柔）。安定依存の原則に基づく仕様書の章構成。**軸は変更頻度であって抽象度ではない。** 上位章は変更頻度が低く、下位章は高い。Chapter 2 のように具体的でありながら最も安定な章がある |
| ANMS | AI-Native Minimal Spec。仕様書を 1 枚に収める形式。**記法は ANPS と同じだが StrictDoc を回さない。** 1 コンテキストウィンドウに収まる規模向け |
| ANPS-part | AI-Native Plural Spec を部で割った形式。3 枚（Requirements / Design / Test）。StrictDoc を回す |
| ANPS-chapter | AI-Native Plural Spec を章で割った形式。14 枚。StrictDoc を回す |
| ANGS | **廃止した。** GraphDB を要する段を形式として立てても、記法が同じである以上は分ける単位の話にしかならない。ANPS-chapter で足りる |
| 機器（Device） | Chapter 2 が扱う物理的な実体。PC・スマートフォン・サーバー・車両・組込ハードウェア。**UID を振らず、名前で参照する** |
| 経路（Route） | Chapter 2 が扱う、機器の間および人と機器の間の一方向の道すじ。**向きごとに 1 件立てる** —— 「入力として信頼できるか」の判定が向きで変わるため |
| ノード（Node） | 仕様書の最小単位。見出し + `**Type**:` で宣言する。**仕様形式によらず必ず宣言する（MUST）。ANPS では StrictDoc がこの単位を解析する。****v0.35 が機器に振っていた接頭辞 `ND` とは別物であり、`ND` は廃止した** |
| 地の文（Plain Prose） | ノードとして宣言しない本文。段落・表・図。**UID を持たず、トレースの鎖に載らない** |
| 資料（Reference Material） | Chapter 6 の表・図・スキーマ。機械可読だが要求との紐づけを持たない。**ノードにしない** |
| 言明（Statement） | 資料についての判断を述べた 1 文。`SW_SPEC` の `STATEMENT` 欄が持つ。**資料から読み取れることを繰り返さない** |
| 鎖（Chain） | `GL` を根とし、子が親を書くことで繋がるトレースの親子連鎖（`GL` → `UC` → `FR` → `SWS` → `TC` → `TR`）。**外れたノードは削減候補である** |
| ID 接頭辞（ID Prefix） | 仕様書ノードの UID の先頭語。`GL`（目標）/ `UC`（ユースケース）/ `FR`（機能要求）/ `NFR`（非機能要求）/ `ADR`（設計判断）/ `SWS`（ソフトウェア仕様）/ `TC`（テストケース）/ `TR`（テスト結果）の 8 つ。**正本は spec-template の接頭辞表であり、増減はそこで行う** |
| SW_SPEC | ソフトウェア仕様。要求（FR / NFR）を実装可能な言明へ具体化したもの。EARS 1 文で書く。**`SW_SPEC` はノードの `**Type**` 値、`SWS` は ID 接頭辞（例: `SWS-001`）であり、別物である** |
| ドメインモデル（Domain Model） | Chapter 5 が扱う概念と関係。クラス図 / ER 図 / 表で表す |
| データスキーマ（Data Schema） | Chapter 6 が扱う、機械が検証できる具体構造。JSON Schema / DDL / 型定義 |
| コンポーネント図（Component Diagram） | Chapter 5.2 が扱う、ソフトウェアの分割を表す図。**Chapter 2 の概要図とは別物** |
| 削減候補（Reduction Candidate） | トレースの鎖から外れた（`GL-xxx` に辿り着かない）ノードの一覧。Chapter 4.3 に置く。**エージェントは一覧を作るだけであり、ノードを削除してはならない（MUST NOT）。外す判断はユーザーが行う** |
| 手段独立テスト（Mechanism-Independence Test） | **要求とユースケースにのみ適用する**抽象度の判定手順。実現手段を変えて文が変わるなら具体的すぎる。**必要条件にすぎず、通過しても検証可能性を別に確かめる。`SW_SPEC` には適用しない** |
| 精密度（Precision Level） | Cockburn のユースケース記述の詳しさの段階（Level 1〜4）。本フレームワークは Level 3 を既定とする |
| 目標レベル（Goal Level） | Cockburn のユースケースの粒度。原典は 5 段階で、本フレームワークが使うのは kite（複数の利用者目標にまたがる）/ sea（1 回の利用で完結する利用者の目標）/ fish（下位機能）の 3 つ。**書くのは `sea` のみ（MUST）。kite と fish は粒度の判定にのみ使う** |
| 記述文（Descriptive Sentence） | 何がどうなっているかを述べる文。**主語と目的語を省略してはならない（MUST NOT）** |
| 指示文（Prescriptive Sentence） | 読み手に行動を命じる規則文（規約・手順書で使う）。**主語は読み手であり自明なので省略してよい。ただしシステムの振る舞いを述べる要求文は記述文であり、主語を省略してはならない（MUST NOT）** |
| 与件（Given） | こちらの都合では変えられない前提。Chapter 2 が扱う |
| review（レビュー）| **作成主体以外の主体**（人・エージェントを問わない）が、規約と観点に照らして中身の良し悪しを読むこと。**判断の余地が大きい。** 変えるのが高くなる前に行う。出力は重大度つきの指摘 |
| check（確認）| 主体を問わず、**あらかじめ定めた項目表**と成果物を照合すること。**判断の余地が小さく、結果は合否のみ。** 成果物を出す直前に行う |
| audit（監査）| **作業に関わっていない者**が、記録が残っているか規則どおり運用されたかを事後に確かめること。**監査が要求されるプロジェクトでのみ使う（MUST）。** review や check を audit と呼んではならない（MUST NOT） |
| test-designer | 受入基準とテストコードを書くエージェント。Chapter 9.1 / 10.1 / 11.1 のオーナー |
| tester | テストを実行し結果を記録するエージェント。Chapter 9.2 / 10.2 / 11.2 のオーナー |
| main-agent | ユーザーと双方向にやりとりし、サブエージェントを起動する唯一の主体。Claude Code のメインの会話そのものであり、**定義ファイルを持たないため名簿（agent-list §1）に載らない**。会話履歴を保持する |
| project-manager | 進行状態の記録と PM 情報の統合・報告を担うサブエージェント。**ユーザーとは直接やりとりしない**（旧名 `orchestrator`。世の中の orchestrator がユーザー入口を兼ねるため退役させた） |
| Common Block | 全 file_type 共通のメタデータ。ファイルの身元証明（識別・状態・ワークフロー・コンテキスト・出自）。**YAML frontmatter のトップレベルに置く。ただし仕様書は StrictDoc の文書ヘッダと衝突するため、同名の `<ファイル名>.meta.yaml` へ外出しする** |
| Form Block | file_type 固有の構造化フィールド。エージェントがパースして判断・アクションに使う。**frontmatter（仕様書では `.meta.yaml`）内で名前空間キーの配下にネストし、1 ファイルに 1 つ** |
| Detail Block | 詳細説明ゾーン。ドメイン知識の本体。人間とエージェントが理解のために読む。**frontmatter の外、本文の markdown** |
| OKF | Open Knowledge Format。知識文書の容器形式の標準。本フレームワークは v0.2 に従い、`type` / `description` / `generated` / `sources` を用いる |
| actor | 主体の表記規約。`{agent-name}` / `human:{id}` / `process:{id}` の 3 形式。**人間の承認と機械の生成を機械的に区別するために設けた** |
| Footer | 更新履歴ブロック。append-only。監査用 |
| In | エージェントの入力。仕事開始時に存在するファイル。イミュータブル（読むだけ） |
| Out | エージェントの出力。仕事終了時の最終成果物。End Conditions に対応。次のエージェントの In になる |
| Work | エージェントの作業用一時ファイル。Out 完成後に削除する。再利用しない |
| pure function（純粋関数）| 可変内部状態なし・副作用なし・外部状態を読まない。出力は引数のみで決まる（参照透過）|
| semi-pure function（準純粋関数）| 可変状態なし・副作用なしだが、外部状態を自ら読む。参照透過ではない。準純粋-a=不変値の読取（決定的）、準純粋-b=可変/非決定の読取（時刻・乱数・DB/ファイル読取）|
| non-pure function（非純粋関数）| 可変内部状態を持つ、または副作用がある（グローバル/引数の書換・I/O・ログ・lock/mutex・throw・HW/OS/env 変更）|
| immutable class（不変クラス）| 構築後フィールド不変。メソッドは新インスタンスを返し純粋（this 固定＝引数扱い）。例: LocalDate, record |
| value object（値オブジェクト）| 同一性でなく値で比較される不変オブジェクト。純粋メソッド。例: Money, Coordinate |
| stateless class（ステートレスクラス）| 状態を持たず純粋メソッド/ユーティリティのみ。例: Math |
| stateful class（ステートフルクラス）| 可変状態を持つ、または副作用メソッドを持つ（非純粋メソッドを含む）。例: 書込リポジトリ、キャッシュ |

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
| gr-sw-maker vs full-auto-dev | gr-sw-maker = ツール名 / リポジトリ名 / npm パッケージ名。full-auto-dev = 手法論名（ツールに依存しない上位概念）。相互に置換してはならない。ツール固有の話題には gr-sw-maker、手法論・プロセスの話題には full-auto-dev を使う |
| 要求（Requirement） vs 変更要求（Change Request） | 要求 = requirement（システムが満たすべき条件）。変更要求 = change request（仕様承認後のユーザー起点の変更リクエスト）。同じ「要求」だが英語では requirement vs request で別語 |
| 仕様書（Specification） vs テンプレート（Template） | 仕様書 = プロジェクト固有の成果物（docs/spec/）。テンプレート = フレームワークが提供する雛形（process-rules/spec-template.md） |
| エージェント（Agent） vs サブエージェント（Sub-agent） | エージェント = agent-list §1 に登録されたロール定義。サブエージェント = Claude Code が起動する子プロセス（エージェントを含む） |
| project-manager vs organizer | project-manager = プロセス規則で定義されたオーケストレーターエージェント。organizer = 廃止した ANGS の論文で提案されたグラフ走査エージェント。**本フレームワークでは採用しない。文書中で使ってはならない（MUST NOT）** |
| document_status vs {type}_status | 同じ status。document_status = Common Block（文書ライフサイクル: draft/in-review/approved/archived）。{type}_status = Form Block（ドメイン固有のワークフロー位置） |
| fault vs defect | fault = コードに潜在する不正状態（未発見）。defect = 発見後に記録された正式な問題票（file_type）。fault が発見されて defect として起票される |
| failure vs incident | failure = 要求を満たさなくなった技術的事象（テスト中含む）。incident = failure が本番でサービスに影響した運用的事象。テスト中の failure は incident ではない |
| defect vs incident | defect = テスト・開発中の発見記録（file_type: defect, owner: test-engineer）。incident = 本番での発生記録（file_type: incident-report, owner: incident-reporter）。フェーズが異なる |
| hazard vs risk | hazard = 人命・財産への危険源（IEC 61508）。risk = プロジェクト目標への影響（file_type: risk）。hazard は機能安全固有、risk は全プロジェクト共通 |
| actor vs Chapter 3 のアクター（Actor） | actor = Common Block のフィールドで、その文書を誰が生成し誰が承認したかを記録する表記規約（`{agent-name}` / `human:{id}` / `process:{id}`）。Chapter 3 のアクター = 目標を持つ主体。**別物である。後者を指すときは「Chapter 3 のアクター」と書く（MUST）** |
| Use Case vs ユースケース | Use Case = Clean Architecture の層の名前（コードの層）。ユースケース = Chapter 3 のアクターの目標。**別物である。後者を指すときは「Chapter 3 のユースケース」または `UC-xxx` と書く（MUST）** |
| 機器（Device） vs 機械（Machine） | 機器 = Chapter 2 の物理的な実体。機械 = 「機械可読」「機械が検証する」の機械（人ではなく計算機が処理すること）。**字面が近いが別語である。Chapter 2 で物理的な実体を指して「機械」と書いてはならない（MUST NOT）。「機械可読」等の計算機の意味では使ってよい** |
| ノード（Node） vs ND | ノード = StrictDoc が解析する仕様書の単位。`ND` = v0.35 が機器に振っていた接頭辞で、**廃止した。** 同じ語が別のものを指していた |
| 経路（Route） vs 接続（Connection） | 経路 = Chapter 2 の一方向の道すじ。向きごとに 1 件立てる。接続 = コネクション・資源の一般語。**Chapter 2 では「経路」を使う** |
| ドメインモデル（Domain Model） vs データスキーマ（Data Schema） | ドメインモデル = Chapter 5 の概念と関係。データスキーマ = Chapter 6 の機械が検証できる具体構造。層が違う。**「データモデル」はどちらを指すか決まらないので使ってはならない（MUST NOT）** |
| 与件（Given） vs `GIVEN` 欄 | 与件 = Chapter 2 が扱う、変えられない前提。`GIVEN` = Chapter 9〜11 のテストノードの欄で、Gherkin 由来の前提条件。**別物である。後者は必ず大文字の欄名 `GIVEN` で書く** |
| review vs check vs audit | review = 他者が中身の良し悪しを読む。check = 本人または機械が項目を照合する。audit = 作業に関わっていない者が記録と運用を事後に確かめる。**audit は厳密形式でのみ使う** |

## 5. コード単位の階層（包含関係）

純粋性の判定は原則「クラス/関数」単位、物理分離は「ユニット/モジュール/コンポーネント」単位で行う。レイヤー軸（Entity/UseCase/Adapter/Framework）はこの包含と直交し、spec-template Ch5.1・review-standards の CA に定義済み。

**階層に番号を振らない。** 包含は「含まれる先」と「含むもの」の鎖で表す。隣接する行の値が一致することが包含の閉じている証拠であり、行を足したときの繋ぎ忘れが表の中で露見する。番号は条件付きの行が増えるたびにずれ、自己検査の役に立たない。

### 5.1 構造軸 — コードの物理的な入れ子

| 単位（日 / 英）| 対応 | 含まれる先 | 含むもの |
|----------------|------|------------|----------|
| メンバ / ローカル (member, local)（プロパティ・メソッド・内部変数/関数・内部クラス）| — | クラス / 関数 | 文、式 |
| クラス / 関数 (class, function) | — | ユニット | メンバ、ローカル、内部クラス |
| ユニット (unit) | ファイル（C なら `.c` と `.h` の対）| モジュール | クラス、関数 |
| モジュール (module) | サブフォルダ、または接頭辞を共有するファイル群 | コンポーネント | ユニット |
| コンポーネント (component) | フォルダ + 公開面 | パッケージ（§5.2）| モジュール、ユニット |

**ユニットが単体テストの対象単位である。** モジュールを単体テストの対象と読んではならない（MUST NOT）。読み違えると、独立して検証できない粒度にモックを積むことになる。

**構造軸の包含:**

```mermaid
flowchart TD
    MEMBER["メンバ_ローカル"]
    CLASS["クラス_関数"]
    UNIT["ユニット<br/>ファイル"]
    MODULE["モジュール<br/>サブフォルダ"]
    COMPONENT["コンポーネント<br/>フォルダと公開面"]
    PACKAGE["パッケージ<br/>配布軸"]

    MEMBER -->|"含まれる"| CLASS
    CLASS -->|"含まれる"| UNIT
    UNIT -->|"含まれる"| MODULE
    MODULE -->|"含まれる"| COMPONENT
    COMPONENT -->|"詰められる"| PACKAGE
```

### 5.2 配布軸 — 受け渡しの単位

**構造軸と 1 本の鎖に繋がない。** 配布の器と実行形態は別の軸であり、繋ぐと分散システムの扱いが後付けの挿入になる。

| 単位（日 / 英）| 種別 | 定義 | 含むもの |
|----------------|------|------|----------|
| パッケージ (package) | 器 | 版と依存を持ち、レジストリまたはファイルで受け渡される | コンポーネント |
| ライブラリ (library) | 実行形態 | 単独では起動せず、他のソフトウェアに組み込まれる | パッケージの中身 |
| アプリケーション (application) | 実行形態 | 利用者が直接起動する。エントリポイントを持つ | 自身のパッケージ + 外部ライブラリ |
| サービス (service) | 実行形態 | 常駐し、境界越しに要求を受ける。デプロイの単位でもある | 自身のパッケージ + 外部ライブラリ |

分散システムでは、アプリケーション（システム全体）が複数のサービスから成る。**サービスは条件付きで挿入する行ではなく、最初から並列に定義された実行形態である。**

### 5.3 コンポーネントの公開面

> **コンポーネントは公開面を宣言する（MUST）。他コンポーネントは公開面のみに依存してよく、内部実装への依存を禁じる（MUST NOT）。** 守らなければ交換の単位でなくなり、フォルダを分けた意味が消える。
>
> **公開面の表現手段は、言語が提供する可視性機構を優先する（SHOULD）。** ディレクトリ規約は誰かが検査しなければ守られないが、言語機構はコンパイラが守らせる。機構を持たない、または弱い場合にのみディレクトリで表す。

| 言語 | 公開面の表現 |
|------|--------------|
| Rust | `pub` / `mod`。言語が強制する |
| TypeScript / JavaScript | `index.ts` からの `export` のみを公開面とする |
| Python | `__init__.py` の `__all__`。内部のユニットは `_` 接頭辞 |
| Java / C# | package-private / `internal` |
| Go | 大文字始まりが公開。言語が強制する |
| C / C++ | 機構が弱いためディレクトリで表す（下記）|

**ディレクトリで表す場合の構成:**

```text
src/components/bms/
  include/
    bms_api.hpp
  private/
    cell_monitor/
      ltc6811.hpp
      ltc6811.cpp
      voltage_cal.hpp
      voltage_cal.cpp
    fault_detect/
      over_volt.hpp
      over_volt.cpp
```

`include/` が公開面であり、他コンポーネントが参照してよい唯一の場所である。`private/` 配下への参照は違反として起票する。ビルド設定で強制できる場合は強制する（CMake の `target_include_directories` の `PUBLIC` と `PRIVATE`）。`private/` の内側の下位ディレクトリはコンポーネントではなくモジュールである。**コンポーネントを名乗るのは公開面を持つものだけである。**

**規模による選択:** コンポーネントが 1 つなら `src/` 直下にユニットを置き `components/` を作らない。2〜数個なら `src/{component}/` とし公開面は言語機構で表す。多数、または公開面の統制が要る場合にのみ上記の構成を採る。**既定を置くが要求にはしない。** 小規模に強制すると、規約の側から過剰設計を再生産する。
