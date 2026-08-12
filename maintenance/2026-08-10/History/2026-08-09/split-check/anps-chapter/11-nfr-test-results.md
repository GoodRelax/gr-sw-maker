# NFR Test Results

**Grammar**: spec.sgra
**UID**: DOC-NFR-TEST-RESULTS
**Version**: 0.1

## Chapter 11. Non-Functional Tests (非機能テスト)

### 11.2 Test Results (テスト結果)

#### [PASS] [対応するテストケースの名前]

**Type**: TEST_RESULT
**UID**: TR-005
**RESULT**: PASS
**EXECUTED_ON**: [UTC の ISO 8601 日時を記入する]
**TESTED_VERSION**: [被試験ソフトを一意に特定する commit SHA を記入する]
**ENVIRONMENT**: [測った環境を記入する]

**EVIDENCE**: [後から取り出せるログの位置・実行 ID・成果物のパスを記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `TC-005`
  **Role**: `ResultOf`

#### [PASS] [2 つ目のテスト結果]

**Type**: TEST_RESULT
**UID**: TR-006
**RESULT**: PASS
**EXECUTED_ON**: [UTC の ISO 8601 日時を記入する]
**TESTED_VERSION**: [被試験ソフトを一意に特定する commit SHA を記入する]
**ENVIRONMENT**: [測った環境を記入する]

**EVIDENCE**: [取り出せる位置]

**Relations**:

- **Type**: `Parent`
  **ID**: `TC-006`
  **Role**: `ResultOf`
