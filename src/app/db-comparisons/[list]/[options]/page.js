import ComparisonDbListPage from "@/components/view/DBComparisonList";
import { generateCommonMetadata } from "@/utils/helper";
import React from "react";

const title = "DB Comparison";
const description =
  "Compare over 300 different database systems on DB Kompare. Our platform allows you to easily compare the performance, features, scalability, and suitability of any two databases from a vast list of options. Whether you’re deciding between relational and NoSQL databases, or simply evaluating which database best fits your project’s needs, DB Kompare provides detailed comparisons with real-time data to help you make informed decisions.";

export const metadata = generateCommonMetadata({
  title,
  description,
});
export default function Page() {
  return <ComparisonDbListPage />;
}
