# PoC 準備計画（2026-08-11）

**本書は `03-work-order.md` の後継である。** 生きている残作業と PoC の準備手順を持つ。`03` は History へ退避した。

**決めた理由は書かない。** 経緯は `History/` にある。作業表の中身は `00-mode-matrix.md` が、仕様書の中身は `01-spec-template.md` と `02-spec-writing-rules.md` が持つ。**本書はそれらを再掲しない。**

---

## 1. PoC の定義

| 項目 | 値 |
|---|---|
| 実施先 | `gr-sw-maker-trial2`（本リポジトリと同じ階層に置く別プロジェクト） |
| 開発方式 | **簡易** |
| 仕様形式 | **ANMS**（単一 Markdown。実ファイル名 `01-10-spec.md`） |
| 到達点 | **Phase 7 納品の完了**（実装・テスト・納品まで走らせる） |
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

| 段 | 内容 | 対象 | 止めている件 | 状態 |
|:-:|---|---|:-:|---|
| **4'** | **en を削除し、`README.md` の 14 リンクを ja へ張り替える** | `framework-src/en/` 43 ファイル。`check-parity` は「言語が 1 つ」で PASS する | — | **済**（2026-08-11） |
| **1** | **`1e` / `1d` を揃える** | `full-auto-dev-process-rules.md` `framework-src/ja/CLAUDE.md` | 1 | **済** |
| **3** | **`00-mode-matrix.md` の 7 件を直して再生成** | `0b` の入力と作業・`2f` の自己参照・未決注記・手順数 88×3・表 M の「全 10 手順」 | 5・6・8・14 | **済** |
| **2** | **仕様書テンプレートを 10 章化して配布** | `01` → `spec-template.md`。＋ 設計原則カタログの移設・EARS 表・章担当の付け替え | 2・3・15 | **済** |
| **11** | **納品まで走らせるための修正**（2026-08-11 に到達点を Phase 7 へ拡大したことによる） | 下記 §6.2 | 15 | **大半が済** |
| **5** | **`02` を 10 章化して配布** | 19 件のうち PoC を止める 8 件を先に | 4 | 未着手 |
| **6** | **`07` を整理して配布** | 保守記録の節を落とし、`06` 参照 24 件を取り込む | 10・11 | 未着手 |
| **7** | **`test-designer` と `tester` に引用表を足す** | 2 ファイル | 9 | 未着手 |
| **8** | **生成器を持ち越し禁止にする** | `split-work-table.mjs`。`##` 見出しで振り分け表に無ければ落とす | 13 | 未着手 |
| **9** | **`00-mode-matrix.md` §11 を切り出す** | `00-mode-matrix-checks.md` へ | 13 | 未着手 |
| **10** | **CI に `--check` を足す** | `.github/workflows/framework-check.yml` | — | 未着手 |

**実行順序はシミュレーションの判定に従い、段 4' を先頭に置いた。** en を先に消すと以降すべてが ja 単独になり、**全工程で `check-parity` が PASS 基準になる。** 逆順だと段 2 で parity の不一致が 14 → 18 に増え、新しい破壊が雑音に埋もれる。

**PoC を止めていた 8 件はすべて解消した。** 段 5 以降は走行の質を上げるものである。

### 6.1 段 2 で同時に当てたもの

**テンプレートの置換だけでは新しい欠落が 4 つ生まれる**とシミュレーションが判定したため、同じ段に含めた。

| 何 | なぜ必要だったか |
|---|---|
| 設計原則カタログ 27 行を `review-standards.md` へ移設 | 旧テンプレート Ch6 の 27 行が置換で消える。決定 3 の移し先は空のままだった |
| EARS 構文表を Ch1.9 Notation へ追加 | `01` は表を持たず、置換すると**構文形が配布物から消える**。`2f` が拠り所を失う |
| `glossary.md` の 3 行を 8〜10 章へ | 存在しない Chapter 9〜11 を指していた |
| 章の担当範囲を付け替え | `Ch1-2`/`Ch3-6` は**旧 6 章構成の切れ目**。10 章版では **srs-writer が Ch1-4、architect が Ch5-7、test-designer/tester が Ch8-10** になる。`srs-writer.md` `architect.md` `review-agent.md` `CLAUDE.md` `review-standards.md` の R1/R2/R7 見出しを揃えた |

### 6.2 段 11 —— 納品まで走らせるための修正（2026-08-11）

到達点を Phase 7 へ広げたことで、Phase 3 以降にしか効かないとして先送りしていた論点が停止要因に変わった。**シミュレーション 2 本が走行を止めるものを 15 件挙げ、うち 13 件を当てた。**

