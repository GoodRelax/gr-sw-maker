# spec-template v0.35 を入れるためにフレームワーク側で直すこと

**本書は記録である。ここに書いた作業は StrictDocStarter の準備と合わせて対応する。**

**出所:** 2026-08-08 の敵対的レビュー 4 体（内部整合 / フレームワーク横断 / 一次資料検証 / 用語）。**本書に載せた事実はすべて実ファイルで裏を取った。**

**対象外:** `spec-template` 本体の修正は本書に含めない。それは `00-spec-template-draft.md` で対応済みである。番号の一括置換手順は `01-spec-template-migration.md` にある。

---

## 0. 全体像

| # | 種類 | 番号置換で直るか |
|:-:|---|---|
| 1 | **起動プロンプトの章番号直書き** | **直らない。文面の書き換えが要る** |
| 2 | **Form Block の値域** | **直らない。値域の定義そのものを変える** |
| 3 | **「システム構成図」の語の衝突** | **直らない。名前の付け替えが要る** |
| 4 | **レビュー観点の適用範囲** | 番号置換で直るが、**見出しと条文本文の両方に散っている** |
| 5 | **エージェントの手順** | **直らない。手順の追加が要る** |
| 6 | **R1a と Ch3.3 の設計衝突** | **直らない。方針を決める必要がある** |
| 7 | 章番号の参照 307 / 329 件（ja） | 直る。`01-spec-template-migration.md` を見よ |

---

## 1. 【最優先】承認済み成果物が失われる経路

**design フェーズの起動プロンプトが章番号を直書きしている。**

**該当箇所:**

```text
framework-src/ja/process-rules/full-auto-dev-process-rules.md:997
  1. docs/spec/ の仕様書 Ch3 (Architecture) を詳細化する
     （レイヤー仕訳を先行して実施し、コンポーネントの4層分類を Ch3 冒頭に明記すること）
  2. docs/spec/ の仕様書 Ch4 (Specification) を Gherkin で詳細化する
  3. docs/spec/ の仕様書 Ch5 (Test Strategy) を定義する
  4. docs/spec/ の仕様書 Ch6 (Design Principles Compliance) を設定する
```

**v0.35 では Ch3 = Use Cases、Ch4 = Requirements である。** どちらも srs-writer が書き、GATE-PLANNING でユーザーが承認済みである。

**このプロンプトをそのまま実行すると、architect が承認済みの `UC-001` 以下と §3.1 Actors の上にアーキテクチャを書き込み、続けて Ch4 の `FR-xxx` を Gherkin で上書きする。**

> **今回のレビューで出た全指摘のうち、成果物が物理的に失われる経路はこれだけである。**

**直し方:** 5 行の章番号を Ch5 / Ch6 / Ch7 / Ch8 へ書き換える。**同じ文面が `commands/full-auto-dev.md` にもある可能性があるため、あわせて確認する。**

**同種の危険が `agents/architect.md` にもある。**

```text
framework-src/ja/agents/architect.md:30    - [ ] 仕様書 Ch3（Architecture）が完成している
framework-src/ja/agents/architect.md:74-84  Procedure が 3.1〜3.6 の節番号まで直書き
```

---

## 2. 機械可読フィールドが v0.35 の章構成を表現できない

**Form Block の値域が章番号で固定されている。**

```text
framework-src/ja/process-rules/full-auto-dev-document-rules.md:1255
  | spec-foundation:completed_chapters   | string | Yes | 完了済みチャプター | 1 / 2 |
framework-src/ja/process-rules/full-auto-dev-document-rules.md:1256
  | spec-foundation:approved_chapters    | string | No  | ユーザー承認済み   | 1 / 2 |
framework-src/ja/process-rules/full-auto-dev-document-rules.md:1270
  | spec-architecture:completed_chapters | string | Yes | 完了済みチャプター | 3 / 4 / 5 / 6 |
```

**v0.35 では `spec-foundation` = Ch1-4、`spec-architecture` = Ch5-8 である。**

| 何が起きるか |
|---|
| srs-writer が Ch3（Use Cases）と Ch4（Requirements）の完了を**書けない**。値域に無い |
| architect が Ch5-8 の完了を書くと**値域違反**になる |
| architect は `completed_chapters` を読んで作業開始位置を決める（`document-rules:429-430`）。**読めない値が入ると、In の Form Block 検査で差し戻しが始まる** |

