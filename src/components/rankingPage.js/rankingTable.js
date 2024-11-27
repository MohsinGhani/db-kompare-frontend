"use client";

import React from "react";
import { Table } from "antd";
import JsonData from "@/components/shared/Db-json";
import CommonTypography from "../shared/Typography";
import { styleFirstWord } from "@/utils/chartUtils";

const { Column, ColumnGroup } = Table;

const RankingTable = () => {
  const columnStyle = {
    fontSize: "16px",
    fontWeight: "700",
  };

  return (
    <div className="w-full">
      <CommonTypography classes="font-semibold text-3xl">
        DB-Kompare Ranking
      </CommonTypography>
      <Table
        pagination={false}
        dataSource={JsonData.rantingData}
        rowKey="id"
        style={{
          borderRadius: "24px",
          border: "1px solid #D9D9D9",
          padding: "5px",
        }}
        scroll={{ x: 400 }}
        className="my-5"
        rowClassName="pl-5 text-base font-normal max-h-12"
      >
        <ColumnGroup title={<span style={columnStyle}>Ranks</span>}>
          <Column
            minWidth={150}
            title={<span style={columnStyle}>25th Nov, 24</span>}
            dataIndex="Rank"
            key="Rank"
          />
          <Column
            minWidth={150}
            title={
              <span style={{ ...columnStyle, maxWidth: "300px" }}>
                24th Nov, 24
              </span>
            }
            dataIndex="Rank"
            key="Rank"
          />
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
          render={(text) => styleFirstWord(text)}
        />

        <ColumnGroup
          title={<span style={columnStyle}>Score</span>}
          className="bg-pink-800"
        >
          <Column
            minWidth={100}
            title={<span style={columnStyle}>25th Nov, 24</span>}
            dataIndex="25th Nov, 24"
            key="25th Nov, 24"
          />
          <Column
            minWidth={100}
            title={<span style={columnStyle}>24th Nov, 24</span>}
            dataIndex="25th Nov, 24"
            key="24th Nov, 24"
            render={(text) => <span style={{ color: "#00CC67" }}>+{text}</span>}
          />
          <Column
            minWidth={100}
            title={<span style={columnStyle}>23rd Nov, 24</span>}
            dataIndex="24th Nov, 24"
            key="24th Nov, 24"
            render={(text) => <span style={{ color: "#E33C33" }}>-{text}</span>}
          />
        </ColumnGroup>
      </Table>
    </div>
  );
};

export default RankingTable;
