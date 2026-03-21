# フレームワーク開発ガイド

> **本文書の位置づけ:** gr-sw-maker フレームワーク自体の開発・メンテナンスに関するガイド。フレームワーク開発者（フレームワークのルール文書やエージェント定義を改定する人）を対象とする。
> **関連文書:** [移植ガイド](porting-guide.md)、[エージェント一覧](agent-list.md)、[文書管理規則](full-auto-dev-document-rules.md)

---

## 1. フレームワーク開発とアプリ開発の区別

gr-sw-maker には 2 つの利用形態がある:

| | フレームワーク開発 | アプリ開発 |
|---|---|---|
| **目的** | フレームワーク自体のルール・エージェント定義を改定する | gr-sw-maker を使ってアプリケーションを開発する |
| **リポジトリ** | `gr-sw-maker`（GitHub 上の原本） | `npm init gr-sw-maker` で作成したプロジェクト |
| **作業者** | フレームワーク開発者 | アプリ開発者 |
| **使うツール** | `create.js` / `setup.js` は使わない | `create.js`（初回）+ `setup.js`（言語選択） |

---

## 2. ファイル・フォルダの位置づけ

各ファイル・フォルダがフレームワーク開発とアプリ開発でどう使われるかを定義する。

### 2.1 プロジェクト指示ファイル

| ファイル | フレームワーク開発 | アプリ開発 |
|---|---|---|
| `CLAUDE.md` | 直接編集。フレームワーク開発用の指示。`.gitignore`（非公開） | `setup.js` が `CLAUDE-ja/en.md` から生成。full-auto-dev 用の指示。git tracked |
| `CLAUDE-ja.md` | 直接編集。アプリ開発用テンプレート原本（日本語） | `setup.js` で `CLAUDE.md` にコピーされる。コピー後も参考として残る |
| `CLAUDE-en.md` | 直接編集。アプリ開発用テンプレート原本（英語） | 同上 |

**重要:** フレームワーク開発の `CLAUDE.md` と `CLAUDE-ja/en.md` は**内容が異なる**別のファイルである。`CLAUDE.md` はフレームワーク開発の作業指示、`CLAUDE-ja/en.md` はアプリ開発者に配布するテンプレート原本。

### 2.2 エージェント定義・コマンド定義

| ファイル | フレームワーク開発 | アプリ開発 |
|---|---|---|
| `.claude/agents/*-ja.md` / `*-en.md` | 直接編集。エージェント定義原本 | `setup.js` でサフィックスなしにコピーされる |
| `.claude/agents/*.md`（サフィックスなし） | 使わない。`.gitignore` | `setup.js` が生成。git tracked |
| `.claude/commands/*-ja.md` / `*-en.md` | 直接使用（council-review 等） | `setup.js` でサフィックスなしにコピーされる |
| `.claude/commands/*.md`（サフィックスなし） | 使わない。`.gitignore` | `setup.js` が生成。git tracked |

### 2.3 プロセス規則

| ファイル | フレームワーク開発 | アプリ開発 |
|---|---|---|
| `process-rules/*-ja.md` / `*-en.md` | 直接編集。プロセス規則原本 | `setup.js` でサフィックスなしにコピーされる |
| `process-rules/*.md`（サフィックスなし） | 使わない。`.gitignore` | `setup.js` が生成。git tracked |

### 2.4 ユーザー要求

| ファイル | フレームワーク開発 | アプリ開発 |
|---|---|---|
| `user-order-ja.md` / `*-en.md` | 直接編集。テンプレート原本 | `setup.js` でサフィックスなしにコピーされる |
| `user-order.md`（サフィックスなし） | 使わない。`.gitignore` | `setup.js` が生成。要求記入用。git tracked |

### 2.5 配布・パッケージング

| ファイル | フレームワーク開発 | アプリ開発 |
|---|---|---|
| `create-gr-sw-maker/` | npm パッケージ本体（`package.json` + `bin/create.js`）を管理 | `npm init gr-sw-maker` で実行後、自己削除 |
| `setup.js` | 使わない。配布物として管理 | `node setup.js <lang>` で `-ja/en.md` → `.md` を生成 |

