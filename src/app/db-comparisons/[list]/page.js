"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContentSection from "@/components/shared/ContentSection/page";
import CommonButton from "@/components/shared/Button";
import SearchBar from "@/components/shared/searchInput";
import { DatabaseOptions } from "@/components/data/data";
import CommonTypography from "@/components/shared/Typography";
import { fetchDatabases } from "@/utils/databaseUtils";

export default function Page({ params }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [dbData, setDbData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDatabases();
        setDbData(result.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  const { list } = params;

  const decodedDb = list ? decodeURIComponent(list) : "";

  const decodedDbArray = decodedDb ? decodedDb.split("-") : [];

  useEffect(() => {
    if (decodedDbArray.length > 0) {
      setSelectedDatabases(decodedDbArray);
    }
  }, []);

  const filteredOptions = dbData.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDatabaseClick = (option) => {
    if (
      selectedDatabases.length >= 5 &&
      !selectedDatabases.includes(option.name)
    ) {
      setErrorMessage("You can select only up to 5 databases.");
    } else {
      setErrorMessage("");
      setSelectedDatabases((prevSelected) =>
        prevSelected.includes(option.name)
          ? prevSelected.filter((db) => db !== option.name)
          : [...prevSelected, option.name]
      );
    }
  };

  const handleCompareClick = () => {
    if (selectedDatabases.length) {
      router.push(
        `/db-comparison/${encodeURIComponent(selectedDatabases.join("-"))}`
      );
    }
  };

  return (
    <ContentSection
      heading1="Database management systems"
      heading2="Offer Technology"
      paragraph1="The DB-Engines Ranking is a monthly updated list that evaluates and ranks database management systems based on their popularity. By tracking various metrics such as search engine queries, job postings, and discussions across technical forums, DB-Engines provides a comprehensive view of how different database systems are being used and perceived globally."
      paragraph2="The DB-Engines Ranking is a monthly updated list that evaluates and ranks database management systems based on their popularity."
      imageAlt="blue line"
    >
      <div className="w-full md:px-20 flex flex-col gap-10">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="grid w-full grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-4 p-2">
          {filteredOptions.map((option, index) => (
            <CommonButton
              key={option.name}
              style={{
                width: "100%",
                fontWeight: "600",
                fontSize: "18px",
                border:
                  selectedDatabases.includes(option.name) ||
                  hoverIndex === index
                    ? "2px solid #3E53D7"
                    : "2px solid #D9D9D9",
                height: "60px",
                background: "transparent",
                borderRadius: "16px",
              }}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => handleDatabaseClick(option)}
            >
              {option.name}
            </CommonButton>
          ))}
        </div>

        <div
          className="flex justify-between items-end"
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
              background: selectedDatabases.length <= 0 ? "grey" : "#3E53D7",
              color: "white",
              borderRadius: "16px",
            }}
            onClick={handleCompareClick}
            disabled={!selectedDatabases.length}
          >
            Compare
          </CommonButton>
        </div>
      </div>
    </ContentSection>
  );
}
