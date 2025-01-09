import AddBlog from "@/components/addBlog";
import { generateCommonMetadata } from "@/utils/helper";
import React from "react";

const title = "Add DB Blog";
const description =
  "Create and publish insightful database-related content on DB Kompare. Share your expertise, tips, and experiences with database management, optimization, and migration. Whether you’re a database expert or a newcomer, the Add Blog page enables you to contribute valuable articles to help the community stay informed and make better decisions about their database systems.";

export const metadata = generateCommonMetadata({
  title,
  description,
});
export default function page() {
  return <AddBlog />;
}
