<!-- GENERATED FILE. Do not edit by hand. -->
<!-- Source: maintenance/2026-08-10/00-mode-matrix.md -->
<!-- Regenerate: node maintenance-tools/split-work-table.mjs -->

# 作業表 —— Phase 6 テスト

**列の意味と `入力` に使ってよい語は `development-mode.md` が持つ。本書に再掲しない。**

**方式ごとの実施・免除は `development-mode.md` の表 M が引く。** 本書に方式の列は無い。

**このフェーズの表だけを読む。** 前のフェーズの表を読み直してはならない —— 済んだ手順の成果物は `入力` 列が場所で指している。

---

### 4.7 Phase 6 テスト

| フェーズ | 作業 | 依頼元 | 担当者 | モデル | 入力 | 出力 | 依頼元へ返す | 備考 |
|---|---|---|---|---|---|---|---|---|
| `6a`<br />テスト<br />**分割** | 結合テストの受入基準を決め、<br />テストコードを書く | main-agent | test-designer | opus | 対象: テスト<br />根拠: 対象ノードの祖先 | spec<br />**traceability** | ケースの章の場所<br />付けた `TC` の UID 範囲 | **旧 `5a` の前半である。**<br />**`traceability` のオーナーは test-engineer である**（名簿 §2）。<br />複数の体が追記する性質なので、名簿側で共同所有を定義するまで暫定である。 |
| `6a`<br />テスト<br />**分割** | 設計の意図を渡す | main-agent | architect | opus | `4a` の spec-architecture | — | 意図の要点 | **[直列]** **兄弟で並べて起動する**<br />（`07` §4.5.1）。 |
| `6b`<br />テスト<br />**分割** | 結合テストを走らせ、<br />結果を記録する | main-agent | tester | sonnet | 対象: 自分が書く結果の節<br />根拠: 対象ノードの祖先 | spec | 合格率<br />失敗した `TC` の UID | **旧 `5a` の後半である。**<br />**書いたエージェントと走らせるエージェントを分ける。** 期待を書いた者が結果も書くと、食い違いを見落とす。<br />defect は発見したエージェントが起票する<br />（`Fg`）。 |
| `6c`<br />テスト<br />**分割** | システムテストの受入基準を決め、<br />テストコードを書く | main-agent | test-designer | opus | 対象: テスト<br />根拠: 対象ノードの祖先 | spec | ケースの章の場所<br />付けた `TC` の UID 範囲 | **旧 `5b` の前半である。** |
| `6d`<br />テスト<br />**分割** | システムテストを走らせ、<br />結果を記録する | main-agent | tester | sonnet | 対象: 自分が書く結果の節<br />根拠: 対象ノードの祖先 | spec | 合格率<br />失敗した `TC` の UID | **旧 `5b` の後半である。** |
| `6e`<br />テスト<br />**新設** | ユースケーステストの受入基準を決め、<br />テストコードを書く | main-agent | test-designer | opus | 対象: テスト<br />根拠: 対象ノードの祖先 | spec<br />**traceability** | ケースの章の場所<br />付けた `TC` の UID 範囲 | **仕様書のテストは 3 系統（`UC` / `SWS` / `NFR`）である。**<br />`UC` 系統のケースを作る行が無かった。 |
| `6f`<br />テスト<br />**新設** | ユースケーステストを走らせ、<br />結果を記録する | main-agent | tester | sonnet | 対象: 自分が書く結果の節<br />根拠: 対象ノードの祖先 | spec | 合格率<br />失敗した `TC` の UID | **[直列]** `6e` の後に走る。<br />`UC` 系統の実行者が居なかった。 |
| `6g`<br />テスト<br />**新設** | 非機能テストの受入基準を決め、<br />テストコードを書く | main-agent | test-designer | opus | 対象: テスト<br />根拠: 数値目標を持つ NFR | spec<br />**traceability** | ケースの章の場所<br />付けた `TC` の UID 範囲 | **`6h` は実行だけで、ケースを作る行が無かった。**<br />数値目標を持つ NFR がある場合。 |
| `6h`<br />テスト | 性能テストを走らせ、<br />NFR の数値目標との差を出す | main-agent | tester | sonnet | 対象: 自分が書く結果の節<br />根拠: 数値目標を持つ NFR | performance-report<br />spec | 達成 / 未達の別<br />未達の項目 | 数値目標を持つ NFR がある場合。 |
| `6i`<br />テスト | 実機でテストを行い、<br />フィードバックを記録する | main-agent | field-test-engineer | sonnet | `6b` `6d` の結果<br />利用者の操作 | field-issue | 記録の場所<br />挙がった件数 | 実機テストフラグ。<br />**利用者と実機でやり取りする部分は `main-agent` を通す。** |
| `6i`<br />テスト | フィードバックを仕様書に照らし、<br />defect / CR / 質問に分類する | main-agent | feedback-classifier | sonnet | 対象: 全文<br />`6i` の field-issue | field-issue | 分類の内訳 | **[直列]** **兄弟で並べて起動する。field-test-engineer が呼んではならない**<br />（`07` §4.5.1）。 |
| `6i`<br />テスト | 原因を分析し、<br />対策を立てる | main-agent | field-issue-analyst | opus | `6i` の field-issue と分類 | field-issue | 原因と対策案<br />影響範囲 | **[直列]** 同上。 |
| `6j`<br />テスト | テスト消化曲線と defect curve を更新する | main-agent | progress-monitor | sonnet | `6b` `6d` の結果<br />defect の一覧 | progress | 曲線の場所<br />収束の傾向 | 1 週間未満の走行では点が足りない。 |
| `6k`<br />テスト | テストコードを R6 に照らし、<br />指摘を挙げる | main-agent | review-agent | opus | 対象: テスト<br />根拠: 対象ノードの祖先 | review | 指摘の場所と件数<br />Critical / High の有無 | **R6 は 1 観点なので、厳格でも 1 エージェントである**<br />（割る先が無い）。 |
| `6l`<br />テスト | テスト結果と指摘を合格条件に照らし、<br />GATE-TEST の可否を出す | main-agent | technical-authority | opus | `6k` の review<br />`6b` `6d` `6f` `6h` の結果 | tech-decision | 可否と理由<br />統合済みの指摘 | 合格条件はプロセス規則 §9.4.1 が持つ。 |

**手順数が 7 → 12 になる。** 分割で 2、UC テストのケースと実行および非機能テストのケースの新設で 3 増える。
