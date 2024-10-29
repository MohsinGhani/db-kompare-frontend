"use client";

import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import { Select, DatePicker } from "antd";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
}

const { Option } = Select;

const DBChart = () => {
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const options = {
    chart: {
      type: "line",
      alignTicks: false,
      borderRadius: 24,
      height: 600,
    },
    title: {
      text: "Popularity of 10 Tools",
    },
    yAxis: {
      title: null,
    },
    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
      },
    },
    exporting: {
      enabled: false,
    },
    series: [
      {
        name: "MySQL",
        data: [
          45934, 48656, 56165, 71827, 92143, 102383, 111533, 121174, 115157,
          121454, 114610, 118960,
        ],
      },
      {
        name: "PostgreSQL",
        data: [
          34916, 37941, 45742, 48851, 54490, 60282, 68121, 70885, 73726, 79243,
          81050, 89099,
        ],
      },
      {
        name: "MongoDB",
        data: [
          22444, 27000, 31005, 34771, 37185, 44377, 52147, 56912, 58243, 63213,
          65663, 69978,
        ],
      },
      {
        name: "Redis",
        data: [
          18408, 20000, 22500, 27800, 30185, 32377, 43147, 48912, 50243, 53213,
          55663, 58978,
        ],
      },
      {
        name: "SQLite",
        data: [
          15908, 17400, 18500, 19248, 19889, 21816, 24774, 28300, 31053, 32906,
          34573, 36471,
        ],
      },
      {
        name: "Oracle DB",
        data: [
          51908, 45548, 48105, 51248, 52989, 53816, 54774, 56300, 57053, 57906,
          58573, 59471,
        ],
      },
      {
        name: "Cassandra",
        data: [
          20908, 23548, 26105, 31248, 32889, 38816, 41774, 44300, 46053, 48906,
          49573, 50471,
        ],
      },
      {
        name: "MariaDB",
        data: [
          31408, 32500, 33500, 34248, 35889, 37816, 39774, 41300, 43053, 43906,
          45573, 46471,
        ],
      },
      {
        name: "Microsoft SQL Server",
        data: [
          24908, 26548, 29105, 31248, 33889, 35816, 37774, 39300, 41053, 42906,
          44573, 46471,
        ],
      },
      {
        name: "Elasticsearch",
        data: [
          11908, 14548, 16105, 18248, 19889, 21816, 23774, 26300, 28053, 28906,
          30573, 32471,
        ],
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
    credits: false,
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-full">
        <div className="flex justify-center gap-4 mb-4">
          <Select
            placeholder="Select Website"
            className="w-48"
            onChange={(value) => setSelectedDatabase(value)}
          >
            <Option value="all">All</Option>
            <Option value="github">Github</Option>
            <Option value="stack_overflow">Stack Overflow</Option>
            <Option value="google">Google Search</Option>
            <Option value="bing">Bing Search</Option>
          </Select>

          <DatePicker
            placeholder="Select Date"
            onChange={(date, dateString) => setSelectedDate(dateString)}
          />
        </div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default DBChart;
