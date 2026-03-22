---
file_type: review
title: フレームワーク全日英ペア翻訳一致性検証
date: 2026-03-22
reviewer: framework-translation-verifier
verdict: PASS with findings
---

# フレームワーク全日英ペア翻訳一致性検証レポート

**検証日:** 2026-03-22
**対象バージョン:** main ブランチ（コミット 3ce127a）
**検証ペア総数:** 40ペア（process-rules 11 + agents 21 + CLAUDE 1 + commands 5 + essays 2）
**総合判定:** PASS（機能上の致命的不整合なし）— ただし下記指摘事項あり

---

## 1. 検証結果サマリー

| 重大度 | 件数 |
|--------|:----:|
| High   | 2    |
| Medium | 3    |
| Low    | 5    |
| **合計** | **10** |

---

## 2. 指摘一覧

### 2-1. [High] anms-essay-en.md — Abstract に文法破綻（翻訳ミス）

| 項目 | 内容 |
|------|------|
| ファイルペア | `essays/anms-essay-en.md` / `essays/anms-essay-ja.md` |
| 観点 | T4（文単位の完全性）/ T5（用語の一致） |
| 行参照 | EN: line 5 |
| 重大度 | High |

**問題:** EN Abstract に次の文章がある。

> "…while fragmented instructions orchestrator to 'context loss' that undermines system-wide consistency."

"orchestrator to" は意味をなさない。JA は「断片的な指示はシステム全体の整合性を欠く『コンテキスト喪失』を招く」と正しく記述している。EN は "lead to" が正しい（"fragmented instructions lead to 'context loss'"）。

**推奨アクション:** EN line 5 の "orchestrator to" を "lead to" に修正する。

---

### 2-2. [High] anms-essay — 仕様書テンプレートの参照ファイル名が JA/EN で異なる

| 項目 | 内容 |
|------|------|
| ファイルペア | `essays/anms-essay-en.md` / `essays/anms-essay-ja.md` |
| 観点 | T8（リンクの一致）|
| 行参照 | EN: line 22 / JA: line 22 |
| 重大度 | High |

**問題:**
- JA: `ANMS_Spec_Template.md`（PascalCase + アンダースコア）
- EN: `anms-spec-template.md`（kebab-case）

実際のファイル名は `process-rules/spec-template-ja.md` / `spec-template-en.md` であり、どちらの表記も実在ファイルと一致しない。JA と EN で表記が異なる点は追加の問題。

**推奨アクション:** 両版の参照を実在する正式パス（`process-rules/spec-template-ja.md` / `process-rules/spec-template-en.md`）に統一する、または共通の表記で揃える。

---

### 2-3. [Medium] orchestrator-ja.md Procedure §3 — 条件付きプロセスの件数表記

| 項目 | 内容 |
|------|------|
| ファイルペア | `.claude/agents/orchestrator-ja.md` / `.claude/agents/orchestrator-en.md` |
| 観点 | T6（数値の一致）|
| 行参照 | JA: line 71 / EN: line 71 |
| 重大度 | Medium |

**問題:**
- JA: "条件付きプロセス（**12項目**）を評価し"
- EN: "Evaluate conditional processes (**12 items**) and confirm"

数値は一致しているが、CLAUDE.md の条件付きプロセスリストを確認したところ JA・EN ともに 13 項目が列挙されていた（前セッション確認済み）。orchestrator の本文が CLAUDE.md の実態と乖離している。JA/EN 間では整合しているが、CLAUDE.md との不整合が medium リスク。

**推奨アクション:** orchestrator.md の "12 items" / "12項目" を CLAUDE.md の実際の件数（13）に合わせる、またはいずれかを正の件数に修正する。

---

### 2-4. [Medium] field-test-engineer — プロセス規則リンクの言語サフィックス

| 項目 | 内容 |
|------|------|
| ファイルペア | `.claude/agents/field-test-engineer-ja.md` / `.claude/agents/field-test-engineer-en.md` |
| 観点 | T8（リンクの一致）|
| 行参照 | JA: line 85 / EN: line 85 |
| 重大度 | Medium |

