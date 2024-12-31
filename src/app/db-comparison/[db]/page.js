"use client";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import {
  fetchDatabaseByIds,
  fetchDatabaseRanking,
  fetchDatabases,
} from "@/utils/databaseUtils";
import ComparisonTable from "@/components/comparisonPage/ComparisonTable";
import ComparisonHeader from "@/components/comparisonPage/ComparisonHeader";
import DatabaseSelect from "@/components/comparisonPage/DatabaseSelect";
import CommonButton from "@/components/shared/Button";
import { getPreviousDates } from "@/utils/formatDateAndTime";
import CommentsSection from "@/components/comparisonPage/ComparisonComments/CommentsSection";
import Blog from "@/components/view/Blog";
// import CommentsSection from "@/components/comparisonPage/ComparisonComments/CommentsSection";

const Comparison = ({ params }) => {
  const router = useRouter();
  const { db } = params;
  const [selectedDatabaseIds, setSelectedDatabaseIds] = useState([]);
  const [dbData, setDbData] = useState([]);
  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [selectedDatabasesOptions, setSelectedDatabasesOptions] = useState([]);
  const [filterData, setFilterData] = useState([]);

  // Decode db parameter and navigate to comparison page
  const decodedDb = decodeURIComponent(db.replace("list-", ""));

  useEffect(() => {
    if (decodedDb) {
      router.push(`/db-comparison/${encodeURIComponent(decodedDb)}`);
    }
  }, [decodedDb]);

  // Fetch database list on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDatabases();
        setDbData(result.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  // Update selected database IDs based on selected database names
  useEffect(() => {
    if (dbData.length === 0) return;

    const newSelectedDatabaseIds = selectedDatabases
      .map((dbName) => {
        const dbOption = dbData.find(
          (dbOption) => dbOption.name.toLowerCase() === dbName.toLowerCase()
        );
        return dbOption ? dbOption.id : null;
      })
      .filter((id) => id !== null);

    setSelectedDatabaseIds(newSelectedDatabaseIds);
  }, [dbData, selectedDatabases]);

  // Fetch details for selected databases
  useEffect(() => {
    if (selectedDatabaseIds.length > 0) {
      const fetchSelectedDatabases = async () => {
        const previousDays = getPreviousDates();

        const yesterdayDate = previousDays[0];

        try {
          const [response, rankingData] = await Promise.all([
            fetchDatabaseByIds(selectedDatabaseIds),
            fetchDatabaseRanking(yesterdayDate, yesterdayDate),
          ]);

          const modifyData = response?.data?.map((dbEntry) => {
            const matchingRank = rankingData?.data?.find(
              (rank) => rank?.database_id === dbEntry?.id
            );
            const rankChanges = matchingRank?.rankChanges?.[0] || {};
            const scoreChanges = matchingRank?.scoreChanges?.[0] || {};

            return {
              ...dbEntry,
              db_compare_ranking: {
                rank: [
                  `# ${rankChanges.rank || "N/A"}`,
                  matchingRank?.database_model || "Unknown",
                ],
                score: scoreChanges?.totalScore
                  ? Number(scoreChanges.totalScore).toFixed(2)
                  : "0",
              },
            };
          });

          setFilterData(modifyData || []);
        } catch (error) {
          console.error("Error fetching database details:", error);
        }
      };
      fetchSelectedDatabases();
    }
  }, [selectedDatabaseIds]);

  // Set selected databases based on decoded URL parameter
  useEffect(() => {
    if (decodedDb) {
      const databases = decodedDb
        .split("-")
        .map((db) => decodeURIComponent(db));
      setSelectedDatabases(databases);
      setSelectedDatabasesOptions(databases);
    }
  }, [decodedDb]);

  const newDbQuery = encodeURIComponent(selectedDatabasesOptions.join("-"));

  // Navigate to the database comparison page on compare click
  const handleCompareClick = () => {
    router.push(`/db-comparison/${newDbQuery}`);
  };

  // Redirect to comparison or list page based on selected databases
  const handleAddSystemClick = () => {
    if (selectedDatabasesOptions.length === 0) {
      router.push(`/db-comparisons/list`);
    } else {
      router.push(`/db-comparisons/${newDbQuery}`);
    }
  };

  return (
    <>
      <div className="lg:px-28 bg-custom-gradient bg-cover bg-center h-full">
        <ComparisonHeader selectedDatabases={selectedDatabases} />
      </div>
      <div className="w-full h-auto container font-medium  py-10 flex flex-col gap-8 md:gap-5 items-center">
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
          <CommonButton
            disabled={selectedDatabases.length > 4}
            style={{
              borderRadius: "12px",
              padding: "0 40px",
              height: "50px",
              background: selectedDatabases.length > 4 ? "grey" : "#3E53D7",
              border: "none",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={handleAddSystemClick}
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

        <Blog
          // addroute="/blog"
          text="Related Blogs"
          selectedDatabaseIds={selectedDatabaseIds}
          fetchAllBlogs={false}
        />

        <div className="w-full md:pt-8 ">
          <CommentsSection
            selectedDatabases={selectedDatabases}
            selectedDatabaseIds={selectedDatabaseIds}
          />
        </div>
      </div>
    </>
  );
};

export default Comparison;
