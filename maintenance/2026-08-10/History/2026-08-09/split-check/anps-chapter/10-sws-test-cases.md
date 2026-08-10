# SWS Test Cases

**Grammar**: spec.sgra
**UID**: DOC-SWS-TEST-CASES
**Version**: 0.1

## Chapter 10. Software Specification Tests (ソフトウェア仕様テスト)

### 10.1 Test Cases (テストケース)

#### [確かめることを 1 つ、名前として記入する]

**Type**: SW_SPEC_TEST
**UID**: TC-003
**TEST_LEVEL**: Unit

**GIVEN**: [前提を完全な文で記入する]

**WHEN**: [きっかけを完全な文で記入する]

**THEN**: [観測できる結果を完全な文で記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `SWS-001`
  **Role**: `Verifies`
- **Type**: `File`
  **Path**: `[テストコードの位置]`

#### [2 つ目のテストケース]

**Type**: SW_SPEC_TEST
**UID**: TC-004
**TEST_LEVEL**: Integration

**GIVEN**: [前提]

**WHEN**: [きっかけ]

**THEN**: [結果]

**Relations**:

- **Type**: `Parent`
  **ID**: `SWS-002`
  **Role**: `Verifies`
- **Type**: `File`
  **Path**: `[テストコードの位置]`
