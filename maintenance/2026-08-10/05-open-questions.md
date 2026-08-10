# 未決事項（2026-08-10）

**決まっていないことだけを持つ。** 決まったことは `00-mode-matrix.md`（対応表）と `03-work-order.md`（作業指示）と `04-glossary-state.md`（用語集）が持つ。

**決着したら本書から消し、決定先へ書く。本書に決定を残さない。**

| 群 | 件数 | 性質 |
|---|---:|---|
| A 作業表の粒度 | 2 | 決めれば即座に書ける |
| B 再計測待ち | 5 | 作業を進めれば埋まる |
| C エージェント間の連携 | 5 | **公式ドキュメントを確認済み（C-0）。残る判断は 5 件** |
| D 呼び出し階層 | 3 | **公式ドキュメントを確認済み。設定変更は現状不要** |
| E 仕様の書き方 | 4 | 方針は出ている。StrictDoc との噛み合わせが未確認 |
| F 計測の方針 | 5 | **公式ドキュメントを確認済み（F-0〜F-3）。経路は判明した** |
| G 章番号の個別判断 | 4 | 文を読んで決める |

---

## A. 作業表の粒度

| # | 論点 | 材料 |
|:-:|---|---|
| A1 | **`1i` を 2 つに割るか。** 1 手順で `GATE-INTERVIEW` と `GATE-PLANNING` の 2 ゲートを判定している | 割れば手順が 1 増える。ゲートは方式によらず全 8 つ判定するので、値は変わらない |
| A2 | **`4c` 単体テストを「作成 / 実行」に割るか。** `5a` `5b` を割った以上、揃えるのが筋である | ただし単体テストは実装と一体で書かれるものであり、implementer が書いて走らせるのが自然である。**割らないなら「なぜ単体テストだけ揃えないか」を備考に書く** |

---

## B. 再計測待ち

**いずれも作業を進めれば数が出る。推測で埋めてはならない。**

| # | 何 | いつ埋まるか |
|:-:|---|---|
| B1 | 仕様書テンプレートの行数（簡易 / 標準 / 厳格） | Chapter 8 を削除し章番号を繰り上げた後 |
| B2 | 手順数（簡易 / 標準 / 厳格） | 作業表の `実施` を数える。統合・分割・新設が確定した後 |
| B3 | 統合の検算 2 —— 導出した成果物が旧 表 D-2 と一致するか | 旧表を捨てる前 |
| B4 | 統合の検算 3 —— 導出した手順数が旧 表 B-1 と一致するか | 同上。**新設・統合・分割を除いた状態で比べる** |
| B5 | 段 0 の基準線（97,238 / 5,653 / 8,504 / 94.2%） | 別セッションが `tools/context-census.mjs` を作った後 |

---

## C. エージェント間の連携とレビュー

**2026-08-10 に公式ドキュメントを確認した。** 出典は末尾。**推測ではなく仕様である。**

### C-0 分かったこと（決定の材料）

**呼び出しの方式は 2 つある。どちらを採るかがこの群の中心である。**

| | サブエージェント | エージェントチーム |
|---|---|---|
| 状態 | **既定で使える** | **実験的。既定で無効**（`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`） |
| 文脈 | 独自。**会話履歴・呼んだスキル・読んだファイルを見ない** | 独自。完全に独立 |
| 通信 | **主エージェントにしか報告しない。互いに話せない** | **teammate 同士が名前で直接メッセージを送れる** |
| 調整 | 主エージェントが全部管理 | 共有タスクリストで自己調整（ファイルロックで競合を防ぐ） |
| トークン | 低い（要約だけ返る） | **高い。teammate ごとに別インスタンス** |
| 入れ子 | **3 層まで**（既定） | **不可。「teammates cannot spawn their own teammates」** |

**「B は終わったらすべて忘れて消える」は誤りである。**

