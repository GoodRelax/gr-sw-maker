<!-- GENERATED FILE. Do not edit by hand. -->
<!-- Source: maintenance/2026-08-10/00-mode-matrix.md -->
<!-- Regenerate: node maintenance-tools/split-work-table.mjs -->

# 作業表 —— Phase 3 外部依存選定

**列の意味と `入力` に使ってよい語は `development-mode.md` が持つ。本書に再掲しない。**

**方式ごとの実施・免除は `development-mode.md` の表 M が引く。** 本書に方式の列は無い。

**このフェーズの表だけを読む。** 前のフェーズの表を読み直してはならない —— 済んだ手順の成果物は `入力` 列が場所で指している。

---

### 4.4 Phase 3 外部依存選定

**HW・AI・フレームワークのいずれかが有効なときだけ走る。** 全 7 手順が同じ条件に従う（表 M）。

| フェーズ | 作業 | 依頼元 | 担当者 | モデル | 入力 | 出力 | 依頼元へ返す | 備考 |
|---|---|---|---|---|---|---|---|---|
| `3a`<br />外部依存選定 | `1g` の評価結果を読み、<br />立っているフラグを一覧にする | main-agent | project-manager | opus | `1g` の decision | — | 該当するフラグの一覧 |  |
| `3b`<br />外部依存選定 | 要求を満たす外部依存の候補を比較し、<br />採る案を選ぶ | main-agent | architect | opus | 対象: 全文<br />`3a` のフラグ一覧 | — | 候補と比較結果<br />推す案と理由 | **外部依存の選定は重要判断であり、利用者の確認が要る**<br />（CLAUDE.md「重要判断の基準」）。<br />確認は `3f` で行う。 |
| `3c`<br />外部依存選定 | 各外部依存に求めることを requirement-spec に書く | main-agent | architect | opus | `3b` の選定結果 | hw-requirement-spec<br />ai-requirement-spec<br />framework-requirement-spec | 各 spec の場所 | 外部依存 1 つにつき 1 件である。<br />**どの file_type になるかは依存の種類で決まる。** |
| `3d`<br />外部依存選定 | 外部依存を差し替えられる Adapter 層の I/F を設計する | main-agent | architect | opus | `3c` の requirement-spec | spec-architecture | I/F の場所 | 差し替えの境界をここで引く。 |
| `3e`<br />外部依存選定 | 選定の結果と理由を decision に記録する | main-agent | project-manager | opus | `3b` の比較結果と理由 | decision | decision の場所 | 根拠は `3b` で architect が出したものを渡す。<br />記録が project-manager の本務である。 |
| `3f`<br />外部依存選定 | 選定結果をまとめ、<br />利用者へ渡す報告文を書く | main-agent | project-manager | opus | `3e` の decision | — | 報告文 | **文は下で起草させる。** |
| `3f`<br />外部依存選定 | 選定結果を利用者に示し、<br />承認を得る | **main-agent** | **利用者** | — | 報告文 | — | 承認 / 差し戻し | **[直列]** 作業の実体が利用者への報告である。 |
| `3g`<br />外部依存選定 | 選定と承認を合格条件に照らし、<br />GATE-DEPENDENCY の可否を出す | main-agent | technical-authority | opus | `3e` の decision<br />`3f` の承認 | tech-decision | 可否と理由 | 合格条件はプロセス規則 §9.4.1 が持つ。 |
