# PoC 準備計画（2026-08-11）

**本書は `03-work-order.md` の後継である。** 生きている残作業と PoC の準備手順を持つ。`03` は History へ退避した。

**決めた理由は書かない。** 経緯は `History/` にある。作業表の中身は `00-mode-matrix.md` が、仕様書の中身は `01-spec-template.md` と `02-spec-writing-rules.md` が持つ。**本書はそれらを再掲しない。**

---

## 1. PoC の定義

| 項目 | 値 |
|---|---|
| 実施先 | `C:\Users\good_\OneDrive\Documents\GitHub\gr-sw-maker-trial2` |
| 開発方式 | **簡易** |
| 仕様形式 | **ANMS**（単一 Markdown。実ファイル名 `01-10-spec.md`） |
| 到達点 | **Phase 2 企画の完了**（`2k` GATE-PLANNING の判定まで） |
| 題材 | CLI の単位換算ツール（長さ・重さ・温度、Node.js、外部サービス・DB なし） |
| 主言語 | ja のみ（en は削除する） |

**Phase 2 で書かれるのは仕様書の Chapter 1〜4 である。** `2e` が Ch1（目的）・Ch2（システム概要）・Ch3（ユースケース）、`2f` が Ch4（要求）、`2g` が Ch5 以降の枠だけを写す。

---

## 2. PoC 準備手順

**取得は手で行う。** `create-gr-sw-maker` は `main` の tarball を取るが、`main` には作業表が 1 枚も無い。PoC は `main` を経由しない。

### 2.1 trial2 へ運ぶもの

| 運ぶもの | 中身 |
|---|---|
| `setup.js` | 配置スクリプト |
| `framework-src/ja/` | 正本一式 |
| `tools/` | 7 ファイル。`gate-guard` と `session-meter` は `settings.json` から走る |
| `.claude/settings.json` | **`0c` が未実装なので手で運ぶ** |
| `.gitkeep` を持つ 31 ディレクトリ | `docs/` 9・`project-records/` 18・`project-management/` 3・`infra` `src` `tests` |
| `gitignore-user.template` | `.gitignore` として置く |

**運ばない:** `maintenance/` `maintenance-tools/` `.github/` `create-gr-sw-maker/` `essays/` `prompt/` `framework-src/en/`

**運んではならない:** リポジトリ直下の `CLAUDE.md` `user-order.md` `process-rules/`。**これらは `setup.js` の出力であり、運ぶと二重になる。**

### 2.2 実行

**配置:**

```bash
node setup.js
```

**メニューでは `2`（Claude Code / ja）を選ぶ。** en を削除した後は、6 択のうち `1` `3` `4` `6` が `No originals for "en"` で落ちる（`setup.js:199-225` の `selectFromMenu()` はメニューをハードコードしており `availableLanguages()` を引かない）。`node setup.js ja` と引数を与えればメニューを飛ばせる。

### 2.3 開始

`user-order.md` に `gr-sw-maker-trial/user-order.md` と同じ内容を書き、Claude Code で `/full-auto-dev` を実行する。

---

## 3. 走行経路

**簡易・Phase 2 までで走るのは 26 手順、エージェントは無条件 6 体・条件付き 3 体である。**

| 走るエージェント | 担当手順 |
|---|---|
| srs-writer | `1b` `2a` `2b` `2c` `2d` `2e` `2f` `2g` `2h` |
| technical-authority | `1e` `1g` `2j` `2k` |
| project-manager | `1h` `1i` `Fb` `Fc` |
| architect | `1c` |
| review-agent | `2i` |
| test-designer | `2f`(2) |
| tester ／ implementer ／ change-manager | `Fg`（defect 発見時のみ） |

**名簿 24 体のうち 15 体は一度も走らない。配布物 54 ファイルのうち 33 ファイルは Phase 2 到達まで開かれない。**

---

## 4. PoC を止めるもの

**優先順に並べた。上から潰す。**

### 4.1 走行が止まる（8 件）

