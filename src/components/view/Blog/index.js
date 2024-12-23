"use client";

import CommonButton from "../../shared/Button";
import { useRouter } from "nextjs-toploader/app";
import BlogSkeleton from "@/components/shared/Skeletons/BlogSkeleton";
import SingleBlogCard from "@/components/blogCard/SingleBlogCard";
import { fetchBlogsByDatabaseIds, fetchBlogsData } from "@/utils/blogUtil";
import { useEffect, useState } from "react";

const Blog = ({ addroute, text, buttonText, selectedDatabaseIds }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [blogsData, setBlogsData] = useState([]);

  const handleFetchBlogs = async () => {
    try {
      setLoading(true);
      let response;
      if (selectedDatabaseIds && selectedDatabaseIds.length > 0) {
        response = await fetchBlogsByDatabaseIds(selectedDatabaseIds);
      } else {
        response = await fetchBlogsData();
      }
      if (response.data) {
        setBlogsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchBlogs();
  }, [selectedDatabaseIds]);

  return (
    <div className="w-full">
      <div className=" w-full items-center flex justify-between ">
        <div className="flex-col flex gap-1 w-full ">
          {text && (
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
