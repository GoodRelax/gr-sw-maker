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

---

## Step 4 — 横断的変更を 22 体に一括適用

### 3 段階に分割した

44 ファイル・約 4,700 行が対象であり、1 コミットに収めると差分が読めない。主題ごとに分けた。

| 段階 | 内容 | 主題 |
|:-:|---|---|
| 4a | 4-2（In 必須要素列 + Procedure step 1）+ 4-3（共通 Exception 行） | 契約の入口 |
| 4b | 4-4（読むべき規則の節）+ 4-6（出力例） | コンテキスト予算と出力の安定 |
| 4c | 4-1（起動の書き換え）+ 4-5（フェーズ別 End Conditions） | 実行モデル |

### 4a の実施内容

| 項目 | 対象 | 内容 |
|---|---:|---|
| Procedure step 1 | 21 体 × 2 言語 | 既存 step を +1 して振り直し、step 0（名乗り）の直後に「In の必須要素を検査する」を挿入 |
| 共通 Exception 行 | 21 体 × 2 言語 | Exception 表の区切り行直後に挿入 |
| In 必須要素列 | 21 体 × 2 言語 | ヘッダ・区切り行を 4 列化し、95 行すべてに内容を記入 |

`technical-authority` は Step 3 で既に適用済みのため対象外。

### 番号振り直しの安全確認

振り直しの前に、破損しうる要因を実測して潰した。

| 確認項目 | 結果 |
|---|---|
| Procedure 内の「ステップ N」形式の相互参照 | 0 件（振り直しても参照が壊れない） |
| サブステップ記法（`Na.`） | 0 件 |
| step 0（名乗り）の有無 | 22 体すべてが保有（挿入位置が一意に決まる） |

### 作り込んだ副作用と修正

`field-issue-analyst` の「対策立案」節は**手順ではなく「以下の 3 点」という列挙**であり、これも +1 されて 2/3/4 になった。本文の「3 点」と番号が食い違うため 1/2/3 に戻した（ja/en）。

Procedure 内に `###` サブ見出しを持つのは `field-issue-analyst` と `field-test-engineer` の 2 体のみ。後者の 2 分岐（フィードバック記録・実機検証）はいずれも真の手順分岐で、両分岐が 2 から始まるのは step 1（In 検査）が両者に先行するため正しい。

### 併せて実施した整合

**EN の In ヘッダ表記を 1 種に統一した。** 列を追加する行そのものに既存のドリフトがあった。

| 表記 | 統一前 | 統一後 |
|---|---:|---|
| `file_type / Provider / Usage` | 13 | **22** |
| `file_type / Source / Usage` | 6 | 0 |
| `file_type / Source / Purpose` | 2 | 0 |

`technical-authority` および `prompt-structure` の EN 表記に揃えた。

### 検証証跡

| 検査 | 結果 |
|---|---|
| Procedure step 1 | ja 22/22・en 22/22 が「In の必須要素を検査する」 |
| 番号の連続性 | 全 44 ファイルで欠番・重複ゼロ（分岐ごとの昇順連続を検査） |
| 共通 Exception 行 | ja 22/22・en 22/22 が厳密一致で 1 行のみ |
| In ヘッダ | ja/en とも 22/22 が統一表記 |
| 空セル | 0 件（95 行 × 2 言語すべてに内容あり） |
| ja/en 構造パリティ | 22 体すべてで行数・見出し数・表行数が一致（不一致 0） |
| デプロイ | `node setup.js ja` → 22 体 |

**検査時の注意:** 共通 Exception 行を `Document Rules §9` で数えると、`§9.33` を参照する既存行を拾って 4 体が 2 件に見える。行全体で厳密一致させる必要がある。

### 4b の実施内容

| 項目 | 対象 | 内容 |
|---|---:|---|
| 4-4 読むべき規則の節 | 21 体 × 2 言語 | Rules の第 1 サブセクション直後に挿入。判断内容と参照先（節番号まで）の表 |
| 4-6 出力例 | 5 体 × 2 言語 | review-agent / feedback-classifier / field-issue-analyst / process-improver / test-engineer |

`technical-authority` は Step 3 で両方とも適用済み。

### 参照先の実在を機械検査した

Step 2 の規約が「参照先が実在することを確認する。存在しない節を指すと、エージェントは代わりに全文を読む」と定めているため、**検査を自動化してから適用した。**

規則文書の見出しから節番号の集合を作り、エージェント定義中の `{文書名} §{番号}` をすべて突き合わせる。

| 検査 | 結果 |
|---|---|
| 参照件数 | 185 件（ja/en 合計） |
| 未解決の参照 | **0 件** |

対象文書: 文書管理規則 / プロセス規則 / 実機テスト フィードバック管理規則 / 不具合分類 / 用語集 / プロンプト構造規約。

### Step 3 で作り込んだ誤ラベルを修正

`technical-authority` の参照表が、実在する節に**誤った題名**を付けていた。節番号自体は実在するため機械検査では検出できない類の誤りで、目視で発見した。

| 修正前 | 修正後 |
|---|---|
| プロセス規則 §9.1（ゲート強制チェックルール）, §9.4（フェーズゲート） | プロセス規則 §9.1（段階的レビューゲート）, §9.5（レビュー指摘対応追跡） |

