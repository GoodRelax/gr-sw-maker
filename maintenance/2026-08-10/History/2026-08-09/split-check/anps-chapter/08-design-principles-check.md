# Design Principles Check

**Grammar**: spec.sgra
**UID**: DOC-DESIGN-PRINCIPLES-CHECK
**Version**: 0.1

## Chapter 8. Design Principles Compliance (SW設計原則 準拠確認)

**Type**: SECTION

| カテゴリ | 識別名               | 確認観点                                           | 判定          | 根拠   |
| -------- | -------------------- | -------------------------------------------------- | ------------- | ------ |
| 命名     | Naming               | 意図が伝わる命名か。Chapter 1.8 の語彙と一致するか | [PASS / FAIL] | [根拠] |
| 依存関係 | Dependency Direction | 依存方向が Chapter 5.1 の層に従っているか          | [PASS / FAIL] | [根拠] |
| 簡潔性   | KISS                 | 動作する最も単純な解決を選んでいるか               | [PASS / FAIL] | [根拠] |
| 責務分離 | SRP                  | 各クラス・ユニットが単一の責務を持つか             | [PASS / FAIL] | [根拠] |
| SOLID    | DIP                  | 具象ではなく抽象に依存しているか                   | [PASS / FAIL] | [根拠] |
| 並行性   | Concurrency Safety   | デッドロック・競合状態・グリッチが発生しないか     | [PASS / FAIL] | [根拠] |

[確認する原則はプロジェクトの性質に応じて追加・削除する]
