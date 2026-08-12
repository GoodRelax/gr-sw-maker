# 判断 3 件と波及の検討経緯（2026-08-10）

**本書は検討の記録である。結論は 1 つ上の `03-work-order.md` が持つ。** 本書には結論を再掲しない。ここにあるのは「なぜそう決めたか」と「そのとき何を測ったか」である。

行番号は当時の現物を指す。`01` = `01-spec-template.md`、`02` = `02-spec-writing-rules.md`。**適用作業で行がずれるため、本書の行番号は当時のものとして読む。**

---

## 1. 判断 1 —— Chapter 8「SW設計原則 準拠確認」

### 1.1 最初に挙げた 4 案

| 案 | 内容 | 却下の理由 |
|---|---|---|
| A | 骨格 6 行のまま ＋「カタログから選んで足す（MUST）」の 1 行 | MUST の裏付けを持つ 11 件が、利用者の読み落としひとつで判定されなくなる |
| B | 骨格を 27 行へ拡張 | SHOULD 10 件にも判定欄が要る。骨格が約 690 行になり、`02` との二重管理が 27 行に広がる |
| C | カタログを 6 件へ絞る | 21 原則の知見が失われる。R2・R3・R4・R5・R7 の MUST がカタログから消える |
| D | MUST 裏付けを持つ 17 件だけ骨格へ | 二重管理は減るが消えない |

**採ったのは 4 案のいずれでもなく、Chapter 8 の削除である。** 利用者の判断が「二重管理は止めよう」であった。

### 1.2 削除に至った根拠

`review-standards.md` の総合レビューチェックリストは R1.1〜R7.10 の**全行に Verdict の記入を要求している。** 仕様書側に同じ判定欄を置けば、同じ判断を 2 度書くことになる。

| 何 | 削除前 | 削除後 |
|---|---|---|
| 原則ごとの判定 | 仕様書 Chapter 8 の `判定` / `根拠` 欄 ＋ 総合チェックリストの Verdict | 総合チェックリストの Verdict のみ |
| 判定の置き場 | `docs/spec/` と `project-records/reviews/` の 2 か所 | `project-records/reviews/` の 1 か所 |

### 1.3 実測 —— 同じ表が 3 か所にあった

**配置済みの `framework-src/ja/process-rules/spec-template.md` は 6 章構成で、その Chapter 6 が「Design Principles Compliance」であり、27 行のカタログをそのまま持っていた。** `02` のカタログ 27 行はこの表の写しである。新骨格 Ch8 の 6 行版を含めると、同じ知識が 3 か所にあった。

`framework-src/ja/` からの参照は 8 行（en を合わせて 16 行）。

| ファイル | 行 | 内容 |
|---|---|---|
| `agents/architect.md` | 33 | 完了チェックリスト「仕様書 Ch6 が設定されている」 |
| `agents/architect.md` | 84 | 手順 7「Ch6 Design Principles Compliance を設定する」 |
| `commands/full-auto-dev.md` | 86 | 手順 3d「architect が仕様書 Ch6 を設定する」 |
| `process-rules/full-auto-dev-process-rules.md` | 1000 | 同じ手順の記述 |
| `process-rules/review-standards.md` | 490 | R3.5「Ch6 の Resource Lifecycle は本規約で検査する」 |
| `process-rules/spec-template.md` | 40 / 209 / 279 | 章の一覧 / 本体 / 設計根拠 |

### 1.4 原則カタログ 27 件と `review-standards.md` の対応（実測）

カタログを捨てるか移すかを決めるために作った表である。`裏付け` は総合チェックリストの ID と強度、`—` は対応行が無いことを指す。

