"use client";

import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import { Select, DatePicker } from "antd";
import dbJsonData from "../shared/db-json/index.json";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
}

const { Option } = Select;

const DBChart = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("popularity");

  const filteredData = dbJsonData.databases.map((db) => {
    return {
      databaseName: db.databaseName,
      data: db.metrics.filter((metric) =>
        selectedDate ? metric.date === selectedDate : true
      ),
    };
  });

  const options = {
    chart: {
      type: "line",
      alignTicks: false,
      borderRadius: 24,
      height: 600,
    },
    title: {
      text: "Popularity of Databases Over Time",
    },
    yAxis: {
      title: null,
    },
    xAxis: {
      categories:
        filteredData.length > 0 && filteredData[0].data.length > 0
          ? filteredData[0].data.map((metric) => metric.date)
          : [],
    },
    series: filteredData.map((db) => ({
      name: db.databaseName,
      data:
        db.data.length > 0
          ? db.data.map((metric) => metric[selectedMetric])
          : [],
    })),
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

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handleMetricChange = (value) => {
    setSelectedMetric(value);
  };

  const dropdownOptions = [
    { value: "all", label: "All" },
    { value: "github", label: "Github" },
    { value: "stackoverflowdata", label: "Stack Overflow" },
    { value: "google", label: "Google Search" },
    { value: "bing", label: "Bing Search" },
  ];

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-full">
        <div className="flex justify-center gap-4 mb-4">
          <Select
            mode="tags"
            className="w-96"
            defaultValue="all"
            placeholder="Please select a metric"
            onChange={handleMetricChange}
          >
            {dropdownOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>

          <DatePicker placeholder="Select Date" onChange={handleDateChange} />
        </div>

        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default DBChart;
