# レビュー指摘一覧

**総数:** 78 件（7 担当の報告から重複を除去した一意な件数）
**凡例:** 重大度は Critical / High / Medium / Low。「決着」列は判断を行った議題番号を示す（詳細は `03-decisions.md`）。

---

## 0. 最優先（実害が発生しており、かつ数行から数十行で直る）

| ID | 重大度 | 指摘 | 箇所 | 決着 |
|---|:-:|---|---|:-:|
| P1 | Critical | `setup.js` がユーザーの `user-order.md` と `CLAUDE.md` を無警告で上書き破壊する。README も setup.js 自身も「言語を変えたければ再実行」と案内するため、**正規手順に従うだけで唯一の入力が消える**。scratchpad で再現確認済み | `setup.js:117-127` | 4 |
| P2 | Critical | デプロイ後に `architect-ja.md` / `architect-en.md` / `architect.md` が同居し、3 つとも `name: architect` を宣言する。**1 件だけがロードされ、どれかは非決定的**（ファイルシステム読み取り順、precedence は未文書化）。日本語プロジェクトで英語版がロードされうる | `setup.js:101-114` | 4 |
| P2b | High | P2 の根本原因。「Claude Code はファイル名からエージェント名を導出する」は**事実誤認**。実際は frontmatter の `name:`。この誤情報の上に配布設計が乗っており、移植先 AI も同じ誤りを再生産する | `porting-guide-ja.md:52` | 4 |
| P3 | Critical | `Task`（`Agent`）ツールがどのエージェントにも付与されておらず、**オーケストレーションが構造的に不能**。21 ファイル全数 grep で 0 件 | `.claude/agents/*` 全体 | 2 |
| P4 | Critical | R7（純粋性）が `review-standards` にしか存在せず、`R7` の文字列が他に 1 箇所もない。ゲート・review-agent の担当観点・agent-list・CLAUDE・council-review が全て `R1-R6` のまま。**全ソースコードに及ぶ MUST が定義だけされて強制されない** | 約 28 箇所 | 5 |
| P5 | High | `.mcp.json` が存在しないホストを指す。`mcp.github.com` は **DNS 解決しない**（curl exit 6）。`"type": "url"` も存在しない transport 値。使うエージェントもゼロ。**初回起動の 10 秒で壊れた外部接続の承認を求められる** | `.mcp.json:1-12` | 7 |

---

## A. プロセス設計

