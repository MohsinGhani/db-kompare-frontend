"use client";

import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchMetricsData } from "@/utils/databaseUtils";
import LeaderboardFilter from "../leaderboardFilter";
import { formatDate, isDateInRange } from "@/utils/formatDateAndTime";
import { calculateChartWeightedValue } from "@/utils/chartValueWithFormula";
import { fetchDbToolsMetricsData } from "@/utils/dbToolsUtil";
import { METRICES_TYPE } from "@/utils/const";
import exporting from "highcharts/modules/exporting";
import exportData from "highcharts/modules/export-data";
import dayjs from "dayjs";
import { getReadableValue } from "@/utils/helper";
if (typeof Highcharts === "object") {
  exporting(Highcharts);
  exportData(Highcharts);
}

const DBChart = ({ previousDays, isRankingType }) => {
  const CHUNK_SIZE = 10;
  const [selectedDate, setSelectedDate] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [selectedMetricKeys, setSelectedMetricKeys] = useState([]);
  const [metriceType, setMetricType] = useState(METRICES_TYPE.DAILY);
  const [metricsData, setMetricsData] = useState([]);
  const [dbIndexRange, setDbIndexRange] = useState([0, CHUNK_SIZE]);
  const [enabledDatabases, setEnabledDatabases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedMetricKeys.length === 0 || selectedMetricKeys.length === 4) {
      setSelectedMetricKeys(["totalScore"]);
    }
  }, [selectedMetricKeys]);

  useEffect(() => {
    const fetchData = async () => {
      // Format the Day.js objects into a string format (YYYY-MM-DD)
      const startDate = selectedDate[0]
        ? selectedDate[0].format("YYYY-MM-DD")
        : dayjs().subtract(60, "day").format("YYYY-MM-DD");
      const endDate = selectedDate[1]
        ? selectedDate[1].format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");

      try {
        setLoading(true);
        let data;
        if (isRankingType === "Db Tools") {
          data = await fetchDbToolsMetricsData(startDate, endDate);
        } else {
          data = await fetchMetricsData(startDate, endDate, metriceType);
        }
        setMetricsData(data.data || []);
      } catch (error) {
        console.error("Error fetching metrics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    selectedDate,
    isRankingType,
    fetchDbToolsMetricsData,
    fetchMetricsData,
    metriceType,
  ]);

  useEffect(() => {
    if (metricsData && metricsData.length > 0) {
      const defaultEnabled = metricsData.map((_, i) => i < CHUNK_SIZE);
      setEnabledDatabases(defaultEnabled);
    }
  }, [metricsData]);

  const getXAxisCategories = (dateRange, type) => {
    const allMetrics = metricsData[0]?.metrics || [];
    const uniqueDates = allMetrics.map((metric) =>
      getReadableValue(metric.date, metriceType)
    );
    console.log("uniqueDates", uniqueDates);
    return Array.from(uniqueDates);
  };

  const chartData = metricsData || [];
  console.log("chartData", chartData);
  const handleLegendItemClick = function (event) {
    event.preventDefault();
    const seriesIndex = this.index;
    setEnabledDatabases((prev) => {
      const newState = [...prev];
      newState[seriesIndex] = !newState[seriesIndex];
      return newState;
    });
  };

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
        render() {
          const chart = this;
          const message = loading
            ? "Loading..."
            : metricsData.length === 0
            ? "No data available"
            : null;

          if (message) {
            if (!chart.customMessage) {
              chart.customMessage = chart.renderer
                .text(message, chart.chartWidth / 2, chart.chartHeight / 2)
                .css({
                  fontSize: "18px",
                  fontWeight: "semibold",
                  color: message === "Loading..." ? "grey" : "red",
                  textAlign: "center",
                })
                .add();
              chart.customMessage.attr({
                align: "center",
                verticalAlign: "middle",
              });
            } else {
              chart.customMessage.attr({ text: message });
            }
          } else if (chart.customMessage) {
            chart.customMessage.destroy();
            chart.customMessage = null;
          }
        },
      },
    },
    title: {
      text: `${
        isRankingType === "Db Tools"
          ? "Db Tools Metrics Over Time"
          : "Database Metrics Over Time"
      }`,
      style: { fontSize: "26px", fontWeight: "600" },
    },
    yAxis: { title: null },
    xAxis: {
      categories:
        chartData.length > 0
          ? getXAxisCategories(selectedDate, metriceType)
          : [],
    },
    tooltip: {
      formatter: function () {
        if (this.y === null) return `<b>${this.series.name}</b><br/>No data`;
        const roundedValue = this.y.toFixed(2);
        return `<b>${this.series.name}</b><br/>${this.x}: ${roundedValue}`;
      },
    },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      labelFormatter: function () {
        const maxLength = 13;
        const name = this.name || "";
        return name.length > maxLength
          ? name.substring(0, maxLength) + "..."
          : name;
      },
    },
    series: chartData.map((db, i) => ({
      name: db.databaseName,
      data: db.metrics.map((metric) => metric.ui_popularity.totalScore),
      visible: enabledDatabases[i] ?? false,
      showInLegend: i >= dbIndexRange[0] && i < dbIndexRange[1],
    })),
    plotOptions: {
      series: {
        events: {
          legendItemClick: handleLegendItemClick,
        },
      },
    },
    credits: false,
    exporting: {
      buttons: {
        contextButton: {
          menuItems: [
            "printChart",
            "separator",
            "downloadCSV",
            "separator",
            {
              text: "Download JSON",
              onclick: function () {
                const categories = this.xAxis[0].categories || []; // Get x-axis categories if available

                const chartData = this.series.map((series) => ({
                  name: series.name,
                  data: series.data.map((point, index) => ({
                    date: categories[index] || point.x,
                    metriceType, // Use categories if available, otherwise fallback to x
                    value: point.y,
                  })),
                }));

                const jsonString = JSON.stringify(chartData, null, 2);

                const blob = new Blob([jsonString], {
                  type: "application/json",
                });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "chart-data.json";
                link.click();
              },
            },
          ],
        },
      },
    },
  };

  const totalDBs = metricsData.length;
  const totalLaps = Math.ceil(totalDBs / CHUNK_SIZE);

  const next10Databases = () => {
    if (dbIndexRange[1] >= totalDBs) {
      setDbIndexRange([0, CHUNK_SIZE]);
    } else {
      setDbIndexRange([
        dbIndexRange[0] + CHUNK_SIZE,
        dbIndexRange[1] + CHUNK_SIZE,
      ]);
    }
  };

  const prev10Databases = () => {
    if (dbIndexRange[0] <= 0) {
      const lastStart = (totalLaps - 1) * CHUNK_SIZE;
      setDbIndexRange([lastStart, lastStart + CHUNK_SIZE]);
    } else {
      setDbIndexRange([
        dbIndexRange[0] - CHUNK_SIZE,
        dbIndexRange[1] - CHUNK_SIZE,
      ]);
    }
  };

  const next50Databases = () => {
    const jump = CHUNK_SIZE * 3;
    const totalDBs = metricsData.length;
    const totalLaps = Math.ceil(totalDBs / CHUNK_SIZE);

    let newStart = dbIndexRange[0] + jump;
    let newEnd = dbIndexRange[1] + jump;
    if (newEnd >= totalDBs) {
      newStart = 0;
      newEnd = CHUNK_SIZE;
    }

    setDbIndexRange([newStart, newEnd]);
  };

  const prev50Databases = () => {
    const jump = CHUNK_SIZE * 3;
    const totalDBs = metricsData.length;
    const totalLaps = Math.ceil(totalDBs / CHUNK_SIZE);

    let newStart = dbIndexRange[0] - jump;
    let newEnd = dbIndexRange[1] - jump;

    if (newStart < 0) {
      const lastStart = (totalLaps - 1) * CHUNK_SIZE;
      newStart = lastStart;
      newEnd = lastStart + CHUNK_SIZE;
    }

    setDbIndexRange([newStart, newEnd]);
  };

  const currentLap = Math.floor(dbIndexRange[0] / CHUNK_SIZE) + 1;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full">
        <LeaderboardFilter
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          setSelectedMetricKeys={setSelectedMetricKeys}
          selectedMetricKeys={selectedMetricKeys}
          metriceType={metriceType}
          setMetricType={setMetricType}
        />

        <div className="relative w-full">
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            style={{ borderRadius: "24px", border: "1px solid #D9D9D9" }}
          />

          <div className="left-0 absolute bottom-4 mb-1">
            <img
              src="/assets/icons/whiteLeftArrow.svg"
              alt="arrow"
              className="w-8 h-8 bg-[#3E53D7] p-[7px] rounded-full ml-6 mb-3 cursor-pointer hover:opacity-70  active:translate-y-[1px] active:shadow-[0_0_15px_5px_rgba(62,83,215,0.4)] transition-all duration-100"
              onClick={prev10Databases}
              onDoubleClick={prev50Databases}
            />
          </div>

          <div className="mb-4 absolute bottom-4 right-0 flex items-center mr-6">
            <span className="mr-2 font-semibold text-lg">
              {currentLap}/{totalLaps}
            </span>
            <img
              src="/assets/icons/whiteRightArrow.svg"
              alt="arrow"
              className="
              w-8 h-8 
              bg-[#3E53D7] 
              p-[7px] 
              rounded-full 
              cursor-pointer 
              hover:opacity-70 
              active:translate-y-[1px] 
              active:shadow-[0_0_15px_5px_rgba(62,83,215,0.4)] 
              transition-all 
              duration-100
            "
              onClick={next10Databases}
              onDoubleClick={next50Databases}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBChart;
