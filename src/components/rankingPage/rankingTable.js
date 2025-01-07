import React, { useEffect, useState } from "react";
import { Button, Drawer, Table } from "antd";
import { fetchDatabaseRanking } from "@/utils/databaseUtils";
import CommonTypography from "../shared/Typography";
import ProcessDataHtml from "@/utils/processHtml";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { formatDateForHeader } from "@/utils/formatDateAndTime";
import { useRouter } from "nextjs-toploader/app";
import RankingOptions from "./rankingOptions";
import { rankingOptions } from "@/utils/const";

const { Column, ColumnGroup } = Table;

const RankingTable = ({ previousDays }) => {
  const router = useRouter();

  const [rankingTableData, setRankingTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");

  const handleRankingChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    console.log("Selected option:", selectedOption);
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
        const data = await fetchDatabaseRanking(startDate, endDate);
        setRankingTableData(data.data);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      }
    };

    fetchData();
  }, [previousDays]);

  const columnStyle = {
    fontSize: "16px",
    fontWeight: "700",
  };

  const rankColumns = previousDays.slice(0, 2).map((date) => {
    const formattedDate = formatDateForHeader(date);

    const iconStyle = { marginRight: 10 };
    const noIconStyle = { marginRight: 25 };

    return (
      <Column
        key={`rank-${date}`}
        minWidth={150}
        title={<span style={columnStyle}>{formattedDate}</span>}
        dataIndex={`rank_${date}`}
        render={(rank, row) => {
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
        minWidth={160}
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
  const formattedData = rankingTableData.map((db) => {
    const dataRow = {
      DBMS: db.name,
      DatabaseModel: db.database_model,
      SecondaryDatabaseModel: db.secondary_database_model?.join(", ") || "-",
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
    if (selectedOption === "All") {
      return true;
    }
    const dbModelText = db?.DatabaseModel?.replace(/<[^>]+>/g, "")
      .trim()
      .toLowerCase();

    const secondaryModelsText = db?.SecondaryDatabaseModel?.replace(
      /<[^>]+>/g,
      ""
    )
      .trim()
      .toLowerCase();

    return (
      dbModelText === selectedOption.toLowerCase() ||
      secondaryModelsText?.includes(selectedOption.toLowerCase())
    );
  });

  // Sorting formatted data by the latest score date (first date in previousDays)
  const sortedData = filteredData.sort((a, b) => {
    const latestDate = previousDays[0];
    const scoreA = a[`score_${latestDate}`] || 0;
    const scoreB = b[`score_${latestDate}`] || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="w-full mt-0 md:mt-12 lg:mt-0">
      <div className="flex flex-row items-center justify-between lg:mt-6 mb-5">
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
          <RankingOptions
            rankingOptions={rankingOptions}
            onChange={handleRankingChange}
          />
        </div>
        <div className="w-full overflow-auto">
          <Table
            className="border border-gray-200 rounded-lg custom-table overflow-y-auto bg-white h-[725px] max-h-[725px] min-h-[725px]"
            pagination={false}
            dataSource={sortedData}
            rowKey="DBMS"
            scroll={{ x: 400 }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "bg-[#EEEEEE]" : "bg-white"
            }
          >
            <ColumnGroup title={<span style={columnStyle}>Ranks</span>}>
              {rankColumns}
            </ColumnGroup>

            <Column
              minWidth={200}
              title={<span style={columnStyle}>DBMS</span>}
              dataIndex="DBMS"
              key="DBMS"
              render={(text) => (
                <span
                  className="text-[#0000FF] cursor-pointer"
                  onClick={() => router.push(`/db-comparison/${text}`)}
                >
                  {text}
                </span>
              )}
            />

            <Column
              minWidth={200}
              title={<span style={columnStyle}>Database Model</span>}
              dataIndex="DatabaseModel"
              key="DatabaseModel"
              render={(text, record) => (
                <ProcessDataHtml htmlString={text} record={record} />
              )}
            />
            <Column
              minWidth={200}
              title={<span style={columnStyle}>Secondary DB Model</span>}
              dataIndex="SecondaryDatabaseModel"
              key="SecondaryDatabaseModel"
              render={(text) => {
                const sanitizedText = text
                  ? text.replace(/<span[^>]*title=[^>]*>.*?<\/span>/g, "")
                  : "-";

                return (
                  <div style={{ textAlign: "center" }}>
                    {sanitizedText === "-" ? (
                      <span style={{ fontWeight: "bold" }}>
                        {sanitizedText}
                      </span>
                    ) : (
                      <ProcessDataHtml
                        htmlString={sanitizedText}
                        showOnLine={true}
                      />
                    )}
                  </div>
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
        className="z-50"
      >
        <RankingOptions
          rankingOptions={rankingOptions}
          onChange={(selectedOption) => {
            handleRankingChange(selectedOption);
            onClose();
          }}
          isSmallDevice={true}
        />
      </Drawer>
    </div>
  );
};

export default RankingTable;
