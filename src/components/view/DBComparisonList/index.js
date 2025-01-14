"use client";

import React, { useState, useEffect } from "react";
import ContentSection from "@/components/shared/ContentSection/page";
import { Segmented } from "antd";
import DataBasesComparisons from "./DatabasesComparison";
import { useSearchParams } from "next/navigation";
import DBToolComparison from "./DbToolsComparison";

const ComparisonDbListPage = () => {
  const [selectedSegment, setSelectedSegment] = useState(
    "Databases Comparison"
  );
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    console.log("tab", tab);
    if (tab === "DBToolsComparison") {
      setSelectedSegment("DB Tools Comparison");
    } else {
      setSelectedSegment("Databases Comparison");
    }
  }, [searchParams]);

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
            onChange={(value) => setSelectedSegment(value)}
            className="-mt-8 mb-20 lg:mb-0 segmented-custom"
          />
        </div>
      </div>
      <div className="md:w-3/5 text-center mt-12">
        <h1 className="md:text-5xl text-2xl font-bold mb-4">
          Offer Technology
        </h1>
        <p className="md:text-base text-sm font-normal mb-3 text-secondary text-center">
          The DB-Kompare Ranking is a monthly updated list that evaluates and
          ranks database management systems based on their popularity.
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
