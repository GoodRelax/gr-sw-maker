# ANMS v0.35 — AI-Native Minimal Spec Template（ドラフト）

> **本ファイルはドラフトである。本体は `framework-src/ja/process-rules/spec-template.md`（v0.34）であり、まだ変更していない。**
>
> **★新設 / ★変更 の印は、v0.34 からの差分をレビューするための目印である。本体へ移すときに取り除く。**
>
> 承認済みの方針: 章立て A（システム構成とユースケースを別章）/ 構成を選べる場合は ADR へ逃がす / NFR は Ch2 のノード・接続へトレースする。
>
> **本ドラフトを本体へ適用するときの作業一覧は、末尾の「適用時の作業一覧」にある。テンプレート本文ではない。**

---

## 仕様書の設計原則: STFB (Stable Top, Flexible Bottom) — 上剛下柔

Robert C. Martin の安定依存の原則 (Stable Dependencies Principle) に着想を得た章構成。上位の章は剛（安定し変更頻度が低い）、下位の章は柔（具体的で変更頻度が高い）。上位章が変わると下位章の見直しが必要になるが、下位章の変更は上位章に影響しない。

**★変更 — 章構成の安定度軸:**

```text
  Chapter 1  Foundation             <- 剛: 最も安定 / 最も抽象的
  Chapter 2  System Configuration      与件。選ぶものではなく、与えられるもの
  Chapter 3  Use Cases                 アクター視点。誰が何を達成するか
  Chapter 4  Requirements              システム視点。何を満たすか
  Chapter 5  Architecture              どう作るか
  Chapter 6  Specification          <- 柔: 最も可変 / 最も具体的
```

Chapter 2 と Chapter 3 を要求より上に置く理由は 2 つある。**(1) システム構成は与件である。** 車両・スマートフォン・サーバー・既存ハードウェアは既に存在し、こちらの都合では変えられない。設計判断より安定している。**(2) ユースケースはアクター視点であり、要求はシステム視点である。** 視点の変換は一方向で、アクターの目標が変われば要求は変わるが、要求の書き換えでアクターの目標は変わらない。

本テンプレートは三段階仕様体系（ANMS / ANPS / ANGS）の第1段階（ANMS）として設計されている。1コンテキストウィンドウに収まる規模では単一ファイルとして使用する。収まらない場合はANPS（AI-Native Plural Spec）としてチャプター単位でファイルを分割する:

**★変更 — ANPS のファイル分割:**

- **spec-foundation**（Ch1-4: Foundation・System Configuration・Use Cases・Requirements）— オーナー: srs-writer
- **spec-architecture**（Ch5-8: Architecture・Specification・Test Strategy・Design Principles）— オーナー: architect

ANPSでは各ファイルにCommon Block + Form Blockを付与する（文書管理規則に従う）。STFB構造はファイルが分かれても維持される。

> **★新設 — Chapter 2 のオーナーの例外。** Chapter 2 のオーナーは srs-writer である。**ただし構成を選べる場合、選定は architect が Chapter 5.6 の ADR で行い、確定した構成を srs-writer が Chapter 2 へ反映する。オーナーは移らない。**

**人間が主導する3つの責務:**

全自動開発においても、以下の3つは人間が主導する（プロセス規則 §1.1 参照）:

1. **コンセプトの提示**（Ch1 Foundation の入力）— 何を作りたいか、なぜ必要か
2. **重要な意思決定**（Ch5 Architecture Decisions の判断）— 技術選定、アーキテクチャ方針
3. **受入テスト**（Ch6 Specification の Result 判定）— 完成物がビジネス要求を満たすか

---

## Chapter Structure

**★変更 — 章の一覧:**

| #   | English                          | 日本語              | 主な記法                            | 安定度                   |
| --- | -------------------------------- | ------------------- | ----------------------------------- | ------------------------ |
| 1   | **Foundation**                   | 基本事項            | 自然言語 + テーブル                 | 最も安定                 |
| 2   | **System Configuration** ★新設   | システム構成        | Mermaid + テーブル                  | 最も安定（与件）         |
| 3   | **Use Cases** ★新設              | ユースケース        | テーブル（Cockburn brief）          | 安定                     |
| 4   | **Requirements**                 | 要求                | EARS + 数式 + テーブル + 図         | 安定                     |
| 5   | **Architecture**                 | アーキテクチャ      | Mermaid + テーブル                  | やや安定                 |
| 6   | **Specification**                | 仕様                | Gherkin + テーブル + コードブロック | よく変わる               |
| 7   | **Test Strategy**                | テスト戦略          | テーブル                            | よく変わる               |
| 8   | **Design Principles Compliance** | SW設計原則 準拠確認 | テーブル                            | 可変（レビュー時に更新） |
| A   | **Appendix**                     | 付録                | 自由形式                            | —                        |

---

## Section Structure

### Chapter 1. Foundation (基本事項)

プロジェクトの「北極星」。すべての後続章の前提となる。最も安定し、最も変わりにくい層。

| Section | English     | 日本語   | 記述内容                                   |
| ------- | ----------- | -------- | ------------------------------------------ |
| 1.1     | Background  | 背景     | なぜこのSWが必要か。ドメインの現状         |
| 1.2     | Challenges  | 課題     | 現状の具体的な問題点                       |
| 1.3     | Goals       | 目標     | 成功の定義。達成すべき状態                 |
| 1.4     | Approach    | 解決方針 | 技術スタック、アーキテクチャ方針           |
| 1.5     | Scope       | 範囲     | 本プロジェクトでやること (In-scope) とやらないこと (Out-of-scope)。**★変更: 機能の範囲を書く。物理的な範囲（どの機械までが対象か）は Chapter 2 に書く** |
| 1.6     | Constraints | 制約事項 | プロジェクトが絶対に破れない制約（技術・法規・倫理・特許等） |
| 1.7     | Limitations | 制限事項 | 要求を完全には満たさないが許容可能な既知の妥協点 |
| 1.8     | Glossary    | 用語集   | プロジェクト固有の用語定義。AIと人間で用語の解釈を揃える |
| 1.9     | Notation    | 表記規約 | RFC 2119/8174 準拠。主要キーワード例: SHALL/MUST=必須, SHOULD=推奨, MAY=任意。EARS の `shall` は SHALL と同義 |

