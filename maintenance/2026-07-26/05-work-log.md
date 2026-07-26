# 作業記録

**目的:** `04-work-plan.md` の各 Step を実行した際の手順・結果・検証証跡・復旧手順を残す。計画との差分もここに記録する。

**ブランチ:** `review-fixes`（main へのマージは Step 9 完了後）

---

## Step 0 — 独立した軽量修正

**コミット:** `6a305b6`

| # | 内容 | 結果 |
|:-:|---|---|
| 0-1 | `.mcp.json` 削除 + process-rules §5.4 に注記 | 完了 |
| 0-2 | `essays/angs-essay-en.md` の余分なフェンス削除 | 完了。613行/613行、フェンス 16/16 で ja と一致 |
| 0-3 | `create-gr-sw-maker/package.json` の repository / bugs / files | 完了 |
| 0-4 | `create-gr-sw-maker/LICENSE` 追加 | 完了 |
| 0-5 | `.npmignore` 削除 | 完了 |
| 0-6 | `.gitattributes` に `text eol=lf` | 完了 |

**あわせて実施:** 議題5（R7 の矛盾解消）。`review-standards-{ja,en}.md` の R7.2 / R7.4 / R7.6 書き換え、R7.10 新設、値域の4値統一、`## R7:` 詳細節の復活、`spec-template-{ja,en}.md` の該当行修正。

### 計画との差分

| # | 差分 | 理由 |
|:-:|---|---|
| 1 | §5.4 の MCP 設定例を注記追加だけでなく書き換えた | `"type": "url"`（存在しない transport 値）と DNS 解決しないホストをテンプレートとして残すと、コピーした全ユーザープロジェクトで P5 が再生産される |
| 2 | `spec-template` の Collect-Process 行も修正した（6-46 は 233 行のみ） | 直下の 234 行が旧 R7.4 の文言を保持しており、解消したばかりの R5.3 との衝突を再導入するため |
| 3 | `04-work-plan.md` に 9-8 / CI 検査行 / 7-4 の役割拡張を追記 | R7 の配線（5-8, 6-33, 6-39）が3つの Step に分散しており、1つ落ちても検知されない。マージゲートに検知点を置いた |
| 4 | 6-45（glossary の4値化）は作業不要と判明 | `glossary-{ja,en}.md:48` が既に 準純粋-a / -b を定義済み |

---

## Step 1 段階1 — `framework-src` 再編

### 手順

1. `framework-src/{ja,en}/{agents,commands,process-rules}/` を作成
2. サフィックスを外しながら 78 ファイルを移動
3. 移動で壊れる参照を修正
4. `.gitignore` を分割（案2: フレームワーク用と `gitignore-user.template`）
5. `create.js` の `.gitignore` 処理を差し替え
6. `setup.js` を全面書き直し（P1 / D3 / D4 / D10）

### 移動の実測

| 対象 | 数 |
|---|---:|
| `.claude/agents/` → `framework-src/{lang}/agents/` | 42 |
| `.claude/commands/` → `framework-src/{lang}/commands/` | 10 |
| `process-rules/` → `framework-src/{lang}/process-rules/` | 22 |
| `CLAUDE-{ja,en}.md` → `framework-src/{lang}/CLAUDE.md` | 2 |
| `user-order-{ja,en}.md` → `framework-src/{lang}/user-order.md` | 2 |
| **合計** | **78** |

計画 §3.1 は 1-2 を「78 ファイル」、1-3 を別途「4 ファイル」と記載しているが、78 は 4 を含む総数。1-2 の実数は 74。

### 参照修正

| 対象 | 箇所 | 内容 |
|---|---:|---|
| `agents/field-{issue-analyst,test-engineer}.md`（ja/en） | 4 | `../../process-rules/...` の markdown リンクを、プロジェクトルート基準のコードスパンに変更 |
| `commands/council-review.md`（ja/en） | 44 | Phase 0 対象ペア表・F テーブル・サブエージェントプロンプト内のパスを `framework-src/{lang}/...` へ |
| `setup.js` | 全面 | 書き直しに含む |

**`../../process-rules/` を単純置換しなかった理由:** 原本ツリー（`framework-src/ja/agents/`）では `../process-rules/`、配布後ツリー（`.claude/agents/`）では `../../process-rules/` が正しく、**同一の文字列で両立しない**。実際の消費者は配布後ツリーを読む LLM であり、他の 19 エージェントは「文書管理規則 §9」のように名前で参照している。この 4 本だけが例外だったため、既存の慣行に揃えた。

### `.gitignore` の分割（案2）

`.gitignore` は「フレームワークリポジトリ」と「ユーザープロジェクト」で正反対の意味を持つ（前者では `.claude/agents/*.md` は setup.js の出力なのでコミット禁止、後者では作業ファイルなのでコミット必須）。従来は 1 ファイルにマーカー行を置き、`create.js` が正規表現で下半分を切り落としていた。

