"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchDatabases } from "@/utils/databaseUtils";
import ComparisonTable from "@/components/comparisonPage/ComparisonTable";
import ComparisonHeader from "@/components/comparisonPage/ComparisonHeader";
import DatabaseSelect from "@/components/comparisonPage/DatabaseSelect";
 
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
          setSelectedDatabases={setSelectedDatabases}
          selectedDatabasesOptions={selectedDatabasesOptions}
          setSelectedDatabasesOptions={setSelectedDatabasesOptions}
          handleCompareClick={handleCompareClick}
        />
        <div className="w-full overflow-auto">
          <ComparisonTable
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
