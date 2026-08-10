# 章番号参照の再計測（`14` の手順 0）

**本書は計測の記録である。** `14-framework-update-plan.md` の手順 0 が求める「件数表」と「置換順序」を持つ。

**読み取りのみで作った。`framework-src/` は 1 文字も変えていない。**

**測った日:** 2026-08-09。**対象:** `framework-src/**/*.md` 82 枚（うち章番号を含むもの 56 枚）。

---

## 1. 最も重要な発見

> **`14` の §2.7 置換辞書は v0.35 の章番号で書かれている。しかし `framework-src` は v0.34 である。そのまま当ててはならない（MUST NOT）。**

| 何 | `14` §2.7 が想定する旧番号 | **framework-src の実際** |
|---|---|---|
| Architecture の章 | `Ch5 Architecture` | **`Ch3 Architecture`** |
| System Configuration の章 | `Ch2 System Configuration` | **存在しない**（v0.35 で新設された章であり、v0.34 には無い） |
| Scenarios の節 | `Ch6.1 Scenarios` | **`Ch4.1 Scenarios`** |

**`framework-src/ja/process-rules/spec-template.md` の 1 行目は `# ANMS v0.34` である。** v0.35 の草案（`00-spec-template-draft.md`）は本体へ適用されていない。**したがって段 5 が行う写像は v0.35 → v0.36 ではなく v0.34 → v0.36 である。**

> **もう 1 つ、`14` の手順 0 が挙げていない表記が 1 つある。** 数える形として `ChN` / `ChN.M` / `ChN-M` / `ChapterN` / `ChapterN.M` の 5 つが挙がっているが、**`第N章` が 59 件実在する。**

---

## 2. 数える対象の形

**数える前に形をすべて列挙した。** 範囲表記を数え落とすと件数が大きくずれる（`14` §6.4-4）。

| # | 形 | 例 | 実在 |
|:-:|---|---|:-:|
| 1 | `Chapter N-N` | `Chapter 1-5` | 1 件 |
| 2 | `Chapter N.N` | `Chapter 1.9` | 7 件 |
| 3 | `Chapter N` | `Chapter 2` | 69 件 |
| 4 | `ChN-N` | `Ch1-2` | 273 件 |
| 5 | `ChN.N` | `Ch3.6` | 69 件 |
| 6 | `ChN` | `Ch3` | 279 件 |
| 7 | **`第N章`** | `第7章` | **59 件** |
| — | `#chapter-N` アンカー | `#chapter-10-headless-mode` | 14 件 |

**波ダッシュの範囲（`Ch1〜Ch4`）は 0 件であった。** 範囲はすべてハイフンである。

---

## 3. 分類 — 置換対象と対象外

> **ja と en では、自文書の章と仕様書の章の書き分け方が違う。**

| 言語 | 自文書の章 | 仕様書の章 |
|---|---|---|
| **ja** | **`第N章`** | `ChN` / `Chapter N` |
| **en** | **`Chapter N`** | `ChN` / `Chapter N` |

**en は両方を `Chapter N` と書くため、機械では切り分けられない。** そこで en の該当箇所を 1 件ずつ目で確かめた。

**確かめた結果:** `full-auto-dev-process-rules.md` / `full-auto-dev-document-rules.md` / `CLAUDE.md` の 3 文書に現れる散文中の `Chapter N` は、**すべて自文書の章を指していた。** いずれも「Section N.x」を伴うか、自章の成果物を名指している（例: `Place the agent definitions from Chapter 7 in .claude/agents/`）。**これら 3 文書が仕様書の章を `Chapter N` と書いている例は 1 件も無い。仕様書は `ChN` で指している。**

**分類の規則:**

| # | 規則 | 判定 |
|:-:|---|---|
| 1 | `第N章` | **対象外** |
| 2 | `#chapter-N` アンカー | **対象外** |
| 3 | 見出し `## Chapter N:` および目次 `- [Chapter N:` | **対象外** |
| 4 | 上記 3 文書の散文中の `Chapter N` | **対象外**（目視で確認済み） |
| 5 | `ChN` / `ChN.N` / `ChN-N` | **置換対象** |
| 6 | それ以外の `Chapter N` / `Chapter N.N` / `Chapter N-N` | **置換対象** |