**直し方:** 値域を `1 / 2 / 3 / 4` と `5 / 6 / 7 / 8` に改める。`document-rules:883` の記入例 `spec-architecture.completed_chapters: 3,4` も同時に直す。

---

## 3. 「システム構成図」という語が、すでに Chapter 3 に取られている

**文書管理規則は、この語を Architecture 章の内容として定義している。**

```text
framework-src/ja/process-rules/full-auto-dev-document-rules.md:1277
  仕様書 Ch3（Architecture: システム構成図・レイヤー定義・コンポーネント設計・データモデル）

framework-src/ja/agents/runbook-writer.md:40
  | spec-architecture | architect | システム構成の理解 | Ch3 のシステム構成図 |
```

**v0.35 は Chapter 2 を System Configuration（システム構成）と名付け、その §2.1 を構成図とした。** 粒度は正反対である — v0.35 の §2.1 は速さ・容量・型番を書いてはならない概要であり、`§9.14` の「システム構成図」はレイヤー定義やコンポーネント設計と同居する設計図である。

| 何が起きるか |
|---|
| 同じ名前の図が 2 つの文書に、別々の粒度で存在する。**どちらが正かが決まらない** |
| runbook-writer は In の必須要素として `spec-architecture` の「Ch3 のシステム構成図」を要求する。**v0.35 で構成図が spec-foundation へ移ると In 検査に失敗し、delivery フェーズが止まる** |

**直し方の案（未決）:**

| 案 | 内容 |
|:-:|---|
| A | **`§9.14` 側の語を「コンポーネント図」に改める。** Ch5 の実体はコンポーネントの分割であり、そちらのほうが正確である |
| B | v0.35 の Ch2 を別の名前にする |

**A を推す。** ただし runbook-writer / user-manual-writer が「システム構成の理解」を何のために要求しているかを確認してから決める。**運用手順書が欲しいのは物理配置（v0.35 の Ch2）である可能性が高く、そうなら In の参照先ごと Ch2 へ向け直すのが正しい。**

---

## 4. レビュー観点の適用範囲が章番号で固定されている

**見出しと条文本文の両方にある。**

```text
framework-src/ja/process-rules/review-standards.md:8   ## R1: 要求品質レビュー観点（仕様書 Ch1-2 対象）
framework-src/ja/process-rules/review-standards.md:55  ## R2: SW設計原則レビュー観点（仕様書 Ch3-4・コード対象）
framework-src/ja/process-rules/review-standards.md:336 ## R7: 純粋性・構造レビュー観点（仕様書 Ch3-4・コード対象）
```

**v0.35 では Ch1-2 に要求が 1 件も無く、Ch3-4 は Use Cases と Requirements である。**

| 観点 | v0.35 で何を見に行くか | 正しい対象 |
|---|---|---|
| R1（要求品質） | Foundation と System Configuration | **Ch1-4** |
| R2（SW設計原則） | Use Cases と Requirements | **Ch5-6** |
| R7（純粋性・構造） | Use Cases と Requirements | **Ch5-6** |

**条文の本文にも旧番号が埋まっている。** 番号置換の対象だが、**条文を読んだエージェントと v0.35 を読んだエージェントが別の場所を見るため、置換漏れが直接 defect になる。**

```text
review-standards.md:481  R2.16  異なる層構成も Ch3.1 に定義があれば準拠とする      -> Ch5.1
review-standards.md:483  R2.18  Ch3.6 に ADR-000                                   -> Ch5.6
review-standards.md:484  R2.19  参照してよいのは Ch3.3 が宣言した公開面のみ        -> Ch5.3
review-standards.md:485  R2.20  Ch3.6 にキャッシュ方針の ADR                       -> Ch5.6
review-standards.md:490  R3.5   Ch6 の Resource Lifecycle は本規約で検査する       -> Ch8
review-standards.md:493  R4.3   （未引用。要確認）
review-standards.md:495  R5.1   （未引用。要確認）
```

> **v0.35 は「（R2.19）」のように括弧書きで条文を引くだけで、条文側の番号を直していない。** 本体へ移すときに両側を揃える。

---

## 5. srs-writer の手順が旧章構成のままである

```text
framework-src/ja/agents/srs-writer.md:75  7. Chapter 2 (Requirements) を作成する
framework-src/ja/agents/srs-writer.md:80  9. Ch3-6 のスケルトン（見出しのみ）を配置し
```