「ゲート強制チェックルール」は 6-1 / 6-2 で新設予定の内容の名前であり、現行 §9.1 の題名ではない。§9.4 は現行「フェーズ別KPI」であってゲート表ではない（6-14 でゲート条件を §9.4 に一本化する計画だが、現時点では違う）。**未来の姿を現在の参照に書いていた。**

### 出力例の設計方針

各エージェントの Out の Form Block 定義（文書管理規則 §9.N）から実フィールドを引いて例を作り、下流が機械参照するフィールドに注記を添えた。

| エージェント | 例示した file_type | 注記した機械参照点 |
|---|---|---|
| review-agent | review | `critical_count` / `high_count` がゲート判定に使われる。指摘対応テーブルは省略不可 |
| feedback-classifier | field-issue（classified） | `type` の判定基準、`status` の固定値 |
| field-issue-analyst | field-issue（solution-proposed） | `root_cause` は defect のみ、`impact_analysis` は 3 点必須 |
| process-improver | retrospective-report | `approval_status` は提案時 `proposed` 固定、改善策は 3 列必須 |
| test-engineer | defect | `found_in_phase` は番号（0-7）であって名前ではない |

`review:dimensions` の例は `R2,R4,R5` とした。6-33 / 6-39 で値域が R1-R7 + T1-T8 に拡張されるが、この値は拡張の前後どちらでも有効である。

### 検証証跡

| 検査 | 結果 |
|---|---|
| 読むべき規則の節 | ja 22/22・en 22/22 |
| 出力例 | ja 6/6・en 6/6（対象 5 体 + technical-authority） |
| 参照の実在 | 185 件すべて解決 |
| ja/en 構造パリティ | 22 体すべてで行数・見出し数・表行数・フェンス数が一致（不一致 0） |
| コードフェンスの対応 | 全 44 ファイルで偶数（未閉じゼロ） |
| デプロイ | `node setup.js ja` → 22 体 |

### 手戻り

4b の最初の適用スクリプトはシェルのヒアドキュメントで壊れ、**ファイル書き込みに到達せず終了していた**。適用済みと誤認しかけたが、`読むべき規則の節` の保有数が 1/22（technical-authority のみ）であることを確認して発覚した。以降、この規模のスクリプトはファイルに書いてから実行している。

---

### 4c の実施内容

| 項目 | 対象 | 内容 |
|---|---:|---|
| 4-1 起動の書き換え | 31 箇所 × 2 言語 | 「他エージェントに依頼／引き渡す／委任する」を「要請を完了報告に含めて返す」へ |
| 4-5 フェーズ別 End Conditions | 4 体 × 2 言語 | test-engineer / security-reviewer / progress-monitor / review-agent |

`technical-authority` は Step 3 で両方とも適用済み。

### 4-1 の内訳（計画は 21 箇所、実測 31 箇所）

計画の「kotodama-kun へ 11、review-agent へ 3、その他 7」は実在を確認できた。それに加えて **Exception 表の中に同型の記述が 10 箇所**あった。

| 区分 | 件数 | 例 |
|---|---:|---|
| Procedure 内の kotodama-kun 依頼 | 11 | 「kotodama-kun に用語チェックを依頼する」 |
| Procedure 内の review-agent 依頼 | 3 | 「review-agent にレビューを依頼する」 |
| Procedure 内のその他の引き渡し | 3 | srs-writer → architect、feedback-classifier → field-issue-analyst、field-test-engineer → feedback-classifier |
| Rules / Constraints / End Conditions | 4 | implementer「review-agent へ引き継ぐ」、kotodama-kun「対象エージェントに修正を依頼している」ほか |
| **Exception 表**（計画外） | **10** | 「security-reviewer に調査を依頼する」「architect に設計の補完を依頼する」ほか |
| 合計 | 31 | — |

**Exception 表を含めた理由:** 設計原則 6 は正常系・異常系を区別していない。むしろ Exception は「自分では処理できないので他へ渡す」場面そのもので、**引き継ぎが最も必要な経路**である。ここを旧記述のまま残すと、正常系だけ直った半端な状態になる。

書き換えでは、単に「要請を返す」に置換するのではなく、**安全側の動作を先に置いた**。例:

> 変更前: 可観測性設計が不十分でアラート対応手順を書けない → architect に設計の補完を依頼する
> 変更後: 可観測性設計が不十分でアラート対応手順を書けない → **手順を推測で書かない。** architect への設計補完要請を完了報告に含めて返す

「依頼する」だけでは、依頼が実行されなかったときに何をするかが未定義で、推測で書き進む余地が残る。

### 対象外とした 2 箇所

| 箇所 | 判断 |
|---|---|
| `orchestrator` の 4 箇所（Procedure `:74` `:75` `:81`、Exception `:131`） | 計画どおり 5-1（PM 専任への再定義）で扱う。実測が計画の「4 箇所」と一致した |
| `progress-monitor` の「orchestrator に即時報告。復旧手順の判断を委ねる」 | 報告と判断の委譲であって起動指示ではない。EN 側の "Delegate" は同義の訳語 |

### 4-5 のフェーズ別化

単一チェックリストに複数フェーズの条件が混在していたものを分割した。

