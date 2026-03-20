# エージェントプロンプト構造規約

> **本文書の位置づけ:** `.claude/agents/*.md` に配置するエージェントプロンプトの唯一の構造定義（Single Source of Truth）。新規エージェント作成時および既存エージェント改修時に参照する。
> **関連文書:** [プロセス規則](full-auto-dev-process-rules-ja.md) §7 エージェント定義、[文書管理規則](full-auto-dev-document-rules-ja.md)

---

## 1. 設計原則

1. **AIは上から順に読む。** 先に読んだ情報が後の情報の解釈文脈になる。「先に知るべきこと」を上に置く
2. **ゴールを知ってから手順に入る。** 目的地を知らずに運転してはならない
3. **正常系と異常系を分ける。** Procedure は正常フロー、Exception は異常フロー
4. **セクション名は抽象概念で統一する。** 具体的な対処方法の名前をセクション名にしない
5. **エージェント = 関数。** In（引数）→ Procedure → Out（戻り値）。Work はローカル変数であり、Out が出たら削除する

---

## 2. セクション構造

```
---                          ← S0: YAML Frontmatter（Claude Code 外部規定）
name / description / tools / model
---

{役割宣言 1-3行}             ← S1: Identity（何者か）

## Activation                ← S2: なぜ / いつ始め / いつ終わるか
### Purpose                      なぜこのエージェントが存在するか
### Start Conditions             仕事を始められる前提条件
### End Conditions               仕事が完了した判定基準（= Out の一覧と対応）

## Ownership                 ← S3: In / Out / Work の定義
### In                           仕事開始時に存在する入力。読むだけ。変更しない
### Out                          仕事終了時の最終成果物。End Conditions に対応する
### Work                         作業中のみ使用する一時ファイル。Out 完成後に削除する

## Procedure                 ← S4: 何をするか（正常系）

## Rules                     ← S5: どう判断するか（任意、サブセクション自由）

## Exception                 ← S6: 異常時にどうするか
```

---

## 3. 各セクション定義

### 3.0 S0: YAML Frontmatter

Claude Code が規定する外部フォーマット。本フレームワークとして改変しない。

```yaml
---
name: agent-name
description: 1行の起動条件説明
tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
model: opus | sonnet | haiku | inherit
---
```

| フィールド | 説明 |
|-----------|------|
| name | エージェントの識別名（kebab-case） |
| description | Claude Code がエージェント選択時に参照する1行説明 |
| tools | このエージェントが使用可能なツール |
| model | 使用モデル。opus（高品質）/ sonnet（バランス）/ haiku（高速）/ inherit（親と同じ） |

### 3.1 S1: Identity

**目的:** このエージェントが何者かを宣言する。

**形式:** YAML Frontmatter 直後に、Markdown 見出しなしで 1-3 行の平文を置く。

```markdown
あなたは{役割名}です。
{責務の1行要約}。
```

**ルール:**
- 第1文は「あなたは〇〇です。」で始める
- 第2文以降で責務の範囲を要約する
- 3行を超えない。詳細は Procedure や Rules で書く

### 3.2 S2: Activation

**目的:** 仕事の契約を定義する。Purpose = 関数の責務、Start Conditions = 事前条件、End Conditions = 事後条件。

#### Purpose

このエージェントが存在する理由。1-2行。「何をするか」ではなく「なぜするか」を書く。

```markdown
### Purpose

{このエージェントが呼ばれる理由。解決する問題。1-2行。}
```

#### Start Conditions

仕事を始められる前提条件。チェックリスト形式。全条件を満たさないと作業開始不可。未達の場合は Exception に従う。

```markdown
### Start Conditions

- [ ] {前提条件1: 何が完了/存在していること}
- [ ] {前提条件2: 何が完了/存在していること}
```

#### End Conditions

仕事が完了した判定基準。チェックリスト形式。全条件を満たしたら完了。Ownership の Out と対応する。

```markdown
### End Conditions

- [ ] {完了条件1: 何が出力されていること}
- [ ] {完了条件2: 何がPASSしていること}
```

**ルール:**
- End Conditions の各項目は Ownership の Out に対応しなければならない（MUST）
- lead エージェントはフェーズ遷移時に End Conditions を検証する

### 3.3 S3: Ownership

**目的:** ファイルの入出力を定義する。エージェント = 関数として、In（引数）/ Out（戻り値）/ Work（ローカル変数）を明示する。

#### In（入力）

