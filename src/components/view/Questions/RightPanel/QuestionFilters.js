"use client";

import { Input, Space, Select } from "antd";
import React from "react";
import { TOPICS_CATEGORIES, DIFFICULTY, QUESTION_STATUS } from "@/utils/const";

const { Search } = Input;

// Convert object values into selectable items
const generateSelectItems = (data) =>
  Object.values(data).map((value) => ({
    label: value,
    value: value,
  }));

// Filter configuration for dynamic rendering

const QuestionFilters = ({ updateFilter, user }) => {
  const filterOptions = [
    {
      label: "Category",
      key: "category",
      items: generateSelectItems(TOPICS_CATEGORIES),
      visible: true,
    },
    {
      label: "Difficulty",
      key: "difficulty",
      items: generateSelectItems(DIFFICULTY),
      visible: true,
    },
    {
      label: "Status",
      key: "status",
      items: generateSelectItems(QUESTION_STATUS),
      visible: user ? true : false,
    },
  ].filter((item) => item?.visible === true);
  return (
    <div className="flex items-center gap-2 mt-3 md:mt-6 flex-wrap">
      {/* Search Bar */}
      <Space.Compact className="w-full md:w-[55%]">
        <Search
          placeholder="Search by questions and companies"
          allowClear
          onChange={(e) => updateFilter("searchTerm", e.target.value)}
        />
      </Space.Compact>

      {/* Multi-Select Filters */}
      {filterOptions.map((filter) => (
        <Select
          key={filter.key}
          placeholder={`Select ${filter.label}`}
          className="w-36"
          options={filter.items}
          onChange={(selectedValues) =>
            updateFilter(filter.key, selectedValues)
          }
          allowClear
        />
      ))}
    </div>
  );
};

export default QuestionFilters;
