# 判断待ち 3 件の比較表と決定（2026-08-10）

引継書 `prompt/handoff-2026-08-10-mode-matrix.md` §4 の 3 件。**決着したら本書は `History/` へ移し、決定は `00-mode-matrix.md` および適用先の文書へ入れる。**

行番号は本フォルダ内の現物を指す。`01` = `01-spec-template.md`、`02` = `02-spec-writing-rules.md`。

## 決定の一覧

| # | 件 | 決定 | 状態 |
|:-:|---|---|---|
| 1 | 骨格 Chapter 8 の設計原則表 | **Chapter 8 を削除する。二重管理を止める。章番号も手順記号も繰り上げ、欠番を作らない** | 決定 |
| 2.1 | `TC`/`TR` の通し連番 | `02:191` が正。`02:1101` を参照 1 行へ | 決定 |
| 2.2 | `_assets/` の `**Grammar**` 禁止 | `02:366` が正。`02:102` のセルを短縮 | 決定 |
| 2.3 | 大きな図は別ファイルへ | `02:347` が正。`02:364` の 1 行目を削除 | 決定 |
| 2.4 | `ADR` は鎖に載らない | `02:187` が正。`02:889` を削除 | 決定 |
| 2.5 | `TEST_LEVEL` の所属 | `02:236` が正。`02:1032` を削除。`02:1185` は「だけが」を削る | 決定 |
| 2.6 | 子 → 親 → `Role` | `02:225-238` が正。`02:690` の表を削除。**重複ではなく誤りだった** | 決定 |
| 2.7 | CA レイヤー凡例 | 骨格に色つき凡例を残す。`02` の Mermaid を削除 | 決定 |
| 3 | 用語 | 採用語は **`仕様書テンプレート`（Specification Template）** | 決定 |

---

## 1. 判断 1 —— Chapter 8「SW設計原則 準拠確認」を削除する

### 1.1 決定

**骨格から Chapter 8 を削除する。** 設計原則の判定は `review-standards.md` の総合レビューチェックリスト（R1.1〜R7.10）が既に全行の Verdict 記入を要求しており、仕様書側に同じ判定欄を置くのは二重管理である。

### 1.2 判定はどこに残るか

| 何 | 削除前 | 削除後 |
|---|---|---|
| 原則ごとの判定 | 仕様書 Chapter 8 の `判定` / `根拠` 欄 ＋ 総合チェックリストの Verdict | **総合チェックリストの Verdict のみ** |
| 判定の置き場 | `docs/spec/` と `project-records/reviews/` の 2 か所 | **`project-records/reviews/` の 1 か所** |
| 原則の一覧 | 骨格 6 行 ＋ `02` のカタログ 27 行 ＋ 配置済みテンプレート Ch6 の 27 行 | §1.5 の 2 で決める |

### 1.3 実測 —— 削除の波及

**配置済みの `framework-src/ja/process-rules/spec-template.md` は 6 章構成であり、その Chapter 6 が「Design Principles Compliance」で、27 行のカタログをそのまま持っている。** `02` のカタログ 27 行はこの表の写しである。つまり同じ表が現在 3 か所（配置済み Ch6 / 新骨格 Ch8 の 6 行版 / `02`）にある。

`framework-src/ja/` からの参照は 8 行（en を合わせて 16 行）。

| ファイル | 行 | 内容 |
|---|---|---|
| `agents/architect.md` | 33 | 完了チェックリスト「仕様書 Ch6 が設定されている」 |
| `agents/architect.md` | 84 | 手順 7「Ch6 Design Principles Compliance を設定する」 |
| `commands/full-auto-dev.md` | 86 | **手順 3d「architect が仕様書 Ch6 を設定する」** |
| `process-rules/full-auto-dev-process-rules.md` | 1000 | 同じ手順の記述 |
| `process-rules/review-standards.md` | 490 | **R3.5「Ch6 の Resource Lifecycle は本規約で検査する」** |
| `process-rules/spec-template.md` | 40 / 209 / 279 | 章の一覧 / 本体 / 設計根拠 |

