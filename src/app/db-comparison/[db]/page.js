"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchDatabaseByIds, fetchDatabases } from "@/utils/databaseUtils";
import ComparisonTable from "@/components/comparisonPage/ComparisonTable";
import ComparisonHeader from "@/components/comparisonPage/ComparisonHeader";
import DatabaseSelect from "@/components/comparisonPage/DatabaseSelect";
import CommonButton from "@/components/shared/Button";
 
// import {Metadata} from 'next'

// export const metadata = {
// title:"comparison page",
// }


// const generateMetadata = (title) => {
//   return {
//     title:" hello world",
//   };
// }

const Comparison = ({ params }) => {
  const router = useRouter();
  const { db } = params;
  const removedb = db.includes("list-") ? db.replace("list-", "") : db;
  const decodedDb = removedb ? decodeURIComponent(removedb) : "";
const [selectedDatabaseIds, setSelectedDatabaseIds] = useState([]);
  const [dbData, setDbData] = useState([]);
  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [selectedDatabasesOptions, setSelectedDatabasesOptions] = useState([]);
const [filterData, setFilterData] = useState([]);
  useEffect(() => {
    const newDbQuery = encodeURIComponent(decodedDb);
    router.push(`/db-comparison/${newDbQuery}`);
  }, [decodedDb]);
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
  useEffect(() => {
    if (selectedDatabaseIds.length > 0) {
      const fetchSelectedDatabases = async () => {
        try {
          const response = await fetchDatabaseByIds(selectedDatabaseIds);
          setFilterData(response.data); 
        } catch (error) {
          console.error("Error fetching database details:", error);
        }
      };
      fetchSelectedDatabases();
    }
  }, [selectedDatabaseIds]);

  useEffect(() => {
    if (decodedDb) {
      const databases = decodedDb.split("-").map((db) => decodeURIComponent(db));
      setSelectedDatabases(databases);
      setSelectedDatabasesOptions(databases);
    }
  }, [decodedDb]);

  const newDbQuery = encodeURIComponent(selectedDatabasesOptions.join("-"));

  const handleCompareClick = () => {
    router.push(`/db-comparison/${newDbQuery}`);
  };

  return (
    <>
    <div className="lg:px-28 bg-custom-gradient bg-cover bg-center h-full">
      <ComparisonHeader selectedDatabases={selectedDatabases} />
      </div>
      <div className="w-full h-auto p-12 md:p-20 px-9 md:px-28 font-medium flex flex-col gap-8 md:gap-5 items-center">
        <DatabaseSelect
          dbData={dbData}
          selectedDatabases={selectedDatabases}
          setSelectedDatabaseIds={setSelectedDatabaseIds}
          setSelectedDatabases={setSelectedDatabases}
          selectedDatabasesOptions={selectedDatabasesOptions}
          setSelectedDatabasesOptions={setSelectedDatabasesOptions}
          handleCompareClick={handleCompareClick}
        />
               <div className="w-full text-end flex justify-end">
          {" "}
          <CommonButton
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
          </CommonButton>
        </div>
        <div className="w-full overflow-auto">
          <ComparisonTable
          filterData={filterData}
            setSelectedDatabases={setSelectedDatabases}
            dbData={dbData}
            selectedDatabases={selectedDatabases}
            setSelectedDatabasesOptions={setSelectedDatabasesOptions}
          />
        </div>
      </div>
    </>
  );
};

export default Comparison;
