# 仕様書に書ける要素 一覧表

| Spec の章番号と章題 | ファイル名 | DOC 接頭 | UID 接頭 | (for Node) `TAG:` / `**Type**` | 親 `TAG` | (for Relation) `TYPE` / `ROLE` | 作成者 | 編集者 | 読者 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| 全章 | 全ノード文書 | — | — | `SECTION` | — | — | その文書のオーナー | 同左 | その文書の読者 | 章と節の見出し。`IS_COMPOSITE: True` |
| 全章 | 全ノード文書 | — | — | 無し（宣言しない） | — | — | その文書のオーナー | 同左 | その文書の読者 | `TEXT`。地の文。StrictDoc が自動で作る |
| Ch1 Foundation | `xx-foundation.md (SD)` | `DOC-FOUNDATION` | `GL` | `GOAL` | 無し（根） | — | srs-writer | srs-writer / change-manager | 全エージェント | Ch1.3 Goals の各目標に UID を振る。他の節は地の文 |
| Ch2 System Overview | `xx-overview.md (SD)` | `DOC-OVERVIEW` | — | — | — | — | srs-writer | srs-writer | architect / security-reviewer / test-designer | 地の文のみ。機械も経路も UID を持たない（決定 17） |
| Ch3 Use Cases | `xx-use-cases.md (SD)` | `DOC-USE-CASES` | `UC` | `USE_CASE` | `GOAL` | `Parent` / `Satisfies` | srs-writer | srs-writer | architect / review-agent | Ch3.2 の各ユースケースに UID を振る。アクターには振らない |
| Ch4.1 Functional Requirements | `xx-requirements.md (SD)` | `DOC-REQUIREMENTS` | `FR` | `FUNC_REQ` | `USE_CASE` | `Parent` / `Satisfies` | srs-writer | change-manager | 全エージェント | 各機能要求に UID を振る |
| Ch4.2 Non-Functional Requirements | `xx-requirements.md (SD)` | `DOC-REQUIREMENTS` | `NFR` | `NON_FUNC_REQ` | `GOAL` | `Parent` / `Satisfies` | srs-writer | change-manager | 全エージェント | 各非機能要求に UID を振る |
| Ch5 Design | `xx-design.md (SD)` | `DOC-DESIGN` | `ADR` | 無し | — | — | architect | architect | implementer / review-agent / runbook-writer | Ch5.6 の各設計判断に UID を振る。トレースには載せない（決定 24） |
| Ch6 Software Specification | `xx-software-specification.md (SD)` | `DOC-SOFTWARE-SPECIFICATION` | `SWS` | `SW_SPEC` | `FUNC_REQ` または `NON_FUNC_REQ` | `Parent` / `Satisfies` | architect | architect | implementer | 各詳細仕様に UID を振る。EARS 1 文で 1 件 |
| Ch7 Test Strategy | `xx-test-strategy.md (SD)` | `DOC-TEST-STRATEGY` | — | — | — | — | architect | test-designer | test-designer / tester | 地の文のみ。3 系統のマトリクス |
| Ch8 Design Principles Compliance | `xx-design-principles-check.md (SD)` | `DOC-DESIGN-PRINCIPLES-CHECK` | — | — | — | — | architect | review-agent | review-agent / technical-authority | 地の文のみ |
| Ch9.1 Use Case Test Cases | `xx-uc-test-cases.md (SD)` | `DOC-UC-TEST-CASES` | `TC` | `USE_CASE_TEST` | `USE_CASE` | `Parent` / `Verifies` ＋ `File` | test-designer | test-designer | implementer / review-agent / tester | 各受入基準に UID を振る。`File` の鍵は `Path` |
| Ch9.2 Use Case Test Results | `xx-uc-test-results.md (SD)` | `DOC-UC-TEST-RESULTS` | `TR` | `TEST_RESULT` | `USE_CASE_TEST` | `Parent` / `ResultOf` | tester | tester | progress-monitor / test-designer | 各実行記録に UID を振る。1 ケースに N 件 |
| Ch10.1 Software Specification Test Cases | `xx-sws-test-cases.md (SD)` | `DOC-SWS-TEST-CASES` | `TC` | `SW_SPEC_TEST` | `SW_SPEC` | `Parent` / `Verifies` ＋ `File` | test-designer | test-designer | implementer / review-agent / tester | 同上。`TEST_LEVEL` を持つ |
| Ch10.2 Software Specification Test Results | `xx-sws-test-results.md (SD)` | `DOC-SWS-TEST-RESULTS` | `TR` | `TEST_RESULT` | `SW_SPEC_TEST` | `Parent` / `ResultOf` | tester | tester | progress-monitor / test-designer | 同上 |
| Ch11.1 Non-Functional Test Cases | `xx-nfr-test-cases.md (SD)` | `DOC-NFR-TEST-CASES` | `TC` | `NON_FUNC_TEST` | `NON_FUNC_REQ` | `Parent` / `Verifies` ＋ `File` | test-designer | test-designer | implementer / security-reviewer / tester | 同上 |
| Ch11.2 Non-Functional Test Results | `xx-nfr-test-results.md (SD)` | `DOC-NFR-TEST-RESULTS` | `TR` | `TEST_RESULT` | `NON_FUNC_TEST` | `Parent` / `ResultOf` | tester | tester | progress-monitor / test-designer | 同上 |
| 章に属さない | `_assets/fig-<name>.md (SD)` | `DOC-FIG-<NAME>` | — | — | — | — | 図を書いたエージェント | 同左 | 図を参照する者 | 30 行を超える図 1 つ。`Grammar` を宣言しない |

