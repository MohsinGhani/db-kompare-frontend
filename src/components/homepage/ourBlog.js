"use client";
import React, { useState, useEffect } from "react";
import CommonTypography from "../shared/Typography";
import BlogSkeleton from "../shared/Skeletons/BlogSkeleton";
import CommonButton from "../shared/Button";
import { useRouter } from "nextjs-toploader/app";
import SingleBlogCard from "../blogCard/SingleBlogCard";
import { fetchBlogsData } from "@/utils/blogUtil";
import { useSelector } from "react-redux";
import { BlogStatus } from "@/utils/const";

const OurBlogs = () => {
  const [loading, setLoading] = useState(false);
  const [blogsData, setBlogsData] = useState([]);
  const { userDetails } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleFetchBlogs = async () => {
    try {
      setLoading(true);
      if (userDetails) {
        const response = await fetchBlogsData(BlogStatus.PRIVATE);
        if (response.data) {
          setBlogsData(response.data);
        }
      } else {
        const response = await fetchBlogsData(BlogStatus.PUBLIC);
        if (response.data) {
          setBlogsData(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchBlogs();
  }, []);

  return (
    <div className="container ">
      <div
        className={`text-5xl items-center flex flex-col ${
          blogsData.length !== 0 ? "py-10 " : ""
        } w-full`}
      >
        {blogsData.length !== 0 && (
          <div className="text-center w-full">
            <CommonTypography classes="md:text-5xl text-2xl font-bold ">
              Our Blogs
            </CommonTypography>
            <br />
            <h2 className="my-4 md:text-base text-sm font-normal text-secondary ">
              Revolutionizing How You Discover and Compare Knowledge
            </h2>
          </div>
        )}

        <div
          className={`grid grid-cols-1 gap-x-8 gap-y-10 ${
            blogsData.length !== 0 ? " mt-16" : ""
          } md:grid-cols-2 md:gap-x-6 lg:gap-x-8  ${
            blogsData.length === 2
              ? "max-w-[950px]"
              : blogsData.length === 1
              ? "max-w-[475px] grid-cols-1 md:grid-cols-1 lg:grid-cols-1"
              : "lg:grid-cols-3"
          }  w-full`}
        >
          {loading
            ? [1, 2, 3].map((key) => (
                <BlogSkeleton key={key} className="w-full" />
              ))
            : blogsData.slice(0, 3).map((blog) => (
                <div key={blog.id} className="w-full ">
                  <SingleBlogCard blog={blog} />
                </div>
              ))}
        </div>

        {blogsData.length > 3 && (
          <CommonButton
            onClick={() => router.push("/our-blogs")}
            className="bg-primary text-white mt-8 md:w-40 text-base font-bold"
            style={{ height: "49px" }}
          >
            {" "}
            View all
          </CommonButton>
        )}
      </div>
    </div>
  );
};

export default OurBlogs;
