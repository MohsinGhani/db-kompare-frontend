import OurBlogPage from "@/components/view/Blog/ourBlogPage";
import { generateCommonMetadata } from "@/utils/helper";
import React from "react";

const title = "Our Blogs";
const description =
  "Explore the extensive collection of database-related blog articles on DB Kompare. Stay informed with the latest trends, best practices, and expert insights on database management, optimization, migration, and more. Our blog covers over 300 different database systems, offering in-depth tutorials, case studies, performance benchmarks, and industry updates. Whether you're a developer, database administrator, or IT professional, you'll find valuable content to help you make informed decisions and stay ahead in the ever-evolving world of databases.";

export const metadata = generateCommonMetadata({
  title,
  description,
});
export default function page() {
  return <OurBlogPage />;
}
