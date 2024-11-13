export const databases = {
  mysql: {
    name: "MySQL",
    description:
      "MySQL is an open-source relational database management system.",
    features: [
      "High performance and reliability",
      "Support for SQL (Structured Query Language)",
      "Open-source and free",
      "ACID-compliant",
      "Scalable and flexible",
    ],
    useCases: [
      "Web applications",
      "E-commerce platforms",
      "Data warehousing",
      "Content management systems (CMS)",
    ],
  },
  postgresql: {
    name: "PostgreSQL",
    description:
      "PostgreSQL is an open-source, object-relational database system.",
    features: [
      "ACID compliance",
      "Extensibility",
      "MVCC (Multi-Version Concurrency Control)",
      "Advanced SQL compliance",
      "JSON support",
    ],
    useCases: [
      "Geospatial applications",
      "Business analytics",
      "Data warehousing",
      "Financial systems",
    ],
  },
  mongodb: {
    name: "MongoDB",
    description: "MongoDB is an open-source NoSQL database.",
    features: [
      "Document-based storage",
      "Scalability",
      "Flexibility with schema design",
      "JSON-like documents (BSON)",
      "Aggregation framework",
    ],
    useCases: [
      "Real-time analytics",
      "Mobile applications",
      "Content management systems (CMS)",
      "Internet of Things (IoT)",
    ],
  },
  redis: {
    name: "Redis",
    description: "Redis is an open-source, in-memory key-value store.",
    features: [
      "In-memory data store",
      "High performance",
      "Support for various data structures (strings, hashes, lists, sets, etc.)",
      "Pub/Sub messaging",
      "Persistence options",
    ],
    useCases: [
      "Caching",
      "Session management",
      "Real-time analytics",
      "Message brokering",
    ],
  },
  sqlite: {
    name: "SQLite",
    description:
      "SQLite is a self-contained, high-reliability, embedded, relational database.",
    features: [
      "Serverless",
      "Zero configuration",
      "Lightweight and efficient",
      "Cross-platform",
      "ACID-compliant",
    ],
    useCases: [
      "Embedded applications",
      "Mobile apps",
      "Small websites",
      "Desktop applications",
    ],
  },
  oracle: {
    name: "Oracle DB",
    description:
      "Oracle Database is a multi-model database management system produced by Oracle Corporation.",
    features: [
      "High scalability",
      "Advanced security features",
      "ACID-compliant",
      "Support for SQL and PL/SQL",
      "Enterprise-level performance",
    ],
    useCases: [
      "Enterprise applications",
      "Data warehousing",
      "Customer relationship management (CRM)",
      "Supply chain management",
    ],
  },
  cassandra: {
    name: "Cassandra",
    description:
      "Apache Cassandra is an open-source NoSQL distributed database management system.",
    features: [
      "Highly scalable",
      "Fault-tolerant",
      "Support for wide-column stores",
      "Eventual consistency",
      "Distributed architecture",
    ],
    useCases: [
      "Large-scale data storage",
      "Real-time analytics",
      "E-commerce platforms",
      "IoT applications",
    ],
  },
  mariadb: {
    name: "MariaDB",
    description:
      "MariaDB is an open-source relational database system, created by the original developers of MySQL.",
    features: [
      "MySQL-compatible",
      "High performance",
      "Replication and clustering",
      "Support for JSON",
      "Flexible licensing options",
    ],
    useCases: [
      "Web applications",
      "Data warehousing",
      "Content management systems",
      "E-commerce platforms",
    ],
  },
  sqlserver: {
    name: "Microsoft SQL Server",
    description:
      "Microsoft SQL Server is a relational database management system developed by Microsoft.",
    features: [
      "ACID-compliant",
      "High availability",
      "Full-text search",
      "Data encryption",
      "Scalable",
    ],
    useCases: [
      "Business intelligence",
      "Enterprise resource planning (ERP)",
      "Data warehousing",
      "Web applications",
    ],
  },
  elasticsearch: {
    name: "Elasticsearch",
    description:
      "Elasticsearch is a search and analytics engine for all types of data.",
    features: [
      "Full-text search",
      "Real-time analytics",
      "Scalability",
      "Distributed architecture",
      "Advanced search queries",
    ],
    useCases: [
      "Log and event data analysis",
      "Search engines",
      "E-commerce search",
      "Real-time monitoring",
    ],
  },
};
export const DatabaseOption = [
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "SQLite",
  "Oracle DB",
  "Cassandra",
  "MariaDB",
  "Microsoft SQL Server",
  "Elasticsearch",
];