| # | カテゴリ | 識別名 | 正式名称 | 裏付け |
|:-:|---|---|---|---|
| 1 | 命名 | Naming | — | R2.1 MUST |
| 2 | 依存関係 | Dependency Direction | — | R2.16 MUST |
| 3 | 依存関係 | SDP | Stable Dependencies Principle | R2.16 MUST |
| 4 | 簡潔性 | KISS | Keep It Simple, Stupid | R2.8 SHOULD |
| 5 | 簡潔性 | YAGNI | You Aren't Gonna Need It | R2.9 SHOULD |
| 6 | 簡潔性 | Minimal Comparison | — | R2.18 MUST |
| 7 | 簡潔性 | DRY | Don't Repeat Yourself | R2.7 SHOULD |
| 8 | 責務分離 | SoC | Separation of Concerns | R2.10 MUST |
| 9 | 責務分離 | SRP | Single Responsibility Principle | R2.2 MUST |
| 10 | 責務分離 | SLAP | Single Level of Abstraction Principle | R2.11 MUST |
| 11 | SOLID | OCP | Open-Closed Principle | R2.3 SHOULD |
| 12 | SOLID | LSP | Liskov Substitution Principle | R2.4 SHOULD |
| 13 | SOLID | ISP | Interface Segregation Principle | R2.5 SHOULD |
| 14 | SOLID | DIP | Dependency Inversion Principle | R2.6 SHOULD |
| 15 | 結合 | LoD | Law of Demeter | R2.12 SHOULD |
| 16 | 結合 | CQS | Command-Query Separation | R2.13 SHOULD |
| 17 | 可読性 | POLA | Principle of Least Astonishment | R2.14 MUST |
| 18 | 可読性 | PIE | Program Intently and Expressively | R2.15 MUST |
| 19 | テスト | Testability | — | 無し（最も近い R6.3 はモック過剰使用の観点） |
| 20 | 純粋性 | Pure / Semi-pure-a / Semi-pure-b / Non-pure | — | R7.1 / R7.2 / R7.6 MUST |
| 21 | 構造 | Collect-Process Separation | 収集後処理 | R7.4 MUST |
| 22 | 状態遷移 | State Transition | — | R4.3 MUST |
| 23 | 並行性 | Concurrency Safety | — | R4.1 / R4.2 MUST |
| 24 | エラー | Error Propagation | — | R3.1 / R3.2 MUST |
| 25 | 資源管理 | Resource Lifecycle | — | R3.5 MUST |
| 26 | 不変性 | Immutability | — | R7.5 MUST |
| 27 | 資源効率 | Resource Efficiency | — | R5.1 / R5.3 MUST |

**現行の骨格 6 行は基準を持たずに選ばれていた。** `KISS`（R2.8 SHOULD）と `DIP`（R2.6 SHOULD）が入っている一方で、`SoC`（R2.10 MUST）・`POLA`（R2.14 MUST）・`純粋性`（R7.1/7.2/7.6 MUST）・`Resource Lifecycle`（R3.5 MUST）が落ちていた。強度と収録が逆転していた。

### 1.5 カタログを捨てなかった理由

**カタログは総合チェックリストの単純な写しではない。** 実測で、`review-standards.md` は次のいずれも持っていなかった。

| 持っていないもの | 件数 |
|---|---:|
| 正式名称の展開（`Stable Dependencies Principle` 等） | 16 |
| 原則名そのもの（`Testability` / `Resource Efficiency` / `Error Propagation` / `Immutability` / `Collect-Process Separation`） | 5 |
| 裏付けとなる R 項目 | 1（`Testability`） |

したがってカタログは R が持たない語彙層である。捨てず、`review-standards.md` へ索引として移すことにした。

### 1.6 `Testability` の扱い

27 件のうち `Testability` だけが対応する R 項目を持たない。最も近い R6.3 は「モック/スタブの過剰使用で実動作が未検証にならない」であり、**テスト側の観点である。** テスト容易性は設計時の判断なので、R6 ではなく R2 に属する。R2.21 を新設することにした。

強度を SHOULD としたのは、分離そのものを R7.2（MUST）が既に強制しているためである。MUST にすると同じ違反が 2 件起票される。

### 1.7 途中で立てた懸念とその解消

**懸念:** Chapter 8 に MUST を並べると、同じ判定を仕様書側とレビュー側で 2 度書くことになるのではないか。

**当初の整理:** 読み手と時期が違う。Chapter 8 は architect と implementer が設計する時点で見るもの、総合チェックリストは review-agent がレビューする時点で使うもの。重複ではなく前倒しの提示である。

**結果:** この整理は採らなかった。「前倒しの提示」であれば判定欄は要らず、索引で足りる。判定欄を持つ以上は二重管理である。

---

## 2. 判断 2 —— 重複 7 箇所

