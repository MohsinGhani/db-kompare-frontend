"use client";
import React, { useState } from "react";
import ContentSection from "@/components/shared/ContentSection/page";
import { SearchOutlined } from "@ant-design/icons";
import CommonButton from "@/components/shared/Button";
import { Input } from "antd";
import Link from "next/link";

export default function Page() {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div>
      <ContentSection
        heading1="Database management systems"
        heading2="Offer Technology"
        paragraph1="The DB-Engines Ranking is a monthly updated list that evaluates and ranks database management systems based on their popularity. By tracking various metrics such as search engine queries, job postings, and discussions across technical forums, DB-Engines provides a comprehensive view of how different database systems are being used and perceived globally. This ranking serves as a valuable resource for anyone looking to understand trends in database technology and the current demand for various DBMS platforms."
        paragraph2="The DB-Engines Ranking is a monthly updated list that evaluates and ranks database management systems based on their popularity. By tracking various metrics such as search engine queries, job postings, and discussions across forums."
        imageAlt="blue line"
      >
        <div className="w-full md:px-20 flex flex-col gap-10 ">
          {/* Search Bar */}
          <div className="relative">
            <Input
              placeholder="Search database"
              className="pr-10 py-2 rounded-md border border-[#D9D9D9] w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={() => onSearch(searchTerm)}
            />
            <div className="absolute inset-y-0 -right-[2px] flex items-center border border-[#D9D9D9] rounded-md p-2 w-10 justify-center">
              <SearchOutlined className="text-[#D9D9D9]" />
            </div>
          </div>

          {/* Filtered Database Options */}
          <div className="grid w-full grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-4 p-2">
            {filteredOptions.map((option, index) => (
              <div key={index}>
                <Link
                  href={`/db-comparison/${option}
              `}
                  passHref
                >
                  <CommonButton
                    style={{
                      width: "100%",
                      fontWeight: "600",
                      fontSize: "16px",
                      border:
                        hoverIndex === index
                          ? "1px solid #3E53D7"
                          : "1px solid #D9D9D9",
                      height: "60px",
                      background: "hover:bg-blue-500",
                      background: "transparent",
                      borderRadius: "16px",
                    }}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    {option}
                  </CommonButton>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>
    </div>
  );
}