| 事実 | 出典の記述 |
|---|---|
| 完了時に **agent ID** が呼び出し元へ渡る | "When a subagent completes, Claude receives its agent ID" |
| 再開すると**全履歴を保ったまま続きから動く** | "Resumed subagents retain their full conversation history, including all previous tool calls, results, and reasoning. The subagent picks up exactly where it stopped rather than starting fresh" |
| `SendMessage` を送ると**完了済みの体が自動で再開する。新しい `Agent` 呼び出しは要らない** | "A completed subagent that receives a `SendMessage` auto-resumes in the background without a new `Agent` invocation" |
| **例外: `Explore` と `Plan` は one-shot。agent ID を返さず再開できない** | "The built-in Explore and Plan agents are one-shot and return no agent ID, so they can't be resumed" |

**これが C3（レビューの往復）の答えである。ゼロから起動し直す必要はない。**

### C-1 本プロジェクトの現状（実測）

| 何 | 実測 |
|---|---|
| `tools` に `Agent` を持つ体 | **0 / 22** |
| `tools` に `SendMessage` を持つ体 | **0 / 22** |
| 現在の `tools` の内訳 | Read 22 / Grep 22 / Glob 22 / Write 21 / Edit 17 / Bash 11 |

**したがって現状は次のとおりである。**

- **エージェントは互いを呼べない。** 「`tools` から `Agent` を省くと、その体は Agent ツールでサブエージェントを一切スポーンできない」
- **エージェント間メッセージは成立しない。** 兄弟名簿は「`tools` に `SendMessage` を含むときだけ」出る
- `commands/full-auto-dev.md` の「◯◯ を起動し」**28 か所はすべて主セッションが実行している。** エージェントが別のエージェントを起動している箇所は 1 つも無い
- **呼び出しの深さは 1。** 既定上限 3 に対して余裕がある

### C-2 残る判断

| # | 論点 | 判断の材料 |
|:-:|---|---|
| C1 | **サブエージェント方式のままにするか、チームを使うか** | チームは実験的で既定無効。トークンが大幅に増える。**「For sequential tasks, same-file edits, or work with many dependencies, a single session or subagents are more effective」** —— 本パイプラインは逐次でファイル共有が多い |
| C2 | **レビューの往復を `SendMessage` の再開で回すか** | 再開なら文脈が残る。ただし**再開はスロットを新たに取り、同時実行上限の検査を通らない**（"resumes can push the running count past it"） |
| C3 | **review-agent に `SendMessage` を持たせるか** | 持たせないと再開の宛先になれない。持たせるとレビュアーが他の体へ話しかけられるようになる |
| C4 | **レビュアーを read-only にするか** | 「自分で直して終わる」なら Edit が要る。「指摘して回答を待つ」なら Read だけでよい。**現在 review-agent の `tools` に Edit は無い** |
| C5 | **`Explore` / `Plan` を使わない規約を置くか** | 再開できないため、往復するレビューには使えない |

### C-3 TTL・ACK / NACK・ハートビート

> **2026-08-10 に決着した。** 受領通知を挟む形と、背景起動、保温しない既定は `03-work-order.md` §16.7〜16.10 が持つ。**本節は材料だけを残す。**

**2 つの TTL を混同しない。**

| 概念 | 公式にあるか |
|---|---|
| **体の寿命 / タイムアウト** | **無い。** 体は時間で死なない。完了後も再開できる |
| **キャッシュの寿命（TTL）** | **ある。サブエージェントは 5 分、主会話はサブスクリプションで 1 時間。** 読むたびに無料で更新される（スライディング）。**寿命は要求の開始時点から計り、応答の生成時間が寿命を食う** |
| **同時実行の上限** | **ある。既定 20 体。** 超えると `Concurrent subagent limit reached` で失敗し、**「エラーは再試行するなと伝える」。** `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` で変更。セッション全体の総数に上限は無い |
| **完了通知** | **ある。** teammate が終わると自動で lead に通知する。API エラーで終わった場合もエラー文つきで通知される |
| **ACK / NACK 相当** | **チームの構造化メッセージにある。** `shutdown_request` に対し teammate は**承認するか、理由を付けて拒否できる**。`plan_approval_response` も同型 |
| **配送の保証** | メールボックスは JSON ファイル。**壊れたエントリは検証で除去され、正しいメッセージは配送される** |

