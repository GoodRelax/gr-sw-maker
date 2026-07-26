# 実機テスト フィードバック管理規則

> **本文書の位置づけ:** 実機テストフェーズにおけるユーザーフィードバックの管理プロセスを定義する規則（Single Source of Truth）。条件付きプロセス「実機テスト」が有効な場合に適用する。
> **導出元:** [プロセス規則](full-auto-dev-process-rules.md) §4.6（testing フェーズ）
> **関連文書:** [エージェント一覧](agent-list.md)、[文書管理規則](full-auto-dev-document-rules.md) §7・§9（field-issue file_type）、[レビュー観点規約](review-standards.md)

---

## 1. 目的とスコープ

**目的:**

- ユーザーフィードバックを仕様書と照合し、defect（不具合）か CR（仕様変更）かを正確に分類する
- コード変更前に必須ゲートを設け、Regression と技術的負債の蓄積を防止する
- 仕様書とコードの乖離を防止する

**スコープ:**

- 実機テストフェーズ（ユーザーと一緒にテストする作業）で発生するフィードバックに適用する
- 自動テストで検出される不具合は対象外（従来の defect プロセスを使用する）

**有効化条件:**

CLAUDE.md の条件付きプロセスで「実機テスト: 有効」が設定されている場合に本規則が適用される。HW連携、実機デバイス、ユーザー立会テストを伴うプロジェクトが主な対象。

---

## 2. field-issue と既存 file_type の関係

field-issue は実機テストフェーズ専用の正式記録であり、既存の defect / change-request とは発見フェーズ・発見者で明確に分離される。

| 発見フェーズ | 発見者 | file_type | owner |
|---|---|---|---|
| 自動テスト（testing） | test-engineer | defect | test-engineer |
| 仕様承認後のユーザー変更要求 | ユーザー | change-request | change-manager |
| 実機テスト（testing, 条件付き） | field-test-engineer | field-issue | field-test-engineer |

**設計方針:**

- field-issue は単独管理とする。解決後に defect / change-request への転記は行わない
- field-issue 自体が正式記録であり、二重管理を排除する
- メトリクス集計では field-issue を defect curve・CR 集計に統合する（§9 参照）
- 自動テストで先に発見されていた defect との関連付けには `field-issue:related_defect_id` フィールドを使用する

---

## 3. エージェントロール

本規則で使用するエージェントの役割・責務は [エージェント一覧](agent-list.md) を参照（Single Source of Truth）。本規則では重複定義しない。

本規則に関与するエージェント: field-test-engineer, feedback-classifier, field-issue-analyst, orchestrator, srs-writer, architect, implementer, review-agent, test-engineer

---

## 4. ステータス遷移フロー

**フロー図:**

```mermaid
flowchart TD
    Start["ユーザーのフィードバック"]
    FTE["field-test-engineer<br/>現象とログを記録"]
    FC{"feedback-classifier<br/>仕様書と照合"}
    DEF["type: defect"]
    CR["type: cr"]
    Q["質問<br/>その場で回答"]

    FIA_D1["field-issue-analyst<br/>原因分析"]
    FIA_D2["field-issue-analyst<br/>原因判明<br/>全要因の特定完了"]
    FIA_D3["field-issue-analyst<br/>対策立案<br/>影響範囲 副作用<br/>代替案比較"]
    FIA_D4["field-issue-analyst<br/>対策確定"]

    FIA_C1["field-issue-analyst<br/>対策立案<br/>影響範囲 副作用<br/>代替案比較"]
    FIA_C2["field-issue-analyst<br/>対策確定"]

    ORC["orchestrator<br/>承認"]
    USR["ユーザー<br/>承認"]
    SPEC["srs-writer / architect<br/>仕様書更新"]
    SREV["review-agent<br/>仕様書レビュー<br/>R2 R4 R5"]
    IMP["implementer<br/>コード修正"]
    CREV["review-agent<br/>コードレビュー<br/>R2 R3 R4 R5"]
    TE["test-engineer<br/>自動テスト実行"]
    FTE2["field-test-engineer<br/>実機検証"]
    DONE["verified"]

    Start -->|"報告"| FTE
    FTE -->|"reported"| FC
    FC -->|"仕様内の不具合"| DEF
    FC -->|"仕様外の要求"| CR
    FC -->|"質問"| Q

    DEF -->|"classified"| FIA_D1
    FIA_D1 -->|"in-analysis"| FIA_D2
    FIA_D2 -->|"cause-identified"| FIA_D3
    FIA_D3 -->|"in-planning"| FIA_D4
    FIA_D4 -->|"solution-proposed"| ORC

    CR -->|"classified"| FIA_C1
    FIA_C1 -->|"in-planning"| FIA_C2
    FIA_C2 -->|"solution-proposed"| USR

    ORC -->|"approved"| SPEC
    USR -->|"approved"| SPEC
    SPEC -->|"spec-updated"| SREV
    SREV -->|"spec-reviewed"| IMP
    IMP -->|"fixed"| CREV
    CREV -->|"code-reviewed"| TE
    TE -->|"tested"| FTE2
    FTE2 -->|"実機OK"| DONE
```

