import Blog from "@/components/view/Blog";
import { BlogType } from "@/utils/const";
import { generateCommonMetadata } from "@/utils/helper";
import React from "react";

const title = "DB Blog";
const description =
  "Stay up-to-date with the latest database trends, tips, and best practices on DB Kompare's blog. Learn about performance optimization, database migration, and industry updates with expert insights and tutorials. If these assumptions are incorrect or if you need more specific descriptions, please provide more details on the website's structure or content.";

export const metadata = generateCommonMetadata({
  title,
  description,
});
export default function index() {
  return (
    <div className="container py-28">
      {" "}
      <Blog
        type={BlogType.BLOG}
        addroute="add-blog"
        text="My Blog"
        buttonText="Add Blog"
        secondText=" Edit and manage your blogs"
      />
    </div>
  );
}