> **エージェント間メッセージの安全性は仕様で守られている。** 「A teammate can't approve a permission prompt or supply consent on your behalf, and a teammate that was denied an action can't relay it to another teammate to bypass the check.」**拒否された操作を別の体に回して回避することはできない。**

**残る検証項目:**

| # | 論点 | なぜ要るか |
|:-:|---|---|
| C6 | **`ENABLE_PROMPT_CACHING_1H=1` はサブエージェントにも効くか** | **前提は実測で確定した**（下記）。**環境変数を入れた場合が未検証。** 効けば §16.10 の保温という選択肢自体が不要になる |
| C7 | **背景起動でキャッシュが残るのは再現するか** | 現在の根拠は 1 組の観測。**§16.8 の規約 1 はこれに依存している** |
| C9 | **fork を使うか** | fork は主セッションの system prompt・tools・履歴をそのまま継ぐため、**初回要求が主セッションのキャッシュを読む。** 通常のサブエージェントは必ず冷えた状態から始まる。レビューのように主セッションの文脈をほぼそのまま要る作業には向く可能性がある。**未検討** |
| C10 | **worktree 並列の冷え** | キャッシュはマシン ＋ 作業ディレクトリで分かれる。**worktree ごとに必ず冷える。** `CLAUDE.md`「ブランチ戦略」の並列実装がこの費用を織り込んでいるか未確認 |

> **C8（体の文脈量の実測）は解決した。** 実測でサブエージェント 1 体の文脈は 30k〜88k であった。加えて **§16.10 の分岐点は文脈量に依存しない**ことが分かったため（$1.25C \div 0.1C = 12.5$）、この項目は不要になった。

**C6 の前提は実測で確定した（2026-08-10、既定設定・背景起動）。**

| 要求 | 時刻 | create | read |
|---|---|---:|---:|
| req4（初回の最後） | 14:17:57Z | 15,646 | 72,147 |
| **req5（8 分 6 秒後の再開）** | 14:26:03Z | **83,479** | **0** |

**8 分空けた再開でキャッシュは完全に消えた。** 正確な境界（4 分・6 分）は測っていない。**計画上は 5 分を使う。**

**残る半分の手順（要再起動）:**

| # | 手順 |
|:-:|---|
| 1 | **`.claude/settings.local.json` に `env` ブロックで `ENABLE_PROMPT_CACHING_1H: "1"` を置く。** 同ファイルは `.gitignore` の対象であり、**試験がリポジトリに漏れない** |
| 2 | **`.claude/settings.json` に置いてはならない（MUST NOT）。** 同ファイルは git 追跡下にあり、gr-sw-maker の利用者全員に配られる。**枠組みとして採るかは試験とは別の判断である** |
| 3 | Claude Code を再起動する（環境変数は起動時に読まれる） |
| 4 | 背景でサブエージェントを起動し、大きめのファイルを読ませて文脈を作る |
| 5 | **8 分以上空けてから `SendMessage` で再開する** |
| 6 | `~/.claude/projects/{proj}/{session}/subagents/agent-*.jsonl` の `message.usage` を読み、**再開の要求が `read > 0` なら効いている、`read = 0` なら効いていない** |

---

## D. サブエージェントの呼び出し階層

**2026-08-10 に公式ドキュメントを確認した。**

| 何 | 事実 |
|---|---|
| 既定の深さ | **主会話の下に 3 層** |
| 上限に達したとき | **`Agent` ツールを取り上げる。** 「a subagent at the limit does its delegated work itself and returns one summary」。**例外にならず、黙って自分でやる** |
| 変え方 | `settings.json` の `env` に `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`。**`1` で入れ子を切る** |
| 版による違い | v2.1.172〜216 は **5 層固定**、v2.1.217〜218 は **1**、v2.1.219 から **3** |
| 個別に止める | その体の `tools` から `Agent` を省くか `disallowedTools` に入れる |
| チーム | **入れ子にできない。lead だけがチームを管理する** |

