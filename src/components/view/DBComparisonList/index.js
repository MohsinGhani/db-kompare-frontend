"use client";

import React, { useState, useEffect } from "react";
import ContentSection from "@/components/shared/ContentSection/page";
import { Segmented, Tooltip } from "antd";
import DataBasesComparisons from "./DatabasesComparison";
import { useSearchParams } from "next/navigation";
import DBToolComparison from "./DbToolsComparison";
import { useRouter } from "next/navigation";
import { InfoCircleOutlined } from "@ant-design/icons";

const ComparisonDbListPage = () => {
  const [selectedSegment, setSelectedSegment] = useState(
    "Databases Comparison"
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "DBToolsComparison") {
      setSelectedSegment("DB Tools Comparison");
    } else {
      setSelectedSegment("Databases Comparison");
    }
  }, [searchParams]);

  const handleSegmentChange = (value) => {
    setSelectedSegment(value);

    if (value === "Databases Comparison") {
      router.push("/db-comparisons/list/options?tab=DatabasesComparison");
    } else {
      router.push("/db-comparisons/list/options?tab=DBToolsComparison");
    }
  };

  return (
    <ContentSection
      heading1="Database management systems"
      paragraph1="The DB-Kompare Ranking is a monthly updated list that evaluates and ranks database management systems based on their popularity. By tracking various metrics such as search engine queries, job postings, and discussions across technical forums, DB-Kompare provides a comprehensive view of how different database systems are being used and perceived globally."
      imageAlt="blue line"
    >
      <div className="w-full">
        <div className="flex items-center justify-center">
          <Segmented
            options={["Databases Comparison", "DB Tools Comparison"]}
            value={selectedSegment}
            onChange={handleSegmentChange}
            className="-mt-8 mb-10 lg:mb-0 segmented-custom"
          />
        </div>
      </div>
      <div className="md:w-3/5 text-center md:mt-12">
        <div className="flex items-center justify-center">
          <h1 className="md:text-5xl text-2xl font-bold mb-4 mr-3">
            Offer Technology
          </h1>
          {/* <Tooltip
            title={
              <div>
                <ul className="">
                  <li className="mb-1">
                    Category: Filter tools by category using the dropdown
                  </li>
                  <li className="mb-1">
                    Core Features: Filter tools based on features using the
                    dropdown
                  </li>
                  <li className="mb-1">
                    Name: Use the search bar to search for tools by name
                  </li>
                  <li>
                    Filters: Apply various filters such as version control,
                    access control, etc.
                  </li>
                </ul>
              </div>
            }
          >
            <InfoCircleOutlined
              style={{
                fontSize: "30px",
                color: "#3E53D7",
                marginBottom: "5px",
                cursor: "pointer",
              }}
            />
          </Tooltip> */}
        </div>
        <p className="md:text-base text-sm font-normal mb-3 text-secondary text-center">
          {selectedSegment === "Databases Comparison"
            ? "The DB-Kompare Ranking is a DAILY updated list that evaluates and ranks database management systems based on their popularity."
            : "The DBTools-Kompare Ranking is a DAILY updated list that evaluates and ranks database management systems based on their popularity."}
        </p>
      </div>

      {selectedSegment === "Databases Comparison" ? (
        <DataBasesComparisons />
      ) : (
        <DBToolComparison />
      )}
    </ContentSection>
  );
};

export default ComparisonDbListPage;
