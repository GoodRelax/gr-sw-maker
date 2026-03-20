``````markdown
# ANMSグラフスキーマ定義

## 1. 抽象スキーマ — SpecNode と SpecEdge

グラフの本質は2つだけ。ノードとエッジ。

**Abstract_Schema:**

```mermaid
classDiagram
    class SpecNode {
        id string
        stfb_layer int
        content_ref string
    }

    class SpecEdge {
        relation string
        direction enum
    }

    SpecEdge --> SpecNode : source
    SpecEdge --> SpecNode : target
```

上図はANMSグラフの抽象データ構造を示す。全てのノードは `SpecNode` であり、全てのエッジは `SpecEdge` である。

**SpecNode — 仕様要素の抽象表現:**

| パラメータ | 型 | 説明 |
|---|---|---|
| `id` | string | 仕様要素の一意識別子。接頭辞でノード種別を示す（例: `FR-001`, `CMP-003`） |
| `stfb_layer` | int (1-6) | STFB階層。1が最も安定（CA最内層）、5が最も柔軟（CA最外層）、6はメタ層 |
| `content_ref` | string | Markdown上の実体への参照パス。MDはビューであり、この参照を通じてレンダリングされる |

**SpecEdge — 仕様要素間の関係:**

| パラメータ | 型 | 説明 |
|---|---|---|
| `relation` | string | エッジの種別。具体的な関係を示す（例: STRUCTURED_BY, CONSTRAINED_BY, TRACES_TO） |
| `direction` | enum | エッジの方向制約。forward / trace / meta の3種。詳細は1.1節 |
| `source` | SpecNode | エッジの起点。依存する側（CA外側、柔軟層）。例: 「Component --STRUCTURED_BY--> Requirement」では Component |
| `target` | SpecNode | エッジの終点。依存される側（CA内側、安定層）。例: 同上では Requirement |

矢印の向きはCAの依存方向に従う。**外側（柔軟）が内側（安定）に依存する。** sourceはtargetを知るが、targetはsourceを知らない。

### 1.1 エッジの方向制約

SpecEdge の `direction` は3種のみ。

| direction | ルール | 意味 |
|---|---|---|
| forward | source.stfb_layer >= target.stfb_layer | 外側→内側。CA依存方向 |
| trace | source.stfb_layer < target.stfb_layer | 内側→外側。CA例外。トレーサビリティ用途に限定 |
| meta | source.stfb_layer = 6 | メタ層からの横断評価 |

**これだけで CAの依存性逆転原則（DIP）がグラフレベルで強制される。**

---

## 2. STFB層構造 — 抽象的な階層

具体的なノードタイプを知らなくても、層と方向だけでグラフの骨格が決まる。

**STFB_Layers:**

```mermaid
flowchart LR
    L5["Layer 5<br/>most flexible"]
    L4["Layer 4"]
    L3["Layer 3"]
    L2["Layer 2"]
    L1["Layer 1<br/>most stable"]
    L6["Layer 6<br/>meta"]

    L5 ==>|forward| L4
    L4 ==>|forward| L3
    L3 ==>|forward| L2
    L2 ==>|forward| L1
    L6 -.->|meta| L3

    style L1 fill:#1a5276,stroke:#333,color:#fff
    style L2 fill:#2e86c1,stroke:#333,color:#fff
    style L3 fill:#48c9b0,stroke:#333,color:#000
    style L4 fill:#f9e79f,stroke:#333,color:#000
    style L5 fill:#f9e79f,stroke:#333,color:#000
    style L6 fill:#d5dbdb,stroke:#333,color:#000
```

上図はSTFBの6層構造とCA依存方向を示す。太線がforward（外側→内側）、点線がmeta。矢印はCAの依存方向に従い、柔軟層（外側）から安定層（内側）へ向かう。具体的に何がどの層に入るかは次節で定義する。

---

## 3. 具体スキーマ — ノードタイプの特殊化

SpecNode を各STFB層に特殊化する。

**Concrete_Node_Types:**

```mermaid
classDiagram
    class SpecNode {
        id string
        stfb_layer int
        content_ref string
    }

    class Foundation {
        stfb_layer = 1
        section enum
    }

    class Glossary {
        stfb_layer = 1
        term string
        definition string
    }

    class Requirement {
        stfb_layer = 2
        kind enum
        ears_pattern enum
    }

    class Component {
        stfb_layer = 3
        ca_layer enum
    }

    class Decision {
        stfb_layer = 3
        status enum
    }

    class Diagram {
        stfb_layer int
        diagram_type enum
    }

    class Scenario {
        stfb_layer = 4
        result enum
    }

    class TestStrategy {
        stfb_layer = 5
        test_level enum
    }

    class DesignPrinciple {
        stfb_layer = 6
        category enum
        status enum
    }

    SpecNode <|-- Foundation
    SpecNode <|-- Glossary
    SpecNode <|-- Requirement
    SpecNode <|-- Component
    SpecNode <|-- Decision
    SpecNode <|-- Diagram
    SpecNode <|-- Scenario
    SpecNode <|-- TestStrategy
    SpecNode <|-- DesignPrinciple
```

