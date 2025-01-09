"use client";

import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchMetricsData } from "@/utils/databaseUtils";
import LeaderboardFilter from "../leaderboardFilter";
import { formatDate, isDateInRange } from "@/utils/formatDateAndTime";
import { calculateChartWeightedValue } from "@/utils/chartValueWithFormula";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

const DBChart = ({ previousDays }) => {
  const [selectedDate, setSelectedDate] = useState([null, null]);
  const [selectedMetricKeys, setSelectedMetricKeys] = useState([]);
  const [metricsData, setMetricsData] = useState([]);
  const [dbIndexRange, setDbIndexRange] = useState([0, 5]);
  const [enabledDatabases, setEnabledDatabases] = useState([]);
  const CHUNK_SIZE = 5;

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
                .css({
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "red",
                })
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

  const next5Databases = () => {
    if (dbIndexRange[1] >= metricsData.length) return;
    setDbIndexRange([
      dbIndexRange[0] + CHUNK_SIZE,
      dbIndexRange[1] + CHUNK_SIZE,
    ]);
  };

  const prev5Databases = () => {
    if (dbIndexRange[0] <= 0) return;
    setDbIndexRange([
      dbIndexRange[0] - CHUNK_SIZE,
      dbIndexRange[1] - CHUNK_SIZE,
    ]);
  };

  const totalDBs = metricsData.length;
  const totalLaps = Math.ceil(totalDBs / CHUNK_SIZE);
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

          <div className="left-0 mb-4 absolute bottom-4">
            <CaretLeftOutlined
              onClick={prev5Databases}
              disabled={dbIndexRange[0] <= 0}
              className="ml-6"
              style={{ fontSize: "20px", cursor: "pointer" }}
            />
          </div>

          <div className="mb-4 absolute bottom-4 right-0 flex items-center mr-6">
            <span className="mr-2 font-semibold text-lg">
              {currentLap}/{totalLaps}
            </span>
            <CaretRightOutlined
              onClick={next5Databases}
              disabled={dbIndexRange[1] >= totalDBs}
              style={{ fontSize: "20px", cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBChart;
