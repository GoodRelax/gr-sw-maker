以下のふりかえりを実施してください:

1. project-records/defects/ のdefect 票をすべて読み込む
2. 繰り返し発生しているdefect パターンを特定する
3. 根本原因を分析する（CMMI CARプロセス）
4. CLAUDE.mdのコーディング規約・チェック項目に再発防止策を追記する
5. 関連するエージェント定義（.claude/agents/）を更新する
6. 文書管理規則（process-rules/full-auto-dev-document-rules-ja.md）の適合性を確認する
   - Common Block / Form Block の構造は実態に合っているか
   - 不足しているフィールドや不要なフィールドはないか
   → 改定が必要な場合はユーザーに報告し、承認を得てから改定する
7. project-records/improvement/retrospective-{今日の日付}.md に分析結果を記録する

## 再発防止策の記録形式
- defect パターン: [パターンの説明]
- 根本原因: [Why-Why分析の結果]
- 対策: [CLAUDE.mdまたはエージェント定義への追記内容]
- 効果確認方法: [次フェーズでの確認方法]