章番号の書き換え対象（本フォルダ内、Ch9〜11 を 1 つ繰り上げる場合）:

| ファイル | 該当行数 |
|---|---:|
| `00-mode-matrix.md` | 6 |
| `01-spec-template.md` | 9 |
| `01-spec-template-en.md` | 9 |
| `02-spec-writing-rules.md` | 46 |

### 1.4 原則カタログ 27 件と `review-standards.md` の対応（実測）

カタログを捨てるか移すかの判断材料。`裏付け` は総合チェックリストの ID と強度、`—` は対応行が無いことを指す。

| # | カテゴリ | 識別名 | 正式名称 | 裏付け |
|:-:|---|---|---|---|
| 1 | 命名 | Naming | — | R2.1 MUST |
| 2 | 依存関係 | Dependency Direction | — | R2.16 MUST |
| 3 | 依存関係 | SDP | Stable Dependencies Principle | R2.16 MUST |
| 4 | 簡潔性 | KISS | Keep It Simple, Stupid | R2.8 SHOULD |
| 5 | 簡潔性 | YAGNI | You Aren't Gonna Need It | R2.9 SHOULD |
| 6 | 簡潔性 | Minimal Comparison | — | R2.18 MUST |
| 7 | 簡潔性 | DRY | Don't Repeat Yourself | R2.7 SHOULD |
| 8 | 責務分離 | SoC | Separation of Concerns | R2.10 MUST |
| 9 | 責務分離 | SRP | Single Responsibility Principle | R2.2 MUST |
| 10 | 責務分離 | SLAP | Single Level of Abstraction Principle | R2.11 MUST |
| 11 | SOLID | OCP | Open-Closed Principle | R2.3 SHOULD |
| 12 | SOLID | LSP | Liskov Substitution Principle | R2.4 SHOULD |
| 13 | SOLID | ISP | Interface Segregation Principle | R2.5 SHOULD |
| 14 | SOLID | DIP | Dependency Inversion Principle | R2.6 SHOULD |
| 15 | 結合 | LoD | Law of Demeter | R2.12 SHOULD |
| 16 | 結合 | CQS | Command-Query Separation | R2.13 SHOULD |
| 17 | 可読性 | POLA | Principle of Least Astonishment | R2.14 MUST |
| 18 | 可読性 | PIE | Program Intently and Expressively | R2.15 MUST |
| 19 | テスト | Testability | — | **無し**（最も近い R6.3 はモック過剰使用の観点） |
| 20 | 純粋性 | Pure / Semi-pure-a / Semi-pure-b / Non-pure | — | R7.1 / R7.2 / R7.6 MUST |
| 21 | 構造 | Collect-Process Separation | 収集後処理 | R7.4 MUST |
| 22 | 状態遷移 | State Transition | — | R4.3 MUST |
| 23 | 並行性 | Concurrency Safety | — | R4.1 / R4.2 MUST |
| 24 | エラー | Error Propagation | — | R3.1 / R3.2 MUST |
| 25 | 資源管理 | Resource Lifecycle | — | R3.5 MUST |
| 26 | 不変性 | Immutability | — | R7.5 MUST |
| 27 | 資源効率 | Resource Efficiency | — | R5.1 / R5.3 MUST |

**カタログは総合チェックリストの単純な写しではない。** 実測で、`review-standards.md` は次のいずれも持っていない。

| 持っていないもの | 件数 |
|---|---:|
| 正式名称の展開（`Stable Dependencies Principle` 等） | 16 |
| 原則名そのもの（`Testability` / `Resource Efficiency` / `Error Propagation` / `Immutability` / `Collect-Process Separation`） | 5 |
| 裏付けとなる R 項目 | 1（`Testability`） |

### 1.5 決定した 3 点