**v0.35 の Ch2 は System Configuration、Ch3 は Use Cases である。** この手順のままだと、**`ND-xxx` / `CN-xxx` / `UC-xxx` / `GOAL-xxx` が 1 件も生成されないまま planning が完了する。**

そして v0.35 が MUST NOT とした状態がそのまま成立する。

```text
Chapter 2 を書かずに Chapter 4 を書いてはならない（MUST NOT）。
主語が定義されないまま要求を書くことになる。
```

**直し方:** srs-writer の Procedure に次を足す。

| 追加する手順 | 内容 |
|---|---|
| Ch1.3 | 各目標に `GOAL-xxx` を振る |
| Ch2 | ヒアリング項目に「どの機械の上で動くか」「何とつながるか」を足し、構成図・ノード表・接続表・持たないものを書く |
| Ch3 | アクター一覧とユースケース（brief）を書く |
| Ch4.3 | 紐づけ先を持たない要求・ユースケースを削減候補として挙げ、ユーザーに提示する |

**review-agent の観点にも 2 つ増える。** (1) 紐づけ先を持たないものの検出。(2) ユースケースの抽象度（手段独立テストと粒度の判定）。

---

## 6. 【方針判断が要る】R1a と Chapter 3.3 が正面衝突している

**レビュー規約は、以前からユースケースの代替シナリオを要求していた。**

```text
framework-src/ja/process-rules/review-standards.md:15
  - ユースケースに主シナリオと代替シナリオ（エラー系）が定義されているか
```

**これは v0.35 の設計を 1 つ壊す。** Chapter 3.3 は「拡張は既定で空。定められた契機でのみ書き足す」と決めたが、**その契機の 1 つが「review-agent の指摘」である。** R1a は毎回この項目を見るので、**すべてのプロジェクトで初回 R1 が必ず FAIL し、既定は一度も成立しない。**

> **あわせて分かったこと。** v0.34 には Use Cases の章が無いのに、`review-standards` は最初からユースケースの存在を前提にした観点を持っていた。**「レビュー観点が要求する成果物をテンプレートが持たない」という不整合が、v0.35 以前から存在していた。** Chapter 3 の新設はその穴を埋める側である。

**選べる道は 3 つある。決めるのはユーザーである。**

| 案 | 内容 | 失うもの |
|:-:|---|---|
| A | **R1a の「代替シナリオ」を Chapter 6.1 の Gherkin 異常系シナリオで満たすと定める** | 何も失わない。ただし R1 の対象章に Ch6 が入り、観点の境界が濁る |
| B | **R1a を「代替シナリオが要る場合はその条件が記録されているか」に緩める** | 代替シナリオの網羅性を規約で担保できなくなる |
| C | **Chapter 3.3 の「既定は空」をやめ、拡張を最初から書く** | **brief 止まりの利点が消える。** Cockburn の精密度 Level 3-4 を常に払うことになり、改良計画のコスト削減方針と逆行する |

**A を推す。** Gherkin の Unwanted Behavior シナリオは既に FR を経由してユースケースへ辿れるため、**代替シナリオは実質すでに存在している。** R1a が見る場所を変えるだけで済む。

---

## 7. 番号置換で直るもの

**`01-spec-template-migration.md` に実測値と手順がある。** 要点だけ再掲する。

```text
ja 329 件中 307 件が動く / en 369 件
置換の順序: 範囲表記 -> 節番号 -> 章番号（降順）
「第 N 章」は規則文書自身の章であり、触ってはならない
```

**あわせて en 側の対応が要る。** `framework-src/en/process-rules/spec-template.md` は v0.34 のままであり、`check-parity` が 41 ファイル対で行数一致を強制する。**ja だけ 8 章にすると framework-translation-verifier がリリースをブロックする。**

---

## 8. v0.35 とは独立の既存不整合（記録のみ。今回の作業対象外）