**問題:** マーカー行の文言が `.gitignore` と `create.js` にまたがる暗黙の API になっており、文言を直すと**エラーを出さずに**切り落としが止まる。

**採用:** 2 ファイルに分離する。

| ファイル | 役割 |
|---|---|
| `.gitignore` | フレームワークリポジトリ専用。マーカー不要 |
| `gitignore-user.template` | ユーザープロジェクト用。`create.js` が `.gitignore` として設置し、テンプレートを削除する |

テンプレートが欠けていれば `create.js` はその場で例外を投げる（サイレント失敗しない）。

**移動中に判明した実害:** 旧 `.gitignore` の `CLAUDE.md` / `user-order.md` はアンカーなしの裸パターンで、全階層にマッチしていた。移動後の `framework-src/{lang}/CLAUDE.md` が git に載らなかった。新 `.gitignore` では `/CLAUDE.md` と先頭スラッシュでルートに固定した。

### 検証証跡

| 検査 | 結果 |
|---|---|
| ja/en ツリー一致 | `diff <(cd framework-src/ja && find . -type f \| sort) <(cd framework-src/en && ...)` → 差分なし |
| 移動漏れ | `.claude/agents` `.claude/commands` が空、ルートに `CLAUDE-*.md` / `user-order-*.md` なし |
| git のリネーム検出 | 74 件が `R`、残り 4 件は `.gitignore` 修正後に解消 |
| 構文 | `node --check setup.js` / `create.js` → PASS |
| デプロイ | `node setup.js ja` → agents 21 / commands 5 / process-rules 11 / CLAUDE.md / user-order.md |
| 冪等性 | `node setup.js ja` 2 回目も同一結果 |
| 言語切替の残骸（9-2） | `ja` → `en` 後に `.claude/agents/*-ja.md` / `*-en.md` は 0 件 |
| `.bak` 保護（9-3） | `user-order.md` を編集後 `node setup.js en` → `user-order.md.bak` に編集内容が保存され、上書きされない |
| `.gitignore` の双方向 | 配布物 4 種すべて ignored、原本 4 種 + テンプレートすべて tracked |
| `create.js` の gitignore 設置 | scratchpad で再現。ユーザー用 `.gitignore` が設置され、テンプレートが削除される |

### 復旧手順

移動により `.claude/agents/` と `.claude/commands/` は git 管理外（setup.js の出力）になった。**このリポジトリで作業する際、エージェントとコマンドが見えない場合は以下を実行する。**

```bash
node setup.js ja
```

`--force` を付けない限り `CLAUDE.md` / `user-order.md` は上書き前に `.bak` へ退避される。

### 既知の未処理（段階1の範囲外）

移動により記述が古くなったが、**内容の書き直しが必要なため後続 Step に残したもの**。機械的なパス置換では直らない。

| 対象 | 状態 | 対応予定 |
|---|---|---|
| `process-rules/porting-guide.md`（ja/en） | 「エージェント・コマンドの言語選択」節（48-81 行）が旧サフィックス方式のデプロイ手順そのもの。`for f in *-ja.md` を実行しても何も起きない | 6-42 / 6-43 / 6-44（Step 6） |
| `process-rules/framework-development.md`（ja/en） | §ファイル規約が旧レイアウトの説明。旧 `.gitignore` の否定パターンを本文に転記している | 6-47（Step 6） |
| `commands/translate-framework.md`（ja/en） | 収集 glob と命名規則が旧サフィックス方式 | 6-53（Step 6） |
| `README.md` / `README-ja.md` | ドキュメントリンク 28 箇所が旧パス | 8-12（Step 8） |

**判断基準:** 文書の*主題*がファイルレイアウトそのものであるものは、部分置換すると内部で矛盾するため、Step 6 で 1 文書ずつ書き直す。パスを*引用しているだけ*の文書は段階1でパスを直した。

**触らないもの:** `project-records/reviews/*`（22 箇所）は過去のレビュー記録であり、当時の状態を記述している。書き換えれば記録の改竄になる。

---

## Step 1 段階2 — 配布スクリプトと足場

### 手順

| # | 内容 |
|:-:|---|
| 1-7 | `create.js` の削除対象に `LICENSE` / `README-ja.md` / `essays/` / `tools/` / `maintenance/` / `.github/` を追加。`framework-src/` は残す |
| 1-8 | ダウンロード処理を修正（`close` 待ち・`error` ハンドラ・リダイレクト上限 5・タイムアウト 30 秒・`execSync` の stderr 出力） |
| 1-9 | `--ref` オプションを追加 |
| 1-10 | `.gitkeep` を 28 ディレクトリに配置 |

### `.gitkeep` の対象（計画は 18、実測 28）