| # | 論点 | 決定 |
|:-:|---|---|
| 1 | 章番号 | **Ch9〜11 を繰り上げて 10 章構成にする。** 欠番は初見の読み手に意味が伝わらない |
| 2 | カタログ 27 行 | **`review-standards.md` へ索引として移す。** 現物の案は §5 |
| 3 | 手順記号 | **欠番を作らない。繰り上げる。** 現物の案は §6 |

**手順 `3d` を削ると手順数が動く。** 表 B-1 の Phase 3 は `7 / 12 / 13`（全 14）→ `6 / 11 / 12`（全 13）、合計は `69 / 105 / 107` → `68 / 104 / 106` になる。

### 1.6 併せて直すもの

| # | 対象 | 内容 |
|:-:|---|---|
| 1 | `02:26` STFB 節、`02:144` 安定度 列 | 「可変（レビュー時に更新）」の章が無くなる |
| 2 | `02:1489-1491` 設計根拠 3 行 | 「Ch8 に独立」「原則をカタログ」「SDP を追加」を、**削除した理由**へ書き換える。記録を残さないと次に読む者が同じ章を再発明する |
| 3 | `review-standards.md:490`（R3.5） | 「Ch6 の Resource Lifecycle は本規約で検査する」の参照先が消える。文を「資源の生存期間は本規約で検査する」に改める |
| 4 | `00-mode-matrix.md` 表 A | 枚数 `15` → `14`、ファイル名 `01-11-spec` → `01-10-spec`、テンプレートの行数 `664 / 697 / 758` を再計測 |
| 5 | `00-mode-matrix.md` 表 C の 5・6 行 | `Ch9.1 / 10.1 / 11.1` → `Ch8.1 / 9.1 / 10.1` |
| 6 | `00-mode-matrix.md` 表 B-1 | §1.5 の 3 に従い手順数を 1 減らす |

**§1.5 の 1 で (a) を採るなら、`02` のファイル名一覧も変わる** —— ANMS `01-10-spec.md`、ANPS-part `01-04-requirements.md` / `05-07-design.md` / `08-10-test.md` / `A-appendix.md`、ANPS-chapter は 14 枚。

---

## 2. 判断 2 —— 重複 7 箇所

### 2.1 `TC` / `TR` は 3 系統で通し連番 —— 決定

**`02:191` が正。`02:1101` は削除し「採番は §ID と採番 に従う」の参照 1 行へ置き換える。**

### 2.2 `_assets/` の図に `**Grammar**` を宣言しない —— 決定

**`02:366` が正。`02:102` のセルを「大きな図。規則は §1.9 の図の規則」へ短縮する。**

### 2.3 大きな図は別ファイルへ出す —— 決定

**`02:347` が正。`02:364` の規則表 1 行目を削除し、3 行へ詰める。**

### 2.4 `ADR` は鎖に載らない —— 決定

**`02:187` が正。`02:889` を削除する。`02:158` / `02:178` は表のセルの値、`02:816` は Chapter 5 全体の性質を述べたものなので残す。**

### 2.5 `TEST_LEVEL` を持つのは `SW_SPEC_TEST` だけ —— 具体例

#### 何が事実か

テストのノード型は 3 つある。`TEST_LEVEL` 欄を持つのはそのうち 1 つだけである。骨格の記入例がそれを示している。

**記入例（`02` の 9.1 / 10.1 / 11.1 から該当行のみ）:**

```markdown
**Type**: USE_CASE_TEST
**UID**: TC-001
（TEST_LEVEL 無し）

**Type**: SW_SPEC_TEST
**UID**: TC-003
**TEST_LEVEL**: Integration

**Type**: NON_FUNC_TEST
**UID**: TC-005
（TEST_LEVEL 無し）
```

機械側の正は文法ファイルである。`tools/spec-query/spec.sgra` で `TEST_LEVEL` が現れるのは 1 箇所だけで、`SW_SPEC_TEST` の下にある。

**文法ファイルの該当部（`tools/spec-query/spec.sgra:119-129`）:**

```yaml
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
```

