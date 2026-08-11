<!-- GENERATED FILE. Do not edit by hand. -->
<!-- Source: maintenance/2026-08-10/00-mode-matrix.md -->
<!-- Regenerate: node tools/split-work-table.mjs -->

# 作業表 —— 並行して回るもの

**列の意味と `入力` に使ってよい語は `development-mode.md` が持つ。本書に再掲しない。**

**方式ごとの実施・免除は `development-mode.md` の表 M が引く。** 本書に方式の列は無い。

**このフェーズの表だけを読む。** 前のフェーズの表を読み直してはならない —— 済んだ手順の成果物は `入力` 列が場所で指している。

---

## 5. 作業表 —— 並行して回るもの

**フェーズに属さないので、`フェーズ` 列には目的の代わりに発火の契機を書く。**

### 5.1 フェーズ完了時（共通手順）

**走行フェーズごとに 1 回。**

| フェーズ | 作業 | 依頼元 | 担当者 | モデル | 入力 | 出力 | 依頼元へ返す | 備考 |
|---|---|---|---|---|---|---|---|---|
| `Fa`<br />フェーズ完了時 | トークン消費とコストを数え、<br />予算と突き合わせる | main-agent | progress-monitor | sonnet | `progress-log`（フックの記録）<br />Agent の返り値 | progress | 累計と予算比 | **計測が本務である。**<br />予算とアラート閾値は CLAUDE.md「品質目標」が持つ。<br />閾値に達したら `main-agent` が利用者へ通知する。<br />**トークンはフックでは取れないので、`main-agent` が Agent の返り値を渡す**<br />（`06` §3.1・§3.2）。 |
| `Fb`<br />フェーズ完了時 | 続きから再開できる引継ぎを書く | main-agent | project-manager | opus | pipeline-state<br />当該フェーズの成果物の場所 | handoff | 引継ぎ文の場所 | 文脈の圧縮が起きたときに書く。<br />発火を判断するのは `main-agent` である<br />（自分の文脈の話であるため）。<br />**引継ぎ閾値と比べる値は現在生まれていない**<br />（`06` §1.2）。 |
| `Fc`<br />フェーズ完了時 | pipeline-state と executive-dashboard を更新し、<br />報告文を書く | main-agent | project-manager | opus | 当該フェーズのゲート判定結果<br />`progress-log`（フックの記録） | pipeline-state<br />executive-dashboard | 報告文<br />次のフェーズ | **統合が本務である。**<br />簡易は pipeline-state のみ。<br />**手順ごとに起動してはならない。フェーズ境界にまとめる**<br />（`07` §4.5.3）。 |
| `Fc`<br />フェーズ完了時 | フェーズの完了を利用者に報告する | **main-agent** | **利用者** | — | 報告文 | — | 受領 / 差し戻し | **[直列]** **報告するのは `main-agent` である。** |
| `Fd`<br />フェーズ完了時 | defect とゲートの結果からふりかえり、<br />改善案を出す | main-agent | process-improver | sonnet | 当該フェーズの defect<br />ゲート判定結果 | retrospective-report | 報告の場所<br />改善案 | 各フェーズ完了時に行う。<br />改善案の適用は `Fe` が受ける。 |
| `Fe`<br />フェーズ完了時 | 承認済みの改善策をガバナンスファイルへ適用する | main-agent | decree-writer | sonnet | `Fd` の改善案<br />利用者の承認 | governance-change-log | before/after diff | `Fd` に従属する。<br />**承認するのは利用者である**<br />（`main-agent` 経由）。 |

> **旧 `Fa`（当該フェーズの全 Out の用語・命名をチェックする）は削除した。エージェントを起動しない。** `tools/kotodama-kun.mjs` が `Write` / `Edit` の前に走り、**書いたエージェントにその場で差し戻る**（`07` §4.6）。`main-agent` には何も届かない。**読み替えは `03-work-order.md` §6.4 が持つ。**

> **開始・終了の記録にも手順を立てない。エージェントを起動しない。** `tools/progress-log.mjs` がフックとして走り、**手順記号・担当者・時刻を `progress-log` へ 1 行追記する**（`07` §4.5.3）。`Fa` と `Fc` はその記録を読む。**手順ごとに progress-monitor や project-manager を起動してはならない（MUST NOT）** —— 起動には下限（27k〜35k）があり、小さい報告を頻繁に出すのが最も高くつく。**`progress-log.json` は file_type ではない生成物である**（`cost-log.json` と同じ扱い。`03-work-order.md` §16 の作業 9）。

