"use client";

import React from "react";
import DBChart from "@/components/DBChart";
import DBToolsRankingTable from "@/components/dbToolsRankingPage/dbToolsRankingTable";

export default function DbToolsRanking({ previousDays }) {
  return (
    <div>
      <div className="w-full">
        {/* <div className="text-center w-full">
            <CommonTypography classes="font-bold text-xl text-secondary">
              We update our results daily at 12 PM UTC.
            </CommonTypography>
          </div> */}
        <DBChart previousDays={previousDays} isRankingType="Db Tools" />
      </div>
      <DBToolsRankingTable previousDays={previousDays} />
    </div>
  );
}