### 2.6 その他

| ファイル | フレームワーク開発 | アプリ開発 |
|---|---|---|
| `.gitignore` | デプロイ出力 + `CLAUDE.md` + `prompt/` を除外 | `create.js` がデプロイ出力除外行を削除した版 |
| `README.md` | 直接編集。フレームワークの説明 | `create.js` がテンプレートを生成。アプリ開発者が書き換える |
| `README-ja.md` | 直接編集。フレームワークの説明（日本語） | なし（必要ならユーザーが作成） |
| `project-records/` | フレームワークのレビュー記録等 | `create.js` が中身を削除。アプリの記録を蓄積 |
| `essays/` | 直接編集。論文・調査レポート | そのまま残る（参考資料） |
| `docs/` | 使わない | アプリ開発の補足資料置き場 |
| `prompt/` | 作業メモ等。`.gitignore`（非公開） | 存在しない |
| `settings.local.json` | 使用。`.gitignore` | 使用。`.gitignore` |

---

## 3. create.js と setup.js の役割

### 3.1 create.js（`create-gr-sw-maker/bin/create.js`）

| 項目 | 内容 |
|---|---|
| **実行契機** | `npm init gr-sw-maker <project-name>` |
| **使用場面** | アプリ開発のみ |
| **処理内容** | 1. GitHub から gr-sw-maker の tarball をダウンロード<br/>2. 指定ディレクトリに展開<br/>3. 不要ファイルを削除（`create-gr-sw-maker/`、`project-records/` の中身）<br/>4. `.gitignore` からデプロイ出力除外行を削除<br/>5. `README.md` をテンプレートで生成 |

### 3.2 setup.js

| 項目 | 内容 |
|---|---|
| **実行契機** | `node setup.js <lang>`（`ja` または `en`） |
| **使用場面** | アプリ開発のみ |
| **処理内容** | 選択した言語の `-ja.md` / `-en.md` をサフィックスなしの `.md` にコピー |
| **対象ファイル** | `CLAUDE-*.md`、`.claude/agents/*-*.md`、`.claude/commands/*-*.md`、`user-order-*.md` |

---

## 4. .gitignore の二面性

`.gitignore` はフレームワークリポとアプリプロジェクトで異なる内容になる。

### 4.1 フレームワークリポ版（原本）

```
# === Framework repo only (create.js removes everything below this line) ===

# Framework development private files (not distributed)
prompt/
CLAUDE.md

# setup.js deploy outputs
.claude/agents/*.md
!.claude/agents/*-ja.md
!.claude/agents/*-en.md
.claude/commands/*.md
!.claude/commands/*-ja.md
!.claude/commands/*-en.md
process-rules/*.md
!process-rules/*-ja.md
!process-rules/*-en.md
user-order.md
```

- マーカー行（`# === Framework repo only ...`）以降が `create.js` により一括削除される
- `CLAUDE.md`（フレームワーク開発用指示）と `prompt/` は非公開
- デプロイ出力（サフィックスなし `.md`）を除外
- `!*-*.md` で `-ja.md` / `-en.md` 原本は追跡対象に戻す

### 4.2 アプリプロジェクト版

`create.js` が `# setup.js deploy outputs` 以降の行を削除するため、サフィックスなしの `.md` が git tracked になる。

---

## 5. npm publish 手順

フレームワークの新バージョンを npm に公開する手順:

1. フレームワークの変更を全てコミット・プッシュ
2. `create-gr-sw-maker/` 配下で `npm publish` を実行
3. `npm init gr-sw-maker <test-project>` で E2E テストを実施
4. `node setup.js ja` および `node setup.js en` の動作を確認

**注意:** npm に publish されるのは `create-gr-sw-maker/` パッケージのみ。gr-sw-maker 本体は npm に登録しない（GitHub からの tarball ダウンロードで配布）。
