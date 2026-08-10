# SWS Test Results

**Grammar**: spec.sgra
**UID**: DOC-SWS-TEST-RESULTS
**Version**: 0.1

## Chapter 10. Software Specification Tests (ソフトウェア仕様テスト)

### 10.2 Test Results (テスト結果)

#### [PASS] [対応するテストケースの名前]

**Type**: TEST_RESULT
**UID**: TR-003
**RESULT**: PASS
**EXECUTED_ON**: [UTC の ISO 8601 日時を記入する]
**TESTED_VERSION**: [被試験ソフトを一意に特定する commit SHA を記入する]
**ENVIRONMENT**: [測った環境を記入する]

**EVIDENCE**: [後から取り出せるログの位置・実行 ID・成果物のパスを記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `TC-003`
  **Role**: `ResultOf`

#### [PASS] [2 つ目のテスト結果]

**Type**: TEST_RESULT
**UID**: TR-004
**RESULT**: PASS
**EXECUTED_ON**: [UTC の ISO 8601 日時を記入する]
**TESTED_VERSION**: [被試験ソフトを一意に特定する commit SHA を記入する]
**ENVIRONMENT**: [測った環境を記入する]

**EVIDENCE**: [取り出せる位置]

**Relations**:

- **Type**: `Parent`
  **ID**: `TC-004`
  **Role**: `ResultOf`
