"use client";

import { Card, Radio } from "antd";
import React from "react";
import CommonTypography from "../Typography";
import { filterOptions } from "@/utils/const";

const FiltersComponent = ({
  isSmallDevice = false,
  selectedFilters,
  onChange,
  disabled,
}) => {
  const handleFilterChange = (category, value) => {
    if (onChange && typeof onChange === "function") {
      onChange(category, value);
    }
  };

  return (
    <Card
      className={`w-full bg-white rounded-xl border shadow-md min-h-[350px] ${
        isSmallDevice
          ? "border-none shadow-none p-0 h-full"
          : "p-5 min-h-[725px]"
      }`}
    >
      <div className="flex flex-col gap-4">
        {Object.keys(filterOptions).map((category, index) => (
          <div key={index}>
            <CommonTypography className="font-medium text-base capitalize">
              {category.replace(/([A-Z])/g, " $1")}:{" "}
            </CommonTypography>
            <Radio.Group
              value={selectedFilters[category]}
              onChange={(e) => handleFilterChange(category, e.target.value)}
              className="flex flex-col gap-2 mt-1"
              disabled={disabled}
            >
              {filterOptions[category].map((option, optionIndex) => (
                <Radio
                  key={optionIndex}
                  value={option.value}
                  className="text-black opacity-85 text-sm mt-1"
                >
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FiltersComponent;
