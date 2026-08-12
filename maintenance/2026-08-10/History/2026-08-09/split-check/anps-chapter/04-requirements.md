# Requirements

**Grammar**: spec.sgra
**UID**: DOC-REQUIREMENTS
**Version**: 0.1

## Chapter 4. Requirements (要求)

### 4.1 Functional Requirements (機能要求)

#### [システムの振る舞いを 1 つ、名前として記入する]

**Type**: FUNC_REQ
**UID**: FR-001

**STATEMENT**: [EARS 1 文で記入する。条件を主語より先に置き、「〜すること。」で終える]

**ORIGIN**: [どの手順または拡張から来たかを記入する]

**RATIONALE**: [なぜこの要求が要るのかを記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `UC-001`
  **Role**: `Satisfies`

#### [2 つ目の機能要求]

**Type**: FUNC_REQ
**UID**: FR-002

**STATEMENT**: [EARS 1 文で書く]

**ORIGIN**: [出どころ]

**RATIONALE**: [理由]

**Relations**:

- **Type**: `Parent`
  **ID**: `UC-002`
  **Role**: `Satisfies`

### 4.2 Non-Functional Requirements (非機能要求)

#### [品質の要求を 1 つ、名前として記入する]

**Type**: NON_FUNC_REQ
**UID**: NFR-001

**STATEMENT**: [測定可能な数値基準を含む EARS 1 文で記入する]

**RATIONALE**: [どの経路・どの機器に効くのかを名前で記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `GL-002`
  **Role**: `Satisfies`

#### [2 つ目の非機能要求]

**Type**: NON_FUNC_REQ
**UID**: NFR-002

**STATEMENT**: [数値基準を含む EARS 1 文で書く]

**RATIONALE**: [効く対象]

**Relations**:

- **Type**: `Parent`
  **ID**: `GL-001`
  **Role**: `Satisfies`

### 4.3 Reduction Candidates (削減候補)

**Type**: SECTION

| 対象ID           | 紐づけ先が無い理由 | 外すと何が起きるか | ユーザーの判断 |
| ---------------- | ------------------ | ------------------ | -------------- |
| [UID / 候補なし] | [理由]             | [1 行で記入する]   | [残す / 外す]  |
| [2 つ目の対象ID] | [理由]             | [1 行で書く]       | [残す / 外す]  |
