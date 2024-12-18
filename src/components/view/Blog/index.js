"use client";

import CommonButton from "../../shared/Button";
import { blogsData } from "../../shared/Db-json/blogData";
import CommonTypography from "../../shared/Typography";
import { useRouter } from "next/navigation";
import BlogSkeleton from "@/components/shared/Skeletons/BlogSkeleton";
import SingleBlogCard from "@/components/blogCard/SingleBlogCard";
const Blog = ({ route, text, buttonText, secondText }) => {
  const router = useRouter();
  return (
    <div>
      <div className=" w-full items-center flex justify-between ">
        <div className="flex-col flex gap-1 w-full ">
          {text && (
            <div className="flex justify-between  my-8 pt-40  md:pt-0">
              <div className="flex-col flex">
                <CommonTypography classes="text-3xl font-bold">
                  {text}
                </CommonTypography>
                {secondText && (
                  <CommonTypography classes="text-base text-secondary">
                    {secondText}
                  </CommonTypography>
                )}
              </div>

              <CommonButton
                onClick={() => router.push(route)}
                className="bg-primary text-white"
                style={{ height: "42px" }}
              >
                {buttonText}
              </CommonButton>
            </div>
          )}
        </div>
      </div>
      <div className=" mt-4 w-full">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {!blogsData
            ? [1, 2, 3].map((item, key) => <BlogSkeleton key={key} />)
            : blogsData?.map((blog) => (
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
