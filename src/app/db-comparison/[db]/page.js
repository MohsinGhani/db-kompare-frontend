"use client";
import { useRouter } from "next/navigation";
import { DatabaseOptions, rowLabels } from "@/components/data/data";
import CommonButton from "@/components/shared/Button";
import CommonTypography from "@/components/shared/Typography";
import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import CustomSelect from "@/components/shared/CustomSelect";
import ComparisonTable from "@/components/ComparisonTable";
import { fetchDatabaseByIds, fetchDatabases } from "@/utils/databaseUtils";

const Comparison = ({ params }) => {
  const router = useRouter();
  const { db } = params;
  const removedb = db.includes("list-") ? db.replace("list-", "") : db;

  const decodedDb = removedb ? decodeURIComponent(removedb) : "";

  useEffect(() => {
    const newDbQuery = encodeURIComponent(decodedDb);
    router.push(`/db-comparison/${newDbQuery}`);
  }, [decodedDb]);
  const [dbData, setDbData] = useState([]);
  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [selectedDatabasesOptions, setSelectedDatabasesOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDatabases();
        setDbData(result.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);
  const handleChange = async (selectedValues) => {
    setSelectedDatabasesOptions(selectedValues);

    for (const selectedValue of selectedValues) {
      const selectedDb = dbData.find((db) => db.name === selectedValue);
      if (selectedDb) {
        try {
          const data = await fetchDatabaseByIds([selectedDb.id]);
          console.log("Database Data:", data);
        } catch (error) {
          console.error("Error fetching database:", error);
        }
      }
    }
  };
  const newDbQuery = encodeURIComponent(selectedDatabasesOptions.join("-"));
  const handleCompareClick = () => {
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
  console.log("Selected Databases:", selectedDatabases);
  return (
    <>
      <div className="lg:px-28 bg-custom-gradient bg-cover bg-center h-full">
        <div className="flex justify-center items-center h-full text-black md:pt-32">
          <div className="my-20 flex gap-7 justify-center text-center flex-col items-center w-4/6">
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
      <div className="w-full  h-auto p-12 md:p-20 px-9 md:px-28 font-medium flex flex-col gap-8 md:gap-5 items-center">
        <div className="flex 2xl:flex-row gap-4 flex-col justify-between w-full">
          <CommonTypography
            type="text"
            classes="md:text-4xl text-2xl font-medium"
          >
            Editorial information provided by DB-Engines
          </CommonTypography>

          <div className="flex flex-col  md:flex-row md:gap-0 gap-3">
            <CustomSelect
              value={selectedDatabasesOptions}
              onChange={(selectedValue) => {
                handleChange(selectedValue);
              }}
              options={dbData.map((db) => ({
                label: db.name,
                value: db.name,
              }))}
              placeholder="Select Database"
              maxSelection={4}
              className="2xl:w-[550px] w-full lg:w-full md:h-[47px] h-auto"
            />

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
        <div className="w-full text-end flex justify-end">
          {" "}
          <Button
            style={{
              borderRadius: "12px",
              padding: "0 40px",
              height: "50px",
              background: selectedDatabases.length > 4 ? "grey" : "#3E53D7",
              border: "none",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              // width: "200px",
            }}
            onClick={() => {
              router.push(`/db-comparisons/${newDbQuery}`);
            }}
          >
            Add another system
          </Button>
        </div>

        <div className="w-full overflow-auto">
          <ComparisonTable
            setSelectedDatabases={setSelectedDatabases}
            dbData={dbData}
            selectedDatabases={selectedDatabases}
            // rowLabels={rowLabels}
            setSelectedDatabasesOptions={setSelectedDatabasesOptions}
          />
        </div>
      </div>
    </>
  );
};

export default Comparison;
