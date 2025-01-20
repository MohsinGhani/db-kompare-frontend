"use client";

import React, { useEffect, useState } from "react";
import CommonTypography from "../shared/Typography";
import { DatePicker, Dropdown, Select } from "antd";
import { DropdownOptions } from "@/utils/const";
import { MoreOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

export default function LeaderboardFilter({
  selectedDate,
  setSelectedDate,
  selectedMetricKeys,
  setSelectedMetricKeys,
  metriceType,
  setMetricType,
}) {
  const [check, setCheck] = useState(false);

  // Add useEffect to manage 'check' state based on selected metrics
  useEffect(() => {
    if (
      selectedMetricKeys.length === 0 ||
      selectedMetricKeys.length === DropdownOptions.length
    ) {
      setCheck(true);
    }
  }, [selectedMetricKeys]);

  // Add handler for metric selection with logic for 'totalScore'

  const handleMetricChange = (value) => {
    setCheck(false);
    let allMetricKeys = DropdownOptions.map((option) => option.value);
    let newSelectedKeys = [...selectedMetricKeys];

    if (newSelectedKeys.includes("totalScore")) {
      let filteredMetricKeys = allMetricKeys.filter((key) => key !== value);
      setSelectedMetricKeys(filteredMetricKeys);
    } else {
      if (newSelectedKeys.includes(value)) {
        newSelectedKeys = newSelectedKeys.filter((key) => key !== value);
      } else {
        newSelectedKeys.push(value);
      }

      setSelectedMetricKeys(newSelectedKeys);
    }
  };

  // Add handler for updating selected date range

  const handleDateChange = (dates) => setSelectedDate(dates || [null, null]);
  const handleTypeChange = (value) => {
    setMetricType(value);
  };
  const items = [
    {
      value: "DAY",
      label: "Day",
    },
    {
      value: "WEEK",
      label: "Week",
    },
    {
      value: "MONTH",
      label: "Month",
    },
    {
      value: "YEAR",
      label: "Year",
    },
  ];

  return (
    <div className="md:flex p-6 justify-center gap-4 py-6 mb-4 lg:mt-24 border rounded-2xl flex-col border-[#D9D9D9]">
      <div className="flex justify-between">
        <CommonTypography type="text" classes="text-2xl font-bold">
          Filters
        </CommonTypography>
        <button
          className="text-primary text-base font-medium underline"
          onClick={() => {
            setSelectedDate([null, null]);
            setSelectedMetricKeys([]);
          }}
        >
          Clear filter
        </button>
      </div>
      <div className="md:flex justify-between gap-5">
        <div className="w-full">
          <CommonTypography type="text" classes="text-lg font-medium my-2">
            Resources
          </CommonTypography>
          <div className="flex flex-wrap md:gap-6 md:mt-3">
            {DropdownOptions.map((option, index) => (
              <div className="flex items-center mt-2" key={index}>
                <input
                  type="checkbox"
                  id={option.value}
                  checked={selectedMetricKeys.includes(option.value) || check}
                  onChange={() => handleMetricChange(option.value)}
                />
                <label
                  htmlFor={option.value}
                  className="mx-2 md:text-lg text-base font-medium text-black"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full ">
          <CommonTypography type="text" classes="text-lg font-medium my-2">
            Select Date (By default, it will show on daily basis)
          </CommonTypography>
          <div className="flex items-center justify-center mt-4 gap-2">
            <RangePicker
              className="w-full dateRange "
              value={selectedDate[0] && selectedDate[1] ? selectedDate : null}
              onChange={handleDateChange}
            />

            <Select
              className="w-full md:w-2/4"
              showSearch
              placeholder="Filter by week/month/year"
              options={items}
              onChange={handleTypeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