---

### Chapter 2. System Configuration (システム構成) ★新設

**対象ソフトが、どの機械の上で、何とつながって動くのかを示す。** PC・スマートフォン・サーバー・車両・ハードウェアなどの物理的な接続の概要である。

**本章は与件を書く章であり、設計判断を書く章ではない。** ソフトウェアの内部分解は Chapter 5.2 Components に書く。両者を混ぜてはならない（MUST NOT）。

| Section | English              | 日本語       | 記述内容                                                     |
| ------- | -------------------- | ------------ | ------------------------------------------------------------ |
| 2.1     | Configuration Diagram | 構成図       | ノードと接続の全体図。Mermaid                                 |
| 2.2     | Nodes                | ノード       | 機械の一覧。対象ソフトが載るノードを明示する                  |
| 2.3     | Connections          | 接続         | ノード間の接続一覧。何が流れるかを書く                        |
| 2.4     | Out of Configuration | 持たないもの | 構成に含まれないものを明示する                                |

#### 2.1 Configuration Diagram (構成図)

**構成図の記入例（車載 + スマートフォン + サーバー）:**

```mermaid
flowchart LR
    Phone["スマートフォン<br/>コンパニオンアプリ"] -->|"操作要求をBLEで送る"| HU
    HU -->|"車両状態を通知する"| Phone
    subgraph Vehicle["車両"]
        HU["ヘッドユニット<br/>対象ソフトが載る"]:::target
        ECU["ボディECU"]
        HU -->|"制御要求をCANで送る"| ECU
        ECU -->|"センサ値をCANで返す"| HU
    end
    HU -->|"走行ログをHTTPSで送る"| Cloud["クラウドサーバー<br/>テレメトリ受信"]
    Cloud -->|"設定更新をHTTPSで返す"| HU

    classDef target fill:#FFFFFF,stroke:#000,stroke-width:4px
```

対象ソフトが載るノードを太枠で示す。**色を使ってはならない（MUST NOT）** — 色は Chapter 5.1 のアーキテクチャレイヤー凡例に予約されており、同じ図法で違う意味を持たせると読み手が混同する。

**構成図の記入例（単一ノードで完結する場合。CLI ツール）:**

```mermaid
flowchart LR
    Human["利用者"] -->|"argvで値と単位対を渡す"| CLI
    subgraph PC["利用者のPC"]
        CLI["unit_convert"]:::target
    end
    CLI -->|"換算結果を書く"| Stdout["標準出力"]
    CLI -->|"診断文を書く"| Stderr["標準エラー出力"]
    CLI -->|"終了コードを返す"| Shell["呼び出し元シェル"]

    classDef target fill:#FFFFFF,stroke:#000,stroke-width:4px
```

**ノードが 1 つでも構成図を描く（MUST）。** 省略を許すと「外部依存が無い」ことが暗黙になり、Chapter 2.4 の攻撃面の議論が根拠を失う。単一ノードなら数行で済む。

**構成図の規則:**

| # | 規則 |
|:-:|---|
| 1 | **対象ソフトが載るノードを太枠（`stroke-width:4px`）で示す（MUST）。** これが無いと、どこからが自分の責任範囲か読めない |
| 2 | **色を使ってはならない（MUST NOT）。** Chapter 5.1 の層凡例と衝突する |
| 3 | **線のラベルには「何が流れるか」を書く（MUST）。** 方式名だけでは足りない。`BLE` ではなく `操作要求をBLEで送る` |
| 4 | **ノードが 1 つでも描く（MUST）** |

#### 2.2 Nodes (ノード)

**ノード表のテンプレート:**

| ND-ID | ノード名 | 種別 | 対象ソフトが載るか | 供給元 | 制約 |
| ----- | -------- | ---- | ------------------ | ------ | ---- |
| ND-001 | ヘッドユニット | 車載機器 | **載る** | 既存 | メモリ [X] MB、CPU [X] |
| ND-002 | ボディECU | 車載機器 | 載らない | 既存 | 変更不可 |
| ND-003 | スマートフォン | 携帯端末 | 載らない | 利用者所有 | OS バージョン [X] 以上 |
| ND-004 | クラウドサーバー | サーバー | 載らない | 新規 | [X] |

**供給元は「既存」か「新規」かを必ず書く（MUST）。** 既存のノードは制約であり、新規のノードは調達・構築のコストを伴う。両者を区別しないと、見積もりも変更の影響分析も成立しない。

#### 2.3 Connections (接続)

**接続表のテンプレート:**

| CN-ID | from | to | 運ぶもの | 方式 | 信頼できるか |
| ----- | ---- | -- | -------- | ---- | ------------ |
| CN-001 | ND-003 | ND-001 | 操作要求 | BLE | **信頼できない**（外部から到達可能） |
| CN-002 | ND-001 | ND-002 | 制御要求 | CAN | 信頼する（車両内閉域） |
| CN-003 | ND-001 | ND-004 | 走行ログ | HTTPS | **信頼できない**（公衆網） |

**「信頼できるか」は Chapter 5 のセキュリティ設計の起点である。** 信頼できない接続は、そのすべてが入力検証の対象になる。

#### 2.4 Out of Configuration (持たないもの)

**持たないもの表のテンプレート:**

| 持たないもの | 理由 |
| ------------ | ---- |
| ネットワーク接続 | ローカル実行のみ（C-[X]） |
| 永続ストア | 状態を持たない |
| 認証境界 | 利用者を区別しない |
| 外部 API | 実行時依存が 0 個（C-[X]） |

**「該当なし」を空欄にしてはならない（MUST NOT）。** 持たないことを明記して初めて、Chapter 5 でセキュリティ設計・可観測性設計を省略する判断に根拠が立つ。

#### 構成を選べる場合の扱い ★新設

**構成そのものを選べる場合がある**（サーバーをどこに置くか、処理を端末とクラウドのどちらで行うか、既存ハードウェアを流用するか新規調達するか）。