対象はフレームワーク文書が出力先として記載しているディレクトリから導出した。`docs/en/`（翻訳成果物の置き場）のみ除外。

| 親 | 数 | 内訳 |
|---|---:|---|
| `project-records/` | 16 | change-requests, decisions, defects, field-issues, improvement, incidents, legal, licenses, performance, release, reviews, risks, safety, security, snapshots, traceability |
| `project-management/` | 2 | handoff, progress |
| `docs/` | 9 | ai, api, framework, gherkin, hardware, observability, operations, security, spec |
| `infra/` | 1 | — |

**全部作る理由:** `create.js` の `cleanDir()` は `.gitkeep` 以外のファイルを消すため、`.gitkeep` を置かないディレクトリはユーザープロジェクトで空になり git に載らない（D8-c）。条件付きプロセスでしか使わないディレクトリ（legal, safety, hardware 等）も、後から必要になった時点で構造が失われているより、空で存在するほうがよい。

### 計画との差分

| # | 差分 | 理由 |
|:-:|---|---|
| 1 | `.gitkeep` を 18 → 28 ディレクトリに | 計画の 18 は概算。実測した出力先は 28 |
| 2 | `.mcp.json` を `create.js` の削除対象に加えなかった | Step 0 でリポジトリから削除済みのため、削除対象に挙げても到達しない |
| 3 | `.github/` を削除対象に追加（計画外） | 7-8 でフレームワーク CI を追加する。CI は `framework-src` のパリティとエージェント台帳を検査するもので、ユーザープロジェクトの責務ではない。Step 7 で追加してから気づくと配布済みになる |
| 4 | `infra/migrations/` は作らなかった | architect が必要時に生成する下位ディレクトリであり、足場ではない |

### 検証証跡

| 検査 | 結果 |
|---|---|
| 構文 | `node --check create-gr-sw-maker/bin/create.js` → PASS |
| 引数解析 | 引数なし → usage、`--bogus` → `Unknown option`、`--ref` 値なし → エラー、余分な位置引数 → エラー |
| E2E（実ネットワーク） | `create.js my-app --ref review-fixes` → ダウンロード・展開・成功 |
| 配布物の除去 | `LICENSE` / `README-ja.md` / `essays` / `tools` / `maintenance` / `create-gr-sw-maker` / `package.json` / `gitignore-user.template` すべて除去を確認 |
| `framework-src/` の保持 | `ja` / `en` とも残存を確認 |
| `.gitignore` の設置 | ユーザー用テンプレートが `.gitignore` として設置され、テンプレート本体は削除 |
| `README.md` の生成 | プロジェクト名で置換されることを確認 |
| 生成プロジェクトでの `setup.js` | agents 21 / commands 5 / process-rules 11 / CLAUDE.md / user-order.md が展開 |
| 失敗時のクリーンアップ | `--ref no-such-ref-xyz` → HTTP 404 で失敗し、作成途中のディレクトリが削除される |

---

## Step 2 — `prompt-structure` への規約追加

計画 §4 は本文で「この 5 件」と書いているが、表には 2-1 〜 2-6 の 6 行がある。6 件として実施した。

### 追加した規約

| # | 追加箇所 | 内容 | 指摘 |
|:-:|---|---|:-:|
| 2-1 | §3.3 In | 「必須要素」列を必須化。判定可能な粒度で書くこと、欠落を自分で補完しないこと | B7 |
| 2-2 | §3.6 Exception | 共通 Exception 行を全エージェント必須に規定 | B8 |
| 2-3 | §3.5 Rules | `### 読むべき規則の節` の規約を新設。節番号まで指定する | 議題1 課題B |
| 2-4 | §3.2 End Conditions | 複数フェーズを跨ぐエージェントはフェーズ別テーブル（MUST） | B3 |
| 2-5 | §3.5 Rules | `### 出力例` の規約を新設。省略記号の禁止 | B10 |
| 2-6 | §1 設計原則 6 + §3.4 Procedure | 他エージェントの起動はメインセッションの専権。書き換え表を併記 | P3 |

### 併せて実施した整合

| 箇所 | 内容 | 理由 |
|---|---|---|
| §1 設計原則 7 | 「契約は入口で検査する」を追加 | 2-1 と 2-2 は同一の原理（入口検査）の表と異常系。原則として先に置かないと、2つの独立した細則に見える |
| §3.4 Procedure ルール | 「ステップ 1 は In の必須要素を検査する」を追加（MUST） | 2-1 が必須要素を定義しても、検査する手順がなければ列は飾りになる。4-2 が全22体に適用する手順の根拠 |
| §4 必須/任意 | S5: Rules を「任意」→「条件付き」 | 2-3 と 2-5 が Rules 配下の MUST を新設したため、Rules が任意のままだと矛盾する |

