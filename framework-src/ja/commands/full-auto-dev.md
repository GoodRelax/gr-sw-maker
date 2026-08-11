---
description: ほぼ全自動ソフトウェア開発を実行する
---

# full-auto-dev

**この文書は手順を持たない。どの表をいつ読むかだけを持つ。**

手順の正本は `process-rules/` の作業表である。**ここに手順を写してはならない（MUST NOT）** —— 写した瞬間に二重管理になり、必ず表とずれる。

## 最初に読むもの

**`process-rules/development-mode.md` を読む。** 次の 5 つを持っている。

| 何 | 使うとき |
|---|---|
| 表 0 開発方式の判定 | `1e` で方式を決めるとき |
| 表 A 仕様書 | 仕様形式と枚数を決めるとき |
| 作業表の列の意味と `入力` に使ってよい語 | **すべての依頼文を書くとき** |
| 表 M 方式ごとの実施・免除 | **どの手順を走らせるか決めるとき（全 96 手順）** |
| 表 E-1 / E-2 レビューと合格線 | レビューを起動するとき |

## フェーズごとに読む表

**現在のフェーズの表だけを読む。前のフェーズの表を読み直してはならない（MUST NOT）。** 済んだ手順の成果物は `入力` 列が場所で指している。

| フェーズ | 読む表 |
|---|---|
| Phase 0 インストール | `process-rules/work-table-0-install.md` |
| Phase 1 初期設定 | `process-rules/work-table-1-setup.md` |
| Phase 2 企画 | `process-rules/work-table-2-planning.md` |
| Phase 3 外部依存選定 | `process-rules/work-table-3-dependency.md` |
| Phase 4 設計 | `process-rules/work-table-4-design.md` |
| Phase 5 実装 | `process-rules/work-table-5-implementation.md` |
| Phase 6 テスト | `process-rules/work-table-6-test.md` |
| Phase 7 納品 | `process-rules/work-table-7-delivery.md` |
| Phase 8 運用・保守 | `process-rules/work-table-8-operation.md` |

**`process-rules/work-table-common.md` は全フェーズで参照する。** フェーズ完了時の手順（`Fa`〜`Fe`）と、随時発火する手順（`Ff`〜`Fk`）を持つ。

## 進め方

1. **`0a` から順に、表の 1 行を 1 つの依頼として実行する。** 行が持つ `依頼元` / `担当者` / `モデル` / `入力` / `出力` / `依頼元へ返す` が、そのまま依頼文の中身になる
2. **表 M でその方式が `実施` の手順だけ走らせる。** `条件付き` は備考の条件で判定し、判定の理由を記録する
3. **同じ手順記号に複数行あるときは、備考の `[直列]` / `[同時]` / `[簡易・標準]` / `[厳格]` に従う**
4. **フェーズの終わりでゲートを判定する。** PASS したら次のフェーズの表を読む。FAIL したら `Fk` が戻り先を決める
5. **依頼文には `development-mode.md` の「依頼に必ず添える与件」を必ず添える。** サブエージェントは会話履歴を見ない

## やってはならないこと

- **手順をこの文書に写してはならない（MUST NOT）**
- **表に無い手順を実行してはならない（MUST NOT）。** 足りないと気づいたら、実行せずに利用者へ上げる
- **エージェントに別のエージェントを起動させてはならない（MUST NOT）。** 依頼元は `main-agent` か利用者だけである（`process-rules/agent-orchestration-rules.md`）
