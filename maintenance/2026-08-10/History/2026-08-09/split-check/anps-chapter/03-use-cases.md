# Use Cases

**Grammar**: spec.sgra
**UID**: DOC-USE-CASES
**Version**: 0.1

## Chapter 3. Use Cases (ユースケース)

### 3.1 Actors (アクター)

**Type**: SECTION

| アクター           | アクター種別 | 対応する機器 | 関心           |
| ------------------ | ------------ | ------------ | -------------- |
| [アクター名]       | 人           | 該当なし     | [何を得たいか] |
| [2 つ目のアクター] | 外部システム | [機器名]     | [何を得たいか] |

### 3.2 Use Cases (ユースケース)

#### [アクターの目標を動詞句で記入する]

**Type**: USE_CASE
**UID**: UC-001

**STATEMENT**: [アクターが何を示し、システムが何を返すかを 1 文で記入する]

**SCENARIO**:

1. [アクターがすることを 1 文で記入する]
2. [システムがすることを 1 文で記入する]
3. [システムがすることを 1 文で記入する]

**EXTENSIONS**:

- 2a. [主成功シナリオから外れる条件を記入する]
  - [そのときシステムがすることを記入する]

**Relations**:

- **Type**: `Parent`
  **ID**: `GL-001`
  **Role**: `Satisfies`

#### [2 つ目のユースケース]

**Type**: USE_CASE
**UID**: UC-002

**STATEMENT**: [1 文で書く]

**SCENARIO**:

1. [手順 1]
2. [手順 2]
3. [手順 3]

**EXTENSIONS**:

- 2a. [条件]
  - [処置]

**Relations**:

- **Type**: `Parent`
  **ID**: `GL-001`
  **Role**: `Satisfies`