### 検証証跡

| 検査 | 結果 |
|---|---|
| ja/en 構造一致 | 356 行 / 見出し 45 / 表行 58 / フェンス 30 で完全一致 |
| 参照の破損 | 設計原則の番号（5 → 7 に増加）を外部から参照している箇所は 0 件 |

**次への申し送り:** ここで規定した 6 件は Step 4（4-1 〜 4-6）で 22 体に一括適用する。適用対象と規約の対応は以下。

| 規約 | 適用 |
|---|---|
| 必須要素列 + Procedure step 1 | 4-2（22 体） |
| 共通 Exception 行 | 4-3（22 体） |
| 読むべき規則の節 | 4-4（22 体） |
| フェーズ別 End Conditions | 4-5（5 体） |
| 出力例 | 4-6（6 体） |
| 起動の書き換え | 4-1（21 箇所） |

---

## Step 3 — `technical-authority` の新設

### 計画より広い範囲で実施した

計画は 3-1（定義作成）/ 3-2（§1 登録）/ 3-3（§2 オーナーシップ）の 3 項目だが、`agent-list` §5「新規エージェント追加手順」がフレームワーク自身の手順として 6 ステップを定めている。**その手順に従って全 6 ステップを実施した。**

3 項目だけで止めると、名簿には載るがデータフローにもアクティベーションマップにも現れず、所有する file_type も未登録という状態になる。これは「登録されているが起動されない」形であり、本レビューが問題にした型そのものになる。

| §5 の手順 | 実施内容 |
|---|---|
| 1. §1 に追加 | 22 番目として登録（opus / planning 以降） |
| 2. §2 に file_type を追加 | `tech-decision`（`project-records/tech-decisions/`）。decision との管轄の違いを注記 |
| 3. §3 データフロー図を更新 | `TA` ノードと 5 本の矢印を追加 |
| 4. §4 アクティベーションマップを更新 | planning / dependency-selection / design / implementation / testing / delivery の 6 フェーズに追加 |
| 5. エージェント定義を作成 | `framework-src/{ja,en}/agents/technical-authority.md` |
| 6. 文書管理規則を更新 | §7 file_type テーブル / §7.1 ワークフロー参照 / §9.34 Fields + Detail Block Guidance / §11 オーナーシップモデル |

**手順 6 は 6-29 の前倒しにあたる。** 自分の Out が未登録の file_type であるエージェントは、有効な Form Block を出力する契約を持てない。定義と登録を分離できない性質のため、同時に実施した。

### ドラフトからの変更

計画 §11 のドラフトを起点に、Step 2 で確定した規約へ適合させた。

| 変更 | 理由 |
|---|---|
| `### 出力例` を追加 | 4-6 の対象。tech-decision は下流が `verdict` / `send_back_to` を機械参照するため、Step 2 の 2-5 が MUST を課す |
| `### Constraints` を追加 | 「成果物を作成しない」「他エージェントを起動しない」を明文化。Step 2 の設計原則 6 の個別適用 |

その他（フェーズ別 End Conditions・In の必須要素列・共通 Exception 行・読むべき規則の節）はドラフトが既に先行適用していたため、そのまま採用した。

### 検証証跡

| 検査 | 結果 |
|---|---|
| ja/en 構造一致（technical-authority） | 181 行 / 見出し 19 / 表行 53 / フェンス 2 で完全一致 |
| ja/en 構造一致（agent-list） | 429 行 / 見出し 28 / 表行 149 / フェンス 8 で完全一致 |
| ja/en 構造一致（document-rules） | 見出し 166 / 表行 671 / フェンス 36 で一致。追加行数は ja/en とも 29 で同数 |
| 名簿と実体の一致 | §1 の行数 22 == エージェントファイル数 22 |
| frontmatter の `name` | 全 44 ファイルでファイル名と一致 |
| デプロイ | `node setup.js ja` → 22 体 |

### 発見（本作業に起因しない）

`full-auto-dev-document-rules.md` に **ja/en で 2 行の差**が以前から存在する（HEAD 時点で ja 1742 / en 1744）。内訳は空行 1 行とその他 1 行で、見出し数・表行数・フェンス数・リスト項目数はすべて一致しているため、構造的な差ではない。今回の編集は ja/en とも同数の行を追加しており、差を増やしていない。Step 7 の `check-parity.mjs` が検出する対象として残す。

### 既知の前方参照

`technical-authority` の In が、まだ登録されていない要素を参照している。いずれも後続 Step で解消する。

| 参照先 | 解消予定 |
|---|---|
| `deployment-design`（architect の Out） | 5-4 / 6-30 |
| `review` の `finding_level` | 6-33 |
| プロセス規則 §9.1 のゲート再試行ポリシー / §4.7.1 の戻し先基準 | 6-1 / 6-2 / 6-15 |
