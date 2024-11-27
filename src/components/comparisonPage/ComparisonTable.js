"use client";
import { Skeleton, Table, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import ProcessDataHtml from "@/utils/processHtml";
import { useState, useEffect } from "react";
import { rowLabels } from "@/utils/rowLabels";

const ComparisonTable = ({
  dbData,
  filterData,
  selectedDatabases,
  setSelectedDatabases,
  setSelectedDatabasesOptions,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  const handleRemoveDatabase = (db) => {
    const updatedDatabases = selectedDatabases.filter((item) => item !== db);
    setSelectedDatabases(updatedDatabases);
    setSelectedDatabasesOptions(updatedDatabases);

    const newDbQuery = encodeURIComponent(updatedDatabases.join("-"));
    router.push(`/db-comparison/${newDbQuery}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      rowScope: "row",
      render: (text) => {
        const rowLabel = rowLabels.find((label) => label.label === text);
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
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

  useEffect(() => {
    if (dbData && dbData.length > 0) {
      setIsLoading(false);
    }
  }, [dbData]);

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
          className="w-full mt-4"
          rowClassName="db-row"
        />
      )}
    </>
  );
};

export default ComparisonTable;