## 凡例

| 表記 | 意味 |
|---|---|
| `xx-` | 章番号。形式によって 1 / 3 / 11 章分の枚数に変わるため伏せる |
| `(SD)` | StrictDoc が解析する Markdown。先頭は H1 |
| `—` | 無い |
| 無し（宣言しない） | `.sgra` に書かない。`.md` にも `**Type**:` を書かない |
| 1 行 | 書ける要素 1 種。節ごとに種類が変われば節で行を分ける |
| 同じ番号の 2 ファイル | 同じ章の 2 つの節を別ファイルにしたもの（Ch9〜Ch11）。番号は章の番号を共有する |

## 注釈

### `TAG` の略記

**`TAG` は UPPER_SNAKE_CASE しか使えず、大文字だけが長く続くと読みにくい。** 定着した略語を持つ語だけを略す。

| 略記した `TAG` | 略さない場合の綴り | 文字数 |
|---|---|---|
| `FUNC_REQ` | `FUNCTIONAL_REQUIREMENT` | 22 → 8 |
| `NON_FUNC_REQ` | `NON_FUNCTIONAL_REQUIREMENT` | 26 → 12 |
| `SW_SPEC` | `SOFTWARE_SPECIFICATION` | 22 → 7 |
| `SW_SPEC_TEST` | `SOFTWARE_SPECIFICATION_TEST` | 27 → 12 |
| `NON_FUNC_TEST` | `NON_FUNCTIONAL_TEST` | 19 → 13 |

**略さない `TAG`:** `SECTION` / `GOAL` / `USE_CASE` / `USE_CASE_TEST` / `TEST_RESULT`

### 略記の規則

| # | 規則 |
|---|---|
| 1 | **同じ語は同じように略す（MUST）。** `SOFTWARE_SPECIFICATION` を `SW_SPEC` と略す以上、それを検証する型も `SW_SPEC_TEST` にする。片方だけ略してはならない |
| 2 | **定着した略語を持つ語だけを略す（MUST）。** `FUNCTIONAL` → `FUNC`、`REQUIREMENT` → `REQ`、`SPECIFICATION` → `SPEC`、`SOFTWARE` → `SW`。**独自に縮めてはならない**（`RESULT` → `RES` としない） |
| 3 | **略記が UID 接頭辞と同じ文字列になる場合は略さない（MUST NOT）。** `USE_CASE` を `UC` に縮めると `TAG` と UID 接頭辞が同じ綴りになり、層の区別が消える |
| 4 | **略記が他の層で既に使われている語と衝突する場合は、限定語を付けて避ける（MUST）。** 下の「`SPEC` を単独で採らない理由」を見よ |

> **`FUNC_REQ` は `NON_FUNC_REQ` の部分文字列である。** `jq` は `_NODE_TYPE` を完全一致で見るので問題にならないが、**部分一致で絞ってはならない（MUST NOT）。** UID の `FR` と `NFR` と同じ罠である。

### `SPEC` を単独で採らない理由

**`spec` は本体系で既に 6 か所に使われている。**

```text
docs/spec/                  仕様書を置くフォルダ
spec.sgra                   文法ファイル
spec-template.md            テンプレート
file_type: spec / spec-upper / spec-design / spec-test / spec-test-case / spec-test-result
Ch6 Software Specification  章題
SWS                         UID 接頭
```

**`SPEC` を `TAG` にすると 7 つ目の用法になり、「仕様書一式」と「詳細仕様 1 件」が同じ語になる。** 限定語 `SW_` を付けて避ける。

**`SW_` は将来の分岐にも効く。** 本フレームワークは HW 連携を条件付きプロセスとして持つ。**HW を扱う日が来れば `HW_SPEC` が必要になり、そのとき `SPEC` は使えない。**

> **章題とファイル名にも `Software` を付けて揃えた**（`Ch6 Software Specification` / `xx-software-specification.md`）。**当初は据え置く案だったが、HW を扱う日に章題だけ後から変えることになる。先に揃えるほうが安い。**