> **選定は Chapter 5.6 の ADR に記録し、本章には確定した構成のみを書く（MUST）。**

与件の章に判断を混ぜると、後から読んだエージェントが「変えられないもの」と「選んだ結果」を区別できなくなる。

---

### Chapter 3. Use Cases (ユースケース) ★新設

**アクターの視点で、誰が何を達成するかを書く。** Chapter 4 の要求と Chapter 6 の Gherkin はどちらもシステムを主語とするため、本章がプロジェクト唯一のアクター視点の記述である。

記法は Alistair Cockburn のユースケース記述の **brief（簡潔記述）** に限る。

| Section | English    | 日本語         | 記述内容                                       |
| ------- | ---------- | -------------- | ---------------------------------------------- |
| 3.1     | Actors     | アクター       | 目標を持つ主体の一覧                            |
| 3.2     | Use Cases  | ユースケース   | brief 形式。1 ユースケース = 表 1 行            |
| 3.3     | Extensions | 拡張           | **既定は空。定められた契機でのみ書き足す**       |

#### 3.1 Actors (アクター)

**アクター表のテンプレート:**

| アクター | 種別 | 関心 |
| -------- | ---- | ---- |
| 利用者 | 人 | 目的の作業を最小の手数で終えたい |
| 整備員 | 人 | 故障の原因を特定したい |
| テレメトリ受信基盤 | 外部システム | 走行ログを欠損なく受け取りたい |

**アクターに ID を振らない（MUST NOT）。** ユースケース表がアクター名で参照し、本表が定義を持つ。ID を足しても参照経路は増えず、維持する対象だけが増える。

#### 3.2 Use Cases (ユースケース)

**ユースケース表のテンプレート:**

| UC-ID | アクター | 目標（動詞句） | レベル | 主成功シナリオ（1 行） | 関連 FR |
| ----- | -------- | -------------- | ------ | ---------------------- | ------- |
| UC-001 | 利用者 | 単位を換算する | sea | 値と単位対を渡し、換算結果を標準出力で受け取る | FR-001〜FR-009 |
| UC-002 | 利用者 | 使い方を知る | sea | 引数を与えずに起動し、用法を受け取る | FR-021 |
| UC-003 | 整備員 | 故障コードを読み出す | sea | 車両に接続し、記録された故障コードの一覧を得る | FR-030〜FR-034 |

**目標レベル（Cockburn）:**

| レベル | 記号の意味 | 使いどころ |
| ------ | ---------- | ---------- |
| kite | 要約レベル | 複数の利用者目標をまたぐ業務の流れ |
| **sea** | **利用者の目標** | **既定。1 回の利用で完結する目標** |
| fish | 下位機能 | 他のユースケースから使われる部分機能 |

**規則:**

| # | 規則 |
|:-:|---|
| 1 | **1 ユースケース = 表 1 行（MUST）。** 主成功シナリオは 1 行で書く |
| 2 | **拡張を最初から書いてはならない（MUST NOT）。** §3.3 の契機でのみ書き足す |
| 3 | **既定のレベルは sea。** kite / fish を選ぶ場合は理由を 1 行記録する（MUST） |
| 4 | **目標は動詞句で書く（MUST）。** 名詞句は機能一覧であってユースケースではない |

#### 3.3 Extensions (拡張)

**本節は既定で空である。** 主成功シナリオだけでは足りないと判明したときにだけ書き足す。

**書き足す契機は次の 3 つに限る（MUST）:**

| # | 契機 |
|:-:|---|
| 1 | review-agent の指摘 |
| 2 | defect の根本原因が「アクター視点の異常系が仕様に無い」と判定された |
| 3 | field-issue の分析結果 |

**書き足しの規則:**

| # | 規則 |
|:-:|---|
| 1 | 形式は Cockburn の拡張記法（`3a. 条件 -> 処置`）。**当該ユースケースの直下にのみ書く** |
| 2 | **書き足したら Chapter 6.1 に対応するシナリオを 1 本足す（MUST）。** Remark に「UC-003 の拡張 3a に対応」と記す |
| 3 | **書き足した理由を 1 行残す（MUST）。** どの指摘 ID によるものか |

**拡張の記入例:**

```text
UC-003 整備員が故障コードを読み出す

  3a. 車両との接続が読み出しの途中で切れた
      -> 読み出せた分を破棄し、接続断を整備員に伝える（REV-012 の指摘による）
```

> **書き足した回数は、この設計判断そのものを評価する指標になる。** brief 止まりで足りるという前提が正しければ回数は少ない。多発するなら前提が誤っていた証拠であり、そのときは規則を見直す。

---

### Chapter 4. Requirements (要求)

システムが満たすべき要求。EARS構文・数式・テーブル・図など、要求に適した形式で記述する。

**★変更 — 節構成:**

| Section | English                     | 日本語     | 記述内容                           |
| ------- | --------------------------- | ---------- | ---------------------------------- |
| 4.1     | Functional Requirements     | 機能要求   | システムが提供する機能の要求。**どのユースケースを満たすかを紐づける** |
| 4.2     | Non-Functional Requirements | 非機能要求 | 性能、セキュリティ、可用性等の要求。**どのノード・接続に効くかを紐づける** |
| 4.3     | Reduction Candidates ★新設  | 削減候補   | 紐づけ先を持たない要求の一覧と、ユーザーの判断 |

#### トレースの向き ★新設

> **FR はユースケースへ紐づける。NFR は Chapter 2 のノードまたは接続へ紐づける。**

性能・セキュリティ・可用性は横断的であり、特定のアクターの目標に属さない。**一方で「どのノード・どの接続に効くか」は必ず書ける。** 両方向で紐づけ先を持たない要求を検出できる。

**各要求は最低限、ID と紐づけ先を持つ（MUST）。他の列はプロジェクトが決めてよい。**

#### 4.1 Functional Requirements (機能要求)

**機能要求表のテンプレート:**

