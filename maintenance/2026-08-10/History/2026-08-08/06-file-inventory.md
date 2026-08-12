# 新 gr-sw-maker が取り扱うファイル一覧

**本書はドラフトである。着手していない。**

**前提:** `04-spec-format-unification.md` の統一案（仕様書を StrictDoc の `.md` へ寄せる）を採った場合の姿である。段 4 の実測が通ったことを受けて書いた。

## 凡例

| 表記 | 意味 |
|---|---|
| `.md (SD)` | **StrictDoc が解析する Markdown。** 先頭は H1、`**Type**:` / `**UID**:` などのフィールドを持つ |
| `.md` | 素の Markdown。StrictDoc は解析しない |
| **要否** | **どの形式から要るか。** `簡易` = 簡易でも要る（全形式必須）／ `通常` = 通常から／ `厳密` = 厳密のみ／ `条件` = 条件付きプロセスが有効なときだけ／ `生成` = ツールが作る中間物 |
| 作成者 / 編集者 / 読者 | エージェント名 / `人間` / ツール名（`.js`・`.mjs`・`strictdoc`）で書く |
| **廃止** | 現行にあるが、新 gr-sw-maker では作らないもの |

> **ファイル名に製品名を付けない。** 1 プロジェクト = 1 製品であり、`docs/spec/` という位置が既に製品を特定している。**初版は `<product>-00-foundation.md` としていたが、製品によって変わるのは中身であって名前ではない。** 複数の製品を 1 リポジトリに置く場合は、フォルダで分ける（`docs/spec/<product>/`）。

---

## A. 仕様書一式 — `docs/spec/`

| ファイル名 | 拡張子 | 要否 | 目的 | 内容 | 作成者 | 編集者 | 読者 | 備考 |
|---|---|---|---|---|---|---|---|---|
| `spec.sgra` | `.sgra` | **簡易** | 仕様書の構造を機械可読に強制する | ノード型・フィールド・必須性・値域・関係（`ROLE`）の宣言 | `apply-process-mode.js` | decree-writer | `strictdoc` | **ガバナンスの中核。** 形式ごとに最小 / 標準 / 拡張の 3 種を用意し、選ばれた 1 枚を配る |
| `00-foundation.md` | **`.md (SD)`** | **簡易** | 前提を固定する | 背景・課題・**目標（`GOAL`）**・解決方針・範囲・制約・制限・用語集・表記規約 | srs-writer | srs-writer / change-manager | 全エージェント | **`GOAL` だけがノード。** 残りは地の文 |
| `01-configuration.md` | **`.md (SD)`** | **簡易** | 対象ソフトが何の上で何とつながるかを固定する | 構成図・**`NODE`**・**`CONNECTION`**・持たないもの | srs-writer | srs-writer | architect / security-reviewer / test-engineer | 構成を選べる場合、architect の ADR で確定した結果を srs-writer が反映する |
| `02-use-cases.md` | **`.md (SD)`** | **簡易** | アクターの目標を定める | アクター一覧・**`USE_CASE`**（主成功シナリオ 3〜9 手順 + 拡張） | srs-writer | srs-writer | architect / review-agent | **拡張が要求を生む。** アクターに ID は振らない |
| `03-requirements.md` | **`.md (SD)`** | **簡易** | 満たすべきことを定める | **`REQUIREMENT`**（FR / NFR。`REQ_KIND` で区別） | srs-writer | change-manager | 全エージェント | 削減候補の表は持たない。**クエリが出す** |
| `04-architecture.md` | **`.md (SD)`** | **簡易** | どう作るかを示す | 方式・コンポーネント・ファイル構成・ドメインモデル・振る舞い・ADR | architect | architect | implementer / review-agent / runbook-writer | **UID を持たない。鎖の外の見取り図** |
| `05-specification.md` | **`.md (SD)`** | **簡易** | 実装できる細かさまで仕様を落とす | UI 要素マップ・設定定義・API 定義・データスキーマ・状態管理・アルゴリズム・エラー処理 | architect | architect | implementer | **詳細仕様書である。テストは置かない**（08 / 09 へ分離） |
| `06-design-principles-check.md` | **`.md (SD)`** | 通常 | 設計原則を 1 項目ずつ照合する | 原則ごとの確認表 | architect | review-agent | review-agent / technical-authority | 地の文 + 要求側の `REVIEW_STATUS` |
| `07-test-strategy.md` | **`.md (SD)`** | 通常 | 何をどのレベルでテストするかを定める | テストレベル別のマトリクス | architect | test-engineer | test-engineer | 地の文のみ |
| `08-test-cases.md` | **`.md (SD)`** | **簡易** | 受入基準を検証可能な形で並べる | **`TEST_CASE`**（`GIVEN` / `WHEN` / `THEN` ＋ `File` 関係） | **test-engineer** | test-engineer | implementer / review-agent | **新設。** 要求を `Verifies` で指す |
| `09-test-results.md` | **`.md (SD)`** | **簡易** | 実行した結果を残す | **`TEST_RESULT`**（`RESULT` / 実行日時 / 実行環境 / 備考） | **テストを実行したエージェント** | 同左 | project-manager / progress-monitor | **新設。** `TEST_CASE` を `ResultOf` で指す。**仕様書と分けることで、結果の更新が仕様を汚さない** |
| `_assets/fig-<name>.md` | **`.md (SD)`** | **簡易** | 15 行を超える図を本文から外す | 図 1 つ + 短い前書き | 図を書いたエージェント | 同左 | 図を参照する者 | **`Grammar` を宣言しない**（既定文法に任せる）。宣言するとパス解決で落ちる |
| `<同名>.meta.yaml` | `.yaml` | 通常 | **その `.md` 1 枚**の管理情報を持つ | Common Block（OKF v0.2） | その `.md` のオーナー | 同左 | project-manager / change-manager | **`.md` と 1 対 1**（`00-foundation.md` ↔ `00-foundation.meta.yaml`）。§A-1 を見よ。**同居させても StrictDoc は無視する（実測）** |
| `output/json/index.json` | `.json` | **生成** | 要求グラフを機械で辿る | `strictdoc export --formats=json` の出力 | `strictdoc` | — | 全エージェント / `jq` | **コミットしない** |
| `output/html/**` | `.html` | **生成** | 人が読む・表で並べ替える・トレースを見る | 同上（HTML 版） | `strictdoc` | — | `人間` | 同上 |