### D-1 本プロジェクトへの含意

**現状の深さは 1 であり、既定の上限 3 に対して余裕がある。**（C-1 の実測による）

| # | 判断 |
|:-:|---|
| D1 | **設定を増やす必要は現状では無い。** 「開始時に許可を得て上限を上げる」作業は、エージェントに `Agent` を持たせて入れ子にする設計を採る場合にのみ要る |
| D2 | **上限到達は例外にならない。黙って 1 段浅く動く。** したがって「深さが足りないと気づけない」。**入れ子を採るなら、実際の深さを検査する道具が要る** |
| D3 | 版によって既定が 5 → 1 → 3 と動いている。**版を固定して依存するのは危うい。`settings.json` で明示するのが安全である** |

---

## E. 仕様の書き方 —— 表と図を EARS で書き直さない

**方針は出ている。適用先は `02-spec-writing-rules.md`。**

| 現在の書き方 | 改める書き方 |
|---|---|
| `A1 のとき B1 すること。A2 のとき B2 すること。…` を 1 文ずつ EARS で並べる | **`XXX の動作について、SSS は Table-XXX のとおりに動作すること`** ＋ 表本体 |
| `Class A は Class B を継承すること。…` | **`SSS のクラス構成は クラス図-SSS のとおりとすること`** ＋ 図本体 |

| # | 未決 |
|:-:|---|
| E1 | **参照だけになった要求を StrictDoc のノードとしてどう表すか。** `STATEMENT` に参照を書き、表・図は同じ節の地の文に置くのか |
| E2 | **検出クエリが「中身の無い要求」と誤検出しないか。** `checks.jq` に既知の欠陥を仕込んで確かめる |
| E3 | 参照する表・図の ID 体系。**ID が無いと EARS の 1 文が何を指すか決まらない** |
| E4 | 図だけで書ききれない条件（タイミング・例外・境界）を EARS で補う境界をどこに引くか。シーケンス図が典型 |

---

## F. 計測の方針 —— 残量をどう把握するか

**2026-08-10 に公式ドキュメントを確認した。**

### F-0 どの経路で何が取れるか

| 欲しいもの | 取れるか | 経路 |
|---|---|---|
| **コンテキストの残量** | **取れる。ただし statusLine だけ** | statusLine の JSON payload |
| トークン数（累計・種別別） | 取れる | OpenTelemetry |
| コスト | 取れる | OpenTelemetry |
| **サブエージェント別の内訳** | **取れる。ただし環境変数が要る**（F-2） | OpenTelemetry の `agent.name` 属性 |

> **コンテキストの残量は hook にも OpenTelemetry にも無い。** hook のどの payload も `context_window` を持たず、OTel のどの metric / event も文脈使用量を報告しない。**statusLine が唯一の経路である。**

### F-1 statusLine の payload（公式の項目名）

```json
"context_window": {
  "total_input_tokens": 15500,
  "total_output_tokens": 1200,
  "context_window_size": 200000,
  "used_percentage": 8,
  "remaining_percentage": 92,
  "current_usage": {
    "input_tokens": 8500,
    "output_tokens": 1200,
    "cache_creation_input_tokens": 5000,
    "cache_read_input_tokens": 2000
  }
},
"exceeds_200k_tokens": false
```

| 注意 | 内容 |
|---|---|
| `used_percentage` の算式 | **入力トークンだけで計算する** —— `input_tokens + cache_creation_input_tokens + cache_read_input_tokens`。**出力トークンを含まない** |
| 実行コスト | **statusLine はローカルで動き、API トークンを消費しない** |

### F-1b サブエージェント別のコンテキストは `subagentStatusLine` で取れる