---

## 4. 件数

### A. 置換対象 —— 仕様書の章への参照

| 表記 | en | ja | 合計 |
|---|---:|---:|---:|
| `Chapter N-N` | 0 | 1 | **1** |
| `Chapter N.N` | 2 | 5 | **7** |
| `Chapter N` | 14 | 15 | **29** |
| `ChN-N` | 137 | 136 | **273** |
| `ChN.N` | 36 | 33 | **69** |
| `ChN` | 140 | 139 | **279** |
| **合計** | **329** | **329** | **658** |

> **en と ja の合計が 329 で一致している。** `check-parity` が 41 ファイル対で行数一致を強制している以上、これは健全性の印である。**一致しなければ、どちらかに数え落としか実体の差がある。**

### B. 対象外 —— 文書自身の章

| 表記 | en | ja | 合計 |
|---|---:|---:|---:|
| `Chapter N` | 40 | 0 | **40** |
| `第N章` | 0 | 59 | **59** |
| `#chapter-N` アンカー | 14 | 0 | **14** |
| **合計** | **54** | **59** | **113** |

**内訳の説明:** en の 40 件は、プロセス規則文書の第 1〜14 章の見出し 14 件 + 目次 14 件 + 散文からの参照 12 件である。ja の 59 件も同じ構造で、`第3章`×7 / `第5章`×5 / `第6章`×4 / `第7章`×9 / `第8章`×6 / `第9章`×4 / 残りの章 ×3 ずつ。

### C. 置換対象の数字別内訳

| 数字 | en | ja | 合計 |
|---:|---:|---:|---:|
| 9 | 3 | 3 | **6** |
| 8 | 8 | 8 | **16** |
| 6 | 64 | 64 | **128** |
| 5 | 17 | 17 | **34** |
| 4 | 46 | 46 | **92** |
| 3 | 147 | 147 | **294** |
| 2 | 120 | 120 | **240** |
| 1 | 99 | 99 | **198** |

> **7 以上の章番号は 1 件も無い。** 8 は `Ch1.8`（Glossary）、9 は `Ch1.9`（Notation）の節番号である。**これは framework-src が 6 章構成であることと整合する。**

### D. 置換対象のファイル別内訳

