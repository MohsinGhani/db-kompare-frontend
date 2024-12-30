"use client";

import { Card, Radio } from "antd";
import React, { useState } from "react";
import CommonTypography from "../Typography";
import { filterOptions } from "@/utils/const";

const FiltersComponent = ({ isSmallDevice = false }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    freeEdition: "All",
    erDiagram: "All",
    runsOn: "Linux",
    forwardEngineering: "All",
    synchronization: "All",
  });

  const handleFilterChange = (category, value) => {
    setSelectedFilters((prev) => ({ ...prev, [category]: value }));
    console.log("Selected Filters:", { ...selectedFilters, [category]: value });
  };

  return (
    <Card
      className={`w-full bg-white rounded-xl border shadow-md ${
        isSmallDevice
          ? "border-none shadow-none p-0 h-full"
          : "p-5 min-h-[725px]"
      }`}
    >
      <div className="flex flex-col gap-6">
        {Object.keys(filterOptions).map((category, index) => (
          <div key={index}>
            <CommonTypography className="font-medium text-base capitalize">
              {category.replace(/([A-Z])/g, " $1")}:{" "}
            </CommonTypography>
            <Radio.Group
              value={selectedFilters[category]}
              onChange={(e) => handleFilterChange(category, e.target.value)}
              className="flex flex-col gap-[12px] mt-1"
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
