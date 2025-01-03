"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import ContentSection from "@/components/shared/ContentSection/page";
import SearchBar from "@/components/shared/SearchInput";
import CommonButton from "@/components/shared/Button";
import { fetchDatabases } from "@/utils/databaseUtils";
import { Button, Spin, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

export default function Page({ params }) {
  const router = useRouter();
  const { list } = params;

  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
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
      cleanedSelectedDatabases.length >= 5 &&
      !cleanedSelectedDatabases.includes(option.name)
    ) {
      toast.error("You can select only up to 5 databases.");
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
    <ContentSection
      heading1="Database management systems"
      heading2="Offer Technology"
      paragraph1="The DB-Kompare Ranking is a monthly updated list that evaluates and ranks database management systems based on their popularity. By tracking various metrics such as search engine queries, job postings, and discussions across technical forums, DB-Kompare provides a comprehensive view of how different database systems are being used and perceived globally."
      paragraph2="The DB-Kompare Ranking is a monthly updated list that evaluates and ranks database management systems based on their popularity."
      imageAlt="blue line"
    >
      <div className="w-full container flex md:mt-8 flex-col gap-10">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {isLoading ? (
          <div className="w-full flex justify-center items-center h-32">
            {" "}
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 90 }} spin />}
            />
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 sm:grid-cols-2  xl:grid-cols-5  md:grid-cols-3 gap-4 p-2">
            <>
              {filteredOptions
                .sort((a, b) => a?.name?.localeCompare(b.name))
                .map((option, index) => (
                  <Tooltip
                    key={option.name}
                    title={option.name}
                    placement="top"
                  >
                    <Button
                      key={option.name}
                      style={{
                        width: "100%",
                        fontWeight: "600",
                        fontSize: "15px",
                        border:
                          selectedDatabases.includes(option.name) ||
                          hoverIndex === index
                            ? "2px solid #3E53D7"
                            : "2px solid #D9D9D9",
                        height: "60px",
                        background: "transparent",
                        color:
                          selectedDatabases.includes(option.name) ||
                          hoverIndex === index
                            ? "#3E53D7"
                            : "black",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                      onClick={() => handleDatabaseClick(option)}
                    >
                      <span
                        className="truncate"
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
              selectedDatabases.includes("list") ||
              selectedDatabases.length === 0
            }
          >
            Compare
          </CommonButton>
        </div>
      </div>
    </ContentSection>
  );
}
