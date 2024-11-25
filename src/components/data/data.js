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
    name: "Oracle",
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
export const DatabaseOptions = [
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Oracle",
  "Redis",
  "SQLite",
  "Microsoft SQL Server",
  "Elasticsearch",
  "Snowflake",
  "IBM Db2",
];
export const rowLabels = [
  {
    label: "Description",
    key: "description",
    tooltipText: "This is a description of the database",
  },
  { label: "Primary Database Model", key: "primary_database_model" },
  {
    label: "DB Comapre Ranking",
    key: "db_compare_ranking",
    tooltipText: "This is a ranking of the database",
  },
  {
    label:"AI Compatibility",
    key:"ai_compatibility",
  },
  { label: "Pricing", key: "pricing" },
  { label: "Website", key: "website" },
  { label: "Developer", key: "developer" },
  { label: "Initial Release", key: "initial_release" },
  { label: "Current Release", key: "current_release" },
  {
    label: "License",
    key: "license",
    tooltipText: "This is a license of the database",
  },
  { label: "Supported Operating Systems", key: "server_operating_systems" },
  {
    label: "Supported Programming Languages",
    key: "supported_programming_languages",
    tooltipText: "This is a supported progamminfg of the database",
  },
  { label: "Partitioning Methods", key: "partitioning_methods" },
  { label: "Replication Methods", key: "replication_methods" },
  { label: "Secondary Database Models", key: "secondary_database_models" },
  { label: "Ranking Score", key: "db_compare_ranking.score" },
  { label: "Technical Documentation", key: "technical_documentation" },
  { label: "Cloud Based Only", key: "cloud_based_only" },
  {
    label: "DBaaS Offerings",
    key: "dbaas_offerings",
    tooltipText: "This is a DBaaS offerings of the database",
  },
  { label: "Implementation Languages", key: "implementation_language" },
  { label: "Data Scheme", key: "data_scheme" },
  {
    label: "Typing",
    key: "typing",
    tooltipText: "This is a typing of the database",
  },
  {
    label: "XML Support",
    key: "xml_support",
    tooltipText: "This is a XML support of the database",
  },
  { label: "Secondary Indexes", key: "secondary_indexes" },
  { label: "SQL", key: "sql", tooltipText: "This is a SQL of the database" },
  {
    label: "APIs and Other Access Methods",
    key: "apis_and_other_access_methods",
  },
  {
    label: "Server Side Scripts",
    key: "server_side_scripts",
    tooltipText: "This is a server side scripts of the database",
  },
  { label: "Triggers", key: "triggers" },
  {
    label: "MapReduce",
    key: "mapreduce",
    tooltipText: "This is a MapReduce of the database",
  },
  {
    label: "Consistency Concepts",
    key: "consistency_concepts",
    tooltipText: "This is a consistency concepts of the database",
  },
  {
    label: "Foreign Keys",
    key: "foreign_keys",
    tooltipText: "This is a foreign keys of the database",
  },
  {
    label: "Transaction Concepts",
    key: "transaction_concepts",
    tooltipText: "This is a transaction concepts of the database",
  },
  {
    label: "Concurrency",
    key: "concurrency",
    tooltipText: "This is a concurrency of the database",
  },
  {
    label: "Durability",
    key: "durability",
    tooltipText: "This is a durability of the database",
  },
  {
    label: "In-memory Capabilities",
    key: "in_memory_capabilities",
    tooltipText: "This is a in-memory capabilities of the database",
  },
  {
    label: "User Concepts",
    key: "user_concepts",
    tooltipText: "This is a user concepts of the database",
  },
  {
    label:"Db Komapre View",
    key:"db_kompare_view",

  }
];
