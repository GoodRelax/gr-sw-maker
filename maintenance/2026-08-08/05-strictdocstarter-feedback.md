# StrictDocStarter へ返す指摘

**本書は記録である。`StrictDocStarter` は作業中のため編集していない。参照のみで測った。**

**目的:** `gr-sw-maker` の仕様形式を StrictDoc の `.md` へ統一できるかを測る過程（`04-spec-format-unification.md` 段 0）で、`00-ai-guide.md` の記述と実測が食い違う点が 3 件出た。**いずれも終了コード 0 で通り、データが静かに壊れる。**

## 測定環境

```text
strictdoc 0.27.1 / Python 3.13.3 / jq 1.8.1 / Windows 11 / Git Bash
測定場所: gr-sw-maker のセッション scratchpad（どちらのリポジトリにも触れていない）
最小構成: spec.md 1 枚 + basic.sgra 1 枚
```

**文法（`basic.sgra`）は `md-basic-ja` から必要な部分だけを写した。**

```text
SECTION    : TITLE(String, 必須)
REQUIREMENT: UID(String, 必須) / STATUS(SingleChoice, 任意) / TITLE(String, 必須)
             / REVIEW_STATUS(SingleChoice, 必須) / STATEMENT(String, 必須)
             RELATIONS: Parent
```

---

## 指摘 1 —【最重要】行末の `\` が、未知のフィールド名を前の値へ吸い込む

### 何が起きるか

**行末に `\` を置くと、次の行は前のフィールドの値へ連結される。** 文法が知らないフィールド名を書いても、**フィールド名として検査されない。**

**前のフィールドの型で結果が変わる。**

| 直前のフィールドの型 | 結果 |
|---|---|
| `SingleChoice(...)` | **値域違反で落ちる。気づける** |
| **`String`** | **通る。気づけない** |

**`UID` は `String` である。**

### 再現

```markdown
## 要求の名前

**UID**: REQ-001 \
**STATUX**: Approved
**TITLE** 以下略
```

（`STATUX` は `STATUS` の綴り間違いのつもり。文法に無いフィールド名）

### 実測

```text
終了コード: 0
{"UID":"REQ-001 \n**STATUX**: Approved", "STATUS":"Approved", "TITLE":"要求の名前", ...}
```

**UID が壊れている。** そして export は成功する。

### 対照実験

**同じ綴り間違いを、行末の `\` を外して書くと、正しく落ちる。**

```text
\ 無し   → error: Semantic error: Invalid requirement field: STATUX          （終了コード 1）
\ あり   → 終了コード 0。UID の値が "REQ-001 \n**STATUX**: Approved" になる
```

**`SingleChoice` の直後なら `\` 付きでも落ちる**（値域が受け止めるため）。

```text
**STATUS**: Approved \
**REVIEW_STATUX**: NoFinding
  → error: Requirement field has an invalid SingleChoice value: Approved \n**REVIEW_STATUX**: NoFinding
```

### なぜ問題か

**`md-basic-ja` は全フィールド行の末尾に `\` を置いている。** `UID` の直後は必ず `\` である。

**したがって `UID` の次の行のフィールド名を 1 文字間違えると、UID が黙って壊れる。** UID はトレースの鍵であり、**壊れた UID を誰も参照していなければ、export は最後まで通る。**

> 参照している要求があれば `references parent requirement which doesn't exist` で止まるので**運が良ければ気づける。** 葉の要求では気づけない。

### 手引きの記述との食い違い

`00-ai-guide.md`「仕様書を書く」節:

