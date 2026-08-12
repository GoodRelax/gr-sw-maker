<!-- GENERATED FILE. Do not edit by hand. -->
<!-- Source: maintenance/2026-08-10/00-mode-matrix.md -->
<!-- Regenerate: node maintenance-tools/split-work-table.mjs -->

# 作業表 —— Phase 1 初期設定

**列の意味と `入力` に使ってよい語は `development-mode.md` が持つ。本書に再掲しない。**

**方式ごとの実施・免除は `development-mode.md` の表 M が引く。** 本書に方式の列は無い。

**このフェーズの表だけを読む。** 前のフェーズの表を読み直してはならない —— 済んだ手順の成果物は `入力` 列が場所で指している。

---

### 4.2 Phase 1 初期設定

| フェーズ | 作業 | 依頼元 | 担当者 | モデル | 入力 | 出力 | 依頼元へ返す | 備考 |
|---|---|---|---|---|---|---|---|---|
| `1a`<br />初期設定 | user-order を読み、<br />何を作るのかを前提として持つ | **main-agent** | **main-agent** | —<br />（セッションのモデル） | user-order | — | — | **前提を持たないエージェントは「次を選ぶ」ができない**<br />（`agent-orchestration-rules.md` §3.5）。<br />user-order は 3 問形式で小さく、以降のすべての判断の入力になる。<br />**srs-writer も `2a` で読むが、それは解析のためであって代替にならない。** |
| `1b`<br />初期設定 | user-order を仕様書テンプレートの必須項目に照らし、<br />不足を洗い出す | main-agent | srs-writer | opus | user-order | — | 不足の一覧 | 不足はインタビューで解消する。<br />user-order 自体は直さない。 |
| `1c`<br />初期設定 | user-order から決めごとを起こし、<br />CLAUDE.md の案を書く | main-agent | architect | opus | user-order<br />`1b` の不足の一覧 | CLAUDE.md | 案の場所<br />利用者が埋める箇所 | **project-manager から移した。**<br />設計上の決めごとを並べた文書であり、設計のエージェントが起草する。 |
| `1d`<br />初期設定<br />**新設** | CLAUDE.md の記入必須欄を利用者に示し、値を受け取る | **main-agent** | **利用者** | — | `1c` の CLAUDE.md<br />`1c` が返した「利用者が埋める箇所」 | CLAUDE.md | 埋めた値 | **[直列]** `1c` の後に走る。<br />**コスト予算・アラート閾値・引継ぎ閾値・カバレッジ目標が埋まらないと、`5c` の合格判定と `6l` の GATE-TEST が比較対象を持たない。**<br />CLAUDE.md は file_type ではないので検査 18 の除外リストにある。 |
| `1e`<br />初期設定<br />**新設** | 表 0 に照らして開発方式を選び、<br />CLAUDE.md へ記録する | main-agent | technical-authority | opus | 表 0<br />user-order | tech-decision | 決めた方式と理由 | **表 0 を引くだけで軽く、以降の分岐の入力になる。**<br />CLAUDE.md「開発方式」節へ記録する。<br />節も未新設である。 |
| `1f`<br />初期設定<br />**新設** | 関与者を洗い出し、<br />ステークホルダー登録簿に書く | main-agent | srs-writer | opus | user-order<br />`1b` の不足の一覧 | stakeholder-register | 登録簿の場所<br />関与者の数 | **project-manager から移した。**<br />要求側の成果物である。<br />**`stakeholder-register` のオーナーは project-manager である**（名簿 §2）。**本行は srs-writer が書くので移管に当たる。** 名簿側の是正は別途。 |
| `1g`<br />初期設定<br />**統合** | 条件付き 13 プロセスをプロセス規則 §3.4 に照らし、<br />要否を一括で判定する | main-agent | technical-authority | opus | user-order<br />`1e` の decision<br />プロセス規則 §3.4 | tech-decision | 13 件の可否と理由 | **project-manager から移した。判定が本務である。**<br />旧 `0c`〜`0n2` の 13 手順を 1 つにまとめる。<br />**HW・AI・フレームワークの 3 フラグがすべて不成立のときは、その旨を同じ tech-decision に記録する。** Phase 3 が丸ごと走らないため、**GATE-DEPENDENCY はこの記録をもって充足とする**（プロセス規則 §9.4.1）。**記録なき免除は規約違反である**（同 §3.1.1）。 |
| `1h`<br />初期設定 | 評価結果をまとめ、<br />利用者へ渡す報告文を書く | main-agent | project-manager | opus | `1e` の decision<br />`1g` の decision | — | 報告文 | **文は下で起草させる**<br />（`agent-orchestration-rules.md` §4.7 の規約 5）。 |
| `1h`<br />初期設定 | 報告文を利用者に示し、<br />確認を得る | **main-agent** | **利用者** | — | 報告文 | — | 確認 / 差し戻し | **[直列]** **利用者と話せるのは `main-agent` だけである**<br />（構造上の制約）。 |
| `1i`<br />初期設定 | 方式と評価結果を pipeline-state に書いて初期化する | main-agent | project-manager | opus | `1e` の decision<br />`1g` の decision | pipeline-state | 初期化の完了 | 記録が本務である。 |

**手順数が 18 → 9 になる。** 統合で 12 減り、新設で 2 増える。**現物は `commands/full-auto-dev.md` の `0a`〜`0p` で 18 手順である**（旧ドキュメントの「19」は正しくない）。

**project-manager が担当者の行は `1h` の起草と `1i` だけになる。** **成果物づくりは全部よそへ出た。**