| エージェント | 分割前の問題 | 分割後 |
|---|---|---|
| test-engineer | design で作る `test-plan` と testing でしか達成できない「合格率 100%」が同居 | design / implementation / testing の 3 フェーズ |
| security-reviewer | design 成果物と implementation のスキャンが同居 | design / implementation / operation の 3 フェーズ |
| progress-monitor | wbs 作成と testing のカーブ更新が同居 | design / implementation / testing / operation の 4 フェーズ |
| review-agent | 全フェーズ共通の 3 条件のみでフェーズ差が表現できていない | planning / design / implementation / testing / delivery の 5 フェーズ + 共通条件 |

**あわせて直した 2 点:**

1. test-engineer の「review-agent の R6 レビューに PASS している」を **「R6 レビュー要請を完了報告に含めて返した」** に変更した。他エージェントの実行結果を自分の完了条件にすると、自力では絶対に満たせない条件になる（B3 の「厳格に実装するほど進行不能」そのもの）。ゲートの合否は technical-authority の管轄であり、test-engineer の完了条件ではない。
2. 合格率の数値を直書きせず **CLAUDE.md「品質目標」への参照**に変更した。CLAUDE.md が閾値の Single Source of Truth であり、直書きは二重管理になる。

review-agent の End Conditions では R の範囲（R1-R6 か R1-R7 か）を書かず、レビュー**対象**で表現した。R の範囲は Rules の適用観点表が持ち、5-8 がそこを一括で更新する。同じ情報を 2 箇所に置かない。

### 検証証跡

| 検査 | 結果 |
|---|---|
| 4-1 適用 | ja 31/31・en 31/31（取りこぼし 0） |
| 4-5 適用 | 8/8（4 体 × 2 言語） |
| 残存する起動指示 | orchestrator の 4 箇所のみ（5-1 送り） |
| フェーズ別 End Conditions | ja 5・en 5（4 体 + technical-authority） |
| ja/en 構造パリティ | 22 体すべて一致（不一致 0） |
| 参照の実在 | 185 件すべて解決（4b から変化なし） |
| デプロイ | 22 体 |

### Step 4 完了時点の状態

| 項目 | 適用状況 |
|---|---|
| 4-1 起動の書き換え | 完了（orchestrator を除く） |
| 4-2 In 必須要素列 + Procedure step 1 | 完了（22/22） |
| 4-3 共通 Exception 行 | 完了（22/22） |
| 4-4 読むべき規則の節 | 完了（22/22） |
| 4-5 フェーズ別 End Conditions | 完了（5/5） |
| 4-6 出力例 | 完了（6/6） |

---

## Step 5a — 実行モデルの確定

Step 5 は 18 項目あるため、主題ごとに 3 段階に分けた。5a は議題 2b（技術統括の新設）の帰結を実装する段階。

| # | 内容 |
|:-:|---|
| 5-1 | orchestrator を PM 専任に再定義 |
| 5-2 | process-improver に `Write` を付与（`Edit` は付与しない） |
| 5-13 | progress-monitor: Start Condition からコスト予算を削除、`cost-log.json` を Out に追加、監視トリガーをイベントベースへ、強制再起動条項を削除 |
| 5-14 | decree-writer に `governance-change-log` を所有させる |

### 4a で作り込んだ番号不整合を修正した

orchestrator の Procedure で、**手順 7 のサブ項目が `6a/6b/6c`、手順 8 が `7a/7b/7c` のまま残っていた。** 4a の番号振り直しが親番号だけを +1 し、サブラベルを追随させなかったことによる。

4a のサブステップ検査は `^ *[0-9]+[a-z]\. ` を見ていたが、実際の記法は `   - 6a. ...` とダッシュが挟まっており、正規表現に掛からず素通りしていた。影響は orchestrator のみ（technical-authority の `3a-3d` は 4a の対象外だったため正しい）。5-1 で Procedure を書き直した際に解消した。

**教訓:** 「検査したから安全」ではなく、検査パターンが実際の記法を覆っているかを確認する必要がある。

### 5-1 の設計

議題 2b の責務境界（`orchestrator` = 回す人、`technical-authority` = 決める人）を定義に落とした。

| 箇所 | 変更 |
|---|---|
| frontmatter / Identity / Purpose | 「プロジェクトオーケストレーター」→「プロジェクトマネージャー」。技術ゲートを自ら判断してはならない（MUST NOT）を明記 |
| In | `tech-decision` を追加。`review` の用途を「品質ゲート判定」→「ユーザー報告用の品質状況の把握」に変更 |
| Procedure 5-7 | 起動指示を要請返却に変更。ゲート判定を「tech-decision の `verdict` を確認する」に置換。サブ番号を親に一致させた |
| Rules フェーズ遷移条件 | **PM 条件と技術条件を列で分離。** 技術条件の出所を tech-decision と明示 |
| Rules エスカレーション基準 | コスト閾値を CLAUDE.md 参照に変更。「同一ゲート 3 回目の FAIL」を追加 |
| Exception 3 行 | 30 分無応答 → 状態ベースの検知に置換。FAIL 時の戻し先判断を technical-authority に委譲。技術判断を求められた場合の管轄外応答を追加 |

### 5-13 の設計

A3 の「実装不能な監視トリガー」を、**エージェントが自分の起動時点で観測できる状態**に置き換えた。

