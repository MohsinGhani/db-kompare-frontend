import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { fetchDatabaseRanking } from "@/utils/databaseUtils";
import CommonTypography from "../shared/Typography";
import ProcessDataHtml from "@/utils/processHtml";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { formatDateForHeader } from "@/utils/formatDateAndTime";

const { Column, ColumnGroup } = Table;

const RankingTable = ({ previousDays }) => {
  const [rankingTableData, setRankingTableData] = useState([]);

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
        minWidth={100}
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

  // Sorting formatted data by the latest score date (first date in previousDays)
  const sortedData = formattedData.sort((a, b) => {
    const latestDate = previousDays[0];
    const scoreA = a[`score_${latestDate}`] || 0;
    const scoreB = b[`score_${latestDate}`] || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="w-full">
      <CommonTypography classes="font-semibold text-3xl">
        DB-Kompare Ranking
      </CommonTypography>
      <Table
        pagination={false}
        dataSource={sortedData}
        rowKey="DBMS"
        bordered
        scroll={{ x: 400 }}
        className="my-5"
        style={{ background: "gray" }}
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
          render={(text) => <span style={{ color: "#3E53D7" }}>{text}</span>}
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

        <ColumnGroup
          title={<span style={columnStyle}>Score</span>}
          className="bg-pink-800"
        >
          {scoreColumns}
        </ColumnGroup>
      </Table>
    </div>
  );
};

export default RankingTable;
