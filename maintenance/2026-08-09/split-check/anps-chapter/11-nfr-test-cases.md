# NFR Test Cases

**Grammar**: spec.sgra
**UID**: DOC-NFR-TEST-CASES
**Version**: 0.1

## Chapter 11. Non-Functional Tests (非機能テスト)

### 11.1 Test Cases (テストケース)

#### [確かめることを 1 つ、名前として記入する]

**Type**: NON_FUNC_TEST
**UID**: TC-003

**GIVEN**: [測り方と負荷の条件を完全な文で記入する]

**WHEN**: [きっかけを完全な文で記入する]

**THEN**: [親の NON_FUNC_REQ と一致する数値を含む結果を完全な文で記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `NFR-001`
  **Role**: `Verifies`
- **Type**: `File`
  **Path**: `[テストコードの位置]`