| FR-ID | パターン | 要求文 | 関連 UC |
| ----- | -------- | ------ | ------- |
| FR-001 | Ubiquitous | [System] は、[Response] しなければならない（**shall**）。 | UC-001 |
| FR-018 | Unwanted Behavior | **If** [Trigger]、[System] は [Response] しなければならない（**shall**）。 | UC-001 |

EARS構文パターン:

| パターン          | 構文                                                                          | 用途                         |
| ----------------- | ----------------------------------------------------------------------------- | ---------------------------- |
| Ubiquitous        | The [System] shall [Response].                                                | 常に成り立つ要求             |
| Event-driven      | **When** [Trigger], the [System] shall [Response].                            | イベント起点の要求           |
| State-driven      | **While** [In State], the [System] shall [Response].                          | 状態依存の要求               |
| Unwanted Behavior | **If** [Trigger], then the [System] shall [Response].                         | 異常系・例外処理             |
| Optional Feature  | **Where** [Feature is included], the [System] shall [Response].               | オプション機能・条件付き機能 |
| Complex           | **When** [Trigger], **while** [In State], the [System] shall [Response].      | 複合条件の要求               |

※ EARS 構文中の `shall` は Chapter 1.9 Notation に定義する `SHALL` と同義。

**★新設 — `[System]` の定義。** EARS の `[System]` は、**Chapter 2.2 で「対象ソフトが載る」と記したノード上で動くソフトウェアを指す。** Chapter 2 を書かずに Chapter 4 を書いてはならない（MUST NOT）。主語が定義されないまま要求を書くことになる。

#### 4.2 Non-Functional Requirements (非機能要求)

**非機能要求表のテンプレート:**

| NFR-ID | 分類 | 要求文 | 効く対象 |
| ------ | ---- | ------ | -------- |
| NFR-001 | 性能 | [System] は、[Response] しなければならない（**shall**）。 | CN-003 |
| NFR-005 | セキュリティ | [System] は、[Response] しなければならない（**shall**）。 | CN-001, CN-003 |
| NFR-006 | 正確性 | [System] は、[Response] しなければならない（**shall**）。 | ND-001 |

#### 4.3 Reduction Candidates (削減候補) ★新設

**どのユースケースにも紐づかない FR、どのノード・接続にも紐づかない NFR は、削減候補である。**

**削減候補表のテンプレート:**

| 要求ID | 紐づけ先が無い理由 | 外すと何が起きるか | ユーザーの判断 |
| ------ | ------------------ | ------------------ | -------------- |
| NFR-0xx | どのノード・接続にも対応しない | [1 行で書く] | 残す / 外す |

**候補が無い場合も「候補なし」と記す（MUST）。** 空欄は「検討していない」と区別できない。

> **外す判断はユーザーが行う（MUST）。** 本表は候補と材料を提示するものであり、AI が要求を削除してはならない（MUST NOT）。

---

### Chapter 5. Architecture (アーキテクチャ)

SWの構造と設計判断。Chapter 4 の要求を実現するための技術的な構造を定義する。

| Section | English              | 日本語               | 適用場面 | 記述内容                                                                 |
| ------- | -------------------- | -------------------- | -------- | ------------------------------------------------------------------------ |
| 5.1     | Architecture Concept | アーキテクチャ方式   | 常に     | 採用するアーキテクチャの種類（CA, Hexagonal, Layered等）と凡例の定義     |
| 5.2     | Components           | コンポーネント       | 常に     | 部品と責務の分割。コンポーネント図（5.1の凡例で色分け）。**★変更: 各コンポーネントがどのノード（ND-xxx）に載るかを書く。** AI/LLM連携がある場合はプロンプトテンプレートの配置（`src/prompts/` 等）・入出力スキーマ・テスト方針・ハルシネーション対策も定義する |
| 5.3     | File Structure       | ファイル構成         | 常に     | ディレクトリ構成。コンポーネントとフォルダの対応。**各コンポーネントの公開面の宣言**（R2.19） |
| 5.4     | Domain Model         | ドメインモデル       | 常に。**ただし図は種類ごとに条件が異なる** | 構造・関係・状態の定義。クラス図（5.1の凡例で色分け、**構造を持つ型が複数ある場合**）、ER図（**永続ストアを持つ場合**）、状態遷移図（**持続する状態を持つ場合**） |
| 5.5     | Behavior             | 振る舞い             | 常に。**ただし図は種類ごとに条件が異なる** | 処理フロー・相互作用。シーケンス図（**複数コンポーネントの相互作用がある場合**）、アクティビティ図（**分岐・並行が多い場合**）。**★変更: ノードをまたぐ相互作用は、Chapter 2.3 の接続 ID（CN-xxx）を明記する** |
| 5.6     | Decisions            | 設計判断             | 常に     | ADR（Architecture Decision Records）。判断理由・代替案・決定者。記録形式は Michael Nygard の ADR フォーマット（Status / Context / Decision / Consequences）を推奨。**ADR-000「最小構成との比較」を必ず含める**（要求を満たす最小の構成、採用案が増やした要素、各々を増やした理由。R2.18）。**キャッシュを用いる場合はキャッシュ方針の ADR を含める**（R2.20）。**★変更: システム構成を選べる場合、その選定を ADR に記録する**（Chapter 2） |

**★新設 — コンポーネントとノードの対応。** Chapter 5.2 は、**各コンポーネントが Chapter 2.2 のどのノードに載るかを書く（MUST）。** 単一ノードなら「すべて ND-001 に載る」の 1 行で足りる。これを書かないと、物理構成の章と論理構造の章が互いを参照せずに離れていく。

**適用場面に当てはまらない図は描かない（MUST NOT）。** 省略した図は Ch5.6 に「該当なし」と理由を 1 行で記録する（MUST）。**描かない判断も設計判断であり、記録がなければ「検討したうえで不要と判断した」のか「忘れた」のかを後から区別できない。**

コンポーネント図・クラス図にはアーキテクチャレイヤーに基づく色分けを必須とする。**色分けが表すべきものは依存の向きであり、層の数ではない。** デフォルトはClean Architectureの4層（下記凡例）を使用する。層の数が4でない場合、および他のアーキテクチャを採用する場合は、そのアーキテクチャに応じた凡例を5.1に定義すること。