| ファイル | `Chapter N-N` | `Chapter N.N` | `Chapter N` | `ChN-N` | `ChN.N` | `ChN` | 合計 |
|---|---:|---:|---:|---:|---:|---:|---:|
| `en/process-rules/full-auto-dev-process-rules.md` | — | — | — | 53 | 1 | 38 | **92** |
| `ja/process-rules/full-auto-dev-process-rules.md` | — | — | — | 53 | 1 | 38 | **92** |
| `en/process-rules/spec-template.md` | — | 1 | 12 | 4 | 8 | 8 | **33** |
| `ja/process-rules/spec-template.md` | 1 | 4 | 13 | 3 | 5 | 7 | **33** |
| `en/agents/architect.md` | — | — | — | 12 | 1 | 13 | **26** |
| `ja/agents/architect.md` | — | — | — | 12 | 1 | 13 | **26** |
| `en/process-rules/full-auto-dev-document-rules.md` | — | — | — | 9 | 1 | 11 | **21** |
| `ja/process-rules/full-auto-dev-document-rules.md` | — | — | — | 9 | 1 | 11 | **21** |
| `en/process-rules/review-standards.md` | — | — | — | 3 | 9 | 7 | **19** |
| `ja/process-rules/review-standards.md` | — | — | — | 3 | 9 | 7 | **19** |
| `en/commands/full-auto-dev.md` | — | — | — | 6 | — | 12 | **18** |
| `ja/commands/full-auto-dev.md` | — | — | — | 6 | — | 12 | **18** |
| `en/process-rules/defect-taxonomy.md` | — | — | — | 5 | — | 11 | **16** |
| `ja/process-rules/defect-taxonomy.md` | — | — | — | 5 | — | 11 | **16** |
| `en/agents/review-agent.md` | — | — | — | 11 | 2 | 2 | **15** |
| `ja/agents/review-agent.md` | — | — | — | 11 | 2 | 2 | **15** |
| `en/agents/srs-writer.md` | — | 1 | 2 | 9 | — | — | **12** |
| `ja/agents/srs-writer.md` | — | 1 | 2 | 9 | — | — | **12** |
| `en/agents/test-engineer.md` | — | — | — | — | — | 11 | **11** |
| `ja/agents/test-engineer.md` | — | — | — | — | — | 11 | **11** |
| `en/agents/kotodama-kun.md` | — | — | — | — | 8 | — | **8** |
| `ja/agents/kotodama-kun.md` | — | — | — | — | 8 | — | **8** |
| `en/agents/implementer.md` | — | — | — | 3 | 1 | 3 | **7** |
| `ja/agents/implementer.md` | — | — | — | 3 | 1 | 3 | **7** |
| `en/agents/technical-authority.md` | — | — | — | 1 | 2 | 3 | **6** |
| `ja/agents/technical-authority.md` | — | — | — | 1 | 2 | 3 | **6** |
| `en/agents/security-reviewer.md` | — | — | — | — | — | 5 | **5** |
| `ja/agents/security-reviewer.md` | — | — | — | — | — | 5 | **5** |
| `en/process-rules/agent-list.md` | — | — | — | 4 | 1 | — | **5** |
| `ja/process-rules/agent-list.md` | — | — | — | 4 | 1 | — | **5** |
| `en/CLAUDE.md` | — | — | — | 2 | — | 2 | **4** |
| `ja/CLAUDE.md` | — | — | — | 2 | — | 2 | **4** |
| `en/agents/change-manager.md` | — | — | — | 3 | — | 1 | **4** |
| `ja/agents/change-manager.md` | — | — | — | 3 | — | 1 | **4** |
| `en/agents/feedback-classifier.md` | — | — | — | 3 | — | 1 | **4** |
| `ja/agents/feedback-classifier.md` | — | — | — | 3 | — | 1 | **4** |
| `en/agents/risk-manager.md` | — | — | — | 2 | — | 2 | **4** |
| `ja/agents/risk-manager.md` | — | — | — | 2 | — | 2 | **4** |
| `en/agents/user-manual-writer.md` | — | — | — | — | 1 | 3 | **4** |
| `ja/agents/user-manual-writer.md` | — | — | — | — | 1 | 3 | **4** |
| `en/agents/project-manager.md` | — | — | — | 3 | — | — | **3** |
| `ja/agents/project-manager.md` | — | — | — | 3 | — | — | **3** |
| `en/agents/field-issue-analyst.md` | — | — | — | 1 | — | 1 | **2** |
| `ja/agents/field-issue-analyst.md` | — | — | — | 1 | — | 1 | **2** |
| `en/agents/field-test-engineer.md` | — | — | — | — | — | 2 | **2** |
| `ja/agents/field-test-engineer.md` | — | — | — | — | — | 2 | **2** |
| `en/process-rules/field-issue-handling-rules.md` | — | — | — | 2 | — | — | **2** |
| `ja/process-rules/field-issue-handling-rules.md` | — | — | — | 2 | — | — | **2** |
| `en/process-rules/glossary.md` | — | — | — | — | 1 | 1 | **2** |
| `ja/process-rules/glossary.md` | — | — | — | — | 1 | 1 | **2** |
| `en/process-rules/prompt-structure.md` | — | — | — | — | — | 2 | **2** |
| `ja/process-rules/prompt-structure.md` | — | — | — | — | — | 2 | **2** |
| `en/agents/progress-monitor.md` | — | — | — | 1 | — | — | **1** |
| `ja/agents/progress-monitor.md` | — | — | — | 1 | — | — | **1** |
| `en/agents/runbook-writer.md` | — | — | — | — | — | 1 | **1** |
| `ja/agents/runbook-writer.md` | — | — | — | — | — | 1 | **1** |

> **`spec-template.md` だけが ja / en で内訳が食い違う**（ja は `Chapter N-N` 1 件・`Chapter N.N` 4 件、en は 0 件・1 件）。合計は 33 で一致するので行数は揃っているが、**同じ内容を違う表記で書いている箇所がある。手順 10 で揃える。**

### E. 実際に現れた字面

