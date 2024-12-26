import Blog from "@/components/view/Blog";
import { BlogType } from "@/utils/const";
import React from "react";

export const metadata = {
  title: {
    absolute: "DB Blog | DB Kompare",
  },
};
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
