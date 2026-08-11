<!-- GENERATED FILE. Do not edit by hand. -->
<!-- Source: maintenance/2026-08-10/00-mode-matrix.md -->
<!-- Regenerate: node tools/split-work-table.mjs -->

# 作業表 —— Phase 7 納品

**列の意味と `入力` に使ってよい語は `development-mode.md` が持つ。本書に再掲しない。**

**方式ごとの実施・免除は `development-mode.md` の表 M が引く。** 本書に方式の列は無い。

**このフェーズの表だけを読む。** 前のフェーズの表を読み直してはならない —— 済んだ手順の成果物は `入力` 列が場所で指している。

---

### 4.8 Phase 7 納品

| フェーズ | 作業 | 依頼元 | 担当者 | モデル | 入力 | 出力 | 依頼元へ返す | 備考 |
|---|---|---|---|---|---|---|---|---|
| `7a`<br />納品 | 全成果物を R1〜R7 に照らし、<br />指摘を挙げる | main-agent | review-agent | opus | 対象: 全文<br />全成果物 | review | 指摘の場所と件数<br />Critical / High の有無 | **[簡易・標準]** 1 エージェントが 7 観点をまとめて見る。<br />**簡易はここで R1〜R7 を網羅する**<br />（表 E-1）。 |
| `7a`<br />納品 | 全成果物を担当する 1 観点に照らし、<br />指摘を挙げる | main-agent | `review-agent` × 7<br />R1〜R7 を 1 エージェントずつ | opus | 対象: 全文<br />全成果物 | review | 各自の指摘の場所と件数 | **[厳格]** 1 観点 = 1 エージェント。R をまたがない。<br />**7 観点が 4 分野に収まらない問題が消える。**<br />**再委託しない。統合は `7k` が行う**<br />（`07` §4.5.2）。<br />エージェントの下限は 27k〜35k なので、下限だけで 7 倍になる。**これが厳格の値段である。** |
| `7b`<br />納品<br />**新設** | 全ゲートの結果を集め、<br />リリース判定チェックリストを埋める | main-agent | project-manager | opus | 全ゲートの判定結果<br />`7a` の review | release-checklist | チェックリストの場所<br />未充足の項目 | 複数バージョンを並行保守するとき<br />（標準）。 |
| `7b`<br />納品<br />**新設** | チェックリストに照らし、<br />リリースの可否を出す | main-agent | technical-authority | opus | release-checklist | tech-decision | 可否と理由 | **[直列]** **兄弟で並べて起動する**<br />（`07` §4.5.1）。 |
| `7c`<br />納品 | デプロイ設計に従い、<br />コンテナをビルドする | main-agent | implementer | opus | `4i` の deployment-design<br />`5a` の src | container-image | 成果物の場所<br />タグ | 配布以外のデプロイ先がある場合。<br />`7c`〜`7f` は同じ条件に従う。 |
| `7d`<br />納品 | ビルドしたコンテナをデプロイする | main-agent | implementer | opus | `7c` の container-image | — | デプロイ先<br />結果 | 同上。 |
| `7e`<br />納品 | 監視が動いているか確かめ、<br />欠けている計装を洗い出す | main-agent | implementer | opus | `4h` の observability-design | — | 確認結果<br />欠けている計装 | 同上。 |
| `7f`<br />納品 | ロールバック手順を書き、<br />試す | main-agent | implementer | opus | `4i` の deployment-design | runbook | 手順の場所<br />試行の結果 | 同上。<br />**`runbook` のオーナーは runbook-writer である**（名簿 §2）。<br />手順を書くのは runbook-writer、試すのは implementer に割るのが筋であり、1 行にまとめているのは暫定である。 |
| `7g`<br />納品 | 全ゲートの結果と waiver をまとめ、<br />最終レポートを書く | main-agent | project-manager | opus | 全ゲートの判定結果<br />waiver の記録 | final-report | レポートの場所 | 統合が本務である。<br />waiver は条件 3 によりここへ転記する<br />（プロセス規則 §9.1.1）。 |
| `7h`<br />納品 | 概要と UC を利用者の操作手順に翻訳し、<br />ユーザーマニュアルを書く | main-agent | user-manual-writer | sonnet | 対象: 概要と UC<br />根拠: ソフトウェア仕様 | user-manual | マニュアルの場所<br />未記載の機能 | **§3 のとおり ソフトウェア仕様を根拠として読む。**<br />要求だけでは操作手順を書けない。 |
| `7i`<br />納品 | 運用と復旧の手順を書き、<br />引継ぎ資料をそろえる | main-agent | runbook-writer | sonnet | 対象: 概要と設計<br />根拠: NFR | runbook | runbook の場所 | 運用・保守フラグ。<br />**トレーニング・知識移転もここに乗る。** |
| `7i`<br />納品 | マニュアルと運用手順書を突き合わせ、<br />重複と食い違いを洗い出す | main-agent | user-manual-writer | sonnet | `7h` の user-manual<br />`7i` の runbook | — | 重複と食い違いの一覧 | **[直列]** **兄弟で並べて起動する**<br />（`07` §4.5.1）。 |
| `7j`<br />納品 | 受入基準を利用者が実行できる手順に落とす | main-agent | test-designer | opus | 対象: テスト<br />根拠: 概要と UC | test-plan | 手順書の場所 | **受入基準を書く側なので test-designer である。** |
| `7k`<br />納品 | 指摘を統合し、<br />合格条件に照らして GATE-DELIVERY の可否を出す | main-agent | technical-authority | opus | `7a` の review<br />`7g` の final-report | tech-decision | 可否と理由<br />統合済みの指摘 | 合格条件はプロセス規則 §9.4.1 が持つ。<br />**厳格では 7 エージェントの指摘をここで統合する。**<br />免除した成果物は、免除の記録をもって充足とする。 |
| `7l`<br />納品 | 最終レポートをまとめ、<br />完了報告の文を書く | main-agent | project-manager | opus | `7g` の final-report | — | 報告文 | **文は下で起草させる。** |
| `7l`<br />納品 | 完了を利用者に報告する | **main-agent** | **利用者** | — | 報告文 | — | 受領 | **[直列]** 作業の実体が利用者への報告である。 |

**手順数が 11 → 12 になる。** `7b` の新設で 1 増える。**旧 `6b`〜`6h` の 1 行 4 手順は 4 行に開いた。** 記号ごとに担当者と出力が要るためである。
