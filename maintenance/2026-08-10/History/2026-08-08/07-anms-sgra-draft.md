# 段 4 で作った ANMS 用の文法と検証物

**本書は記録である。** `04-spec-format-unification.md` の段 4 で作り、export が通ることを実測した現物を保全する。作業場所は session scratchpad だったため、そのままでは失われる。

**測定環境:** strictdoc 0.27.1 / Python 3.13.3 / jq 1.8.1 / Windows 11 / Git Bash

**通った条件:** json ok / html ok / 孤立要求の検出 ok / 図の外出し ok / 素の Markdown として読める

---

## 1. 文法ファイル `anms.sgra`

**ノード型 7 種。** `GOAL` を根とし、鎖の関係は `Satisfies` と `Verifies`、鎖の外は `Affects` と `From` / `To`。

```text
[GRAMMAR]
ELEMENTS:
- TAG: SECTION
  PROPERTIES:
    IS_COMPOSITE: True
  FIELDS:
  - TITLE: TITLE
    TYPE: String
    REQUIRED: True
- TAG: GOAL
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
    REQUIRED: True
  - TITLE: STATEMENT
    TYPE: String
    REQUIRED: True
- TAG: NODE
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
    REQUIRED: True
  - TITLE: NODE_KIND
    TYPE: String
    REQUIRED: True
  - TITLE: CARRIES_SOFTWARE
    TYPE: SingleChoice(Yes, No)
    REQUIRED: True
  - TITLE: SUPPLY
    TYPE: SingleChoice(Existing, New)
    REQUIRED: True
  - TITLE: CHANGEABLE
    TYPE: SingleChoice(Yes, No)
    REQUIRED: True
  - TITLE: STATEMENT
    TYPE: String
    REQUIRED: True
- TAG: CONNECTION
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
    REQUIRED: True
  - TITLE: PAYLOAD
    TYPE: String
    REQUIRED: True
  - TITLE: MEANS
    TYPE: String
    REQUIRED: True
  - TITLE: TRUSTED
    TYPE: SingleChoice(Trusted, Untrusted, NotApplicable)
    REQUIRED: True
  - TITLE: STATEMENT
    TYPE: String
    REQUIRED: True
  RELATIONS:
  - TYPE: Parent
    ROLE: From
  - TYPE: Parent
    ROLE: To
- TAG: USE_CASE
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
    REQUIRED: True
  - TITLE: UC_LEVEL
    TYPE: SingleChoice(sea)
    REQUIRED: True
  - TITLE: STATEMENT
    TYPE: String
    REQUIRED: True
  - TITLE: MAIN_SCENARIO
    TYPE: String
    REQUIRED: True
  - TITLE: EXTENSIONS
    TYPE: String
    REQUIRED: False
  RELATIONS:
  - TYPE: Parent
    ROLE: Satisfies
- TAG: REQUIREMENT
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
    REQUIRED: True
  - TITLE: REQ_KIND
    TYPE: SingleChoice(Functional, NonFunctional)
    REQUIRED: True
  - TITLE: REVIEW_STATUS
    TYPE: SingleChoice(NotReviewed, NoFinding, Open, Fixed, WontFix)
    REQUIRED: True
  - TITLE: STATEMENT
    TYPE: String
    REQUIRED: True
  - TITLE: ORIGIN
    TYPE: String
    REQUIRED: False
  - TITLE: RATIONALE
    TYPE: String
    REQUIRED: False
  RELATIONS:
  - TYPE: Parent
    ROLE: Satisfies
  - TYPE: Parent
    ROLE: Affects
- TAG: TEST_CASE
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
    REQUIRED: True
  - TITLE: TEST_RESULT
    TYPE: SingleChoice(NotRun, Passed, Failed, Blocked)
    REQUIRED: True
  - TITLE: GIVEN
    TYPE: String
    REQUIRED: True
  - TITLE: WHEN
    TYPE: String
    REQUIRED: True
  - TITLE: THEN
    TYPE: String
    REQUIRED: True
  RELATIONS:
  - TYPE: Parent
    ROLE: Verifies
  - TYPE: File
```

**注意:** 段 4 の時点では `TEST_CASE` が `TEST_RESULT` を欄として持っていた。**その後の設計変更で `TEST_RESULT` は別ノード型に分けることになった**（`06-file-inventory.md` §A-2）。**この文法はまだ分離を反映していない。**

---

## 2. 検証に使った仕様書一式

| ファイル | 行 | 中身 |
|---|---:|---|
| `00-foundation.md` | 33 | |
| `01-configuration.md` | 85 | |
| `02-usecases.md` | 38 | |
| `03-requirements.md` | 93 | |
| `04-architecture.md` | 21 | |
| `05-specification.md` | 43 | |
| `_assets/fig-state.md` | 26 | 18 行の図 1 つ |

**要求ノードの実例（`03-requirements.md` より）:**

```markdown
## 入力を検証する

**UID**: NFR-005 \
**REQ_KIND**: NonFunctional \
**REVIEW_STATUS**: NoFinding

**Statement**: もし信頼できない経路から値を受け取ったならば、 システムは、 受け付ける集合との照合によって検証すること。

**Relations**:
- **Type**: `Parent` \
  **ID**: `GOAL-002` \
  **Role**: `Satisfies`
- **Type**: `Parent` \
  **ID**: `CN-001` \
  **Role**: `Affects`

## 誰のためでもない要求
```

**テストケースの実例（`File` 関係つき）:**

```markdown
## 該当が無い語を問い合わせる

**Type**: TEST_CASE \
**UID**: SC-001 \
**TEST_RESULT**: NotRun

**GIVEN**: 登録の無い語が 1 つある。

**WHEN**: 利用者がその語を問い合わせる。

**THEN**: システムが、 該当が無い旨を返す。

**Relations**:
- **Type**: `Parent` \
  **ID**: `FR-003` \
  **Role**: `Verifies`
- **Type**: `File` \
  **Path**: `tests/test_query.py`

## 扱えない形を渡す
```

---

## 3. 作り直すときの手順

```bash
mkdir -p spec/_assets && cd spec
# anms.sgra を上の §1 から貼る
# 各 .md を書く（先頭は H1。**Grammar**: anms.sgra を H1 の直後に置く）
strictdoc export . --formats=json --output-dir ../out --no-parallelization
strictdoc export . --formats=html --output-dir ../out --no-parallelization
```

> **出力先を入力フォルダの中に置いてはならない。** HTML export が `.md` を複製し、出力先を変えた回に UID 重複で止まる（`06-file-inventory.md` §A-4）。

> **ファイルはヒアドキュメントで作ること。** スクリプトの文字列エスケープ経由だと `\` + 改行のつもりがリテラルの 2 文字になり、別の現象を測ることになる（本セッションで 2 度踏んだ）。