| # | 内容 | 場所 |
|:-:|---|---|
| 1 | **ANPS の分割単位が 2 か所で食い違う。** 「チャプター分割（`my-app-spec-ch3.md`）」と「2 ファイル分割（spec-foundation / spec-architecture）」 | `document-rules:221` / `spec-template:16-17` |
| 2 | **新 ID を数える仕組みが無い。** 品質メトリクスの「要求ID付与率」も Form Block の `fr_count` / `nfr_count` も FR/NFR しか数えない。**`GOAL` / `ND` / `CN` / `UC` の付与漏れは機械的に検出されない** | `process-rules:2066` / `document-rules:1253-1254` |
| 3 | **`actor` の衝突が用語集の「紛らわしい対」に登録されていない。** Common Block の `actor`（`{agent-name}` / `human:{id}` / `process:{id}`）と Chapter 3 のアクター。**`Use Case` / `ユースケース` の対も未登録** | `glossary.md:46, 73` |
| 4 | **v0.35 が持ち込んだ新語が用語集に無い。** ノード / 接続 / 機械 / 精密度 / 目標レベル / 削減候補 / 記述文 / 指示文 / 手段独立テスト / 与件 | `glossary.md` |
| 5 | **`review` / `audit` / `check` が用語集で区別されていない。** `glossary.md` には「監査用」が 1 度出るだけで、3 語の定義が無い。**`06-design-principles-check.md` という file 名を採るなら、`check` の定義が要る** | `glossary.md` |

### 8.1 `review` / `audit` / `check` の定義案

**3 語は「誰が / 何を見るか / いつ」で分かれる。**

| 語 | 誰が | 何を見るか | いつ | 出力 |
|---|---|---|---|---|
| **review（レビュー）** | **作った本人ではない者** | **中身の良し悪し。** 規約と観点に照らして読む | 変えるのが高くなる前（実装開始前など） | `review` 記録 + 重大度つきの指摘 |
| **check（確認）** | **本人または機械** | **定めた項目を満たすか。** 判断の余地が小さい | 成果物を出す直前 | 該当あり / 該当なし の一覧 |
| **audit（監査）** | **作業に関わっていない者** | **記録が残っているか、規則どおり運用されたか** | 事後 | 監査記録 |

**当てはめ:**

| 現行の呼び方 | 判定 |
|---|---|
| `review-agent` の出力 = `review` | **正しい。** 別のエージェントが中身を見る |
| `06-design-principles-check.md` | **正しい。** 原則を 1 項目ずつ照合する。判断の余地が小さい |
| `CLAUDE.md`「**監査記録:** 重要判断は `project-records/decisions/` に記録する」 | **語の誤用。** あれは監査そのものではなく、**監査に備えた記録**である。「決定の記録」と呼ぶべき |

> **`audit` は厳密形式でのみ使う。** 「開発に関わっていない人が検証する」が厳密形式の定義であり、監査はそこにしか現れない。**簡易・通常で `audit` を名乗ってはならない（MUST NOT）。**

---

## 9. v0.34 由来の誤りのうち、テンプレート側で直したもの

**本体を v0.35 で差し替えれば ja は解消する。en 側は同じ修正が要る。**

| # | 誤り | 直した内容 |
|:-:|---|---|
| 1 | **EARS の Complex パターンの語順が逆** | `While [In State], when [Trigger], ...` に修正。**原論文は状態が先、契機が後**（時間論理に従う。前提が成立していなければ契機は発火しない） |
| 2 | 「Gherkin 全キーワード網羅」が偽 | 「主要キーワードを提示」に改め、未収録分（Scenario Outline / Examples / Doc Strings / Data Tables / Tags / Comments）を明記 |
| 3 | 参考文献 1 に SDP も SAP も書かれていない | 4 層の出典と SDP/SAP の出典を分けた |
| 4 | RFC 8174 準拠と「小文字 `shall` = SHALL」が両立しない | **本文書が置く明示の例外**として宣言する形に改めた |
| 5 | Nygard の ADR に `Title` が欠落 | `Title / Context / Decision / Status / Consequences` に修正 |
| 6 | Gherkin テンプレートの外側フェンスに言語指定が無い | ` ````markdown ` に修正 |

---

## 10. 未確認（推測で埋めていない）

| # | 内容 |
|:-:|---|
| 1 | `review-standards` の `R4.3` `R5.1` が旧章番号を含むか。**未照合** |
| 2 | `commands/full-auto-dev.md` の起動プロンプトに §1 と同じ章番号直書きがあるか。**未照合** |
| 3 | runbook-writer / user-manual-writer が「システム構成」に何を期待しているか。**§3 の案 A / B の判断材料** |
| 4 | 参考文献の arc42 と ISO/IEC/IEEE 29148:2018 のリンク・題名・年。**未検証** |
| 5 | IEEE 文書番号 5328509 が EARS 論文を指すか。**IEEE Xplore が本文を返さず照合できていない** |
