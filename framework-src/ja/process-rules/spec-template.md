# [プロジェクト名] 仕様書

**Grammar**: spec-anms.sgra
**UID**: DOC-SPEC
**Version**: 0.1

## Chapter 1. Foundation (基本事項)

### 1.1 Background (背景)

**Type**: SECTION

[なぜこのソフトウェアが必要か、ドメインの現状を記入する]

### 1.2 Challenges (課題)

**Type**: SECTION

[現状の具体的な問題点を記入する]

### 1.3 Goals (目標)

#### [達成すべき状態を 1 つ、機能の目標として記入する]

**Type**: GOAL
**UID**: GL-001

**STATEMENT**: [誰が、何をできる状態になるかを 1 文で記入する]

#### [達成すべき状態を 1 つ、品質の目標として記入する]

**Type**: GOAL
**UID**: GL-002

**STATEMENT**: [速さ・安全・可用性のいずれかについて、達成すべき状態を 1 文で記入する]

### 1.4 Approach (解決方針)

**Type**: SECTION

[技術スタックとアーキテクチャ方針を記入する]

### 1.5 Scope (範囲)

**Type**: SECTION

| 区分         | 内容                                 |
| ------------ | ------------------------------------ |
| In-scope     | [本プロジェクトでやることを記入する] |
| Out-of-scope | [やらないことを記入する]             |

### 1.6 Constraints (制約事項)

**Type**: SECTION

[技術・法規・倫理・特許等、絶対に破れない制約を記入する]

### 1.7 Limitations (制限事項)

**Type**: SECTION

[要求を完全には満たさないが許容可能な既知の妥協点を記入する]

### 1.8 Glossary (用語集)

**Type**: SECTION

| 用語                     | 定義   |
| ------------------------ | ------ |
| [プロジェクト固有の用語] | [定義] |
| [2 つ目の用語]           | [定義] |

### 1.9 Notation (表記規約)

**Type**: SECTION

本書は RFC 2119 / RFC 8174 に従う。SHALL / MUST は必須、SHOULD は推奨、MAY は任意を表す。規範語として扱うのは大文字で書かれた場合に限る。

**例外:** EARS 構文中の小文字 `shall` は、本書では大文字の SHALL と同じ拘束力を持つものとする。

**文体:** 記述文では主語と他動詞の目的語を省略しない。指示文（「〜する（MUST）」の形）はこの限りでない。

**図:** 大きな図は `_assets/fig-<name>.md` へ出して本文から参照する。判定の閾値を変更した場合はここに記す。

**EARS 構文パターン（日英併記）:**

| パターン | 英語構文 | 日本語の形 | 用途 |
|---|---|---|---|
| Ubiquitous | The [System] shall [Response]. | [System] は、[Response] すること。 | 常に成り立つ要求 |
| Event-driven | **When** [Trigger], the [System] shall [Response]. | [Trigger] したとき、[System] は、[Response] すること。 | イベント起点の要求 |
| State-driven | **While** [In State], the [System] shall [Response]. | [In State] の間、[System] は、[Response] すること。 | 状態依存の要求 |
| Unwanted Behavior | **If** [Trigger], then the [System] shall [Response]. | もし [Trigger] ならば、[System] は、[Response] すること。 | 異常系・例外処理 |
| Optional Feature | **Where** [Feature is included], the [System] shall [Response]. | [Feature] がある場合、[System] は、[Response] すること。 | オプション機能・条件付き機能 |
| Complex | **While** [In State], **when** [Trigger], the [System] shall [Response]. | [In State] の間、[Trigger] したとき、[System] は、[Response] すること。 | 複合条件の要求。**状態が先、契機が後**（原論文の節順に従う） |

**条件は主語より先に書く（MUST）。これが EARS の要点である。**

**要求は必ず「〜すること。」で終える（MUST）。** 事実の記述は「〜する。」、推奨は「〜が望ましい。」で区別する。

> **`Where` は、製品にその機能が入っているかどうかで分ける。実行時に切り替わるものは State-driven である（MUST）。**

**`[System]` の定義。** EARS の `[System]` は、**Chapter 2.2 で「対象ソフトが載る」と記した機器の上で動くソフトウェアを指す。Chapter 2 を書かずに Chapter 4 を書いてはならない（MUST NOT）。**

## Chapter 2. System Overview (システム概要)

### 2.1 Overview Diagram (概要図)

**Type**: SECTION

**構成の概要:**

```mermaid
flowchart LR
    Actor["[アクター名]"] -->|"[何が流れるか]"| Device
    Device["[対象ソフトが載る機器]"]:::target -->|"[何が流れるか]"| Actor

    classDef target fill:#FFFFFF,stroke:#000,stroke-width:4px
```

