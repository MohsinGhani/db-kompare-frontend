"use client";

import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import dbJsonData from "../shared/db-json/index.json";
import "./style.scss";
import LeaderboardFilter from "../leaderboardFilter";

const DBChart = () => {
  const [selectedDate, setSelectedDate] = useState([null, null]);
  const [selectedMetricKeys, setSelectedMetricKeys] = useState(["popularity"]);

  const isDateInRange = (date, startDate, endDate) =>
    !startDate ||
    !endDate ||
    (new Date(date) >= new Date(startDate) &&
      new Date(date) <= new Date(endDate));

  const calculateMetricValue = (metric, metricKeys) =>
    metricKeys.reduce((sum, key) => {
      const value = metric[key];
      if (!value) return sum;
      return (
        sum +
        (typeof value === "object"
          ? Object.values(value).reduce((objSum, v) => objSum + v, 0)
          : value)
      );
    }, 0);

  const getMetricData = (metricKeys, dateRange) =>
    dbJsonData.databases.map((db) => ({
      databaseName: db.databaseName,
      data: db.metrics
        .filter(
          (metric) =>
            !dateRange[0] ||
            !dateRange[1] ||
            isDateInRange(metric.date, dateRange[0], dateRange[1])
        )
        .map((metric) => calculateMetricValue(metric, metricKeys)),
    }));

  const getXAxisCategories = (dateRange) => {
    const allMetrics = dbJsonData.databases[0]?.metrics || [];
    if (!dateRange[0] || !dateRange[1])
      return allMetrics.map((metric) => metric.date);
    return allMetrics
      .filter((metric) =>
        isDateInRange(metric.date, dateRange[0], dateRange[1])
      )
      .map((metric) => metric.date);
  };

  const filteredData = getMetricData(selectedMetricKeys, selectedDate);

  const chartOptions = {
    chart: {
      type: "spline",
      // type: "line",
      alignTicks: false,
      borderRadius: 16,
      borderWidth: 1,
      spacing: 30,
      borderColor: "#D9D9D9",
      height: 600,
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
                .css({ fontSize: "20px", fontWeight: "bold", color: "red" })
                .add();
              const { width: textWidth, height: textHeight } =
                this.errorMessage.getBBox();
              this.errorMessage.attr({
                x: (chartWidth - textWidth) / 2,
                y: (chartHeight + textHeight) / 2,
              });
            }
          } else {
            this.errorMessage?.destroy();
          }
        },
      },
    },
    title: {
      text: "Database Metrics Over Time",
      style: { fontSize: "26px", fontWeight: "600" },
    },
    yAxis: { title: null },
    xAxis: {
      categories:
        filteredData.length > 0 ? getXAxisCategories(selectedDate) : [],
    },
    series:
      filteredData.length > 0
        ? filteredData.map((db) => ({ name: db.databaseName, data: db.data }))
        : [],
    responsive: {
      rules: [
        {
          condition: { maxWidth: 520 },
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
        <LeaderboardFilter
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          setSelectedMetricKeys={setSelectedMetricKeys}
          selectedMetricKeys={selectedMetricKeys}
        />
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          style={{ borderRadius: "24px", border: "1px solid #D9D9D9" }}
        />
      </div>
    </div>
  );
};

export default DBChart;
