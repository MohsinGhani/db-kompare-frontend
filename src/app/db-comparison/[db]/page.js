import ComparisonDbPage from "@/components/view/DBComparisonDb";
import { generateCommonMetadata } from "@/utils/helper";
import React from "react";

async function getDatabasesName(db) {
  if (db) {
    const decodedDb = decodeURIComponent(db.replace("list-", ""));
    return decodedDb.split("-");
  }
}

export async function generateMetadata({ params }) {
  const { db } = params;
  const databasesName = await getDatabasesName(db);

  const dynamicTitle = `${databasesName.join(" vs ")} Comparison`;
  const dynamicDescription = `Compare the performance, features, scalability, and suitability of ${databasesName.join(
    " and "
  )} on DB Kompare. Our platform provides in-depth insights into various metrics such as speed, reliability, ease of use, cost-effectiveness, data consistency, security features, and cloud integrations, helping you determine which database best fits your project requirements. Whether you're evaluating NoSQL, relational, or cloud-based databases, DB Kompare offers comprehensive data, including support for specific technologies, transaction handling, replication methods, partitioning strategies, and more, to guide your decision-making process, ensuring you choose the right solution for your application's needs.`;

  return generateCommonMetadata({
    title: dynamicTitle,
    description: dynamicDescription,
    siteName: "DB Kompare",
  });
}

export default function Page() {
  return <ComparisonDbPage />;
}
