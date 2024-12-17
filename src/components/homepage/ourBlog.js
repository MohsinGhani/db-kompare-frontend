"use client";
import React from "react";
import CommonTypography from "../shared/Typography";
import Image from "next/image";
import SingleBlogCard from "../blog/SingleBlogCard";
import BlogSkeleton from "../shared/Skeletons/BlogSkeleton";
import { blogsData } from "../shared/Db-json/blogData";
import CommonButton from "../shared/Button";
import { useRouter } from "next/navigation";

const OurBlogs = () => {
  const router = useRouter();
  return (
    <div className="container ">
      <div className="  text-5xl items-center flex  flex-col   py-10  w-full">
        <div className="text-center w-full">
          <CommonTypography classes="md:text-5xl text-2xl font-bold ">
            Our Blogs
          </CommonTypography>
          <br />
          <h2 className="my-4 md:text-base text-sm font-normal text-secondary ">
            Revolutionizing How You Discover and Compare Knowledge
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 mt-16 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {!blogsData
            ? [1, 2, 3].map((item, key) => <BlogSkeleton key={key} />)
            : blogsData.slice(0, 3).map((blog) => (
                <div key={blog.id} className="w-full">
                  <SingleBlogCard blog={blog} />
                </div>
              ))}
        </div>
        <CommonButton
          onClick={() => router.push("/our-blogs")}
          className="bg-primary text-white mt-8 md:w-40 text-base font-bold"
          style={{ height: "49px" }}
        >
          {" "}
          View all
        </CommonButton>
      </div>
    </div>
  );
};

export default OurBlogs;