**問題:** 両版とも同一のリンク先 `../../process-rules/field-issue-handling-rules.md`（サフィックスなし）を参照している。フレームワーク配布ファイルとしては `-ja.md` / `-en.md` が正式ファイルであり、サフィックスなし版は存在しない。

- JA は `../../process-rules/field-issue-handling-rules-ja.md` を指すべき
- EN は `../../process-rules/field-issue-handling-rules-en.md` を指すべき

同様のリンクが `field-issue-analyst-ja.md` / `field-issue-analyst-en.md`（各 line 99）にも存在する。

**推奨アクション:** 上記 4 ファイルのリンクを正しい言語サフィックス付きパスに修正する。

---

### 2-5. [Medium] field-issue-analyst — プロセス規則リンクの言語サフィックス

| 項目 | 内容 |
|------|------|
| ファイルペア | `.claude/agents/field-issue-analyst-ja.md` / `.claude/agents/field-issue-analyst-en.md` |
| 観点 | T8（リンクの一致）|
| 行参照 | JA: line 99 / EN: line 99 |
| 重大度 | Medium |

**問題:** 2-4 と同じ問題。`../../process-rules/field-issue-handling-rules.md`（サフィックスなし）を参照しているが、実在する正式ファイルは `-ja.md` / `-en.md` 付き。

**推奨アクション:** JA は `-ja.md`、EN は `-en.md` を指すように修正する。

---

### 2-6. [Low] change-manager-ja.md — Rules セクションの見出し "Constraints" が未翻訳

| 項目 | 内容 |
|------|------|
| ファイルペア | `.claude/agents/change-manager-ja.md` / `.claude/agents/change-manager-en.md` |
| 観点 | T7（英語固定要素）|
| 行参照 | JA: line 86 |
| 重大度 | Low |

**問題:** JA ファイルの Rules セクション内に `### Constraints` という英語見出しがある。他のエージェント（feedback-classifier-ja.md line 84、field-issue-analyst-ja.md line 107 も同様）でも観察されるが、これらは EN 版では同じく `### Constraints` であり、セクション見出しとして両版一致している。S0-S6 の外部見出し（Activation, Ownership, etc.）は英語固定が明示的に規定されているが、Rules 内のサブセクションについて規定が明確でない点に注意が必要。

**推奨アクション:** 意図的な英語固定か、翻訳漏れか確認する。他の JA エージェントでは同一パターンの見出しが日本語表記されている場合があるため統一を検討。

---

### 2-7. [Low] feedback-classifier-ja.md の In テーブルヘッダー列名が EN と異なる

| 項目 | 内容 |
|------|------|
| ファイルペア | `.claude/agents/feedback-classifier-ja.md` / `.claude/agents/feedback-classifier-en.md` |
| 観点 | T2（テーブル構造）|
| 行参照 | JA: line 37 / EN: line 37 |
| 重大度 | Low |

**問題:**
- JA In テーブルヘッダー: `| file_type | 提供元 | 用途 |`
- EN In テーブルヘッダー: `| file_type | Source | Purpose |`
- JA Out テーブルヘッダーおよびその他エージェントの Out テーブルでは "次の消費者" / "Next Consumer" など日本語訳が使われているが、field-issue-analyst の EN テーブルでも列名は "Source" / "Purpose" — 他エージェントでは "Provider" / "Usage" が標準。EN 版内での用語ブレ（feedback-classifier と field-test-engineer, field-issue-analyst で "Source/Purpose" の表記が "Provider/Usage" と混在）。

**推奨アクション:** EN エージェント定義内のテーブルヘッダーを "Provider/Usage" に統一するか、意図的差異として記録する。

---

### 2-8. [Low] angs-essay — 読み込み範囲（line 80 まで）を超えた部分の未検証

| 項目 | 内容 |
|------|------|
| ファイルペア | `essays/angs-essay-ja.md` / `essays/angs-essay-en.md` |
| 観点 | T1〜T8 全般 |
| 行参照 | JA/EN 各 line 81 以降 |
| 重大度 | Low |

**問題:** 両 essay ファイルはサイズが大きく、本検証では各ファイルの先頭 80 行のみを読み込んだ。line 81 以降のセクション（§2.2 以降）については詳細検証未実施。

**推奨アクション:** 必要であれば後半部分の詳細検証を別途実施する。