### 2.1 `TC` / `TR` は 3 系統で通し連番

| 場所 | 文脈 | 持っているもの |
|---|---|---|
| `02:191` | 「ID と採番」節。接頭辞表・`DOC`・`ADR`・ゼロ詰めに続く引用ブロック | MUST ＋ MUST NOT ＋ 理由（番号帯に意味を持たせると系統をまたぐ挿入で採番規則が破れる）＋「系統は接頭辞ではなく `**Type**:` が持つ」 |
| `02:1101` | 第 3 部 Test の導入。`.1` / `.2` 分離の表の直後 | MUST ＋ MUST NOT のみ。理由なし |

理由と設計判断まで持つ `02:191` を正本とした。

### 2.2 `_assets/` の図に `**Grammar**` を宣言しない

| 場所 | 文脈 | 持っているもの |
|---|---|---|
| `02:102` | 「あわせて置くもの」表の `_assets/fig-<name>.md` 行 | 表のセル内の注記 |
| `02:366` | 「1.9 の図の規則」表の 3 行目 | MUST NOT として明記 |

規則表であり MUST NOT のキーワードを持つ `02:366` を正本とした。`02:102` は配置物の一覧であって規則の置き場ではない。

### 2.3 大きな図は別ファイルへ出す

| 場所 | 持っているもの |
|---|---|
| `02:347` | MUST ＋ 置き場 `_assets/fig-<name>.md` ＋ 図の種類ごとの閾値表 6 行 ＋ 閾値の調整規則 |
| `02:364` | MUST ＋ 置き場 `_assets/`（ファイル名の形を持たない） |

判定の閾値を持つ `02:347` を正本とした。`02:364` は `fig-<name>.md` という命名を落としており、17 行しか離れていないため片方だけ直しても気付かれにくい。

### 2.4 `ADR` は鎖に載らない

| 場所 | 種別 | 中身 |
|---|---|---|
| `02:158` | 表のセル（値） | 「ID を振らないもの」表の Ch5 行 |
| `02:178` | 表のセル（値） | 接頭辞表の `ADR` 行、`親` 欄が `鎖の外` |
| `02:187` | 地の文 | 「判断の記録であって要求ではない」という理由 ＋ 参照切れは別の検査で拾う |
| `02:816` | 地の文 | 「本章はノードを持たない」＋ `ADR` だけが UID を持つ |
| `02:889` | 地の文 | `02:187` の後半とほぼ同文 |

`02:158` と `02:178` は表の行の値であって地の文の再掲ではない。`02:816` は Chapter 5 全体の性質を述べており、`ADR` はその例外として触れているだけである。`02:889` だけが `02:187` の後半をそのまま繰り返しており、`02:816` から 73 行しか離れていない。

### 2.5 `TEST_LEVEL` を持つのは `SW_SPEC_TEST` だけ

#### 現物

**記入例（`02` の 9.1 / 10.1 / 11.1 から該当行のみ）:**

```markdown
**Type**: USE_CASE_TEST
**UID**: TC-001
（TEST_LEVEL 無し）

**Type**: SW_SPEC_TEST
**UID**: TC-003
**TEST_LEVEL**: Integration

**Type**: NON_FUNC_TEST
**UID**: TC-005
（TEST_LEVEL 無し）
```

機械側の正は文法ファイルである。`tools/spec-query/spec.sgra` で `TEST_LEVEL` が現れるのは 1 箇所だけで、`SW_SPEC_TEST` の下にある。

**文法ファイルの該当部（`tools/spec-query/spec.sgra:119-129`）:**

```yaml
- TAG: SW_SPEC_TEST
  FIELDS:
  - TITLE: UID
    TYPE: String
    REQUIRED: True
  - TITLE: TITLE
    TYPE: String
    REQUIRED: True
  - TITLE: TEST_LEVEL
    TYPE: SingleChoice(Unit, Integration, System)
    REQUIRED: True
```

`USE_CASE_TEST`（`:98`）と `NON_FUNC_TEST`（`:143`）の `FIELDS` に `TEST_LEVEL` は無い。

#### 何が壊れるか

