import React, { useEffect, useMemo, useState } from "react";
import { Button, Drawer, Table } from "antd";
import CommonTypography from "../shared/Typography";
import ProcessDataHtml from "@/utils/processHtml";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { formatDateForHeader } from "@/utils/formatDateAndTime";
import { useRouter } from "nextjs-toploader/app";
import { replaceKeywords } from "@/utils/helper";
import DBToolsRankingOptions from "./dbToolsRankingOptions";
import { fetchDbToolsRanking } from "@/utils/dbToolsUtil";

const { Column, ColumnGroup } = Table;

const DBToolsRankingTable = ({ previousDays }) => {
  const router = useRouter();
  const rankCol = useMemo(
    () => ["Local Ranking", ...previousDays],
    [previousDays]
  );
  const [loading, setLoading] = useState(false);
  const [rankingTableData, setRankingTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");

  const handleRankingChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    const fetchData = async () => {
      const startDate = previousDays[previousDays.length - 1];
      const endDate = previousDays[0];

      try {
        setLoading(true);
        const data = await fetchDbToolsRanking(startDate, endDate);
        console.log("tools data", data);
        setRankingTableData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rankings:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [previousDays]);

  const normalizeDatabaseModel = (model) => {
    let text = "";
    if (Array.isArray(model)) {
      // Join array elements with comma and space
      text = model.join(", ");
    } else if (typeof model === "string") {
      text = model;
    }
    // Remove any HTML tags
    text = text.replace(/<[^>]+>/g, "");
    return text.trim().toLowerCase();
  };

  const columnStyle = {
    fontSize: "15px",
    fontWeight: "700",
    textAlign: "center",
  };

  const rankColumns = rankCol.slice(0, 3).map((date, ind) => {
    const formattedDate = ind !== 0 ? formatDateForHeader(date) : date;
  
    const iconStyle = { marginRight: 10 };
    const noIconStyle = { marginRight: 25 };
  
    return (
      <Column
        key={`rank-${date}`}
        minWidth={140}
        title={<span style={columnStyle}>{formattedDate}</span>}
        dataIndex={ind === 0 ? "index" : `rank_${date}`} // Use 'index' for Local Ranking
        sorter={(a, b) => {
          if (ind === 0) {
            // Sorting logic for Local Ranking (index)
            return a.index - b.index;
          } else {
            // Sorting logic for Rank columns
            const rankA = Number(a[`rank_${date}`] || 0);
            const rankB = Number(b[`rank_${date}`] || 0);
            return rankA - rankB;
          }
        }}
        render={(value, row, rowIndex) => {
          if (ind === 0) {
            // Fetch status from the second column
            const statusKey = `rank_status_${rankCol[2]}`; // Assuming second column has trend data
            const status = row[statusKey];
  
            return (
              <span className="flex items-center justify-center">
                {status === "INCREASED" ? (
                  <CaretUpOutlined style={{ color: "#00CC67", ...iconStyle }} />
                ) : status === "DECREASED" ? (
                  <CaretDownOutlined style={{ color: "#E33C33", ...iconStyle }} />
                ) : (
                  <span style={noIconStyle}></span>
                )}
                <span>{rowIndex + 1}</span>
              </span>
            );
          }
  
          const rank = value;
          const status = row[`rank_status_${date}`];
  
          // Check if rank is not available, if not show '-'
          if (!rank) {
            return (
              <span style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginLeft: 25 }}>-</span>
              </span>
            );
          }
  
          return (
            <span style={{ display: "flex", alignItems: "center" }}>
              {status === "INCREASED" ? (
                <CaretUpOutlined style={{ color: "#00CC67", ...iconStyle }} />
              ) : status === "DECREASED" ? (
                <CaretDownOutlined style={{ color: "#E33C33", ...iconStyle }} />
              ) : (
                <span style={noIconStyle}></span>
              )}
              <span>{rank}</span>
            </span>
          );
        }}
      />
    );
  });
  
  const scoreColumns = previousDays.slice(0, 3).map((date) => {
    const formattedDate = formatDateForHeader(date);

    return (
      <Column
        key={`score-${date}`}
        minWidth={130}
        title={<span style={columnStyle}>{formattedDate}</span>}
        dataIndex={`score_${date}`}
        render={(text) => {
          const parsedText = parseFloat(text);

          if (isNaN(parsedText)) {
            return <span>-</span>;
          }

          // Round the number to 2 decimal places
          const roundedText = parsedText.toFixed(2);
          const isLatestDate = date === previousDays[0];

          if (isLatestDate) {
            return <span>{roundedText}</span>;
          }

          return (
            <span
              style={{
                color: parsedText > 0 ? "#00CC67" : "#E33C33",
              }}
            >
              {parsedText > 0 ? `+${roundedText}` : roundedText}
            </span>
          );
        }}
      />
    );
  });

  // Formatting and sorting data
  const formattedData = rankingTableData.map((db,ind) => {
    const dataRow = {
      index:ind+1,
      DBMS: db.name,
      DatabaseModel: db.category,
      DatabaseModelId: db.category_id,
    };

    const lastTwoRankChanges = db.rankChanges.slice(0, 2);
    const lastThreeScoreChanges = db.scoreChanges.slice(0, 3);

    previousDays.forEach((date) => {
      const rank = lastTwoRankChanges.find((change) => change.date === date);
      const score = lastThreeScoreChanges.find(
        (change) => change.date === date
      );

      // Add rank and status if available
      if (rank) {
        dataRow[`rank_${date}`] = rank.rank;
        if (rank.status) {
          dataRow[`rank_status_${date}`] = rank.status;
        }
      }

      // Add score if available
      if (score) {
        dataRow[`score_${date}`] = score.totalScore;
      }
    });

    return dataRow;
  });

  const filteredData = formattedData.filter((db) => {
    if (selectedOption === "All" || selectedOption === "all") {
      return true;
    }

    return db.DatabaseModelId === selectedOption;
  });

  const sortedData = filteredData.sort((a, b) => {
    const latestDate = previousDays[0];
    const scoreA = a[`score_${latestDate}`] || 0;
    const scoreB = b[`score_${latestDate}`] || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="w-full mt-0 md:mt-12 lg:mt-0">
      <div className="flex flex-row items-center justify-between mt-20 lg:mt-8 mb-5">
        <CommonTypography classes="font-semibold text-xl sm:text-3xl ">
          DB-Kompare Ranking
        </CommonTypography>
        <div className="md:hidden">
          <Button
            icon={<FilterOutlined />}
            type="text"
            size="large"
            onClick={showDrawer}
          >
            <CommonTypography className="text-[18px] font-semibold">
              Filters
            </CommonTypography>
          </Button>
        </div>
      </div>
      <div className="md:flex md:flex-row items-start justify-between w-full">
        <div className=" hidden md:block min-w-[150px] sm:min-w-[200px] md:min-w-[250px] mr-4 ">
          <DBToolsRankingOptions onChange={handleRankingChange} />
        </div>
        <div className="w-full overflow-auto">
          <Table
            className="border border-gray-200 rounded-lg custom-table overflow-y-auto bg-white h-full min-h-[750px]"
            pagination={false}
            dataSource={sortedData}
            rowKey="DBMS"
            scroll={{ x: 600 }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "bg-[#EEEEEE]" : "bg-white"
            }
            loading={loading}
          >
            <ColumnGroup title={<span style={columnStyle}>Ranks</span>}>
              {rankColumns}
            </ColumnGroup>

            <Column
              minWidth={160}
              title={<span style={columnStyle}>Tool Name</span>}
              dataIndex="DBMS"
              key="DBMS"
              sorter={(a, b) => a.DBMS.localeCompare(b.DBMS)}
              render={(text) => (
                <span
                  className="text-[#0000FF] cursor-pointer"
                  onClick={() => router.push(`/db-toolcomparison/${text}`)}
                >
                  {text}
                </span>
              )}
            />

            <Column
              minWidth={160}
              title={<span style={columnStyle}>Tool Type</span>}
              dataIndex="DatabaseModel"
              key="DatabaseModel"
              sorter={(a, b) => {
                const aVal = normalizeDatabaseModel(a.DatabaseModel);
                const bVal = normalizeDatabaseModel(b.DatabaseModel);
                return aVal.localeCompare(bVal);
              }}
              render={(text, record) => {
                const safeString = Array.isArray(text) ? text.join(", ") : text;
                const replacedText = replaceKeywords(safeString);
                return (
                  <ProcessDataHtml htmlString={replacedText} record={record} />
                );
              }}
            />

            <ColumnGroup
              title={<span style={columnStyle}>Score</span>}
              className="bg-pink-800"
            >
              {scoreColumns}
            </ColumnGroup>
          </Table>
        </div>
      </div>
      <Drawer
        title={
          <CommonTypography className="text-[20px] font-bold">
            Filters
          </CommonTypography>
        }
        onClose={onClose}
        open={open}
      >
        <div>
          <DBToolsRankingOptions
            onChange={(selectedOption) => {
              handleRankingChange(selectedOption);
              onClose();
            }}
            isSmallDevice={true}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default DBToolsRankingTable;