### A-1. 管理情報は `.md` 1 枚ごとに 1 枚

**初版は「一式で 1 枚」としていた。競合の指摘を受けて改めた。**

| | 一式で 1 枚 | **`.md` ごとに 1 枚（採用）** |
|---|---|---|
| 書き込みの競合 | **10 のオーナーが同じ 1 枚を触る。直列化点になる** | **起きない** |
| `document_status` | 1 つしか持てない | **章ごとに持てる** |
| `updated.by` / `at` | 誰の更新か分からなくなる | その `.md` の更新者が入る |
| 枚数 | 1 | 10 |

**決め手は `document_status` である。** GATE-PLANNING で Ch1-4 が承認され、Ch5-8 はまだ draft —— **この状態は普通に起きる。** 1 枚では表せない。

```text
docs/spec/00-foundation.md        ← StrictDoc が読む
docs/spec/00-foundation.meta.yaml ← Common Block（OKF v0.2）。StrictDoc は無視する
```

**`.yaml` を同じフォルダに置いても StrictDoc は誤作動しない。** 文書として拾わないことを実測で確認した（文書 7 件のまま、export 通過）。

**`tools/check-spec-meta.mjs` が対応を守る** — `.md (SD)` 1 枚ごとに同名の `.meta.yaml` が在るか、`owner` が実際の書き込み者と合うか。

### A-2. テストの 3 層とトレース

**テストケースと結果を仕様書から分ける。** 詳細仕様（`05`）とテスト（`08` / `09`）は読者も更新頻度も違う。

| 何 | どこ | ノード型 | 書く者 |
|---|---|---|---|
| **受入基準**（何を確かめるか） | `08-test-cases.md` | `TEST_CASE` | test-engineer |
| **テストコード**（どう確かめるか） | `tests/**` | — （`File` 関係で結ぶ） | test-engineer |
| **実行結果**（確かめた結果） | `09-test-results.md` | `TEST_RESULT` | **テストを実行したエージェント** |

> **この分け方は `StrictDocStarter` の SOVD サンプルが既に採っている。** `TAG: TEST`（`ROLE: Verifies`）と `TAG: TEST_RESULT`（`ROLE: ResultOf`）が別ノード型として宣言され、75 件ずつ 1 対 1 で並んでいる。**要求 122 件規模での実績がある。**

**鎖の全体:**

```text
GOAL-001 ◀─Satisfies─ UC-001 ◀─Satisfies─ FR-003 ◀─Verifies─ TC-001 ◀─ResultOf─ TR-001
                                                                │
                                                                └─File──▶ tests/test_query.py
```

**`File` 関係の書き方（実測で動作を確認済み）:**

```markdown
**Relations**:
- **Type**: `Parent`   **ID**: `FR-003`   **Role**: `Verifies`
- **Type**: `File`   **Path**: `tests/test_query.py`
```

**鍵は `Path` である（MUST）。** 許容される鍵は `Type` / `Path` / `Element` / `ID` / `Hash` / `Lines` の 6 つで、**それ以外を書くと export が止まる**（実装で確認）。

**結果を分けたことの効き目:**

| | `TEST_CASE` の欄に持つ | **別ノードにする（採用）** |
|---|---|---|
| 書き込みの競合 | test-engineer と実行者が同じノードを触る | **起きない** |
| 走行のたびの差分 | **仕様書が毎回変わる** | 変わるのは `09` だけ |
| 履歴 | 上書きで消える | **`TR-002` を足せば残る** |

### A-3. トレースツリーが大きくなりすぎる件

**素直に組むと、ノード型 8 種・関係 5 種の木になる。** そのままでは読めない。**測った結果、対処は 3 段構えになる。**