仕事開始時に存在するファイル。このエージェントは読むだけで変更しない（イミュータブル）。

```markdown
### In

| file_type | 提供元 | 用途 |
|-----------|--------|------|
| {file_type} | {作成者: user / agent名 / framework} | {何のために読むか} |
```

#### Out（出力）

仕事終了時の最終成果物。End Conditions に列挙された成果物と対応する。次のエージェントの In になる。

```markdown
### Out

| file_type | 出力先 | 次の消費者 |
|-----------|--------|-----------|
| {file_type} | {パス/命名パターン} | {この成果物を In として受け取るエージェント} |
```

#### Work（作業用）

作業中のみ使用する一時ファイル。ある場合のみ記載する。

```markdown
### Work

| ファイル | 用途 |
|---------|------|
| {ファイル名/パターン} | {何のために使うか} |
```

**Work の原則:**
- Out が完成したら **削除する**。ゴミを残さない
- 他エージェントは Work を参照しない。参照が必要なら **Out に昇格** させる
- 再利用しない。次の実行では新しい Work を作る
- Work がない場合は「なし」と記載する

**In / Out / Work の判断基準:**

| 問い | 答え | 分類 |
|------|------|:----:|
| 仕事の開始前から存在し、自分は変更しないか？ | Yes | **In** |
| End Conditions に含まれる成果物か？ | Yes | **Out** |
| 作業中にのみ使い、完了後に不要か？ | Yes | **Work** |

### 3.4 S4: Procedure

**目的:** 正常系の作業手順を定義する。

```markdown
## Procedure

1. {ステップ1: 動詞 + 目的語}
2. {ステップ2: 動詞 + 目的語}
   - {サブステップや補足}
3. ...
```

**ルール:**
- 番号付きステップで記述する
- 各ステップは動詞で始める
- Procedure は正常系のみ。異常時の分岐は Exception に書く

### 3.5 S5: Rules

**目的:** ドメイン固有の規則、判断基準、閾値、規約を定義する。

```markdown
## Rules

### {規則カテゴリ名}

{テーブル、箇条書き、または段落で規則を定義}
```

**ルール:**
- サブセクション構成はエージェントごとに自由
- 必要に応じて `### Constraints`（やってはならないこと）をサブセクションとして置いてよい
- 大きな規則体系は外部文書に分離し参照リンクを貼る（例: review-agent → review-standards-ja.md）

### 3.6 S6: Exception

**目的:** 異常条件と対応を定義する。

```markdown
## Exception

| 異常 | 対応 |
|------|------|
| {異常条件の説明} | {安全な対応。原則: 推測で進まない。lead に報告する} |
```

**共通原則:** わからないときは推測で進まない。lead に報告する。

**ルール:**
- Start Conditions 未達、Procedure 中の想定外、End Conditions 達成不能の3類型を網羅する
- 報告先は原則 lead。lead がユーザーに聞くかどうかは lead の判断
- 対応は「安全側に倒す動作」を記述する（停止する、判断を委ねる、選択肢を提示する等）

---

## 4. 必須/任意

| セクション | 必須 | 理由 |
|-----------|:----:|------|
| S0: YAML Frontmatter | Yes | Claude Code 外部規定 |
| S1: Identity | Yes | 役割宣言なしにプロンプトは機能しない |
| S2: Activation | Yes | 仕事の契約。これがなければ関数として成立しない |
| S3: Ownership | Yes | In/Out/Work の定義。file_type オーナーシップの唯一の正 |
| S4: Procedure | Yes | 作業指示の本体 |
| S5: Rules | 任意 | ドメイン固有。ないエージェントもありうる |
| S6: Exception | Yes | 異常系の未定義は暴走を招く |

---

## 5. セクション順序の設計根拠

| 順序 | セクション | 理由: なぜこの位置か |
|:----:|-----------|---------------------|
| S1 | Identity | まず自分が何者か知る |
| S2 | Activation | 次になぜ呼ばれたか（Purpose）、始められるか（Start）、ゴール（End）を理解する |
| S3 | Ownership | ゴールを知った上で In/Out/Work を確認する。ゴールなしにファイル一覧を読んでも意味がわからない |
| S4 | Procedure | ゴールとファイルを把握してから手順に入る |
| S5 | Rules | 手順の実行中に判断に迷ったら参照する |
| S6 | Exception | 異常時に参照する。正常系（Procedure）の後に配置することで、正常/異常の分離が明確になる |