| 削除した条件 | 理由 | 置換 |
|---|---|---|
| エージェントから 30 分以上応答がない | エージェントは時間の経過を自ら計測できない | pipeline-state の `phase` が前回起動時から変化していない |
| defect 発見率が前日比 200% 超 | 「前日」を知るには時系列の自己記憶が要る | 累積発見数と累積修正数の比較（単一時点で観測可能） |
| 30 分以上進捗データが更新されていない | 同上 | wbs の完了タスク数が増えていない |
| 強制再起動する | エージェントに他エージェントを再起動する手段がない | 事実のみ報告する。復旧手順の判断は orchestrator の管轄 |

「経過時間を条件にしない（MUST NOT）」を明文化した。実装不能な条件を書けば、LLM は黙って飛ばす。

### 5-2 / 5-14 の設計

- **process-improver に `Write` のみ付与し `Edit` は付与しない。** retrospective-report は毎回新規作成する記録であり、既存文書の書き換えは decree-writer の責務。`Edit` を持たせると B12-c（他エージェント所有ディレクトリへの書き込み）を招く
- **decree-writer に `governance-change-log`（`project-records/governance/`）を新設して所有させた。** 従来は「file_type を所有しない。diff は `project-records/improvement/` に記録」だったが、そこは process-improver の所有ディレクトリである。提案した主体と適用した主体が同じディレクトリに書くと、どちらの記録か追えなくなる

`governance-change-log` の登録（文書管理規則 §7 / §7.1 / §9.35 / §11）は **6-32 の前倒し**。tech-decision と同じく、所有する file_type が未登録では出力契約が成立しないため分離できない。

### 検証証跡

| 検査 | 結果 |
|---|---|
| 4 体の ja/en 構造パリティ | orchestrator 145/15/46・process-improver 145/17/36・progress-monitor 122/15/37・decree-writer 118/15/33 ですべて一致 |
| 規則文書の ja/en パリティ | agent-list 28/152/8・document-rules 169/683/36 で一致 |
| `governance-change-log` の出現数 | ja/en とも doc-rules 11・agent-list 2・decree-writer 2 で一致 |
| orchestrator の起動指示 | 残存 0（4-1 で送りにした 4 箇所を解消） |
| 参照の実在 | 187 件すべて解決 |
| デプロイ | 22 体 |

---

## Step 5b — 無主責務の解消と新設 file_type

| # | 内容 |
|:-:|---|
| 5-4 | architect の Out に `deployment-design` を追加 |
| 5-5 | implementer の Out に `infra/` を追加、単体テスト合格率の扱いを変更 |
| 5-6 | runbook-writer の Start Condition を `deployment-design` 基準に、IaC 不在時の Exception を緩和 |
| 5-9 | feedback-classifier に change-request 起票要請を追加、change-manager の In に `field-issue（type=cr）` |
| 5-10 | user-manual-writer のスクリーンショットをプレースホルダ方式に |
| 5-11 | incident-reporter に `Bash` 付与、In にログ/メトリクス源、Exception を 2 → 4 行 |
| 5-12 | srs-writer の PoC を Work 表に明記 |
| 5-15 | risk-manager の Out に `risk-register` を分離 |
| 5-16 | implementer の並列実装にマージ責任を明記 |
| 5-17 | framework-translation-verifier の In を `framework-src/{ja,en}/**` に修正、役割を意味検証に純化 |

### B2（infra/ が無主）の解消

議題 2b の割り当て（architect が `deployment-design`、implementer が `infra/`）を定義に落とした。**設計と実装の主体を分離している。**

| エージェント | 役割 |
|---|---|
| architect | `deployment-design` を作る（環境定義・デプロイ手順・ロールバック・シークレット管理） |
| implementer | それを根拠に `infra/` の IaC コードを実装する |
| runbook-writer | それを根拠に運用手順を書く |
| technical-authority | `infra/` が `deployment-design` に適合しているかを判定する |

`deployment-design` の登録（文書管理規則 §7 / §7.1 / §9.36 / §11）は **6-30 の前倒し**。

### 計画との差分 — 5-5 の合格率

計画は「単体テスト合格率を 95% → 100% に修正」だが、**調査の結果、単体テストに 100% を要求している箇所は存在しなかった。**

実際の問題は、CLAUDE.md が閾値の Single Source of Truth として `[例: 95%]` とプレースホルダで書いているのに、implementer が 95% を直書きしている点である。数値を 100% に変えるだけでは、CLAUDE.md 側の値と矛盾する二重管理が残る（むしろ現状より悪化する）。

**4-5 で test-engineer に施したのと同じく、CLAUDE.md「品質目標」への参照に変更した。** End Conditions と Exception の 2 箇所。

### 5-6 の設計 — 止めない Exception

従来は「IaC コードが未完了なら作業を開始しない」だった。しかし IaC は implementer が implementation フェーズで作るもので、delivery フェーズの runbook-writer がそれを待つと、**手順書がないまま納品されるか、無期限に待つかの二択**になる。

Start Condition を `deployment-design` の存在に変更し、Exception を「**作業を止めない。** deployment-design を根拠に手順を書き、各コマンドに導出元を併記する。IaC 完成後の検証要請を返す」に緩和した。導出元の併記により、未検証のコマンドがそれと分かる形で残る。

### 5-9 の設計 — 経路によって基準を変えない

B4 は「実機テストの CR が change-manager をバイパスする」。承認基準と記録形式が 2 系統並存し、**終盤フェーズという最も危険な時点でガードの弱い方を通る**。