#### 測ったこと

| 手段 | 結果 |
|---|---|
| `strictdoc export --filter-nodes '<式>'` | **構文は通るが、JSON 出力には効かなかった**（全件出る。実測）。HTML 側での効き目は未確認 |
| 絞り込みの文法 | `and` / `or` は**括弧が必須**（`(A and B)`）。フィールドは `node["名前"]`。使える述語は `node.is_requirement` / `node.is_section` / `node.is_root` / `node.has_parent_requirements` / `node.has_child_requirements` / `node.contains("...")` / `node.is_source_file()` ほか |
| `--view` と `[DOCUMENT_VIEW]` | **実装に `ViewElementHiddenTag` がある**（ノード型を隠せる）。**未実測** |

#### 対処 — 3 段構え

**1. 構造で減らす（設計側。実施済み）**

| 何を鎖の外に出したか | 効き目 |
|---|---|
| `NODE` / `CONNECTION` | 主鎖に出ない。NFR から `Affects` で参照するだけ |
| `04-architecture` のコンポーネント | **UID を持たない。** 木に現れない |
| ADR | 同上 |
| アクター | 同上 |

**主鎖は `GOAL → UC → REQUIREMENT → TEST_CASE → TEST_RESULT` の 5 段だけになる。**

**2. 用途別のビューを jq で作る（確実な手段）**

**`--filter-nodes` が JSON に効かない以上、間引きは `jq` 側で行う。** `tools/spec-query/` に用途別の 3 本を置く。

| ビュー | 出すもの | 誰が見るか |
|---|---|---|
| **要求ビュー** | `GOAL` / `USE_CASE` / `REQUIREMENT` | srs-writer / review-agent / `人間` |
| **検証ビュー** | `REQUIREMENT` / `TEST_CASE` / `TEST_RESULT` | test-engineer / project-manager |
| **構成ビュー** | `NODE` / `CONNECTION` / `Affects` を持つ NFR | security-reviewer / runbook-writer |

**既定は要求ビューとする。** 全部を 1 枚に出すビューは作らない —— **作れば必ずそれが使われ、読めないまま放置される。**

**3. HTML は StrictDoc に任せる（人が読むとき）**

**HTML には Document / Table / Traceability の 3 ビューが元からある。** 人が探すときはこちらを使い、**エージェントには jq のビューを渡す。** 読み手が違うので、道具を分ける。

> **未確認:** `[DOCUMENT_VIEW]` の `ViewElementHiddenTag` でノード型を隠せるか。**効くなら HTML 側も用途別に絞れる。** 段 5 で測る。

### A-4. 出力先を入力フォルダの中に置いてはならない（実測）

**HTML export は元の `.md` を出力先へ複製する。**

```text
docs/spec/output/html/spec/_assets/fig-state.md   ← 複製が入力フォルダの中にできる
```

**StrictDoc は「今回の `--output-dir`」だけを走査から除く。** したがって出力先を変えた瞬間、前回の複製が入力として読まれ、**UID 重複で止まる。**

```text
error: OneToOneDictionary: Cannot create a link because lhs_node already exists: DOC-FIG-STATE.
```

**1 回目は通り、出力先を変えた回で初めて止まる。** 対処は 2 つ。

| # | 対処 |
|:-:|---|
| 1 | **出力先を入力フォルダの外に固定する**（推奨）。`docs/spec/` の外へ出す |
| 2 | 中に置くなら**出力先を絶対に変えない**。変えるときは古い出力を消してから |

### A-5. `exclude_doc_paths` は何に使えて、何に使えないか

**公式文書で確認した。** `strictdoc_config.py` の `ProjectConfig` が `include_doc_paths` / `exclude_doc_paths` を取り、`*`（1 階層）と `**`（複数階層）のワイルドカードが使える。

```python
from strictdoc.core.project_config import ProjectConfig

def create_config() -> ProjectConfig:
    return ProjectConfig(
        exclude_doc_paths=["/tests/**"],
    )
```

**使える場面:**

| 用途 | 効き目 |
|---|---|
| **出力先が入力フォルダの中にある場合の保護** | §A-4 の罠を塞げる |
| 解説文書を集計から外す | 図やコードを数えるクエリに混ざらなくなる |

**使えない場面 — `09-test-results.md` を「木から隠す」用途には使えない。**

> **`exclude_doc_paths` は「文書として読まない」である。** 除外した文書のノードは JSON にも HTML にも出ない。**`TEST_RESULT` を除外すれば、トレースしたかった結果そのものが消える。**

**フォルダ指定には副作用がある（`md-basic-ja` の設定に実測の注記がある）。**

> **フォルダ（`_assets/**`）で除外すると、添付ファイルの複製も止まる。** StrictDoc は `exclude_doc_paths` を文書探索と添付探索の両方に渡すためである。**export は成功したまま、画像が 404 になる。**

**したがって規則は 2 つ。**