---

## 5. ステータス定義

| ステータス | defect での意味 | CR での意味 |
|---|---|---|
| `reported` | フィードバック記録済み | 同左 |
| `classified` | 仕様照合完了・defect 確定 | 仕様照合完了・CR 確定 |
| `in-analysis` | 原因分析中 | ー（スキップ） |
| `cause-identified` | 原因判明・全要因の特定完了 | ー（スキップ） |
| `in-planning` | 対策立案中 | 対策立案中 |
| `solution-proposed` | 対策確定・承認待ち | 対策確定・承認待ち |
| `approved` | 修正着手 OK | 実装着手 OK |
| `spec-updated` | 仕様書更新済み（必要時のみ） | 仕様書更新済み（必須） |
| `spec-reviewed` | 仕様書レビュー PASS（R2/R4/R5） | 同左 |
| `fixed` | コード修正完了 | コード修正完了 |
| `code-reviewed` | コードレビュー PASS（R2/R3/R4/R5） | 同左 |
| `tested` | 自動テスト全テスト PASS | 同左 |
| `verified` | 実機検証 PASS | 同左 |

---

## 6. ゲート条件

各ステータス遷移には以下のゲート条件を満たす必要がある（MUST）。

### 6.1 reported → classified

| 項目 | 内容 |
|---|---|
| 担当 | feedback-classifier |
| 入力 | フィードバック記録（現象・ログ・再現手順） |
| 実施内容 | 仕様書（`docs/spec/`）と照合し、type を判定する |
| 判定基準 | 仕様書に記載された動作と異なる → `defect`、仕様書に記載がない要求 → `cr`、情報提供の依頼 → `質問`（チケット不要） |
| 出力 | チケットに `type` フィールドを設定 |

### 6.2 classified → in-analysis（defect のみ）

| 項目 | 内容 |
|---|---|
| 担当 | field-issue-analyst |
| 入力 | classified チケット + 関連するソースコード |
| 実施内容 | 根本原因の調査を開始する |
| ゲート条件 | なし（classified 完了後に自動遷移） |

### 6.3 in-analysis → cause-identified（defect のみ）

| 項目 | 内容 |
|---|---|
| 担当 | field-issue-analyst |
| 実施内容 | 全要因を特定し、根本原因分析（Why-Why）を完了する |
| ゲート条件 | 以下を全て満たすこと: |
| | - 根本原因が特定されている |
| | - 複合要因の場合、全ての要因が列挙されている |
| | - 各要因の因果関係が明確である |
| 出力 | チケットに根本原因分析の結果を記載 |

### 6.4 cause-identified → in-planning（defect）/ classified → in-planning（CR）

| 項目 | 内容 |
|---|---|
| 担当 | field-issue-analyst |
| 実施内容 | 対策案を立案し、以下の 3 点を分析する |
| | 1. **影響範囲**: 変更が及ぶファイル・モジュール・機能の一覧 |
| | 2. **副作用**: 変更によって壊れる可能性のある既存機能 |
| | 3. **代替案比較**: 複数の対策案を比較し、推奨案を提示 |
| ゲート条件 | 上記 3 点の分析が完了していること |
| 出力 | チケットに対策案・影響分析・副作用分析・代替案比較を記載 |

### 6.5 in-planning → solution-proposed

| 項目 | 内容 |
|---|---|
| 担当 | field-issue-analyst |
| 実施内容 | 対策案を確定する |
| ゲート条件 | 以下を全て満たすこと: |
| | - 推奨対策案が 1 つに絞られている |
| | - 影響範囲が全て列挙されている |
| | - 仕様書の更新要否が判定されている |
| | - 必要なテストケースの追加要否が判定されている |
| 出力 | 確定した対策案の記載 |

### 6.6 solution-proposed → approved

| 項目 | 内容 |
|---|---|
| 担当（defect） | orchestrator |
| 担当（CR） | ユーザー |
| 実施内容 | 対策案を承認する |
| ゲート条件 | 承認者が対策案の内容を確認し、明示的に承認すること |
| 出力 | チケットのステータスを `approved` に変更 |

**重要: `approved` になるまで implementer はコードに触れてはならない（MUST NOT）。**

### 6.7 approved → spec-updated

| 項目 | 内容 |
|---|---|
| 担当 | srs-writer（Ch1-2）/ architect（Ch3-6） |
| 実施内容 | 承認された対策案に基づき仕様書を更新する |
| ゲート条件（CR） | 仕様書の更新が完了していること（必須） |
| ゲート条件（defect） | 仕様の曖昧さが原因の場合、仕様書の更新が完了していること。更新不要の場合はスキップ可 |
| 出力 | 更新済みの仕様書 |

**重要: implementer は更新された仕様書に基づいてコードを修正する。仕様書が更新される前にコードを修正してはならない（MUST NOT）。**

### 6.8 spec-updated → spec-reviewed

