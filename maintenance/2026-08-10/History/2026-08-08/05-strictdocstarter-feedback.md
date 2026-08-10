# StrictDocStarter へ返す指摘

**本書は記録である。`StrictDocStarter` は作業中のため編集していない。参照のみで測った。**

**目的:** `gr-sw-maker` の仕様形式を StrictDoc の `.md` へ統一できるかを測る過程（`04-spec-format-unification.md` §4.2）で、StrictDoc の挙動に 2 件の癖が出た。

> **本書の初版は 3 件目として「行末の `\` が未知のフィールド名を前の値へ吸い込む」を挙げていた。撤回する。** 私の再現ファイルが、改行の代わりにリテラルの `\` + `n` の 2 文字を含んでいた（Python の文字列エスケープが二重になった）。**`\` に問題は無い。** §3 に対照実験を残す。

## 測定環境

```text
strictdoc 0.27.1 / Python 3.13.3 / jq 1.8.1 / Windows 11 / Git Bash
測定場所: gr-sw-maker のセッション scratchpad
文法: md-basic-ja の basic.sgra をそのまま複製して使用
      （md-basic-ja 一式を scratchpad へ複製して export し、正常に通ることを確認済み）
```

**すべてのテストファイルはヒアドキュメントで作り、`od -c` でバイトを確認してから走らせた。**

---

## 指摘 1 — 文書ヘッダの未知フィールドは、跡形もなく消える

### 再現

```markdown
# タイトル

**Grammar**: basic.sgra \
**UID**: DOC-TEST \
**Version**: 1.0 \
**Owner**: srs-writer

地の文。
```

### 実測

```text
終了コード: 0
DOCUMENT: {"UID":"DOC-TEST", "VERSION":"1.0"}
JSON 全体を grep して "Owner" / "srs-writer" は 0 件
```

**エラーも警告も出ない。地の文にも残らない。消える。**

### なぜ問題か

**要求のフィールドは、未知だとエラーになる。**

```text
**STATUX**: Approved   → error: Semantic error: Invalid requirement field: STATUX
```

**文書のフィールドは、未知だと黙って捨てられる。挙動が揃っていない。**

文書ヘッダに独自の管理情報を持たせようとした利用者は、**消えたことに気づけない。**

### 提案

**`strictdoc-quirks.tsv` に 1 行。** 文書ヘッダに置けるフィールドは組み込みのものだけで、それ以外は無言で捨てられる。**要求のフィールドと違ってエラーにならない。**

---

## 指摘 2 — 文書ヘッダは H1 の直後になければ効かない。失敗の仕方が一定しない

### 何が起きるか

`**Grammar**` / `**UID**` / `**Version**` の 3 行と H1 の間に何かを挟むと、文書ヘッダが効かなくなる。**そのときの失敗の仕方が 2 通りある。**

| 観測した挙動 | 終了コード |
|---|:-:|
| `error: Semantic error: Invalid requirement field: Grammar` | 1 |
| **通る。ただし `DOCUMENT.UID` が `null` になり、`**Grammar**` の行が地の文（`TEXT`）へ飲まれる** | **0** |

**後者が危ない。** 文法宣言が失われるため、**文法にしか無いフィールドを書くと「未宣言」と言われる。**

```text
error: Semantic error: Invalid requirement field: REVIEW_STATUS
```

**宣言済みのはずのフィールドが未宣言と言われる** — これが文法を読めていない証拠である。

### 再現（YAML frontmatter を挟んだ場合）

```markdown
# タイトル

---
okf_version: "0.2"
type: spec-foundation
---