| # | 規則 |
|:-:|---|
| 1 | **隠すならファイル名で指定する。フォルダ（`**`）で指定してはならない（MUST NOT）** — 添付が黙って壊れる |
| 2 | **鎖の上流を除外してはならない（MUST NOT）。** 下の §A-6 を見よ |

### A-6. 用途別ビューを `exclude_doc_paths` で作れる範囲（実測）

**`strictdoc export --config <path>` で、走行ごとに別の設定を渡せる。**

```bash
strictdoc export docs/spec --config views/design.py  --output-dir out/design
strictdoc export docs/spec --config views/full.py    --output-dir out/full
```

**ただし切れる向きが決まっている。**

| 何を除外したか | 結果 |
|---|---|
| **鎖の下流**（誰の親でもない文書。例: テスト） | **通る**（実測） |
| **鎖の上流**（誰かが `Parent` で指す文書。例: ユースケース） | **落ちる**（実測） |

```text
error: [DocumentIndex.create] Requirement FR-001 references parent requirement
       which doesn't exist: UC-001.
```

> **`Parent` の参照先が消えると、StrictDoc は export を止める。** リンク切れと同じ扱いである。**したがって「前を捨てて後ろだけ見る」ビューは作れない。**

**作れるビュー（鎖の後ろから連続して切る）:**

| ビュー | 除外するもの | 見えるもの |
|---|---|---|
| **全体** | なし | `00`〜`09` |
| **設計ビュー** | `08-test-cases` と `09-test-results` を**セットで** | `GOAL` → `UC` → `FR` → 設計 → 詳細仕様 |
| **要求ビュー** | `04`〜`09` | `GOAL` → `UC` → `FR` |
| **前提ビュー** | `03`〜`09` | `GOAL` / `NODE` / `CONNECTION` / `UC` |

**作れないビュー:**

| 欲しかったもの | なぜ作れないか |
|---|---|
| **詳細仕様 + テスト** | テストの親は `FR`（`03`）である。`03` を除外すると落ちる |
| **ユースケース + テスト** | 同上。鎖は `UC` と `TC` の間を `FR` が通る |

> **飛ばして切ってはならない。** `08` だけを除外して `09` を残すと、`TEST_RESULT` の親（`TEST_CASE`）が消えて同じエラーで止まる。**除外は必ず連続した後ろ側とする（MUST）。**

### A-7. HTML のトレースツリーが肥大する件 — 純正の手段で足りる（実測）

**自作の変換ツールは要らない。** StrictDoc 側に 3 つの手段があり、積み重ねられる。

| # | 手段 | 効き目 | 測定 |
|:-:|---|---|---|
| **1** | **`--filter-nodes '<式>'`** | **HTML の出力に効く。** ユニーク UID が 15 → 13 に減った | **実測** |
| 2 | `exclude_doc_paths` + `--config` | 文書ごと落とす。**後ろ側だけ**（§A-6） | 実測 |
| 3 | `project_features` から `DEEP_TRACEABILITY_SCREEN` を外す | `-DEEP-TRACE.html` が生成されなくなる。**深い木そのものが消える** | 未実測 |

> **手段 1 が答えである。** `--filter-nodes` は**索引からではなく表示から**ノードを落とすため、**`exclude_doc_paths` では落ちてしまった「前を捨てて後ろだけ見る」ビューが作れる。** 親が索引に残っているので、参照切れにならない。

**出力の構成（実測）:** 文書 1 つにつき 4 枚が出る。

```text
02-use-cases.html             本文
02-use-cases-TABLE.html       表
02-use-cases-TRACE.html       トレース（1 段）
02-use-cases-DEEP-TRACE.html  トレース（根まで）  ← 肥大するのはこれ
```

**使える述語（文法から確認）:**

```text
node.is_requirement / node.is_section / node.is_root
node.has_parent_requirements / node.has_child_requirements
node.contains("文字列") / node.contains_any_text
node.is_source_file() ほか
and / or は括弧が必須:  (A and B)
```

> **フィールドでは絞り込めない。** 文法の `NodeFieldExpression` は `node["名前"]` の名前を `[A-Za-z0-9]+` と定めており、**下線を含む名前を受け付けない**（`node["REQ_KIND"]` は parse error。実測）。**`.sgra` のフィールド名はすべて下線を含むので、フィールド条件は使えない。**

### `--filter-nodes` の文法（文法定義と実測から）

**公式の説明:** 「Query Engine に基づく。検索と同じ規則が適用される。**フィルタを当てると、白リストに載ったノードだけが export される。**」

**式の全形:**

