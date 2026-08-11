<!-- GENERATED FILE. Do not edit by hand. -->
<!-- Source: maintenance/2026-08-10/00-mode-matrix.md -->
<!-- Regenerate: node maintenance-tools/split-work-table.mjs -->

# 作業表 —— Phase 4 設計

**列の意味と `入力` に使ってよい語は `development-mode.md` が持つ。本書に再掲しない。**

**方式ごとの実施・免除は `development-mode.md` の表 M が引く。** 本書に方式の列は無い。

**このフェーズの表だけを読む。** 前のフェーズの表を読み直してはならない —— 済んだ手順の成果物は `入力` 列が場所で指している。

---

### 4.5 Phase 4 設計

| フェーズ | 作業 | 依頼元 | 担当者 | モデル | 入力 | 出力 | 依頼元へ返す | 備考 |
|---|---|---|---|---|---|---|---|---|
| `4a`<br />設計 | 要求を満たすアーキテクチャを検討し、<br />設計の章に書いてレイヤーを仕訳ける | main-agent | architect | opus | 対象: 全文 | spec-architecture | 仕様書の場所<br />書いたレイヤー仕訳 | **設計はトレースの鎖に載らない**（`02`「5.1〜5.6 は持たない」）。<br />`5.6` の `ADR` だけが UID を持ち、それも鎖の外である。<br />**親を張ってはならない（MUST NOT）。** |
| `4b`<br />設計 | アーキテクチャ案の要点をまとめる | main-agent | architect | opus | `4a` の spec-architecture | — | 案の要点 | **文は下で起草させる。** |
| `4b`<br />設計 | 案を利用者に示し、<br />確認するかどうかを尋ねる | **main-agent** | **利用者** | — | 案の要点 | — | 確認する / しない | **[直列]** **旧版は architect をこの手順の主担当としていた。**<br />作業の実体が利用者への問いなので、`main-agent` の行へ移した。<br />**尋ねずに進んではならない。** |
| `4c`<br />設計 | 設計を実装できる粒度まで具体化し、<br />ソフトウェア仕様の章に書く | main-agent | architect | opus | 対象: 全文 | spec<br />**traceability** | 仕様書の場所 | **`SWS` の親は `FR` または `NFR` である**（`02` の型ごとの欄、Role は `Satisfies`）。<br />設計の章を親にしてはならない（MUST NOT）。<br />**ユーザーマニュアルの根拠になる**（§3.3）。 |
| `4d`<br />設計 | 何をどの層で確かめるかを決め、<br />テスト戦略の章に書く | main-agent | architect | opus | 対象: 全文 | spec | 戦略の場所 |  |
| `4d`<br />設計 | テスト戦略が実行できるか確かめる | main-agent | test-designer | opus | 対象: テスト<br />根拠: `4d` の戦略 | — | 可否と理由 | **[直列]** **兄弟で並べて起動する**<br />（`07` §4.5.1）。<br />戦略を書くのは architect、確かめるのは test-designer である。 |
| `4e`<br />設計 | ソフトウェア仕様から OpenAPI を生成する | main-agent | architect | opus | 対象: 全文 | openapi | openapi の場所 | API を持つ場合。 |
| `4f`<br />設計<br />**新設** | API のバージョニング戦略と非推奨通知ポリシーを決め、<br />ADR に書く | main-agent | architect | opus | `4e` の openapi | spec-architecture | `ADR` の UID | 第三者に公開する API を持つ場合。<br />**`4e` は生成するだけで、戦略を持たない。** |
| `4g`<br />設計 | 入力経路から脅威を洗い出し、<br />防ぐ設計を書く | main-agent | security-reviewer | opus | 対象: 全文<br />根拠: `4a` の spec-architecture | threat-model<br />security-architecture | 脅威の一覧<br />設計の場所 | 外部からの入力経路がある場合。<br />**§3 のとおり全文を読む。脅威は要求を横断する。** |
| `4h`<br />設計 | 何を観測すれば異常が分かるかを決め、<br />可観測性設計を書く | main-agent | architect | opus | 対象: 全文 | observability-design | 設計の場所 | 常駐サービスかローカル実行かで中身が変わる<br />（CLAUDE.md「可観測性要求」）。 |
| `4i`<br />設計 | どこへどう配るかを決め、<br />デプロイ設計を書く | main-agent | architect | opus | 対象: 全文 | deployment-design | 設計の場所 | 配布以外のデプロイ先がある場合。<br />**免除したときは、免除の記録をもって GATE-DELIVERY を充足とする**<br />（プロセス規則 §9.4.1）。 |
| `4j`<br />設計 | 実装を担当者に割り、<br />WBS とガントチャートを書く | main-agent | progress-monitor | sonnet | `4a` の spec-architecture<br />`1f` の stakeholder-register | wbs | wbs の場所 | 並列実装が要求する。<br />worktree の割当は `5a` が持つ。 |
| `4k`<br />設計 | リスクを洗い出してスコアを付け、<br />台帳に書く | main-agent | risk-manager | sonnet | 対象: 全文<br />`4a` の spec-architecture | risk<br />risk-register | 台帳の場所<br />スコア 6 以上の件数 | **スコア 6 以上は利用者に通知する**<br />（CLAUDE.md「重要判断の基準」）。<br />通知するのは `main-agent` である。 |
| `4l`<br />設計 | 危害を洗い出し、<br />安全分析（HARA / FMEA / FTA）を行う | main-agent | security-reviewer | opus | 対象: 全文<br />`4g` の threat-model | safety | 分析結果の場所 | 機能安全フラグ。<br />Critical では必須である。 |
| `4m`<br />設計 | 設計を R2・R4・R5・R7 に照らし、<br />指摘を挙げる | main-agent | review-agent | opus | 対象: 設計<br />根拠: 要求 | review | 指摘の場所と件数<br />Critical / High の有無 | **[簡易・標準]** 1 エージェントが 4 観点をまとめて見る。<br />指摘への回答は分類を付けて 1 通で送る<br />（`07` §4.3）。 |
| `4m`<br />設計 | 設計を担当する 1 観点に照らし、<br />指摘を挙げる | main-agent | `review-agent` × 4<br />R2 / R4 / R5 / R7 を 1 エージェントずつ | opus | 対象: 設計<br />根拠: 要求 | review | 各自の指摘の場所と件数 | **[厳格]** 1 観点 = 1 エージェント。R をまたがない。<br />**再委託しない。統合は `4n` が行う**<br />（`07` §4.5.2）。<br />4 エージェントとも同じ根拠を読む。 |
| `4n`<br />設計 | 指摘を統合し、<br />合格条件に照らして GATE-DESIGN の可否を出す | main-agent | technical-authority | opus | `4m` の review<br />`4b` の decision | tech-decision | 可否と理由<br />統合済みの指摘 | **厳格では観点別の重複をここで除く**<br />（`07` §4.5.2）。<br />統合に新しいエージェントも新しい階層も要らない。 |

**旧 `3d`（設計原則 準拠確認の章を設定する）は削除した。** Chapter 8 の削除に伴う。**読み替えは `03-work-order.md` §6.4 が持つ。**

**手順数は 14 のまま動かない。** 削除で 1 減り、`4f` の新設で 1 増える。
