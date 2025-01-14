"use client";

import React, { useState, useEffect } from "react";
import ContentSection from "@/components/shared/ContentSection/page";
import { getPreviousDates } from "@/utils/formatDateAndTime";
import DatabasesRanking from "./DatabasesRanking";
import { Segmented } from "antd";
import DbToolsRanking from "./DbToolsRanking";

export default function LeaderBoardPage() {
  const [previousDays, setPreviousDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState("Databases Ranking");

  // Fetch previousDays asynchronously
  useEffect(() => {
    const fetchPreviousDays = async () => {
      try {
        const dates = getPreviousDates();
        setPreviousDays(dates);
      } catch (error) {
        console.error("Error fetching previous days:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousDays();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ContentSection
        heading1="DB RANKING ALGORITHM"
        heading2="TECH behind COMPARISION"
        paragraph1="Database rankings are influenced by several key factors: performance, scalability, industry adoption, feature set, whether they are open-source or proprietary, and price."
        paragraph2="DB Ranking is curated DAILY based on pros and cons of a particular database. We scrape github,stackoverflow, google search, and bing search to present the BEST unbiased view."
        paragraph3="We update our results daily at 12 PM UTC."
        imageAlt="blue line"
      >
        <div className="w-full">
          <div className="flex items-center justify-center">
            <Segmented
              options={["Databases Ranking", "DB Tools Ranking"]}
              value={selectedSegment}
              onChange={(value) => setSelectedSegment(value)}
              className="mt-16 mb-20 lg:mb-0 segmented-custom"
            />
          </div>
          {selectedSegment === "Databases Ranking" ? (
            <DatabasesRanking previousDays={previousDays} />
          ) : (
            <DbToolsRanking previousDays={previousDays} />
          )}
        </div>
      </ContentSection>
    </div>
  );
}