```text
真偽式:
  (A and B)            括弧が必須。and / or を裸で書くと parse error
  (A or B)             同上
  not A                括弧は不要

述語（引数なし）:
  node.is_requirement          要求系ノードか（カスタム型も含む）
  node.is_section              章か
  node.is_root                 根か
  node.has_parent_requirements 親を持つか
  node.has_child_requirements  子を持つか
  node.contains_any_text       地の文を持つか
  node.is_source_file()                            ソースファイルか
  node.is_source_file_with_complete_coverage()     被覆が完全か
  node.is_source_file_with_partial_coverage()      部分か
  node.is_source_file_with_no_coverage()           無いか

述語（引数あり）:
  node.contains("文字列")      本文に含むか。文字列は [A-Za-z0-9]+ のみ

フィールド参照:
  node["名前"]                 名前は [A-Za-z0-9]+ のみ（下線を受け付けない）

比較:
  node["UID"] == "FR-001"
  node["UID"] != "FR-001"

包含:
  "FR" in node["UID"]
  "FR" not in node["UID"]
  any(["FR-001", "FR-003"]) in node["UID"]
  all([...]) in node["..."]
  none([...]) in node["..."]
```

**実測した用例（すべて `strictdoc export <入力> --formats=html --filter-nodes '<式>'`）:**

| 式 | 結果 | 用途 |
|---|:-:|---|
| `node.is_requirement` | 通る | 要求系だけを出す |
| `(node.is_requirement and not node.has_parent_requirements)` | 通る | **孤立要求の検出。** 仕込んだ 1 件だけが残った |
| `node["UID"] == "FR-001"` | 通る | 1 件を名指し |
| `"FR" in node["UID"]` | 通る | 接頭辞で絞る |
| `any(["FR-001", "FR-003"]) in node["UID"]` | 通る | 複数を名指し |
| **`"問い合わせ" in node["TITLE"]`** | **通る** | **日本語で絞る。フィールド参照なら通る** |
| **`node.contains("問い合わせ")`** | **落ちる** | **`contains()` は英数字のみ。日本語は使えない** |

> **日本語のプロジェクトでは `node.contains(...)` を使ってはならない（MUST NOT）。** 文法が `[A-Za-z0-9]+` に限っている。**代わりに `"文字列" in node["TITLE"]` を使う** — こちらの文字列は `[^"]+` なので日本語が通る。

> **`node["名前"]` の名前に下線は使えない。** `.sgra` のフィールドはすべて下線を含むため（`REQ_KIND` / `TEST_RESULT` など）、**値による絞り込みは `UID` と `TITLE` に限られる。**

> **JSON 出力には効かない（実測）。** 式は通るが全件出る。**`--filter-nodes` は HTML のための道具である。** JSON 側の間引きは `jq` で行う。

**したがってビューは「構造」で切る。**

| ビュー | 手段 | 式 / 設定 |
|---|---|---|
| **全体** | 既定 | なし |
| **要求だけ** | `--filter-nodes` | `(node.is_requirement and node.has_parent_requirements)` |
| **孤立の検出** | `--filter-nodes` | `(node.is_requirement and not node.has_parent_requirements)` |
| **設計まで** | `exclude_doc_paths` | `08-test-cases` と `09-test-results` を除く |
| **深い木を出さない** | `project_features` | `DEEP_TRACEABILITY_SCREEN` を外す |

**設定ファイルは `docs/spec/views/` に置き、用途ごとに 1 枚とする。**

```text
docs/spec/views/full.py      全体（既定）
docs/spec/views/design.py    設計ビュー（08 / 09 を除く）
docs/spec/views/req.py       要求ビュー（04〜09 を除く。DEEP を切る）
```

### A-8. 「表示用フォルダを作って親キーを削る」案を採らない理由

**検討したが、純正の手段で足りるため採らない。** 採った場合の代償は 3 つある。

| # | 代償 |
|:-:|---|
| 1 | **派生物を維持することになる。** 元の `.md` を直すたびに再生成が要り、忘れると乖離する |
| 2 | **入力フォルダの中に置けない。** 同じ UID の文書が 2 組できて export が止まる（§A-4 と同じ罠） |
| 3 | **親を消した木は、もはやトレーサビリティではない。** 見たかったのは「何が何を満たすか」であり、それを消したら残るのは目次である |

> **`--filter-nodes` は同じ結果を、元のファイルを一切触らずに得る。** 索引には親が残るので、**木は浅くなるが繋がりは失われない。**

---

## B. プロジェクト管理 — `project-management/`