| # | 何 | 実体 | 直す先 |
|:-:|---|---|---|
| 1 | **`1e` / `1d` の食い違い** | 作業表は `1e` が方式判定。`full-auto-dev-process-rules.md:354` が **MUST 付きで `1d`**、`framework-src/ja/CLAUDE.md:42` も `1d` | 配布物 2 ファイル（生成物ではない） |
| 2 | **`2e` の書き先が無い** | 配布 `spec-template.md` は 6 章。`システム概要` `ユースケース` `GL-` `UC-` がいずれも **0 件** | `01-spec-template.md` を 10 章化して置換 |
| 3 | **`2i` の根拠が解決しない** | `根拠: 概要と UC` の章が配布テンプレートに無い。**`2i` が通らないと `2k` に届かず Phase 2 が終わらない** | 同上 |
| 4 | **仕様書のファイル名** | `01-10-spec.md` に決着（§7）。`02:80` `02:104` が `01-11-spec.md` のまま | `02` |
| 5 | **配布済みの未決注記** | `development-mode.md:217` が「ファイル名が一意に決まらないので依頼文に与件として添える」と**エージェントの運用を変えている** | `00-mode-matrix.md` §3 を直して再生成 |
| 6 | **`work-table-2-planning.md:25` の自己参照** | 「本手順の前に `2f` が要る」だが本手順が `2f`。正しくは `2e` | `00-mode-matrix.md` §4.3 を直して再生成 |
| 7 | **`0c` 未実装** | `setup.js` に `settings` の出現 **0 件** | §2.1 で手運びして回避。実装は PoC 後 |
| 8 | **`0b` の入力と作業** | `入力` の `framework-src/tools/` は恒久的に作られない。`作業` の「道具を配置する」も嘘 | `00-mode-matrix.md` §4.1 を直して再生成 |

### 4.2 走るが規定の効果を持たない（主なもの）

| # | 何 | 帰結 |
|:-:|---|---|
| 9 | **`test-designer.md` と `tester.md` に「読むべき規則の節」の表が無い** | 規則文書を**全文ロードする以外の選択肢が無くなる**。context を最も食う失敗の仕方 |
| 10 | **`full-auto-dev.md:53` が存在しない規則を引く** | `process-rules/agent-orchestration-rules.md` は `framework-src` に 0 件 |
| 11 | **作業表が未配布文書を約 40 か所引く** | `07` が最多。`02` `06` `03` も。利用者の手元では全部が切れたポインタ |
| 12 | **`Fa` 免除でコスト計測が一切走らない** | `progress-log.mjs` も不在。`Fj` のコスト閾値トリガは恒久的に発火しない |
| 13 | **保守専用の節が配布されている** | `development-mode.md` に §11 検査 27 件（90 行）・§4.10 改修履歴。**生成器が行き先を持ち越すため** |
| 14 | **手順数 88 と 96 の同居** | 表 M の前書きが「全 88 手順」、実体は 96 |
| 15 | **EARS Complex の語順が逆** | `spec-template.md:72-83` が `When…, while…`。正は `While [状態], when [契機]` |

---

## 5. 棚卸し

### 5.1 分類

| 区分 | ファイル | 扱い |
|:-:|---|---|
| **1 削除** | `01-spec-template-en.md` | en 全削除で適用先が消える。ja と構造完全一致で独自の記録価値が無い |
| **2 History へ** | `03-work-order.md` `04-glossary-state.md` `05-open-questions.md` `06-agent-connection-report.md` `census-before.txt` | 生きている内容は本書 §6・§8 へ引き継いだ |
| **3 再使用** | `00-mode-matrix.md` `01-spec-template.md` `02-spec-writing-rules.md` `07-agent-orchestration-rules.md` `README.md` | §6 の作業で消費される |
| **4 新規** | **本書** | `03` の後継 |

**`00-mode-matrix.md` は移動してはならない。** `maintenance-tools/split-work-table.mjs` が `const SRC` で定数参照しており、移せば生成器も `--check` も落ちる。

**`06` は History へ送るが、根拠としては生きている。** 配布版 `07` からは `06` への参照 24 件を落とし、必要な数値は本文へ取り込む。**規則は配布版が、根拠は `06` が持つ** —— どちらも 1 か所ずつになる。

### 5.2 `01` `02` `07` の行き先

| 元 | 配布先 | 状態 |
|---|---|---|
| `01-spec-template.md` | `framework-src/ja/process-rules/spec-template.md` を置換 | **10 章化が未実施** |
| `02-spec-writing-rules.md` | `framework-src/ja/process-rules/spec-writing-rules.md` を新設 | **未配布。配布前に 19 件** |
| `07-agent-orchestration-rules.md` | `framework-src/ja/process-rules/agent-orchestration-rules.md` を新設 | **未配布。保守記録の節を落とす** |

**配布が済んだ時点で 3 ファイルとも History へ送る。** 正本は配布先へ移る。

---

## 6. 作業計画

**段は PoC を止める順に並べた。段 1 と段 2 が終われば PoC は開始できる。**

