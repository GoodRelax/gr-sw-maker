# `spec.sgra` — 文法の現物と実測

**本書は現物の保全である。** `10-element-table.md`（どの型がどこに置かれるか）と `11-field-table.md`（型が何の欄を持つか）から起こした。**作業場所は session scratchpad のため、そのままでは失われる。**

**`07-anms-sgra-draft.md` の文法を置き換える。** あちらは段 4 の記録であり、`NODE` / `CONNECTION` を持ち、`TEST_RESULT` を分離していない。**歴史として残すが、参照先は本書とする。**

**測定環境:** strictdoc 0.27.1 / Python 3.13.3 / jq 1.8.1 / Windows 11 / Git Bash

---

## 1. 実測の結果（2026-08-09）

| # | 測ったこと | 結果 |
|:-:|---|---|
| 1 | `--formats=json --no-parallelization` が通る | **通った**（終了 0） |
| 2 | `--formats=html` も通る | **通った**（終了 0） |
| 3 | 10 型すべてが解析される | **通った**（下の表） |
| 4 | 関係がすべて解決する | **通った**（`Satisfies` / `Verifies` / `ResultOf` / `File`） |
| 5 | 鎖に穴が無い | **通った。** `GOAL` を除く全ノードが `Parent` を持つ |

**解析されたノード:**

```text
GOAL 1 / USE_CASE 1 / FUNC_REQ 1 / NON_FUNC_REQ 1 / SW_SPEC 2
USE_CASE_TEST 1 / SW_SPEC_TEST 1 / NON_FUNC_TEST 1 / TEST_RESULT 1
SECTION 6 / TEXT 1
```

**解決した鎖:**

```text
GOAL          GL-001   ->  （根）
USE_CASE      UC-001   ->  GL-001[Satisfies]
FUNC_REQ      FR-001   ->  UC-001[Satisfies]
NON_FUNC_REQ  NFR-001  ->  GL-001[Satisfies]
SW_SPEC       SWS-001  ->  FR-001[Satisfies]
SW_SPEC       SWS-002  ->  NFR-001[Satisfies]
USE_CASE_TEST TC-001   ->  UC-001[Verifies] , tests/test_lookup.py[File]
SW_SPEC_TEST  TC-002   ->  SWS-002[Verifies] , tests/test_validate.py[File]
NON_FUNC_TEST TC-003   ->  NFR-001[Verifies] , tests/test_input_coverage.py[File]
TEST_RESULT   TR-001   ->  TC-001[ResultOf]
```

> **`SW_SPEC` が `FUNC_REQ` と `NON_FUNC_REQ` の両方を親に取れることを確認した**（`SWS-001` と `SWS-002`）。`.sgra` の `RELATIONS` は相手の型を制約しないため、1 つの `ROLE: Satisfies` で両方に届く。

---

## 2. 文法ファイル `spec.sgra`

**ノード型 10 種。** `GOAL` を根とし、`ROLE` は `Satisfies` / `Verifies` / `ResultOf` の 3 種のみ。**すべて鎖に載る。**

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
- TAG: USE_CASE
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
  - TITLE: MAIN_SCENARIO
    TYPE: String
    REQUIRED: True
  - TITLE: EXTENSIONS
    TYPE: String
    REQUIRED: False
  RELATIONS:
  - TYPE: Parent
    ROLE: Satisfies
- TAG: FUNC_REQ
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
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
- TAG: NON_FUNC_REQ
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
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
- TAG: SW_SPEC
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
    REQUIRED: True
  - TITLE: REVIEW_STATUS
    TYPE: SingleChoice(NotReviewed, NoFinding, Open, Fixed, WontFix)
    REQUIRED: True
  - TITLE: STATEMENT
    TYPE: String
    REQUIRED: True
  - TITLE: RATIONALE
    TYPE: String
    REQUIRED: False
  RELATIONS:
  - TYPE: Parent
    ROLE: Satisfies
