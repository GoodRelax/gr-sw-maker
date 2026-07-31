# 移植ガイド: 他AIプラットフォームへの対応手順

## 目的

本フレームワーク（gr-sw-maker）は Claude Code 上で構築されているが、フレームワークの本質的価値はプロセス規則（process-rules/）とプロンプト構造（S0-S6）にある。CLI固有のフロントマターやディレクトリ構造は「ガワ」であり、対象AIが自力で変換できる程度の差異である。

**本ガイドの想定読者はAIである。** 人間がひとつずつ手作業で変換する必要はない。対象AIプラットフォーム上で本ガイドを読ませ、自動変換を指示すればよい。それができないAIにこのフレームワークを使う能力はない。

## ファイル分類

### 変更不要（ポータブル）

以下はAIプラットフォームに依存しない。そのまま使用する:

| パス | 内容 |
|---|---|
| `framework-src/{lang}/process-rules/defect-taxonomy.md` | 不具合分類 |
| `framework-src/{lang}/process-rules/field-issue-handling-rules.md` | 実機テスト フィードバック管理規則 |
| `framework-src/{lang}/process-rules/spec-template.md` | 仕様テンプレート |
| `framework-src/{lang}/user-order.md` | ユーザー要求（3問形式） |

> **生成物のディレクトリ（`docs/`, `src/`, `tests/`, `infra/`, `project-management/`, `project-records/`）は本表に含めない。** これらは移植の対象ではなく、移植後のプロセスが出力する先である。移植で問われるのは「規則とプロンプトがそのまま使えるか」であって、出力先ディレクトリの互換性ではない。

### 一括置換で対応（ベンダー名・モデル名・パス）

| ファイル | 置換対象 |
|---|---|
| `framework-src/{lang}/process-rules/full-auto-dev-process-rules.md` | "Claude Code"、"Agent Teams"、モデル名 |
| `framework-src/{lang}/process-rules/full-auto-dev-document-rules.md` | `.claude/agents/`、`.claude/commands/` のパス |
| `framework-src/{lang}/process-rules/agent-list.md` | モデル割当表のモデル名 |
| `framework-src/{lang}/process-rules/prompt-structure.md` | "Claude Code"、`.claude/` パス、モデル名 |
| `framework-src/{lang}/process-rules/glossary.md` | "Claude Code" |
| `framework-src/{lang}/process-rules/review-standards.md` | `.claude/` パス |

> **モデル名は 2026-03 時点の割当である。** モデルは更新されるため、移植時は対象プラットフォームで利用可能な最新の対応モデルに読み替えること。

### フォーマット変換が必要

| 種別 | 現在のパス | 変換内容 |
|---|---|---|
| プロジェクト指示ファイル | `framework-src/{lang}/CLAUDE.md` | 対象プラットフォームの指示ファイルにリネーム・移動 |
| エージェント定義（本数は agent-list §1 参照） | `framework-src/{lang}/agents/*.md` | frontmatter（YAML）を対象形式に変換。本文（S0-S6）は流用 |
| カスタムコマンド | `framework-src/{lang}/commands/*.md` | 対象プラットフォームの実行方式に変換 |
| 設定ファイル | `.claude/settings*.json` | 対象プラットフォームの設定形式で新規作成 |

## エージェント・コマンドの言語選択

フレームワークは原本を `framework-src/ja/` と `framework-src/en/` の 2 ツリーで提供する。`setup.js` が選択した言語を作業位置へ展開する。

**Claude Code はエージェント名を frontmatter の `name:` フィールドから取得する。** ファイル名からは導出しない。したがって原本のファイル名は最初からサフィックスなしでよく、展開時のリネームは不要である。

### 言語の選び方

| # | 操作 | ユースケース |
|:-:|------|------------|
| 1 | `node setup.js ja` | 日本語プロジェクト |
| 2 | `node setup.js en` | 英語プロジェクト |
| 3 | `/translate-framework ja {lang}` の後に `node setup.js {lang}` | 日本語ベースで他言語プロジェクト |
| 4 | `/translate-framework en {lang}` の後に `node setup.js {lang}` | 英語ベースで他言語プロジェクト |

`/translate-framework` は `framework-src/{src}/` を読み、`framework-src/{target}/` を新たに作る。

### 移植先での扱い

移植先プラットフォームが `.claude/agents/` を持たない場合でも、**原本ツリー `framework-src/{lang}/` の構造はそのまま使える。** 展開先だけを対象プラットフォームの規約に合わせればよい。

> **注意:** `.claude/` 配下と `process-rules/` 直下は `setup.js` の出力であり、原本ではない。移植時に編集すべきは `framework-src/{lang}/` 側である。

