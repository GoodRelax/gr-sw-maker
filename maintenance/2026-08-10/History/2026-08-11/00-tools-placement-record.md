# 道具の置き場 —— 決定の経緯（2026-08-11）

**`03-work-order.md` §9.2 の決定に至るまでの記録である。** 結論だけは同§が持つ。本書は**採らなかった案と、その理由**を持つ。

---

## 1. きっかけ —— 目録が前提を崩した

`tools/` に 19 ファイルが在りながら索引が無かったため、目録（`maintenance-tools/README.md`）を作った。その過程で **`create-gr-sw-maker/bin/create.js` の `USER_TOOLS` が 5 つを利用者プロジェクトへ配っている**ことが判明した。

**配られている 5 つ:**

| 道具 | 利用者のプロジェクトでの扱い |
|---|---|
| `gate-guard.mjs` | `.claude/settings.json` の `PreToolUse`。**`Write` / `Edit` のたびに走る** |
| `session-meter.mjs` | 同 `statusLine`。**応答が描かれるたびに走る** |
| `otel-sink.mjs` | 配られるが `settings.json` は配線しない。手動で起動する |
| `start-otel-sink.bat` | 同上の Windows 用ランチャ |
| `spec-query/`（3 ファイル） | 仕様書フォルダへ複製して使う |

**当初の指示は「`tools/` を `maintenance-tools/` へ改名する」であり、理由は「通常、利用者は使わない」であった。** その理由は 19 本のうち 14 本には当てはまるが、上の 5 つには当てはまらない。**一括改名すると、生成された利用者プロジェクトの中に `maintenance-tools/` が生まれ、そこから利用者の書き込みを止めるフックが走る。** 名前が事実の逆を主張することになる。

---

## 2. 採らなかった案 —— `framework-src/tools/`

`03-work-order.md` §9.2 は当初、配る側を **`framework-src/tools/` に新設**すると定めていた。理由は「`framework-src/` は既に『正本＝利用者に届くもの』を意味するので、新しい概念を増やさない」であった。

**この配置は、実装を変えない限り成立しない。**

**languages() の実装:**

```javascript
export function languages() {
  if (!existsSync(SRC)) return [];
  return readdirSync(SRC, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}
```

`maintenance-tools/lib/framework.mjs` の `languages()` は `framework-src/` 直下の**ディレクトリを無条件にすべて言語コードとして返す。** `framework-src/tools/` を作れば `tools` が言語として扱われ、これを引く `check-parity` `check-roster` `check-tagnames` `check-terms` の 4 本が一斉に壊れる。

**`03-work-order.md` §9.3 の作業 4 はこの危険を予見していた**（「`check-parity.mjs` が `framework-src/tools/` を言語ディレクトリと誤認しないか確かめ、必要なら除外する」）。ただし「必要なら」という条件付きであり、**必ず誤認することは確かめられていなかった。**

---

## 3. 採った案 —— `tools/` 据え置き

利用者の判断により、**配る 7 ファイルは `tools/` に残し、配らない 12 ファイルだけを `maintenance-tools/` へ移す**ことに決めた。

**この配置の利点:**

| # | 利点 |
|:-:|---|
| 1 | **`.claude/settings.json` を書き替えずに済む。** 配線先の `gate-guard.mjs` と `session-meter.mjs` が動かない |
| 2 | **利用者プロジェクト側の配置が変わらない。** 既に生成されたプロジェクトとの間に差が生まれない |
| 3 | `languages()` に手を入れる必要が無い |
| 4 | **両方のディレクトリ名が事実を言う。** `maintenance-tools/` は利用者が使わないもの、`tools/` は配るもの |

**割る軸は「`create.js` が配るか否か」であり、その正本は `USER_TOOLS` である。** 役割（検査・生成・計測）では割れない。同じ「検査」が両側に在る（`check-parity.mjs` は保守側、`spec-query/checks.jq` は配る側）。

---

## 4. 実施した内容

**移動 12・残留 7。** 配線の更新先は次のとおり。

| 対象 | 変更 |
|---|---|
| `.github/workflows/framework-check.yml` | 6 ステップを `node maintenance-tools/check-*.mjs` へ |
| `.gitattributes` | `maintenance-tools/hooks/* text eol=lf` へ |
| `create.js` の `FRAMEWORK_ONLY` | `maintenance-tools` を追加。**利用者プロジェクトから丸ごと削除される** |
| `create.js` の `USER_TOOLS` | **無変更** |
| `.claude/settings.json` | **無変更** |
| `split-work-table.mjs` の再生成バナー | 新パスへ。**11 ファイルを再生成**（手編集はしていない） |
| `framework-src/{ja,en}` | `framework-development.md`・`framework-translation-verifier.md` を両言語そろえて更新 |
| `README.md` ／ `README-ja.md` | 両ディレクトリの区別、および `maintenance/` との区別を追記 |

**検査は移動の前後で同一である。** `check-links` `check-terms` `check-roster` `check-tagnames` `check-setup` が PASS、`check-parity` は既知の 14 件（en 未整備）のままで増減が無い。

---

## 5. 作業中に見つけた fault

### 5.1 `check-setup.mjs` の照合が新しい名前に釣られる

`.claude/settings.json` が名指しする道具を照合する箇所が、`tools/` を素の部分一致で拾っていた。**`maintenance-tools/foo.mjs` の末尾にも当たる。** 改名によって踏みやすくなったため、両方の名前を交替で拾い、**どちらに当たったかでメッセージを変える**形に直した。

`maintenance-tools/` は利用者プロジェクトから削除されるので、そこを指す `settings.json` は本物の fault である。**握り潰さず、正しい理由で報告する**のが直した後の挙動である。

### 5.2 `README.md` ／ `README-ja.md` の 2 件の誤り

**どちらも日英そろって同じ 1 行に在った。**

| 誤っていた記述 | 実体 |
|---|---|
| `jsonl2md` は「CI が実行する検査」 | `framework-check.yml` に出現 0 件。検査ですらなく生成器である |
| 「`create.js` が配布するのは 3 本だけ」 | `USER_TOOLS` は 5 件 |

改名で同じ行を書き替える必要があったため、同時に正した。

### 5.3 起動経路を持たない道具が 4 本

目録が突き止めた。`split-work-table.mjs`・`context-census.mjs`・`jsonl2md.mjs`・`spec-query/checks.jq` は CI にもフックにも他スクリプトにも呼び出しが無い。

**うち `split-work-table.mjs` は配布物 11 ファイルの生成器である。** CI が `--check` を回していないため、**表を直して再生成し忘れても検査が捕まえられない。** 目録の作成とは独立に、同じ穴が別経路からも指摘された。

---

## 6. 残っていること

**`03-work-order.md` §9 の段 0.5 は半分しか終わっていない。**

| 作業 | 状態 |
|---|---|
| `tools/` と `maintenance-tools/` に割る | **済**（本記録） |
| `setup.js` の `DIR_TARGETS` に道具を足す | 未着手。**現在の `setup.js` は道具を 1 つも配らない** |
| `setup.js` で `.claude/settings.json` を生成・併合する | 未着手。作業表の `0c` に対応する |
| CI に `split-work-table.mjs --check` を足す | 未着手。§5.3 の穴 |

**`framework-src/tools/` は今後も作られない。** 作業表 `work-table-0-install.md` の `0b` 行が `入力` 欄でこのディレクトリを名指ししているが、**この参照は恒久的に埋まらない。** 正本の `00-mode-matrix.md` を直して再生成する必要がある。