`USE_CASE_TEST`（`:98`）と `NON_FUNC_TEST`（`:143`）の `FIELDS` に `TEST_LEVEL` は無い。

#### 同じことを言っている 3 箇所

| 場所 | 文 | 種別 |
|---|---|---|
| `02:236` | 型ごとの欄の表。`SW_SPEC_TEST` の行だけが `TEST_LEVEL (※)` を持ち、他の 2 行は持たない | **表の値。`spec.sgra` と 1 対 1** |
| `02:1032` | 「`TEST_LEVEL` を持つのは `SW_SPEC_TEST` だけである。ユースケーステストと非機能テストはレベルを持たない」 | 地の文（Chapter 7 テスト戦略の解説の中） |
| `02:1185` | 「ノード型は `SW_SPEC_TEST`。親は `SW_SPEC`、`Role` は `Verifies`。本系統**だけが** `TEST_LEVEL` を持つ」 | 地の文（10.1 の解説） |

#### 何が壊れるか

`02:1032` と `02:1185` は、**自分の系統以外について語っている。** `02:1032` は Chapter 7（テスト戦略の表を説明する節）にあり、そこで欄の話をしている。`02:1185` は 10.1 の節にありながら「他の 2 系統は持たない」と言っている。

将来 `NON_FUNC_TEST` に `TEST_LEVEL` を持たせる（負荷試験を `System` と `Load` で分ける等）と決めたとき、直す場所は `spec.sgra` と `02:236` である。`02:1032` と `02:1185` は**別の節にあるため一緒に開かれず**、「非機能テストはレベルを持たない」と書いたまま残る。**書き手はそれを読んで欄を書かず、`REQUIRED: True` で落ちる。**

#### 推奨（前回から 1 点修正）

| 場所 | 措置 | 理由 |
|---|---|---|
| `02:236` | **正本。そのまま** | `spec.sgra` の写しであり、欄・親・`Role`・ANPS 限定を 1 行で持つ |
| `02:1032` | **削除** | Chapter 7 はテスト戦略（どの系統をどのレベルで確かめるか）の節であり、欄の定義を置く場所ではない |
| `02:1185` | **「だけが」を落として「本系統は `TEST_LEVEL` を持つ」にする** | こうすると他系統への言及が消え、局所的な事実だけが残る。書き手は必要な情報をその場で得られ、重複は消える |

前回は `02:1185` を参照 1 行へ置き換えると書いた。**「だけが」の 3 文字を削るほうが、書き手の手間を増やさずに重複を消せる。**

### 2.6 子 → 親 → `Role` の対応 —— 具体例

#### 2 つの表

**型ごとの欄（`02:225-238`、型名で書く。関係する 3 列を抜粋）:**

```text
| **Type**:        | 親                          | Role     |
|------------------|-----------------------------|----------|
| USE_CASE         | GOAL                        | Satisfies|
| FUNC_REQ         | USE_CASE                    | Satisfies|
| NON_FUNC_REQ     | GOAL                        | Satisfies|
| SW_SPEC          | FUNC_REQ / NON_FUNC_REQ     | Satisfies|
| USE_CASE_TEST    | USE_CASE ＋ File            | Verifies |
| SW_SPEC_TEST     | SW_SPEC ＋ File             | Verifies |
| NON_FUNC_TEST    | NON_FUNC_REQ ＋ File        | Verifies |
| TEST_RESULT      | テスト 3 型のいずれか        | ResultOf |
```

**鎖の解説の表（`02:690`、接頭辞で書く）:**

```text
| 子   | 親              | Role      |
|------|-----------------|-----------|
| UC   | GL              | Satisfies |
| FR   | UC              | Satisfies |
| NFR  | GL              | Satisfies |
| SWS  | FR または NFR   | Satisfies |
| TC   | UC / SWS / NFR  | Verifies  |
| TR   | TC              | ResultOf  |
```

#### 機械側の正

**検出クエリの制約表（`tools/spec-query/checks.jq:27-37`）:**

