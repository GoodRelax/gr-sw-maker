<!-- GENERATED FILE. Do not edit by hand. -->
<!-- Source: maintenance/2026-08-10/00-mode-matrix.md -->
<!-- Regenerate: node maintenance-tools/split-work-table.mjs -->

# 作業表 —— Phase 5 実装

**列の意味と `入力` に使ってよい語は `development-mode.md` が持つ。本書に再掲しない。**

**方式ごとの実施・免除は `development-mode.md` の表 M が引く。** 本書に方式の列は無い。

**このフェーズの表だけを読む。** 前のフェーズの表を読み直してはならない —— 済んだ手順の成果物は `入力` 列が場所で指している。

---

### 4.6 Phase 5 実装

| フェーズ | 作業 | 依頼元 | 担当者 | モデル | 入力 | 出力 | 依頼元へ返す | 備考 |
|---|---|---|---|---|---|---|---|---|
| `5a`<br />実装 | 仕様どおりに動くコードを書く | main-agent | implementer | opus | 対象: 全文<br />`4a` の spec-architecture | src | 実装の場所<br />未実装の残り<br />依存関係の一覧 | **[簡易・標準]** 単線で実装する。 |
| `5a`<br />実装 | worktree とブランチを担当者ごとに割り当てる | main-agent | project-manager | opus | `4j` の wbs | — | 割当表 | **[厳格]** 割当が本務である。<br />**project-manager が implementer を呼んではならない**<br />（`agent-orchestration-rules.md` §3.7・§4.5.1）。 |
| `5a`<br />実装 | 割り当てられたブランチで、<br />仕様どおりに動くコードを書く | main-agent | `implementer` × N<br />worktree 1 つにつき 1 エージェント | opus | 対象: 全文<br />割当表 | src | 各自の実装の場所 | **[厳格]** Git worktree で並列実装する。<br />**worktree ごとにキャッシュが冷える**（`agent-orchestration-rules.md` §4.4）。N エージェントぶんの下限を毎回払う。 |
| `5b`<br />実装 | 可観測性設計に従い、<br />構造化ログ・メトリクス・トレーシングを組み込む | main-agent | implementer | opus | `4h` の observability-design | src | 組み込みの完了 | 適用範囲は CLAUDE.md「可観測性要求」が持つ。 |
| `5c`<br />実装 | 全ビジネスロジックを覆う単体テストを書いて走らせる | main-agent | implementer | opus | 対象: 全文<br />`5a` の src | src | 合格率<br />カバレッジ | **作成と実行を同じエージェントが行う唯一のテストである。**<br />**単体テストを仕様書に書いてはならない（MUST NOT）**（2026-08-12 決定）。**成果物は `src`（`tests/` 配下）だけであり、`TC` / `TR` ノードを起こさない。**<br />**理由:** 単体テストは実装の内部構造に張り付いており、件数が最も多い。仕様書に載せると Ch9 が実装の写しになって重くなり、**仕様書が読まれなくなる。**<br />**合否とカバレッジは `依頼元へ返す` で返し、閾値は CLAUDE.md「品質目標」が持つ。** 仕様書を経由しない。<br />**Ch9 を書くのは `6a`〜`6d` だけである。** これで節の衝突も起きない。 |
| `5c`<br />実装 | 単体テストで確かめるべき観点を洗い出して渡す | main-agent | test-designer | opus | 対象: テスト | — | 観点の一覧 | **[直列]** **兄弟で並べて起動する**<br />（`agent-orchestration-rules.md` §4.5.1）。 |
| `5d`<br />実装 | デプロイ設計に従い、<br />IaC コードを書く | main-agent | implementer | opus | `4i` の deployment-design | src | 実装の場所 | 配布以外のデプロイ先がある場合。 |
| `5e`<br />実装 | 実装を R2・R3・R4・R5・R7 に照らし、<br />指摘を挙げる | main-agent | review-agent | opus | 対象: 全文<br />`5a` の src | review | 指摘の場所と件数<br />Critical / High の有無 | **[簡易・標準]** 1 エージェントが 5 観点をまとめて見る。<br />**レビュアーは直さない**<br />（`agent-orchestration-rules.md` §4.7 の規約 3）。 |
| `5e`<br />実装 | 実装を担当する 1 観点に照らし、<br />指摘を挙げる | main-agent | `review-agent` × 5<br />R2 / R3 / R4 / R5 / R7 を 1 エージェントずつ | opus | 対象: 全文<br />`5a` の src | review | 各自の指摘の場所と件数 | **[厳格]** 1 観点 = 1 エージェント。R をまたがない。<br />**再委託しない。統合は `5i` が行う**<br />（`agent-orchestration-rules.md` §4.5.2）。<br />同時実行の上限 20 に対して余裕がある。 |
| `5f`<br />実装 | 依存関係に SCA を走らせ、<br />脆弱性を洗い出す | main-agent | security-reviewer | opus | `5a` の依存関係の一覧 | security-scan-report | 報告の場所と件数 | **本手順は SCA だけである。SAST は `5g` が持つ。**<br />依存が 0 件なら該当なしと記録する。 |
| `5f`<br />実装 | 依存のライセンス面から帰属表示の要否を判定する | main-agent | license-checker | haiku | `5a` の依存関係の一覧 | — | 帰属表示の要否 | **[同時]** **兄弟で並べて起動する**<br />（`agent-orchestration-rules.md` §4.5.1）。 |
| `5g`<br />実装<br />**新設** | ソースに SAST を走らせ、<br />脆弱性を洗い出す | main-agent | security-reviewer | opus | `5a` の src | security-scan-report | 報告の場所と件数 | 簡易は外部入力を扱う場合のみ。<br />**旧 §3.2.8 を SCA と 2 件に割って生まれた**<br />。<br />走らせる時期も対象も SCA と違う。 |
| `5h`<br />実装 | 依存のライセンス互換性を確認し、<br />帰属表示をそろえる | main-agent | license-checker | haiku | 依存関係の一覧<br />`5f` の帰属表示の要否 | license-report | 報告の場所<br />非互換の件数 | 依存ライブラリを追加したら必ず走らせる。<br />**依存が 0 件、または依存定義ファイルが無い場合は、該当なしとして license-report を残す**（`5f` と同じ形）。**GATE-IMPL が license-report の存在を無条件に要求するため、書かずに飛ばしてはならない（MUST NOT）。** |
| `5i`<br />実装 | 指摘とスキャン結果を統合し、<br />合格条件に照らして GATE-IMPL の可否を出す | main-agent | technical-authority | opus | `5e` の review<br />`5f` `5g` の security-scan-report<br />`5h` の license-report<br />**`5c` の合格率とカバレッジ** | tech-decision | 可否と理由<br />統合済みの指摘 | 合格条件はプロセス規則 §9.4.1 が持つ。<br />**厳格では 5 エージェントの指摘をここで統合する**<br />（`agent-orchestration-rules.md` §4.5.2）。<br />**単体テストの合格率とカバレッジを tech-decision に転記する。** 単体テストは仕様書に載らないので（`5c`）、**ここが唯一の記録点であり、`6l` の GATE-TEST がこれを読む。** |

**手順数が 8 → 9 になる。** `5g` の新設で 1 増える。