- TAG: USE_CASE_TEST
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
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
- TAG: SW_SPEC_TEST
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
    REQUIRED: True
  - TITLE: TEST_LEVEL
    TYPE: SingleChoice(Unit, Integration, System)
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
- TAG: NON_FUNC_TEST
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
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
- TAG: TEST_RESULT
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
    REQUIRED: True
  - TITLE: RESULT
    TYPE: SingleChoice(PASS, CONDITIONAL, FAIL, SKIP)
    REQUIRED: True
  - TITLE: EXECUTED_ON
    TYPE: String
    REQUIRED: True
  - TITLE: TESTED_VERSION
    TYPE: String
    REQUIRED: True
  - TITLE: ENVIRONMENT
    TYPE: String
    REQUIRED: True
  - TITLE: EVIDENCE
    TYPE: String
    REQUIRED: True
  - TITLE: REMARK
    TYPE: String
    REQUIRED: False
  RELATIONS:
  - TYPE: Parent
    ROLE: ResultOf
```

---

## 3. `.md` の書き方（実測で通った形）

**メタデータ欄の直後に `**Relations**:` を置き、長い欄はその後ろに書く。** 空行を 1 つ挟むと export が止まる。

```markdown
### 語の形を検証する

**Type**: SW_SPEC \
**UID**: SWS-002 \
**REVIEW_STATUS**: NoFinding
**Relations**:
- **Type**: `Parent` \
  **ID**: `NFR-001` \
  **Role**: `Satisfies`

**STATEMENT**: もし `word` が英小文字 1 文字以上 32 文字以下に一致しないならば、 システムは、 HTTP 400 と符号 `invalid_word` を返すこと。

**RATIONALE**: 集合との照合を、 経路ごとに具体化したものである。
```

**テスト結果の実例:**

```markdown
### [PASS] 語を問い合わせて意味を得る

**Type**: TEST_RESULT \
**UID**: TR-001 \
**RESULT**: PASS \
**EXECUTED_ON**: 2026-08-09T14:32:05+09:00 \
**TESTED_VERSION**: 9f3c1ab \
**ENVIRONMENT**: CI (host, python 3.13) \
**EVIDENCE**: ci/run-4821/junit.xml#test_lookup::test_hit
**Relations**:
- **Type**: `Parent` \
  **ID**: `TC-001` \
  **Role**: `ResultOf`

**REMARK**: 初回の走行である。
```

**文書ヘッダ:**

```markdown
# 全 10 型の通し確認

**Grammar**: spec.sgra \
**UID**: DOC-SMOKE \
**Version**: 0.36
```

---

## 4. 作り直すときの手順

```bash
mkdir -p spec && cd spec
# spec.sgra を §2 から貼る
# .md を §3 の形で書く（先頭は H1。**Grammar**: spec.sgra を H1 の直後に置く）
cd ..
strictdoc export spec --formats=json --output-dir out/json --no-parallelization
strictdoc export spec --formats=html --output-dir out/html --no-parallelization
```

| # | 守ること |
|:-:|---|
| 1 | **出力先を入力フォルダの中に置かない。** 出力先を変えた回に UID 重複で止まる |
| 2 | **`--no-parallelization` を必ず付ける。** 並列 export が本当のエラーを握り潰す |
| 3 | **ファイルはヒアドキュメント（または素の書き出し）で作り、`od -c` でバイトを確かめる。** 文字列エスケープ経由だと `\` + 改行がリテラル 2 文字になる |
| 4 | **`_assets/` の図には `**Grammar**` を宣言しない。** パス解決で落ちる |

---

## 5. まだ測っていないこと

| # | 内容 |
|:-:|---|
| 1 | **14 枚に分けた構成での export。** 本書は 1 枚に 10 型を詰めた通し確認であり、**文書をまたぐ参照は測っていない**（段 4 で 7 枚では通っている） |
| 2 | **D16 / D19 / D20 / D21 のクエリ。** 本書では D17（鎖の穴）だけを確かめた |
| 3 | **`.meta.yaml` を同じフォルダに置いた場合。** 段 4 で 1 度確認しているが、新構成では未確認 |