対象ソフトが載る機器を太枠で示す。色は使わない。線のラベルには何が流れるかを書く。

### 2.2 Devices (機器)

**Type**: SECTION

| 機器           | 種別   | 対象ソフトが載るか | 供給元        | こちらで変えられるか        |
| -------------- | ------ | ------------------ | ------------- | --------------------------- |
| [機器名]       | [種別] | [載る / 載らない]  | [既存 / 新規] | [変えられる / 変えられない] |
| [2 つ目の機器] | [種別] | [載る / 載らない]  | [既存 / 新規] | [変えられる / 変えられない] |

### 2.3 Routes (経路)

**Type**: SECTION

| from   | to     | 運ぶもの   | 方式   | 入力として信頼できるか |
| ------ | ------ | ---------- | ------ | ---------------------- |
| [起点] | [終点] | [運ぶもの] | [方式] | [信頼できない]         |
| [終点] | [起点] | [運ぶもの] | [方式] | [該当なし（送信のみ）] |

### 2.4 Exclusions (持たないもの)

**Type**: SECTION

| 持たないもの           | 理由             |
| ---------------------- | ---------------- |
| [構成に含まれないもの] | [なぜ持たないか] |
| [2 つ目の持たないもの] | [なぜ持たないか] |

## Chapter 3. Use Cases (ユースケース)

### 3.1 Actors (アクター)

**Type**: SECTION

| アクター           | アクター種別 | 対応する機器 | 関心           |
| ------------------ | ------------ | ------------ | -------------- |
| [アクター名]       | 人           | 該当なし     | [何を得たいか] |
| [2 つ目のアクター] | 外部システム | [機器名]     | [何を得たいか] |

### 3.2 Use Cases (ユースケース)

#### [アクターの目標を動詞句で記入する]

**Type**: USE_CASE
**UID**: UC-001

**STATEMENT**: [アクターが何を示し、システムが何を返すかを 1 文で記入する]

**SCENARIO**:

1. [アクターがすることを 1 文で記入する]
2. [システムがすることを 1 文で記入する]
3. [システムがすることを 1 文で記入する]

**EXTENSIONS**:

