"use client";

import CommonButton from "../../shared/Button";
import { useRouter } from "nextjs-toploader/app";
import BlogSkeleton from "@/components/shared/Skeletons/BlogSkeleton";
import SingleBlogCard from "@/components/blogCard/SingleBlogCard";
import {
  fetchBlogsByDatabaseIds,
  fetchBlogsData,
  fetchBlogsByUserId,
} from "@/utils/blogUtil";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BlogType } from "@/utils/const";
import CommonTypography from "@/components/shared/Typography";

const Blog = ({
  addroute,
  text,
  buttonText,
  selectedDatabaseIds,
  type,
  fetchAllBlogs = true,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [blogsData, setBlogsData] = useState([]);
  const { userDetails } = useSelector((state) => state.auth);
  const userId = userDetails?.data?.data?.id;

  const handleFetchBlogs = async () => {
    try {
      setLoading(true);
      let response;
      if (type === BlogType.SAVED_BLOG || type === BlogType.BLOG) {
        response = await fetchBlogsByUserId(userId, type);
        if (response.data) {
          setBlogsData(response.data.items);
        }
      } else if (selectedDatabaseIds && selectedDatabaseIds.length > 0) {
        response = await fetchBlogsByDatabaseIds(selectedDatabaseIds);
        if (response.data) {
          setBlogsData(response.data);
        }
      } else {
        if (fetchAllBlogs) {
          response = await fetchBlogsData();
          if (response.data) {
            setBlogsData(response.data);
          }
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
  }, [selectedDatabaseIds, type, userId]);

  return (
    <div className="w-full">
      <div className=" w-full items-center flex justify-between ">
        <div className="flex-col flex gap-1 w-full ">
          {text && !buttonText && blogsData?.length > 0 && (
            <div className="flex justify-start mt-6 md:pt-0">
              <CommonTypography className="text-black text-xl font-medium">
                {text}
              </CommonTypography>
            </div>
          )}

          {text && buttonText && (
            <div className="flex justify-end my-4 md:pt-0">
              <CommonButton
                onClick={() => router.push(addroute)}
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
          {loading
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