**Grammar**: basic.sgra \
**UID**: DOC-TEST \
**Version**: 1.0
```

**なお、frontmatter をファイルの先頭に置いた場合は明確に落ちる。** こちらは挙動が安定しており、問題ない。

```text
error: Semantic error: Markdown parsing error: the document must start with an H1 heading.
error source: strictdoc/backend/markdown/reader.py:601, function: _validate_no_content_before_h1()
```

### 提案

**`strictdoc-quirks.tsv` に 1 行。** 文書ヘッダは H1 の直後に置く。**間に何かを挟むと、落ちるか、通ったうえで文書 UID と文法を失うかのどちらかになる。**

---

## 3. 撤回した指摘 — 行末の `\` は無害である（対照実験の記録）

**初版は「`\` が未知のフィールド名を前の値へ吸い込み、`UID` を黙って壊す」と書いた。誤りである。**

**原因:** 私の再現ファイルが、`\` + 改行ではなく、リテラルの `\` と `n` の 2 文字を 1 行の中に含んでいた。当然それは行の続きではなく前の値の一部になる。**StrictDoc の挙動ではなく、私のファイルの誤りだった。**

### 作り直した対照実験

**すべてヒアドキュメントで作り、`od -c` でバイトを確認した。**

| # | 書き方 | 結果 |
|:-:|---|---|
| A | `**UID**: REQ-001 \` + 改行 + `**STATUX**: ...`（**未宣言**） | `error: Invalid requirement field: STATUX`（終了 1） |
| B | `**UID**: REQ-001` + 改行 + `**STATUX**: ...`（`\` 無し・未宣言） | `error: Invalid requirement field: STATUX`（終了 1） |
| C | `**STATUS**: Approved \` + 改行 + `**REVIEW_STATUS**: ...`（**宣言済み**） | 通る。`{"UID":"REQ-001","STATUS":"Approved","REVIEW_STATUS":"NoFinding"}` |

> **`\` の有無で結果は変わらない。綴り間違いはどちらでも落ちる。** `md-basic-ja` の書き方（全フィールド行の末尾に `\`）に危険は無い。

**あわせて `md-basic-ja` 一式を scratchpad へ複製して export したところ、正常に通り、`SYS-001` は `{"UID":"SYS-001","STATUS":"Approved","REVIEW_STATUS":"NoFinding"}` と正しく分かれた。**

### 副産物（軽微。指摘というほどではない）

**値の行末に置いた `\` は、値の中に文字として残る。**

```text
**Statement**: 一行目のあと \
二行目がくる。

  → STATEMENT の中身: "一行目のあと \<改行>二行目がくる。"
```

`\` 無しなら値は `"一行目のあと<改行>二行目がくる。"` になる。**Markdown の表示上は同じだが、値を文字列として完全一致で照合する用途では差が出る。**

**手引きの「行末の `\` は StrictDoc の解析には不要である」は正しい。** 上は「不要」の説明を否定しない。

---

## 付記 — これは `gr-sw-maker` 側の判断に効いた

`gr-sw-maker` は文書の管理情報を **Common Block（YAML frontmatter・OKF v0.2）** として全管理対象ファイルの先頭に置いている。

**指摘 1 と 2 により、次の 2 案が消えた。**

| 消えた案 | 消えた理由 |
|---|---|
| Common Block を H1 の後ろへ移す | **文書ヘッダと文法を失う**（指摘 2） |
| Common Block の中身を StrictDoc の文書フィールドへ写す | **未知フィールドは消える**（指摘 1） |

**残った案は「仕様書だけ Common Block を別ファイルへ出す」である。** 詳細は `04-spec-format-unification.md` §5.2 にある。

---

## 測定の再現手順

**`StrictDocStarter` を一切触らずに再現できる。** `basic.sgra` は `md-basic-ja` のものをそのまま使う。

```bash
mkdir -p t && cd t
cp <md-basic-ja>/basic.sgra .
cat > spec.md <<'EOF'
# タイトル

**Grammar**: basic.sgra \
**UID**: DOC-TEST \
**Version**: 1.0 \
**Owner**: srs-writer

地の文。

## 要求の名前

**UID**: REQ-001 \
**REVIEW_STATUS**: NoFinding

**Statement**: 本システムは、 動くこと。
EOF
strictdoc export . --formats=json --output-dir out --no-parallelization
jq -c '.DOCUMENTS[0] | {UID,VERSION}' out/json/index.json
grep -c "Owner" out/json/index.json
```

**期待:** 終了コード 0。`{"UID":"DOC-TEST","VERSION":"1.0"}` が出て、`Owner` の grep は 0 件。

> **ヒアドキュメントで作ること。** スクリプトの文字列エスケープ経由でファイルを作ると、`\` + 改行のつもりがリテラルの `\n` 2 文字になり、別の現象を測ることになる（本書の初版がそれで誤った）。