> **UID 接頭辞も `SP` から `SWS` に改めた。** `SP` は 2 文字で意味が広く、`SW_SPEC` との対応も読めない。**`SWS` なら `SW_SPEC` の頭字であることが一目で分かる。**

### ファイル名の付け方

| 場合 | 規則 | 例 |
|---|---|---|
| 通常の章 | **章題を kebab-case にする** | `Ch6 Software Specification` → `xx-software-specification.md` |
| 同じ形の章が並ぶ場合（Ch9〜Ch11） | **先頭語を UID 接頭辞の小文字に置き換える** | `Ch10.1 Specification Test Cases` → `xx-sws-test-cases.md` |

**置き換えるのは 3 章が並んで区別が要るときだけである。** `Ch6 Software Specification` を `xx-sws.md` にはしない —— 並ぶ相手がおらず、短くする理由が無い。

### `DOC` の UID の付け方

> **規則: `DOC-` ＋ ファイル名（番号を除く）を大文字にしたもの（MUST）。**

| ファイル | `DOC` の UID |
|---|---|
| `xx-foundation.md` | `DOC-FOUNDATION` |
| `xx-software-specification.md` | `DOC-SOFTWARE-SPECIFICATION` |
| `xx-sws-test-cases.md` | `DOC-SWS-TEST-CASES` |
| `_assets/fig-state.md` | `DOC-FIG-STATE` |

> **`DOC-SWS` は採らない。** 短いが、**ファイル名から機械的に導けなくなる。** 導ける限り「ファイル名と UID がずれた」を検査で捕まえられる。**例外を 1 つ作ると、その検査が書けなくなる。**

### テストの役割分担

**「テストを実行したエージェント」という書き方をやめ、役割を 2 つに分ける。**

| 役割 | 何を作るか | 何を書くか |
|---|---|---|
| **test-designer** | 受入基準（`TC` ノード）と**テストコード**（`tests/**`） | Ch9.1 / Ch10.1 / Ch11.1 |
| **tester** | 実行と記録 | Ch9.2 / Ch10.2 / Ch11.2 |

**分ける理由は 3 つある。**

| # | 理由 |
|---|---|
| 1 | **`.meta.yaml` の `owner` は 1 つしか書けない。** 「実行したエージェント」では値が定まらない |
| 2 | **ケースと結果をファイルに分けた根拠が、オーナーの違いだった。** 同じ役割が両方を書くなら、分けた理由の半分が消える |
| 3 | **独立性。** 基準を書いた者が自分で結果も記録すると、走らせずに PASS と書ける。**書く者と確かめる者を分けるのは品質管理の基本である** |

> **現行の `test-engineer` を 2 つに割ることになる。** `agent-list.md` と `CLAUDE.md` の名簿の変更であり、**段 5 でユーザーの許可を得てから行う。**

> **未確認が 1 件ある。** 非機能テスト（Ch11）は security-reviewer がスキャンを走らせる場合がある。**そのとき `tester` が代理で記録するのか、`TEST_RESULT` に `EXECUTED_BY` 欄を足すのかは決めていない。**

### 図を外に出す境目

**30 行を超える図は `_assets/` に出す。**

| 版 | 境目 | 根拠 |
|---|---|---|
| 従来 | 15 行 | v0.35 段 1 で定めた |
| **現在** | **30 行** | **StrictDoc の 1 画面に収まる範囲**（ユーザー判断。**実測していない**） |

### `DOC-` を残す理由

**文書ヘッダの UID は、ノードの UID と同じ名前空間を共有する。** `DOC-` はその 2 つを見分けるための印である。

| # | 理由 |
|---|---|
| 1 | **本文中の `[LINK: DOC-FIG-STATE]` は、列見出しを持たない。** 接頭を外すと、指す先がノードか文書かを読み手が判別できない |
| 2 | **`jq` の `startswith("DOC-")` 1 行で層を分けられる。** 外すと文書とノードを機械で区別する手段が無くなる |

### 章題の日本語

**表には英語のみを載せる。** 日本語の章題は本フレームワークの訳語であり、章題の定義そのものではない。

| 章 | 日本語 |
|---|---|
| Ch1 Foundation | 前提 |
| Ch2 System Overview | システム概要 |
| Ch3 Use Cases | ユースケース |
| Ch4 Requirements | 要求 |
| Ch5 Design | 設計 |
| Ch6 Software Specification | ソフトウェア仕様 |
| Ch7 Test Strategy | テスト戦略 |
| Ch8 Design Principles Compliance | 設計原則 準拠確認 |
| Ch9 Use Case Tests | ユースケーステスト |
| Ch10 Software Specification Tests | ソフトウェア仕様テスト |
| Ch11 Non-Functional Tests | 非機能テスト |

### この表に無いもの

**`.sgra` を書くには、あと 1 枚要る。** 本表は「どの型が、どこに、何を親として置かれるか」までしか持たない。**型ごとの欄（`FIELDS`）と値域の一覧が別に要る。**
