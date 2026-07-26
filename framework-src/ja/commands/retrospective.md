以下のふりかえりを実施してください:

## 分析フェーズ（process-improver が実施）

1. project-records/defects/ のdefect 票をすべて読み込む
2. 繰り返し発生しているdefect パターンを特定する
3. 根本原因を分析する（CMMI CARプロセス）
4. 文書管理規則（process-rules/full-auto-dev-document-rules.md）の適合性を確認する
   - Common Block / Form Block の構造は実態に合っているか
   - 不足しているフィールドや不要なフィールドはないか
5. project-records/improvement/retrospective-{今日の日付}.md に分析結果と改善策を記録する

## 承認フェーズ（orchestrator が実施）

6. 改善策の承認判断を行う:
   - CLAUDE.md / process-rules の変更 → ユーザーに承認を求める
   - エージェント定義の変更 → orchestrator が判断する

## 適用フェーズ（decree-writer が実施）

7. 承認済みの改善策を対象ファイルに適用する
8. before/after diff を project-records/improvement/ に記録する

## 再発防止策の記録形式
- defect パターン: [パターンの説明]
- 根本原因: [Why-Why分析の結果]
- 対策: [CLAUDE.mdまたはエージェント定義への追記内容]
- 効果確認方法: [次フェーズでの確認方法]