`02:1032` と `02:1185` は自分の系統以外について語っていた。将来 `NON_FUNC_TEST` に `TEST_LEVEL` を持たせると決めたとき、直す場所は `spec.sgra` と `02:236` である。**`02:1032` と `02:1185` は別の節にあるため一緒に開かれず、「非機能テストはレベルを持たない」と書いたまま残る。** 書き手はそれを読んで欄を書かず、`REQUIRED: True` で落ちる。

#### 措置を途中で変えた

当初は `02:1185` を参照 1 行へ置き換える案だった。**「だけが」の 3 文字を削って「本系統は `TEST_LEVEL` を持つ」にするほうが、書き手の手間を増やさずに重複を消せる。** 他系統への言及が消えれば、局所的な事実だけが残る。

### 2.6 子 → 親 → `Role` —— 重複ではなく誤りだった

#### 2 つの表

**型ごとの欄（`02:225-238`、型名で書く。関係する 3 列を抜粋）:**

```text
| **Type**:        | 親                          | Role     |
|------------------|-----------------------------|----------|
| USE_CASE         | GOAL                        | Satisfies|
| FUNC_REQ         | USE_CASE                    | Satisfies|
| NON_FUNC_REQ     | GOAL                        | Satisfies|
| SW_SPEC          | FUNC_REQ / NON_FUNC_REQ     | Satisfies|
| USE_CASE_TEST    | USE_CASE ＋ File            | Verifies |
| SW_SPEC_TEST     | SW_SPEC ＋ File             | Verifies |
| NON_FUNC_TEST    | NON_FUNC_REQ ＋ File        | Verifies |
| TEST_RESULT      | テスト 3 型のいずれか        | ResultOf |
```

**鎖の解説の表（`02:690`、接頭辞で書く）:**

```text
| 子   | 親              | Role      |
|------|-----------------|-----------|
| UC   | GL              | Satisfies |
| FR   | UC              | Satisfies |
| NFR  | GL              | Satisfies |
| SWS  | FR または NFR   | Satisfies |
| TC   | UC / SWS / NFR  | Verifies  |
| TR   | TC              | ResultOf  |
```

#### 機械側の正

**検出クエリの制約表（`tools/spec-query/checks.jq:27-37`）:**

```jq
| ({
    "USE_CASE":["GOAL"],
    "FUNC_REQ":["USE_CASE"],
    "NON_FUNC_REQ":["GOAL"],
    "SW_SPEC":["FUNC_REQ","NON_FUNC_REQ"],
    "USE_CASE_TEST":["USE_CASE"],
    "SW_SPEC_TEST":["SW_SPEC"],
    "NON_FUNC_TEST":["NON_FUNC_REQ"],
    "TEST_RESULT":["USE_CASE_TEST","SW_SPEC_TEST","NON_FUNC_TEST"]
  }) as $ALLOWED
```

`$ALLOWED` は `02:225-238` と同じ語彙・同じ 8 行である。`02:690` に対応するものは機械側に無い。

#### 誤りである理由

**接頭辞 `TC` は 3 つの型が共有している** —— `USE_CASE_TEST` / `SW_SPEC_TEST` / `NON_FUNC_TEST` はすべて `TC-xxx` と採番する（`checks.jq:23-25` の `$PREFIX`）。

したがって `02:690` の 1 行「`TC` の親は `UC` / `SWS` / `NFR`」は、どの `TC` がどの親を取れるかを区別できない。字面どおりに読むと次の書き方が許される。

**`02:690` が許し、`checks.jq` が落とす例:**

```markdown
**Type**: SW_SPEC_TEST
**UID**: TC-007

**Relations**:

- **Type**: `Parent`
  **ID**: `NFR-002`
  **Role**: `Verifies`
```

`$ALLOWED["SW_SPEC_TEST"]` は `["SW_SPEC"]` だけなので、D20「tests reaching across a level」が `TC-007 (SW_SPEC_TEST -> NFR-002 which is NON_FUNC_REQ)` として拾う。**`02:690` を読んで書いた仕様書が検査で落ちる。**

当初は「重複しているから」と整理した。実際には `02:690` は情報を落としており、落とした結果として誤った組み合わせを許している。**重複解消ではなく欠陥修正である。**

### 2.7 CA レイヤー凡例の Mermaid

`01:278-292` と `02:852-866` に**同一の Mermaid 15 行**があった（`classDef` の Hex 値まで一致）。

