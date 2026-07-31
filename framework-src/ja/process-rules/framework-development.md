# フレームワーク開発ガイド

> **本文書の位置づけ:** gr-sw-maker フレームワーク自体の開発・メンテナンスに関するガイド。フレームワーク開発者（フレームワークのルール文書やエージェント定義を改定する人）を対象とする。
> **関連文書:** [移植ガイド](porting-guide.md)、[エージェント一覧](agent-list.md)、[文書管理規則](full-auto-dev-document-rules.md)

---

## 1. フレームワーク開発とアプリ開発の区別

gr-sw-maker には 2 つの利用形態がある。

| | フレームワーク開発 | アプリ開発 |
|---|---|---|
| **目的** | フレームワーク自体のルール・エージェント定義を改定する | gr-sw-maker を使ってアプリケーションを開発する |
| **リポジトリ** | `gr-sw-maker`（GitHub 上の原本） | `npm init gr-sw-maker` で作成したプロジェクト |
| **作業者** | フレームワーク開発者 | アプリ開発者 |
| **編集する対象** | `framework-src/{lang}/` 配下の原本 | `setup.js` が展開した作業ファイル |

---

## 2. ディレクトリ構成

**原本はすべて `framework-src/{lang}/` に置き、言語サフィックスを付けない。**

```text
framework-src/
  ja/
    CLAUDE.md               ... アプリ開発用テンプレート原本
    user-order.md           ... ユーザー要求テンプレート原本
    agents/                 ... エージェント定義原本（22）
    commands/               ... コマンド定義原本（5）
    process-rules/          ... プロセス規則原本（11）
  en/                       ... 同一構成
```

`setup.js` が選択された言語を作業位置へ展開する。

| 原本 | 展開先 |
|---|---|
| `framework-src/{lang}/agents/` | `.claude/agents/` |
| `framework-src/{lang}/commands/` | `.claude/commands/` |
| `framework-src/{lang}/process-rules/` | `process-rules/` |
| `framework-src/{lang}/CLAUDE.md` | `CLAUDE.md` |
| `framework-src/{lang}/user-order.md` | `user-order.md` |

### 2.1 この構成を採る理由

**リンクが原本ツリーと展開後ツリーの両方で解決する。** `framework-src/ja/process-rules/glossary.md` 内の `[不具合分類](defect-taxonomy.md)` は、原本ツリーでも展開後の `process-rules/` でも同じ文字列のまま正しく解決する。サフィックス方式では後者でしか解決しなかった。

**エージェント名の衝突が構造的に起きない。** Claude Code が走査するのは `.claude/agents/` である。`framework-src/ja/agents/` はパスに `.claude/` を含まないため走査対象外となり、同名エージェントが複数登録されることがない。

**パリティ検査が単純になる。**

```bash
diff <(cd framework-src/ja && find . -type f | sort) \
     <(cd framework-src/en && find . -type f | sort)
```

**言語追加時に `.gitignore` を触らなくてよい。** `framework-src/fr/` を足すだけで済む。

### 2.2 原本以外のファイル

| ファイル | フレームワーク開発 | アプリ開発 |
|---|---|---|
| `CLAUDE.md`（ルート） | フレームワーク開発用の作業指示。`.gitignore`（非公開） | `setup.js` が展開。full-auto-dev 用の指示。git tracked |
| `.claude/agents/*.md` 等 | `setup.js` の出力。`.gitignore` | 作業ファイル。git tracked |
| `create-gr-sw-maker/` | npm パッケージ本体を管理 | `create.js` が削除 |
| `setup.js` | 配布物として管理。フレームワーク側でも動作確認に使う | `node setup.js <lang>` で言語を切り替える |
| `tools/` | 検査スクリプト群 | `create.js` が削除 |
| `essays/` | 論文・調査レポート | `create.js` が削除 |
| `maintenance/` | レビューと修正計画の記録 | `create.js` が削除 |
| `README.md` / `README-ja.md` | フレームワークの説明 | `create.js` が README を生成し直す |
| `prompt/` | 作業メモ。`.gitignore`（非公開） | 存在しない |

**ルートの `CLAUDE.md` と `framework-src/{lang}/CLAUDE.md` は別のファイルである。** 前者はフレームワーク開発の作業指示、後者はアプリ開発者に配布するテンプレート原本。内容は一致しない。

---

## 3. create.js と setup.js の役割

### 3.1 create.js（`create-gr-sw-maker/bin/create.js`）

| 項目 | 内容 |
|---|---|
| **実行契機** | `npm init gr-sw-maker <project-name>` |
| **使用場面** | アプリ開発のみ |
| **処理内容** | 1. GitHub から tarball をダウンロード（`--ref` で任意のブランチ・タグ・コミットを指定可）<br/>2. 指定ディレクトリに展開<br/>3. フレームワーク開発専用のファイルを削除（`LICENSE`, `README-ja.md`, `essays/`, `tools/`, `maintenance/`, `create-gr-sw-maker/`, `.github/`）<br/>4. `project-records/` の中身を空にする（`.gitkeep` は残す）<br/>5. `gitignore-user.template` を `.gitignore` として設置し、テンプレートを削除<br/>6. `README.md` をプロジェクト名で生成 |

**`framework-src/` は削除しない。** `setup.js` の入力であり、これがないと言語切替ができなくなる。

### 3.2 setup.js

| 項目 | 内容 |
|---|---|
| **実行契機** | `node setup.js [lang] [--force]` |
| **使用場面** | アプリ開発、およびフレームワーク開発での動作確認 |
| **処理内容** | `framework-src/{lang}/` の内容を作業位置へ展開する |
| **上書き保護** | `CLAUDE.md` と `user-order.md` は内容が異なる場合 `*.bak` へ退避してから上書きする。`--force` で退避を省略できる |
| **残骸の除去** | 選択言語が提供しないフレームワーク所有ファイル、および旧サフィックス方式の残骸を削除する。ユーザーが独自に追加したファイルは削除しない |