### 5.2 随時（条件で発火する）

| フェーズ | 作業 | 依頼元 | 担当者 | モデル | 入力 | 出力 | 依頼元へ返す | 備考 |
|---|---|---|---|---|---|---|---|---|
| `Ff`<br />随時 | 変更要求の影響を分析し、<br />change-request に記録する | main-agent | change-manager | sonnet | 利用者の変更要求<br />対象: 全文 | change-request | 影響度<br />change-request の場所 | 仕様書承認後に利用者から出たとき。 |
| `Ff`<br />随時 | 影響度 high の変更を利用者に示し、<br />承認を得る | **main-agent** | **利用者** | — | change-request | — | 承認 / 却下 | **[直列]** **影響度 high は利用者の承認が要る**<br />（CLAUDE.md「重要判断の基準」）。 |
| `Fg`<br />随時<br />**新設** | defect 票を起こし、<br />状態を進める | main-agent | tester | sonnet | 発見したエージェントからの報告 | defect | 起票数<br />未解決の件数 | 発見したエージェントが発見のその場で起票する<br />（即時起票ルール）。<br />**状態を進めるのは tester である。** |
| `Fg`<br />随時<br />**新設** | defect を修正する | main-agent | implementer | opus | `Fg` の defect | src | 修正の場所 | **[直列]** **兄弟で並べて起動する**<br />（`07` §4.5.1）。 |
| `Fg`<br />随時<br />**新設** | CR に当たる defect を change-request へ振り分ける | main-agent | change-manager | sonnet | `Fg` の defect | change-request | 振り分けの結果 | **[直列]** 同上。 |
| `Fh`<br />随時<br />**新設** | 文書の版を上げ、<br />廃止文書を `old/` へ移す | main-agent | **各 file_type のオーナー** | 各体の既定 | 当該 file_type の現物 | 全 file_type | 新しい版の場所 | **単一の担当者を置かない唯一の行である。**<br />オーナーの対応は `agent-list.md` §2 が持つ。 |
| `Fh`<br />随時<br />**新設** | 新旧の版の差分を確かめる | main-agent | review-agent | opus | 新旧の版 | — | 差分の可否 | **[直列]** **兄弟で並べて起動する**<br />（`07` §4.5.1）。 |
| `Fi`<br />随時<br />**新設** | 指摘に分類を付けて 1 通で回答する | main-agent | **指摘を受けた成果物のオーナー** | 各体の既定 | レビューの review<br />対象: 全文 | review | 回答の場所<br />争う件の数 | `07` §4.3 が定める往復。<br />**分類は争う / 直した / 保留。争う件を先頭に置く。**<br />**1 件ずつ送ってはならない（MUST NOT）。** |
| `Fi`<br />随時<br />**新設** | 回答を読み、指摘の可否を再判定する | main-agent | review-agent | opus | `Fi` の回答<br />対象: 全文 | review | 再判定の結果<br />決着しない争点 | **[直列]** `07` §4.1 の再開で回す。<br />**表 E-1 の「再レビュー」がこの行である。** |
| `Fj`<br />随時<br />**新設** | 即時に上げる事象の報告文を書く | main-agent | project-manager | opus | risk-register<br />progress<br />ゲートの判定結果 | — | 報告文 | `07` §4.5.3 が「即時。`main` が利用者へ上げる」と定める 3 事象。<br />**`main-agent` に起草させない**（`07` §4.7 の規約 5）。 |
| `Fj`<br />随時<br />**新設** | 事象を利用者に示し、判断を得る | **main-agent** | **利用者** | — | 報告文 | — | 利用者の判断 | **[直列]** リスク score≧6 ／ コスト閾値の到達 ／ ゲート FAIL のエスカレーション。 |
| `Fk`<br />随時<br />**新設** | FAIL したゲートの戻り先を決め、<br />該当フェーズへ差し戻す | main-agent | technical-authority | opus | ゲートの判定結果<br />統合済みの指摘<br />これまでの再試行回数（`tech-decision`） | tech-decision | 戻り先の手順記号<br />**通算の再試行回数** | **これが無いと、Critical が 1 件出た時点で走行が終端する。**<br />再試行の上限は表 E-2（簡易・標準は 3 回目、厳格は 2 回目）。<br />上限に達したら `Fj` へ渡す。 |

---