| 何 | なぜ止まっていたか | 状態 |
|---|---|---|
| **入口の自己否定** | `development-mode.md:490` が「簡易は納品ゲートを通過できない」と書いていた。**`/full-auto-dev` が最初に読む文書である。** 前提（§9.4.1 に逃げ道が 1 つしかない）は既に事実でなく、4 ゲートすべてが逃げ道を持つ | **済** |
| **`4m` の停止連鎖** | review-agent の必須要素「Ch4 の全 Gherkin に traces」が 10 章版で到達不能 → 差し戻し → review が生まれない → `gate-guard` が `src/` `tests/` `infra/` を**恒久的に拒否** → Phase 5 が 1 バイトも書けない。同じ必須要素を 6 体が持っていた | **済**（`Ch6 の全 SWS に Parent（FR / NFR）` へ） |
| **architect が Phase 2 の成果物を壊す** | Procedure が `Ch3 Architecture` `Ch4 Specification` を書く指示のまま。10 章版では srs-writer が書いた Use Cases と Requirements である | **済**（Ch5/Ch6/Ch7 へ。手順番号も 0〜13 に詰めた） |
| **偽の High で GATE-DESIGN が落ちる** | `review-standards.md` の R2.16・R2.18・R2.19・R2.20・R3.5・R4.3・R5.1 が存在しない章を指し、MUST=High と裁定される。**16 行** | **済** |
| **implementer が設計を読まない** | 「Ch3 と Ch4 を読み込む」＝ Use Cases と Requirements。Ch5 Design と Ch6 Software Specification を 1 行も読まなかった | **済** |
| **`Fk` が要求の欠陥を設計へ差し戻す** | 戻し先の裁定表が `Ch3-4` のまま。規則と technical-authority の両方 | **済** |
| **`final-report` が gate-guard を素通り** | 書き先が 3 か所で食い違い、`project-management/` 経由だと `ALWAYS_ALLOWED` で GATE-TEST の守りが無効化される | **済**（ルート直下へ統一） |
| **`srs-writer` に Ch2・Ch3 を書く手順が無い** | Procedure が `Chapter 1` と `Chapter 2 (Requirements)` の 2 つだけ。**10 章版の担当は Ch1-4 なのに、System Overview と Use Cases の手順が存在しなかった** | **済**（4 章ぶんに分割） |
| **`test-designer` / `tester` が規則を全文ロードする** | 24 体中この 2 体だけ引用表を持たず、Phase 6 の全 8 手順の主担当だった | **済**（`context-census` が FAIL → PASS。24 体・削減率 93.9%） |
| **システムテストの合格基準を書く場所が無い** | Ch7 Test Strategy の表に `System` 行が無い。文法は `System` を許している | **済** |
| **`spec` file_type が未定義** | 11 手順が定義の無い file_type へ書く | **表は追加済。§9 の Form Block 節は未** |
| **`tech-decisions/` `governance/` が無い** | 全ゲート判定の記録先。`project-records/` が 16 で、計画の 18 と合っていなかった | **済** |
| **受入テストの実行手順が無い** | GATE-DELIVERY が「受入テスト合格」を要求するが、`7j` は手順書を作るだけで実行も記録も判定者も無い | **未。§8.3 参照** |

**所有権の決定（利用者判断）:** `spec-test` のオーナーを test-designer に確定し、`traceability` / `test-plan` を test-designer、`defect` / `performance-report` を tester へ移す。名簿 §2 への反映は未着手。

---

## 7. 決めたこと

| # | 件 | 決定 |
|:-:|---|---|
| 1 | 仕様書の実ファイル名 | **`01-10-spec.md`**。`02` の席番号規則（ファイル番号は最初の章の番号、範囲を名前に含める）が 10 章構成から導く |
| 2 | `framework-src/en/` | **丸ごと削除する。** 変更量が多く既存分は再使用できない |
| 3 | PoC の到達点 | **Phase 7 納品まで**（2026-08-11 に Phase 2 から拡大） |
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
| **受入テストの実行行を作業表へ新設する（最優先）** | GATE-DELIVERY の「受入テスト合格」を生む手順が無い。**`7j` の後に 2 行（利用者が実行して合否を返す／project-manager が final-report に追記）を挿し、`7k`→`7l`、`7l`→`7m` へ繰り下げる。** 手順数 96 → 97。連動先は **14 箇所**（うち `commands/full-auto-dev.md:20` と `full-auto-dev-process-rules.md:370` は生成物ではないので手で当てる）。`7k` `7l` を引く外部参照は 0 件と実測済みで、繰り下げは安全 |
| **`spec` / `spec-test` の §9 Form Block 節** | file_type 表には追加したが、Fields と Detail Block Guidance の節が未作成。§11 の「各 file_type には唯一の owner が存在する」に、`spec` は章ごとにオーナーが変わる例外である旨の但し書きが要る |
| **名簿 §2 に test-designer / tester の節を新設** | 所有権は決まった（`spec-test` は test-designer、`traceability` / `test-plan` も test-designer、`defect` / `performance-report` は tester）。反映が未着手 |
| **`spec-foundation` / `spec-architecture` の切れ目** | 正本 `00-mode-matrix.md` 自身が「旧 6 章構成の切れ目であり、`02` の部境界と切り方が違う」と認めたうえで**名簿側の判断として保留**している。10 章構成に合わせて割り直すかを決める必要がある |
| **Gherkin の所在** | `review-agent.md:48` が「`Ch4` の全 Gherkin」と書くが、**10 章版テンプレートに Gherkin は 1 件も無い**（旧 6 章版の Ch4 Specification が持っていた）。どの章が持つかを決める |
| `kotodama-kun` | 道具化の決定と実体が矛盾。名簿はエージェント前提、配布済み作業表は道具前提。モデルも `sonnet` と `haiku` で食い違う |
| エージェント名簿の目標件数 | 21 / 23 / 24 のどれか。`kotodama-kun` 廃止と en 削除の反映後に確定する |
| 設計原則カタログ 27 行 | `review-standards.md` へ移す決定だが未実施。`review-standards.md` に「設計原則の索引」も `R2.21` も 0 件 |
| `02` の重複 7 箇所 | 正本は決まったが 1 件も当てていない |
| 表 A のテンプレート行数 | Ch8 削除後の再計測待ち |
| ANMS と付録 | `02:76` が「付録を他のファイルへ混ぜてはならない（MUST NOT）」と定めるが、ANMS は 1 枚に付録を含む |