| ファイル名 | 拡張子 | 要否 | 目的 | 内容 | 作成者 | 編集者 | 読者 | 備考 |
|---|---|---|---|---|---|---|---|---|
| `pipeline-state.md` | `.md` | 通常 | 進行状態を 1 か所に集める | 現在フェーズ・ゲート通過状況・次の行動 | project-manager | project-manager | 全エージェント / `人間` | **簡易は持たない**（中断からの再開点を失うことを受容する） |
| `session-handoff-<date>.md` | `.md` | 通常 | セッション境界を越えて再開できるようにする | 到達点・**再開時に読む文書の一覧**・未決 | 中断するエージェント | — | 再開するエージェント | **一覧が無ければ再開側は全部読む。1 時間 TTL 対策** |
| `handoff-<from>-to-<to>.md` | `.md` | 厳密 | エージェント境界を越えて仕事を渡す | 入力・期待する出力・制約 | 渡す側 | — | 受け取る側 | |
| `progress-<date>.md` | `.md` | 通常 | 進捗とメトリクスを報告する | WBS 消化・defect curve・コスト | progress-monitor | progress-monitor | project-manager / `人間` | |
| `cost-log.json` | `.json` | **簡易** | API トークン消費を積算する | フェーズ別・エージェント別のコスト | `otel-sink.mjs` | `session-meter.mjs` | progress-monitor | **Common Block 対象外**。予算アラートの分母 |
| `test-progress.json` | `.json` | 通常 | テスト結果の推移を残す | 合格率・カバレッジの時系列 | test-engineer | test-engineer | progress-monitor | 同上。**`TEST_RESULT` の時系列版** |
| `defect-curve.json` | `.json` | 厳密 | defect の発生・収束を追う | 発生数・修正数の時系列 | test-engineer | test-engineer | progress-monitor | 同上 |
| `wbs.md` | `.md` | 厳密 | 作業を分解して見積もる | WBS・ガントチャート | progress-monitor | progress-monitor | project-manager | |
| `interview-record.md` | `.md` | 通常 | ヒアリングの結果を残す | 質問と回答・**削減候補として示したもの** | srs-writer | srs-writer | 全エージェント | **削減候補の提示はここに記録する** |
| `test-plan.md` | `.md` | 厳密 | テストの計画を定める | 範囲・体制・スケジュール | test-engineer | test-engineer | project-manager | |
| `stakeholder-register.md` | `.md` | 厳密 | 関係者を登録する | 役割・関心・連絡経路 | project-manager | project-manager | 全エージェント | 推奨プロセス |

---

## C. プロセス記録 — `project-records/`

| ファイル名 | 拡張子 | 要否 | 目的 | 内容 | 作成者 | 編集者 | 読者 | 備考 |
|---|---|---|---|---|---|---|---|---|
| `review-<id>.md` | `.md` | 通常 | レビュー結果を残す | R1-R7 の観点別の指摘・重大度 | review-agent | review-agent | 指摘を受けたエージェント | **通常は実装開始前の 1 回のみ** |
| `decision-<id>.md` | `.md` | 通常 | 重要判断の根拠を残す | 文脈・選択肢・決定・帰結 | 判断したエージェント | — | 全エージェント | |
| `tech-decision-<id>.md` | `.md` | 厳密 | 技術裁定と品質ゲート判定を残す | 争点・裁定・根拠 | technical-authority | — | 全エージェント | |
| `governance-change-log-<id>.md` | `.md` | 厳密 | ガバナンスファイルの変更を残す | before / after の diff・適用理由 | decree-writer | — | `人間` / project-manager | |
| `risk-register.md` | `.md` | 通常 | リスクを 1 か所で見る | 個別 risk の集約表 | risk-manager | risk-manager | project-manager / `人間` | シングルトン |
| `risk-<id>.md` | `.md` | 通常 | リスク 1 件を追う | 内容・スコア・対策・状態 | risk-manager | risk-manager | project-manager | score≧6 は `人間` へ通知 |
| `defect-<id>.md` | `.md` | 通常 | defect 1 件を追う | 症状・根本原因・対策・検証 | 発見したエージェント | 修正するエージェント | test-engineer / review-agent | |
| `change-request-<id>.md` | `.md` | 厳密 | 変更要求を追う | 要求内容・影響分析・承認 | change-manager | change-manager | `人間`（impact high は承認必須） | |
| `license-report.md` | `.md` | 通常 | 依存のライセンス互換性を確かめる | ライブラリ・ライセンス・帰属 | license-checker | license-checker | `人間` | 依存を追加する場合 |
| `performance-report.md` | `.md` | 厳密 | 性能目標の達成を示す | 測定値と NFR の対比 | test-engineer | test-engineer | project-manager | |
| `security-scan-report-<id>.md` | `.md` | 通常 | 脆弱性スキャンの結果を残す | SAST / SCA / シークレット | security-reviewer | security-reviewer | project-manager | |
| `incident-report-<id>.md` | `.md` | 条件 | 本番 incident を記録する | 経緯・影響・原因・再発防止 | incident-reporter | incident-reporter | `人間` | operation フェーズ |
| `retrospective-report-<id>.md` | `.md` | 厳密 | ふりかえりと改善案を残す | defect パターン・根本原因・改善策 | process-improver | process-improver | decree-writer / `人間` | |
| `field-issue-<id>.md` | `.md` | 条件 | 実機テストのフィードバックを追う | 事象・分類（defect / CR / 質問）・対策 | field-test-engineer | field-issue-analyst | feedback-classifier | 実機テスト有効時 |
| ~~`traceability.md`~~ | — | **廃止** | ~~要求とテストの対応を残す~~ | — | — | — | — | **`strictdoc` の JSON へのクエリが同じものを出す。** 手で維持すると 0 件になる（2 回目トライアルの実績） |

---

## D. フレームワークが配る規約・定義