**デフォルト凡例: Clean Architecture レイヤー (コンポーネント図・クラス図 共通):**

```mermaid
graph RL
    subgraph Legend["CA Layer Legend (dependency direction)"]
        direction RL

        L_F["Framework"]:::framework -->|"depends on"| L_A["Adapter"]:::adapter
        L_A -->|"depends on"| L_U["Use Case"]:::usecase
        L_U -->|"depends on"| L_E["Entity"]:::entity
    end

    classDef entity fill:#FF8C00,stroke:#333,color:#000
    classDef usecase fill:#FFD700,stroke:#333,color:#000
    classDef adapter fill:#90EE90,stroke:#333,color:#000
    classDef framework fill:#87CEEB,stroke:#333,color:#000
```

この凡例は Chapter 5 のコンポーネント図・クラス図にのみ適用する。**Chapter 2 の構成図には適用しない** — 構成図が表すのは層ではなく機械の配置であり、同じ色で違う意味を表すと読み手が混同する。

| CAレイヤー | 役割                         | 色       | Hex       |
| ---------- | ---------------------------- | -------- | --------- |
| Entity     | ドメインデータ・コアロジック | 橙       | `#FF8C00` |
| Use Case   | ビジネスロジック調整         | ゴールド | `#FFD700` |
| Adapter    | 外部IF適合                   | 緑       | `#90EE90` |
| Framework  | UI・デバイス・外部サービス   | 青       | `#87CEEB` |

> **★注意 — 用語の衝突。** CA レイヤーの `Use Case` は**コードの層の名前**であり、Chapter 3 の `ユースケース`（アクターの目標）とは別のものである。混同を避けるため、Chapter 3 を指すときは必ず「Chapter 3 のユースケース」または `UC-xxx` と書く（MUST）。

---

### Chapter 6. Specification (仕様)

具体的で、よく変わる層。AIがコードに直接変換できるレベルの定義。

6.1 は Scenarios (Gherkin) を固定配置し、6.2以降はプロジェクトの性質に応じて取捨選択する。

#### 6.1 Scenarios (シナリオ)

Gherkin形式による UAT (User Acceptance Testing) の受入基準。Chapter 4 の要求を検証可能なシナリオとして具体化する。各シナリオの直下にテスト結果を記録する。トレーサビリティ確保のため、各シナリオの Scenario 行に対応する要求IDを `(traces: FR-xxx)` 形式で付記する。

**★注意 — シナリオはユースケースを直接参照しない。** FR が UC を持つため、`SC -> FR -> UC` の順に辿れる。参照を二重に持たせると、改訂のたびに両方を直すことになる。**例外は Chapter 3.3 の拡張から生まれたシナリオで、その場合のみ Remark に「UC-003 の拡張 3a に対応」と記す。**

Result ステータス定義（非該当を削除して使用する）:

| ステータス    | 意味                                   |
| ------------- | -------------------------------------- |
| PASS          | 受入基準を満たす                       |
| CONDITIONAL   | 基本OKだが条件付き。Remarkに改善点記載 |
| FAIL          | 受入基準を満たさない。修正必須         |
| SKIP          | 未テスト・非該当。Remarkに理由記載     |

**Gherkinテンプレート:**

````
```gherkin
Feature: [機能名]

  Background:
    Given [全シナリオ共通の前提条件]

  Rule: [ビジネスルール名]

    Scenario: SC-001 [シナリオ名] (traces: FR-xxx)
      Given [前提条件]
      And [追加の前提条件]
      When [操作・イベント]
      Then [期待結果]
      And [追加の期待結果]
      But [起きてはならないこと]
```

**Result:** PASS  CONDITIONAL  FAIL  SKIP
**Remark:**

---

```gherkin
Scenario: SC-002 [シナリオ名] (traces: FR-xxx)
  Given [前提条件]
  When [操作・イベント]
  Then [期待結果]
```

**Result:** PASS  CONDITIONAL  FAIL  SKIP
**Remark:**
````

シナリオと結果を隣接させることで、AI が埋めやすく、人間がレビューしやすい配置にする。

#### 6.2以降のセクション候補

プロジェクトに応じて取捨選択する:

| Section候補 | English          | 日本語         | 適用場面                       |
| ----------- | ---------------- | -------------- | ------------------------------ |
| 6.x         | UI Elements Map  | UI要素マップ   | UIを持つアプリ                 |
| 6.x         | Configuration    | 設定定義       | 設定オブジェクトを持つアプリ   |
| 6.x         | API Definition   | API定義        | APIを提供・利用するアプリ      |
| 6.x         | Data Schema      | データスキーマ | DB を使用するアプリ            |
| 6.x         | State Management | 状態管理       | 複雑な状態遷移を持つアプリ     |
| 6.x         | Algorithm        | アルゴリズム   | 数理・暗号等の演算ロジック     |
| 6.x         | Error Handling   | エラー処理     | エラー体系の定義が必要なアプリ |

---

### Chapter 7. Test Strategy (テスト戦略)

テストレベル別の方針。個別テストケースの詳細はAIに委任し、ここでは「何をどのレベルでテストするか」を定義する。

テストマトリクス（テンプレート例。プロジェクトに応じて行を追加・削除する）:

| テストレベル | 対象                 | 方針                               | ツール/フレームワーク | 合格基準         |
| ------------ | -------------------- | ---------------------------------- | --------------------- | ---------------- |
| 単体テスト   | 全ビジネスロジック   | AIが自動生成。カバレッジ目標: [X]% | [例: Vitest]          | 合格率 [X]% 以上 |
| 結合テスト   | [結合ポイント列挙]   | [方針]                             | [例: Vitest]          | 合格率 100%      |
| 性能テスト   | [対象API/処理]       | Chapter 4 NFR の数値目標に基づく。**★変更: 対象の接続 ID（CN-xxx）を明記する** | [例: k6]              | [目標値]         |
| E2Eテスト    | [主要ユーザーフロー] | Chapter 6.1 Gherkin シナリオに対応 | [例: Playwright]      | 全シナリオPASS   |

