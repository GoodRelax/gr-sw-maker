# 型ごとの欄 一覧表

**本書は `10-element-table.md` の続きである。** あちらが「どの型がどこに置かれるか」、本書が「その型が何の欄を持つか」を持つ。**この 2 枚で `.sgra` が書ける。**

| `TAG` | 欄名（`.sgra` の `TITLE:`） | `TYPE:`（for Field） | `REQUIRED:` | 中身 |
|---|---|---|---|---|
| `SECTION` | `TITLE` | `String` | `True` | 章・節の見出し |
| `GOAL` | `UID` | `String` | `True` | `GL-001` |
| `GOAL` | `TITLE` | `String` | `True` | 目標の名前 |
| `GOAL` | `STATEMENT` | `String` | `True` | 達成すべき状態を 1 文で |
| `USE_CASE` | `UID` | `String` | `True` | `UC-001` |
| `USE_CASE` | `TITLE` | `String` | `True` | ユースケースの名前 |
| `USE_CASE` | `STATEMENT` | `String` | `True` | アクターの目標を 1 文で |
| `USE_CASE` | `MAIN_SCENARIO` | `String` | `True` | 主成功シナリオ。3〜9 手順 |
| `USE_CASE` | `EXTENSIONS` | `String` | `False` | 拡張。ここから要求が生まれる |
| `FUNC_REQ` | `UID` | `String` | `True` | `FR-001` |
| `FUNC_REQ` | `TITLE` | `String` | `True` | 要求の名前 |
| `FUNC_REQ` | `REVIEW_STATUS` | `SingleChoice(NotReviewed, NoFinding, Open, Fixed, WontFix)` | `True` | レビュー指摘の状態 |
| `FUNC_REQ` | `STATEMENT` | `String` | `True` | **EARS 1 文** |
| `FUNC_REQ` | `ORIGIN` | `String` | `False` | 出所。規格・利用者の要望など |
| `FUNC_REQ` | `RATIONALE` | `String` | `False` | なぜ要るか |
| `NON_FUNC_REQ` | `UID` | `String` | `True` | `NFR-001` |
| `NON_FUNC_REQ` | `TITLE` | `String` | `True` | 要求の名前 |
| `NON_FUNC_REQ` | `REVIEW_STATUS` | `SingleChoice(NotReviewed, NoFinding, Open, Fixed, WontFix)` | `True` | 同上 |
| `NON_FUNC_REQ` | `STATEMENT` | `String` | `True` | **EARS 1 文** |
| `NON_FUNC_REQ` | `ORIGIN` | `String` | `False` | 同上 |
| `NON_FUNC_REQ` | `RATIONALE` | `String` | `False` | 同上 |
| `SW_SPEC` | `UID` | `String` | `True` | `SWS-001` |
| `SW_SPEC` | `TITLE` | `String` | `True` | 仕様の名前 |
| `SW_SPEC` | `REVIEW_STATUS` | `SingleChoice(NotReviewed, NoFinding, Open, Fixed, WontFix)` | `True` | 同上 |
| `SW_SPEC` | `STATEMENT` | `String` | `True` | **EARS 1 文。** 資料に機械可読な形で在ることを繰り返さない |
| `SW_SPEC` | `RATIONALE` | `String` | `False` | なぜその形にしたか。**`ORIGIN` は持たない**（親の関係が出所を示す） |
| `USE_CASE_TEST` | `UID` | `String` | `True` | `TC-001` |
| `USE_CASE_TEST` | `TITLE` | `String` | `True` | テストの名前 |
| `USE_CASE_TEST` | `GIVEN` | `String` | `True` | 前提 |
| `USE_CASE_TEST` | `WHEN` | `String` | `True` | 操作・事象 |
| `USE_CASE_TEST` | `THEN` | `String` | `True` | 期待結果 |
| `SW_SPEC_TEST` | `UID` | `String` | `True` | `TC-001`（`TC` は 3 系統で通しの連番） |
| `SW_SPEC_TEST` | `TITLE` | `String` | `True` | テストの名前 |
| `SW_SPEC_TEST` | `TEST_LEVEL` | `SingleChoice(Unit, Integration, System)` | `True` | **この型だけが段にまたがる** |
| `SW_SPEC_TEST` | `GIVEN` | `String` | `True` | 前提 |
| `SW_SPEC_TEST` | `WHEN` | `String` | `True` | 操作・事象 |
| `SW_SPEC_TEST` | `THEN` | `String` | `True` | 期待結果 |
| `NON_FUNC_TEST` | `UID` | `String` | `True` | `TC-001` |
| `NON_FUNC_TEST` | `TITLE` | `String` | `True` | テストの名前 |
| `NON_FUNC_TEST` | `GIVEN` | `String` | `True` | 前提 |
| `NON_FUNC_TEST` | `WHEN` | `String` | `True` | 操作・事象 |
| `NON_FUNC_TEST` | `THEN` | `String` | `True` | 期待結果 |
| `TEST_RESULT` | `UID` | `String` | `True` | `TR-001` |
| `TEST_RESULT` | `TITLE` | `String` | `True` | 判定で始める（`[PASS] 〜`）。ツリーで判定が見える |
| `TEST_RESULT` | `RESULT` | `SingleChoice(PASS, CONDITIONAL, FAIL, SKIP)` | `True` | 判定 |
| `TEST_RESULT` | `EXECUTED_ON` | `String` | `True` | **ISO 8601 の日時**（`2026-08-09T14:32:05+09:00`）。**日付だけにしない（MUST NOT）** |
| `TEST_RESULT` | `TESTED_VERSION` | `String` | `True` | **被試験ソフトを一意に特定するもの。** commit SHA を推奨、タグ可 |
| `TEST_RESULT` | `ENVIRONMENT` | `String` | `True` | 走らせた環境 |
| `TEST_RESULT` | `EVIDENCE` | `String` | `True` | **後から取り出せる証跡。** ログの位置・実行 ID・成果物のパス |
| `TEST_RESULT` | `REMARK` | `String` | `False` | 備考。`CONDITIONAL` / `FAIL` / `SKIP` のときは理由を書く |

