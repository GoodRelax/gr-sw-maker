<!-- GENERATED FILE. Do not edit by hand. -->
<!-- Source: maintenance/2026-08-10/00-mode-matrix.md -->
<!-- Regenerate: node maintenance-tools/split-work-table.mjs -->

# 作業表 —— Phase 8 運用・保守

**列の意味と `入力` に使ってよい語は `development-mode.md` が持つ。本書に再掲しない。**

**方式ごとの実施・免除は `development-mode.md` の表 M が引く。** 本書に方式の列は無い。

**このフェーズの表だけを読む。** 前のフェーズの表を読み直してはならない —— 済んだ手順の成果物は `入力` 列が場所で指している。

---

### 4.9 Phase 8 運用・保守

**運用・保守フラグが有効なときだけ走る。** 全 6 手順が同じ条件に従う（表 M）。

| フェーズ | 作業 | 依頼元 | 担当者 | モデル | 入力 | 出力 | 依頼元へ返す | 備考 |
|---|---|---|---|---|---|---|---|---|
| `8a`<br />運用・保守 | incident の受け口と連絡経路を決め、<br />体制を立ち上げる | main-agent | incident-reporter | sonnet | `7i` の runbook | — | 連絡経路と受け口の一覧<br />連絡経路 | 運用・保守フラグ。 |
| `8b`<br />運用・保守 | パッチ適用とスキャンを定期実行するよう設定する | main-agent | security-reviewer | opus | `5f` `5g` の security-scan-report | — | 実行間隔と対象<br />実行間隔 | パッチ対応時間の目標は CLAUDE.md「品質目標」が持つ。 |
| `8c`<br />運用・保守 | SLA 監視が動いているか確かめ、<br />違反を数える | main-agent | progress-monitor | sonnet | `4h` の observability-design | progress | 確認結果<br />SLA 違反の件数 | `4h` の可観測性設計が定めた閾値と突き合わせる。 |
| `8d`<br />運用・保守 | 復旧手順の訓練を計画する | main-agent | runbook-writer | sonnet | `7i` の runbook<br />`7f` のロールバック手順 | disaster-recovery-plan | 計画の場所<br />実施時期 | <br />**`disaster-recovery-plan` のオーナーは名簿では architect である。**<br />運用の文書を設計の体が持つのは不自然であり、名簿側の見直しが要る（未決）。 |
| `8e`<br />運用・保守 | incident の経緯と影響を報告書に書く | main-agent | incident-reporter | sonnet | incident の記録 | incident-report | 報告書の場所<br />影響範囲 |  |
| `8e`<br />運用・保守 | 根本原因を分析し、<br />改善案を出す | main-agent | process-improver | sonnet | `8e` の incident-report | retrospective-report | 原因と改善案 | **[直列]** **兄弟で並べて起動する**<br />（`agent-orchestration-rules.md` §4.5.1）。<br />改善案の適用は `Fe` が行う。 |
| `8f`<br />運用・保守 | 終了の条件に照らし、<br />GATE-EOL の可否を出す | main-agent | technical-authority | opus | `8e` の incident-report<br />`7g` の final-report | tech-decision | 可否と理由 | 終了する場合。<br />合格条件はプロセス規則 §9.4.1 が持つ。 |