利用者が写すのは骨格である。`02` は解説書であり、色分けが必須であること・依存の向きを表すこと・Chapter 2 の概要図には適用しないことという規則を持つ。**規則は `02`、現物は `01` で分ける。**

`02:868-873` の CA レイヤー表（レイヤー / 役割 / 色 / Hex）は残した。この表だけが `役割`（ドメインデータ・ビジネスロジック調整・外部 IF 適合・UI/デバイス）を持っており、Mermaid では表せない。**Hex 値の重複は 3 箇所から 2 箇所へ減る。0 にはならない。**

### 2.8 重複として扱わなかったもの

`02:1453-1462` の設計根拠は同じ内容を「なぜそうしたか」として書いている。規則の再掲ではないので残す。

`02:690` の直前にある「`NFR-001` は `SW_SPEC` を持たずテストへ直接つながり、`NFR-005` は `SWS-002` へ具体化してからつながる。どちらも正しい」は鎖の分岐の説明であり、残す。

---

## 3. 判断 3 —— 用語

### 3.1 呼び名は 3 つではなく 4 つだった

| 語 | 出現 | 場所 |
|---|---:|---|
| `骨格` | 22 行 | `02` のみ。`framework-src/` に 0 件、`01` 自身は 0 件 |
| `テンプレート`（単独） | 55 行 / 14 ファイル | `framework-src/ja/`。`CLAUDE.md テンプレート` `Common Block テンプレート` `incident-report テンプレート` など別の雛形を指す用例が多数 |
| `仕様テンプレート` | 2 行 | `framework-src/ja/agents/architect.md:106`、`framework-src/ja/agents/srs-writer.md:95` |
| `spec-template.md` | ファイル名 | `framework-src/{lang}/process-rules/` |

引継書は 3 つとしていたが、`仕様テンプレート` を数えていなかった。

### 3.2 検討した 3 案

| 案 | 内容 | 判定 |
|---|---|---|
| A | `骨格` を採用語にし、`テンプレート` を非採用にする | 却下。`glossary.md:106` が既に `テンプレート = フレームワークが提供する雛形` と定義しており、対の書き換えが要る。ファイル名 `spec-template.md` とも語がずれる |
| B | `テンプレート` へ統一する | 却下。**「テンプレートだけでは何の雛形か分からない」** |
| C | 現状維持 | 却下。4 呼称が併存したままになる |

**採ったのは 3 案のいずれでもなく、`仕様書テンプレート`（Specification Template）である。** 語自体に対象を持たせる、という利用者の判断による。

### 3.3 単独の `テンプレート` を非採用にできない理由

`check-terms.mjs` は CJK を単語境界なしの部分一致で照合する。`CLAUDE.md テンプレート` など別の雛形を指す 55 行が巻き添えになる。`maintenance/2026-08-10/04-glossary-state.md` §4 が挙げる `機械` / `ノード` / `接続` と同じ理由である。

`仕様書テンプレート` は `仕様テンプレート` を部分文字列として含まないため、`仕様テンプレート` は非採用にできる。ただし 2 行 × 2 言語を先に直す必要がある。

---

## 4. 波及の調査

### 4.1 手順記号の枝番

全フェーズの記号を実測したところ、繰り上げを避けるために付けられた枝番が 9 個あった。

`0b2` `0n2` `3a2` `3g2` `4c2` `5c2` `6f2` `6f3` `6g2`

**`3g` と `3h` の間に `3g2` がある理由は文書のどこにも書かれていない。** 欠番と同じで初見の読み手に伝わらない。

**表 B-1 の全手順数は実測と全フェーズ一致した**（Phase 1=9 / 2=7 / 3=14 / 4=8 / 5=7 / 6=11 / 7=6 / 共通=7）。Phase 0 だけ現行 18 で、未新設の `0b3` を足して 19 になる。表 B-1 の 19 はその数である。

### 4.2 旧手順記号を持つ過去記録

| 場所 | 件数 | 扱い |
|---|---:|---|
| `project-records/` `project-management/` `docs/` `README*` `CLAUDE.md` | 0 | —（`project-records/reviews/` には council-review 8 本があり、空ではないうえでの 0 件） |
| `00-mode-matrix.md` | 11 | 直す（表 B-2 と §12） |
| `History/` 配下 | 19 | 触らない |
| `prompt/handoff-2026-08-02-trial2-monitor.md` | 2 | 触らない |

