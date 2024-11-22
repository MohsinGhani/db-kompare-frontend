"use client";

import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchMetricsData } from "@/utils/databaseUtils";
import LeaderboardFilter from "../leaderboardFilter";
import "./style.scss";

const DBChart = () => {
  const [selectedDate, setSelectedDate] = useState([null, null]);
  const [selectedMetricKeys, setSelectedMetricKeys] = useState([]);
  const [metricsData, setMetricsData] = useState([]);


  const isDateInRange = (date, startDate, endDate) =>
    !startDate ||
    !endDate ||
    (new Date(date) >= new Date(startDate) &&
      new Date(date) <= new Date(endDate));


      useEffect(() => {
        if (selectedMetricKeys.length === 0 || selectedMetricKeys.length === 4) {
          setSelectedMetricKeys(["totalScore"]);
        }

      }, [selectedMetricKeys]); 
      const calculateMetricValue = (metric, metricKeys) => {
        return metricKeys?.reduce((sum, key) => {
          const value = metric.popularity[key];
          if (value === undefined || value === null) {
            console.warn(`Key "${key}" does not exist for metric:`, metric);
            return sum;
          }
          return (
            sum +
            (typeof value === "object"
              ? Object.values(value).reduce((objSum, v) => objSum + (v || 0), 0)
              : value)
          );
        }, 0);
      };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = "2024-11-17"; 
        const endDate = "2024-11-22"; 

        const data = await fetchMetricsData(startDate, endDate);
        setMetricsData(data.data);
      } catch (error) {
        console.error("Error fetching metrics data:", error);
      }
    };

    fetchData();
  }, []);

 const getMetricData = (metricKeys, dateRange) =>
    metricsData.map((db) => ({
      databaseName: db.databaseName,
      data: db.metrics
        .filter((metric) =>
          isDateInRange(metric.date, dateRange[0], dateRange[1])
        )
        .map((metric) => calculateMetricValue(metric, metricKeys)),
    }));

  const getXAxisCategories = (dateRange) => {
    const allMetrics = metricsData[0]?.metrics || [];
    if (!dateRange[0] || !dateRange[1]) {
      return allMetrics.map((metric) => metric.date);
    }
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
    tooltip: {
      formatter: function () {
        const roundedValue = this.y.toFixed(2);
        return `<b>${this.series.name}</b><br/>${this.x}: ${roundedValue}`;
      },
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