| ID | 重大度 | 指摘 | 箇所 | 決着 |
|---|:-:|---|---|:-:|
| A1 | Critical | 品質ゲートに loop-breaker がなく恒久デッドロックしうる。「本ルールに例外はない」＋「Critical/High は修正済みのみ」＋「FAIL を維持」の 3 規定が揃い、修正不可能な High が 1 件出た瞬間に永久ループする。最大試行回数もエスカレーション経路も waiver も未定義 | `process-rules:1949-1954` ほか | 3 |
| A2 | High | 条件付きプロセス「実機テスト」が到達不能。CLAUDE.md テンプレートは `# フィールドテスト:` と書くが規則側の起動条件は `実機テスト: 有効` で、**文字列が一致せず永久に false**。加えて Phase 0 は 12 項目しか評価せず 13 番目が欠落。337 行の規則と専用エージェント 3 体が丸ごと死ぬ | `process-rules:679,697,1666` | 3 |
| A3 | High | 実行不能な監視トリガーが 3 本（トークン消費 80%、30 分無応答、defect 前日比 200%）。安全弁が全て飾りになっている | `process-rules:506,606,2376` | 3 / 8 |
| A4 | High | `defect` / `field-issue` に却下・重複・再現不能・取り下げの出口がない。`closed` の唯一の入口が「再テスト合格」なのに、真偽不明の現象でも起票を強制する。**終端に到達できないチケットが defect curve を発散させ、KPI「収束」が構造的に達成不能になる** | `process-rules:454-472` ほか | 3 |
| A5 | High | チェックリスト FAIL から重大度への写像が未定義。「R2.8 が FAIL」を Medium と付けるか High と付けるかで**フェーズ遷移の可否が単独で決まる**のに判定規則がない。ゲートが再現性を持たない | `review-standards:311` | 3 |
| A6 | High | `threat-model` / `security-architecture` が process-rules 2804 行のどこにも出てこない（0 hit）のに、implementation 遷移をブロックする条件が付いている。**生成を指示されていない成果物がゲートになっている** | `document-rules:723-724` | 3 |
| A7 | Medium | セッション中断・再開・コンテキスト枯渇・人間不在の状態が未定義。`pipeline-state` に `blocked` / `needs_human` / `latest_handoff` が**用意されているのに**書き込み手順が一度も書かれていない。かつ Micro/Small では免除なので小規模はクラッシュ後の復元手段がゼロ | `process-rules` 全体 | 3 / 6 / 8 |
| A8 | Medium | operation フェーズに入口・出口ゲートがなく、KPI が存在しない CLAUDE.md 行を参照している。「減少傾向」など反証不可能な基準をゲートに使っている | `process-rules:1250,2013` | 3 |
| A9 | Medium | 規模区分が Standard（1 日超）で頭打ち。「ロケット制御まで」を謳いながらスケールアップ方向の指針がゼロ | `process-rules:356-362` | 6 |
| A10 | Medium | 最終レビュー FAIL 時の R2/R4/R5 ルーティングが二重定義で判定基準がない。**R5 が design と implementation の両方に現れ、どちらに振るか決められない**。手戻り先の誤りは最も高コストな失敗モード | `process-rules:1190-1194,1939-1942` | 3 |
| A11 | Medium | R7.2 が `throw` を非純粋に分類する一方、R7.5 は value object を純粋側と定める。**値オブジェクトのコンストラクタ検証が R7.2 では違反、R7.5 では推奨**という自己矛盾 | `review-standards:354,357` | 5 |
| A12 | High | **R7.4（MUST・収集を処理より前に完結）と R5.3（MUST・大規模データはストリーミング）が正面衝突する。** R7.4 に例外規定がないため、どちらを守っても他方で FAIL になる | `review-standards:348,356` | 5 |

---

## B. エージェント設計

