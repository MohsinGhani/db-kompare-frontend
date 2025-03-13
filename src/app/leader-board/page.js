import LeaderBoardPage from "@/components/view/Leaderboard";
import { generateCommonMetadata } from "@/utils/helper";
import React from "react";

const title = "Tech behind comparision";
const description =
  "DB Ranking & DB Tools Ranking are curated DAILY based on pros and cons of a particular database and database management system respectively. We scrape github,stackoverflow, google search, and bing search to present the BEST unbiased view.";

export const metadata = generateCommonMetadata({
  title,
  description,
});
export default function page() {
  return <LeaderBoardPage />;
}
