export const Navlinks = [
  { href: "/", label: "Home" },
  { href: "/leader-board", label: "DB Leaderboard" },
  { href: "/db-comparisons/list/options", label: "DB Comparison" },
  { href: "/our-blogs", label: "Blogs" },
  { href: "https://dataeli5.substack.com/", label: "DB Internals" },
  { href: "#", label: "API" },
  { href: "/questions", label: "Practice SQL" },
  { href: "/run", label: "Run SQL" },
  { href: "/certifications", label: "Certifications" },
];

export const DropdownOptions = [
  {
    value: "githubScore",
    label: "Github",
    icon: "assets/icons/github-icon.svg",
  },
  {
    value: "stackoverflowScore",
    label: "Stack Overflow",
    icon: "assets/icons/sflow-icon.svg",
  },
  {
    value: "googleScore",
    label: "Google Search",
    icon: "assets/icons/google-icon.svg",
  },
  {
    value: "bingScore",
    label: "Bing Search",
    icon: "assets/icons/bing-icon.svg",
  },
];

export const METRICES_TYPE = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
};

export const CommentStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "DISABLED",
};

export const BlogStatus = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
};

export const ProviderType = {
  GOOGLE: "Google",
  GITHUB: "GitHub",
};

export const IT_SKILLS = [
  "JavaScript",
  "Python",
  "Java",
  "C#",
  "React",
  "Node.js",
  "AWS",
  "Docker",
  "SQL",
  "Git",
];

export const UserRole = {
  ADMIN: "ADMIN",
  VENDOR: "VENDOR",
};

export const BlogType = {
  BLOG: "BLOG",
  SAVED_BLOG: "SAVED_BLOG",
};

export const ENTITY_TYPE = {
  DATABASE: "database",
  DBTOOL: "dbtool",
  BLOG: "blog",
};

export const rankingOptions = [
  { value: "All", label: "All" },
  { value: "Relational DBMS", label: "Relational DB" },
  { value: "Key-value store", label: "Key-value stores" },
  { value: "Document store", label: "Document stores" },
  { value: "Open source DBMS", label: "Open source DB" },
  { value: "Time Series DBMS", label: "Time Series DB" },
  { value: "Graph DBMS", label: "Graph DB" },
  { value: "Search engine", label: "Search engines" },
  { value: "Object oriented DBMS", label: "Object oriented DB" },
  { value: "RDF store", label: "RDF stores" },
  { value: "Vector DBMS", label: "Vector DB" },
  { value: "Multivalue DBMS", label: "Multivalue DB" },
  { value: "Spatial DBMS", label: "Spatial DB" },
  { value: "Native XML DBMS", label: "Native XML DB" },
  { value: "Event Store", label: "Event Stores" },
  { value: "Content store", label: "Content stores" },
  { value: ["Columnar", "Wide column store"], label: "Columnar DB" },
  { value: "Navigational DBMS", label: "Hierarchial DB" },
];
export const RESOURCE_TYPE = {
  GITHUB: "GITHUB",
  STACKOVERFLOW: "STACKOVERFLOW",
  GOOGLE: "GOOGLE",
  BING: "BING",
  ALL: "ALL",
};

export const LESSON_CATEGORY = {
  BASIC: "BASIC",
  INTERMEDIATE: "INTERMEDIATE",
  HARD: "HARD",
};
export const QUESTION_STATUS = {
  SOLVED: "Solved",
  ERROR: "Error",
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
};

export const TOPICS_CATEGORIES = {
  SQL: "SQL",
  PGSQL: "PGSQL",
  MYSQL: "MYSQL",
  ORACLE: "ORACLE",
  MSSQL: "MSSQL",
  OTHER: "OTHER",
};

export const SUPPORTED_RUNTIME = {
  POSTGRES: "POSTGRES",
  MYSQL: "MYSQL",
};

export const DIFFICULTY = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
};

export const QUESTION_TYPE = {
  INTERVIEW: "INTERVIEW",
  LESSON: "LESSON",
};

