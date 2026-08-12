<!-- GENERATED FILE. Do not edit by hand. -->
<!-- Source: maintenance/2026-08-10/00-mode-matrix.md -->
<!-- Regenerate: node maintenance-tools/split-work-table.mjs -->

# 作業表 —— Phase 2 企画

**列の意味と `入力` に使ってよい語は `development-mode.md` が持つ。本書に再掲しない。**

**方式ごとの実施・免除は `development-mode.md` の表 M が引く。** 本書に方式の列は無い。

**このフェーズの表だけを読む。** 前のフェーズの表を読み直してはならない —— 済んだ手順の成果物は `入力` 列が場所で指している。

---

### 4.3 Phase 2 企画

| フェーズ | 作業 | 依頼元 | 担当者 | モデル | 入力 | 出力 | 依頼元へ返す | 備考 |
|---|---|---|---|---|---|---|---|---|
| `2a`<br />企画 | user-order を読み解き、<br />要求と曖昧点を洗い出す | main-agent | srs-writer | opus | user-order | — | 曖昧点と不足の一覧 | `1a` で `main-agent` が読むのは前提としてである。<br />ここは解析であり、目的が違う。 |
| `2b`<br />企画 | 曖昧点を埋めるインタビューの設問を書く | main-agent | srs-writer | opus | user-order<br />`2a` の一覧 | — | 設問一覧 | **srs-writer が利用者に直接聞くことはできない**<br />（`agent-orchestration-rules.md` §4.5 の規約 1）。 |
| `2b`<br />企画 | 設問を利用者に問い、<br />回答を持ち帰る | **main-agent** | **利用者** | — | 設問一覧 | — | 回答 | **[直列]**  |
| `2c`<br />企画 | 回答を interview-record に記録し、<br />未解決の質問を数える | main-agent | srs-writer | opus | 回答 | interview-record | 記録の場所<br />未解決の質問数 | `2j` が未解決の質問数を見る。 |
| `2d`<br />企画 | 確かめたい要求を選び、<br />モック / サンプル / PoC を作る | main-agent | srs-writer | opus | interview-record | — | 試作の場所<br />確かめた要求 | 要求を確かめるための試作である。<br />製品の実装ではない。<br />**`src/` へ置いてはならない（MUST NOT）。** `gate-guard` が GATE-DESIGN まで `src/` を拒否するため、置くと Phase 2 で走行が止まる。<br />**試作物は `Work` であって `Out` ではない。** 置き場は `project-management/prototype/` とし、仕様書が確定した時点で消す（srs-writer の `Work`）。 |
| `2e`<br />企画<br />**新設** | 目的とシステム概要とユースケースを書き、<br />`GL` と `UC` に ID を付ける | main-agent | srs-writer | opus | user-order<br />interview-record<br />仕様書テンプレート | spec-foundation<br />**traceability** | 仕様書の場所<br />付けた `GL` と `UC` の UID 範囲 | **鎖の根はここで生まれる。**<br />`spec-writing-rules.md`「親をたどると必ず `GL` に着く（MUST）」。<br />**`spec-writing-rules.md`「Chapter 2 を書かずに Chapter 4 を書いてはならない（MUST NOT）」により、`2f` より前に置く。**<br />**`traceability` のオーナーは test-designer である。本行は srs-writer が書くので移管に当たる**（名簿 §2）。 |
| `2f`<br />企画 | 要求を仕様書の要求の章に書き、<br />ID を付ける | main-agent | srs-writer | opus | user-order<br />interview-record<br />仕様書テンプレート | spec-foundation<br />**traceability** | 仕様書の場所<br />付けた ID の範囲 | 鎖の根は `GL` であって要求ではない（`spec-writing-rules.md` §ID と採番）。<br />**したがって本手順の前に `2e` が要る。**<br />**`traceability` のオーナーは test-designer である**（名簿 §2）。**本行は srs-writer が書くので移管に当たる。**<br />複数の体が追記する性質なので、名簿側で共同所有を定義するまで暫定である。 |
| `2f`<br />企画 | 付けた ID をテストから引けるか確かめる | main-agent | test-designer | opus | `2f` の ID 範囲 | — | 可否と理由 | **[直列]** ID はテストの紐づけ先になる。<br />**兄弟で並べて起動する。srs-writer が test-designer を呼んではならない**<br />（`agent-orchestration-rules.md` §4.5.1）。 |
| `2g`<br />企画 | 以降の章の枠を仕様書テンプレートから写す | main-agent | srs-writer | opus | 仕様書テンプレート | spec-foundation | 完了 | 章の枠だけを置く。<br />中身は Phase 4 以降が埋める。 |
| `2h`<br />企画 | 仕様書の概要をまとめ、<br />利用者へ渡す報告文を書く | main-agent | srs-writer | opus | spec-foundation | — | 報告文 | **旧版は srs-writer をこの手順の主担当としていた。**<br />作業の実体が利用者への報告なので、`main-agent` の行へ移した。 |
| `2h`<br />企画 | 概要を利用者に示し、<br />承認を得る | **main-agent** | **利用者** | — | 報告文 | — | 承認 / 差し戻し | **[直列]** `1h` と同じ形である。 |
| `2i`<br />企画 | 要求を R1 の 6 項目に照らし、<br />指摘を挙げる | main-agent | review-agent | opus | 対象: 要求<br />根拠: 概要と UC | review | 指摘の場所と件数<br />Critical / High の有無 | **R1 は 1 観点なので、厳格でも 1 エージェントである**<br />（割る先が無い）。<br />報告ファイルを残すかは表 E-1。<br />指摘への回答は分類を付けて 1 通で送る<br />（`agent-orchestration-rules.md` §4.3）。 |
| `2j`<br />企画<br />**分割** | interview-record を合格条件に照らし、<br />GATE-INTERVIEW の可否を出す | main-agent | technical-authority | opus | interview-record | tech-decision | 可否と理由<br />統合済みの指摘 | 合格条件はプロセス規則 §9.4.1 が持つ。<br />**`2k` と同じ遷移に属するが、条件が別なので行を分ける。** |
| `2k`<br />企画<br />**分割** | R1 の結果と承認を合格条件に照らし、<br />GATE-PLANNING の可否を出す | main-agent | technical-authority | opus | `2i` の review<br />`2h` の承認 | tech-decision | 可否と理由<br />統合済みの指摘 | 合格条件はプロセス規則 §9.4.1 が持つ。<br />**`2i` の R1 PASS を要するため `2j` の後に置く。** |

**手順数が 9 → 11 になる。** 旧 `1i` の 1 手順 2 ゲートを割り、目的・概要・UC を書く `2e` を新設した。**ゲートは方式によらず全 8 つ判定するので、割っても判定の数は変わらない。**