**サブエージェント自身が statusLine を実行するのではない。** 主セッションの **`subagentStatusLine`** 設定が、**表示中の全サブエージェントの行を 1 つの JSON でまとめて受け取る。**

```json
{
  "subagentStatusLine": {
    "type": "command",
    "command": "~/.claude/subagent-statusline.sh"
  }
}
```

**`tasks` 配列の各要素が持つ項目:**

| 項目 | 中身 |
|---|---|
| **`id`** | **タスク ID。`SendMessage` の宛先に使う agent ID と同一かは未確認**（F6） |
| `name` / `type` / `description` / `label` | 体の名前・型・説明 |
| **`status`** | 走行中 / 完了 / 失敗 |
| `startTime` / `cwd` | 開始時刻・作業ディレクトリ |
| `model` | 解決済みのモデル ID |
| `effort` | 推論の強さ（v2.1.214 以降。セッション既定を継ぐ場合は欠落） |
| **`contextWindowSize`** | **そのモデルのコンテキスト窓（トークン）** |
| **`tokenCount`** | **その体が使っているトークン数** |
| `tokenSamples` | 標本 |

> **公式が明言している。** 「`contextWindowSize` is that model's context window in tokens, computed the same way as the main status line's `context_window.context_window_size`, **so you can render a per-row percentage from `tokenCount`**」
>
> **`tokenCount / contextWindowSize` で体ごとのコンテキスト使用率が出る。** `contextWindowSize` と `tokenCount` は **v2.1.205 以降**。モデルが未解決の行では欠落する。

**したがってコンテキストについては環境変数が要らない。** `OTEL_LOG_TOOL_DETAILS` が要るのは OpenTelemetry のトークン内訳だけである。

| 欲しいもの | 経路 | 環境変数 |
|---|---|---|
| **体ごとのコンテキスト使用率** | **`subagentStatusLine`** | **不要** |
| 体ごとのトークン・コスト | OpenTelemetry `agent.name` | **`OTEL_LOG_TOOL_DETAILS=1` が要る** |
| 主セッションのコンテキスト使用率 | `statusLine` | 不要 |

**出力の作法:** 上書きしたい行ごとに `{"id": "<task id>", "content": "<row body>"}` を 1 行ずつ stdout へ書く。**`id` を出さなければ既定の表示のまま。** 記録が目的なら、既定表示を保ったままファイルへ書けばよい。

**`statusLine` と同じ trust と `disableAllHooks` の gate が効く。**

### F-2 サブエージェント別の内訳には環境変数が要る

**OpenTelemetry の `claude_code.token.usage` と `claude_code.api_request` は `agent.name` 属性を持つ。** ただし:

> 「Built-in agent names and agents from official-marketplace plugins appear verbatim. **Other user-defined agent names are replaced with `"custom"`**」
>
> `agent.name` は **`OTEL_LOG_TOOL_DETAILS` で gate されている。**

**本プロジェクトの 22 体はすべて user-defined である。** したがって `OTEL_LOG_TOOL_DETAILS=1` を設定しないと、**22 体すべてが `"custom"` の 1 つのバケツに潰れる。**

`query_source`（`main` / `subagent` / `auxiliary`）は gate されないので、**主セッションとサブエージェントの区別だけなら環境変数なしでも取れる。**

### F-3 モデル自身が見る唯一の道は「ファイル経由」である

**モデルは自分のトークン消費もコンテキスト残量も直接は観測できない。** 見るには、外の経路が書いたファイルを読むしかない。

**本リポジトリは既にその形になっている。**

| 道具 | 何を書くか | 出どころ |
|---|---|---|
| `tools/session-meter.mjs` | **コンテキスト使用率**（`context_used_pct` / `context_remaining_pct` / `context_window_size`） | statusLine の payload |
| `tools/otel-sink.mjs` | **トークンとコスト**（`by_agent` / `by_query_source` の内訳つき） | OpenTelemetry |
| 書き込み先 | `project-management/progress/session-state.json` | 両者がマージする |

