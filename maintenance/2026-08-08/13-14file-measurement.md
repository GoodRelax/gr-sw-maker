# 14 枚構成での実測

> **本書は履歴である。** 定義と作業指示は `14-framework-update-plan.md` が持つ。**内容が食い違う場合は 14 が正しい。**

**本書は実測の記録である。トライアルであり、`framework-src/` と `process-rules/` には触れていない。** 仕様書のファイルはすべて測定用の作り物である。

**測定環境:** strictdoc 0.27.1 / Python 3.13.3 / jq 1.8.1 / Windows 11 / Git Bash
**文法:** `12-spec-sgra.md` §2 の `spec.sgra`（ノード型 10 種）
**構成:** `10-element-table.md` の 11 章 14 枚

---

## 1. 結果

| # | 測ったこと | 結果 |
|:-:|---|---|
| 1 | 14 枚 + 図 1 枚で `--formats=json` が通る | **通った**（終了 0） |
| 2 | 同じく `--formats=html` が通る | **通った**（終了 0） |
| 3 | **文書をまたぐ参照が解決する** | **通った。** 20 ノードすべて |
| 4 | **同じ番号の 2 ファイルが共存する**（`09-` × 2、`10-` × 2、`11-` × 2） | **通った。** 名前が違えば衝突しない |
| 5 | **`.meta.yaml` を同じフォルダに置いても文書として拾われない** | **拾われない。** 文書は 15（14 章 + 図 1） |
| 6 | **大きな図の外出しと `[LINK:]` の解決** | **解決した。** 下に現物 |
| 7 | 検出クエリ 8 本 | **仕込んだ欠陥をすべて拾い、誤検出ゼロ** |

**解析されたノード（20 件）:**

```text
GOAL 2 / USE_CASE 2 / FUNC_REQ 2 / NON_FUNC_REQ 2 / SW_SPEC 3
USE_CASE_TEST 2 / SW_SPEC_TEST 2 / NON_FUNC_TEST 1 / TEST_RESULT 4
SECTION 19 / TEXT 24
```

**図の参照が解決した現物（`02-overview.html`）:**

```html
<a href="../spec/_assets/fig-flow.html#DOC-FIG-FLOW">🔗 問い合わせの流れ</a>
```

**同じ番号の 2 ファイルが両方出た:**

```text
09-uc-test-cases.html    09-uc-test-results.html
10-sws-test-cases.html   10-sws-test-results.html
11-nfr-test-cases.html   11-nfr-test-results.html
```

---

## 2. 仕込んだ欠陥と検出

**5 件を仕込み、すべて拾われた。** あわせて仕込んでいない欠陥を 1 件見つけた。

| 仕込み | 何を壊したか | 拾ったクエリ | 結果 |
|---|---|---|:-:|
| `NFR-099` | 親を持たない | **D17** / D16c | **拾った** |
| `SWS-003` | テストが無い | **D16b** → **D16d** へ積み上がる | **拾った** |
| `TC-002` | 結果が無い | **D19** | **拾った** |
| `TC-004` | `SW_SPEC_TEST` が `USE_CASE` を指す | **D20** | **拾った** |
| `RT-004` | `TEST_RESULT` なのに接頭辞が `TR-` でない | **D21** | **拾った** |
| （仕込んでいない） | `SWS-002` にテストが無い | **D16b** | **見つけた** |

**クエリの出力:**

```json
{
  "D17 鎖から外れたノード": ["NON_FUNC_REQ NFR-099"],
  "D16a テストに覆われない USE_CASE": [],
  "D16b テストに覆われない SW_SPEC": ["SWS-002", "SWS-003"],
  "D16c テストに覆われない NON_FUNC_REQ": ["NFR-099"],
  "D16d 積み上げで覆われない FUNC_REQ": ["FR-002 (配下の SW_SPEC が未覆: SWS-003)"],
  "D19 走らせていないテスト": ["TC-002"],
  "D20 段をまたいだテスト": ["TC-004 (SW_SPEC_TEST -> UC-001 は USE_CASE)"],
  "D21 接頭辞の規約違反": ["RT-004 (TEST_RESULT なら TR- で始まるべき)"]
}
```

> **`D16a` が空であることが重要である。** ユースケース 2 件はどちらも覆われており、**誤検出が出ていない。**

> **`D16d` の積み上げが働いた。** `FR-002` 自身にはテストが無くて当然だが、**配下の `SWS-003` が未覆であることを理由に拾われた。** `FR` を全件「未覆」と誤報しない形になっている。

---

## 3. `tools/spec-query/checks.jq`（現物）

