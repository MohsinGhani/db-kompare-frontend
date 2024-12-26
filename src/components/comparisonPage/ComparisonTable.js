"use client";
import { Skeleton, Table, Tooltip, Rate } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useRouter } from "nextjs-toploader/app";
import ProcessDataHtml from "@/utils/processHtml";
import { useState, useEffect } from "react";
import { rowLabels } from "@/utils/rowLabels";
import { fetchDBRating } from "@/utils/commentUtils";

const ComparisonTable = ({
  filterData,
  selectedDatabases,
  setSelectedDatabases,
  setSelectedDatabasesOptions,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDatabaseIds, setSelectedDatabaseIds] = useState([]);
  const [databaseRatings, setDatabaseRatings] = useState([]);

  // Add generateDataForDatabase function to structure and format data for each database
  const generateDataForDatabase = (db) => {
    const data = filterData?.find((database) => {
      return database.name.toLowerCase() === db.toLowerCase();
    });

    if (data) {
      return rowLabels.reduce((acc, { label, key }) => {
        acc[label] =
          data[key] !== undefined
            ? key === "db_compare_ranking"
              ? `Score: ${data[key].score}, Rank: ${data[key].rank.join(", ")}`
              : Array.isArray(data[key])
              ? data[key].join(", ")
              : data[key]
            : "No data available";
        return acc;
      }, {});
    }

    return null;
  };

  // Generate data rows for selected databases using rowLabels and the generateDataForDatabase function
  const data = rowLabels.map(({ label }) => {
    const row = { key: label, name: label };
    selectedDatabases.forEach((db) => {
      const dbDataForRow = generateDataForDatabase(db);
      if (dbDataForRow) {
        row[db] = dbDataForRow[label];
      }
    });
    return row;
  });

  // Add handleRemoveDatabase function to handle removal of selected databases
  const handleRemoveDatabase = (db) => {
    const updatedDatabases = selectedDatabases.filter((item) => item !== db);
    setSelectedDatabases(updatedDatabases);
    setSelectedDatabasesOptions(updatedDatabases);

    const newDbQuery = encodeURIComponent(updatedDatabases.join("-"));
    router.push(`/db-comparison/${newDbQuery}`);
  };

  // Add handleFetchDBRating function to fetch database ratings
  const handleFetchDBRating = async () => {
    if (selectedDatabaseIds.length === 0) return;
    const payload = {
      ids: selectedDatabaseIds,
    };
    try {
      setIsLoading(true);
      const response = await fetchDBRating(payload);
      if (response && response.data) {
        setDatabaseRatings(response.data);
      }
    } catch (error) {
      console.error("Error fetching DB rating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add getRatingForDb function to get rating for a specific database
  const getRatingForDb = (dbName) => {
    const db = filterData.find(
      (database) => database.name.toLowerCase() === dbName.toLowerCase()
    );
    if (!db) return;

    const ratingObj = databaseRatings.find((r) => r.databaseId === db.id);

    return ratingObj ? ratingObj.databaseRating : null;
  };

  // Define columns for the comparison table with custom rendering and remove functionality
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      rowScope: "row",

      render: (text) => {
        const rowLabel = rowLabels.find((label) => label.label === text);
        return (
          <div
            style={{
              display: "flex",

              alignItems: "center",
            }}
          >
            <span style={{ minWidth: "200px" }}>{text}</span>
            {rowLabel?.tooltipText && (
              <Tooltip title={rowLabel.tooltipText}>
                <InfoCircleOutlined
                  style={{
                    marginLeft: 8,
                    color: "#3E53D7",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
    ...selectedDatabases.map((db) => ({
      title: (
        <div className="flex items-center justify-between gap-2 ">
          <div className="flex flex-col items-start gap-1">
            <span>{db}</span>

            {getRatingForDb(db) !== null && isLoading === false && (
              <div className="flex flex-row">
                <Rate
                  disabled
                  allowHalf
                  value={getRatingForDb(db)}
                  className="text-[#FFC412] !text-sm"
                />
                <span className="ml-2 text-xs mt-[1px]">
                  ({getRatingForDb(db)})
                </span>
              </div>
            )}
          </div>
          <div>
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
        </div>
      ),
      dataIndex: db,
      render: (text, record) => {
        return (
          <div
            style={{
              padding: "5px",
              minWidth: "200px",
              fontSize: "14px",
              fontWeight: "400",
            }}
          >
            <ProcessDataHtml htmlString={text} record={record} />
          </div>
        );
      },
    })),
  ];

  // Update selected database IDs based on selected database names
  useEffect(() => {
    if (filterData.length === 0) return;

    const newSelectedDatabaseIds = selectedDatabases
      .map((dbName) => {
        const dbOption = filterData.find(
          (dbOption) => dbOption.name.toLowerCase() === dbName.toLowerCase()
        );
        return dbOption ? dbOption.id : null;
      })
      .filter((id) => id !== null);
    setSelectedDatabaseIds(newSelectedDatabaseIds);
  }, [filterData, selectedDatabases]);

  // Fetch database ratings when selected database IDs change
  useEffect(() => {
    handleFetchDBRating();
  }, [selectedDatabaseIds]);

  // Add useEffect to set loading state when dbData is loaded
  useEffect(() => {
    if (filterData && filterData.length > 0) {
      setIsLoading(false);
    }
  }, [filterData]);

  return (
    <>
      {isLoading ? (
        <Table
          rowKey="key"
          pagination={false}
          dataSource={[...Array(5)].map((_, index) => ({
            key: `key${index}`,
          }))}
          columns={columns.map((column) => ({
            ...column,
            render: function renderPlaceholder() {
              return (
                <Skeleton
                  key={column.key}
                  title
                  active={false}
                  paragraph={false}
                />
              );
            },
          }))}
        />
      ) : (
        <Table
          bordered
          columns={columns}
          dataSource={data}
          pagination={false}
          className="w-full mt-4 db-row"
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-[#EEEEEE]" : "bg-white"
          }
        />
      )}
    </>
  );
};

export default ComparisonTable;
