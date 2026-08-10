# ANMS 最小形のサンプル

**`spec/` に、11 章構成の ANMS 仕様書を最小の記法で 1 枚書いた。**

**strictdoc 0.27.1 で export が通り、かつ Prettier 3.5.3 で整形したあとも通ることを確認済みである。**

**題材:** 語の意味を返す小さなサービス。ノード 25 件（`GOAL` 2 / `USE_CASE` 1 / `FUNC_REQ` 3 / `NON_FUNC_REQ` 2 / `SW_SPEC` 3 / テスト 7 / 結果 7）。

---

## 1. 走らせ方

**サーバで見る:**

```bash
strictdoc server spec
```

**HTML で書き出す:**

```bash
strictdoc export spec --formats=html --output-dir out --no-parallelization
```

**JSON で書き出す:**

```bash
strictdoc export spec --formats=json --output-dir out --no-parallelization
```

**`--no-parallelization` を必ず付ける。** 並列 export は本当のエラーを握り潰す。**出力先を `spec/` の中に置かない。**

---

## 2. ANMS で省いた欄

**`spec/spec-anms.sgra` は `spec/spec.sgra` と 4 欄だけが違う。** その 4 欄が `REQUIRED: False` になっている。

| 型 | 省いた欄 | なぜ省けるか |
|---|---|---|
| `SW_SPEC_TEST` | `TEST_LEVEL` | 分類でしかない。ANMS は検出クエリを走らせない |
| `TEST_RESULT` | `EXECUTED_ON` | 再現のための情報。ANMS の規模なら後から追える |
| `TEST_RESULT` | `TESTED_VERSION` | 同上 |
| `TEST_RESULT` | `ENVIRONMENT` | 同上 |

**`RESULT` と `EVIDENCE` は省いていない。** 線引きは「再現の情報か、真正性の情報か」である。いつ・どの版・どの環境は再現のための情報だが、**`EVIDENCE` は結果が本物であることの唯一の担保**であり、外すと「PASS と書いただけ」が通る。

---

## 3. ANPS へ移るときにすること

**書き直しは要らない。追記だけである。**

| # | やること |
|:-:|---|
| 1 | 文書ヘッダの `**Grammar**: spec-anms.sgra` を `spec.sgra` に差し替える |
| 2 | 上の 4 欄を書き足す |
| 3 | 1 枚を部（3 枚）または章（14 枚）へ割る |

**確かめ方（実測済み）:** Grammar 行だけを差し替えて export すると、

```text
Node is missing a field that is required by grammar: EXECUTED_ON.
```

と、足りない欄を名指しで教えてくれる。**足すべき欄が機械から分かる。**

---

## 4. 実測で分かった記法の規則

**すべて strictdoc 0.27.1 で確かめた。推測は含まない。**

| # | 規則 | 破ると |
|:-:|---|---|
| 1 | **地の文を直接持つ見出しは `**Type**: SECTION` を宣言する（MUST）** | `Invalid node type: REQUIREMENT` |
| 2 | **配下が下位見出しだけの見出しは宣言しなくてよい** | —（本サンプルは 19 見出しで省いた） |
| 3 | **見出しレベルを飛ばしてはならない（MUST NOT）** | `heading level forward jumps are not allowed` |
| 4 | **欄の並びは文法の宣言順に合わせる（MUST）** | `Wrong field order for requirement`。`ORIGIN` は `STATEMENT` の後 |
| 5 | **水平線 `---` を書いてはならない（MUST NOT）** | ノードの直後だと `Invalid requirement field`。**節の直後だと通ってしまうので原因が分かりにくい** |
| 6 | **`**Relations**` は本文欄の後ろに置く（MUST）** | メタデータに隣接させると、整形で空行が入った瞬間に `duplicate field names` |
| 7 | **1 行の欄しか持たない型は、最後の欄を段落として独立させる（MUST）** | 置き場が無くなり `Relations must directly follow requirement metadata without an empty line` |
| 8 | **関係は `- ` で始まる箇条書きで、続く欄は字下げする（MUST）** | 1 行にまとめると `each relation dictionary must contain a mandatory 'Type' key` |
| 9 | **`**SCENARIO**:` `**EXTENSIONS**:` `**Relations**:` のように箇条書きを従える欄名は、その後ろに空行を 1 つ置く（MUST）** | ——（空行なしでも export は通る）。**ただし Prettier が空行を入れるため、置かないと保存のたびに差分が出る。空行あり形が整形の不動点である** |
| 10 | **親として書いた `UID` は同じ文書の中に実在しなければならない（MUST）** | `references parent requirement which doesn't exist`。**空欄フォームだけを並べたひな形は export できない** |

> **規則 5 は特に危ない。** Markdown の慣習では章の区切りに `---` を置くが、StrictDoc の仕様書では書けない。**章見出しが区切りを兼ねる。**

> **行末の `\`（強制改行）は要らない。** 欄の区切りには不要であり、**最終行に残すと export が止まる**唯一の失敗形でもある。本サンプルは 94 個すべてを外した。`maintenance/2026-08-08/06-file-inventory.md` が「1 行形は実測で確認済み」と書いているのは事実に反し、0.27.1 では通らない。

---

## 5. 整形されても壊れない書き方

**規則 6 と 7 は、エディタの自動整形に耐えるための規則である。**

Prettier や markdownlint は「リストの前後に空行を置く」規則を持つ。`**Relations**:` をメタデータ欄に隣接させていると、整形で入った空行がリストを切り離し、**`**Type**` がノードの欄として二重に読まれて `duplicate field names` になる。** エラーは原因（空行）を指さない。

**本文欄の後ろに置けば、同じ空行が入っても解釈が変わらない。**

> **壊れやすい形は、export だけでは捕まらない（2026-08-09 追測）。** メタデータに隣接させた形は、**そのままでは export が通り、整形を 1 回かけて初めて落ちる。**
>
> ```text
> 整形前: Total execution time ... 1.47s
> 整形後: Semantic error: duplicate field names in a valid requirement node are not allowed.
> ```
>
> **したがって記法の検査は「複製する → 整形をかける → export する」の順で行う。** export だけを検査にすると、壊れた形を「通った」と承認する。

**ノードの形（本サンプルの実物）:**

```markdown
#### 意味を返す

**Type**: FUNC_REQ
**UID**: FR-001

**STATEMENT**: 語彙集に該当があるとき、 システムは、 その意味を利用者に返すこと。

**Relations**:

- **Type**: `Parent`
  **ID**: `UC-001`
  **Role**: `Satisfies`
```

**`TEST_RESULT` は全欄が 1 行なので、`EVIDENCE` を段落として独立させて置き場を作る:**

```markdown
#### [PASS] 語彙集にある語を問い合わせる

**Type**: TEST_RESULT
**UID**: TR-001
**RESULT**: PASS

**EVIDENCE**: out/junit.xml#test_usecase::test_hit

**Relations**:

- **Type**: `Parent`
  **ID**: `TC-001`
  **Role**: `ResultOf`
```

---

## 6. 最小化の効き目

| 削減 | 行数 |
|---|---:|
| `**Type**: SECTION` を 19 見出しで省いた | **−38** |
| `TEST_RESULT` の 3 欄を 7 件で省いた | **−21** |
| `TEST_LEVEL` を 3 件で省いた | **−3** |
| 行末の `\` を 94 個外した | **±0**（行数は変わらないが罠が消える） |
| **合計** | **−62** |

**当初の見積もり（約 −160 行）は過大であった。** 「`**Type**: SECTION` は常に省ける」と読み違えていたためである。**地の文を持つ見出しでは省けない。**