```jq
| ({
    "USE_CASE":["GOAL"],
    "FUNC_REQ":["USE_CASE"],
    "NON_FUNC_REQ":["GOAL"],
    "SW_SPEC":["FUNC_REQ","NON_FUNC_REQ"],
    "USE_CASE_TEST":["USE_CASE"],
    "SW_SPEC_TEST":["SW_SPEC"],
    "NON_FUNC_TEST":["NON_FUNC_REQ"],
    "TEST_RESULT":["USE_CASE_TEST","SW_SPEC_TEST","NON_FUNC_TEST"]
  }) as $ALLOWED
```

**`$ALLOWED` は `02:225-238` と同じ語彙・同じ 8 行である。** `02:690` に対応するものは機械側に無い。

#### `02:690` は重複ではなく誤りである

**接頭辞 `TC` は 3 つの型が共有している** —— `USE_CASE_TEST` / `SW_SPEC_TEST` / `NON_FUNC_TEST` はすべて `TC-xxx` と採番する（`checks.jq:23-25` の `$PREFIX` で確認）。

したがって `02:690` の 1 行「`TC` の親は `UC` / `SWS` / `NFR`」は、**どの `TC` がどの親を取れるかを区別できない。** 表の字面どおりに読むと、次の書き方が許されることになる。

**`02:690` が許し、`checks.jq` が落とす例:**

```markdown
**Type**: SW_SPEC_TEST
**UID**: TC-007

**Relations**:

- **Type**: `Parent`
  **ID**: `NFR-002`
  **Role**: `Verifies`
```

`$ALLOWED["SW_SPEC_TEST"]` は `["SW_SPEC"]` だけなので、D20「tests reaching across a level」が

`TC-007 (SW_SPEC_TEST -> NFR-002 which is NON_FUNC_REQ)`

として拾う。**`02:690` を読んで書いた仕様書が、検査で落ちる。**

#### 推奨（変更なし。ただし理由が変わった）

**`02:225-238` が正。`02:690` の表を削除し、鎖の図の直後を「対応は §型ごとの欄 が持つ」の参照 1 行にする。**

前回は「重複しているから」と書いた。**実際には `02:690` は情報を落としており、落とした結果として誤った組み合わせを許している。** 重複解消ではなく欠陥修正である。

> **`02:690` の直前にある「`NFR-001` は `SW_SPEC` を持たずテストへ直接つながり、`NFR-005` は `SWS-002` へ具体化してからつながる。どちらも正しい」は重複ではない。** 鎖の分岐の説明であり、残す。

### 2.7 CA レイヤー凡例の Mermaid —— 決定

**骨格（`01:278-292`）に色つき凡例を残す。`02:852-866` の Mermaid 15 行を削除し、「凡例の現物は仕様書テンプレートの 5.1 にある」の参照 1 行にする。**

`02:868-873` の CA レイヤー表（レイヤー / 役割 / 色 / Hex）は残す。この表だけが `役割` を持っており、Mermaid では表せない。**Hex 値の重複は 3 箇所から 2 箇所へ減る。**

---

## 3. 判断 3 —— 用語 —— 決定

### 3.1 決定

採用語は **`仕様書テンプレート`（Specification Template）**。`テンプレート` だけでは何の雛形か伝わらないため、`仕様書` を冠して語自体に対象を持たせる。

### 3.2 現況（実測）

| 語 | 出現 | 場所 |
|---|---:|---|
| `骨格` | 22 行 | `02` のみ。`framework-src/` に 0 件、`01` 自身は 0 件 |
| `テンプレート`（単独） | 55 行 / 14 ファイル | `framework-src/ja/`。`CLAUDE.md テンプレート` `Common Block テンプレート` `incident-report テンプレート` など**別の雛形を指す用例が多数を占める** |
| `仕様テンプレート` | 2 行 | `framework-src/ja/agents/architect.md:106`、`framework-src/ja/agents/srs-writer.md:95` |
| `spec-template.md` | ファイル名 | `framework-src/{lang}/process-rules/` |

