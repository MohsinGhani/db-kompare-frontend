"use client";
import { useRouter } from "next/navigation";
import { DatabaseOption, rowLabels } from "@/components/data/data";
import CommonButton from "@/components/shared/Button";
import CommonTypography from "@/components/shared/Typography";
import { Select, Table } from "antd";
import { useEffect, useState } from "react";
import compareDBData from "@/components/shared/db-json/index.json";
const { Option } = Select;

const Comparison = ({ params }) => {
  const router = useRouter();
  const { db } = params;

  const decodedDb = db ? decodeURIComponent(db) : "";
  const [dbData, setDbData] = useState(null);
  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [selectedDatabasesOptions, setSelectedDatabasesOptions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = compareDBData.comparedb;
      setDbData(data);
      console.log("dbData", dbData);
    };

    fetchData();
  }, []);
  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
    setSelectedDatabasesOptions(checkedValues);
  };

  const generateDataForDatabase = (db) => {
    const dbName = db || "Unknown";

    if (dbData && dbData.length > 0) {
      const data = dbData[0][dbName.toLowerCase()];

      if (data) {
        return {
          Description: data.description || "No description available",
          "Primary Database Model": data.primary_database_model,
          "DB_Engines Ranking": data.db_compare_ranking.rank.join(", "),
          Website: data.website,
          Developer: data.developer,
          "Initial Release": data.initial_release,
          "Current Release": data.current_release,
          License: data.license,
          "Supported Operating Systems":
            data.server_operating_systems.join(", "),
          "Supported Programming Languages":
            data.supported_programming_languages.join(", "),
          "Partitioning Methods": data.partitioning_methods.join(", "),
          "Replication Methods": data.replication_methods.join(", "),
        };
      }
    }
    return null;
  };

  const data = rowLabels.map((label) => {
    const row = { key: label, name: label };
    selectedDatabases.forEach((db) => {
      row[db] = generateDataForDatabase(db)[label];
    });
    return row;
  });
  const columns = [
    {
      // fixed: "left",

      title: "Name",
      dataIndex: "name",
      key: "name",
      rowScope: "row",
      render: (text) => <div style={{ minWidth: "200px" }}>{text}</div>,
    },
    ...selectedDatabases.map((db) => ({
      title: (
        <div className="flex items-center  justify-between gap-2">
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
      render: (text) => (
        <div
          style={{
            padding: "5px",
            fontSize: "13px",
            fontWeight: "400",
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: text }} />
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

    const newDbQuery = encodeURIComponent(updatedDatabases.join("-"));
    router.push(`/db-comparison/${newDbQuery}`);
  };

  const handleCompareClick = () => {
    const newDbQuery = encodeURIComponent(selectedDatabasesOptions.join("-"));
    router.push(`/db-comparison/${newDbQuery}`);
  };

  useEffect(() => {
    if (decodedDb) {
      const databases = decodedDb
        .split("-")
        .map((db) => decodeURIComponent(db));
      setSelectedDatabases(databases);
      setSelectedDatabasesOptions(databases);
    }
  }, [decodedDb]);

  const noDatabasesSelected = selectedDatabases.length === 0;

  return (
    <>
      <div className="lg:px-28 bg-custom-gradient bg-cover bg-center h-full">
        <div className="flex justify-center items-center h-full text-black md:pt-32">
          <div className="my-20 flex gap-7 justify-center  text-center  flex-col items-center w-4/6">
            <h1 className="md:text-5xl text-2xl text-center justify-center font-bold flex flex-wrap">
              {selectedDatabases.length === 1
                ? `${selectedDatabases[0]} Properties`
                : selectedDatabases.map((db, index) => (
                    <span key={index} className="flex items-center">
                      {db}
                      {index < selectedDatabases.length - 1 && (
                        <span className="text-[#3E53D7] px-2 mx-1">VS</span>
                      )}
                    </span>
                  ))}
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full h-auto p-12 md:p-20 px-9 md:px-28 font-medium flex flex-col gap-16 md:gap-10 items-center">
        <div className="flex md:flex-row gap-2 flex-col justify-between w-full">
          <CommonTypography
            type="text"
            classes="md:text-4xl text-2xl font-medium"
          >
            Editorial information provided by DB-Engines
          </CommonTypography>

          <div className=" flex flex-col md:flex-row md:gap-0 gap-3 ">
            <Select
              disabled={selectedDatabasesOptions.length > 4}
              mode="multiple"
              className="2xl:w-[500px] w-full lg:w-full md:h-[47px] h-auto "
              value={selectedDatabasesOptions}
              placeholder="Select Database"
              onChange={onChange}
              style={{
                borderRadius: "4px 0 0 4px",

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
                height: "45px",
                background: selectedDatabases.length > 4 ? "grey" : "#3E53D7",
                border: "none",
                color: "white",
              }}
              onClick={handleCompareClick}
            >
              Compare
            </CommonButton>
          </div>
        </div>

        <div className="w-full overflow-auto">
          <Table
            bordered
            columns={columns}
            dataSource={data}
            pagination={false}
            className="w-full mt-4"
            rowClassName="db-row"
          />
        </div>
      </div>
    </>
  );
};

export default Comparison;