| ID | 重大度 | 指摘 | 箇所 | 決着 |
|---|:-:|---|---|:-:|
| B1 | Critical | Out を所有するのに `Write` がないエージェントが 2 体（`process-improver` / `kotodama-kun`）。End Conditions を永久に満たせず、全フェーズ完了時のふりかえりが毎回ブロックされる。**前回レビューは「意図的設計」として PASS 判定したが、同じ定義内の End Conditions / Out / Procedure がファイル作成を要求している点が見落とされていた** | `process-improver:5-8,27` ほか | 9 |
| B2 | High | `infra/`（IaC）に owner が存在せず delivery がデッドロックする。IaC を生成する責務を持つエージェントが 21 体中ゼロ。**デプロイ・CI/CD・環境構築という SDLC の一領域がまるごと無主** | `runbook-writer:27,86` | 2b / 6 |
| B3 | High | 複数フェーズを跨ぐエージェントの End Conditions がフェーズ別になっていない。design で `test-plan` を出しても「合格率 100%」が未達でゲートを通れない。**厳格に実装するほど進行不能、緩く実装すると形骸化** | `test-engineer:30-35` ほか 4 体 | 9 |
| B4 | High | 実機テストの CR が `change-manager` をバイパスする。同じスコープ変更に承認基準も記録形式も異なる 2 系統が並存し、**終盤フェーズという最も危険な時点でガードの弱い方を通る** | `feedback-classifier:62,71` | 9 |
| B5 | High | `review-agent` にセキュリティ観点が存在しないまま `security-scan-report` のレビューを命じられている。「レビューせよ、ただし基準は存在しない」という反証不能な指示 | `review-agent:48,83-88` | 2b / 9 |
| B6 | High | セキュリティ NFR が仕様書にないと脅威モデリングが恒久スキップされる。**「NFR 漏れ → security-reviewer 起動せず → 脅威モデルなしで design ゲート通過」という無言の失敗経路が成立** | `security-reviewer:25,98` | 3 / 9 |
| B7 | High | 引き継ぎの内容契約がファイル名レベルしかない。In 表は「どのファイルを読むか」だけで「中に何が入っていなければならないか」を規定しない。**上流の欠落に下流が気付かず幻覚で埋める。引き継ぎが静かに劣化する最大の経路** | 全 21 体の In 表 | 9 |
| B8 | High | 入力が malformed（Form Block 破損・必須フィールド欠落・enum 違反）の異常系が**全 21 体で未定義**。§9 が厳密な型定義を与えているのに違反を検出する責務が誰にもない | 全 21 体の Exception 表 | 9 |
| B9 | Medium | 能力を持たないエージェントへの実行不能指示が 4 本。スクリーンショット取得手段なし（→ 画像パスの捏造）、Bash なしでログからタイムライン構築（→ 全体が創作）、実環境なしでコマンドレベル記述（→ 未検証コマンドの納品）、Bash なしで PoC 作成 | `user-manual-writer:72` ほか | 9 |
| B10 | Medium | 出力例（few-shot）が **21 本すべてでゼロ**。下流は `review:critical_count` 等で機械集計するのに、出力指示は 1 行の抽象記述のみ。実行ごとに表がぶれるとメトリクスが静かに壊れる | 全 21 体 | 9 |
| B11 | Medium | `cost-log.json` に書き手がいない。document-rules は progress-monitor を owner と定義するが、エージェント定義は In 扱い。**コスト予算ガード 3 箇所が全部空振り** | `progress-monitor:45` | 8 / 9 |
| B12 | Medium | 閾値の衝突 3 件。(a) progress-monitor の Start Conditions と Exception が矛盾 (b) 単体テスト合格率が **95% vs 100%** で二重定義 (c) `decree-writer` が process-improver 所有ディレクトリへ書き込む | 各所 | 9 |
| B13 | Low | `kotodama-kun` が `haiku` 割当だが、和製英語判定と文書横断の同義語検出は意味理解を要する。かつ最高頻度で呼ばれる | `agent-list:24` | 9 |
| B14 | Medium | 21 体を 1 セッションで回す前提に対し、コンテキスト・セッション上限・コスト増大の規定が 1 行もない | `orchestrator:36-50` ほか | 1 / 2 / 9 |
| B15 | Low | (a) `framework-translation-verifier` の 8 観点が `review:dimensions` の値域に対応しない (b) 並列実装のマージ・コンフリクト解決の責任者が未定義 (c) アクセシビリティ WCAG が review-standards R1 に存在しない | 各所 | 9 |

---

## C. 文書体系

