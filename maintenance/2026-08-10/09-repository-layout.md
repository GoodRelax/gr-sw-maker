# リポジトリの配置（2026-08-11）

**何がどの役目を持つかを 5 つに分けた。** 削除してよいものと、削除してはならないものの境界が本書の要点である。

---

## 1. 5 分類

### ① gr-sw-maker 自身の開発に用いるもの

**このリポジトリを保守するためだけに在る。利用者には配られない。**

| 場所 | 追跡 | 中身 |
|---|---:|---|
| `maintenance/` | 95 | 保守の記録と作業計画。`00-mode-matrix.md`（配布物 11 枚の生成元）・`08-poc-plan.md`（現行計画）・`History/`（決着した検討の記録） |
| `maintenance-tools/` | 15 | 保守の道具。CI が回す検査 6 本、生成器 `split-work-table.mjs`、計測 `context-census.mjs`、`check-workspace.mjs`、`lib/`、`hooks/pre-commit` |
| `.github/workflows/` | 1 | CI。`framework-check.yml` が検査 6 本を走らせる |
| `create-gr-sw-maker/` | 4 | `npm init gr-sw-maker` の実体 |
| `prompt/` | 0 | セッション引継ぎ。**`.gitignore` 対象で追跡されない** |

**`maintenance/2026-08-10/` の生きているファイルは 5 つである。** `README.md` が索引を持つ。

### ② `setup.js` で展開する元ファイル

**配布物の正本。ここだけが手で編集してよい配布側の実体である。**

| 場所 | 追跡 | 中身 |
|---|---:|---|
| `framework-src/ja/` | 54 | `agents/` 24・`commands/` 6・`process-rules/` 22・`CLAUDE.md`・`user-order.md` |
| `tools/` | 7 | `create.js` が利用者プロジェクトへ配る 7 ファイル。`gate-guard.mjs` `otel-sink.mjs` `session-meter.mjs` `start-otel-sink.bat` `spec-query/` 3 |
| `.claude/settings.json` | 1 | **唯一、生成物でないのに利用者へ届く Claude Code の設定**（§3 で詳述） |
| `gitignore-user.template` | 1 | 利用者プロジェクトの `.gitignore` になる |

**`framework-src/ja/process-rules/` の 11 ファイルは生成物である。** `development-mode.md` と `work-table-*.md` 10 枚は `maintenance/2026-08-10/00-mode-matrix.md` から `split-work-table.mjs` が作る。**手で編集してはならない。**

### ③ `setup.js` で展開した後にできるもの

**すべて `.gitignore` 対象。git status に現れないため、古くなっても気づけない。**

| 場所 | 由来 |
|---|---|
| `.claude/agents/` | `framework-src/{lang}/agents/` の写し |
| `.claude/commands/` | `framework-src/{lang}/commands/` の写し |
| `process-rules/` | `framework-src/{lang}/process-rules/` の写し |
| `CLAUDE.md` | `framework-src/{lang}/CLAUDE.md` の写し |
| `user-order.md` | `framework-src/{lang}/user-order.md` の写し |

**さらに `/full-auto-dev` の走行が足場ディレクトリへ書く。** `docs/` `src/` `tests/` `infra/` `project-management/` `project-records/` の 31 ディレクトリは `.gitkeep` だけを持ち、**空であることが仕様である。**

### ④ GitHub で公開する説明

| 場所 | 追跡 | 中身 |
|---|---:|---|
| `README.md` / `README-ja.md` | 2 | 入口 |
| `essays/` | 12 | ANMS・ANGS の論考 4 本と `research/` 8 本。**保守の記録ではなく公開物である** |
| `LICENSE` | 1 | |

### ⑤ その他

| 場所 | 中身 |
|---|---|
| `setup.js` | 展開スクリプト。**①でも②でもなく、両方から使われる** |
| `.gitattributes` | 改行コードの固定。`maintenance-tools/hooks/*` を LF に固定する |
| `.gitignore` | ③ の全部と `prompt/` を除外する |

---

## 2. 削除ツールが消すもの

```bash
node maintenance-tools/check-workspace.mjs
```

**引数なしで検査、`--clean` で削除する。** 分類ごとに扱いが違う。

| 分類 | `--clean` の扱い | 理由 |
|---|---|---|
| **deployed**（③ の展開物） | **消す** | `node setup.js {lang}` で作り直せる |
| **generated**（③ の走行出力） | **消す** | 足場は空であることが仕様 |
| **edited**（`CLAUDE.md` `user-order.md` が原本と違う） | **消さない** | `user-order.md` は利用者がコンセプトを書く場所である。`setup.js` 自身が編集済みなら `.bak` へ退避する |
| **tracked**（git 追跡下） | **消さない** | リポジトリの内容であって走行の出力ではない |

**①②④⑤ には一切触れない。** 見るのは③だけである。

**2026-08-11 に足場が空になった。** `project-records/reviews/` に居座っていたフレームワーク自身のレビュー記録 8 件を `History/2026-03-22/` へ移した。**これで「足場の中身は走行の出力である」が例外なく成り立つ。**

---

## 3. Claude Code 用ファイルの区別 —— ブランチで方法が変わった

