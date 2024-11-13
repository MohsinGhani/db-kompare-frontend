"use client";
import { DatabaseOption } from "@/components/data/data";
import CommonButton from "@/components/shared/Button";
import CommonTypography from "@/components/shared/Typography";
import { Checkbox, Select, Table, Typography } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

const Comparison = ({ params }) => {
  const { db } = params || {};
  const [selectedDatabases, setSelectedDatabases] = useState([db || ""]);
  const [selectedDatabasesOptions, setSelectedDatabasesOptions] = useState([
    db || "",
  ]);

  const onChange = (checkedValues) => {
    setSelectedDatabasesOptions(checkedValues);
  };

  const rowLabels = [
    "Description",
    "Primary Database Model",
    "DB_Engines Ranking",
    "Website",
    "Developer",
    "Initial Release",
  ];

  const generateDataForDatabase = (db) => {
    const dbName = db || "Unknown";
    return {
      Description: `${dbName} is a popular database solution.`,
      "Primary Database Model": "Relational/NoSQL",
      "DB_Engines Ranking": Math.floor(Math.random() * 100) + 1,
      Website: `https://${dbName.toLowerCase().replace(/\s+/g, "")}.com`,
      Developer: `${dbName} Developer`,
      "Initial Release": `${2000 + Math.floor(Math.random() * 20)}`,
    };
  };

  const data = rowLabels.map((label) => {
    const row = { key: label, name: label };
    selectedDatabases.forEach((db) => {
      row[db] = generateDataForDatabase(db)[label];
    });
    return row;
  });

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    ...selectedDatabases.map((db) => ({
      title: (
        <div className="flex items-center justify-between gap-2">
          <span>{db}</span>
          {selectedDatabases.length > 1 && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
              color="red"
              cursor="pointer"
              onClick={() => handleRemoveDatabase(db)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          )}
        </div>
      ),
      dataIndex: db,
      key: db,
    })),
  ];

  const handleRemoveDatabase = (db) => {
    const updatedDatabases = selectedDatabases.filter((item) => item !== db);
    setSelectedDatabases(updatedDatabases);
    setSelectedDatabasesOptions(updatedDatabases);
  };

  useEffect(() => {
    if (db) {
      setSelectedDatabases([db]);
    }
  }, [db]);

  const noDatabasesSelected = selectedDatabases.length === 0;
  return (
    <div className="w-full flex flex-col items-center gap-4 py-4">
      <div className="lg:px-56 w-full bg-custom-gradient  h-full">
        <div className="flex justify-between items-center h-full text-black md:pt-32">
          <div className="my-20 flex gap-7 justify-center text-center px-12 md:px-52 flex-col items-center w-full">
            <h1 className="md:text-4xl text-2xl font-bold">
              {selectedDatabases.length === 1
                ? `${selectedDatabases[0]} Properties`
                : selectedDatabases.map((db, index) => (
                    <>
                      {db}
                      {index < selectedDatabases.length - 1 && (
                        <span className="text-[#3E53D7] px-2 mx-1">VS</span>
                      )}
                    </>
                  ))}
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full h-auto p-20 px-12 md:px-28 flex flex-col gap-16 md:gap-10 items-center">
        <div className="flex justify-between w-full">
          <CommonTypography type="title">
            Editorial information provided by DB-Engines
          </CommonTypography>

          <div className="flex">
            <Select
              disabled={selectedDatabasesOptions.length > 4}
              mode="multiple"
              className="w-[450px] h-12"
              value={selectedDatabasesOptions}
              dropdownStyle={{ maxHeight: 300, overflow: "auto" }}
              placeholder="Select Database"
              onChange={onChange}
              style={{
                borderRadius: "4px 0 0 4px",
                height: "55px",
                border: "none",
              }}
            >
              {DatabaseOption.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
            <CommonButton
              disabled={selectedDatabases.length > 4}
              style={{
                borderRadius: "0px 4px 4px 0px",
                height: "55px",
                background: selectedDatabases.length > 4 ? "grey" : "#3E53D7",
                border: "none",
                color: "white",
              }}
              onClick={() => setSelectedDatabases(selectedDatabasesOptions)}
            >
              Compare
            </CommonButton>
          </div>
        </div>

        <div className="w-full overflow-auto">
          {noDatabasesSelected ? (
            <p>Please select at least one database to compare.</p>
          ) : (
            <Table
              bordered
              columns={columns}
              dataSource={data}
              pagination={false}
              className="w-full mt-4"
              rowClassName="db-row"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Comparison;
