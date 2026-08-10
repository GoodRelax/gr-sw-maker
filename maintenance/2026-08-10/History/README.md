# History

2026-07-26 〜 2026-08-10 の検討記録。**書き換えない。**

現在も使うファイルはここに無い。1 つ上の `maintenance/2026-08-10/` に 6 つある。索引は同フォルダの `README.md`。

| 柱 | ファイル |
|---|---|
| 適用作業書 | `03-work-order.md` |
| 開発方式 対応表 | `00-mode-matrix.md` |
| 仕様書テンプレート | `01-spec-template.md` / `01-spec-template-en.md` |
| 仕様書の解説書 | `02-spec-writing-rules.md` |
| 用語集の適用状態 | `04-glossary-state.md` |
| 未決事項 | `05-open-questions.md` |

## 日付ごとの中身

| フォルダ | 何の記録か |
|---|---|
| `2026-07-26` 〜 `2026-08-03` | フレームワーク全体レビューと StrictDoc の評価 |
| `2026-08-08` | `00`〜`13` が調査記録、`14-framework-update-plan.md` が v0.36 適用計画 |
| `2026-08-09` | 章番号の再計測、用語集、仕様テンプレートの分割記録、`split-check/`（1/4/15 枚の実測）、`anms-sample/`（記法の実測） |
| `2026-08-10` | `00-current-state.md`（コンテキスト消費の計測）、`01-improvement-plan.md`（段 0〜8 の改善計画）、`02-development-modes.md`（開発方式の検討経緯）、`03-decision-record.md`（Chapter 8 削除・重複 7 箇所・用語・採番の検討経緯）、`04-table-redesign.md`（表の作り方の原則と、表 C・表 D-1 を組み直した経緯）、`05-process-agent-matrix.md`（17 プロセスの担当をどこから決めたかの記録）、`06-glossary-1a-record.md`（用語集 手順 1a の経緯）、`07-work-table-draft.md`（作業表を組み立てた記録） |

## 注意

- 各文書の中にある `maintenance/2026-08-XX/...` というパス表記は移動前のものである。実体は本フォルダ配下にある
- `2026-08-09/00-spec-template-v036.md` は凍結。記法を直し終えた時点の記録である
- `maintenance/temporary/`（2026-07-26 のフレームワーク全体レビュー 14 ファイル・504K）は 2026-08-10 に削除した。git 追跡外だったため復元できない
- `output/strictdoc/` と `__pycache__/` は `maintenance/.gitignore` の対象で、再実行すれば作り直せる
