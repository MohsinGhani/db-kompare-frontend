export const Navlinks = [
  { href: "/", label: "Home" },
  { href: "/leader-board", label: "DB Leaderboard" },
  { href: "/db-comparisons/list", label: "DB Comparison" },
  { href: "/our-blogs", label: "Blogs" },
  { href: "https://dataeli5.substack.com/", label: "DB Internals" },
  { href: "#", label: "API" },
];

export const DropdownOptions = [
  { value: "githubScore", label: "Github" },
  { value: "stackoverflowScore", label: "Stack Overflow" },
  { value: "googleScore", label: "Google Search" },
  { value: "bingScore", label: "Bing Search" },
];

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

export const rankingOptions = [
  { value: "All", label: "All" },
  { value: "Relational DBMS", label: "Relational DBMS" },
  { value: "Key-value store", label: "Key-value stores" },
  { value: "Document store", label: "Document stores" },
  { value: "Open source DBMS", label: "Open source DBMS" },
  { value: "Time Series DBMS", label: "Time Series DBMS" },
  { value: "Graph DBMS", label: "Graph DBMS" },
  { value: "Search engine", label: "Search engines" },
  { value: "Object oriented DBMS", label: "Object oriented DBMS" },
  { value: "RDF store", label: "RDF stores" },
  { value: "Vector DBMS", label: "Vector DBMS" },
  { value: "Multivalue DBMS", label: "Multivalue DBMS" },
  { value: "Spatial DBMS", label: "Spatial DBMS" },
  { value: "Native XML DBMS", label: "Native XML DBMS" },
  { value: "Event Store", label: "Event Stores" },
  { value: "Content store", label: "Content stores" },
  { value: "Columnar", label: "Columnar" },
];

export const categoriesItems = [
  { key: "1", label: "Data Modeling" },
  { key: "2", label: "Data Catalog Tools" },
  { key: "3", label: "Data Dictionary" },
  { key: "4", label: "Business Glossary" },
  { key: "5", label: "Data Compare" },
  { key: "6", label: "Data Democratization Tools" },
  { key: "7", label: "Data Discovery Tools" },
  { key: "8", label: "Data Governance" },
  { key: "9", label: "Data Intelligence Tools" },
  { key: "10", label: "Data Lineage Tools" },
  { key: "11", label: "Data Literacy Tools" },
  { key: "12", label: "Data Observability Tools" },
  { key: "13", label: "Data Profiling Tools" },
  { key: "14", label: "Database Design" },
  { key: "15", label: "Diagram / RE" },
  { key: "16", label: "DB Documentation Generators" },
  { key: "17", label: "DB Documentation" },
  { key: "18", label: "Extended Properties Editors" },
  { key: "19", label: "GDPR Compliance" },
  { key: "20", label: "GUI Tools" },
  { key: "21", label: "Metadata Management" },
  { key: "22", label: "PL/SQL Documentation" },
  { key: "23", label: "Reference Data Management Tools" },
  { key: "24", label: "Schema Compare" },
  { key: "25", label: "Sensitive Data Discovery" },
  { key: "26", label: "SQL Lineage Tools" },
  { key: "27", label: "SQL Parsing Tools / SQL Parsers" },
  { key: "28", label: "SSAS Documentation" },
  { key: "29", label: "SSIS Documentation" },
  { key: "30", label: "Version Control" },
];

export const filterOptions = {
  freeEdition: [
    { value: "All", label: "All" },
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ],
  erDiagram: [
    { value: "All", label: "All" },
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ],
  runsOn: [
    { value: "Linux", label: "Linux" },
    { value: "MacOS", label: "MacOS" },
    { value: "Windows", label: "Windows" },
  ],
  forwardEngineering: [
    { value: "All", label: "All" },
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ],
  synchronization: [
    { value: "All", label: "All" },
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ],
};
