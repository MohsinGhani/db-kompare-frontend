import React from "react";
import CommonTypography from "../shared/Typography";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

export default function LeaderboardFilter({
  selectedDate,
  setSelectedDate,
  selectedMetricKeys,
  setSelectedMetricKeys,
}) {
  const dropdownOptions = [
    { value: "github", label: "Github" },
    { value: "stackoverflowdata", label: "Stack Overflow" },
    { value: "google", label: "Google Search" },
    { value: "bing", label: "Bing Search" },
  ];
  const handleDateChange = (dates) => setSelectedDate(dates || [null, null]);

  const handleMetricChange = (value) => {
    if (value.length === 0 || value.length === dropdownOptions.length - 1) {
      setSelectedMetricKeys(["popularity"]);
    } else {
      const updatedKeys = value.includes("popularity")
        ? value.filter((v) => v !== "popularity")
        : value;
      setSelectedMetricKeys(updatedKeys);
    }
  };

  return (
    <div className="md:flex p-6 justify-center gap-4 py-6 mb-4 border rounded-2xl flex-col border-[#D9D9D9]">
      <div className="flex justify-between">
        <CommonTypography type="text" classes="text-2xl font-bold">
          Filters
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
        <div className="w-full">
          <CommonTypography type="text" classes="text-lg font-medium my-2">
            Database Resources
          </CommonTypography>
          <div className="flex flex-wrap md:gap-6 md:mt-3">
            {dropdownOptions.map((option, index) => (
              <div className="flex items-center mt-2" key={index}>
                <input
                  type="checkbox"
                  id={option.value}
                  checked={selectedMetricKeys.includes(option.value)}
                  onChange={(e) =>
                    handleMetricChange(
                      e.target.checked
                        ? [...selectedMetricKeys, option.value]
                        : selectedMetricKeys.filter(
                            (key) => key !== option.value
                          )
                    )
                  }
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
        <div className="w-full">
          <CommonTypography type="text" classes="text-lg font-medium my-2">
            Select Date
          </CommonTypography>
          <RangePicker
            className="w-full dateRange h-9 mt-3"
            value={selectedDate[0] && selectedDate[1] ? selectedDate : null}
            onChange={handleDateChange}
          />
        </div>
      </div>
    </div>
  );
}
