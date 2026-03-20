# Graph Database Comparative Analysis (2024-2026)

Research date: 2026-03-08

> **Note:** This analysis is based on web research. Where information could not be independently verified or was uncertain, it is noted explicitly. Version numbers and features reflect what was publicly documented as of early March 2026.

---

## 1. Neo4j

| Attribute | Details |
|---|---|
| **Latest Version** | Neo4j 2026.01.4 (CalVer format since 2025.01.0; previously semantic versioning) |
| **Licensing** | Dual license: Community Edition under AGPLv3; Enterprise Edition under commercial license. Enterprise adds clustering, backups, failover. |
| **Query Language** | Cypher (Cypher 25 is the latest; Cypher 5 frozen as of 2025.06 and remains default for new DBs). GQL support is in progress given Neo4j's role in the ISO GQL standard development. |
| **Multi-Model** | Primarily a property graph database. Supports vector properties (VECTOR type introduced in 2025). Not a general multi-model DB. |
| **Scalability** | Clustering and causal clustering (Enterprise). Sharding via Fabric (federated queries across databases). Vertical and horizontal scaling in Enterprise. |
| **AI/LLM Integration** | New `ai.*` namespace in Cypher (2025.11+) with `ai.text.embed`, `ai.text.embedBatch`. Integrations with LangChain, LlamaIndex. Neo4j GenAI Plugin supports OpenAI, Azure OpenAI, Vertex AI, Amazon Bedrock. GraphRAG workflows supported natively. |
| **Vector/Embedding** | Native vector indexes and vector similarity search. Vector type is a first-class Cypher type. Early 2026: new Cypher language support for vector search combined with filtering. |
| **Known Limitations** | Community Edition lacks clustering, online backup, role-based access. AGPLv3 copyleft implications for derivative works. Enterprise license cost can be significant. |

