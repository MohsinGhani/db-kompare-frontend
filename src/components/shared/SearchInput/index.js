import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = ({ searchTerm, setSearchTerm, onSearch, isTabSelected }) => {
  return (
    <div className="relative">
      <Input
        placeholder={`${
          isTabSelected === "Db Tools"
            ? "Search db tool by name"
            : "Search database"
        }`}
        className="pr-10 py-2 rounded-md border border-[#D9D9D9] w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onPressEnter={() => onSearch(searchTerm)}
      />
      <div className="absolute inset-y-0 right-0 flex items-center border border-[#D9D9D9] rounded-md p-2 w-10 justify-center">
        <SearchOutlined className="text-[#D9D9D9]" />
      </div>
    </div>
  );
};

export default SearchBar;