---

## 4. .gitignore を 2 ファイルに分ける理由

`.gitignore` はフレームワークリポジトリとアプリプロジェクトで**正反対の意味**を持つ。

| パス | フレームワークリポジトリ | アプリプロジェクト |
|---|---|---|
| `.claude/agents/foo.md` | `setup.js` の出力。コミットしてはいけない | 作業ファイル。コミットする |

同じパスが逆であるため、1 つの `.gitignore` では両立できない。**2 ファイルに分けて解決する。**

| ファイル | 役割 |
|---|---|
| `.gitignore` | フレームワークリポジトリ専用。展開出力を除外する |
| `gitignore-user.template` | アプリプロジェクト用。`create.js` が `.gitignore` として設置し、テンプレート本体を削除する |

**従来はマーカー行と正規表現で 1 ファイルを切り分けていたが廃止した。** マーカー行の文言が `.gitignore` と `create.js` にまたがる暗黙の API になっており、文言を直すと切り落としが**エラーを出さずに**止まるためである。現在はテンプレートが欠けていれば `create.js` がその場で例外を投げる。

**アンカーに注意する。** `CLAUDE.md` のように先頭スラッシュのないパターンは全階層にマッチし、`framework-src/{lang}/CLAUDE.md` まで巻き込む。ルート限定の除外は `/CLAUDE.md` と書く。

---

## 5. 改定時の手順

### 5.1 ja/en は同一コミットに含める（MUST）

**片方の言語だけを変更したコミットを作ってはならない。** 分けると、次に触る人がどちらが正でどちらが未反映かを判断できなくなり、ドリフトが恒久化する。

`tools/check-parity.mjs` が構造の一致を検査し、pre-commit hook が片側だけのコミットを拒否する。
フックは clone ごとに 1 度だけ有効化する。

```bash
git config core.hooksPath tools/hooks
```

フックは片方の言語だけを stage したコミットを拒否し、続けて `check-parity` を実行する。**構造を変えない書き換え（言い回しの修正など）はパリティ検査では検出できない**ため、stage 済みファイルの対応検査のほうが本体である。

### 5.2 Form Block のタグ名を突き合わせる

文書管理規則を改定した場合、**§4.2 の実例に現れるタグ名が §9 の Fields 表に実在することを確認する。** 実例だけに存在するタグ名は、エージェントがそれを正として出力し、誰も読めない出力を生む。

`tools/check-tagnames.mjs` がこの突合を行う。

### 5.3 参照先の節が実在することを確認する

エージェント定義の「読むべき規則の節」に節番号を書いた場合、その節が実在することを確認する。存在しない節を指すと、エージェントは代わりに規則全文を読む。

`tools/check-links.mjs` が、Markdown リンクと節番号参照の双方の実在を検査する。**節番号は実在するが題名が違う**場合は検出できない。これは目視で確認する。

### 5.4 改定の反映範囲

| 改定した文書 | 併せて確認する対象 |
|---|---|
| `agent-list.md` | 全エージェント定義の frontmatter、`full-auto-dev-document-rules.md` §7 / §11 |
| `full-auto-dev-document-rules.md` §7 | `agent-list.md` §2 のオーナーシップ、各エージェントの Out |
| `review-standards.md` | `review-agent` の適用観点表、`full-auto-dev-process-rules.md` §9.2 |
| `prompt-structure.md` | 全 22 体のエージェント定義 |
| エージェントの新設・削除 | `agent-list.md` §5 の「新規エージェント追加手順」に従い 6 手順すべてを実施する |

---


---

## 6. 検査を手元で走らせる

以下はすべて依存ライブラリなしで動く。CI（`.github/workflows/framework-check.yml`）が同じ 6 つを実行するため、**手元で通れば CI も通る。**

| コマンド | 検査内容 |
|---|---|
| `node --check <file>` | 全 `*.js` / `*.mjs` の構文 |
| `node tools/check-parity.mjs` | 言語ツリーの一致、行数・見出し・表行・コードフェンス・リンク先の一致 |
| `node tools/check-roster.mjs` | エージェント名簿と実体の一致、frontmatter の `name` / `model`、レビュー観点の配線 |
| `node tools/check-links.mjs` | デッドリンク、節番号参照の実在 |
| `node tools/check-tagnames.mjs` | Form Block のタグ名が §9 の Fields 表に実在すること |
| `node tools/check-setup.mjs` | `setup.js` の展開内容・冪等性・言語切替・`.bak` 退避 |

`check-setup.mjs` は一時ディレクトリに `setup.js` と `framework-src/` を複製してから実行するため、**作業中の `CLAUDE.md` や `user-order.md` を壊さない。**

`tools/gate-guard.mjs`・`tools/otel-sink.mjs`・`tools/session-meter.mjs` は検査ではなく実行時の機構であり、ここには含まない（移植ガイド「Claude Code 固有の機構」を参照）。

## 7. npm publish 手順

1. フレームワークの変更をすべてコミット・プッシュする
2. `create-gr-sw-maker/` 配下で `npm publish` を実行する
3. `npm init gr-sw-maker <test-project>` で E2E テストを実施する
4. 生成されたプロジェクトで `node setup.js ja` および `node setup.js en` の動作を確認する

**注意:** npm に publish されるのは `create-gr-sw-maker` パッケージのみ。gr-sw-maker 本体は npm に登録せず、GitHub からの tarball ダウンロードで配布する。

`create.js` の修正はパッケージの中身そのものであるため、**再 publish しなければユーザーに届かない。**