**Sources:**
- [Neo4j Supported Versions](https://neo4j.com/developer/kb/neo4j-supported-versions/)
- [Neo4j 2025 Changelog](https://github.com/neo4j/neo4j/wiki/Neo4j-2025-changelog)
- [Neo4j Licensing](https://db-news.com/navigating-the-neo4j-licensing-maze-a-deep-dive-into-agpl-enterprise-and-open-source-implications)
- [Neo4j GenAI Integrations](https://neo4j.com/docs/cypher-manual/current/genai-integrations/)
- [Neo4j Vector Search](https://neo4j.com/developer/genai-ecosystem/vector-search/)
- [Cypher AI Procedures (Dec 2025)](https://medium.com/neo4j/new-cypher-ai-procedures-6b8c3177d56d)

---

## 2. Amazon Neptune / Neptune Analytics

| Attribute | Details |
|---|---|
| **Latest Version** | Managed service (no user-facing version numbers). Neptune Analytics is a separate service from Neptune Database. Sample GenAI Agents feature released February 2026. |
| **Licensing** | Proprietary AWS managed service. Pay-per-use pricing. |
| **Query Language** | Neptune Database: openCypher, Gremlin, SPARQL. Neptune Analytics: openCypher only. |
| **Multi-Model** | Supports property graphs (openCypher/Gremlin) and RDF graphs (SPARQL) in Neptune Database. Neptune Analytics is property-graph only. |
| **Scalability** | Fully managed, auto-scaling on AWS. Neptune Database supports read replicas and serverless. Neptune Analytics is optimized for analytical workloads with in-memory processing. |
| **AI/LLM Integration** | Sample GenAI Agents feature (Feb 2026) guides prototype building from use-case descriptions. Integration with Amazon Bedrock for embeddings. Flexible GraphRAG support added (Oct 2025). |
| **Vector/Embedding** | Neptune Analytics supports native vector similarity search with dimensions 1-65,535. One vector index per graph. Top-K queries with filters callable from openCypher. Embeddings can come from Bedrock, GraphStorm GNNs, or external sources. |
| **Known Limitations** | Vendor lock-in to AWS. Neptune Analytics limited to one vector index per graph. No SQL or relational model support. Neptune Database and Neptune Analytics are separate services with different APIs. SPARQL and Gremlin not available in Analytics. |

**Sources:**
- [Neptune Analytics Vector Similarity](https://docs.aws.amazon.com/neptune-analytics/latest/userguide/vector-similarity.html)
- [What is Neptune Analytics?](https://docs.aws.amazon.com/neptune-analytics/latest/userguide/what-is-neptune-analytics.html)
- [Flexible GraphRAG for Neptune](https://integratedsemantics.org/2025/10/28/flexible-graphrag-amazon-neptune-neptune-analytics-and-graph-explorer-support-added/)
- [Neptune Features](https://aws.amazon.com/neptune/features/)
- [GQL ISO Standard - AWS Blog](https://aws.amazon.com/blogs/database/gql-the-iso-standard-for-graphs-has-arrived/)

---

## 3. ArangoDB

| Attribute | Details |
|---|---|
| **Latest Version** | 3.12+ (exact latest point release not confirmed in research) |
| **Licensing** | Changed from Apache 2.0 to BSL 1.1 starting with v3.12. Converts to Apache 2.0 after 4 years per release. Community Edition has a **100GB dataset limit** and prohibits commercial DBaaS/SaaS/OEM use. Enterprise Edition requires commercial agreement. |
| **Query Language** | AQL (ArangoDB Query Language) - a single unified language for documents, graphs, and search. SQL-like syntax with graph traversal capabilities. |
| **Multi-Model** | Native multi-model: document, graph, key-value, full-text search, geospatial, vector search, time-series. All accessible via AQL. |
| **Scalability** | Horizontal scaling via sharding (SmartGraphs in Enterprise for optimized distributed graph traversals). Supports clustering with multiple coordinators and DB servers. |
| **AI/LLM Integration** | Arango AI Suite includes GraphRAG, co-pilot integrations, chatbot support, agentic AI tooling. HybridGraphRAG combines vector search + graph traversal + full-text search. LangChain integration available. |
| **Vector/Embedding** | Integrated vector search powered by Facebook's FAISS library. Accessible via AQL. Supports hybrid retrieval (vector + graph + full-text). |
| **Known Limitations** | License change from Apache 2.0 to BSL 1.1 was controversial. 100GB limit on Community Edition for commercial use. Multi-model approach may trade off peak graph performance vs. dedicated graph DBs. Rebranding to "Arango" (arango.ai) may cause confusion with older documentation. |

**Sources:**
- [ArangoDB Licensing Update](https://arango.ai/blog/update-evolving-arangodbs-licensing-model-for-a-sustainable-future/)
- [ArangoDB Enterprise](https://arango.ai/products/arangodb/)
- [ArangoDB Vector Search](https://arango.ai/blog/vector-search-in-arangodb-practical-insights-and-hands-on-examples/)
- [ArangoDB GitHub](https://github.com/arangodb/arangodb)
- [ArangoDB Community License PDF](https://arango.ai/wp-content/uploads/2025/11/ADB-Community-License_31OCT2023.pdf)

---

## 4. Apache AGE (PostgreSQL Extension)

| Attribute | Details |
|---|---|
| **Latest Version** | Apache Top Level Project since May 2022. Supports PostgreSQL 11-17 (exact latest AGE release version not confirmed). |
| **Licensing** | Apache License 2.0. Fully open source. |
| **Query Language** | openCypher for graph queries, combinable with standard SQL in the same query. |
| **Multi-Model** | Graph layer on top of PostgreSQL's relational model. Can combine SQL and Cypher queries, join graph results with tabular data. |
| **Scalability** | Inherits PostgreSQL's scalability. Can use Citus extension for horizontal sharding. Otherwise primarily vertical scaling. Supports PostgreSQL's replication and connection pooling. |
| **AI/LLM Integration** | Available on Azure Database for PostgreSQL with Azure AI integration. No dedicated AI/LLM features built into AGE itself. Relies on PostgreSQL ecosystem (e.g., pgai). |
| **Vector/Embedding** | No native vector support in AGE. A proposal for pgvector integration exists (GitHub issue #1121) but is not yet implemented. Users can use pgvector alongside AGE in the same PostgreSQL instance. |
| **Known Limitations** | Graph query performance limited by PostgreSQL's row-based storage (not optimized for graph traversals). Recursive query performance can be a bottleneck. No native vector integration yet. Schema complexity for large graphs. Limited tooling compared to dedicated graph DBs. Cypher implementation may lag behind Neo4j's full feature set. |

**Sources:**
- [Apache AGE Official Site](https://age.apache.org/)
- [Apache AGE GitHub](https://github.com/apache/age)
- [Apache AGE on Azure](https://learn.microsoft.com/en-us/azure/postgresql/azure-ai/generative-ai-age-overview)
- [pgvector Proposal for AGE (Issue #1121)](https://github.com/apache/age/issues/1121)
- [Scaling Apache AGE](https://dev.to/humzakt/scaling-apache-age-for-large-datasets-a-guide-on-how-to-scale-apache-age-for-processing-large-datasets-3nfi)

---

## 5. Memgraph

| Attribute | Details |
|---|---|
| **Latest Version** | Memgraph 3.3 (as of late 2025/early 2026) |
| **Licensing** | Dual license: Business Source License 1.1 (BSL) and Memgraph Enterprise License (MEL). Source code is available but BSL restricts commercial competing use. |
| **Query Language** | openCypher with Memgraph-specific extensions. Bolt protocol for client communication. |
| **Multi-Model** | Primarily a property graph database. Not multi-model in the document/key-value sense. |
| **Scalability** | In-memory architecture. Scales vertically (add RAM). Supports high availability via replication. **No built-in sharding** - limited horizontal write scaling. Data replication for read scaling. |
| **AI/LLM Integration** | AI Graph Toolkit with Unstructured2Graph and SQL2Graph (announced Nov 2025). MCP server integration. LangChain integration. Focus on GraphRAG for enterprise AI. Cypher generation vs. tool invocation research for AI agents. |
| **Vector/Embedding** | Vector property storage and vector indexes supported. Optimized in 3.3 (eliminated data duplication, parallel index recovery). Vector-indexed properties stored only in index to reduce memory. |
| **Known Limitations** | In-memory only - dataset size limited by available RAM. No horizontal sharding for write scaling. Memory consumption can be high for very large datasets. Smaller ecosystem/community compared to Neo4j. BSL license is not truly open source. |

**Sources:**
- [Memgraph Release Notes](https://memgraph.com/docs/release-notes)
- [Memgraph 3.0 Announcement](https://www.businesswire.com/news/home/20250210849379/en/Memgraph-3.0-Delivers-Streamlined-Way-to-Build-Enterprise-Specific-GenAI-and-Agentic-AI)
- [Memgraph AI Toolkit Announcement](https://www.businesswire.com/news/home/20251111832729/en/Memgraph-to-Offer-a-Unique-Toolkit-for-Non-Graph-Users-to-Jumpstart-Their-Journey-to-Full-GraphRAG-AI-Capability)
- [Memgraph License (GitHub)](https://github.com/memgraph/memgraph/blob/master/LICENSE)
- [Memgraph vs Neo4j Comparison](https://medium.com/decoded-by-datacast/memgraph-vs-neo4j-in-2025-real-time-speed-or-battle-tested-ecosystem-66b4c34b117d)

---

## 6. NebulaGraph

| Attribute | Details |
|---|---|
| **Latest Version** | NebulaGraph Enterprise v5.2 (Nov 2025). Open-source version also available. |
| **Licensing** | Open-source edition: Apache License 2.0. Enterprise edition: commercial license with additional features. |
| **Query Language** | nGQL (NebulaGraph Query Language). Enterprise v5.0+ supports **native GQL (ISO standard)** - first distributed graph DB to do so. |
| **Multi-Model** | Primarily a graph database. Not a general multi-model DB. |
| **Scalability** | Shared-nothing distributed architecture with separated compute and storage engines. Designed for graphs with **trillions of edges**. Horizontal scaling without size limits. Millisecond latency at high concurrency. |
| **AI/LLM Integration** | MCP Server released for AI agent integration. LangChain integration. Graph intelligence platform positioning for AI applications. |
| **Vector/Embedding** | Enterprise v5.1+ includes native vector search. v5.2 adds full-text indexes alongside vector search. Hybrid queries combining graph traversal + vector search + full-text search in a single query. |
| **Known Limitations** | GQL and vector search are Enterprise-only features. Open-source edition uses nGQL which is not Cypher-compatible. Smaller Western market presence compared to Neo4j. Enterprise v5.2 claims 100x improvement on certain algorithms, but independent benchmarks are limited. |

**Sources:**
- [NebulaGraph Official Site](https://nebula-graph.io/)
- [NebulaGraph GitHub](https://github.com/vesoft-inc/nebula)
- [NebulaGraph 2025 Year in Review](https://www.nebula-graph.io/posts/NebulaGraph_2025_Year_in_Review)
- [NebulaGraph Enterprise v5.2](https://medium.com/@nebulagraph/unlocking-the-era-of-graph-intelligence-nebulagraph-enterprise-v5-2-55df190179dd)
- [NebulaGraph Enterprise v5.1 Vector Search](https://nebula-graph.io/posts/nebulagraph-enterprise-v5-1-embeds-vector-search-for-ai-grade-data-fusion)

---

## 7. SurrealDB

| Attribute | Details |
|---|---|
| **Latest Version** | SurrealDB 3.0 (GA). Raised $23M in funding (Feb 2026). |
| **Licensing** | BSL 1.1 with Additional Use Grant - allows all use except commercial DBaaS for 4 years per release, then converts to Apache 2.0. SDKs/libraries under Apache 2.0 or MIT. |
| **Query Language** | SurrealQL - a proprietary SQL-like language combining SQL, NoSQL, and graph syntax in one language. |
| **Multi-Model** | Native multi-model: document, graph, relational (schema and schemaless), time-series, geospatial, vector, full-text search, key-value. All unified in SurrealQL. |
| **Scalability** | Distributed architecture. SurrealDB 3.0 introduced redesigned on-disk document representation, ID-based metadata storage, synchronized writes. Written in Rust. |
| **AI/LLM Integration** | Positioned as "the multi-model database for AI agents." SurrealDB 3.0 supports agent memory through context graphs embedded in the database layer. Designed for agentic AI use cases with agent sprawl management. |
| **Vector/Embedding** | Expanded vector indexing and search in 3.0. Multimodal data storage support. |
| **Known Limitations** | Relatively young project - 3.0 is the first GA-quality release. SurrealQL is proprietary (no standards adoption of Cypher/GQL). Jack-of-all-trades risk: multi-model may not match specialized DBs in any single model. Community is growing but ecosystem is smaller than established players. |

**Sources:**
- [SurrealDB Official Site](https://surrealdb.com)
- [SurrealDB GitHub](https://github.com/surrealdb/surrealdb)
- [SurrealDB 3.0 GA](https://technicalbeep.com/multi-model-database-surrealdb-3-0/)
- [SurrealDB $23M Funding](https://siliconangle.com/2026/02/17/surrealdb-raises-23m-expand-ai-native-multi-model-database/)
- [SurrealDB License FAQ](https://surrealdb.com/license)
- [SurrealDB for AI Agents](https://thenewstack.io/surrealdb-3-ai-agents/)

---

## 8. Kuzu (Embedded Graph DB)

| Attribute | Details |
|---|---|
| **Latest Version** | Uncertain - the KuzuDB GitHub project appears to have been archived, though prior releases remain usable. |
| **Licensing** | MIT License. Fully permissive open source. |
| **Query Language** | Cypher (openCypher implementation). |
| **Multi-Model** | Property graph database with vector search and full-text search built in. Not a general multi-model DB. |
| **Scalability** | Embedded (in-process) database. Columnar storage. Scales to hundreds of millions of nodes and billions of edges on a **single machine**. Validated on LDBC-SF100 benchmark (280M nodes, 1.7B edges). No distributed/cluster mode. |
| **AI/LLM Integration** | No dedicated AI/LLM integration features found in research. Can be used as a component in AI pipelines via its Python/Node/Rust/Go/Java bindings. |
| **Vector/Embedding** | Built-in vector indexes. Fixed-list data type optimized for storing embedding vectors. Full-text search also built in. |
| **Known Limitations** | Single-machine only (no distributed mode). Project appears to be archived on GitHub - long-term maintenance status uncertain. Embedded-only deployment model limits server-based use cases. Smaller community. No built-in AI/LLM integrations. A fork called RyuGraph exists, suggesting potential community fragmentation. |

**Sources:**
- [Kuzu GitHub](https://github.com/kuzudb/kuzu)
- [Kuzu Documentation](https://docs.kuzudb.com/)
- [Kuzu Overview (BrightCoding)](https://www.blog.brightcoding.dev/2025/09/24/kuzu-the-embedded-graph-database-for-fast-scalable-analytics-and-seamless-integration/)
- [RyuGraph Fork](https://github.com/predictable-labs/ryugraph)
- [Kuzu DeepWiki](https://deepwiki.com/kuzudb/kuzu)

---

## 9. FalkorDB (Redis-Based Graph)

| Attribute | Details |
|---|---|
| **Latest Version** | Successor to RedisGraph (EOL January 2025). Exact latest version number not confirmed in research. |
| **Licensing** | Core: Server Side Public License v1 (SSPLv1). GraphRAG-SDK: MIT License. Managed cloud service available with tiered pricing ($73/mo Startup, $350/mo Pro). |
| **Query Language** | Cypher (openCypher). Full Cypher coverage documented. |
| **Multi-Model** | Primarily a property graph database. Runs as a Redis module, so inherits Redis key-value capabilities. |
| **Scalability** | Horizontal scaling supported. Linear algebra-based graph traversals using GraphBLAS (sparse matrix multiplication). Written in C, runs as Redis module (no JVM overhead). Multi-graph support. |
| **AI/LLM Integration** | Explicitly positioned as "Knowledge Graph for LLM (GraphRAG)." GraphRAG-SDK with automated ontology generation from unstructured data. LangChain integration. Diffbot API integration for knowledge graph construction. |
| **Vector/Embedding** | Supports vector embeddings and vector indexes. Hybrid queries combining graph traversal with vector search. |
| **Known Limitations** | SSPL license is controversial and not considered open source by OSI. Tied to Redis infrastructure. Smaller community than Neo4j. RedisGraph migration may have rough edges. Limited documentation compared to more established databases. |

**Sources:**
- [FalkorDB Official Site](https://www.falkordb.com/)
- [FalkorDB GitHub](https://github.com/FalkorDB/FalkorDB)
- [FalkorDB Cypher Coverage](https://docs.falkordb.com/cypher/cypher-support.html)
- [GraphRAG-SDK](https://github.com/FalkorDB/GraphRAG-SDK)
- [RedisGraph EOL Migration Guide](https://www.falkordb.com/blog/redisgraph-eol-migration-guide/)
- [FalkorDB Design Docs](https://docs.falkordb.com/design/)

---

## 10. TigerGraph

| Attribute | Details |
|---|---|
| **Latest Version** | TigerGraph 4.2.x. TigerGraph Savanna (cloud-native platform). |
| **Licensing** | Proprietary/commercial. **Not open source.** Community Edition: free, up to 200GB graph data + 100GB vectors (combined 300GB in v4.2.1). No benchmarking permitted under Community license. Enterprise requires commercial agreement. |
| **Query Language** | GSQL (Turing-complete, procedural graph query language). Also supports openCypher and ISO GQL - widest query language support among graph DBs. |
| **Multi-Model** | Primarily a graph database with native vector support (TigerVector). |
| **Scalability** | Massively Parallel Processing (MPP) architecture. Separation of storage and compute (Savanna). Scales independently without size limits. Multiple compute cores/machines process queries in parallel. |
| **AI/LLM Integration** | Positioned for Agentic AI. GSQL's Turing completeness enables task dependency management, structured knowledge storage, dynamic reasoning. Hybrid graph+vector search for AI at scale. |
| **Vector/Embedding** | TigerVector: native vector search integrated into GSQL. Supports vector type expressions and query compositions between vector search results and graph query blocks. Up to 100GB vector storage in Community Edition. |
| **Known Limitations** | Not open source - proprietary codebase. Community Edition has strict limitations (300GB total, no benchmarking allowed, internal use only). GSQL has a steep learning curve compared to Cypher. Vendor lock-in risk. Smaller community than Neo4j. Cost can be high for Enterprise. |

**Sources:**
- [TigerGraph Hybrid Search Announcement](https://www.globenewswire.com/news-release/2025/3/4/3036461/0/en/TigerGraph-Unveils-Next-Generation-Hybrid-Search-to-its-Graph-Database-to-Power-AI-at-Scale-Also-Introduces-a-Game-Changing-Community-Edition.html)
- [TigerGraph Community Edition](https://www.tigergraph.com/blog/tigergraph-db-community-edition-the-most-powerful-free-graph-vector-database-for-turbocharging-ai/)
- [TigerVector Paper](https://arxiv.org/html/2501.11216v1)
- [TigerGraph License Agreement](https://www.tigergraph.com/license-agreement/)
- [TigerGraph Vector Integration](https://www.tigergraph.com/vector-database-integration/)
- [TigerGraph Release Notes](https://docs.tigergraph.com/tigergraph-server/4.2/release-notes/)

---

## Cross-Cutting Topics

### GraphRAG Patterns (Microsoft GraphRAG and Beyond)

**Microsoft GraphRAG** is the reference implementation for graph-based retrieval-augmented generation:

- **Process:** LLM extracts entities/relationships from source documents into a knowledge graph. Community detection algorithms group related entities. Summaries are pre-generated for each community. At query time, community summaries produce partial responses that are aggregated into a final answer.
- **Query modes:** Global Search (holistic corpus questions via community summaries), Local Search (specific entity fan-out), DRIFT Search (entity fan-out + community context), Basic Search (baseline RAG).
- **Performance:** Claims 3.4x improvement in QA accuracy over standard vector RAG for complex, multi-hop questions.
- **Cost optimization:** LazyGraphRAG (Microsoft Research, June 2025) reduces indexing cost to 0.1% of full GraphRAG.
- **Adoption:** Multiple databases now offer GraphRAG integrations - ArangoDB (HybridGraphRAG), FalkorDB (GraphRAG-SDK), Neo4j (native Cypher AI procedures), Neptune (Flexible GraphRAG), Memgraph (AI Graph Toolkit), NebulaGraph (MCP Server).

**Key pattern variants emerging:**
- **HybridGraphRAG** (ArangoDB): combines vector + graph traversal + full-text in one query
- **Graph + Vector hybrid search** (TigerGraph, NebulaGraph): vector narrows candidate set, graph traversal provides context
- **Context graphs** (SurrealDB 3.0): agent memory stored as graph structures within the database

**Sources:**
- [Microsoft GraphRAG GitHub](https://github.com/microsoft/graphrag)
- [Microsoft GraphRAG Research Blog](https://www.microsoft.com/en-us/research/blog/graphrag-unlocking-llm-discovery-on-narrative-private-data/)
- [GraphRAG Paper (arXiv)](https://arxiv.org/abs/2404.16130)
- [GraphRAG Survey (ACM TOIS)](https://dl.acm.org/doi/10.1145/3777378)
- [Complete Guide to GraphRAG 2026](https://www.articsledge.com/post/graphrag-retrieval-augmented-generation)

---

### LLM Ability to Generate Graph Queries (Text-to-Cypher/GQL/GSQL)

**Current state (2025-2026):**

- **Text-to-Cypher** is the most mature area. Research papers at NAACL 2025 and other venues demonstrate improving but still imperfect accuracy.
- **Text2GQL-Bench** (2026) benchmarks multiple LLMs (GPT-5.2, Claude Opus 4.5, Qwen3-Max, fine-tuned models) on both Cypher and ISO GQL generation, examining syntax differences and abstraction levels.
- **Key challenges:** LLMs often struggle with domain-specific schema alignment, complex multi-hop queries, and edge cases in Cypher syntax. Accuracy degrades on complex queries.
- **Improvement approaches:**
  - Fine-tuning on natural language to Cypher pairs (e.g., text2cypher-gemma-2-9b)
  - Few-shot prompting with schema context
  - Self-healing generation (re-submitting failed queries to LLM for correction)
  - Template-based synthetic data generation + supervised fine-tuning + preference learning
- **Production readiness:** Simple queries work reasonably well. Complex analytical queries remain unreliable without fine-tuning or guardrails. Memgraph has published research comparing Cypher generation vs. tool invocation approaches for AI agents.

**Sources:**
- [Text2Cypher: Bridging Natural Language and Graph (ACL 2025)](https://aclanthology.org/2025.genaik-1.11.pdf)
- [Text2GQL-Bench (arXiv 2026)](https://arxiv.org/html/2602.11745v1)
- [Improving LLMs on Cypher Generation (NAACL 2025)](https://aclanthology.org/2025.naacl-short.53.pdf)
- [Text-to-Cypher Pipeline (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S0306457325002213)
- [Memgraph: Cypher Generation vs Tool Invocation](https://memgraph.com/blog/tools-vs-cypher-generation-in-graph-database)

---

### GQL (ISO Graph Query Language Standard)

- **Standard:** ISO/IEC 39075:2024, published April 12, 2024. First new ISO database query language in 35+ years.
- **Relationship to Cypher:** GQL builds on concepts from Cypher, PGQL, and G-CORE. Neo4j was a key contributor to the standard.
- **Current adoption:**
  - **NebulaGraph Enterprise v5.0+:** First distributed graph DB with native GQL support
  - **TigerGraph:** Supports GQL alongside GSQL and openCypher
  - **Microsoft Fabric:** GQL language support documented
  - **Neo4j:** Heavily involved in the standard; GQL adoption in progress
  - **Amazon Neptune:** AWS blog acknowledges the standard; adoption timeline unclear
- **Significance:** Analogous to what SQL did for relational databases. Expected to drive standardization and interoperability across graph databases over the next several years.
- **Caution:** Adoption is still early. Most databases still primarily use their existing query languages (Cypher, GSQL, nGQL, AQL, etc.). Full GQL compliance across the industry will take time.

**Sources:**
- [GQL Standards Organization](https://www.gqlstandards.org/)
- [GQL Wikipedia](https://en.wikipedia.org/wiki/Graph_Query_Language)
- [ISO/IEC 39075:2024](https://www.iso.org/standard/76120.html)
- [GQL - The Register](https://www.theregister.com/2024/04/24/gql_iso_recognition/)
- [Neo4j on GQL](https://neo4j.com/blog/cypher-and-gql/gql-database-language-standard/)
- [NebulaGraph GQL Overview](https://www.nebula-graph.io/posts/An_Comprehensive_Overview_of_the_Standard_Graph_Query_Language)
- [Microsoft Fabric GQL Guide](https://learn.microsoft.com/en-us/fabric/graph/gql-language-guide)

---

## Summary Comparison Table

| Database | License | Query Language | Multi-Model | Vector Support | Distributed | AI/GraphRAG |
|---|---|---|---|---|---|---|
| Neo4j | AGPLv3 / Commercial | Cypher 25 | No (graph + vector) | Native | Yes (Enterprise) | Strong |
| Neptune | Proprietary (AWS) | openCypher/Gremlin/SPARQL | Property + RDF | Native (Analytics) | Managed | Growing |
| ArangoDB | BSL 1.1 | AQL | Yes (doc/graph/KV/vector) | Native (FAISS) | Yes | Strong |
| Apache AGE | Apache 2.0 | openCypher + SQL | Graph + Relational | Via pgvector (separate) | Via Citus | Minimal |
| Memgraph | BSL 1.1 / MEL | openCypher | No (graph only) | Native | HA only (no sharding) | Growing |
| NebulaGraph | Apache 2.0 / Commercial | nGQL / GQL (Enterprise) | No (graph only) | Native (Enterprise) | Yes | Growing |
| SurrealDB | BSL 1.1 | SurrealQL | Yes (doc/graph/KV/vector/TS) | Native | Yes | Strong |
| Kuzu | MIT | Cypher | No (graph + vector + FTS) | Built-in | No (embedded) | Minimal |
| FalkorDB | SSPLv1 | Cypher | No (graph via Redis) | Native | Yes | Strong |
| TigerGraph | Proprietary | GSQL / openCypher / GQL | No (graph + vector) | Native (TigerVector) | Yes (MPP) | Strong |
