# 計測経路の原因特定と代替経路の実証

**目的:** FF-06（`session-state.json` が生成されない）の原因を特定し、代替の計測経路を実証する。

**位置づけ:** `01-trial-report_v3.md` の着手順序 1 に対する実施記録。**議題8（2026-07-26）の決定を改訂する根拠となる。**

**方針:** 本文書の数値はすべて実測である。**本調査の過程で自分が出した誤りを 2 件訂正している（§5）。**

---

## 1. FF-06 の原因 — statusLine はこの実行形態で発火しない

### 切り分けの手順

同じ観測結果（`session-state.json` が生成されない）を生む仮説が 2 つあった。

| 仮説 | 内容 |
|---|---|
| H1 | statusLine は発火するが、`$CLAUDE_PROJECT_DIR` が未設定でコマンドが失敗する |
| H2 | この実行形態では statusLine がそもそも発火しない |

**H1 の裏づけ（実測）:**

```text
$ echo $CLAUDE_PROJECT_DIR
<未設定>

$ echo "{}" | node "$CLAUDE_PROJECT_DIR/tools/session-meter.mjs"
Error: Cannot find module 'C:\Program Files\Git\tools\session-meter.mjs'
exit=1
```

`CLAUDE_PROJECT_DIR` が未設定だと `"$CLAUDE_PROJECT_DIR/tools/..."` が `/tools/...` に潰れ、Git Bash が `C:\Program Files\Git\` を基準に解決する。**statusLine は非ゼロ終了で空白になるだけであり、ファイルもエラーも残らない。**

**スクリプト自体は正常である。** 正しいペイロードを標準入力に与えると `session-state.json` を全フィールド生成することを確認した。

**H2 の検証:** `.claude/settings.local.json`（gitignore 対象）に、**絶対パス**でプローブを呼ぶ statusLine を一時的に登録した。プローブは stdin を受け取ってログに追記するだけの実装である。

| 条件 | 結果 |
|---|---|
| 登録直後（同一セッション内） | **ログ 0 行** |
| **Claude Code デスクトップの完全再起動後** | **ログ 0 行** |

**再起動によって「設定が再読み込みされていない」という逃げ道が消えた。H2 が確定である。**

### 結論

> **statusLine は Claude Code デスクトップアプリでは発火しない。**

公式ドキュメントは statusLine の発火契機（セッション開始 / 新しいアシスタントメッセージ / `/compact` 完了 / permission mode 変更 / Vim mode 切替 / `refreshInterval`）を定めているが、**どの実行形態で動くかは明記していない。**

**議題8 は「モデルは自分のトークン消費を観測できない。statusLine が唯一の計測手段」として設計した。この前提が誤りであった。** トライアルが 5 日間 `session-state.json` を作れなかったのは、CLI 専用機能に依存していたためである。

**なお H1 は実バグとして残る。** `.claude/settings.json` の `$CLAUDE_PROJECT_DIR` 展開は statusLine の実行環境では保証されない。statusLine を補助経路として残すなら是正が要る。

---

## 2. 公式の計測手段は 5 種類ある

調査の結果、公式に文書化された手段が複数存在することが判明した。**議題8 の時点でこれらは検討されていない。**

| # | 手段 | エージェントが読めるか | 個人アカウント | 出典 |
|:-:|---|:---:|:---:|---|
| 1 | **OpenTelemetry** | **読める**（受け口を用意すれば） | **可** | code.claude.com/docs/en/monitoring-usage |
| 2 | `/usage` コマンド | **読めない**（UI パネル） | 可 | code.claude.com/docs/en/costs |
| 3 | statusLine の JSON | 読める | 可（**本形態では発火せず**） | code.claude.com/docs/en/statusline |
| 4 | Claude Code Analytics API | 読める | **不可**（Admin API は個人アカウント非対応） | platform.claude.com/docs/en/build-with-claude/claude-code-analytics-api |
| 5 | Usage and Cost Admin API | 読める | **不可** | platform.claude.com/docs/en/manage-claude/usage-cost-api |

**transcript JSONL（`~/.claude/projects/**/*.jsonl`）は公式に文書化されていない。** 議題8 がこれを却下した判断自体は正しい（§5-1 で実測により裏づけた）。

---

## 3. OpenTelemetry の実証

### 3.1 受け口

依存ゼロの Node スクリプト（約 80 行）で受けられることを確認した。`OTEL_EXPORTER_OTLP_PROTOCOL=http/json` を指定すると平文 JSON が POST されるため、標準の `http` モジュールで足りる。

**設定（`.claude/settings.local.json` の `env` ブロック）:**

```json
{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_LOGS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL": "http/json",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "http://127.0.0.1:4318",
    "OTEL_METRIC_EXPORT_INTERVAL": "10000",
    "OTEL_LOGS_EXPORT_INTERVAL": "5000"
  }
}
```

### 3.2 headless（`claude -p`）での実証

`claude -p "Reply with exactly: PING"` を OTel 環境変数付きで起動した。CLI は v2.1.81。

**受信した `api_request` イベント:**

| 属性 | 値 |
|---|---:|
| `cost_usd` | **0.04399** |
| `input_tokens` / `output_tokens` | 3 / **5** |
| `cache_creation_tokens` | **7,016** |
| `cache_read_tokens` | 0 |
| `duration_ms` | 2,901 |
| `model` | claude-opus-4-6 |

**「PING と答えるだけ」で 4.4 セント。出力 5 トークンに対しキャッシュ書込 7,016 トークン — 99.9% がセットアップである。**

### 3.3 デスクトップアプリでの実証

`.claude/settings.local.json` に上記 `env` を追加し、**Claude Code デスクトップを再起動**した。

**受信した `api_request` イベント（本セッションのターン）:**

| 属性 | 値 |
|---|---:|
| `model` | **claude-opus-5** |
| `input_tokens` / `output_tokens` | 2 / 460 |
| `cache_read_tokens` | 33,978 |
| **`cache_creation_tokens`** | **859,771** |
| **`cost_usd`** | **8.626209** |
| `duration_ms` | 35,328 |

**届いたメトリクスとイベント:**

```text
metrics : claude_code.cost.usage / claude_code.session.count / claude_code.token.usage
events  : user_prompt / api_request / tool_decision / tool_result /
          hook_execution_start / hook_execution_complete /
          plugin_loaded / hook_registered