| ファイル名 | 拡張子 | 要否 | 目的 | 内容 | 作成者 | 編集者 | 読者 | 備考 |
|---|---|---|---|---|---|---|---|---|
| `CLAUDE.md` | `.md` | **簡易** | プロジェクトの前提をエージェントに与える | 概要・方針・技術スタック・品質目標・条件付きプロセス | `setup.js` が雛形を配置 → `人間` が記入 | decree-writer | 全エージェント | **品質ゲートの Single Source of Truth** |
| `user-order.md` | `.md` | **簡易** | 何を作るかを人間が伝える | 3 問形式の入力 | **`人間`** | `人間` | srs-writer | **`apply-process-mode.js` は触ってはならない** |
| `process-rules/spec-template.md` | `.md` | **簡易** | 仕様書の書き方を説明する | 章構成・記法・設計根拠 | framework 開発者 | decree-writer | srs-writer / architect | **性質が変わる** — 規約から手引きへ。強制するのは `.sgra` |
| `process-rules/review-standards.md` | `.md` | **簡易** | レビュー観点を定める | R1-R7 | framework 開発者 | decree-writer | review-agent | |
| `process-rules/full-auto-dev-process-rules.md` | `.md` | 通常 | フェーズと品質ゲートを定める | フェーズ定義・ゲート条件・起動プロンプト | framework 開発者 | decree-writer | 全エージェント | |
| `process-rules/full-auto-dev-document-rules.md` | `.md` | 通常 | 文書の容器を定める | Common Block / Form Block / file_type 登録簿 | framework 開発者 | decree-writer | 全エージェント | **仕様書だけ例外を持つ**（A-1） |
| `process-rules/glossary.md` | `.md` | 通常 | 用語を揃える | 採用語・非採用語・紛らわしい対 | framework 開発者 | decree-writer | kotodama-kun | |
| `process-rules/defect-taxonomy.md` | `.md` | 通常 | 不具合系の語を体系化する | error / fault / failure / defect / incident / hazard | framework 開発者 | decree-writer | 全エージェント | |
| `process-rules/agent-list.md` | `.md` | 通常 | 名簿とデータフローを示す | 役割・オーナーシップ・入出力 | framework 開発者 | decree-writer | project-manager | |
| `process-rules/prompt-structure.md` | `.md` | 厳密 | プロンプトの構造を定める | S0-S6 | framework 開発者 | decree-writer | 全エージェント | |
| `process-rules/framework-development.md` | `.md` | 厳密 | フレームワーク自身の開発規律を定める | 規約追加の様式・禁止事項 | framework 開発者 | — | framework 開発者 | |
| `process-rules/field-issue-handling-rules.md` | `.md` | 条件 | 実機フィードバックの扱いを定める | 分類・対応の流れ | framework 開発者 | decree-writer | field-* 3 体 | |
| `process-rules/porting-guide.md` | `.md` | 厳密 | 他環境への移植手順を示す | 移植の注意 | framework 開発者 | — | framework 開発者 | |
| `.claude/agents/<agent>.md` | `.md` | 通常 | エージェント 1 体の責務を定める | Start / End Conditions・In / Out・Procedure | framework 開発者 | decree-writer | 当該エージェント | **簡易は 1 体（レビュワー）のみ。通常以上で 22 体** |
| `.claude/commands/<command>.md` | `.md` | 通常 | 起動コマンドを定める | 実行手順 | framework 開発者 | decree-writer | `人間` が起動 | **6 種** |

---

## E. ツール