| 項目 | 内容 |
|---|---|
| 担当 | review-agent |
| 実施内容 | 更新された仕様書の品質レビュー（R2/R4/R5 観点）を行う |
| ゲート条件 | Critical / High 指摘が 0 件であること |
| 出力 | レビュー報告（`project-records/reviews/`） |

**重要: 仕様書レビューが PASS する前に implementer がコードを修正してはならない（MUST NOT）。**

### 6.9 spec-reviewed → fixed

| 項目 | 内容 |
|---|---|
| 担当 | implementer |
| 実施内容 | レビュー済みの仕様書に基づきコードを修正する |
| ゲート条件 | 以下を全て満たすこと: |
| | - 対策案の範囲のみを修正している（スコープ外の変更を含まない） |
| | - 仕様書の内容とコードが整合している |
| 出力 | 修正済みコード |

### 6.10 fixed → code-reviewed

| 項目 | 内容 |
|---|---|
| 担当 | review-agent |
| 実施内容 | 修正コードの品質レビュー（R2/R3/R4/R5 観点）を行う |
| ゲート条件 | Critical / High 指摘が 0 件であること |
| 出力 | レビュー報告（`project-records/reviews/`） |

### 6.11 code-reviewed → tested

| 項目 | 内容 |
|---|---|
| 担当 | test-engineer |
| 実施内容 | 自動テストを実行し全テスト PASS を確認する |
| ゲート条件 | 全テスト PASS |
| 出力 | テスト実行結果 |

### 6.12 tested → verified

| 項目 | 内容 |
|---|---|
| 担当 | field-test-engineer |
| 実施内容 | 実機でユーザーと動作を確認する |
| ゲート条件 | 以下を全て満たすこと: |
| | - 影響分析で列挙された機能が正常に動作する |
| | - ユーザーが実機での動作を確認し OK とする |
| 出力 | チケットのステータスを `verified` に変更 |

---

## 7. defect と CR の差分ルール

| 観点 | defect | CR |
|---|---|---|
| 定義 | 仕様書に記載された動作と実装が異なる | 仕様書に記載されていない新たな要求 |
| 原因分析 | 必須（in-analysis → cause-identified） | 不要（スキップ） |
| 対策立案 | 必須 | 必須 |
| 承認者 | orchestrator | ユーザー |
| 仕様書更新 | 仕様の曖昧さが原因の場合のみ（スキップ可） | 必須 |

---

## 8. 禁止事項

1. **`approved` 前のコード変更禁止**: ステータスが `approved` になる前に implementer がコードを変更してはならない（MUST NOT）
2. **hotfix によるプロセス省略禁止**: 緊急性が高い場合でも本規則のステータス遷移を省略してはならない（MUST NOT）。ただし各ステップの記載量は簡潔でよい
3. **仕様書更新前のコード変更禁止**: `spec-updated` になる前に implementer がコードを変更してはならない（MUST NOT）
4. **テスト未実行の報告禁止**: 自動テスト全テスト PASS を確認せずにユーザーに修正完了を報告してはならない（MUST NOT）
5. **レビュー省略禁止**: review-agent による品質レビューを省略してはならない（MUST NOT）

---

## 9. メトリクス横断集計ルール

field-issue は defect / change-request とは別の file_type だが、プロジェクト全体の品質メトリクスでは横断集計する。

### 9.1 defect curve への統合

progress-monitor が defect curve を集計する際、以下のルールに従う:

| ソース | found_cumulative への加算条件 | fixed_cumulative への加算条件 |
|---|---|---|
| defect（test-engineer 所有） | `defect:defect_status` が `open` に遷移した時点 | `defect:defect_status` が `closed` に遷移した時点 |
| field-issue（type: defect） | `field-issue:status` が `classified` に遷移した時点 | `field-issue:status` が `verified` に遷移した時点 |

### 9.2 CR 集計への統合

| ソース | カウント条件 |
|---|---|
| change-request（change-manager 所有） | `change-request:change_request_status` が `submitted` に遷移した時点 |
| field-issue（type: cr） | `field-issue:status` が `classified` に遷移した時点 |

### 9.3 集計対象外

field-issue のうち feedback-classifier が「質問」と判定したものはチケット化されないため、集計対象外とする。

---

## 10. チケット管理

### 10.1 管理ディレクトリ

`project-records/field-issues/`

defect と CR を同一ディレクトリで管理し、チケット内の `type` フィールドで区別する。

### 10.2 ステータスの記録場所

チケットの Form Block 内 `field-issue:status` フィールドに現在のステータスを記録する。ステータス変更時はチケットを更新する。

### 10.3 チケットのフォーマット

チケットのフォーマット（Common Block / Form Block の構造）は [文書管理規則](full-auto-dev-document-rules.md) に従う。`field-issue` file_type として定義する。

### 10.4 チケットの owner

チケットの owner は **field-test-engineer** とする。他のエージェント（feedback-classifier、field-issue-analyst）はチケットに追記する形で情報を蓄積する。
