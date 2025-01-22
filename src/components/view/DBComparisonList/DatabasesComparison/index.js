"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import SearchBar from "@/components/shared/SearchInput";
import CommonButton from "@/components/shared/Button";
import { fetchDatabases } from "@/utils/databaseUtils";
import { Button, Empty, Spin, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

const DataBasesComparisons = () => {
  const router = useRouter();
  const { list } = useParams();
  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dbData, setDbData] = useState([]);

  // Fetch and load database data with loading state handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchDatabases();
        setDbData(result.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Decode 'list' query parameter to set selectedDatabases state
  const decodedDb = list ? decodeURIComponent(list) : "";
  const decodedDbArray = decodedDb ? decodedDb.split("-") : [];

  useEffect(() => {
    if (decodedDbArray.length > 0) {
      setSelectedDatabases(decodedDbArray);
    }
  }, []);

  // Filter database options based on search term
  const filteredOptions = dbData.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle database selection with a limit of 5 and validation logic
  const handleDatabaseClick = (option) => {
    const cleanedSelectedDatabases = selectedDatabases.filter(
      (db) => db !== "list"
    );

    if (
      cleanedSelectedDatabases.length >= 10 &&
      !cleanedSelectedDatabases.includes(option.name)
    ) {
      toast.error("You can select only up to 10 databases.");
    } else {
      setSelectedDatabases((prevSelected) => {
        const newSelected = prevSelected.includes(option.name)
          ? prevSelected.filter((db) => db !== option.name)
          : [...prevSelected, option.name];

        return newSelected.filter((db) => db !== "list");
      });
    }
  };

  // Trigger navigation for database comparison with validation
  const handleCompareClick = () => {
    if (selectedDatabases.includes("list") || selectedDatabases.length === 0) {
      toast.error("Please select at least one database to compare");
    } else {
      router.push(
        `/db-comparison/${encodeURIComponent(selectedDatabases.join("-"))}`
      );
    }
  };

  return (
    <div className="database-comparison w-full container flex md:mt-8 flex-col gap-10">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex md:flex-row flex-col md:justify-end justify-center md:items-end items-center ">
        <CommonButton
          style={{
            width: "280px",
            fontSize: "16px",
            border: "1px solid #D9D9D9",
            height: "60px",
            background:
              selectedDatabases.includes("list") ||
              selectedDatabases.length === 0
                ? "grey"
                : "#3E53D7",
            color: "white",
            borderRadius: "16px",
          }}
          onClick={handleCompareClick}
          disabled={
            selectedDatabases.includes("list") || selectedDatabases.length === 0
          }
        >
          COMPARE
        </CommonButton>
      </div>
      {isLoading ? (
        <div className="w-full flex justify-center items-center h-32">
          {" "}
          <Spin indicator={<LoadingOutlined style={{ fontSize: 90 }} spin />} />
        </div>
      ) : filteredOptions?.length === 0 ? (
        <div className="grid-cols-1 w-full flex justify-center items-center h-32">
          <Empty description="No database" />
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 sm:grid-cols-2  xl:grid-cols-5  md:grid-cols-3 gap-4 p-2">
          <>
            {filteredOptions
              .sort((a, b) => a?.name?.localeCompare(b.name))
              .map((option, index) => (
                <Tooltip key={option.name} title={option.name} placement="top">
                  <Button
                    key={option.name}
                    className={`relative w-full font-semibold text-[15px] h-[60px] bg-transparent rounded-[16px] 
                      flex items-center justify-center border-2 
                      ${
                        selectedDatabases.includes(option.name)
                          ? "border-[#3E53D7] text-[#3E53D7] border-[3px]"
                          : "border-blue-300 text-black"
                      } ${
                      index % 2 === 0
                        ? "bg-gradient-to-r from-cyan-50 to-sky-100"
                        : "bg-gradient-to-r from-blue-50 to-blue-200"
                    }`}
                    onClick={() => handleDatabaseClick(option)}
                  >
                    <div
                      className={`absolute top-[20px] left-2 p-[2px] ${
                        selectedDatabases.includes(option?.name)
                          ? "border-[#3E53D7] border"
                          : "border-gray-300 bg-white border"
                      }  rounded-full`}
                    >
                      <div
                        className={`h-[10px] w-[10px]  rounded-full ${
                          selectedDatabases.includes(option?.name)
                            ? "bg-[#3E53D7]"
                            : "bg-white"
                        } `}
                      />
                    </div>
                    <span
                      className="truncate capitalize ml-4"
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {option.name}
                    </span>
                  </Button>
                </Tooltip>
              ))}
          </>
        </div>
      )}
    </div>
  );
};

export default DataBasesComparisons;