| 表記 | 字面と件数 |
|---|---|
| `Chapter N-N` | `Chapter 1-5`×1 |
| `Chapter N.N` | `Chapter 1.9`×4, `Chapter 4.1`×1, `Chapter 1.8`×1, `Chapter 3.1`×1 |
| `Chapter N` | `Chapter 2`×11, `Chapter 1`×6, `Chapter 3`×4, `Chapter 4`×4, `Chapter 5`×2, `Chapter 6`×2 |
| `ChN-N` | `Ch1-2`×134, `Ch3-6`×90, `Ch3-4`×42, `Ch1-5`×3, `Ch4-6`×2, `Ch1-6`×2 |
| `ChN.N` | `Ch1.8`×15, `Ch3.6`×14, `Ch3.1`×11, `Ch3.3`×10, `Ch3.2`×8, `Ch3.4`×4, `Ch4.1`×3, `Ch3.5`×2, `Ch1.9`×2 |
| `ChN` | `Ch3`×98, `Ch2`×87, `Ch4`×36, `Ch5`×26, `Ch6`×18, `Ch1`×14 |

---

## 5. 旧 → 新の対応（v0.34 → v0.36）

### 5.1 章

| 旧 | 旧の章題 | 新 | 新の章題 |
|---|---|---|---|
| `Ch1` | Foundation | **`Ch1`** | Foundation（**番号は変わらない**） |
| `Ch2` | Requirements | **`Ch4`** | Requirements |
| `Ch3` | Architecture | **`Ch5`** | Design |
| `Ch4` | Specification | **`Ch6`** | Software Specification |
| `Ch5` | Test Strategy | **`Ch7`** | Test Strategy |
| `Ch6` | Design Principles Compliance | **`Ch8`** | Design Principles Compliance |
| — | （新設） | `Ch2` | System Overview |
| — | （新設） | `Ch3` | Use Cases |
| — | （新設） | `Ch9` / `Ch10` / `Ch11` | 3 系統のテスト |

### 5.2 節

| 旧 | 新 | 備考 |
|---|---|---|
| `Ch1.8` | **`Ch1.8`** | Glossary。変わらない |
| `Ch1.9` | **`Ch1.9`** | Notation。変わらない |
| `Ch3.1` 〜 `Ch3.6` | **`Ch5.1` 〜 `Ch5.6`** | 節の並びは保たれる |
| `Ch4.1` | **`Ch9.1` / `Ch10.1` / `Ch11.1`** | **1 対 3 に分裂する。機械的に置換できない** |

### 5.3 範囲

| 旧 | 件数 | 意味 | 新 |
|---|---:|---|---|
| `Ch1-2` | 134 | `spec-foundation` の範囲 | **`Ch1-4`**（`spec-requirements`） |
| `Ch3-6` | 90 | `spec-architecture` の範囲 | **`Ch5-8`**（`spec-design`） |
| `Ch3-4` | 42 | design フェーズで直す範囲 | **`Ch5-6`** |
| `Ch1-5` | 3 | Ch6 から見た「定義・設計・検証」の層 | **`Ch1-7`** |
| `Ch4-6` | 2 | 3b 以降で高くつく範囲 | **`Ch6-8`** |
| `Ch1-6` | 2 | 仕様書の本文全体 | **`Ch1-11`** |
| `Chapter 1-5` | 1 | `Ch1-5` と同じ | **`Chapter 1-7`** |

> **`Ch1-5` / `Ch1-6` / `Chapter 1-5` の 3 種（計 6 件）は「現在の章数」に依存する表現である。** 章が 6 から 11 に増えた分だけ終端が動く。**端点を機械的に写してはならない（MUST NOT）。意味を読んで決める。**

---

## 6. 置換順序

> **範囲表記 → 節番号 → 章番号（降順）。**

| 段 | 対象 | 順序 |
|:-:|---|---|
| 1 | 範囲表記 | `Ch1-2` → `Ch3-6` → `Ch3-4` → `Ch4-6` → `Ch1-5` → `Ch1-6` → `Chapter 1-5` |
| 2 | 節番号 | `Ch3.6` → `Ch3.5` → `Ch3.4` → `Ch3.3` → `Ch3.2` → `Ch3.1`、次に `Ch4.1`（分裂。個別判断） |
| 3 | 章番号（降順） | `Ch6`→`Ch8` → `Ch5`→`Ch7` → `Ch4`→`Ch6` → `Ch3`→`Ch5` → `Ch2`→`Ch4` |

