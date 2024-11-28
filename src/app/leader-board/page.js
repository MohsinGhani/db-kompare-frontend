"use client";
import React, { useEffect, useState } from "react";
import ContentSection from "@/components/shared/ContentSection/page";
import DBChart from "@/components/DBChart";
import RankingTable from "@/components/rankingPage.js/rankingTable";
import {
  getPreviousThreeDays,
  scheduleLogAtUTC6AM,
  // scheduleLogEvery2Minutes,
} from "@/utils/chartUtils";

export default function Page() {
  const [previousDays, setPreviousDays] = useState([]);

  // Use useEffect to run once on mount and start the scheduling logic
  useEffect(() => {
    // Set up the scheduling logic to run at 6 AM UTC
    scheduleLogAtUTC6AM(setPreviousDays); // Call the function that will update the state at 6 AM UTC
  }, []);
  return (
    <div>
      <ContentSection
        heading1=" DB RANKING ALGORITHM"
        heading2="TECH behind COMPARISION"
        paragraph1="Database rankings are influenced by several key factors
performance, scalability, industry adoption, feature set, whether they are open-source or proprietary and price"
        paragraph2="DB Ranking is curated DAILY based on pros and cons of a particular database.
We scrape github,stackoverflow, google search and bing search to present the BEST unbiased view. We use a wieghted matrix of above 4 sources to derive at final popularity i.e github is provided the highest wieght since the DEV community has actively spent time and effort on that topic. The wieghted matrix includes consideration on the limitations/chronic issues faced while using a database"
        imageAlt="blue line"
      >
        <div className="w-full">
          <DBChart />
        </div>
        <RankingTable />
      </ContentSection>
    </div>
  );
}