`session-meter.mjs` の 2 行目が「record context usage where an agent can read it」と書いており、**設計意図は最初からこれである。**

### F-4 残る判断

| # | 論点 | 材料 |
|:-:|---|---|
| F1 | **`OTEL_LOG_TOOL_DETAILS=1` を設定するか** | 設定しないとエージェント別の内訳が取れない。**設定すると他の属性の詳細も出る**ので、記録の内容を確認してから決める |
| F2 | 「実測トークンの基準線は取らない」を見直すか | 経路はある。`by_agent` も条件つきで取れる |
| F3 | **statusLine と sink の起動を段 0 の前提条件にするか** | どちらも動いていなければ黙って何も記録されない。現在 `project-management/progress/` は空である |
| F4 | `sink_heartbeat_at` の鮮度検査を入れるか | **「0 件」と「受け口が死んでいた」を区別するため** |
| F5 | **statusLine が動かない環境をどう扱うか** | 公式ドキュメントは statusLine が動かない環境を明示していない。**本リポジトリのプロセス規則は「CLI でしか動かない」と書いている。どちらが正しいか実機で確かめる。`subagentStatusLine` も同じ gate に従う** |
| F6 | **`subagentStatusLine` の `tasks[].id` が `SendMessage` の宛先の agent ID と同一か** | **同一なら、agent ID の記録が自動化できる**（`03-work-order.md` §16.5）。**load-bearing なので推測せず実機で確かめる** |
| F7 | **`subagentStatusLine` を計測の経路に採るか** | 採るなら `tools/subagent-meter.mjs` を新設し、`tasks` を `session-state.json` へ書く。**体ごとのコンテキスト使用率は他に取る道が無い** |

---

## G. 章番号の個別判断

**`03-work-order.md` §7.3 が「個別判断」とした 4 件。**

| # | 字面 | 件数 | なぜ機械で写せないか |
|:-:|---|---:|---|
| G1 | `Ch1-5` | 3 | 「旧 `Ch6` から見た、定義・設計・検証の層」の意味。**見ている側の章が消える** |
| G2 | `Chapter 1-5` | 1 | 同上 |

**文ごと読み直して書き換える。端点を写すだけでは意味が通らない。**

---

## H. 手順記号の正規化の範囲

**Phase 0 の統合（19 → 8 手順）で、記号が当初案よりも大きく動く。**

| # | 論点 |
|:-:|---|
| H1 | `03-work-order.md` §6 の繰り上げ案は Phase 0 を `0a`〜`0s`（19）としていた。**統合後は 8 手順になるので案そのものを作り直す** |
| H2 | 統合・分割・新設で全フェーズの記号が動く。**一度に正規化するか、フェーズごとに分けるか** |
| H3 | 旧記号を指す `History/` と `prompt/` の記録 21 件は書き換えない。**読み替え表をどこに置くか**（現在は `03-work-order.md` §6.2） |


---

## 出典

2026-08-10 に確認。

- [Create custom subagents](https://code.claude.com/docs/en/sub-agents) —— 入れ子の深さ・同時実行上限・文脈・再開・`tools` によるツール制限
- [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams) —— teammate 間の直接メッセージ・共有タスクリスト・plan approval・shutdown_request・権限の継承と越権の禁止
- [Customize your status line](https://code.claude.com/docs/en/statusline) —— `context_window` の項目名・`used_percentage` の算式・ローカル実行
- [Hook events](https://code.claude.com/docs/en/hooks) —— **どの hook payload にも文脈・トークンの項目が無いこと**
- [Monitoring usage](https://code.claude.com/docs/en/monitoring-usage) —— OTel の metric / event 一覧・`agent.name` の redaction と `OTEL_LOG_TOOL_DETAILS`・**文脈使用量の metric が無いこと**
- [Explore the context window](https://code.claude.com/docs/en/context-window) —— `/context` による内訳・auto-compact の閾値設定
