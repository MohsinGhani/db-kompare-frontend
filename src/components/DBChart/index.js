"use client";

import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Select, DatePicker, Button } from "antd";
import dbJsonData from "../shared/db-json/index.json";
import "./style.scss";
import CommonTypography from "../shared/Typography";
const { Option } = Select;

const DBChart = () => {
  const [selectedDate, setSelectedDate] = useState([null, null]);
  const [selectedMetricKeys, setSelectedMetricKeys] = useState(["popularity"]);

  const { RangePicker } = DatePicker;

  // Helper function to check if a date is within the selected range
  const isDateInRange = (date, startDate, endDate) => {
    const metricDate = new Date(date);
    return (
      !startDate ||
      !endDate ||
      (metricDate >= new Date(startDate) && metricDate <= new Date(endDate))
    );
  };

  // Helper function to calculate the total metric value for a metric key
  const calculateMetricValue = (metric, metricKeys) => {
    return metricKeys.reduce((sum, metricKey) => {
      const metricValue = metric[metricKey];
      if (!metricValue) return sum;

      if (typeof metricValue === "object") {
        // Sum the values of the object
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
    }, 0);
  };

  // Function to get filtered metric data for each database

  const getMetricData = (metricKeys, selectedDate) => {
    return dbJsonData.databases.map((db) => {
      const totalDataForDatabase = db.metrics
        .map((metric) => {
          if (
            selectedDate[0] &&
            selectedDate[1] &&
            !isDateInRange(metric.date, selectedDate[0], selectedDate[1])
          ) {
            return null;
          }
          return calculateMetricValue(metric, metricKeys);
        })
        .filter((item) => item !== null);

      return {
        databaseName: db.databaseName,
        data: totalDataForDatabase,
      };
    });
  };

  const filteredData = getMetricData(selectedMetricKeys, selectedDate);
  const getXAxisCategories = (selectedDate) => {
    const allMetrics = dbJsonData.databases[0]?.metrics || [];
    if (!selectedDate[0] || !selectedDate[1]) {
      // If no date range is selected, show all dates
      return allMetrics.map((metric) => metric.date);
    }
    return allMetrics
      .map((metric) => metric.date)
      .filter((date) => isDateInRange(date, selectedDate[0], selectedDate[1]));
  };

  // Options for the chart configuration
  const options = {
    chart: {
      type: "line",
      alignTicks: false,
      borderRadius: 16,
      borderWidth: 1,
      spacing: 30,
      borderColor: "#D9D9D9",
      height: 700,
      events: {
        render: function () {
          const chart = this;
          const chartWidth = chart.chartWidth;
          const chartHeight = chart.chartHeight;

          if (filteredData.every((db) => db.data.length === 0)) {
            const errorMessage = "No data available on these dates";

            if (!this.errorMessage) {
              this.errorMessage = chart.renderer
                .text(errorMessage, 0, 0)
                .css({
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "red",
                })
                .add();

              const textWidth = this.errorMessage.getBBox().width;
              const textHeight = this.errorMessage.getBBox().height;

              const xPosition = (chartWidth - textWidth) / 2;
              const yPosition = (chartHeight + textHeight) / 2;

              this.errorMessage.attr({
                x: xPosition,
                y: yPosition,
              });
            }
          } else {
            if (this.errorMessage) {
              this.errorMessage.destroy();
              this.errorMessage = null;
            }
          }
        },
      },
    },
    title: {
      text: "Database Metrics Over Time",
      style: {
        fontSize: "26px",

        fontWeight: "600",
      },
    },
    yAxis: {
      title: null,
    },
    xAxis: {
      categories:
        filteredData.length > 0 && filteredData[0].data.length > 0
          ? getXAxisCategories(selectedDate)
          : [],
    },
    series:
      filteredData.length > 0 && filteredData[0].data.length > 0
        ? filteredData.map((db) => ({
            name: db.databaseName,
            data: db.data,
          }))
        : [],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 520,
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

  // Date change handler
  const handleDateChange = (dates) => {
    setSelectedDate(dates || [null, null]);
  };

  // Metric change handler
  const handleMetricChange = (value) => {
    if (value.length === 0 || value.length === dropdownOptions.length - 1) {
      setSelectedMetricKeys(["popularity"]);
    } else {
      if (value.includes("popularity")) {
        const newMetricKeys =
          value[value.length - 1] === "popularity"
            ? ["popularity"]
            : value.filter((v) => v !== "popularity");

        setSelectedMetricKeys(newMetricKeys);
      } else {
        setSelectedMetricKeys(value);
      }
    }
  };

  // Dropdown options for metrics
  const dropdownOptions = [
    { value: "github", label: "Github" },
    { value: "stackoverflowdata", label: "Stack Overflow" },
    { value: "google", label: "Google Search" },
    { value: "bing", label: "Bing Search" },
  ];

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-full">
        <div className="md:flex p-6 justify-center gap-4 py-4  mb-4 border rounded-2xl flex-col border-[#D9D9D9]">
          <div className="flex justify-between">
            <CommonTypography type="text" classes="text-2xl font-bold">
              Filters{" "}
            </CommonTypography>
            <button
              className="text-[#3E53D7] text-base font-medium underline"
              onClick={() => {
                setSelectedDate([null, null]);
                setSelectedMetricKeys(["popularity"]);
              }}
            >
              Clear filter
            </button>
          </div>
          <div className="md:flex justify-between gap-5">
            <div className="w-full ">
              <CommonTypography type="text" classes="text-lg font-medium">
                Database Resources
              </CommonTypography>

              <div className="flex  flex-wrap  md:gap-10 mt-3">
                {dropdownOptions.map((option, index) => (
                  <div className="flex items-center mt-2" key={index}>
                    <input
                      type="checkbox"
                      style={{ width: "1rem", height: "1rem" }}
                      id={option.value}
                      name={option.value}
                      value={option.value}
                      checked={selectedMetricKeys.includes(option.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleMetricChange([
                            ...selectedMetricKeys,
                            option.value,
                          ]);
                        } else {
                          handleMetricChange(
                            selectedMetricKeys.filter(
                              (key) => key !== option.value
                            )
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={option.value}
                      className="mx-2 text-base font-medium"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full">
              <CommonTypography type="text" classes="text-lg font-medium">
                Select Date
              </CommonTypography>
              <RangePicker
                placeholder="Select Date"
                className=" w-full mt-2 dateRange h-9 mt-3"
                value={selectedDate[0] && selectedDate[1] ? selectedDate : null}
                onChange={handleDateChange}
              />
            </div>
          </div>
        </div>
        <HighchartsReact
          style={{ borderRadius: "24px", border: "1px solid #D9D9D9" }}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </div>
  );
};

export default DBChart;
