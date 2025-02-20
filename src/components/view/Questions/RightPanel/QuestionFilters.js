"use client";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { Dropdown, Input, Space } from "antd";
import React from "react";
const { Search } = Input;
const items = [
  {
    label: "1st menu item",
    key: "1",
  },
  {
    label: "2nd menu item",
    key: "2",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];
const QuestionFilters = () => {
  return (
    <div className="flex items-center gap-2 mt-6 flex-wrap">
      <Space.Compact className="w-[60%]">
        <Search placeholder="Search by questions and companies" allowClear />
      </Space.Compact>
      <Dropdown menu={{ items }} trigger={["click"]} className="h-8 px-2">
        <Space
          align="center"
          className="border text-[#191A15CC] font-normal  rounded-md"
        >
          <p>Select Category</p>
          <DownOutlined className="mt-2" />
        </Space>
      </Dropdown>
      <Dropdown menu={{ items }} trigger={["click"]} className="h-8 px-2">
        <Space
          align="center"
          className="border text-[#191A15CC] font-normal  rounded-md"
        >
          <p>Select Difficulty</p>
          <DownOutlined className="mt-2" />
        </Space>
      </Dropdown>
      <Dropdown menu={{ items }} trigger={["click"]} className="h-8 px-2">
        <Space
          align="center"
          className="border text-[#191A15CC] font-normal  rounded-md"
        >
          <p>Select Status</p>
          <DownOutlined className="mt-2" />
        </Space>
      </Dropdown>
    </div>
  );
};

export default QuestionFilters;