**★新設 — ノードをまたぐテストの明示。** 複数のノードにまたがる検証は、**どの接続（CN-xxx）を実際に通すかを書く（MUST）。** 書かないと、実機で通すのか模擬で代替するのかが実装者の判断に委ねられ、後から再現できない。

---

### Chapter 8. Design Principles Compliance (SW設計原則 準拠確認)

アーキテクチャおよび実装がSW設計原則に準拠しているかを確認する。Chapter 1-7 の「定義・設計・検証」とはメタレベルが異なる、品質保証の層。

プロジェクトの性質に応じて確認する原則を追加・削除してよい。

| カテゴリ | 識別名               | 正式名称                              | 確認観点                                                                   |
| -------- | -------------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| 命名     | Naming               | —                                     | 意図が伝わる命名か。ドメイン語彙（Chapter 1.8）と一致するか                |
| 依存関係 | Dependency Direction | —                                     | 依存方向が Chapter 5.1 のアーキレイヤーに従っているか                       |
| 依存関係 | SDP                  | Stable Dependencies Principle         | 依存先が自分より安定（変更頻度が低い）コンポーネントか（R2.16）             |
| 簡潔性   | KISS                 | Keep It Simple, Stupid                | 動作する最も単純な解決を選んでいるか                                       |
| 簡潔性   | YAGNI                | You Aren't Gonna Need It             | 今必要でない機能を作っていないか。オーバーエンジニアリングしていないか     |
| 簡潔性   | Minimal Comparison   | —                                     | Ch5.6 の ADR-000 で最小構成と比較し、増分の理由を示しているか（R2.18）     |
| 簡潔性   | DRY                  | Don't Repeat Yourself                 | コード・ロジック・定義に重複がないか                                       |
| 責務分離 | SoC                  | Separation of Concerns                | 関心ごとが適切に分離されているか                                           |
| 責務分離 | SRP                  | Single Responsibility Principle       | 各クラス・ユニットが単一の責務を持つか                                     |
| 責務分離 | SLAP                 | Single Level of Abstraction Principle | 関数内の抽象度レベルが統一されているか                                     |
| SOLID    | OCP                  | Open-Closed Principle                 | 拡張に開き修正に閉じているか                                               |
| SOLID    | LSP                  | Liskov Substitution Principle         | 親クラスを子クラスに差し替えても正しく動作するか                           |
| SOLID    | ISP                  | Interface Segregation Principle       | インターフェースが適切に分割されているか                                   |
| SOLID    | DIP                  | Dependency Inversion Principle        | 具象ではなく抽象に依存しているか                                           |
| 結合     | LoD                  | Law of Demeter                        | オブジェクトの内部構造を掘り下げてアクセスしていないか（直接の協調者のみ利用） |
| 結合     | CQS                  | Command-Query Separation              | コマンドとクエリが分離されているか                                         |
| 可読性   | POLA                 | Principle of Least Astonishment       | 読み手が予想する通りに動作するか                                           |
| 可読性   | PIE                  | Program Intently and Expressively     | 意図が明確に伝わるコードか                                                 |
| テスト   | Testability          | —                                     | 単体テストがしやすいか。Mock・スタブを容易に差し込める設計か               |
| 純粋性   | Pure / Semi-pure-a / Semi-pure-b / Non-pure | —              | 各関数を pure / semi-pure-a / semi-pure-b / non-pure に分類できるか。副作用と外部読み取りを計算ロジックの外へ寄せているか（functional core / imperative shell）|
| 構造     | Collect-Process Separation | 収集後処理                       | 処理の途中で新たな外部読取を行わないか。全件収集が不可能な場合、一貫性の単位（チャンク/スナップショット/トランザクション）を明示し、結果がタイミング依存にならないか |
| 状態遷移 | State Transition     | —                                     | 状態遷移の条件取得と遷移実行が分離されているか                             |
| 並行性   | Concurrency Safety   | —                                     | デッドロック・競合状態・グリッチが発生しないか                             |
| エラー   | Error Propagation    | —                                     | エラーが握りつぶされず、適切に伝播・処理されているか                       |
| 資源管理 | Resource Lifecycle   | —                                     | リソース（接続・ファイル・メモリ）の取得と解放が対になっているか（R3.5）   |
| 不変性   | Immutability         | —                                     | 変更不要な値が不変（immutable）になっているか                               |
| 資源効率 | Resource Efficiency  | —                                     | CPU負荷・メモリ使用量・ストレージ摩耗等が許容範囲内か                      |

---

### Appendix (付録)

| Section | English    | 日本語       | 記述内容                       |
| ------- | ---------- | ------------ | ------------------------------ |
| A.1     | References | 参考文献     | 標準規格、外部資料へのリンク   |
| A.2     | Licenses   | ライセンス   | 依存ライブラリのライセンス情報 |
| A.3     | Changelog  | 変更履歴     | 本文書のバージョン履歴         |
| A.x     | (その他)   | (その他)     | プロジェクト固有の補足資料     |

---

> 以下の「Design Rationale」と「References」は本テンプレート自体の設計根拠と参考文献である。プロジェクト仕様書を作成する際は削除してよい。

## Design Rationale (本構成の設計根拠)

