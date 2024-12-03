"use client";

import React, { useState, useEffect } from "react";
import ContentSection from "@/components/shared/ContentSection/page";
import DBChart from "@/components/DBChart";
import RankingTable from "@/components/rankingPage.js/rankingTable";
import { getPreviousDates } from "@/utils/formatDateAndTime";
import CommonTypography from "@/components/shared/Typography";

export default function Page() {
  const [previousDays, setPreviousDays] = useState([]);
  const [loading, setLoading] = useState(true);

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
          {/* <div className="text-center w-full">
            <CommonTypography classes="font-bold text-xl text-secondary">
              We update our results daily at 12 PM UTC.
            </CommonTypography>
          </div> */}
          <DBChart previousDays={previousDays} />
        </div>
        <RankingTable previousDays={previousDays} />
      </ContentSection>
    </div>
  );
}
