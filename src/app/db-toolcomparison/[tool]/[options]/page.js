import DbToolComparison from "@/components/view/DBToolComparison";
import { generateCommonMetadata } from "@/utils/helper";
import React from "react";

async function getToolOptionsName(options) {
  if (options) {
    const decodedOptions = decodeURIComponent(options.replace("options-", ""));
    return decodedOptions.split("-");
  }
}

export async function generateMetadata({ params }) {
  const { options } = params;
  const toolOptionsName = await getToolOptionsName(options);

  const dynamicTitle = `${toolOptionsName.join(" vs ")} Tools Comparison`;
  const dynamicDescription = `Explore and compare the selected ${toolOptionsName.join(
    " and "
  )} tools on DB Kompare. This page presents detailed data on various metrics such as performance, features, scalability, ease of use, cost-effectiveness, and more, to help you make an informed decision. Analyze the strengths and weaknesses of each tool, and find out which best fits your project’s specific requirements. Whether you're considering tools for data modeling, governance, or data management, DB Kompare provides comprehensive insights into their capabilities, supported technologies, and real-time data, ensuring you choose the right tool for your needs.`;

  return generateCommonMetadata({
    title: dynamicTitle,
    description: dynamicDescription,
    siteName: "DB Kompare",
  });
}

export default function Page() {
  return <DbToolComparison />;
}