`History/2026-08-02/02-trial2-observation-log.md:416,444` は旧 `3d`（Ch6 設定）を指している。改番後は `3d` が Ch5 テスト戦略を指すため、同じ記号が別の手順を意味する。

### 4.3 偶然一致（一括置換をかけてはならない根拠）

手順記号に見えて手順記号でないものが実在する。

| 場所 | 字面 | 正体 |
|---|---|---|
| `02-spec-writing-rules.md:649` | `3a1.` `3a2.` | Cockburn のユースケース拡張の採番 |
| `framework-src/{lang}/agents/technical-authority.md:69-72` | `3a.`〜`3d.` | technical-authority 自身の内部サブステップ |

このほか、コミットハッシュ・Mermaid の色コード・URL のハッシュ文字列が `3d` `5d` `0b2` に偶然一致する例が 18 ファイルにあった。

**枝番 9 個は、正本側では `commands/full-auto-dev.md` 1 ファイルにしか存在しない**（`framework-src/{lang}/` 全体を実測）。

### 4.4 `main` との比較

| 項目 | 結果 |
|---|---|
| `main..HEAD` | 115 コミット |
| `HEAD..main` | 0（fast-forward 可能） |
| 分岐点 | `a5e8cf3`（2026-08-04 21:37） |
| 差分 | 255 ファイル / +35,281 / −5,507 |
| 未コミットの変更 | 0 |

**`framework-src/` は `main` に存在しない。** このブランチで新設されたディレクトリで、82 ファイル・+23,256 行がまるごと新規である。`framework-src/` に触れたコミットは 52 件あり、最後が `9a94e1a`（2026-08-10 01:13）。その後の 9 コミットは触れていない。

### 4.5 引継書の記述の訂正

引継書は「`framework-src/` はまだ 1 文字も変えていない」と書いていた。**これは誤りである。**

`framework-src/{ja,en}/process-rules/glossary.md` はどちらも 206 行で、`ANPS-part` `ANPS-chapter` `test-designer` `tester` `機器` `経路` `削減候補` が実在する。**用語集の手順 1a（新語 19・紛らわしい対 7・章番号 2 件）は両言語とも適用済みである。**

一方 `簡易` `厳格` は用語集に 0 件で、段 1 の項目 8 は未着手である。

引継書の主張は「開発方式 対応表の適用が未着手」という意味なら正しい。

---

## 5. 採番をやり直した理由

`2026-08-09/01-chapter-number-census.md` §5 の旧 → 新 対応表は **11 章構成を前提に組まれている。** Chapter 8 を削除して 10 章構成にするため、同 §5.1 / §5.2 / §5.3 / §6 の 4 表は使えない。

**計測そのもの（658 件・表記 6 形・ファイル別内訳）は章数に依存しないのでそのまま使える。** 変わるのは写像だけである。やり直した写像は `03-work-order.md` §7 が持つ。

やり直しで新たに分かったこと:

| # | 内容 |
|:-:|---|
| 1 | 旧 `Ch1`〜`Ch5` の写像は 11 章案と同じである。動くのは旧 `Ch6` の行と、新設テスト 3 章の番号だけ |
| 2 | 置換順序に段が 1 つ増える。**旧 `Ch6` の処理を最初に置く。** 後段の `Ch4`→`Ch6` が新しい `Ch6` を作るため、旧 `Ch6` が残っていると同じ字面になって区別できなくなる |
| 3 | `Ch3-6` / `Ch4-6` / `Ch1-6` は文字列 `Ch6` を含まないので、旧 `Ch6` の 20 件と混ざらない |
| 4 | `Ch1-5` 3 件と `Chapter 1-5` 1 件は「旧 `Ch6` から見た層」の意味で書かれており、見ている側の章が消えるため端点を写すだけでは意味が通らない |
| 5 | 既に当てた章番号 2 件（`glossary.md:119` `Ch3.1`→`Ch5.1`、`:25` FMEA `Ch3`→`Ch5`）は影響を受けない。どちらも `Ch5` 以下へ写る |