feedback-classifier に「`cr` と分類したら change-request の起票要請を返す」を課し、change-manager 側には「実機テスト由来の `cr` もユーザー起点の変更として扱う。**経路によって基準を変えない**」を明記した。

### 5-10 / 5-11 / 5-12 — 能力のない指示の是正（B9）

| エージェント | 実行不能だった指示 | 是正 |
|---|---|---|
| user-manual-writer | スクリーンショットを示す（取得手段なし） | プレースホルダ `![（画面名）](images/...)` を置き、必要な画面一覧を完了報告で返す。**存在しない画像パスを書いてはならない（MUST NOT）** |
| incident-reporter | Bash なしでログからタイムライン構築 | `Bash` を付与。加えて「ログにアクセスできない」「再現条件が特定できない」の 2 行を Exception に追加し、**タイムラインを創作しない**ことを明示 |
| srs-writer | Bash なしで PoC 作成 | Work 表に明記し、Out 確定後に削除する旨を追加。**作成手段を持たない場合は作らず、文章と図で確認する** |

いずれも「能力がないのに指示がある」状態を放置すると、LLM は**創作で埋める**。禁止を明示する方が、指示を消すより安全である。

### 5-15 — singleton 判定の矛盾（C10-b）

`risk` に個別エントリと集約台帳が同居し、singleton かどうかが定まらなかった。`risk`（連番）と `risk-register`（単一）に分離した。登録は **6-31 の前倒し**。

### 5-17 — 検証スコープの是正（F5）

検証対象が `.claude/agents/*.md` 等の**生成物**を指していた。これらは `.gitignore` 対象で、setup.js が `framework-src/` から作るコピーである。**生成物を検証しても原本の不一致は検出できない。** In を `framework-src/{ja,en}/**` に修正した。

あわせて役割を純化した。見出し数・表行数といった機械的に数えられる差異は CI の `check-parity.mjs`（7-3）が担当し、本エージェントは**機械が数えられないもの**——訳語の一貫性、原文にない主張の混入、原文にある条件の欠落——に集中する。同じ検査を二重に持たない。

### 検証証跡

| 検査 | 結果 |
|---|---|
| ja/en 構造パリティ | 22 体すべて一致（不一致 0） |
| 規則文書パリティ | agent-list 28/155/8・document-rules 175/702/36 で一致 |
| 新 file_type の出現数 | ja/en とも deployment-design 9・risk-register 11 で一致 |
| 参照の実在 | 187 件すべて解決 |
| デプロイ | 22 体 |

---

## Step 5c — 検査主体の配線と台帳の更新

| # | 内容 |
|:-:|---|
| 5-3 | kotodama-kun の Out を呼び出し元への構造化テキスト返却に再定義、model を haiku → sonnet、`Bash` 付与 |
| 5-7 | security-reviewer の Start Condition を緩和、Exception を安全側に反転 |
| 5-8 | review-agent を R1-R7 に配線、`@purity` grep 検査を Procedure に追加、`security-scan-report` を In から除外 |
| 5-18 | agent-list の更新（model 割当・オーナーシップ・file_type 総数） |
| 6-39 | 全 `R1-R6` / `R1〜R6` を `R1-R7` に置換（**18 ファイル・58 箇所**） |
| 6-33 | `review` file_type に `gate` / `purity_tag_coverage_pct` を追加、`dimensions` の値域を R1-R7 + T1-T9 に拡張 |

### 5-7 の設計 — Exception の安全側への反転

B6 は「セキュリティ NFR が仕様書にないと脅威モデリングが恒久スキップされる」。従来の Exception は「作業を開始しない。orchestrator に Ch2 への追記を要請」だった。

これは**無言の失敗経路**を作る。NFR が漏れる → security-reviewer が起動しない → 脅威モデルなしで design ゲートを通過する。しかも「要求どおり停止した」ため、どこにも記録が残らない。

反転後は「**作業を止めない。** 未記載であること自体を Critical 指摘として security-scan-report に記録した上で、CLAUDE.md「セキュリティ要求」と OWASP Top 10 を基準に STRIDE を実施する」。停止ではなく記録に変えたことで、漏れが可視化される。

Start Condition も「Ch2 にセキュリティ要求が含まれている」から「spec-foundation が存在する」に緩めた。上流の欠落を起動条件にすると、欠落が検出されずに黙って飛ばされる。

### 5-3 の設計 — 借用の廃止

kotodama-kun は `Write` を持たないのに Out がファイル出力を要求していた（B1）。かつ出力先が `project-records/reviews/`、すなわち review-agent の所有ディレクトリだった。

**Out を「呼び出し元への構造化テキスト返却」に変更した。** ファイルを出さないので `Write` は不要になり、他エージェントの file_type を借用する必要もなくなる。記録の要否と記録先は呼び出し元が判断する。

model は haiku → sonnet（B13）。和製英語の判定と文書横断の同義語検出は意味理解を要し、かつ全エージェントの Out 生成時に呼ばれるため呼出頻度が最も高い。判断根拠を agent-list §1 に注記として残した。

### 5-8 の設計

