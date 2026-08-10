# History

2026-07-26 〜 2026-08-10 の検討記録。**書き換えない。**

現在も使うファイルはここに無い。`maintenance/` 直下に残してある。

| 柱 | ファイル |
|---|---|
| 開発方式 対応表 | `maintenance/2026-08-10/03-mode-matrix.md` |
| Spec テンプレート（骨格） | `maintenance/2026-08-09/03-spec-template-skeleton.md` / `-en.md` |
| Spec 解説書（規則） | `maintenance/2026-08-09/04-spec-writing-rules.md` |

## 日付ごとの中身

| フォルダ | 何の記録か |
|---|---|
| `2026-07-26` 〜 `2026-08-03` | フレームワーク全体レビューと StrictDoc の評価 |
| `2026-08-08` | `00`〜`13` が調査記録、`14-framework-update-plan.md` が v0.36 適用計画 |
| `2026-08-09` | 章番号の再計測、用語集、仕様テンプレートの分割記録、`split-check/`（1/4/15 枚の実測）、`anms-sample/`（記法の実測） |
| `2026-08-10` | `00-current-state.md`（コンテキスト消費の計測）、`01-improvement-plan.md`（段 0〜8 の改善計画）、`02-development-modes.md`（開発方式の検討経緯） |

## 注意

- 各文書の中にある `maintenance/2026-08-XX/...` というパス表記は移動前のものである。実体は本フォルダ配下にある
- `2026-08-09/00-spec-template-v036.md` は凍結。記法を直し終えた時点の記録である
- `output/strictdoc/` と `__pycache__/` は `maintenance/.gitignore` の対象で、再実行すれば作り直せる
