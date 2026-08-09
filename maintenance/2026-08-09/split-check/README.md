# 分割の実測 — 1 枚 / 4 枚 / 15 枚

**フレームワークの主張「記法は 1 つで、変わるのは分ける単位だけ。書き直しは要らず、割るだけである」を測った現物である。**

**測定日:** 2026-08-09。**環境:** strictdoc 0.27.1 / Prettier 3.5.3 / Python 3.13.3 / jq 1.8.1 / Windows 11。

**入力は `../03-spec-template-skeleton.md`（骨格）1 枚である。** ここに置いた 20 枚はすべてそこから機械で作った。**結論と経緯は `../05-step2-split.md` §2.1b にある。**

---

## 1. 何が入っているか

| フォルダ | 仕様形式 | 枚数（`.md`） | 同梱した文法 |
|---|---|:-:|---|
| `anms/` | ANMS | **1** | `spec-anms.sgra` |
| `anps-part/` | ANPS-part（部で割る） | **4** | `spec.sgra` |
| `anps-chapter/` | ANPS-chapter（章で割る） | **15** | `spec.sgra` |

> **各フォルダは文法を同梱しており、そのまま export できる（MUST 維持）。** `tools/spec-query/` の 1 部だけにして参照させる形も考えたが、**本フォルダは 2026-08-09 に測った凍結スナップショットである。** 正本の文法が後で変われば、同じコマンドが**別の文法に対して走り、記録と違う結果を黙って返す。** スナップショットは自分の入力を抱える。
>
> **`tools/spec-query/` の 1 部だけという原則は、配布される生きた成果物の話であって、日付の付いた測定記録には当てはまらない。**

| 道具 | 何をするか |
|---|---|
| `split-spec.mjs` | 骨格から 3 構成を生成する。**切る以外に必要だった変換を自分で列挙して出す** |
| `plant-faults.py` | `tools/spec-query/checks.jq` の 8 検出それぞれに fault を仕込んだ版を作る |

---

## 2. 走らせ方

**3 構成を作り直す:**

```bash
node maintenance/2026-08-09/split-check/split-spec.mjs maintenance/2026-08-09/03-spec-template-skeleton.md /tmp/configs tools/spec-query/spec-anms.sgra tools/spec-query/spec.sgra
```

**1 構成を export する（文法は同梱済みなので、そのまま走る）:**

```bash
strictdoc export maintenance/2026-08-09/split-check/anps-chapter --formats=json --output-dir /tmp/out --no-parallelization
```

**検出クエリをかける:**

```bash
jq -f tools/spec-query/checks.jq /tmp/out/json/index.json
```

**8 検出が実際に働くことを確かめる:**

```bash
python maintenance/2026-08-09/split-check/plant-faults.py maintenance/2026-08-09/03-spec-template-skeleton.md /tmp/faults
```

> **`--no-parallelization` を必ず付ける。** 並列 export は本当のエラーを握り潰す。**出力先を入力フォルダの中に置かない** —— UID 重複で止まる。

---

## 3. 測った結果

| 構成 | 枚数 | export | ノード数 | 鎖 |
|---|:-:|:-:|:-:|---|
| ANMS | 1 | **通る** | 12 | 基準 |
| ANPS-part | 4 | **通る** | 12 | **1 枚構成と完全に一致** |
| ANPS-chapter | 15 | **通る** | 12 | **1 枚構成と完全に一致** |

**ファイルをまたぐ親子関係はすべて解決する** —— `SWS-001 → FR-001`（Ch6 → Ch4）、`TC-002 → SWS-001`（Ch10 → Ch6）、`TR-002 → TC-002`（結果の枚 → ケースの枚）。**主張の核である「書き直しが要らない」は成り立っている。**

**だが「割るだけ」は成り立たない。切る以外に 4 つの変換が要る。**

| # | 変換 | いつ | 怠るとどうなるか |
|:-:|---|---|---|
| 1 | 枚ごとに H1 と `**Grammar**` / `**UID**` / `**Version**` を書き足す | ANPS 全般 | 文法が適用されない |
| 2 | `**Grammar**` を `spec.sgra` にし、`TEST_RESULT` に 4 欄を足す | ANMS → ANPS | `Node is missing a field that is required by grammar: EXECUTED_ON.` |
| 3 | **章の途中で切るときは章見出しを両方の枚に持たせる** | **ANPS-chapter のテスト 6 枚だけ** | `heading level forward jumps are not allowed: L1 -> L3` |
| 4 | 付録を `A-appendix.md` として独立させる | ANPS 全般 | 置き場が無い |

**3 の現物は `anps-chapter/09-uc-test-cases.md` にある。** 7 行目の `## Chapter 9. Use Case Tests` がそれで、**この 1 行が無いと H1 の次が H3 になって止まる。**

> **3 は ANPS-part では起きない。** 部で割るときは章の境目で切るからである。**章単位に割った瞬間、Ch9〜11 の 6 枚だけで起きる。** 部までしか試していないと、この失敗は最後まで表に出ない。

**表の桁揃えが骨格と違うのは、測定のたびに Prettier をかけたからである。** ノード構造は整形の不動点であり、桁揃えは StrictDoc の解釈を変えない（実測）。