- 2a. [主成功シナリオから外れる条件を記入する]
  - [そのときシステムがすることを記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `GL-001`
  **Role**: `Satisfies`

#### [2 つ目のユースケース]

**Type**: USE_CASE
**UID**: UC-002

**STATEMENT**: [1 文で書く]

**SCENARIO**:

1. [手順 1]
2. [手順 2]
3. [手順 3]

**EXTENSIONS**:

- 2a. [条件]
  - [処置]

**Relations**:

- **Type**: `Parent`
  **ID**: `GL-001`
  **Role**: `Satisfies`

## Chapter 4. Requirements (要求)

### 4.1 Functional Requirements (機能要求)

#### [システムの振る舞いを 1 つ、名前として記入する]

**Type**: FUNC_REQ
**UID**: FR-001

**STATEMENT**: [EARS 1 文で記入する。条件を主語より先に置き、「〜すること。」で終える]

**ORIGIN**: [どの手順または拡張から来たかを記入する]

**RATIONALE**: [なぜこの要求が要るのかを記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `UC-001`
  **Role**: `Satisfies`

#### [2 つ目の機能要求]

**Type**: FUNC_REQ
**UID**: FR-002

**STATEMENT**: [EARS 1 文で書く]

**ORIGIN**: [出どころ]

**RATIONALE**: [理由]

**Relations**:

- **Type**: `Parent`
  **ID**: `UC-002`
  **Role**: `Satisfies`

### 4.2 Non-Functional Requirements (非機能要求)

#### [品質の要求を 1 つ、名前として記入する]

**Type**: NON_FUNC_REQ
**UID**: NFR-001

**STATEMENT**: [測定可能な数値基準を含む EARS 1 文で記入する]

**RATIONALE**: [どの経路・どの機器に効くのかを名前で記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `GL-002`
  **Role**: `Satisfies`

#### [2 つ目の非機能要求]

**Type**: NON_FUNC_REQ
**UID**: NFR-002

**STATEMENT**: [数値基準を含む EARS 1 文で書く]

**RATIONALE**: [効く対象]

**Relations**:

- **Type**: `Parent`
  **ID**: `GL-001`
  **Role**: `Satisfies`

### 4.3 Reduction Candidates (削減候補)

**Type**: SECTION

| 対象ID           | 紐づけ先が無い理由 | 外すと何が起きるか | ユーザーの判断 |
| ---------------- | ------------------ | ------------------ | -------------- |
| [UID / 候補なし] | [理由]             | [1 行で記入する]   | [残す / 外す]  |
| [2 つ目の対象ID] | [理由]             | [1 行で書く]       | [残す / 外す]  |

## Chapter 5. Design (設計)

### 5.1 Architecture Concept (アーキテクチャ方式)

**Type**: SECTION

**層の凡例:**

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

[採用するアーキテクチャを記入する。Clean Architecture 以外を採る場合は凡例をここで差し替える]

### 5.2 Components (コンポーネント)

**Type**: SECTION

[部品と責務の分割をコンポーネント図で記入する。各コンポーネントが Chapter 2.2 のどの機器に載るかを書く]

### 5.3 File Structure (ファイル構成)

**Type**: SECTION

[ディレクトリ構成と、コンポーネントとフォルダの対応を記入する。各コンポーネントの公開面を宣言する]

### 5.4 Domain Model (ドメインモデル)

**Type**: SECTION

[概念と関係を記入する。構造を持つ型が複数あるならクラス図、永続ストアを持つなら ER 図を描く]

### 5.5 Behavior (振る舞い)

**Type**: SECTION

[処理フローと相互作用を記入する。持続する状態を持つなら状態遷移図、複数コンポーネントの相互作用があるならシーケンス図を描く]

### 5.6 Decisions (設計判断)

**Type**: SECTION

**ADR-000 最小構成との比較:**

| 項目         | 内容                                 |
| ------------ | ------------------------------------ |
| Context      | [要求を満たす最小の構成を記入する]   |
| Decision     | [採用案が増やした要素を記入する]     |
| Status       | [Proposed / Accepted / Superseded]   |
| Consequences | [各々を増やした理由と代償を記入する] |

**ADR-001 [2 つ目の設計判断]:**

| 項目         | 内容                               |
| ------------ | ---------------------------------- |
| Context      | [背景]                             |
| Decision     | [決めたこと]                       |
| Status       | [Proposed / Accepted / Superseded] |
| Consequences | [結果と代償]                       |

**描かなかった図:** [図の種類と、描かなかった理由を 1 行で記入する。無ければ「該当なし」と記入する]

## Chapter 6. Software Specification (ソフトウェア仕様)

### 6.1 Software Specifications (ソフトウェア仕様)

#### [実装可能な言明を 1 つ、名前として記入する]

**Type**: SW_SPEC
**UID**: SWS-001

**STATEMENT**: [EARS 1 文で記入する。符号・状態遷移・境界値などの手段を書く]

**RATIONALE**: [親の要求を、どの経路・どの条件で具体化したものかを記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `FR-001`
  **Role**: `Satisfies`

#### [2 つ目のソフトウェア仕様]

**Type**: SW_SPEC
**UID**: SWS-002

**STATEMENT**: [EARS 1 文で書く]

**RATIONALE**: [具体化の理由]

**Relations**:

- **Type**: `Parent`
  **ID**: `FR-002`
  **Role**: `Satisfies`

### 6.2 Data Schema (データスキーマ)

**Type**: SECTION

**[スキーマの名前]:**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "[名前]",
  "type": "object",
  "required": [],
  "properties": {},
  "additionalProperties": false
}
```

[永続ストアを持たない場合は「持たない」と記入し、Chapter 2.4 と揃える]

## Chapter 7. Test Strategy (テスト戦略)

**Type**: SECTION

| 系統                   | テストレベル            | 方針   | ツール/フレームワーク | 合格基準                 |
| ---------------------- | ----------------------- | ------ | --------------------- | ------------------------ |
| ユースケーステスト     | —（系統として持たない） | [方針] | [ツール]              | 全 `UC` PASS             |
| ソフトウェア仕様テスト | `Unit`                  | [方針。**仕様書の外で実施する**（`5c`）。ケースは Ch9 に書かない] | [ツール]              | [合格率]                 |
| ソフトウェア仕様テスト | `Integration`           | [方針] | [ツール]              | [合格率]                 |
| ソフトウェア仕様テスト | `System`                | [方針] | [ツール]              | [合格率]                 |
| 非機能テスト           | —（系統として持たない） | [方針] | [ツール]              | NFR 数値目標をすべて達成 |

[機器をまたぐ検証は、どの経路（Chapter 2.3）を実際に通すかを名前で記入する]

## Chapter 8. Use Case Tests (ユースケーステスト)

### 8.1 Test Cases (テストケース)

#### [確かめることを 1 つ、名前として記入する]

**Type**: USE_CASE_TEST
**UID**: TC-001

**GIVEN**: [前提を完全な文で記入する]

**WHEN**: [きっかけを完全な文で記入する]

**THEN**: [観測できる結果を完全な文で記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `UC-001`
  **Role**: `Verifies`
- **Type**: `File`
  **Path**: `[テストコードの位置]`

#### [2 つ目のテストケース]

**Type**: USE_CASE_TEST
**UID**: TC-002

**GIVEN**: [前提]

**WHEN**: [きっかけ]

**THEN**: [結果]

**Relations**:

- **Type**: `Parent`
  **ID**: `UC-002`
  **Role**: `Verifies`
- **Type**: `File`
  **Path**: `[テストコードの位置]`

### 8.2 Test Results (テスト結果)

#### [PASS] [対応するテストケースの名前]

**Type**: TEST_RESULT
**UID**: TR-001
**RESULT**: PASS

**EVIDENCE**: [後から取り出せるログの位置・実行 ID・成果物のパスを記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `TC-001`
  **Role**: `ResultOf`

#### [PASS] [2 つ目のテスト結果]

**Type**: TEST_RESULT
**UID**: TR-002
**RESULT**: PASS

**EVIDENCE**: [取り出せる位置]

**Relations**:

- **Type**: `Parent`
  **ID**: `TC-002`
  **Role**: `ResultOf`

## Chapter 9. Software Specification Tests (ソフトウェア仕様テスト)

### 9.1 Test Cases (テストケース)

#### [確かめることを 1 つ、名前として記入する]

**Type**: SW_SPEC_TEST
**UID**: TC-003
**TEST_LEVEL**: Integration

**GIVEN**: [前提を完全な文で記入する]

**WHEN**: [きっかけを完全な文で記入する]

**THEN**: [観測できる結果を完全な文で記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `SWS-001`
  **Role**: `Verifies`
- **Type**: `File`
  **Path**: `[テストコードの位置]`

#### [2 つ目のテストケース]

**Type**: SW_SPEC_TEST
**UID**: TC-004
**TEST_LEVEL**: System

**GIVEN**: [前提]

**WHEN**: [きっかけ]

**THEN**: [結果]

**Relations**:

- **Type**: `Parent`
  **ID**: `SWS-002`
  **Role**: `Verifies`
- **Type**: `File`
  **Path**: `[テストコードの位置]`

### 9.2 Test Results (テスト結果)

#### [PASS] [対応するテストケースの名前]

**Type**: TEST_RESULT
**UID**: TR-003
**RESULT**: PASS

**EVIDENCE**: [後から取り出せるログの位置・実行 ID・成果物のパスを記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `TC-003`
  **Role**: `ResultOf`

#### [PASS] [2 つ目のテスト結果]

**Type**: TEST_RESULT
**UID**: TR-004
**RESULT**: PASS

**EVIDENCE**: [取り出せる位置]

**Relations**:

- **Type**: `Parent`
  **ID**: `TC-004`
  **Role**: `ResultOf`

## Chapter 10. Non-Functional Tests (非機能テスト)

### 10.1 Test Cases (テストケース)

#### [確かめることを 1 つ、名前として記入する]

**Type**: NON_FUNC_TEST
**UID**: TC-005

**GIVEN**: [測り方と負荷の条件を完全な文で記入する]

**WHEN**: [きっかけを完全な文で記入する]

**THEN**: [親の NON_FUNC_REQ と一致する数値を含む結果を完全な文で記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `NFR-001`
  **Role**: `Verifies`
- **Type**: `File`
  **Path**: `[テストコードの位置]`

#### [2 つ目のテストケース]

**Type**: NON_FUNC_TEST
**UID**: TC-006

**GIVEN**: [測り方と負荷の条件]

**WHEN**: [きっかけ]

**THEN**: [数値を含む結果]

**Relations**:

- **Type**: `Parent`
  **ID**: `NFR-002`
  **Role**: `Verifies`
- **Type**: `File`
  **Path**: `[テストコードの位置]`

### 10.2 Test Results (テスト結果)

#### [PASS] [対応するテストケースの名前]

**Type**: TEST_RESULT
**UID**: TR-005
**RESULT**: PASS

**EVIDENCE**: [後から取り出せるログの位置・実行 ID・成果物のパスを記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `TC-005`
  **Role**: `ResultOf`

#### [PASS] [2 つ目のテスト結果]

**Type**: TEST_RESULT
**UID**: TR-006
**RESULT**: PASS

**EVIDENCE**: [取り出せる位置]

**Relations**:

- **Type**: `Parent`
  **ID**: `TC-006`
  **Role**: `ResultOf`

## Appendix (付録)

### A.1 References (参考文献)

**Type**: SECTION

[標準規格・外部資料へのリンクを記入する]

### A.2 Licenses (ライセンス)

**Type**: SECTION

[依存ライブラリのライセンス情報を記入する]

### A.3 Changelog (変更履歴)

**Type**: SECTION

| 版  | 日付         | 変更内容     |
| --- | ------------ | ------------ |
| 0.1 | [YYYY-MM-DD] | [初版]       |
| 0.2 | [YYYY-MM-DD] | [2 つ目の版] |
