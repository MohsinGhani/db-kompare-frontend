"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContentSection from "@/components/shared/ContentSection/page";
import SearchBar from "@/components/shared/SearchInput";
import CommonButton from "@/components/shared/Button";
import CommonTypography from "@/components/shared/Typography";
import { fetchDatabases } from "@/utils/databaseUtils";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Comments from "@/components/Comments";

export default function Page({ params }) {
  const router = useRouter();
  const { list } = params;

  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
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
      setErrorMessage("You can select only up to 5 databases.");
    } else {
      setErrorMessage("");
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
      setErrorMessage("Please select at least one database to compare");
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
      <div className="w-full md:px-20 flex md:mt-8 flex-col gap-10">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {isLoading ? (
          <div className="w-full flex justify-center items-center h-32">
            {" "}
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 90 }} spin />}
            />
          </div>
        ) : (
          <div className="grid w-full grid-cols-1  sm:grid-cols-2  xl:grid-cols-5  md:grid-cols-3 gap-4 p-2">
            <>
              {filteredOptions.map((option, index) => (
                <CommonButton
                  key={option.name}
                  style={{
                    width: "100%",
                    fontWeight: "600",
                    fontSize: "16px",
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
                  }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={() => handleDatabaseClick(option)}
                >
                  {option.name}
                </CommonButton>
              ))}
            </>
          </div>
        )}

        <div
          className="flex md:flex-row flex-col md:justify-between justify-center md:items-end  items-center "
          style={{ justifyContent: errorMessage ? "space-between" : "end" }}
        >
          {errorMessage && (
            <CommonTypography type="text" classes="text-red-500 text-xl mt-2">
              {errorMessage}
            </CommonTypography>
          )}
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
          >
            Compare
          </CommonButton>
        </div>
      </div>
      <Comments />
    </ContentSection>
  );
}