```

**フックの実行まで計装されている。**

> **statusLine が発火しない同じ環境で、OTel は動く。FF-06 は代替経路で解決可能である。**

### 3.4 単価表の確定

受信した 1 イベントで検算できる。

```text
cache_creation  859,771 × $10.00/M = $8.5977   （1時間TTL書込 = 入力の 2 倍）
cache_read       33,978 ×  $0.50/M = $0.0170   （入力の 0.1 倍）
output              460 × $25.00/M = $0.0115
input                 2 ×  $5.00/M = $0.0000
                                     ─────────
                                     $8.6262   実測 8.626209
```

**Claude Opus 5 = 入力 $5.00 / 出力 $25.00、1 時間 TTL キャッシュ書込 $10.00、キャッシュ読出 $0.50（いずれも 100 万トークンあたり）。小数点以下 4 桁まで一致する。**

---

## 4. 最も重い発見 — 支配的なのはキャッシュ書込である

§3.3 のターンは **1 回で $8.63**、その **99.7% が `cache_creation`** である。約 86 万トークンの文脈が、まるごとキャッシュに**書き直された**。

**読出（$0.50/M）ではなく書込（$10.00/M）であり、単価が 20 倍である。** 1 時間 TTL が切れた後の最初のターンでこれが起きる。

> **長いセッションで間が空くと、次の一手が桁違いに高い。**

`/usage` の Tip「Longer sessions are more expensive even when cached」はこの機構を指している。

**「文脈を大きくするな」「セッションを長引かせるな」という主張に、$8.63 という値札が付いた。** 3 モード設計および P-23（フレームワーク自身の規模）の根拠として、これ以上ないほど具体的である。

**あわせて `/usage` が示した比率:** キャッシュ 85.3M に対し出力 0.52M — **165 倍**。

---

## 5. 本調査で自分が出した誤りの訂正

**2 件ある。いずれも判断を左右するため明記する。**

### 5-1. transcript から算出した $118.13 は誤り

公式 `/usage` の表示は **$23.27** であった。さらに、どの集計方法でも公式値に一致しない。

| 集計方法 | output | input | cache read | cache write |
|---|---:|---:|---:|---:|
| 生の合計（本体のみ） | 1.50 | 0.37 | 1.13 | 1.29 |
| 生の合計（+ サブエージェント） | 1.64 | 1.17 | 1.46 | 1.39 |
| `requestId` で重複排除 | 0.64 | 0.55 | 0.62 | 0.46 |

**倍率が項目ごとに異なり、上にも下にもずれる。単一の係数で補正できない。** 集計方法の問題ではなく、**transcript が課金実績の完全な記録ではない**ことを意味する。

> **transcript をコスト算出に用いてはならない（MUST NOT）。**

### 5-2. 「主因は単価表の誤り（4.07 倍）」という分解も誤り

§3.4 のとおり**単価表は小数点以下 4 桁まで正しい。** したがって 5-1 の差は単価ではなくトークン集計に由来する。

**`/usage` の $23.27 との差は未解明のまま残る。** サブスクリプション基準の表示である可能性があるが、**確認していない。推測を結論として記録しない。**

---

## 6. 設計に反映すべき点

| # | 内容 | 理由 |
|:-:|---|---|
| 1 | **`cost_usd` は Claude Code が計算して寄越す。単価表を自前で持たない** | 保守が不要になり、5-2 の誤りの種類が構造的に消える |
| 2 | **PII をホワイトリストで落とす** | payload に `user.email` / `user.account_id` / `user.id` / `organization.id` が含まれる。`cost-log.json` は**リポジトリに入り公開されうる** |
| 3 | **鮮度マーカーをゲート判定に組み込む** | 受け口が落ちれば無言で捨てられる。**statusLine と同じ失敗を作らない** |
| 4 | **`cache_creation` を独立に監視する** | 合計コストだけ見ていると §4 の跳ねの原因が見えない |

**2 が最も重い。** 生ペイロードをプロジェクト配下に書いてはならない（MUST NOT）。

---

## 7. 未確定事項

| # | 内容 |
|:-:|---|
| 1 | **配布方法。** `env` は `.claude/settings.local.json`（gitignore 対象）に置いたため、**このままでは配布されない。** `create.js` / `setup.js` でどう扱うかは**未決** |
| 2 | **受け口の常駐をどう担保するか。** sink が動いていなければ計測はゼロになる。起動忘れの検知が要る |
| 3 | サブエージェント別のコスト按分（`agent.name` 属性）は**合成ペイロードでしか確認していない**。実走行での検証が要る |
| 4 | `/usage` の $23.27 と単価表の乖離（5-2） |
| 5 | statusLine の `$CLAUDE_PROJECT_DIR` 実バグ（§1）を是正するか、statusLine ごと補助経路から外すか |