| 判断                                    | 根拠                                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------- |
| STFB / 上剛下柔 (SDP適用)               | 章の順序はStable Dependencies Principleに従う。上位=安定・抽象、下位=可変・具体              |
| **★ System Configuration を Ch2 に新設** | **v0.34 は EARS の `[System]` を全要求に強制しながら、その `[System]` を定義する節を持たなかった。** 与件（車両・端末・サーバー）は設計判断より安定するため、要求より上に置く |
| **★ 構成図で対象ソフトのノードを太枠で示す** | **色は Ch5.1 の層凡例に予約されている。** 同じ図法で違う意味を持たせると読み手が混同する |
| **★ 持たないものを Ch2.4 に明記**       | **攻撃面の列挙の起点。** v0.34 では信頼境界が Architecture 章まで現れず、要求を書く間これを持たなかった |
| **★ ノードが 1 つでも構成図を描く**     | 省略を許すと「外部依存が無い」ことが暗黙になり、Ch2.4 の判断が根拠を失う |
| **★ 構成の選定は Ch5.6 の ADR へ逃がす** | 与件の章に判断を混ぜると、「変えられないもの」と「選んだ結果」を後から区別できない |
| **★ Use Cases を Ch3 に新設**           | **Ch4 の EARS と Ch6 の Gherkin はどちらもシステムを主語とする。** v0.34 にはアクター視点の記述が 1 つも無かった |
| **★ Cockburn の brief に限る**          | 主成功シナリオと拡張を全部書くと Ch6.1 Gherkin と二重管理になる。**視点は違うので複製ではないが、維持する対象は増える** |
| **★ UML ユースケース図を採らない**      | **Mermaid にユースケース図が無く**（提案は承認済みだが未実装）、かつ図が持つ情報は §3.2 の表を超えない |
| **★ アクターに ID を振らない**          | UC 表がアクター名で参照し、§3.1 が定義を持つ。ID を足しても参照経路は増えず、維持対象だけが増える |
| **★ FR は UC へ、NFR は ND / CN へ紐づける** | 性能・セキュリティ・可用性は横断的でアクターの目標に属さない。**一方「どのノード・接続に効くか」は必ず書ける。** 両方向で紐づけ先の無い要求を検出できる |
| **★ 削減候補を Ch4.3 に記録**           | 紐づけ先を持たない要求を機械的に候補として挙げる。**外す判断はユーザーが行い、AI は削除しない** |
| **★ コンポーネントの載るノードを Ch5.2 に書く** | 書かないと物理構成の章と論理構造の章が互いを参照せずに離れていく |
| **★ シナリオは UC を直接参照しない**    | FR が UC を持つため `SC -> FR -> UC` で辿れる。参照を二重に持つと改訂のたび両方を直すことになる |
| SRS/SWS統合 → 1文書化                   | AIのコンテキストウィンドウに全情報を入れるため。参照が分断されるとAIの幻覚（hallucination）を誘発しやすい |
| EARS 5パターン + Complex                | When/While/If/Where + Ubiquitous + 複合パターン。全パターンを網羅                            |
| EARS + 数式のハイブリッド               | EARSだけでは数理仕様を表現できない。ドメインに応じて使い分け                                 |
| Mermaid レイヤー色分け必須              | Mermaidはレイアウト制御が弱い。色分けがないと責務の境界が視覚的に判別不能                     |
| CAをデフォルト凡例とし差し替え可        | CA以外(Hexagonal, Layered等)を採用する場合は5.1で独自凡例を定義する                           |
| デフォルト色はgrsmd_gen2_specに準拠     | Entity(橙#FF8C00), UseCase(ゴールド#FFD700), Adapter(緑#90EE90), Framework(青#87CEEB)        |
| Architecture Conceptを5.1に新設         | 色分けの起点はアーキコンセプトの選定。選定→設計→色分け可視化の順序を構造化                    |
| File StructureをCh5.3に独立             | フォルダ構成変更=アーキテクチャ変更。コンポーネントとフォルダの対応を明示する重要セクション  |
| ADRをArchitecture章内に配置             | 設計と根拠をセットで読める。Appendixに追いやると参照が切れる                                 |
| GherkinをCh6.1に固定配置                | GherkinはUATの受入基準=仕様の具体化。EARSより不安定→SDPにより下位章に配置                    |
| Gherkin全キーワード網羅                 | Feature, Background, Rule, Scenario, Given/And/When/Then/And/But。テンプレートで全構文を提示 |
| シナリオ直下にResult/Remark             | シナリオと結果が隣接。AIが埋めやすく人間がレビューしやすい                                   |
| シナリオに要求IDトレース付記            | `(traces: FR-xxx)` 形式で要求IDを紐付け、トレーサビリティを確保する                          |
| Result 4択 PASS/CONDITIONAL/FAIL/SKIP  | 条件付き合格を明示。非該当を削除する運用。スペース区切りでデリミタ競合を回避                  |
| Specification章はセクション候補制        | 全SW開発に適用するため。分野ごとに取捨選択                                                   |
| Test StrategyをCh7に独立                | テストケース詳細はAIに委任。ここでは方針とマトリクスのみ定義                                 |
| Design Principles ComplianceをCh8に独立 | Ch1-7の「定義・設計・検証」とはメタレベルが異なる品質保証の層                                |
| Ch8原則をカテゴリ別に網羅               | Naming→依存→簡潔性→責務分離→SOLID→結合→可読性。命名と依存方向を最優先に配置。正式名称列を併記し、略称だけでは伝わらない原則の意図を補足する |
| SDPをCh8に追加                          | STFBの根幹原則であり、コードレベルでも依存先の安定度を検証すべき。Dependency Directionとは観点が異なる（方向 vs 安定度） |
| Limitations追加                         | Scope(やらない)とConstraints(破れない)の間にある「妥協点」を明示                             |
| Glossary追加                            | AIとの語彙同期。grsmd_gen2_specで有効性を実証済み                                            |
| NotationをCh1.9に配置                   | 文書全体に適用される表記規約はFoundation層に属する。RFC 2119/8174準拠。EARSのshallとの関係を明示 |

---

## References

1. Martin, R.C. "[The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)" — Stable Dependencies Principle (SDP), Stable Abstractions Principle (SAP)
2. Mavin, A., et al. "[EARS: Easy Approach to Requirements Syntax](https://ieeexplore.ieee.org/document/5328509)" — IEEE, 2009
3. Cucumber. "[Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)"
4. Starke, G. "[arc42 Architecture Template](https://arc42.org/)"
5. ISO/IEC/IEEE. "[29148:2018 — Requirements Engineering](https://www.iso.org/standard/72089.html)"
6. Bradner, S. "[RFC 2119 — Key words for use in RFCs to Indicate Requirement Levels](https://datatracker.ietf.org/doc/html/rfc2119)" — IETF, 1997
7. Leiba, B. "[RFC 8174 — Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words](https://datatracker.ietf.org/doc/html/rfc8174)" — IETF, 2017
8. Nygard, M. "[Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)" — ADR format reference
9. **★ Cockburn, A. "Writing Effective Use Cases" — Addison-Wesley, 2000（書籍）。** brief / casual / fully dressed の 3 段階と、kite / sea / fish の目標レベル。**URL は実在を確認していないため付けない**

---

---

# 適用時の作業一覧（テンプレート本文ではない）

**本節は本ドラフトを本体へ移すときの手順である。本体へ移すときに削除する。**

## 1. 参照の書き換え — 実測値

**仕様書の章を指す表現は 2 形式しかない。`第 N 章` は規則文書自身の章を指す別の名前空間であり、触ってはならない（MUST NOT）。**

```text
framework-src/ja : 329 件 -> うち 307 件が動く
framework-src/en : 369 件 -> 同型（ja 反映後に同じ手順を当てる）
分布              : 28 ファイル
```

**動かないもの（ja 22 件）:** `Ch1` 7 / `Ch1.8` 7 / `Ch1.9` 1 / `Chapter1` 4 / `Chapter1.8` 1 / `Chapter1.9` 2

**動くもの（ja 307 件）:**

| 現 | 新 | ja 件数 | 備考 |
| --- | --- | ---: | --- |
| `Ch1-2` | `Ch1-4` | 67 | **範囲の末尾が動く。「Ch1 は不動」ではない** |
| `Ch1-5` | `Ch1-7` | 1 | |
| `Ch1-6` | `Ch1-8` | 1 | |
| `Ch2` / `Chapter2` | `Ch4` / `Chapter4` | 49 | |
| `Ch3` / `Chapter3` | `Ch5` / `Chapter5` | 51 | |
| `Ch3.1`〜`Ch3.6` / `Chapter3.1` | `Ch5.1`〜`Ch5.6` | 25 | |
| `Ch3-4` | `Ch5-6` | 21 | |
| `Ch3-6` | `Ch5-8` | 45 | **最多。ANPS の分割記述** |
| `Ch4` / `Chapter4` | `Ch6` / `Chapter6` | 20 | |
| `Ch4.1` / `Chapter4.1` | `Ch6.1` | 2 | |
| `Ch4-6` | `Ch6-8` | 1 | |
| `Ch5` / `Chapter5` | `Ch7` / `Chapter7` | 14 | |
| `Ch6` / `Chapter6` | `Ch8` / `Chapter8` | 10 | |

## 2. 置換の順序に罠がある

**素直に上から当てると壊れる。** `Ch2 -> Ch4` を先に当てると、その結果を後続の `Ch4 -> Ch6` が食う。また `Ch3 -> Ch5` は `Ch3-6` を `Ch5-6` にしてしまう（正しくは `Ch5-8`）。

**正しい順序:**

| 段 | 対象 | 内容 |
|:-:|---|---|
| 1 | **範囲表記** | `Ch1-2` `Ch1-5` `Ch1-6` `Ch3-4` `Ch3-6` `Ch4-6` を**トークン全体で**先に処理する |
| 2 | **節番号** | `Ch4.1` -> `Ch6.1`、`Ch3.1`〜`Ch3.6` -> `Ch5.1`〜`Ch5.6` |
| 3 | **章番号単独（降順）** | `Ch6->Ch8` -> `Ch5->Ch7` -> `Ch4->Ch6` -> `Ch3->Ch5` -> `Ch2->Ch4` |

**作業規律 #4 が一括置換を禁じている。** 上記は列挙のための順序であって、実行は 1 件ずつ確認して当てる。**変更しないもの（`Ch1` 単独 22 件）も理由つきで記録する。**

## 3. 番号だけでは済まないもの

| 対象 | 件数 | 内容 |
|---|---:|---|
| **ANPS のファイル分割記述** | **24 ファイル** | `spec-foundation` = Ch1-2 -> **Ch1-4**、`spec-architecture` = Ch3-6 -> **Ch5-8**。エージェント定義 16・コマンド 2・process-rules 6 に散っている |
| プロセス規則 | 84 箇所 | 最大の塊。GATE の判定対象章 |
| review-standards | 19 箇所 | R1 の対象章が Ch1-2 -> Ch1-4 |
| 文書管理規則 | 14 箇所 | `spec-foundation` / `spec-architecture` の file_type 定義 |
| architect / srs-writer | 28 箇所 | 担当章の範囲 |
| **srs-writer の責務** | — | **Ch2・Ch3 の執筆が新たに加わる。** ヒアリング項目に「どの機械の上で動くか」「誰が何を達成するか」を足す |
| **review-agent の観点** | — | **紐づけ先を持たない要求の検出（Ch4.3）が新たな確認項目になる** |

## 4. 本ドラフトが本体に対して行った記法上の変更

| # | 内容 |
|:-:|---|
| 1 | **コードブロック・図の直前に `**タイトル:**` を置いた。** CLAUDE.md の記法規約に従う。本体 v0.34 は一部で欠けている |
| 2 | Mermaid の矢印にラベルを付けた（凡例図は元から付いていた） |

## 5. 適用後に走らせる検査

```bash
node tools/check-parity.mjs && node tools/check-roster.mjs && node tools/check-links.mjs && node tools/check-tagnames.mjs && node tools/check-terms.mjs && node tools/check-setup.mjs
```

**`check-parity` は 41 ファイル対で ja / en の行数一致を強制する。** 作業規律 #1 に従い ja を先に仕上げ、確認してから en に反映する。

## 6. 本ドラフトで決めていないこと

| # | 内容 |
|:-:|---|
| 1 | **簡易形式（改良計画 段階 1）への影響。** 簡易は「spec-template を現行のまま使う」前提だった。本改訂で基準線が動く |
| 2 | **ANGS / StrictDoc との関係。** Ch2 のノード・接続は関係の集合であり、StrictDoc の `RELATIONS` に写せる見込みがある。**未検証** |
| 3 | **既存の仕様書（`gr-sw-maker-trial` の 2,908 行）を新構成へ移すコスト。** 未測定 |
| 4 | en 版の作成。ja 確定後 |
