import EmailVerification from "@/components/view/Auth/EmailVerification/page";
import { generateCommonMetadata } from "@/utils/helper";
import React from "react";

const title = "Verification";
const description =
  "DB Kompare is a comprehensive platform designed to simplify the process of comparing over 300 different database systems. Whether you're a developer, business analyst, or IT professional, DB Kompare provides powerful tools to evaluate and compare the performance, scalability, features, and suitability of various databases. With real-time rankings based on search engine results from Google, Bing, Stack Overflow, and other sources, users can make data-driven decisions when selecting the ideal database for their needs. Additionally, DB Kompare features an extensive collection of blogs and articles that cover in-depth insights, tutorials, and the latest trends for each of the 300+ databases listed on the platform. Our database tools and comparison engine also provide accurate, up-to-date data, including performance benchmarks, user reviews, and feature analysis. Whether you're migrating to a new database or optimizing your current system, DB Kompare makes it easier than ever to find the right database solution for your projects.";

export const metadata = generateCommonMetadata({
  title,
  description,
});
export default function page() {
  return <EmailVerification />;
}