| 段 | 内容 | 対象 | 止めている件 |
|:-:|---|---|:-:|
| **1** | **`1e` / `1d` を揃える** | `full-auto-dev-process-rules.md` `framework-src/ja/CLAUDE.md` | 1 |
| **2** | **仕様書テンプレートを 10 章化して配布** | `01` → `spec-template.md`。Ch8 削除（`:410-424`）＋ 9 行の繰り上げ | 2・3・15 |
| **3** | **`00-mode-matrix.md` の 4 件を直して再生成** | `0b` の入力・`2f` の自己参照・`development-mode.md:217` の未決注記・手順数 88 | 5・6・8・14 |
| **4** | **en を削除** | `framework-src/en/` 43 ファイル。`check-parity` は「言語が 1 つ」で PASS する | — |
| **5** | **`02` を 10 章化して配布** | 19 件のうち PoC を止める 8 件を先に | 4 |
| **6** | **`07` を整理して配布** | 保守記録の節を落とし、`06` 参照 24 件を取り込む | 10・11 |
| **7** | **`test-designer` と `tester` に引用表を足す** | 2 ファイル | 9 |
| **8** | **生成器を持ち越し禁止にする** | `split-work-table.mjs`。`##` 見出しで振り分け表に無ければ落とす | 13 |
| **9** | **`00-mode-matrix.md` §11 を切り出す** | `00-mode-matrix-checks.md` へ | 13 |
| **10** | **CI に `--check` を足す** | `.github/workflows/framework-check.yml` | — |

**段 1〜4 で PoC を開始できる。** 段 5 以降は走行の質を上げるものである。

---

## 7. 決めたこと

| # | 件 | 決定 |
|:-:|---|---|
| 1 | 仕様書の実ファイル名 | **`01-10-spec.md`**。`02` の席番号規則（ファイル番号は最初の章の番号、範囲を名前に含める）が 10 章構成から導く |
| 2 | `framework-src/en/` | **丸ごと削除する。** 変更量が多く既存分は再使用できない |
| 3 | PoC の到達点 | **Phase 2 企画まで** |
| 4 | 道具の置き場 | `tools/`（配る 7）と `maintenance-tools/`（配らない 12）。**実施済み**（`History/2026-08-11/00-tools-placement-record.md`） |
| 5 | エージェントへの規則の渡し方 | **統括文書を正本とし、エージェントには自分のプロンプトへ展開した節だけを渡す。** 走る 5 体の引用は 100% 解決済みで、機構は動いている |
| 6 | `build-agents.mjs`（展開の生成器） | **PoC 後に作る。** PoC で走るのは 9 体で、手で当てる方が速い |
| 7 | EARS Complex の語順 | **`While [状態], when [契機]`**（`02:726-746` が正）。配布 `spec-template.md:72-83` が逆 |
| 8 | `06-agent-connection-report.md` | **配らない。** 規則は配布版 `07` が、根拠は `06` が持つ |

---

## 8. 引き継いだ未決

### 8.1 用語集に足す定義（`04-glossary-state.md` §5.1 より。9 件とも未適用）

`仕様書テンプレート` の登録／「仕様書 vs 仕様書テンプレート」の節／`簡易` `標準` `厳格` と非採用 7 語／`glossary.md:48` の SSOT ポインタの誤り（接頭辞表は `02` にあり、テンプレートには無い）／ANPS の枚数（`:38` が「3 枚」、正は 4 枚）／エージェント連携の語 16 語／`保温` を非採用へ／キャッシュの寿命の対／待機と中断の対。

**いずれも PoC を止めない。** `kotodama-kun` が走らないため用語検査が発火しない。

### 8.2 実機で確かめないと決まらないもの（`05-open-questions.md` より）

`ENABLE_PROMPT_CACHING_1H` がサブエージェントに効くか／背景起動でキャッシュが残るか／statusLine がこの環境で動くか／`tasks[].id` が `SendMessage` の宛先と同一か／フックが Agent の返り値を受け取れるか。

**PoC そのものが観測の機会になる。**

### 8.3 PoC 後に決めるもの

| 件 | 論点 |
|---|---|
| `kotodama-kun` | 道具化の決定と実体が矛盾。名簿はエージェント前提、配布済み作業表は道具前提。モデルも `sonnet` と `haiku` で食い違う |
| エージェント名簿の目標件数 | 21 / 23 / 24 のどれか。`kotodama-kun` 廃止と en 削除の反映後に確定する |
| 設計原則カタログ 27 行 | `review-standards.md` へ移す決定だが未実施。`review-standards.md` に「設計原則の索引」も `R2.21` も 0 件 |
| `02` の重複 7 箇所 | 正本は決まったが 1 件も当てていない |
| 表 A のテンプレート行数 | Ch8 削除後の再計測待ち |
| ANMS と付録 | `02:76` が「付録を他のファイルへ混ぜてはならない（MUST NOT）」と定めるが、ANMS は 1 枚に付録を含む |