```text
def nodes: [.DOCUMENTS[].NODES | .. | objects | select(.UID != null)];
def parents($n): [($n.RELATIONS // [])[] | select(.TYPE == "Parent") | .VALUE];

nodes as $N
| ($N | map({key: .UID, value: ._NODE_TYPE}) | from_entries) as $TYPE
| ({
    "GOAL":"GL","USE_CASE":"UC","FUNC_REQ":"FR","NON_FUNC_REQ":"NFR",
    "SW_SPEC":"SWS","USE_CASE_TEST":"TC","SW_SPEC_TEST":"TC",
    "NON_FUNC_TEST":"TC","TEST_RESULT":"TR"
  }) as $PREFIX
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
| ([$N[] | select(._NODE_TYPE == "USE_CASE_TEST") | parents(.)[]]) as $cov_uc
| ([$N[] | select(._NODE_TYPE == "SW_SPEC_TEST") | parents(.)[]]) as $cov_sws
| ([$N[] | select(._NODE_TYPE == "NON_FUNC_TEST") | parents(.)[]]) as $cov_nfr
| ([$N[] | select(._NODE_TYPE == "TEST_RESULT") | parents(.)[]]) as $has_result
| ([$N[] | select(._NODE_TYPE == "SW_SPEC") | {sws: .UID, req: parents(.)[]}]) as $sws_of_req
| {
  "D17 鎖から外れたノード":
    [$N[] | select(._NODE_TYPE != "GOAL") | select(parents(.) | length == 0)
      | "\(._NODE_TYPE) \(.UID)"],

  "D16a テストに覆われない USE_CASE":
    [$N[] | select(._NODE_TYPE == "USE_CASE") | select(.UID as $u | ($cov_uc | index($u)) | not) | .UID],

  "D16b テストに覆われない SW_SPEC":
    [$N[] | select(._NODE_TYPE == "SW_SPEC") | select(.UID as $u | ($cov_sws | index($u)) | not) | .UID],

  "D16c テストに覆われない NON_FUNC_REQ":
    [$N[] | select(._NODE_TYPE == "NON_FUNC_REQ") | select(.UID as $u | ($cov_nfr | index($u)) | not) | .UID],

  "D16d 積み上げで覆われない FUNC_REQ":
    [$N[] | select(._NODE_TYPE == "FUNC_REQ") | .UID as $fr
      | ([$sws_of_req[] | select(.req == $fr) | .sws]) as $mine
      | ([$mine[] | . as $s | select(($cov_sws | index($s)) | not)]) as $uncov
      | if ($mine | length) == 0 then "\($fr) (SW_SPEC 無し)"
        elif ($uncov | length) > 0 then "\($fr) (配下の SW_SPEC が未覆: \($uncov | join(",")))"
        else empty end],

  "D19 走らせていないテスト":
    [$N[] | select(._NODE_TYPE | endswith("_TEST"))
      | select(.UID as $u | ($has_result | index($u)) | not) | .UID],

  "D20 段をまたいだテスト":
    [$N[] | select(._NODE_TYPE | endswith("_TEST")) as $t
      | parents($t)[] as $p
      | select(($ALLOWED[$t._NODE_TYPE] | index($TYPE[$p])) | not)
      | "\($t.UID) (\($t._NODE_TYPE) -> \($p) は \($TYPE[$p]))"],

  "D21 接頭辞の規約違反":
    [$N[] | . as $n
      | select(($n.UID | startswith($PREFIX[$n._NODE_TYPE] + "-")) | not)
      | "\($n.UID) (\($n._NODE_TYPE) なら \($PREFIX[$n._NODE_TYPE])- で始まるべき)"]
}
```

**走らせ方:**

```bash
strictdoc export spec --formats=json --output-dir out/json --no-parallelization
jq -f tools/spec-query/checks.jq out/json/json/index.json
```

> **接頭辞と親の型の対応表がクエリの中に埋まっている。** `10-element-table.md` を直したら**このファイルも直す（MUST）。** 2 か所に同じ知識があるので、**ずれると検査が嘘をつく。**

---

## 4. 書くときに踏んだ罠（jq）

**本作業で 2 度、同じ原因で誤った結果を出した。どちらも `.` の文脈が変わることによる。**

| # | 誤った書き方 | 何が起きたか | 正しい書き方 |
|:-:|---|---|---|
| 1 | `.UID \| startswith($PREFIX[._NODE_TYPE] + "-")` | パイプの先では `.` が **`.UID`（文字列）** になり、`._NODE_TYPE` で `Cannot index string` | **`. as $n` で束縛してから使う** |
| 2 | `$cov_sws \| index(.)` | 関数の引数は**その関数の入力**（`$cov_sws` 自身）に対して評価される。**常に不一致となり、検出が全件空になった** | **`. as $s` で束縛し `index($s)`** |

> **2 が危ない。** エラーにならず、**「検出なし」という正しく見える答えを返す。** 仕込んだ欠陥が無ければ気づけなかった。

> **したがって、検出クエリは必ず既知の欠陥を仕込んで確かめる（MUST）。** 「0 件だった」は「検査が働いた」を意味しない。

---

## 5. まだ測っていないこと

| # | 内容 |
|:-:|---|
| 1 | **要求 100 件以上での export 時間とメモリ。** 本測定はノード 20 件である |
| 2 | **`tools/check-spec-meta.mjs`（`.md` と `.meta.yaml` の対応検査）。** 未実装 |
| 3 | **`ADR-xxx` の参照切れ検査。** StrictDoc の外側で行う必要がある。未実装 |
| 4 | **`TC` の更新が `TR` の `EXECUTED_ON` より新しい場合の検出**（古い結果の検出）。git から取る想定。未実装 |
| 5 | **3 枚形式・1 枚形式での export。** 本測定は 14 枚形式のみ |