**同じものに 4 つの呼び名がある。**

### 3.3 適用

| # | 対象 | 変更 |
|:-:|---|---|
| 1 | `02` の `骨格` 22 か所 | `仕様書テンプレート` へ書き換える |
| 2 | `agents/architect.md:106`、`agents/srs-writer.md:95` | `仕様テンプレート` → `仕様書テンプレート`（2 行 × 2 言語） |
| 3 | `glossary.md` §2 | `仕様書テンプレート（Specification Template）` を登録する |
| 4 | `glossary.md:106` の紛らわしい対 | 「仕様書 vs テンプレート」→「**仕様書 vs 仕様書テンプレート**」へ改め、単独の `テンプレート` は他の雛形にも使う一般語であると明記する |
| 5 | `glossary.md` §1 非採用欄 | `骨格` と `仕様テンプレート` を登録する |
| 6 | `01` の冒頭 | 自己定義を 1 行足す |

### 3.4 非採用欄を武装する順序

**単独の `テンプレート` を非採用欄に置いてはならない（MUST NOT）。** `check-terms.mjs` は CJK を単語境界なしの部分一致で照合するため、別の雛形を指す 55 行が巻き添えになる。`03-glossary-state.md` §4 と同じ理由である。

| 語 | 非採用にしてよいか | 前提 |
|---|---|---|
| `骨格` | よい | `framework-src/` に 0 件。部分一致の巻き添えも無い |
| `仕様テンプレート` | よい | `仕様書テンプレート` は `仕様テンプレート` を部分文字列として含まない。ただし **2 行 × 2 言語を先に直してから**武装する |
| `テンプレート`（単独） | **してはならない** | 55 行が巻き添えになる |

### 3.5 en 側

`framework-src/en/` へ同時に入れる。`framework-development.md` §5.1 が片言語だけのコミットを禁じ、pre-commit フックが強制する。

---

## 4. 決着したら次に進むこと

| # | 内容 |
|:-:|---|
| 1 | Chapter 8 の削除と章番号の繰り上げを `01` / `01-en` / `02` / `00` へ入れる |
| 2 | §2 の 7 件を `02` へ入れる（`01` は 2.7 の凡例をそのまま残すため変更なし） |
| 3 | §3 の 6 件を `02` と `framework-src/{lang}/` へ入れる |
| 4 | §5 の索引を `review-standards.md`（ja / en）へ入れる |
| 5 | §6 の手順記号の繰り上げを `commands/full-auto-dev.md`（ja / en）と `00-mode-matrix.md` 表 B-2 へ入れる |
| 6 | 引継書 §5 の未修正 15 件と §8 の道具 8 本へ進む |

---

## 5. カタログ 27 行を `review-standards.md` へ移す案

### 5.1 置き場

`review-standards.md` の「総合レビューチェックリスト（R1〜R7・必須）」（ja `:452` / en `:452`）の**直前**に、新しい節として置く。チェックリストが略号で書かれているため、索引はその手前にあるのが読む順である。

### 5.2 入れる現物（ja）

**設計原則の索引（`review-standards.md` へ新設する節）:**

