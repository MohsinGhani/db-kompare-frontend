"use client";

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge";
import { Divider } from "antd";

// Load Highcharts modules properly
if (typeof Highcharts === "object") {
  HighchartsMore(Highcharts);
  SolidGauge(Highcharts);
}

// const RADIUS = {
//   EASY: {
//     OUTER: "115%",
//     INNER: "100%",
//   },
//   MEDIUM: {
//     OUTER: "95%",
//     INNER: "80%",
//   },
//   HARD: {
//     OUTER: "65%",
//     INNER: "55%",
//   },
// };
const RADIUS = {
  EASY: {
    OUTER: "120%",
    INNER: "105%",
  },
  MEDIUM: {
    OUTER: "100%",
    INNER: "85%",
  },
  HARD: {
    OUTER: "80%",
    INNER: "65%",
  },
};

const stats = [
  {
    name: "Easy",
    color: "#17A44B",
    count: {
      completed: 12,
      all: 78,
    },
  },
  {
    name: "Medium",
    color: "#DA8607",
    count: {
      completed: 22,
      all: 53,
    },
  },
  {
    name: "Hard",
    color: "#DE3D28",
    count: {
      completed: 52,
      all: 78,
    },
  },
];

const ProgressChart = () => {
  const chartOptions = {
    chart: {
      type: "solidgauge",
      height: "120%",
    },
    title: {
      text: "<p style='font-weight:400; color:#191A15; font-size:14px;'>Completed</p><br><p style='font-weight:700; font-size: 2em'>65%</p>",
      style: {
        fontSize: "16px",
        color: "#000", // Black text
      },
      verticalAlign: "middle",
      y: 10,
      align: "center",
    },
    // Disable tooltip
    tooltip: {
      enabled: false,
      borderWidth: 0,
      backgroundColor: "none",
      shadow: false,
      style: {
        fontSize: "16px",
      },
      valueSuffix: "%",
      pointFormat:
        "{series.name}<br>" +
        '<span style="font-size: 1em; color: {point.color}; ' +
        'font-weight: bold">{point.y}</span>',
      positioner: function (labelWidth) {
        return {
          x: (this.chart.chartWidth - labelWidth) / 2,
          y: this.chart.plotHeight / 2 + 1,
        };
      },
    },
    pane: {
      startAngle: 0,
      endAngle: 360,
      center: ["50%", "50%"],
      background: [
        {
          outerRadius: RADIUS.EASY.OUTER,
          innerRadius: RADIUS.EASY.INNER,
          backgroundColor: "#eee",
          borderWidth: 0,
        },
        {
          outerRadius: RADIUS.MEDIUM.OUTER,
          innerRadius: RADIUS.MEDIUM.INNER,
          backgroundColor: "#eee",
          borderWidth: 0,
        },
        {
          outerRadius: "80%",
          innerRadius: "65%",
          backgroundColor: "#eee",
          borderWidth: 0,
        },
      ],
    },
    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: [],
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false,
        },
        linecap: "round",
        stickyTracking: false,
        rounded: true, // Rounded edges
      },
    },
    series: [
      {
        // Outer ring (Green)
        name: "Easy",
        data: [
          {
            y: 65,
            color: "#17A44B", // Green
          },
        ],
        innerRadius: RADIUS.EASY.INNER,
        radius: RADIUS.EASY.OUTER,
      },
      {
        name: "Medium",
        data: [
          {
            y: 50,
            color: "#DA8607",
          },
        ],
        innerRadius: RADIUS.MEDIUM.INNER,
        radius: RADIUS.MEDIUM.OUTER,
      },
      {
        name: "Hard",
        data: [
          {
            y: 40,
            color: "#DE3D28",
          },
        ],
        innerRadius: RADIUS.HARD.INNER,
        radius: RADIUS.HARD.OUTER,
      },
    ],
    credits: {
      enabled: false,
    },
    exporting: false,
  };

  return (
    <div className=" w-full">
      <p className="text-2xl font-bold text-left">Your Progress</p>
      <div className="w-full overflow-hidden ">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
      <div className="flex flex-col md:flex-row gap-2 justify-center text-right">
        {stats?.map((item, ind) => (
          <div
            key={ind}
            className="flex items-center text-xs font-medium gap-1"
          >
            <div
              style={{ backgroundColor: item.color }}
              className="h-[8px] w-[8px] rounded-full"
            ></div>
            <p>{item.name}</p>
            <p>
              {item.count.completed}/{item.count.all}
            </p>

            {/* Only add Divider if it's NOT the last item */}
            {ind !== stats.length - 1 && (
              <Divider
                type="vertical"
                className="!m-0 !w-[1px] h-[12px] bg-gray-300 hidden md:block"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;