---

## Claude Code 固有の機構

以下は Claude Code の機能に依存する。**他プラットフォームへ移植する際は省略してよい。** 省略してもプロセスは成立し、失われるのは自動検査だけである。

| 機構 | 用途 | 省略時の代替 |
|---|---|---|
| `tools/gate-guard.mjs`（`PreToolUse` フック） | ゲート未通過での `src/` `tests/` `infra/` 等への書込みを機械的に拒否する | 人間またはエージェントによる手動確認 |
| `tools/otel-sink.mjs`（OpenTelemetry の受け口） | コストとトークンを `session-state.json` に記録する。**主経路** | コスト追跡を手動記録に切り替える |
| `tools/session-meter.mjs`（`statusLine`） | 補助経路。CLI でのみ動き、コンテキスト使用率を記録する | 省略してよい |
| `.claude/settings.json` | 上記 2 つの登録先 | 不要 |

**省略した場合、コスト予算アラートとゲート強制は働かない。** その旨をプロジェクトの CLAUDE.md 相当ファイルに明記し、代替手段を決めること。

> **`statusLine` は Claude Code であっても、ステータス行を描画する環境でしか実行されない。デスクトップアプリでは発火しない。** 主経路を OpenTelemetry に置いたのはこのためである。ただし受け口が起動していなければテレメトリは黙って捨てられるため、プロセス側は `sink_heartbeat_at` の鮮度を検査して欠測を明示する規定を持つ（プロセス規則 §3.2.7）。

### gate-guard が守る対象

| 書込み先 | 通過が必要なゲート |
|---|---|
| `docs/api/` `docs/observability/` `docs/security/` | GATE-PLANNING |
| `src/` `tests/` `infra/` | GATE-DESIGN |
| `project-records/performance/` | GATE-IMPL |
| `final-report.md` | GATE-TEST |

`project-management/` と `project-records/reviews/` は常に許可する。**ゲートを通すための記録自体を止めると進行不能になる**ためである。

判定は「該当ゲートの合格レビューが `project-records/reviews/` に実在するか」のみを見る。レビューの内容が妥当かどうかは technical-authority の裁定であり、機械は判断しない。

**誤検知で作業が止まった場合は `GR_SW_MAKER_SKIP_GATE_GUARD=1` を設定する。** フックが不在・入力が壊れている・対象外のパスといった想定外の状況では、すべて書込みを許可する側に倒れる。検証器のバグで全作業が止まる事態を避けるためである。

---

## プラットフォーム別の変換仕様

### Claude Code → OpenAI Codex CLI

| 項目 | Claude Code | Codex CLI |
|---|---|---|
| プロジェクト指示 | `CLAUDE.md` | `AGENTS.md` |
| エージェント定義 | `.claude/agents/*.md` | `AGENTS.md` に統合（単一エージェント） |
| カスタムコマンド | `.claude/commands/*.md` | `prompt/` にプロンプトファイルとして配置 |
| 設定 | `.claude/settings.json` | 環境変数 + CLI引数 |
| モデル指定 | `model: opus` | `--model o3` |
| マルチエージェント | Agent Teams（並列実行） | 非対応（順次実行に変更） |

### Claude Code → Gemini CLI

| 項目 | Claude Code | Gemini CLI |
|---|---|---|
| プロジェクト指示 | `CLAUDE.md` | `GEMINI.md` |
| エージェント定義 | `.claude/agents/*.md` | `GEMINI.md` に統合 |
| カスタムコマンド | `.claude/commands/*.md` | `prompt/` にプロンプトファイルとして配置 |
| 設定 | `.claude/settings.json` | `.gemini/settings.json` |
| モデル指定 | `model: opus` | `gemini-2.5-pro` |
| マルチエージェント | Agent Teams（並列実行） | 非対応（順次実行に変更） |

### Claude Code → Cursor

| 項目 | Claude Code | Cursor |
|---|---|---|
| プロジェクト指示 | `CLAUDE.md` | `.cursor/rules/project.mdc` |
| エージェント定義 | `.claude/agents/*.md` | `.cursor/rules/` にルールファイルとして分割 |
| カスタムコマンド | `.claude/commands/*.md` | Notepads に配置 |
| 設定 | `.claude/settings.json` | IDE設定画面 |
| モデル指定 | `model: opus` | IDE設定で選択 |
| マルチエージェント | Agent Teams（並列実行） | Background Agent（単一） |

### Claude Code → Windsurf