```markdown
## 設計原則の索引

本規約は設計原則を略号で参照する。略号の正式名称と、それを判定する項目の対応は次のとおりである。**判定の本体は下の総合レビューチェックリストにあり、本表は索引である。**

| カテゴリ | 識別名 | 正式名称 | 判定する項目 |
|---|---|---|---|
| 命名 | Naming | — | R2.1 |
| 依存関係 | Dependency Direction | — | R2.16 |
| 依存関係 | SDP | Stable Dependencies Principle | R2.16 |
| 簡潔性 | KISS | Keep It Simple, Stupid | R2.8 |
| 簡潔性 | YAGNI | You Aren't Gonna Need It | R2.9 |
| 簡潔性 | Minimal Comparison | — | R2.18 |
| 簡潔性 | DRY | Don't Repeat Yourself | R2.7 |
| 責務分離 | SoC | Separation of Concerns | R2.10 |
| 責務分離 | SRP | Single Responsibility Principle | R2.2 |
| 責務分離 | SLAP | Single Level of Abstraction Principle | R2.11 |
| SOLID | OCP | Open-Closed Principle | R2.3 |
| SOLID | LSP | Liskov Substitution Principle | R2.4 |
| SOLID | ISP | Interface Segregation Principle | R2.5 |
| SOLID | DIP | Dependency Inversion Principle | R2.6 |
| 結合 | LoD | Law of Demeter | R2.12 |
| 結合 | CQS | Command-Query Separation | R2.13 |
| 可読性 | POLA | Principle of Least Astonishment | R2.14 |
| 可読性 | PIE | Program Intently and Expressively | R2.15 |
| テスト | Testability | — | R2.21 |
| 純粋性 | Pure / Semi-pure-a / Semi-pure-b / Non-pure | — | R7.1 / R7.2 / R7.6 |
| 構造 | Collect-Process Separation | 収集後処理 | R7.4 |
| 状態遷移 | State Transition | — | R4.3 |
| 並行性 | Concurrency Safety | — | R4.1 / R4.2 |
| エラー | Error Propagation | — | R3.1 / R3.2 |
| 資源管理 | Resource Lifecycle | — | R3.5 |
| 不変性 | Immutability | — | R7.5 |
| 資源効率 | Resource Efficiency | — | R5.1 / R5.3 |
```

`確認観点` の列は持たせない。**同じ内容が総合レビューチェックリストの `内容` 列にあり、そこが判定の本体である。** 索引が観点まで持つと、また 2 か所になる。

### 5.3 `Testability` —— R2.21 を新設する

27 件のうち `Testability` だけが対応する項目を持たない。総合レビューチェックリストへ 1 行足す。

**総合レビューチェックリストへ追加する行:**

```markdown
| R2.21 | 設計 | SHOULD | Testability: 単体テストから検証できる形になっている。外部依存が抽象を介して差し替えられ、テストのために本番の経路を変えなくてよい。**R7.2 が要求する分離の結果を、テスト側から見て確かめる項目である。** 分離そのものの違反は R7.2 として起票し、本項目と二重に起票しない | — | — |
```

強度を SHOULD とする理由: 分離そのものは R7.2（MUST）が既に強制しており、本項目はその結果をテスト側から確かめるものである。MUST にすると同じ違反が 2 件起票される。

### 5.4 併せて直す

| # | 対象 | 内容 |
|:-:|---|---|
| 1 | `review-standards.md:490`（R3.5） | 「Ch6 の Resource Lifecycle は本規約で検査する」→「資源の生存期間は本規約で検査する」 |
| 2 | `framework-src/en/process-rules/review-standards.md` | 同じ索引と R2.21 を同時に入れる。en の総合チェックリストは ja と同じ位置（`:452`）にある |
| 3 | `02:1046-1074` | カタログを削除する（移した先が正本になる） |

---

## 6. 手順記号を繰り上げる案

### 6.1 現状（実測）

| フェーズ | 手順記号 | 数 |
|---|---|---:|
| Phase 0 | `0a` `0b` **`0b2`** `0c` `0d` `0e` `0f` `0g` `0h` `0i` `0j` `0k` `0l` `0m` `0n` **`0n2`** `0o` `0p` | 18 |
| Phase 1 | `1a`〜`1i` | 9 |
| Phase 2 | `2a`〜`2g` | 7 |
| Phase 3 | `3a` **`3a2`** `3b` `3c` `3d` `3e` `3f` `3g` **`3g2`** `3h` `3i` `3j` `3k` `3l` | 14 |
| Phase 4 | `4a` `4b` `4c` **`4c2`** `4d` `4e` `4f` `4g` | 8 |
| Phase 5 | `5a` `5b` `5c` **`5c2`** `5d` `5e` `5f` | 7 |
| Phase 6 | `6a` `6b` `6c` `6d` `6e` `6f` **`6f2`** **`6f3`** `6g` **`6g2`** `6h` | 11 |
| Phase 7 | `7a`〜`7f` | 6 |
| 共通 | `Fa`〜`Fg` | 7 |