| 変更 | 内容 |
|---|---|
| 適用観点表 | 設計レベル・実装レベルの両方に R7 を追加 |
| FAIL ルーティング表 | R7 を追加。あわせて「本表は**推奨**戻り先であり、確定は technical-authority が tech-decision に記録する」と明記 |
| 実行タイミング表 | design 後・実装後の観点に R7 を追加 |
| Procedure 4a/4b | `grep -rn '@purity' src/` を実行し、除外対象を除く付与率を算出。100% でなければ R7.6 違反として起票 |
| Out | 消費者に technical-authority を追加。実装コードのレビュー時は `purity_tag_coverage_pct` を必須に |
| In | `security-scan-report` を除外（B5） |

**B5 の解消方法:** review-agent は R1-R7 のいずれにもセキュリティ観点を持たないまま `security-scan-report` のレビューを命じられていた。「レビューせよ、ただし基準は存在しない」という反証不能な指示である。観点を追加するのではなく、**In から外した。** スキャン結果の判定は technical-authority の管轄（In に `security-scan-report` を持つ）であり、そこに一本化される。

### 9-8（マージゲートの検知点）が通った

Step 0 の時点で「R7 が定義されるだけで配線されない」ことを懸念し、04-work-plan §13.1 に 9-8 を追加した。5c 完了時点で条件をすべて満たしている。

| 9-8 の条件 | 結果 |
|---|---|
| `review-agent` の適用観点表・実行タイミング表に R7 が存在 | ja/en とも R7 の出現 11 箇所 |
| `purity_tag_coverage_pct` が review の Out に出力される | 6 ファイルに存在（agents 2 + document-rules 2 + review-standards 2） |
| `grep -rn 'R1-R6' framework-src/` が 0 件 | **0 件** |

Step 0 の報告で挙げた「定義されているが誰も実行しない MUST」は解消された。

### 検証証跡

| 検査 | 結果 |
|---|---|
| ja/en 構造パリティ（エージェント） | 22 体すべて一致 |
| ja/en 構造パリティ（規則・コマンド） | agent-list 29/160/8・document-rules 175/704/36・process-rules 197/256/116・council-review 30/54/4 で一致 |
| file_type 総数 | §7 マスターテーブル 37 行 == §9.N 定義セクション 37 個（ja/en とも） |
| 参照の実在 | 189 件すべて解決 |
| デプロイ | 22 体 |

### Step 5 完了時点の状態

18 項目すべて適用済み。前倒しで実施した Step 6 項目: 6-29（tech-decision）, 6-30（deployment-design）, 6-31（risk-register）, 6-32（governance-change-log）, 6-33（review フィールド）, 6-39（R1-R7 置換）。

---

## Step 6a — プロセス規則の修正（6-1 〜 6-20）

Step 6 は 55 項目だが、前倒し 6 件（6-29〜6-33, 6-39）と Step 0 の 3 件（6-38, 6-45, 6-46）が完了済みのため残 46 項目。文書ごとに 3 段階に分け、6a は `full-auto-dev-process-rules` の 20 項目を扱う。

### 新設した節

| 節 | 内容 | 指摘 |
|---|---|:-:|
| §4.0 セッション管理と再開 | 状態の記録義務・再開手順・引き継ぎ作成・`aborted` 状態 | A7 |
| §9.1.1 ゲート再試行ポリシー | 3 回 FAIL でエスカレーション、waiver の 3 条件 | A1 |
| §9.1.2 重大度の裁定基準 | MUST → High、SHOULD → Medium、安全性直結は Critical | A5 |
| §9.1.3 戻し先の裁定基準 | design / implementation の判定 | A10 |
| §9.1.4 メトリクス集計の除外 | rejected / cannot-reproduce / withdrawn は集計対象外 | A4 |
| §9.4.1 ゲート条件 | **ゲート条件の正本**。GATE-PLANNING 〜 GATE-EOL の 8 ゲート | C3, A8 |

### 主な判断

**6-1「本ルールに例外はない」の扱い.** 例外を認めないと書きながら、3 回 FAIL の打ち切り手段が存在しなかった。**waiver を唯一の例外として明示し、成立条件を 3 つに固定した**（ユーザー承認・tech-decision への記録・final-report への転記）。あわせて「**『3 回目だから通す』は理由にならない。3 回目に発生するのはエスカレーションであって自動的な通過ではない**」を明記した。

**6-12 反証不可能な基準の禁止.** KPI（傾向監視）とゲート条件（合否判定）を区別した上で、「品質が十分である」のように何をもって未達とするか定義できない基準は**ゲートに置くと必ず通過する**ため MUST NOT とした。

**6-14 ゲート条件の一本化.** ゲートの記述が複数の節に分散し、内容が食い違っていた（C3）。§9.4.1 を正本と宣言し、他の記述は要約と位置づけた。GATE-EOL では「operation フェーズは無期限に続く。終了は自動的には訪れない」ことを踏まえ、明示的な終了条件を 2 つ定義した（A8）。

**6-16 Critical は規模区分ではなく性質区分.** Micro 相当の規模でも、故障が人身・金銭・個人情報に直結するなら Critical とする。**判定はプロジェクト規模ではなく影響の性質で行う**と明記した。

**6-17 pipeline-state を規模によらず必須に.** 免除マトリクスで Micro / Small は「免除 / 任意」だったが、これは**セッション中断からの再開に必要な唯一の状態記録**であり、免除すると再開手段そのものが失われる（§4.0）。

