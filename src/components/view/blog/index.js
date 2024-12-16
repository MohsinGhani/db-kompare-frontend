"use client";

import CommonButton from "../../shared/Button";
import { blogsData } from "../../shared/Db-json/blogData";
import CommonTypography from "../../shared/Typography";
import SingleBlogCard from "../../blog/SingleBlogCard";
import { useRouter } from "next/navigation";

const Blog = () => {
  const router = useRouter();
  return (
    <div className=" py-40  px-12 md:py-32 lg:p-28 ">
      <div className=" w-full items-center flex justify-between my-8">
        <div className="flex-col flex gap-1">
          <CommonTypography classes="text-3xl font-bold">
            My blogs{" "}
          </CommonTypography>
          <CommonTypography classes="text-base text-secondary">
            Edit and manage your blogs
          </CommonTypography>
        </div>
        <CommonButton
          onClick={() => router.push("/add-blog")}
          className="bg-primary text-white"
          style={{ height: "42px" }}
        >
          Add Blog
        </CommonButton>
      </div>
      <div className="  w-full">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {blogsData?.map((blog) => (
            <div key={blog.id} className="w-full">
              <SingleBlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
