import ComparisonDbListPage from "@/components/view/DBComparisonList";
import { generateCommonMetadata } from "@/utils/helper";
import React from "react";

const title = "DB Comparison";
const description =
  "Compare over 300 different database systems and 200 database tools on DB Kompare. Our platform allows you to easily assess performance, features, scalability, and suitability of a vast array of options. Whether you’re evaluating relational versus NoSQL databases or selecting the best database tool for your project, DB Kompare provides detailed, real-time comparisons to help you make informed decisions.";

export const metadata = generateCommonMetadata({
  title,
  description,
});
export default function Page() {
  return <ComparisonDbListPage />;
}