export const core_features = [
  "Scalability",
  "Customization and extensibility",
  "Data integration and ingestion",
  "Real-time processing",
  "Security and compliance",
  "Data management and governance",
  "Advanced analytics and machine learning",
  "Data visualization and reporting",
  "Automated workflows and orchestration",
  "Ad-hoc reporting",
  "AI- and ML-based synthetic data creation",
  "Assurance of referential integrity",
  "Authentication using API",
  "Authentication using Kerberos",
  "Auto Detection between folders",
  "Automatic Discovery enabled by AI",
  "Built in Scheduler",
  "Built in Scheduler Not available",
  "Business Glossary",
  "Business Glossary Tool",
  "Collaboration",
  "Compare JSON/ XML Schema",
  "Compare database schema",
  "Connect to Cloud Data Lakes",
  "Connect to DB and Generate Physical Model",
  "Connect to Data Sources via API / JDBC / Kerberos",
  "Consent Management",
  "Connection with databases and automation pipelines",
  "Create NEW JSON /Schema schema file and generate data",
  "Custom Programs",
  "Data Activity Monitoring:",
  "Data Breaches Management:",
  "Data Catalog",
  "Data Classification",
  "Data Dictionary Tool",
  "Data Discovery & Classification:",
  "Data Lineage",
  "Data Lineage - Business",
  "Data Lineage - Technical",
  "Data Lineage- Technical",
  "Data Mapping",
  "Data Profiling",
  "Data Quality Management",
  "Data Vizualization",
  "Data discovery tools",
  "Drag n Drop Graph builder",
  "Drag n Drop SQL Builder",
  "Email bursts of reports as attachment",
  "Emulation of distributed values in the real source data",
  "Forward engineering",
  "Generate Documentation",
  "Generate ER Diagram, Conceptual Model , Logical Model and Physica Model in standard formats",
  "Generate Script to merge differences",
  "Generate and Validate with Test Data",
  "Generate document from code e.g Infra as Code",
  "Integration with Test Data Management Tools",
  "Integration with programming languages",
  "Machine Learning Support",
  "Mobile Friendly / Mobile App",
  "Orchestration",
  "Privacy Automation",
  "Privacy Operations",
  "Pros and Cons Templates",
  "Re-Run from Breakpoint",
  "Reverse Engineeromg",
  "Reverse enginering",
  "Rules-based synthetic data creation",
  "Self-service synthetic data creation",
  "Sourcing Pricing Info of tools seamlessly",
  "Support process modeling and data modeling standard formats",
  "Synchronization  \\nModel development / Collaboration",
  "Test Data Generation",
  "Third Party Riskmanagement",
  "Visual Query Builder",
  "Web Version Available",
  "Workflow",
];