**太字の 9 個は、後から挿入するときに繰り上げを避けて付けられた枝番である。** `3g` と `3h` の間に `3g2` がある理由は文書のどこにも書かれていない。

**Phase 0 の 18 に、新設する `0b3`（開発方式を決める）を足して 19 になる。** 表 B-1 の Phase 0 が 19 なのはこの数である（他フェーズの数もすべて実測と一致した）。

### 6.2 案

**枝番を廃し、全フェーズを連続した英字にする。** `0b3` も枝番なので作らない。

| フェーズ | 変更 | 新しい記号 |
|---|---|---|
| Phase 0 | `0b2` の枝番を解消し、開発方式の判定を `0c` として挿入する | `0a`〜`0s`（19） |
| Phase 3 | `3d` を削除し、`3a2` `3g2` の枝番を解消する | `3a`〜`3m`（13） |
| Phase 4 | `4c2` の枝番を解消する | `4a`〜`4h`（8） |
| Phase 5 | `5c2` の枝番を解消する | `5a`〜`5g`（7） |
| Phase 6 | `6f2` `6f3` `6g2` の枝番を解消する | `6a`〜`6k`（11） |
| Phase 1・2・7・共通 | 変更なし | 現状のまま |

### 6.3 Phase 3 の対応（現物）

| 旧 | 新 | 手順 |
|---|---|---|
| `3a` | `3a` | Ch3 を詳細化する |
| `3a2` | **`3b`** | アーキテクチャをユーザーが確認するか尋ねる |
| `3b` | **`3c`** | Ch4 を詳細化する |
| `3c` | **`3d`** | Ch5 テスト戦略を定義する |
| **`3d`** | **削除** | Ch6 Design Principles Compliance を設定する |
| `3e` | `3e` | OpenAPI を生成する |
| `3f` | `3f` | 脅威モデリング |
| `3g` | `3g` | 可観測性設計 |
| `3g2` | **`3h`** | deployment-design |
| `3h` | **`3i`** | WBS 作成 |
| `3i` | **`3j`** | リスク台帳作成 |
| `3j` | **`3k`** | 安全分析 |
| `3k` | **`3l`** | 設計レビュー |
| `3l` | **`3m`** | GATE-DESIGN 判定 |

**`3d` の席には旧 `3c`（Ch5 テスト戦略）が入る。同じ記号が別の手順を指すようになる。** 引継ぎや過去の記録が旧記号で書かれている場合、読み替えが要る。

### 6.4 表 B-2 で動く記号

| 旧 | 新 |
|---|---|
| `3g2` deployment-design | `3h` |
| `3h` WBS 作成 | `3i` |
| `3i` リスク台帳作成 | `3j` |
| `3j` 安全分析 | `3k` |
| `4c2` IaC 実装 | `4d` |
| `5c2` 実機テスト | `5d` |
| `5d` 進捗曲線の更新 | `5e` |
| `6f2` ユーザーマニュアル | `6g` |
| `6f3` runbook | `6h` |
| `6b`〜`6e` デプロイ・監視・ロールバック | 変更なし |

`1d` `3e` `3f` `3g` `4b` `4e` `5c` `Fb` `Fd` `Fe` `Ff` `Fg` は変わらない。

### 6.5 検査

`00-mode-matrix.md` §13 の検査 7（表 B-2 の手順記号が `full-auto-dev.md` に実在する）が、この繰り上げの正しさを機械で確かめる。**検査 15 の「既知の欠陥を仕込んで FAIL する」と同じ扱いで、存在しない記号を 1 件仕込んで落ちることを確かめてから本適用する。**
