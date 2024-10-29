"use client";

import { Checkbox, Table, Typography } from "antd";
import { useState } from "react";

const { Title } = Typography;

const Comparison = () => {
  const options = [
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

  const [selectedDatabases, setSelectedDatabases] = useState([]);

  const onChange = (checkedValues) => {
    setSelectedDatabases(checkedValues);
  };

  const rowLabels = [
    "Description",
    "Primary Database Model",
    "DB_Engines Ranking",
    "Website",
    "Developer",
    "Initial Release",
  ];

  // Generate mock data for each database in an object format
  const generateDataForDatabase = (db) => ({
    Description: `${db} is a popular database solution.`,
    "Primary Database Model": "Relational/NoSQL",
    "DB_Engines Ranking": Math.floor(Math.random() * 100) + 1,
    Website: `https://${db.toLowerCase().replace(/\s+/g, "")}.com`,
    Developer: `${db} Developer`,
    "Initial Release": `${2000 + Math.floor(Math.random() * 20)} (random)`,
  });

  // Map the selected databases to generate rows where column names are on the left
  const data = rowLabels.map((label) => {
    const row = { key: label, name: label };
    selectedDatabases.forEach((db) => {
      row[db] = generateDataForDatabase(db)[label];
    });
    return row;
  });

  // Create columns with the selected databases
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    ...selectedDatabases.map((db) => ({
      title: db,
      dataIndex: db,
      key: db,
    })),
  ];

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4">
      <Title level={2}>List Of All Data Tools</Title>
      <Checkbox.Group options={options} onChange={onChange} />
      <div className="w-full overflow-auto">
        {selectedDatabases.length > 0 && (
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            className="w-full mt-4"
            rowClassName="db-row"
          />
        )}
      </div>
    </div>
  );
};

export default Comparison;
