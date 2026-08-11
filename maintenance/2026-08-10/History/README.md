# History

2026-07-26 〜 2026-08-11 の検討記録。**書き換えない。**

**2026-08-11 に PoC 準備のための棚卸しを行い、5 つを本フォルダへ退避した。** 生きている作業セットは 1 つ上の `maintenance/2026-08-10/` に 5 つある。索引は同フォルダの `README.md`。

| 柱 | ファイル | 場所 |
|---|---|---|
| PoC の準備手順と計画 | `08-poc-plan.md` | **1 つ上**（`03-work-order.md` の後継） |
| 開発方式 対応表 | `00-mode-matrix.md` | **1 つ上**（配布物 11 枚の生成元。移動禁止） |
| 仕様書テンプレート | `01-spec-template.md` | **1 つ上**（配布待ち） |
| 仕様書の解説書 | `02-spec-writing-rules.md` | **1 つ上**（配布待ち） |
| エージェント連携の規則 | `07-agent-orchestration-rules.md` | **1 つ上**（配布待ち） |
| 適用作業書 | `03-work-order.md` | `2026-08-11/`（役目を終えた） |
| 用語集の適用状態 | `04-glossary-state.md` | `2026-08-11/`（未適用 9 件は `08` §8.1） |
| 未決事項 | `05-open-questions.md` | `2026-08-11/`（生きている分は `08` §8.2・§8.3） |
| エージェント連携の根拠 | `06-agent-connection-report.md` | `2026-08-11/`。**実測値の正本として今も引かれる。配布はしない** |

**`01-spec-template-en.md` は `to-del/` にある。** `framework-src/en/` の削除で適用先が消えたためである。

## 日付ごとの中身

| フォルダ | 何の記録か |
|---|---|
| `2026-07-26` 〜 `2026-08-03` | フレームワーク全体レビューと StrictDoc の評価 |
| `2026-08-08` | `00`〜`13` が調査記録、`14-framework-update-plan.md` が v0.36 適用計画 |
| `2026-08-09` | 章番号の再計測、用語集、仕様テンプレートの分割記録、`split-check/`（1/4/15 枚の実測）、`anms-sample/`（記法の実測） |
| `2026-08-10` | `00-current-state.md`（コンテキスト消費の計測）、`01-improvement-plan.md`（段 0〜8 の改善計画）、`02-development-modes.md`（開発方式の検討経緯）、`03-decision-record.md`（Chapter 8 削除・重複 7 箇所・用語・採番の検討経緯）、`04-table-redesign.md`（表の作り方の原則と、表 C・表 D-1 を組み直した経緯）、`05-process-agent-matrix.md`（17 プロセスの担当をどこから決めたかの記録）、`06-glossary-1a-record.md`（用語集 手順 1a の経緯）、`07-work-table-draft.md`（作業表を組み立てた記録）、**`08-agent-role-redesign.md`（役割分担と採番の再設計で採らなかった案）** |
| `2026-08-11` | `00-tools-placement-record.md`（道具の置き場を `tools/` と `maintenance-tools/` に割った経緯）／**PoC 準備のために退避した 5 つ** —— `03-work-order.md`（適用作業書。後継は `08-poc-plan.md`）、`04-glossary-state.md`（用語集の適用状態。未適用 9 件は `08` §8.1 へ）、`05-open-questions.md`（未決事項。生きている分は `08` §8.2・§8.3 へ）、`06-agent-connection-report.md`（エージェント連携の根拠。実測値の正本として今も引かれる）、`census-before.txt`（段 0 の基準線。22 エージェント時点の凍結記録） |

## 注意

- 各文書の中にある `maintenance/2026-08-XX/...` というパス表記は移動前のものである。実体は本フォルダ配下にある
- `2026-08-09/00-spec-template-v036.md` は凍結。記法を直し終えた時点の記録である
- `maintenance/temporary/`（2026-07-26 のフレームワーク全体レビュー 14 ファイル・504K）は 2026-08-10 に削除した。git 追跡外だったため復元できない
- `output/strictdoc/` と `__pycache__/` は `maintenance/.gitignore` の対象で、再実行すれば作り直せる