## 文書ヘッダ（`.sgra` では宣言しない）

**H1 の直後に置く。組み込みの欄しか使えない。**

| 欄 | 必須 | 中身 |
|---|:-:|---|
| `**Grammar**` | 必要 | `.sgra` への相対パス。**`_assets/` の図では宣言しない**（パス解決で落ちる） |
| `**UID**` | 必要 | `DOC-FOUNDATION` など |
| `**Version**` | 任意 | 文書の版 |

> **文書ヘッダに独自の欄を書いてはならない（MUST NOT）。** エラーも警告も出さずに消える（実測）。**要求の欄は未知だとエラーになるのに、文書の欄は黙って捨てられる。**

## 凡例

| 表記 | 意味 |
|---|---|
| `TITLE:` | `.sgra` で欄の名前を宣言するキー。**欄そのものの名前ではない** |
| `TITLE`（欄名） | 見出しから来る欄。**`.md` に `**TITLE**:` とは書かない** |
| `REQUIRED: True` | 欠けると export が止まる |
| `REQUIRED: False` | 省いてよい |

---

## 注釈

### 使える `TYPE`（for Field）は 4 種

**strictdoc 0.27.1 の文法定義から確認した**（`backend/sdoc/grammar/grammar_grammar.py`）。

| `TYPE:` | 中身 | 本フレームワークでの使用 |
|---|---|---|
| `String` | 任意の文字列 | **使う** |
| `SingleChoice(a, b, c)` | 列挙から 1 つ | **使う** |
| `MultipleChoice(a, b, c)` | 列挙から複数 | 使わない。**必要になれば使える** |
| `Tag` | タグの列 | 使わない |

