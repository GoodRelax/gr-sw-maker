# 移植ガイド: 他AIプラットフォームへの対応手順

## 目的

本フレームワーク（gr-sw-maker）は Claude Code 上で構築されているが、フレームワークの本質的価値はプロセス規則（process-rules/）とプロンプト構造（S0-S6）にある。CLI固有のフロントマターやディレクトリ構造は「ガワ」であり、対象AIが自力で変換できる程度の差異である。

**本ガイドの想定読者はAIである。** 人間がひとつずつ手作業で変換する必要はない。対象AIプラットフォーム上で本ガイドを読ませ、自動変換を指示すればよい。それができないAIにこのフレームワークを使う能力はない。

## ファイル分類

### 変更不要（ポータブル）

以下はAIプラットフォームに依存しない。そのまま使用する:

| パス | 内容 |
|---|---|
| `docs/` | 仕様書・設計書（生成済み成果物） |
| `src/` | ソースコード |
| `tests/` | テストコード |
| `infra/` | IaCコード |
| `project-management/` | 進捗・WBS |
| `project-records/` | レビュー・意思決定・リスク記録 |
| `process-rules/glossary-ja.md` | 用語集 |
| `process-rules/defect-taxonomy-ja.md` | 不具合分類 |
| `process-rules/review-standards-ja.md` | レビュー基準（R1-R6） |
| `process-rules/spec-template-*.md` | 仕様テンプレート |
| `process-rules/prompt-structure-ja.md` | プロンプト構造規約（S0-S6） |
| `user-order.md` | ユーザー要求（3問形式） |
| `.mcp.json` | MCP設定（オープン標準） |

### 一括置換で対応（ベンダー名・モデル名・パス）

| ファイル | 置換対象 |
|---|---|
| `process-rules/full-auto-dev-process-rules-ja.md` | "Claude Code"、"Agent Teams"、モデル名（Opus/Sonnet/Haiku） |
| `process-rules/full-auto-dev-document-rules-ja.md` | `.claude/agents/`、`.claude/commands/` のパス |
| `process-rules/agent-list-ja.md` | モデル割当表のモデル名 |

### フォーマット変換が必要

| 種別 | 現在のパス | 変換内容 |
|---|---|---|
| プロジェクト指示ファイル | `CLAUDE.md` | 対象プラットフォームの指示ファイルにリネーム・移動 |
| エージェント定義（12本） | `.claude/agents/*.md` | フロントマター（YAML）を対象形式に変換。本文（S0-S6）は流用 |
| カスタムコマンド（3本） | `.claude/commands/*.md` | 対象プラットフォームの実行方式に変換 |
| 設定ファイル | `.claude/settings*.json` | 対象プラットフォームの設定形式で新規作成 |

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
| 高（判断・設計） | opus | o3 | gemini-2.5-pro | lead, architect, review-agent, security-reviewer, srs-writer, implementer |
| 中（定型作業） | sonnet | gpt-4.1 / gpt-4.1-mini | gemini-2.5-flash | test-engineer, progress-monitor, change-manager, risk-manager |
| 低（単純ルール） | haiku | gpt-4.1-mini | gemini-2.5-flash | license-checker, kotodama-kun |

> 推奨値はPoC検証で調整すること。各モデルの能力・コスト・速度バランスはプラットフォームごとに異なる。

## 移植手順（AIへの指示例）

対象AIに以下のように指示する:

```
このリポジトリは Claude Code 用の全自動開発フレームワークである。
process-rules/porting-guide-ja.md の変換仕様に従い、
[対象プラットフォーム名] 用に変換せよ。

1. ポータブルファイルはそのまま残す
2. process-rules/ 内のベンダー固有記述を一括置換する
3. CLAUDE.md を [対象ファイル名] にリネームし、ベンダー固有記述を書き換える
4. .claude/agents/*.md のプロンプト本文（S0-S6）を抽出し、[対象形式] に変換する
5. .claude/commands/*.md を [対象実行方式] に変換する
6. .claude/settings*.json を [対象設定形式] に変換する
7. 不要になった .claude/ ディレクトリを削除する
```

## 構造的制約

Agent Teams によるマルチエージェント並列実行は 2026年3月時点で Claude Code 固有の機能である。他プラットフォームでは以下の代替を検討すること:

- **順次実行:** 1エージェントが全ロールを順番に担当する（最も単純）
- **モード切替:** Cline / Roo Code のカスタムモードでロールを切り替える
- **シェルスクリプト擬似並列:** 複数CLIプロセスを並列起動する（Aider / Codex CLI）
- **外部オーケストレータ:** Agent SDK 等で独自にマルチエージェントを構築する
