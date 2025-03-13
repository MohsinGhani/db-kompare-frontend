import { Skeleton, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useRouter } from "nextjs-toploader/app";
import { useState, useEffect } from "react";
import { formatLabel } from "@/utils/helper";
import { filterOptions } from "@/utils/const";

const ToolComparisonTable = ({
  selectedFilters,
  selectedTools,
  setSelectedTools,
  setSelectedToolsOptions,
  selectedToolsData,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const attributes =
    selectedToolsData && selectedToolsData.length > 0
      ? Object.keys(selectedToolsData[0])
          .filter(
            (key) =>
              key !== "name" &&
              key !== "id" &&
              key !== "category_id" &&
              key !== "status" &&
              key !== "tool_name" &&
              key !== "tool_description" &&
              key !== "category_name" &&
              key !== "category_description" &&
              key !== "db_compare_ranking"
          )
          .map((key) => ({ label: formatLabel(key), key }))
      : [];

  const handleRemoveTools = (db) => {
    const updatedTools = selectedTools.filter((item) => item !== db);
    setSelectedTools(updatedTools);
    setSelectedToolsOptions(updatedTools);

    const newDbQuery = encodeURIComponent(updatedTools.join(","));
    const filterQuery = new URLSearchParams(selectedFilters).toString();
    router.push(`/db-toolcomparison/${newDbQuery}?${filterQuery}`);
  };

  const TruncatedCell = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    const maxChars = 400;
    const shouldTruncate = text.length > maxChars;

    if (!shouldTruncate) return <span>{text}</span>;

    const displayText = expanded ? text : text.slice(0, maxChars) + "...";

    return (
      <div>
        <span>{displayText}</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 text-[#3e53e7] underline text-sm"
        >
          {expanded ? "See less" : "See more"}
        </button>
      </div>
    );
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      rowScope: "row",
      render: (text) => <div style={{ minWidth: "200px" }}>{text}</div>,
    },

    ...selectedTools.map((db) => ({
      title: (
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col items-start gap-1">
            <span>{db}</span>
          </div>
          <div>
            {selectedTools.length > 1 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
                color="red"
                cursor="pointer"
                onClick={() => handleRemoveTools(db)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21
                    c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673
                    a2.25 2.25 0 0 1-2.244 2.077H8.084
                    a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79
                    m14.456 0a48.108 48.108 0 0 0-3.478-.397
                    m-12 .562c.34-.059.68-.114 1.022-.165m0 0
                    a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916
                    c0-1.18-.91-2.164-2.09-2.201
                    a51.964 51.964 0 0 0-3.32 0
                    c-1.18.037-2.09 1.022-2.09 2.201v.916
                    m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            )}
          </div>
        </div>
      ),
      dataIndex: db,
      render: (text, record) => {
        let displayValue = text;
        const key = record._attributeKey;

        if (key === "db_compare_ranking") {
          return (
            <div>
              <p>Rank: {text?.rank[0]}</p>
              <p>Score: {text?.score}</p>
            </div>
          );
        }

        const filterKeyMap = {
          deployment_options_on_prem_or_saas: "DeploymentOption",
          free_community_edition: "FreeCommunityEdition",
          authentication_protocol_supported: "AuthenticationProtocolSupported",
          modern_ways_of_deployment: "ModernWaysOfDeployment",
        };

        if (
          filterKeyMap[key] &&
          typeof text === "number" &&
          filterOptions[filterKeyMap[key]]
        ) {
          const options = filterOptions[filterKeyMap[key]];
          const option = options.find((opt) => `${opt.value}` === `${text}`);
          if (option) {
            displayValue = option.label;
          }
        }

        return (
          <div className="text-sm font-normal min-w-[200px]">
            {record.name === "Home Page Url" &&
            typeof displayValue === "string" ? (
              (() => {
                let url = displayValue;
                if (!/^https?:\/\//i.test(url)) {
                  url = "https://" + url;
                }
                return (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3e53e7] underline"
                  >
                    {displayValue}
                  </a>
                );
              })()
            ) : (record.name === "Tool description" ||
                record.name === "Tool type description") &&
              typeof displayValue === "string" ? (
              <TruncatedCell text={displayValue} />
            ) : typeof displayValue === "boolean" ? (
              displayValue ? (
                <CheckOutlined style={{ color: "green", fontSize: "18px" }} />
              ) : (
                <CloseOutlined style={{ color: "red", fontSize: "18px" }} />
              )
            ) : displayValue === "yes" ? (
              <CheckOutlined style={{ color: "green", fontSize: "18px" }} />
            ) : displayValue === "No" ? (
              <CloseOutlined style={{ color: "red", fontSize: "18px" }} />
            ) : Array.isArray(displayValue) ? (
              <div>
                {displayValue.map((feature, i) => {
                  const featureText = feature.replace(/^\d+\.\s*/, "");

                  return (
                    <div key={i}>
                      {i + 1}. {featureText}
                      {i !== displayValue.length - 1 && ","}
                    </div>
                  );
                })}
              </div>
            ) : (
              displayValue || "Will be add soon"
            )}
          </div>
        );
      },
    })),
  ];

  // Create the db_compare_ranking row separately
  const dbCompareRankingRow = {
    name: "DB Compare Ranking",
    _attributeKey: "db_compare_ranking",
  };
  selectedTools.forEach((db) => {
    const tool = selectedToolsData.find(
      (tool) => tool?.tool_name === db || tool?.name === db
    );

    if (tool) {
      const ranking = tool.db_compare_ranking;
      if (ranking) {
        dbCompareRankingRow[db] = {
          rank: ranking.rank || ["N/A"],
          score: ranking.score || "0",
        };
      } else {
        dbCompareRankingRow[db] = "No ranking available";
      }
    } else {
      dbCompareRankingRow[db] = "No ranking available";
    }
  });

  const descriptionRow = { name: "Tool description" };
  selectedTools.forEach((db) => {
    const tool = selectedToolsData.find(
      (tool) => tool?.tool_name === db || tool?.name === db
    );
    descriptionRow[db] = tool?.tool_description || "Will be add soon";
  });

  const categoryNameRow = { name: "Tool type" };
  selectedTools.forEach((db) => {
    const tool = selectedToolsData.find(
      (tool) => tool?.tool_name === db || tool?.name === db
    );
    categoryNameRow[db] = tool?.category_name || "Will be add soon";
  });

  const categoryDescriptionRow = { name: "Tool type description" };
  selectedTools.forEach((db) => {
    const tool = selectedToolsData.find(
      (tool) => tool?.tool_name === db || tool?.name === db
    );
    categoryDescriptionRow[db] =
      tool?.category_description || "Will be add soon";
  });

  const dataRows = attributes.map((attribute) => {
    const row = { name: attribute.label, _attributeKey: attribute.key };

    selectedTools.forEach((db) => {
      const tool = selectedToolsData.find(
        (tool) => tool?.tool_name === db || tool?.name === db
      );

      if (tool) {
        const toolData = tool[attribute.key];
        row[db] = Array.isArray(toolData)
          ? toolData
          : toolData !== undefined
          ? toolData
          : "No data available";
      } else {
        row[db] = "No data available";
      }
    });

    return row;
  });

  const data = [
    descriptionRow, // Tool description row
    categoryNameRow, // Tool type row
    categoryDescriptionRow, // Tool type description row
    dbCompareRankingRow, // DB Compare Ranking row (placed after categoryDescriptionRow)
    ...dataRows, // Remaining data rows
  ];

  useEffect(() => {
    if (selectedToolsData && selectedToolsData.length > 0) {
      setIsLoading(false);
    }
  }, [selectedToolsData]);

  return (
    <>
      {isLoading ? (
        <Table
          rowKey="key"
          pagination={false}
          dataSource={[...Array(5)].map((_, index) => ({
            key: `key${index}`,
          }))}
          className="mt-4"
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

export default ToolComparisonTable;