> 行末の `\` は StrictDoc の解析には不要である。StrictDoc 以外の Markdown ビューアが連続する行を 1 行に繋げて表示してしまうので、それをこの記号が防ぐ。

**「解析には不要」は正しいが、「無害」ではない。** 解析結果を変える。

### 提案

| # | 内容 |
|:-:|---|
| 1 | **`strictdoc-quirks.tsv` に 1 行足す** — 行末 `\` の直後の未知フィールドは、前の `String` フィールドへ連結され、検査されない |
| 2 | **手引きの当該記述に 1 文足す** — 「ただしフィールド名を書き間違えると、`\` があるために検査を通らず、前のフィールドの値へ連結される。`UID` の直後は特に危険である」 |
| 3 | **監査クエリを 1 本足す**（案）— `UID` / 各フィールドの値に `**` を含むものを探す。`jq` 1 行で書ける。**綴り間違いを機械で拾える** |

**3 の案:**

```bash
jq -r '.DOCUMENTS[] | recurse(.NODES[]?) | select(.UID? and (.UID | test("\\*\\*"))) | .UID' <json>
```

---

## 指摘 2 — YAML frontmatter を H1 の後ろに置くと、文書ヘッダが丸ごと消える

### 何が起きるか

**ファイル先頭の frontmatter は正しく落ちる。**

```text
error: Semantic error: Markdown parsing error: the first content of the document must be an H1 heading.
Location: spec.md:1:1
error source: strictdoc/backend/markdown/reader.py:601, function: _validate_no_content_before_h1()
```

**ところが H1 の後ろへ移すと、終了コード 0 で通る。** そして `**Grammar**` / `**UID**` / `**Version**` の 3 行が地の文（`TEXT`）へ飲まれる。

### 実測

```text
frontmatter を H1 の後ろに置いた場合:
  終了コード: 0
  DOCUMENT.UID   : null          （本来は DOC-TEST）
  TEXT ノードの中身: frontmatter と **Grammar**: basic.sgra ... が丸ごと入っている
```

**文法宣言も失われている。** 同じファイルで、文法にしか無いフィールド（`REVIEW_STATUS`）を書くと落ちる。

```text
error: Semantic error: Invalid requirement field: REVIEW_STATUS
```

**宣言済みのはずのフィールドが「未宣言」と言われる** — これが文法が読まれていない証拠である。

### なぜ問題か

**「H1 の後ろなら通る」という回避策を採ると、文書 UID と文法を失ったまま走り続ける。** 要求とセクションは正しく解析されるため、**JSON を見るまで壊れていることに気づけない。**

### 提案

**`strictdoc-quirks.tsv` に 1 行。** 文書ヘッダ（`Grammar` / `UID` / `Version`）は H1 の直後になければ効かない。**間に何かを挟むと、エラーにならず無視される。**

---

## 指摘 3 — 文書ヘッダの未知フィールドは、跡形もなく消える

### 実測

```markdown
# 仕様書のタイトル

**Grammar**: basic.sgra
**UID**: DOC-TEST
**Version**: 1.0
**Owner**: srs-writer
```

```text
終了コード: 0
DOCUMENT: {"UID":"DOC-TEST", "VERSION":"1.0", "TITLE":"仕様書のタイトル"}
JSON 全体を grep して "Owner" / "srs-writer" は 0 件
```

**エラーも警告も出ない。地の文にも残らない。消える。**

### なぜ問題か

**要求のフィールドは未知だとエラーになる**（指摘 1 の対照実験）。**文書のフィールドは黙って消える。** 挙動が揃っていない。

**文書ヘッダに独自の管理情報を持たせようとした利用者は、消えたことに気づけない。**

### 提案

**`strictdoc-quirks.tsv` に 1 行。** 文書ヘッダに置けるフィールドは組み込みのものだけで、**それ以外は無言で捨てられる。**

---

## 付記 — これは `gr-sw-maker` 側の判断にも効いた

`gr-sw-maker` は文書の管理情報を **Common Block（YAML frontmatter・OKF v0.2）** として全管理対象ファイルの先頭に置いている。

**指摘 2 と 3 により、次の 2 案が消えた。**

| 消えた案 | 消えた理由 |
|---|---|
| Common Block を H1 の後ろへ移す | **文書ヘッダと文法を失う**（指摘 2） |
| Common Block の中身を StrictDoc の文書フィールドへ写す | **未知フィールドは消える**（指摘 3） |

**残った案は「仕様書だけ Common Block を別ファイルへ出す」である。** 詳細は `04-spec-format-unification.md` §5.2 にある。

---

## 測定の再現手順

**`StrictDocStarter` を一切触らずに再現できる。**

```bash
mkdir -p t && cd t
# basic.sgra は md-basic-ja のものをそのまま使ってよい
cat > spec.md <<'EOF'
# 仕様書のタイトル

**Grammar**: basic.sgra \
**UID**: DOC-TEST \
**Version**: 1.0

地の文。

## 要求の名前

**UID**: REQ-001 \
**STATUX**: Approved

**REVIEW_STATUS**: NoFinding

**Statement**: 本システムは、 動くこと。
EOF
strictdoc export . --formats=json --output-dir out --no-parallelization
jq -c '[.DOCUMENTS[] | recurse(.NODES[]?) | select(._NODE_TYPE=="REQUIREMENT")][0]' out/json/index.json
```

**期待:** 終了コード 0 で通り、`UID` に `**STATUX**` が混ざる。