**6-4 / 6-5 実装不能な条件の置換.** 「30 分無応答」「defect 発見率が前日比 200% 超」は、エージェントが時間を計測できないため実行されない。前者は `AgentStalled`（pipeline-state の phase・WBS 完了数・成果物のいずれも前回起動時から変化なし）に、後者は「累積発見数が累積修正数の 2 倍超」（単一時点で観測可能）に置換した。コスト閾値は `statusLine` 経由で実装可能であることを明記した（議題8）。

**6-6 defect の 3 終端.** `closed` / `rejected` / `cannot-reproduce` を区別し、後 2 者をメトリクス集計から外した。`cannot-reproduce` には**再現試行レポート 6 項目を必須**とし、1 つでも欠ければ `open` のまま残す。**再オープンは 3 終端すべてから可能**とした——一度閉じた判断を覆せない設計にすると、誤判定が恒久化する。

**6-20 転記の廃止.** §8.1 がコマンド本文を 95 行にわたり転記しており、正本と乖離していた（F-09）。参照 + 用途要約の 11 行に置換した。§8.2〜§8.5 についても転記しない方針を明記した。

### 検証証跡

| 検査 | 結果 |
|---|---|
| ja/en 構造パリティ | 2893 行 / 見出し 200 / 表行 307 / フェンス 112 で完全一致 |
| コードフェンスの対応 | ja/en とも 112（偶数、未閉じなし） |
| 新設節の存在 | §4.0・§9.1.1-9.1.4・§9.4.1 が ja/en 両方に 1 つずつ |
| ゲート ID | GATE- の出現が ja/en とも 9（定義 8 + 正本宣言 1） |
| 規模区分 | Large / Critical が ja/en とも 2 |
| 参照の実在 | 189 件すべて解決 |

---

## Step 6b — 文書管理規則の修正（6-21 〜 6-28, 6-34 〜 6-37）

### 版管理の一本化（6-21, 6-22）

| 変更 | 内容 |
|---|---|
| `document_version` を Common Block に新設 | `{メジャー}.{マイナー}` 形式。状態グループに配置 |
| `form_block_cardinality` を削除 | write-only フィールドだった（C10-d）。**書かせているが誰も読まない**フィールドは、書き手の負担だけを増やす |
| §10 バージョニング規則を 4 ステータスに整合 | `released` は `document_status` の値域に存在しない値だった。除外した |

**ファイル名は不変とし、版は `document_version` が持つ。** 従来はファイル名に版番号を含めていたため、版が上がるたびに参照側がリネームに追随する必要があった。ファイル名に版を付けるのは `old/` へ退避するときのみとした。

### file_type の Tier 化（6-27）

37 の file_type すべてに **Tier 列**（Core / Standard / Conditional）を付与した。

| Tier | 意味 | 件数 |
|------|------|---:|
| Core | 全プロジェクトで必ず作成。規模による免除の対象外 | 9 |
| Standard | 標準プロセスで作成。§3.1.1 の免除マトリクスに従う | 22 |
| Conditional | 該当する条件付きプロセスが有効な場合のみ | 6 |

**「37 を一度に覚える必要はない。Core の 9 種を理解すれば全自動開発は回る」**と明記した。C7 の「file_type の学習コスト」に対し、削除ではなく段階的必須化で応えている（議題1 の課題整理どおり）。

`stakeholder-register` と `disaster-recovery-plan` は Conditional に降格した。

### ゲート条件の参照化（6-37）

閾値を各所に直書きしていたものを、**プロセス規則 §9.4.1 のゲート ID 参照**に置換した（6 箇所）。

> 変更前: `review:critical_count` … 値域・制約 = `= 0 required for phase transition`
> 変更後: `review:critical_count` … 値域・制約 = `→ プロセス規則 §9.4.1（各 GATE の条件）`

Fields 表の記述規約自体にも「**閾値そのものをここに書かない。ゲート条件の正本は §9.4.1 であり、複数箇所に書くと必ず乖離する**」を追加した。実際に乖離していたのが C3 の指摘である。

### その他

| # | 内容 |
|:-:|---|
| 6-23 | `consumed_by` を `string` → `list` に変更。消費者が複数の場合はタグを繰り返す（カンマ区切り文字列にしない） |
| 6-24 | §12.4 に「`owner` / `commissioned_by` / `consumed_by` / `document_status` / `file_type` の値は英語固定」を追加。翻訳するとデータフローの突合が壊れる |
| 6-25 | `spec-foundation:format` → `spec-foundation:spec_format`（誤フィールド名） |
| 6-26 | §1.2 の対象ファイル表（8 件を列挙）を削除し「`process-rules/` 配下の全 `.md`」に統一。列挙は規則文書を追加するたびに更新漏れが起きる |
| 6-28 | §9.12 に test-plan と仕様書 Ch5 の責務境界を明記。Ch5 =「何をどこまで検証するか」（architect 所有）、test-plan =「いつ誰がどの順で実行するか」（test-engineer 所有） |
| 6-34 | `defect` / `field-issue` に `closed_reason` / `reproduction_attempt_count` / `reopen_trigger` を追加 |
| 6-36 | `spec_format` / `user-order:format` の値域から ANGS を除外 |

### 検証証跡