| 項目 | Claude Code | Windsurf |
|---|---|---|
| プロジェクト指示 | `CLAUDE.md` | `.windsurfrules` |
| エージェント定義 | `.claude/agents/*.md` | `.windsurfrules` に統合 |
| カスタムコマンド | `.claude/commands/*.md` | ルールファイルに統合 |
| 設定 | `.claude/settings.json` | IDE設定 |
| マルチエージェント | Agent Teams（並列実行） | Cascade（内部マルチステップ） |

### Claude Code → Cline

| 項目 | Claude Code | Cline |
|---|---|---|
| プロジェクト指示 | `CLAUDE.md` | `.clinerules` |
| エージェント定義 | `.claude/agents/*.md` | `.cline/` + カスタムモード定義JSON |
| カスタムコマンド | `.claude/commands/*.md` | カスタムモードに統合 |
| 設定 | `.claude/settings.json` | VSCode拡張設定 |
| マルチエージェント | Agent Teams（並列実行） | 非対応（モード切替で代替） |

### Claude Code → Roo Code

| 項目 | Claude Code | Roo Code |
|---|---|---|
| プロジェクト指示 | `CLAUDE.md` | `.roo/rules/project.md` |
| エージェント定義 | `.claude/agents/*.md` | `.roo/rules/` にモード別ルール配置 |
| カスタムコマンド | `.claude/commands/*.md` | カスタムモード定義に統合 |
| 設定 | `.claude/settings.json` | VSCode拡張設定 |
| マルチエージェント | Agent Teams（並列実行） | モード切替（疑似マルチ） |

### Claude Code → Aider

| 項目 | Claude Code | Aider |
|---|---|---|
| プロジェクト指示 | `CLAUDE.md` | `CONVENTIONS.md` |
| エージェント定義 | `.claude/agents/*.md` | `CONVENTIONS.md` にロール記述として統合 |
| カスタムコマンド | `.claude/commands/*.md` | シェルスクリプト + プロンプトファイル |
| 設定 | `.claude/settings.json` | `.aider.conf.yml` |
| モデル指定 | `model: opus` | `model: gpt-4.1` 等 |
| マルチエージェント | Agent Teams（並列実行） | 非対応（手動切替） |

## モデルマッピング推奨値

エージェント定義内のモデル指定を置換する際の推奨マッピング:

| 役割ランク | Claude | OpenAI | Google | 用途 |
|---|---|---|---|---|
| 高（判断・設計） | opus | o3 | gemini-2.5-pro | orchestrator, architect, review-agent, security-reviewer, srs-writer, implementer, field-issue-analyst |
| 中（定型作業） | sonnet | gpt-4.1 / gpt-4.1-mini | gemini-2.5-flash | test-engineer, progress-monitor, change-manager, risk-manager, framework-translation-verifier, user-manual-writer, runbook-writer, incident-reporter, process-improver, decree-writer, field-test-engineer, feedback-classifier |
| 低（単純ルール） | haiku | gpt-4.1-mini | gemini-2.5-flash | license-checker, kotodama-kun |

> 推奨値はPoC検証で調整すること。各モデルの能力・コスト・速度バランスはプラットフォームごとに異なる。

## 移植手順（AIへの指示例）

対象AIに以下のように指示する:

```
このリポジトリは Claude Code 用の全自動開発フレームワークである。
framework-src/{lang}/process-rules/porting-guide.md の変換仕様に従い、
[対象プラットフォーム名] 用に変換せよ。

1. エージェント・コマンドの言語を選択する（本プロジェクトの主言語: [ja/en/他]）
   - .claude/agents/*-[lang].md → .claude/agents/*.md にリネーム（またはベース言語から翻訳）
   - .claude/commands/*-[lang].md → .claude/commands/*.md にリネーム（またはベース言語から翻訳）
2. ポータブルファイルはそのまま残す
3. process-rules/ 内のベンダー固有記述を一括置換する
4. CLAUDE.md を [対象ファイル名] にリネームし、ベンダー固有記述を書き換える
5. .claude/agents/*.md のプロンプト本文（S0-S6）を抽出し、[対象形式] に変換する
6. .claude/commands/*.md を [対象実行方式] に変換する
7. .claude/settings*.json を [対象設定形式] に変換する
8. 不要になった .claude/ ディレクトリを削除する
```


## 構造的制約

Agent Teams によるマルチエージェント並列実行は 2026年3月時点で Claude Code 固有の機能である。他プラットフォームでは以下の代替を検討すること:

- **順次実行:** 1エージェントが全ロールを順番に担当する（最も単純）
- **モード切替:** Cline / Roo Code のカスタムモードでロールを切り替える
- **シェルスクリプト擬似並列:** 複数CLIプロセスを並列起動する（Aider / Codex CLI）
- **外部オーケストレータ:** Agent SDK 等で独自にマルチエージェントを構築する