export const categoriesItems = [
  {
    key: "1",
    label: "Data Modeling",
    value: "Data Modeling",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "2",
    label: "Data Catalog Tools",
    value: "Data Catalog Tools",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "3",
    label: "Data Dictionary",
    value: "Data Dictionary",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "4",
    label: "Business Glossary",
    value: "Business Glossary",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "5",
    label: "Data Compare",
    value: "Data Compare",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "6",
    label: "Data Democratization Tools",
    value: "Data Democratization Tools",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "7",
    label: "Data Discovery Tools",
    value: "Data Discovery Tools",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "8",
    label: "Data Governance",
    value: "Data Governance",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "9",
    label: "Data Intelligence Tools",
    value: "Data Intelligence Tools",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "10",
    label: "Data Lineage Tools",
    value: "Data Lineage Tools",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "11",
    label: "Data Literacy Tools",
    value: "Data Literacy Tools",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "12",
    label: "Data Observability Tools",
    value: "Data Observability Tools",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "13",
    label: "Data Profiling Tools",
    value: "Data Profiling Tools",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "14",
    label: "Database Design",
    value: "Database Design",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "15",
    label: "Diagram / RE",
    value: "Diagram RE",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "16",
    label: "DB Documentation Generators",
    value: "DB Documentation Generators",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "17",
    label: "DB Documentation",
    value: "DB Documentation",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "18",
    label: "Extended Properties Editors",
    value: "Extended Properties Editors",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "19",
    label: "GDPR Compliance",
    value: "GDPR Compliance",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "20",
    label: "GUI Tools",
    value: "GUI Tools",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "21",
    label: "Metadata Management",
    value: "Metadata Management",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "22",
    label: "PL/SQL Documentation",
    value: "PL SQL Documentation",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "23",
    label: "Reference Data Management Tools",
    value: "Reference Data Management Tools",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "24",
    label: "Schema Compare",
    value: "Schema Compare",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "25",
    label: "Sensitive Data Discovery",
    value: "Sensitive Data Discovery",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "26",
    label: "SQL Lineage Tools",
    value: "SQL Lineage Tools",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "27",
    label: "SQL Parsing Tools / SQL Parsers",
    value: "SQL Parsing Tools SQL Parsers",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "28",
    label: "SSAS Documentation",
    value: "SSAS Documentation",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "29",
    label: "SSIS Documentation",
    value: "SSIS Documentation",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
  {
    key: "30",
    label: "Version Control",
    value: "Version Control",
    tools: [
      {
        id: 1,
        name: "Erwin Data Modeler",
        value: "Erwin Data Modeler",
      },
      {
        id: 2,
        name: "ER/Studio",
        value: "ER/Studio",
      },
      {
        id: 3,
        name: "GenMyModel",
        value: "GenMyModel",
      },
      {
        id: 4,
        name: "MagicDraw",
        value: "MagicDraw",
      },
      {
        id: 5,
        name: "RISE",
        value: "RISE",
      },
      {
        id: 6,
        name: "ModelSphere",
        value: "ModelSphere",
      },
      {
        id: 7,
        name: "Software Ideas Modeler",
        value: "Software Ideas Modeler",
      },
      {
        id: 8,
        name: "Visible Analyst",
        value: "Visible Analyst",
      },
      {
        id: 9,
        name: "Moon Modeler",
        value: "Moon Modeler",
      },
      {
        id: 10,
        name: "DB Main (Discontinued)",
        value: "DB Main (Discontinued)",
      },
      {
        id: 11,
        name: "Enterprise Architect",
        value: "Enterprise Architect",
      },
      {
        id: 12,
        name: "IBM InfoSphere Data Architect",
        value: "IBM InfoSphere Data Architect",
      },
      {
        id: 13,
        name: "PowerDesigner",
        value: "PowerDesigner",
      },
    ],
  },
];

export const filterOptions = {
  AccessControl: [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: "Limited", label: "Limited extent" },
    { value: "DoesNotMatter", label: "Does not matter (Default)" },
  ],
  VersionControl: [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: "DoesNotMatter", label: "Does not matter (Default)" },
  ],
  SupportForWorkflow: [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: "DoesNotMatter", label: "Does not matter (Default)" },
  ],
  WebAccess: [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: "DoesNotMatter", label: "Does not matter (Default)" },
  ],
  DeploymentOption: [
    { value: "1", label: "On-Prem" },
    { value: "2", label: "SaaS on Cloud" },
    { value: "3", label: "On-prem and SaaS options available" },
    { value: "DoesNotMatter", label: "Does not matter (Default)" },
  ],
  FreeCommunityEdition: [
    { value: "1", label: "Open source" },
    { value: "2", label: "Apache" },
    { value: "3", label: "Community edition" },
    { value: "4", label: "Commercial / trial 14 days" },
    { value: "DoesNotMatter", label: "Does not matter (Default)" },
  ],
  AuthenticationProtocolSupported: [
    { value: "1", label: "Userid / pwd" },
    { value: "2", label: "Api token" },
    { value: "3", label: "Kerberos" },
    { value: "4", label: "All" },
  ],
  IntegrationWithUpstream: [
    { value: "Yes but limited", label: "Yes" },
    { value: "No", label: "No" },
    {
      value: "Limited",
      label: "Only limited functionality available",
    },
    // { value: "DoesNotMatter", label: "Does not matter (Default)" },
  ],
  UserCreatedTags: [
    { value: "DoesNotMatter", label: "Does not matter (Default)" },
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    {
      value: "LimitedFunctionality",
      label: "Only limited functionality available",
    },
  ],
  CustomizationPossible: [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    {
      value: "Limited functionality",
      label: "Only limited functionality available",
    },
    { value: "DoesNotMatter", label: "Does not matter (Default)" },
  ],
  ModernWaysOfDeployment: [
    { value: "1", label: "Kubernetes" },
    { value: "2", label: "Docker Containers" },
    { value: "3 Windows", label: "Only Windows" },
    { value: "DoesNotMatter", label: "Does not matter (Default)" },
  ],
};

export const dbTools = [
  {
    id: 1,
    name: "Erwin Data Modeler",
    value: "Erwin Data Modeler",
  },
  {
    id: 2,
    name: "ER/Studio",
    value: "ER/Studio",
  },
  {
    id: 3,
    name: "GenMyModel",
    value: "GenMyModel",
  },
  {
    id: 4,
    name: "MagicDraw",
    value: "MagicDraw",
  },
  {
    id: 5,
    name: "RISE",
    value: "RISE",
  },
  {
    id: 6,
    name: "ModelSphere",
    value: "ModelSphere",
  },
  {
    id: 7,
    name: "Software Ideas Modeler",
    value: "Software Ideas Modeler",
  },
  {
    id: 8,
    name: "Visible Analyst",
    value: "Visible Analyst",
  },
  {
    id: 9,
    name: "Moon Modeler",
    value: "Moon Modeler",
  },
  {
    id: 10,
    name: "DB Main (Discontinued)",
    value: "DB Main (Discontinued)",
  },
  {
    id: 11,
    name: "Enterprise Architect",
    value: "Enterprise Architect",
  },
  {
    id: 12,
    name: "IBM InfoSphere Data Architect",
    value: "IBM InfoSphere Data Architect",
  },
  {
    id: 13,
    name: "PowerDesigner",
    value: "PowerDesigner",
  },
];

export const DATABASE_STATUS = {
  ALL: "ALL",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};