| 検査 | 結果 |
|---|---|
| ja/en 構造パリティ | 見出し 175 / 表行 707 / フェンス 36 で完全一致 |
| Tier 列の付与 | ja/en とも 37 行すべてに付与 |
| §9.4.1 参照 | ja/en とも 6 箇所で一致 |
| `form_block_cardinality` の残存 | **0 件**（framework-src 全体） |
| `released` の残存 | 1 件（削除したことを説明する文そのもの） |
| 参照の実在 | 189 件すべて解決 |
| デプロイ | 22 体 |

**行数差について:** `document-rules` の ja/en には 2 行の差が以前から存在する（Step 3 で報告済み。構造カウントは一致）。6b の編集は ja/en 同数の増減であり、差を増やしていない。

---

## Step 6c — その他規則文書とコマンド（6-40 〜 6-44, 6-47 〜 6-55）

Step 1 で「文書の主題がファイルレイアウトそのものであり、部分置換すると内部矛盾を起こす」として送りにした 2 文書を、ここで全面的に書き直した。

### framework-development の全面書き直し（6-47）

| 節 | 変更 |
|---|---|
| §2 | サフィックス方式の説明を `framework-src/{lang}/` 構成に置換。**この構成を採る理由**（リンクの両立・エージェント名衝突の構造的回避・パリティ検査の単純化・言語追加時の `.gitignore` 不要）を明記 |
| §3 | `create.js` / `setup.js` の処理内容を現行に更新。`--ref`・`.bak` 退避・残骸除去を反映 |
| §4 | 「`.gitignore` の二面性」を「2 ファイルに分ける理由」に置換。マーカー行方式を廃止した経緯と、**アンカーなしパターンが全階層にマッチする落とし穴**を明記 |
| §5（新設） | 改定時の手順。ja/en を同一コミットに含める（MUST）、§4.2 のタグ名と §9 の突合、参照先の節が実在することの確認、改定の波及範囲表 |

### porting-guide の該当節の書き直し（6-42, 6-43, 6-44）

| # | 変更 |
|:-:|---|
| 6-42 | **事実誤認の訂正。** 「Claude Code はファイル名からエージェント名を導出する」→「**frontmatter の `name:` フィールドから取得する**」。この誤認が「展開時にリネームが必要」という不要な手順を生んでいた |
| 6-43 | ポータブル表から生成物ディレクトリ（`docs/`, `src/`, `tests/`, `infra/`, `project-management/`, `project-records/`）を削除。**これらは移植の対象ではなく、移植後のプロセスが出力する先である。** モデル名表に「2026-03 時点」を明記 |
| 6-44 | **Claude Code 固有の機構**（`gate-guard.mjs` / `session-meter.mjs` / `.claude/settings.json`）を独立節にし、移植時は省略可、省略時の代替手段、および**省略するとコスト予算アラートとゲート強制が働かない**ことを明記 |

### その他

| # | 内容 |
|:-:|---|
| 6-40 | `defect-taxonomy` §3.3 に適用範囲の注記。**SW の fault はすべて Systematic である**ため、再現しない事象を安易に `cannot-reproduce` で閉じてはならない。再現しないのは fault がないからではなく条件を特定できていないから |
| 6-41 | `field-issue-handling-rules` に §6.0 を新設。3 終端の区別、再現試行レポート 6 項目、**ゲート不成立時の戻り先表**（6 パターン）。「戻り先を決めずに次へ進んではならない（MUST NOT）」 |
| 6-48 | CLAUDE テンプレートの MCBSMD を**記法規約（常時適用）と外殻規約（要求時のみ）に分割**。「リポジトリにコミットする文書には外殻を付けない（MUST NOT）」を明記し、その理由（GitHub で全文が 1 コードブロックになる）を書いた。これは F2 で実際に起きた事象である |
| 6-49 | JWT の断定を選択肢＋setup フェーズでの選定に緩和。コスト予算閾値を「記入必須」に変更し、未記入だと progress-monitor が比較対象を持たずアラートが恒久的に発火しないことを明記 |
| 6-50 | `full-auto-dev` の Phase 0 に `0n2. 実機テストの要否を評価する` を追加（12 → 13 項目） |
| 6-53 | `translate-framework` の入出力を `framework-src/{src}/` → `framework-src/{target}/` に変更。生成物は翻訳対象外である旨を明記 |
| 6-54 | `council-review` の出力指示を「X01-X18」から「Expert 4 のクロスチェック表に定義された各ペア」に変更。存在しない ID の報告を求めると、モデルは捏造するしかない |
| 6-55 | `check-progress` に手順 0 としてデータ存在確認のガードを追加。「存在しないデータについて推測で報告してはならない（MUST NOT）」 |

### 検証証跡

| 検査 | 結果 |
|---|---|
| framework-src 全 40 ファイルの ja/en パリティ | **39 / 40 が完全一致** |
| 不一致 1 件 | `document-rules` の既存 2 行差（Step 3 で報告済み。見出し 175 / 表行 707 / フェンス 36 はすべて一致） |
| 旧パス記述の残存 | `porting-guide` `framework-development` とも 0 件 |
| 参照の実在 | 189 件すべて解決 |
| デプロイ | 22 体 |

### Step 6 完了時点の状態

計画の 6-1 〜 6-55（55 項目）はすべて適用済み。うち 9 項目は Step 0 / Step 3 / Step 5 で前倒し実施した（6-29 〜 6-33, 6-38, 6-39, 6-45, 6-46）。
