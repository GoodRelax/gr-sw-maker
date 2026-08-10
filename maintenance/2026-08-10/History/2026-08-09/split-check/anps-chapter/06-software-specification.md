# Software Specification

**Grammar**: spec.sgra
**UID**: DOC-SOFTWARE-SPECIFICATION
**Version**: 0.1

## Chapter 6. Software Specification (ソフトウェア仕様)

### 6.1 Software Specifications (ソフトウェア仕様)

#### [実装可能な言明を 1 つ、名前として記入する]

**Type**: SW_SPEC
**UID**: SWS-001

**STATEMENT**: [EARS 1 文で記入する。符号・状態遷移・境界値などの手段を書く]

**RATIONALE**: [親の要求を、どの経路・どの条件で具体化したものかを記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `FR-001`
  **Role**: `Satisfies`

#### [2 つ目のソフトウェア仕様]

**Type**: SW_SPEC
**UID**: SWS-002

**STATEMENT**: [EARS 1 文で書く]

**RATIONALE**: [具体化の理由]

**Relations**:

- **Type**: `Parent`
  **ID**: `FR-002`
  **Role**: `Satisfies`

### 6.2 Data Schema (データスキーマ)

**Type**: SECTION

**[スキーマの名前]:**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "[名前]",
  "type": "object",
  "required": [],
  "properties": {},
  "additionalProperties": false
}
```

[永続ストアを持たない場合は「持たない」と記入し、Chapter 2.4 と揃える]
