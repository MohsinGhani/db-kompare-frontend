"use client";

import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchMetricsData } from "@/utils/databaseUtils";
import LeaderboardFilter from "../leaderboardFilter";
import { formatDate, isDateInRange } from "@/utils/formatDateAndTime";
import { calculateChartWeightedValue } from "@/utils/chartValueWithFormula";

const DBChart = ({ previousDays }) => {
  const CHUNK_SIZE = 10;
  const [selectedDate, setSelectedDate] = useState([null, null]);
  const [selectedMetricKeys, setSelectedMetricKeys] = useState([]);
  const [metricsData, setMetricsData] = useState([]);
  const [dbIndexRange, setDbIndexRange] = useState([0, CHUNK_SIZE]);
  const [enabledDatabases, setEnabledDatabases] = useState([]);

  useEffect(() => {
    if (selectedMetricKeys.length === 0 || selectedMetricKeys.length === 4) {
      setSelectedMetricKeys(["totalScore"]);
    }
  }, [selectedMetricKeys]);

  useEffect(() => {
    const fetchData = async () => {
      const startDate = formatDate(selectedDate[0]) || "2024-11-18";
      const endDate = formatDate(selectedDate[1]) || previousDays[0];
      const data = await fetchMetricsData(startDate, endDate);
      setMetricsData(data.data || []);
    };
    fetchData();
  }, [selectedDate, previousDays]);

  useEffect(() => {
    if (metricsData && metricsData.length > 0) {
      const defaultEnabled = metricsData.map((_, i) => i < CHUNK_SIZE);
      setEnabledDatabases(defaultEnabled);
    }
  }, [metricsData]);

  const getXAxisCategories = (dateRange) => {
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

  const getMetricData = (metricKeys, dateRange) => {
    const allDatesInRange = getXAxisCategories(dateRange);
    return metricsData.map((db) => ({
      databaseName: db.databaseName,
      data: allDatesInRange.map((date) => {
        const matchingMetric = db.metrics.find(
          (metric) => metric.date === date
        );
        if (!matchingMetric) return null;
        return calculateChartWeightedValue(matchingMetric, metricKeys);
      }),
    }));
  };

  const chartData = getMetricData(selectedMetricKeys, selectedDate);

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
        load() {
          this.showLoading();
        },
        render() {
          if (chartData.every((db) => db.data.length === 0)) {
            const errorMessage = "No data available";
            if (this.errorMessage) {
              this.errorMessage = this.renderer
                .text(errorMessage, 0, 0)
                .css({ fontSize: "20px", fontWeight: "bold", color: "red" })
                .add();
              const textWidth = this.errorMessage.getBBox().width;
              const textHeight = this.errorMessage.getBBox().height;
              const xPosition = (this.chartWidth - textWidth) / 2;
              const yPosition = (this.chartHeight + textHeight) / 2;
              this.errorMessage.attr({ x: xPosition, y: yPosition });
            }
          } else {
            if (this.errorMessage) {
              this.errorMessage.destroy();
              this.errorMessage = null;
            }
            this.hideLoading();
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
      categories: chartData.length > 0 ? getXAxisCategories(selectedDate) : [],
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
      // Wrap-around: go to first lap
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
        />

        <div className="relative w-full">
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            style={{ borderRadius: "24px", border: "1px solid #D9D9D9" }}
          />

          <div className="left-0 absolute bottom-4">
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