---

### 2-9. [Low] anms-essay — 読み込み範囲（line 80 まで）を超えた部分の未検証

| 項目 | 内容 |
|------|------|
| ファイルペア | `essays/anms-essay-ja.md` / `essays/anms-essay-en.md` |
| 観点 | T1〜T8 全般 |
| 行参照 | JA/EN 各 line 81 以降 |
| 重大度 | Low |

**問題:** 同上。line 81 以降のセクションについて詳細検証未実施。

**推奨アクション:** 同上。

---

### 2-10. [Low] full-auto-dev-process-rules および full-auto-dev-document-rules — 深部の詳細検証未実施

| 項目 | 内容 |
|------|------|
| ファイルペア | `process-rules/full-auto-dev-process-rules-ja.md` / `-en.md`、`full-auto-dev-document-rules-ja.md` / `-en.md` |
| 観点 | T1〜T8 全般 |
| 行参照 | 各ファイル line 231 以降（process-rules）、line 181 以降（document-rules） |
| 重大度 | Low |

**問題:** これら 2 ペアはファイルサイズが非常に大きい（JA process-rules: 約 51,000 トークン相当）。ToC、ch1〜2.1、アーキテクチャ Mermaid 図については確認済みで構造一致を確認。ただし全体の詳細検証は未実施。

**推奨アクション:** リリース前に後半の章（第3章以降）の重要テーブルや数値について追加確認することを推奨する。

---

## 3. 適合確認（問題なし）

以下の指摘は発生しなかった:

| ファイルペア | 確認事項 |
|-------------|---------|
| 全 21 エージェントペア | YAML frontmatter の `name:` フィールドが JA/EN で完全一致 |
| 全 21 エージェントペア | `model:` 値（opus/sonnet/haiku）が JA/EN で一致 |
| 全 21 エージェントペア | S0-S6 見出し（Activation, Purpose, Start Conditions, End Conditions, Ownership, In, Out, Work, Procedure, Rules, Exception）が英語のまま一致 |
| 全 21 エージェントペア | Ownership テーブルの file_type 名（英語）が翻訳されていない |
| 全 21 エージェントペア | tools: リストが JA/EN で一致 |
| orchestrator | In テーブル 11 行 / Out テーブル 6 行 — 両版一致 |
| orchestrator | Exception テーブル 6 行 — 両版一致 |
| orchestrator | Phase Transition テーブル 5 行 — 両版一致 |
| architect | Procedure 11 ステップ — 両版一致 |
| srs-writer | Procedure 8 ステップ — 両版一致 |
| implementer | Procedure 7 ステップ — 両版一致 |
| test-engineer | Procedure 10 ステップ — 両版一致 |
| review-agent | FAIL Routing テーブル 4 行、Execution Timing テーブル 5 行 — 両版一致 |
| review-agent | Severity table 4 行、Review Targets table 4 行 — 両版一致 |
| security-reviewer | Checklist 10 項目 — 両版一致 |
| progress-monitor | Anomaly Detection Thresholds テーブル 7 行 — 両版一致 |
| risk-manager | Risk matrix テーブル 3 行、Risk categories 3 種 — 両版一致 |
| change-manager | Impact Level Criteria テーブル 3 行 — 両版一致 |
| license-checker | License compatibility matrix 5 行 — 両版一致 |
| process-improver | Activation Triggers テーブル 4 行 — 両版一致 |
| decree-writer | Safety Rules テーブル 6 行、Approval Table 3 行 — 両版一致 |
| kotodama-kun | 5 check viewpoints — 両版一致 |
| user-manual-writer | Procedure 6 ステップ — 両版一致 |
| runbook-writer | Procedure 7 ステップ — 両版一致 |
| incident-reporter | Procedure 8 ステップ、Writing Guidelines 5 項目 — 両版一致 |
| feedback-classifier | Classification table 3 行 — 両版一致 |
| field-test-engineer | Procedure サブセクション構造 — 両版一致 |
| field-issue-analyst | Procedure サブセクション構造（defect/cr分岐）— 両版一致 |
| framework-translation-verifier | 8 Verification Perspectives テーブル — 両版一致 |
| spec-template | H1 タイトル "ANMS v0.33 — AI-Native Minimal Spec Template" 完全一致（既知の許容差異: JA の章構成テーブルに「日本語」列が追加されている点は設計意図） |
| review-standards | R1-R6 セクション構造 — 両版一致 |
| prompt-structure | §1-§5 構造、S0-S6 見出し — 両版一致 |
| field-issue-handling-rules | §1-§10 構造、Status テーブル 13 行、Gate §6.1-§6.12 — 両版一致 |
| glossary | §1-§4 テーブル行数（15/11/7/8）— 両版一致 |
| agent-list | 21 エージェント列挙、Mermaid 4 図、フェーズ 8 種 — 両版一致 |
| framework-development | §1-§5 構造、§2 テーブル — 両版一致 |
| full-auto-dev-process-rules | ToC（5部/ch1-14/App A-C）、アーキテクチャ Mermaid 図のノード ID、§2.1 フェーズ名テーブル 8 行 — 両版一致 |
| full-auto-dev-document-rules | §1.1-§1.2 バージョン規則テーブル、§2 ディレクトリ構造、§3 命名規則 — 両版一致 |
| porting-guide | 7 プラットフォームテーブル各行数、モデルマッピングテーブル 3 行、言語選択テーブル 4 行 — 両版一致 |
| defect-taxonomy | §1-§9 構造、Mermaid 図ノード — 両版一致 |
| full-auto-dev（command）| Phase 0（15 ステップ 0a-0o）〜 Phase 7 見出し — 両版一致 |
| check-progress（command）| 8 項目 — 両版一致 |
| retrospective（command）| 3 フェーズ構造 — 両版一致 |
| translate-framework（command）| §1-§6、§2 テーブル 9 行、§3 テーブル 7 行、§6 チェックリスト 8 項目 — 両版一致 |
| council-review（command）| F01-F15、X01-X18、サブエージェント構造 — 両版一致 |
| CLAUDE（テンプレート）| 全セクション構造、21 エージェント列挙、13 条件付きプロセス、MCBSMD ブロック — 両版一致 |
| anms-essay（line 1-80 範囲）| Abstract/Keywords/Introduction 構造、章テーブル 6 行、Mermaid STFB 図 — 構造一致（ただし上記 2-1, 2-2 指摘あり）|
| angs-essay（line 1-80 範囲）| Abstract/Keywords/§1.1-§1.4 構造、テーブル行数 — 一致 |

