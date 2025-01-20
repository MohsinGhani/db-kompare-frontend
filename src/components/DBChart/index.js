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

const DBChart = ({ previousDays, isRankingType }) => {
  const CHUNK_SIZE = 10;
  const [selectedDate, setSelectedDate] = useState([null, null]);
  const [selectedMetricKeys, setSelectedMetricKeys] = useState([]);
  const [metriceType, setMetricType] = useState(METRICES_TYPE.DAY);
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
      const startDate = formatDate(selectedDate[0]) || "2024-11-18";
      const endDate = formatDate(selectedDate[1]) || previousDays[0];

      if (isRankingType === "Db Tools") {
        try {
          setLoading(true);
          const data = await fetchDbToolsMetricsData(startDate, endDate);
          setMetricsData(data.data || []);
        } catch (error) {
          console.error("Error fetching db tools metrics data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        try {
          setLoading(true);
          const data = await fetchMetricsData(startDate, endDate);
          setMetricsData(data.data || []);
        } catch (error) {
          console.error("Error fetching databases metrics data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [selectedDate, previousDays]);

  useEffect(() => {
    if (metricsData && metricsData.length > 0) {
      const defaultEnabled = metricsData.map((_, i) => i < CHUNK_SIZE);
      setEnabledDatabases(defaultEnabled);
    }
  }, [metricsData]);
  const getXAxisCategories = (dateRange, type) => {
    if (type === METRICES_TYPE.WEEK) {
      return getWeeklyCategories(metricsData); // Get weekly formatted labels
    }

    const allMetrics = metricsData[0]?.metrics || [];
    const uniqueDates = new Set(
      allMetrics
        .filter((metric) =>
          isDateInRange(metric.date, dateRange[0], dateRange[1])
        )
        .map((metric) => metric.date)
    );
    return Array.from(uniqueDates);
  };

  const getMetricData = (metricKeys, dateRange, type = "") => {
    const allDatesInRange = getXAxisCategories(dateRange);

    if (type === METRICES_TYPE.DAY) {
      return metricsData.map((db) => ({
        databaseName:
          isRankingType === "Db Tools"
            ? db.dbToolName || "tool"
            : db.databaseName,
        data: allDatesInRange.map((date) => {
          const matchingMetric = db.metrics.find(
            (metric) => metric.date === date
          );
          if (!matchingMetric) return null;
          return calculateChartWeightedValue(matchingMetric, metricKeys);
        }),
      }));
    } else if (type === METRICES_TYPE.WEEK) {
      const allWeeksInRange = getWeeklyCategories(metricsData);

      return metricsData.map((db) => ({
        databaseName: db.databaseName || "Unknown Database",
        data: allWeeksInRange.map(({ startOfWeek, endOfWeek }) => {
          const weeklyMetrics = db.metrics.filter((metric) =>
            isDateInRange(metric.date, startOfWeek, endOfWeek)
          );

          if (weeklyMetrics.length === 0) return null;

          // Calculate sum and divide by 7 for weekly average
          const weeklySum = weeklyMetrics.reduce((sum, metric) => {
            return sum + calculateChartWeightedValue(metric, metricKeys);
          }, 0);

          return weeklySum / 7; // Average per day for the week
        }),
      }));
    } else {
      return metricsData.map((db) => ({
        databaseName:
          isRankingType === "Db Tools"
            ? db.dbToolName || "tool"
            : db.databaseName,
        data: allDatesInRange.map((date) => {
          const matchingMetric = db.metrics.find(
            (metric) => metric.date === date
          );
          if (!matchingMetric) return null;
          return calculateChartWeightedValue(matchingMetric, metricKeys);
        }),
      }));
    }
  };

  const getWeeklyCategories = (metricsData) => {
    if (!metricsData || metricsData.length === 0) {
      throw new Error("No metric data available to calculate weekly ranges.");
    }

    // Extract all available dates from the metricsData and sort them
    const allDates = metricsData
      .flatMap((db) => db.metrics.map((metric) => metric.date))
      .sort();

    if (allDates.length === 0) {
      throw new Error("No dates found in the provided metrics data.");
    }

    // Find the earliest and latest dates
    const startDate = new Date(allDates[0]); // Earliest date
    const endDate = new Date(allDates[allDates.length - 1]); // Latest date

    const weeks = [];
    let currentStart = new Date(startDate);

    // Ensure weeks start on Monday
    currentStart.setDate(currentStart.getDate() - currentStart.getDay() + 1);

    let weekNumber = 1;
    while (currentStart <= endDate) {
      let weekEnd = new Date(currentStart);
      weekEnd.setDate(currentStart.getDate() + 6); // End of the week (Sunday)

      if (weekEnd > endDate) {
        weekEnd = endDate; // Ensure last week doesn't exceed the available range
      }

      const monthYear = currentStart.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      const weekLabel = `${monthYear}-W${weekNumber}`;

      weeks.push({
        startOfWeek: currentStart.toISOString().split("T")[0],
        endOfWeek: weekEnd.toISOString().split("T")[0],
        label: weekLabel, // Add formatted label (e.g., Nov-2024-W1)
      });

      currentStart.setDate(currentStart.getDate() + 7); // Move to next Monday
      weekNumber++;
    }

    return weeks.map((week) => week.label); // Return only the week labels for xAxis
  };

  const chartData = getMetricData(
    selectedMetricKeys,
    selectedDate,
    metriceType
  );

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
      data: db.data,
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
              className="
      w-8 h-8 
      bg-[#3E53D7] 
      p-[7px] 
      rounded-full 
      ml-6 mb-3 
      cursor-pointer 
      hover:opacity-70 
      active:translate-y-[1px] 
      active:shadow-[0_0_15px_5px_rgba(62,83,215,0.4)] 
      transition-all 
      duration-100
    "
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