**問い: gr-sw-maker 自身の開発に使う `CLAUDE.md` と、利用者に展開される `CLAUDE.md` をどう区別するのか。**

### 3.1 答え —— 区別していない。同じものを使っている

**このリポジトリは自分自身に `setup.js` を当て、その結果で動いている。** 根の `CLAUDE.md` は利用者プロジェクトの雛形そのもので、`[プロジェクト名]` のようなプレースホルダを持ったままフレームワークの開発を統べている。

**分けられているのは「正本」と「写し」であって、「開発用」と「利用者用」ではない。**

### 3.2 main —— サフィックスで分けていた

| 実体 | 追跡 | 役目 |
|---|:-:|---|
| `.claude/agents/architect-ja.md` | ○ | 正本 |
| `.claude/agents/architect.md` | ✗ | 写し（`.gitignore` の `.claude/agents/*.md`） |
| `CLAUDE-ja.md` / `CLAUDE-en.md` | ○ | 正本 |
| `CLAUDE.md` | ✗ | 写し |
| `user-order-ja.md` / `user-order-en.md` | ○ | 正本 |
| `process-rules/` | ○ | **正本がそのまま置かれている**（写しを作らない） |

**判定基準はファイル名のサフィックスである。** `-ja` / `-en` が付いていれば正本、付いていなければ写し。**正本と写しが同じフォルダに並ぶ。**

`main` は `.claude/agents/` に **42 ファイル**（21 体 × 2 言語）を追跡していた。

### 3.3 現行ブランチ —— ディレクトリで分けている

| 実体 | 追跡 | 役目 |
|---|:-:|---|
| `framework-src/ja/agents/architect.md` | ○ | 正本 |
| `.claude/agents/architect.md` | ✗ | 写し（`.gitignore` の `/.claude/agents/`） |
| `framework-src/ja/CLAUDE.md` | ○ | 正本 |
| `CLAUDE.md` | ✗ | 写し |

**判定基準はディレクトリである。** `framework-src/` の中なら正本、外なら写し。**サフィックスは廃れ、言語はディレクトリ名になった。**

### 3.4 比較

| | main | 現行ブランチ |
|---|---|---|
| 区別の方法 | **ファイル名のサフィックス** | **ディレクトリ** |
| 正本の場所 | 使う場所と同じフォルダ | `framework-src/{lang}/` に隔離 |
| 言語の表し方 | `-ja` / `-en` | ディレクトリ名 |
| `.claude/agents/` の追跡 | 42 ファイル | **0**（`settings.json` のみ） |
| `process-rules/` | 追跡（正本） | 除外（写し） |
| `framework-src/` | **存在しない** | 56 ファイル |
| `maintenance-tools/` | 存在しない | 15 ファイル |

**現行の方式の利点は、正本と写しが物理的に混ざらないことである。** サフィックス方式では `architect-ja.md` と `architect.md` が同じフォルダに並び、どちらを直すべきかがファイル名だけに委ねられていた。

**欠点は、写しが `.gitignore` 対象になったことで古くなっても git が教えないことである。** 実際このリポジトリの `.claude/agents/` は 22 体で止まり、`framework-src/ja/agents/` の 24 体と食い違ったまま、退役した `orchestrator.md` を保持していた。**`check-workspace.mjs` はこの見えない陳腐化を検出するために作った。**

### 3.5 例外 —— `.claude/settings.json`

**唯一、生成物ではないのに利用者へ届く Claude Code の設定である。**

- `setup.js` の配置対象では**ない**（`DIR_TARGETS` は `agents` / `commands` / `process-rules` のみ）
- `create.js` が tarball 経由で運ぶ
- **このリポジトリ自身の設定でもある。** `gate-guard.mjs` の `PreToolUse` フックと `session-meter.mjs` の `statusLine` がここから走る

**main では追跡されていなかった。** 現行ブランチで初めて追跡対象になった。

---

## 4. main との差（トップレベル）

| main のみ | 現行ブランチのみ |
|---|---|
| `.mcp.json` | `.github/` |
| `.npmignore` | `framework-src/` |
| `CLAUDE-en.md` / `CLAUDE-ja.md` | `gitignore-user.template` |
| `user-order-en.md` / `user-order-ja.md` | `infra/` |
| `process-rules/`（追跡） | `maintenance-tools/` |
| | `project-management/` |

**`main` には `framework-src/` が無い。** したがって作業表 11 枚も配布されていない。**現状 `npm init gr-sw-maker` は `main` の tarball を取るため、利用者には作業表が 1 枚も届かない。** PoC が `main` を経由しない理由である（`08-poc-plan.md` §2）。

---

## 5. 判断が要ること

| # | 論点 |
|:-:|---|
| 1 | **`framework-translation-verifier` の去就。** 名簿 24 体に残るが、`framework-src/en/` を削除したため検証対象が無い。作業表にも走る手順が 0 件 |
| 2 | **`History/2026-03-22/` の翻訳検証 3 件（807 行）。** 同じく対象を失った。記録として残すか |
| 3 | **`main` へ出す時期。** PoC 完了後に PR する方針だが、`main` の配置は現行と根本的に違う。**サフィックス方式からディレクトリ方式への移行がそのまま差分になる** |