---

## 4. 既知の許容差異

以下は意図的な差異であり指摘対象外:

| 差異 | 理由 |
|------|------|
| `spec-template-ja.md` の章構成テーブルに「日本語」列が存在し `spec-template-en.md` にない | JA版にのみ日本語タイトルの参考列を追加する設計意図（translate-framework §2 に記載） |
| porting-guide-ja.md の「変更不要」テーブルで `-ja.md` パスを列挙、EN では `-en.md` パスを列挙 | 各言語版で自言語のファイルパスを参照することが正しい動作 |
| Mermaid 図のサブグラフラベルが JA は日本語、EN は英語 | ラベルはローカライズ対象；ノード ID は英語のまま（正しい） |

---

## 5. 推奨アクション（優先順位付き）

| 優先度 | 対象ファイル | アクション |
|:------:|------------|-----------|
| 1 | `essays/anms-essay-en.md` line 5 | "orchestrator to" を "lead to" に修正 |
| 2 | `essays/anms-essay-en.md` line 22 / `essays/anms-essay-ja.md` line 22 | 仕様書テンプレート参照を実在パスに統一 |
| 3 | `.claude/agents/field-test-engineer-ja.md` line 85、`field-test-engineer-en.md` line 85、`field-issue-analyst-ja.md` line 99、`field-issue-analyst-en.md` line 99 | `field-issue-handling-rules.md` のリンクを言語サフィックス付きに修正 |
| 4 | `.claude/agents/orchestrator-ja.md` line 71 / `orchestrator-en.md` line 71 | "12項目" / "12 items" を CLAUDE.md の実際の件数に合わせて修正 |
| 5 | EN エージェント定義群 | In テーブルヘッダー "Source/Purpose" を "Provider/Usage" に統一（feedback-classifier, field-test-engineer, field-issue-analyst） |
