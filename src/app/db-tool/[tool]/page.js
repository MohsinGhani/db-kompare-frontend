import DBToolListPage from "@/components/view/DBToolList";
import { generateCommonMetadata } from "@/utils/helper";
import React from "react";

async function getToolsName(tool) {
  if (tool) {
    const decodedTool = decodeURIComponent(tool.replace("tool-", ""));
    return decodedTool.split("-");
  }
}

export async function generateMetadata({ params }) {
  const { tool } = params;
  const toolName = await getToolsName(tool);

  const dynamicTitle = `${toolName} Tool Comparison`;
  const dynamicDescription = `Explore and compare tools within the ${toolName} category on DB Kompare. This page allows you to choose from a list of tools such as ${toolName} tools, each with different features, performance metrics, and use cases. Select the tools you want to compare and get detailed insights into their capabilities, supported technologies, and much more. Whether you're deciding between popular tools or niche solutions, DB Kompare provides comprehensive data to help you make an informed choice for your project needs.`;

  return generateCommonMetadata({
    title: dynamicTitle,
    description: dynamicDescription,
    siteName: "DB Kompare",
  });
}

export default function Page() {
  return <DBToolListPage />;
}
