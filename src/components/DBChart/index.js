"use client";

import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Select, DatePicker } from "antd";
import dbJsonData from "../shared/db-json/index.json";

const { Option } = Select;

const DBChart = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMetricKeys, setSelectedMetricKeys] = useState(["popularity"]);
  const { RangePicker } = DatePicker;
  const getMetricData = (metricKeys) => {
    return dbJsonData.databases.map((db) => {
      const totalDataForDatabase = db.metrics.map((metric) => {
        return metricKeys.reduce((sum, metricKey) => {
          const metricValue = metric[metricKey];
          if (metricValue) {
            if (typeof metricValue === "object") {
              return (
                sum +
                Object.values(metricValue).reduce(
                  (objSum, value) => objSum + value,
                  0
                )
              );
            } else {
              return sum + metricValue;
            }
          }
          return sum;
        }, 0);
      });

      return {
        databaseName: db.databaseName,
        data: totalDataForDatabase,
      };
    });
  };

  const filteredData = getMetricData(selectedMetricKeys);

  const options = {
    chart: {
      type: "line",
      alignTicks: false,
      borderRadius: 24,
      height: 600,
    },
    title: {
      text: "Database Metrics over Time",
    },
    yAxis: {
      title: null,
    },
    xAxis: {
      categories:
        filteredData.length > 0 && filteredData[0].data.length > 0
          ? dbJsonData.databases[0].metrics.map((metric) => metric.date)
          : [],
    },
    series: filteredData.map((db) => ({
      name: db.databaseName,
      data: db.data,
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
    console.log(date, dateString);
    setSelectedDate(dateString);
  };
  const handleMetricChange = (value) => {
    if (
      value.includes("popularity") &&
      value[value.length - 1] === "popularity"
    ) {
      setSelectedMetricKeys(["popularity"]);
    } else if (value.includes("popularity")) {
      setSelectedMetricKeys(value.filter((v) => v !== "popularity"));
    } else {
      setSelectedMetricKeys(value);
    }
  };

  const dropdownOptions = [
    { value: "github", label: "Github" },
    { value: "stackoverflowdata", label: "Stack Overflow" },
    { value: "google", label: "Google Search" },
    { value: "bing", label: "Bing Search" },
    { value: "popularity", label: "All" },
  ];

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-full">
        <div className="flex justify-center gap-4 mb-4">
          <Select
            mode="multiple"
            className="w-96"
            value={selectedMetricKeys}
            placeholder="Please select metrics"
            onChange={handleMetricChange}
          >
            {dropdownOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>

          <RangePicker placeholder="Select Date" onChange={handleDateChange} />
        </div>

        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default DBChart;
