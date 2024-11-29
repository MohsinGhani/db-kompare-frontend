"use client";

import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchMetricsData } from "@/utils/databaseUtils";
import LeaderboardFilter from "../leaderboardFilter";
import "./style.scss";
import { formatDate, isDateInRange } from "@/utils/formatDateAndTime";
import { calculateChartWeightedValue } from "@/utils/chartValueWithFormula";

const DBChart = ({ previousDays }) => {
  const [selectedDate, setSelectedDate] = useState([null, null]);
  const [selectedMetricKeys, setSelectedMetricKeys] = useState([]);
  const [metricsData, setMetricsData] = useState([]);

  useEffect(() => {
    if (selectedMetricKeys.length === 0 || selectedMetricKeys.length === 4) {
      setSelectedMetricKeys(["totalScore"]);
    }
  }, [selectedMetricKeys]);

  const getMetricData = (metricKeys, dateRange) => {
    const allDatesInRange = getXAxisCategories(dateRange);

    return metricsData.map((db) => ({
      databaseName: db.databaseName,
      data: allDatesInRange.map((date) => {
        const matchingMetric = db.metrics.find(
          (metric) => metric.date === date
        );

        // If no data for this date, return null to create a gap
        return matchingMetric
          ? calculateChartWeightedValue(matchingMetric, metricKeys)
          : null;
      }),
    }));
  };

  // Add getXAxisCategories function to filter metrics by date range
  const getXAxisCategories = (dateRange) => {
    const allMetrics = metricsData[0]?.metrics || [];

    // Extract unique dates that are within the selected range
    const uniqueDates = new Set(
      allMetrics
        .filter((metric) =>
          isDateInRange(metric.date, dateRange[0], dateRange[1])
        )
        .map((metric) => metric.date)
    );

    return Array.from(uniqueDates);
  };

  // Add chartOptions configuration with error handling and chart customization
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
            const errorMessage = "No data available";

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

  // Add useEffect to fetch metrics data based on selected date range'
  useEffect(() => {
    const fetchData = async () => {
      const startDate = formatDate(selectedDate[0]) || "2024-11-18";
      const endDate = formatDate(selectedDate[1]) || previousDays[0];

      const data = await fetchMetricsData(startDate, endDate);
      setMetricsData(data.data);
    };

    fetchData();
  }, [selectedDate]);

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