**選択肢に `,` `(` `)` `"` を含めてはならない（MUST NOT）。** 含めるなら `"` で囲む必要がある（文法の `ChoiceOption` が `/(["])[^,]+\1|[^,()"]+/`）。

### 欄の宣言に書ける項目

```text
- TITLE: TESTED_VERSION        欄の名前（必須）
  HUMAN_TITLE: 被試験バージョン   表示名（任意）
  TYPE: String                 型（必須）
  REQUIRED: True               必須か（必須。True / False）
```

> **`HUMAN_TITLE` は使わない。** 効くのは HTML のラベルだけで、`.md` の書き方も JSON の鍵も変わらない（実測。下の節を見よ）。**エージェントは JSON しか見ないので、全 50 欄に 1 行ずつ足しても得るものが無い。**

### 欄名の綴り

| 対象 | 文法上の規則 | 出典 |
|---|---|---|
| `TAG`（型名） | `[A-Z]+(_[A-Z]+)*` | **大文字と下線のみ。数字も不可** |
| **欄名** | **`[A-Z]+[A-Za-z0-9_\-]*`** | **先頭は大文字。以降は英数字・下線・ハイフン可** |

> **欄名は `TAG` より緩い。** 数字も小文字もハイフンも使える。**しかし本フレームワークは UPPER_SNAKE_CASE に統一する（MUST）** —— 緩いからといって書き方を混ぜると、読み手が規則を覚えられない。

### `TITLE` は見出しから来る

**`TITLE` は `.sgra` で宣言するが、`.md` には欄として書かない。** 見出しがそのまま `TITLE` になる。

```markdown
### 語を受け取る          ← これが TITLE になる

**Type**: FUNC_REQ \
**UID**: FR-001
```

### `REVIEW_STATUS` を 3 型に置く理由

**段 4 の文法では `REQUIREMENT` だけが持っていた。`SW_SPEC` にも広げる。**

**Ch8 Design Principles Compliance の指摘が着く先が要るためである。** 設計原則の違反は要求文より**詳細仕様に出やすい**。置き場所が無いと、指摘が地の文に流れて追跡できなくなる。

### 置かないと決めた欄

| 欄 | どこに置く案だったか | 置かない理由 |
|---|---|---|
| `UC_LEVEL` | `USE_CASE` | **`SingleChoice(sea)` は選択肢が 1 つで、強制力がほとんど無い。** cloud 相当のユースケースを書いても `sea` と書けば通る。**抽象度の判定は review-agent に残る** |
| 品質特性（性能 / セキュリティ / …） | `NON_FUNC_REQ` | **EARS 文が既に述べている。** 必要になれば `MultipleChoice` で後から足せる |
| `HUMAN_TITLE` | 全欄 | **HTML のラベルしか変えない**（実測）。**エージェントは JSON しか見ないので効かない** |
| `TEST_KIND` | テスト 3 型 | 系統は `TAG` が持つ |
| `REQ_KIND` | 要求 2 型 | 機能／非機能は `TAG` が持つ |
| `EXECUTED_BY` | `TEST_RESULT` | プロセスが節ごとに `tester` と定めている |
| 観点（性能 / セキュリティ / …） | `NON_FUNC_TEST` | 上位の `NON_FUNC_REQ` を見れば分かる |

### `HUMAN_TITLE` の実測（2026-08-09）

**`.sgra` の欄宣言に書ける表示名。効くのは HTML だけである。**

| `.md` の書き方 | 結果 |
|---|:-:|
| `**TESTED_VERSION**: 9f3c1ab`（欄名） | **通る** |
| `**被試験バージョン**: 9f3c1ab`（表示名） | **落ちる** |

**JSON の鍵も欄名のままである。** 変わるのは HTML の `<sdoc-node-field-label>` だけ。**採らない。**
