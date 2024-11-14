"use client";
import React, { useState } from "react";
import ContentSection from "@/components/shared/ContentSection/page";
import CommonButton from "@/components/shared/Button";
import SearchBar from "@/components/shared/searchInput";
import { useRouter } from "next/navigation"; // Import useRouter hook from next/router

export default function Page() {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDatabases, setSelectedDatabases] = useState([]); // To track selected databases
  const router = useRouter(); // To programmatically navigate

  const databaseOptions = [
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "SQLite",
    "Oracle DB",
    "Cassandra",
    "MariaDB",
    "Microsoft SQL Server",
    "Elasticsearch",
  ];

  const filteredOptions = databaseOptions.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDatabaseClick = (option) => {
    setSelectedDatabases((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((db) => db !== option)
        : [...prevSelected, option]
    );
  };

  const handleCompareClick = () => {
    if (selectedDatabases.length > 0) {
      const newDbQuery = encodeURIComponent(selectedDatabases.join("-"));

      router.push(`/db-comparison/${newDbQuery}`);
    }
  };

  return (
    <div>
      <ContentSection
        heading1="Database management systems"
        heading2="Offer Technology"
        paragraph1="The DB-Engines Ranking is a monthly updated list that evaluates and ranks database management systems based on their popularity. By tracking various metrics such as search engine queries, job postings, and discussions across technical forums, DB-Engines provides a comprehensive view of how different database systems are being used and perceived globally. This ranking serves as a valuable resource for anyone looking to understand trends in database technology and the current demand for various DBMS platforms."
        paragraph2="The DB-Engines Ranking is a monthly updated list that evaluates and ranks database management systems based on their popularity. By tracking various metrics such as search engine queries, job postings, and discussions across forums."
        imageAlt="blue line"
      >
        <div className="w-full md:px-20 flex flex-col gap-10">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <div className="grid w-full grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-4 p-2">
            {filteredOptions.map((option, index) => (
              <div key={index}>
                <CommonButton
                  style={{
                    width: "100%",
                    fontWeight: "600",
                    fontSize: "16px",
                    border: selectedDatabases.includes(option)
                      ? "1px solid #3E53D7"
                      : "1px solid #D9D9D9",
                    height: "60px",
                    // background: selectedDatabases.includes(option)
                    //   ? "#3E53D7"
                    //   : "transparent",
                    background: "transparent",

                    borderRadius: "16px",
                  }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={() => handleDatabaseClick(option)}
                >
                  {option}
                </CommonButton>
              </div>
            ))}
          </div>

          <div className="flex justify-end items-end">
            <CommonButton
              style={{
                width: "280px",
                fontSize: "16px",
                border: "1px solid #D9D9D9",
                height: "60px",
                background: "#3E53D7",
                color: "white",
                borderRadius: "16px",
              }}
              onClick={handleCompareClick}
              disabled={selectedDatabases.length === 0}
            >
              Compare
            </CommonButton>
          </div>
        </div>
      </ContentSection>
    </div>
  );
}
