"use client";

import React from "react";
import DBChart from "@/components/DBChart";
import RankingTable from "@/components/rankingPage/rankingTable";

export default function DatabasesRanking({ previousDays }) {
  return (
    <div className="w-full">
      <div>
        {/* <div className="text-center w-full">
            <CommonTypography classes="font-bold text-xl text-secondary">
              We update our results daily at 12 PM UTC.
            </CommonTypography>
          </div> */}
        <DBChart previousDays={previousDays} />
      </div>
      <RankingTable previousDays={previousDays} />
    </div>
  );
}