**なぜこの順か:**

| # | 理由 |
|:-:|---|
| 1 | **範囲が先。** `Ch3-6` は `Ch3` を含む。章番号を先に当てると範囲の左端だけが動いて壊れる |
| 2 | **節が章より先。** `Ch3` は `Ch3.6` の先頭に一致する。章を先に当てると `Ch5.6` ではなく `Ch5` + `.6` になる |
| 3 | **章は降順。** 昇順だと `Ch2`→`Ch4` の結果を後続の `Ch4`→`Ch6` が食う |

**降順が衝突しないことの確認:**

| 順 | 置換 | 作られる番号 | その番号を読む置換は既に終わっているか |
|:-:|---|---|---|
| 1 | `Ch6` → `Ch8` | `Ch8` | `Ch8` を読む置換は無い |
| 2 | `Ch5` → `Ch7` | `Ch7` | `Ch7` を読む置換は無い |
| 3 | `Ch4` → `Ch6` | `Ch6` | **済**（順 1） |
| 4 | `Ch3` → `Ch5` | `Ch5` | **済**（順 2） |
| 5 | `Ch2` → `Ch4` | `Ch4` | **済**（順 3） |

**`Ch1` は置換しない。番号が変わらないためである。** ただし Ch1 の中身（1.9 の図の規則など）は v0.36 で変わるので、**番号が同じことと内容が同じことは別である。**

**`Chapter N` 形も同じ順序で当てる。** 件数が少ない（29 件）ので、1 件ずつ確認して当てる。

---

## 7. 機械的に置換できないもの

| # | 対象 | 件数 | なぜ |
|:-:|---|---:|---|
| 1 | **`Ch4.1` / `Chapter 4.1`** | 4 | **1 対 3 に分裂する。** 文脈がどの系統のテストを指すかで `Ch9.1` / `Ch10.1` / `Ch11.1` が決まる |
| 2 | **`Ch1-5` / `Ch1-6` / `Chapter 1-5`** | 6 | 終端が章数に依存する |
| 3 | **`Chapter N` 形すべて** | 29 | 自文書の章と仕様書の章が同じ字面である。**1 件ずつ目で確かめる** |

**内訳:**

| 区分 | 件数 |
|---|---:|
| **手作業**（上の 3 種） | **39** |
| **番号が変わらない**（`Ch1` 14 / `Ch1.8` 15 / `Ch1.9` 2） | **31** |
| **順序を守れば機械で当たる** | **588** |
| **合計** | **658** |

---

## 8. 変更しないものの記録

**`14` §6.4-3 に従い、変更しないものも理由つきで記す。** 数え漏れと区別が付かなくなるためである。

| 対象 | 件数 | 変更しない理由 |
|---|---:|---|
| `第N章`（ja） | 59 | **プロセス規則文書自身の第 1〜14 章。** 仕様書の章ではない |
| `Chapter N`（en、3 文書の見出し・目次・散文） | 40 | 同上。en は自文書の章も `Chapter N` と書く |
| `#chapter-N` アンカー（en） | 14 | 自文書の目次リンク先 |
| `Ch1` | 14 | **番号が変わらない**（Foundation → Foundation） |
| `Ch1.8` / `Ch1.9` | 17 | 同上（Glossary / Notation） |

---

## 9. まだ測っていないこと

| # | 内容 |
|:-:|---|
| 1 | **`tools/**` と `.claude/**` は数えていない。** どちらも `framework-src/` からの配置物であり、`.gitignore` が除外している。**元が直れば配置物も直る** |
| 2 | **`maintenance/**` と `prompt/**` は数えていない。** 履歴であり、書き換えない |
| 3 | **章題そのものの置換件数は数えていない。**「Architecture」「Specification」といった語の出現は本書の対象外である。手順 1（用語集）と手順 2（spec-template）で扱う |
| 4 | **節番号の中身の妥当性は見ていない。** 例えば `Ch3.3` が本当に File Structure を指しているかは、手順ごとに現物で確かめる |