| ID | 重大度 | 指摘 | 箇所 | 決着 |
|---|:-:|---|---|:-:|
| C1 | Critical | `document_status` の enum（`draft`/`in-review`/`approved`/`archived`）と §10 バージョニング規則（`draft`/`approved`/**`released`**）が噛み合わない。`released` は enum に存在せず、`in-review` と `archived` の挙動が未定義。**仕様変更中の版管理が毎回エージェントの裁量になる** | `document-rules:556,1558-1573` | 6 |
| C2 | High | 文書バージョニングが 2 系統あり非互換。`{文書名}-v{major}.{minor}.md` と `{project-name}-spec.md` + status + `old/`。同じ成果物にどちらを適用するか決められない | `process-rules:626-631` vs `document-rules:196-230` | 6 |
| C3 | Critical | 品質ゲートの SSOT が 3 箇所に分裂。document-rules の「値域・制約」列に実行可能なゲート条件が書かれているのに、process-rules §9.4 のゲート表には 1 行も存在しない。**SSOT を名乗る文書が 3 つある** | `document-rules:1143` ほか | 3 / 6 |
| C4 | High | `consumed_by` が機械パース不能。`全エージェント` / `運用チーム` / `実装エージェント` / `to-agent` など 5 種類の記法が混在し、うち 3 つは登録エージェント名ですらない。**文書グラフの自動検証が原理的に不可能** | `document-rules:559,797-831` | 6 |
| C5 | High | §4.2 の実例が存在しないフィールド名（`spec-foundation:format`、正しくは `spec_format`）を書いている。**エージェントは実例を最も具体的な手本として写すため、不正フィールドを出力する** | `document-rules:435`（ja/en 両方） | 6 |
| C6 | High | ANGS は setup で選択でき enum にも含まれるが、命名規則も file_type もツールも存在しない。**選ぶとフレームワークは何もできない** | `process-rules:725` ほか | 6 |
| C7 | Medium | 33 file_type のうち下流の消費者が実質いないものが 5 件（`stakeholder-register` / `disaster-recovery-plan` / `test-plan` / `interview-record` / `threat-model`）。言及数の実測で最下位群 | `document-rules:705-739` | 1 / 6 |
| C8 | Medium | STFB の依存の張り方が 3 文書（spec-template / anms-essay / angs-essay）で食い違う。**3 文書が共有すると宣言している唯一の中核概念** | 各所 | 別テーマ |
| C9 | Low | ANGS の `direction` 3 値について、層番号から**導出されるのか宣言されるのかが未記載**。導出なら `meta`（source=6）と `forward`（6≧3）が同時成立して破綻する | `angs-essay:209-213` | 別テーマ |
| C10 | Medium | (a) Ownership と `consumed_by` が同じグラフを 2 箇所で手書き (b) `risk` に個別と集約台帳が同居し singleton 判定が矛盾 (c) §1.2 が「全ファイル」と書きながら表は 8 件（3 件漏れ） (d) `form_block_cardinality` が write-only フィールド (e) essay の設計原則件数が 24 のまま（実際 26） | 各所 | 6 |

---

## D. 配布とコード

| ID | 重大度 | 指摘 | 箇所 | 決着 |
|---|:-:|---|---|:-:|
| D1 | High | `create.js` がフレームワークの `LICENSE`（Copyright GoodRelax）と `README-ja.md` をユーザープロジェクトに残す。**新規プロジェクトが他人の著作権表示を名乗る。ライセンス誤帰属は実害あり** | `create.js:100-119` | 7 |
| D2 | High | `create.js` のダウンロードが `file.close()` 完了を待たず resolve する。**fd が開いたまま `tar -xzf` が走り、Windows ではハンドル排他で競合しうる**。`error` ハンドラもタイムアウトもリダイレクト上限もない | `create.js:47-53` | 7 |
| D3 | High | `setup.js` が前回言語の残骸を掃除しない。`ja` の後に `en` を実行しても日本語エージェントが残り、言語混在デプロイになる（実測確認済み） | `setup.js:101-106` | 4 |
| D4 | High | `setup.js` の選択肢 3 が、その時点で存在しないコマンド（`/translate-framework`）を案内する。**手順が循環している** | `setup.js:55-59` | 4 |
| D5 | Medium | `translate-framework` が `.gitignore` 対象の生成物 `CLAUDE.md` を翻訳元に指定している。`setup.js en` 済み環境で `/translate-framework ja fr` すると**英語版を日本語ソースとして翻訳する** | `translate-framework` §1 | 4 |
| D6 | Medium | `council-review` が存在しないクロスチェック ID（X02/X07/X12-15/X17）の報告を要求する。定義は 11 件だが出力指示は X01-X18。**モデルは捏造するしかない** | `council-review-{ja,en}` | 7 |
| D7 | Medium | (a) `package.json` の repository URL が **HTTP 404**（実測） (b) MIT を名乗りながら **LICENSE 本文が tarball に入っていない** (c) `BRANCH = "main"` 固定でバージョン再現性なし (d) `.npmignore` はルートに `package.json` がなく**完全に死んでいる孤児** | `create-gr-sw-maker/` ほか | 7 |
| D8 | Medium | (a) `tools/jsonl2md.mjs` が全 grep で 0 ヒットの到達不能ツールとして配布される (b) `essays/research/*.md` 8 本が削除対象になっておらず配布される (c) `project-records/reviews/` に `.gitkeep` がなく clean 後に消える | 各所 | 7 |
| D9 | Medium | スラッシュコマンドが参照する 11 ディレクトリが存在しない。`/check-progress` は最初のステップで詰まる | `check-progress` ほか | 7 |
| D10 | Low | `setup.js` の細部 4 件（cwd 依存で外から実行すると全滅、Windows でのパス表示崩れ、言語コード未検証、`main()` の unhandled rejection）+ `.gitattributes` が `* text=auto` のみ | `setup.js` ほか | 4 / 7 |

---

## E. 製品としての見せ方

| ID | 重大度 | 指摘 | 箇所 | 決着 |
|---|:-:|---|---|:-:|
| E1 | High | `gr-sw-maker-examples`（公開・実在、3 プロジェクト + ライブデモ）が README からどこにもリンクされていない。**第三者は「本当に動くのか」を確認する手段ゼロのままトークンを賭けることになる** | `README:156-171` | 8 |
| E2 | High | トークンコストの開示がゼロ。`cost` / `token` / コスト / 料金 の記載が 1 件もない。実体は opus 割当 7 体・全フェーズ強制ゲート。かつ `CLAUDE-ja.md:110` の予算閾値は `[例: 80%]` のプレースホルダのままで**初期状態では予算アラートすら機能しない** | `README` 全体 | 8 |
| E3 | High | 「約70% ポータブル / 15% 変換」の根拠が porting-guide に存在しない。ポータブル表に**フレームワークが後から生成する空ディレクトリ**が含まれており、同梱ファイルのみで数えると**約 70% が要フォーマット変換**（桁が違う） | `README:103-105` | 8 |
| E4 | Medium | 「この変換ができない AI に本フレームワークを使う能力はありません」— 未検証の主張を挑発的な断定で補強しており、失敗したユーザーのフィードバック経路を最初に潰す | `README:107` | 8 |
| E5 | High | `git clone` パスが npm パスと等価に提示されているが、実際は `.gitignore` がフレームワーク用のままで**ユーザーの成果物がコミットできない**壊れた状態になる | `README:22-25` | 8 |
| E6 | Medium | Prerequisites（Node 18+、`tar`、Claude Code、課金プラン）と Scope and Limitations（**グリーンフィールド専用であることがどこにも書かれていない**）が欠落 | `README:11-68` | 8 |
| E7 | Medium | MCBSMD 規約が「文書全体を六重バッククォートで囲め」と定めるが、**実際にコミットされた文書は囲まれておらず**、囲むと GitHub でレンダリングされない（F2 と同じ現象）。規約と実践が乖離している | `CLAUDE-ja.md:201-250` | 8 |
| E8 | Medium | `setup.js` が未記入テンプレートを `CLAUDE.md` としてデプロイし、Phase 0b2 で上書きされるまでの間、**Claude はプレースホルダと「認証には JWT を使用する」を有効な指示として読んでいる** | `setup.js:117-127` | 8 |
| E9 | Medium | README のフェーズ表（1-8）と `/full-auto-dev` の実体（Phase 0-7）で番号・名称が一致せず、条件付きスキップも示されていない。**ユーザー作業が最も発生する Phase 1d（モックのイテレーション）に触れていない** | `README:75-84` | 8 |
| E10 | Medium | `essays/research/update-direction.md` が `angs-essay` への**未適用の自己批判**（実証データの不在、主張が強すぎる）を公開状態で晒している。`Limitations` は essay 側に 0 ヒット。**「メンテされていない」シグナルになる** | `essays/research/` | 8 |

---

## F. 二言語保守

| ID | 重大度 | 指摘 | 箇所 | 決着 |
|---|:-:|---|---|:-:|
| F1 | Critical | R7 を新設したがフレームワーク全体が R1-R6 のまま（P4 と同一）。**両言語で対称に壊れているため翻訳検証では絶対に検出されない種類の破綻** | 約 28 箇所 | 5 |
| F2 | High | `essays/angs-essay-en.md` が余分な六重バッククォートで全文コードブロック化されている。コミット `5a388ad` が ja 側だけ修正して en に入っていない。**唯一の公開英語エッセイが GitHub で読めない** | `angs-essay-en.md:1,615` | 7 |
| F3 | High | ja/en を別コミットに分ける運用がドリフトを構造的に発生させている。**内容変更コミット 5 件中 2 件で片側漏れ（ドリフト率 40%）**。同一件名のコミットが 3 連続しており `git log` から判別不能 | `f370e50` / `6956015` / `17f2977` | 4 |
| F4 | Medium | `README.md` の命名非対称が機械的ペアリングを壊す。42 ペア中これ 1 つだけが `*-en.md` 規約から外れる | `README.md` | 4 |
| F5 | Medium | `framework-translation-verifier` の検証対象が `.gitignore` 対象の**生成物**を指している。**22 体のエージェント定義ペアが検証スコープから事実上抜けている** | `framework-translation-verifier` | 4 / 9 |
| F6 | High | パリティ検証の自動化がゼロ（CI なし、スクリプトなし）。**F2 と F3 は `wc -l` と `grep -c` の 2 コマンドで検出できた** | `.github/` 不在 | 4 / 7 |
| F7 | Medium | リポジトリ内の相互リンク 62 本が GitHub 上で 404。設計上の意図だが、**新規ユーザーの最初の接触点で全ての相互参照が壊れて見える**。ja/en 対称なので翻訳検証は PASS してしまう | `process-rules/*` 全体 | 4 |

---

## G. 俯瞰

| ID | 重大度 | 指摘 | 決着 |
|---|:-:|---|:-:|
| G1 | High | 本リポジトリに完走記録がなく、README も `gr-sw-maker-examples` にリンクしていない。**※ 著者は既に本フレームワークを使用しており、「実行されていない」は誤り**（`00-review-scope.md` §4 参照） | 8 |
| G2 | Critical | ゲートが**採点対象と同じ LLM による自己申告制**であり、`review:result = pass` の存在を検証する外部機構が 1 つも存在しない。規則がコンテキストから落ちた瞬間、モデルは「それらしいレビュー」を書いて自分を通す | 3 |
| G3 | Medium | 競合調査の採点表が循環している。§1.2 で C1-C5 を**自身の機能一覧として定義**し §8.1 で自らに 25/25 を付けている。とくに C5「自律性」は文書でなく実行の属性 | 別テーマ |
| G4 | Medium | 自己調査が「18 エージェント / 32 file_type」の時点で学習コストを最大級の弱みと診断したのに、現在は 21 / 33 に増えている。**「大きすぎる」への回答が「もっと大きく」だった** | 1 |

---

## 付録：重大度別の集計

| 重大度 | 件数 |
|---|---:|
| Critical | 9 |
| High | 32 |
| Medium | 31 |
| Low | 6 |
| **合計** | **78** |

## 付録：良くできている点（維持すべき）

複数の担当が独立に評価した点を記録する。

| # | 内容 | 箇所 |
|:-:|---|---|
| 1 | §9.1 のゲート強制チェックルールと、FAIL 時の戻り先まで明示した Mermaid ゲートフロー。**この種の文書では珍しく手戻り先まで設計されている** | `process-rules:1939-1954` |
| 2 | defect-taxonomy の Error → Fault → Failure → Defect/Incident → Hazard の因果連鎖と、`fault origin` → 修正対象 → review 観点の対応表。**根本原因分析を機械的に実行可能な形にできている数少ない例**。IEEE 1044 に接地している | `defect-taxonomy:218-224` |
| 3 | 「閾値は CLAUDE.md の単一箇所で定義し、数値のハードコードは禁止」という設計方針。A8 の指摘は方針でなく**遵守漏れ**への指摘 | `process-rules:1971` |
| 4 | 翻訳品質。42 ペア中 40 ペアが行数・見出し数・表行数まで完全一致 | 全体 |
| 5 | `sdd-framework-comparison-2026.md` の自己評価 W1-W7。実プロジェクト実績なし・v0.0.0 段階まで正直に記載している | `essays/research/` |
| 6 | S0-S6 プロンプト構造規約。21 体すべてが規約に準拠しており構造の一貫性が高い | `prompt-structure` |
| 7 | 純粋性分類（R7）の概念そのもの（functional core / imperative shell、collect-then-process）は筋が良く Ch6 とも対応が取れている。問題は統合の浅さのみ | `review-standards:353-361` |