上図はSpecNodeから各具体ノードタイプへの継承関係を示す。各ノードは共通プロパティ（id, stfb_layer, content_ref）を継承し、固有プロパティを追加する。

---

## 4. 具体スキーマ — エッジタイプの特殊化

SpecEdge を具体的なエッジタイプに特殊化する。全てのエッジはCAの依存方向に従い、外側（柔軟層）から内側（安定層）へ向かう。

**Concrete_Edge_Types:**

```mermaid
flowchart TD
    tst["TestStrategy<br/>Layer 5"]
    scn["Scenario<br/>Layer 4"]
    cmp["Component<br/>Layer 3"]
    adr["Decision<br/>Layer 3"]
    req["Requirement<br/>Layer 2"]
    fnd["Foundation<br/>Layer 1"]
    glo["Glossary<br/>Layer 1"]
    dgm["Diagram<br/>Layer varies"]
    dpr["DesignPrinciple<br/>Layer 6"]

    tst -->|VERIFIES| scn
    scn -->|ELABORATED_FROM| cmp
    cmp -->|STRUCTURED_BY| req
    req -->|CONSTRAINED_BY| fnd
    dpr -.->|EVALUATES| cmp

    scn -->|TRACES_TO| req
    cmp -->|DEPENDS_ON| cmp
    req -->|DEPENDS_ON| req
    adr -->|DECIDES| cmp
    req -->|DEFINED_BY| glo
    fnd -->|DEFINED_BY| glo
    dgm -->|VISUALIZES| cmp
    dgm -->|VISUALIZES| scn

    style fnd fill:#1a5276,stroke:#333,color:#fff
    style glo fill:#1a5276,stroke:#333,color:#fff
    style req fill:#2e86c1,stroke:#333,color:#fff
    style cmp fill:#48c9b0,stroke:#333,color:#000
    style adr fill:#48c9b0,stroke:#333,color:#000
    style dgm fill:#af7ac5,stroke:#333,color:#fff
    style scn fill:#f9e79f,stroke:#333,color:#000
    style tst fill:#f9e79f,stroke:#333,color:#000
    style dpr fill:#d5dbdb,stroke:#333,color:#000
```

上図は全ノードタイプ間の具体的なエッジタイプと方向を示す。全ての矢印はCAの依存方向（外側→内側）に従う。実線はforward、点線はmeta。色はSTFB層に対応する。

### 4.1 エッジ定義表

| エッジ | source（依存する側） | target（依存される側） | direction | 意味 |
|---|---|---|---|---|
| CONSTRAINED_BY | Requirement | Foundation | forward | 要求は基本事項に制約される |
| STRUCTURED_BY | Component | Requirement | forward | コンポーネントは要求により構造化される |
| ELABORATED_FROM | Scenario | Component | forward | シナリオはコンポーネントから展開される |
| VERIFIES | TestStrategy | Scenario | forward | テスト戦略がシナリオを検証する |
| EVALUATES | DesignPrinciple | Component | meta | 設計原則がコンポーネントを評価する |
| TRACES_TO | Scenario | Requirement | forward | シナリオから要求へのトレーサビリティ |
| DEPENDS_ON | Node | Node 同種 | forward | 同種ノード間の依存 |
| DECIDES | Decision | Component | forward | 設計判断がコンポーネントを決定する |
| DEFINED_BY | Foundation or Requirement | Glossary | forward | 仕様要素が用語定義に依存する |
| VISUALIZES | Diagram | any Node | forward | 図が仕様要素を可視化する |

---

## 5. Enum定義

| プロパティ | 値 |
|---|---|
| direction | forward, trace, meta |
| section | background, issues, goals, approach, scope, constraints, limitations, notation |
| kind | FR, NFR |
| ears_pattern | ubiquitous, event_driven, state_driven, unwanted_behavior, optional_feature, complex |
| ca_layer | entity, usecase, adapter, framework |
| status (Decision) | proposed, accepted, deprecated, superseded |
| diagram_type | component, class, sequence, state, activity, er |
| result | PASS, CONDITIONAL, FAIL, SKIP |
| test_level | unit, integration, e2e, performance |
| category | naming, dependency, simplicity, responsibility, solid, coupling, readability, testing, purity, state, concurrency, error, resource, immutability, efficiency |
| status (DP) | compliant, non_compliant, not_evaluated |
``````