| ファイル名 | 拡張子 | 要否 | 目的 | 内容 | 作成者 | 編集者 | 読者 | 備考 |
|---|---|---|---|---|---|---|---|---|
| `setup.js` | `.js` | **簡易** | フレームワーク一式を配置する | 対話メニュー・ファイル配置 | framework 開発者 | framework 開発者 | `人間` が実行 | **`deployFile()` の既知の不具合を直す**（`user-order.md` を常に上書きする） |
| `apply-process-mode.js` | `.js` | **簡易** | 選ばれた形式の文書一式を配置する | 形式の判定 → `.sgra` と雛形の配置 | framework 開発者 | framework 開発者 | `人間` / project-manager が実行 | **新規。** `user-order.md` に触らない / 削除しない / `framework-src/` に触らない / 1 走行 1 回 |
| `tools/spec-query/*.jq` | `.jq` | 通常 | 仕様書の抜けを機械で探す | 孤立要求・テスト未覆・コード未結の検出 | framework 開発者 | framework 開発者 | review-agent / project-manager | **新規。** `01-ai-queries.md` の `D16` / `D17` / `D18` に相当 |
| `tools/check-spec-meta.mjs` | `.mjs` | 通常 | 仕様書と管理情報の対応を守る | `docs/spec/` に `spec.meta.yaml` が在るか・`chapter_owners` が実ファイルと合うか | framework 開発者 | framework 開発者 | project-manager | **新規。** A-1 の外出しに伴って要る |
| `tools/check-terms.mjs` | `.mjs` | 通常 | 非採用語の混入を防ぐ | 用語集との照合 | framework 開発者 | framework 開発者 | kotodama-kun | **残る。** StrictDoc に語彙検査は無い |
| `tools/gate-guard.mjs` | `.mjs` | 通常 | 品質ゲートの通過を機械で判定する | 閾値との比較 | framework 開発者 | framework 開発者 | project-manager | |
| `tools/otel-sink.mjs` | `.mjs` | **簡易** | トークン消費を受け取る | OpenTelemetry の受け口 | framework 開発者 | framework 開発者 | — | `cost-log.json` を書く |
| `tools/session-meter.mjs` | `.mjs` | 通常 | セッションの消費を測る | 集計 | framework 開発者 | framework 開発者 | progress-monitor | |
| `tools/jsonl2md.mjs` | `.mjs` | 厳密 | 走行ログを読める形に変える | JSONL → Markdown | framework 開発者 | framework 開発者 | `人間` | |
| `tools/check-parity.mjs` | `.mjs` | — | ja / en の行数一致を守る | 41 ファイル対の比較 | framework 開発者 | framework 開発者 | framework 開発者 | **フレームワーク自身の検査。** プロジェクトには配らない |
| `tools/check-roster.mjs` | `.mjs` | — | 名簿とエージェント定義の一致を守る | 突き合わせ | framework 開発者 | framework 開発者 | framework 開発者 | 同上 |
| `tools/check-setup.mjs` | `.mjs` | — | 配置の正しさを守る | setup 結果の検査 | framework 開発者 | framework 開発者 | framework 開発者 | 同上 |
| `tools/check-links.mjs` | `.mjs` | — | リンク切れを防ぐ | 相互参照の検査 | framework 開発者 | framework 開発者 | framework 開発者 | **仕様書については不要になる**（export が止まる）。**フレームワーク文書用には残す** |
| `tools/check-tagnames.mjs` | `.mjs` | — | タグ名の値域を守る | 値域の検査 | framework 開発者 | framework 開発者 | framework 開発者 | **仕様書については不要になる**（`SingleChoice` が強制）。**同上** |

---

## F. 成果物

| ファイル名 | 拡張子 | 要否 | 目的 | 内容 | 作成者 | 編集者 | 読者 | 備考 |
|---|---|---|---|---|---|---|---|---|
| `src/**` | 言語による | **簡易** | 動くものを作る | 実装コード | implementer | implementer | test-engineer / review-agent | |
| `tests/**` | 言語による | **簡易** | 動くことを確かめる | 単体・結合・E2E テスト | test-engineer | test-engineer | implementer | **`05-specification.md` の `File` 関係が指す先**（A-2） |
| `infra/**` | `.tf` 等 | 条件 | 環境を再現可能にする | IaC | implementer | implementer | — | |
| `docs/api/openapi.yaml` | `.yaml` | 条件 | API の契約を示す | OpenAPI 3.0 | architect | architect | implementer / test-engineer | HTTP API を持つ場合のみ |
| `docs/security/**` | `.md` | 通常 | セキュリティ設計を示す | 脅威モデル・設計 | security-reviewer | security-reviewer | implementer | **`CONNECTION` の `TRUSTED` が起点** |
| `docs/observability/**` | `.md` | 条件 | 可観測性設計を示す | ログ・メトリクス・トレース | architect | architect | implementer | 常駐サービスの場合 |
| `docs/operations/**` | `.md` | 条件 | 運用できるようにする | runbook・災害復旧計画・デプロイ設計 | runbook-writer | runbook-writer | `人間` | 運用・保守が有効な場合 |
| `docs/user-manual.md` | `.md` | 通常 | 使えるようにする | 操作マニュアル | user-manual-writer | user-manual-writer | `人間` | delivery フェーズ |
| `executive-dashboard.md` | `.md` | 厳密 | 全体を 1 枚で見せる | 進捗・コスト・リスクの要約 | project-manager | project-manager | `人間` | ルート |
| `final-report.md` | `.md` | 通常 | 総括する | 達成・未達・学び | project-manager | project-manager | `人間` | ルート |

---

## 未決

| # | 内容 |
|:-:|---|
| 1 | **`TEST_RESULT` を誰がどう更新するか。** 手で更新する限り、実際の走行結果とずれる。**トレーサビリティが 0 件になったのと同じ経路である。** 案: テストランナーの出力（JUnit XML 等）から `UID` で `.md` を引いて書き戻すスクリプト。**`grep` でファイルを特定する必要がある**（JSON にファイルパスが入らないため） |
| 2 | **`spec-foundation` / `spec-architecture` という file_type 名をどうするか。** 仕様書が 8 ファイルに割れると 2 つでは表せない。**`spec` 1 つにして章で区別する**のが素直 |
| 3 | **`_assets/` を複数の仕様書で共有する場合の衝突。** StrictDoc は `_assets` の名前を固定で扱う。1 リポジトリに複数製品を置く場合は未検証 |
| 4 | **簡易でも `.sgra` が要る以上、Python と strictdoc の導入が簡易の前提になるか。** 書くだけなら不要（検証しないため）だが、**`.sgra` を配る意味は検証してこそである。** 簡易の定義そのものに関わる |
