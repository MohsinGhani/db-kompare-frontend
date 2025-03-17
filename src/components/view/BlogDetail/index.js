"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, Tag, Modal, Spin } from "antd";
import { useRouter } from "nextjs-toploader/app";
import { getInitials } from "@/utils/getInitials";
import { deleteBlog, fetchBlogById, saveBlog } from "@/utils/blogUtil";
import { fetchDatabaseByIds } from "@/utils/databaseUtils";
import { formatReadableDate } from "@/utils/formatDateAndTime";
import { useSelector } from "react-redux";
import { BlogStatus, BlogType, UserRole } from "@/utils/const";
import { toast } from "react-toastify";
import { _removeFileFromS3 } from "@/utils/s3Services";
import { LoadingOutlined } from "@ant-design/icons";
import loadingAnimationIcon from "@/../public/assets/icons/Animation-loader.gif";
import { usePathname } from "next/navigation";
import { selectAuthLoading } from "@/redux/slices/authSlice";
import CommonRenderComments from "@/components/shared/CommonRenderComments";

const BlogDetail = ({ id }) => {
  const [blog, setBlog] = useState();
  const [databasesTags, setDatabasesTags] = useState([]);
  const [loadingSaveBlog, setLoadingSaveBlog] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const imageUrl = blog
    ? `${process.env.NEXT_PUBLIC_BUCKET_URL}/BLOG/${id}.webp?${
        blog.updatedAt || Date.now()
      }`
    : null;
  const { userDetails } = useSelector((state) => state.auth);
  const isLoading = useSelector(selectAuthLoading);
  const userId = userDetails?.data?.data?.id;
  const userRole = userDetails?.data?.data?.role;
  const isAuthor = blog?.createdBy?.id === userId;
  const encodedPath = encodeURIComponent(pathname);

  const handleFetchBlogById = async () => {
    try {
      setLoadingBlog(true);
      const response = await fetchBlogById(id, userId);
      if (response.data) {
        setBlog(response.data);
        setIsSaved(response.data.isSaved);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoadingBlog(false);
    }
  };

  const handleFetchDatabasesByIds = async (databaseIds) => {
    if (!Array.isArray(databaseIds) || databaseIds.length === 0) {
      setDatabasesTags([]);
      return;
    }
    try {
      const response = await fetchDatabaseByIds(databaseIds);
      if (response.data) {
        const databaseNames = response.data.map((db) => db.name);
        setDatabasesTags(databaseNames);
      }
    } catch (error) {
      console.error("Error fetching databases:", error);
    }
  };

  const handleUnSaveBlog = async () => {
    if (loadingSaveBlog) return;
    setIsSaved(false);

    const payload = {
      userId: userId,
      blogId: id,
      type: BlogType.SAVED_BLOG,
    };
    try {
      setLoadingSaveBlog(true);
      const response = await deleteBlog(payload);
      if (response) {
        toast.success("Blog unsaved successfully");
      }
    } catch (error) {
      toast.error(error?.message);
      setIsSaved(true);
    } finally {
      setLoadingSaveBlog(false);
    }
  };

  const handleSaveBlog = async () => {
    if (loadingSaveBlog) return;
    if (userDetails === null) {
      router.push(`/signin?redirect=${encodedPath}`);
      return;
    }
    setIsSaved(true);

    const payload = {
      blogId: id,
      userId: userId,
    };
    try {
      setLoadingSaveBlog(true);
      const response = await saveBlog(payload);
      if (response) {
        toast.success("Blog saved successfully");
      }
    } catch (error) {
      toast.error(error?.message);
      setIsSaved(false);
    } finally {
      setLoadingSaveBlog(false);
    }
  };

  const handleDeleteBlog = async () => {
    const payload = {
      id: id,
      type: BlogType.BLOG,
    };
    try {
      const response = await deleteBlog(payload);
      if (response) {
        await _removeFileFromS3(`BLOG/${id}.webp`);
        toast.success("Blog deleted successfully");
        router.push("/user-profile");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const onConfirmDelete = () => {
    Modal.confirm({
      title: "Delete Blog",
      content: "Are you sure you want to delete this Blog?",
      okText: "Yes",
      cancelText: "No",
      centered: true,
      onOk: handleDeleteBlog,
    });
  };

  useEffect(() => {
    if (blog && Array.isArray(blog.databases)) {
      handleFetchDatabasesByIds(blog.databases);
    }
  }, [blog?.databases]);

  useEffect(() => {
    handleFetchBlogById();
  }, [id]);

  useEffect(() => {
    if (!isLoading) {
      if (blog?.status === BlogStatus.PRIVATE && userDetails === null) {
        router.push(`/signin?redirect=${encodedPath}`);
      }
    }
  }, [blog, userDetails]);

  if (loadingBlog || (blog?.status === BlogStatus.PRIVATE && !userDetails)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image
          src={loadingAnimationIcon}
          alt="Loading..."
          width={100}
          height={100}
        />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No blog found.</p>
      </div>
    );
  }
  return (
    <section className="pb-[60px] pt-[150px] ">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-8/12">
            <div>
              {(userRole === UserRole.ADMIN || isAuthor) && (
                <div className="flex flex-row items-center justify-end mb-4 ">
                  <p
                    className="text-[#3E53D7] text-lg font-medium mr-4 underline cursor-pointer hover:opacity-80 transition-all"
                    onClick={onConfirmDelete}
                  >
                    Delete
                  </p>
                  <Link
                    href={`/edit-blog/${id}`}
                    className="text-[#3E53D7] text-lg font-medium underline hover:opacity-75 transition-all"
                  >
                    Edit
                  </Link>
                </div>
              )}
              <h2 className="mb-8 text-3xl font-bold text-black sm:text-4xl ">
                {blog.title}
              </h2>
              <div className="mb-10 flex flex-wrap items-center border-b border-[#788293] border-opacity-10 pb-4 ">
                <div className="w-full flex items-center justify-between">
                  <div className="w-full flex flex-wrap items-center">
                    <div className="mb-2 mr-4 sm:mr-10 flex items-center">
                      <div className="mr-2 sm:mr-4">
                        <Avatar className="bg-primary text-white w-8 h-8 sm:w-9 sm:h-9 ">
                          {" "}
                          {getInitials(
                            blog?.createdBy?.name || "Unknown Author"
                          )}
                        </Avatar>
                      </div>
                      <div className="w-full">
                        <span className="text-sm sm:text-base font-medium text-body-color">
                          {blog?.createdBy?.name || "Unknown Author"}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center text-[#788293]">
                      <p className="mr-1 sm:mr-5 flex items-center text-sm sm:text-base font-medium text-body-color">
                        <span className="mr-2 sm:mr-3">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            className="fill-current"
                          >
                            <path d="M3.89531 8.67529H3.10666C2.96327 8.67529 2.86768 8.77089 2.86768 8.91428V9.67904C2.86768 9.82243 2.96327 9.91802 3.10666 9.91802H3.89531C4.03871 9.91802 4.1343 9.82243 4.1343 9.67904V8.91428C4.1343 8.77089 4.03871 8.67529 3.89531 8.67529Z"></path>
                            <path d="M6.429 8.67529H5.64035C5.49696 8.67529 5.40137 8.77089 5.40137 8.91428V9.67904C5.40137 9.82243 5.49696 9.91802 5.64035 9.91802H6.429C6.57239 9.91802 6.66799 9.82243 6.66799 9.67904V8.91428C6.66799 8.77089 6.5485 8.67529 6.429 8.67529Z"></path>
                            <path d="M8.93828 8.67529H8.14963C8.00624 8.67529 7.91064 8.77089 7.91064 8.91428V9.67904C7.91064 9.82243 8.00624 9.91802 8.14963 9.91802H8.93828C9.08167 9.91802 9.17727 9.82243 9.17727 9.67904V8.91428C9.17727 8.77089 9.08167 8.67529 8.93828 8.67529Z"></path>
                            <path d="M11.4715 8.67529H10.6828C10.5394 8.67529 10.4438 8.77089 10.4438 8.91428V9.67904C10.4438 9.82243 10.5394 9.91802 10.6828 9.91802H11.4715C11.6149 9.91802 11.7105 9.82243 11.7105 9.67904V8.91428C11.7105 8.77089 11.591 8.67529 11.4715 8.67529Z"></path>
                            <path d="M3.89531 11.1606H3.10666C2.96327 11.1606 2.86768 11.2562 2.86768 11.3996V12.1644C2.86768 12.3078 2.96327 12.4034 3.10666 12.4034H3.89531C4.03871 12.4034 4.1343 12.3078 4.1343 12.1644V11.3996C4.1343 11.2562 4.03871 11.1606 3.89531 11.1606Z"></path>
                            <path d="M6.429 11.1606H5.64035C5.49696 11.1606 5.40137 11.2562 5.40137 11.3996V12.1644C5.40137 12.3078 5.49696 12.4034 5.64035 12.4034H6.429C6.57239 12.4034 6.66799 12.3078 6.66799 12.1644V11.3996C6.66799 11.2562 6.5485 11.1606 6.429 11.1606Z"></path>
                            <path d="M8.93828 11.1606H8.14963C8.00624 11.1606 7.91064 11.2562 7.91064 11.3996V12.1644C7.91064 12.3078 8.00624 12.4034 8.14963 12.4034H8.93828C9.08167 12.4034 9.17727 12.3078 9.17727 12.1644V11.3996C9.17727 11.2562 9.08167 11.1606 8.93828 11.1606Z"></path>
                            <path d="M11.4715 11.1606H10.6828C10.5394 11.1606 10.4438 11.2562 10.4438 11.3996V12.1644C10.4438 12.3078 10.5394 12.4034 10.6828 12.4034H11.4715C11.6149 12.4034 11.7105 12.3078 11.7105 12.1644V11.3996C11.7105 11.2562 11.591 11.1606 11.4715 11.1606Z"></path>
                            <path d="M13.2637 3.3697H7.64754V2.58105C8.19721 2.43765 8.62738 1.91189 8.62738 1.31442C8.62738 0.597464 8.02992 0 7.28906 0C6.54821 0 5.95074 0.597464 5.95074 1.31442C5.95074 1.91189 6.35702 2.41376 6.93058 2.58105V3.3697H1.31442C0.597464 3.3697 0 3.96716 0 4.68412V13.2637C0 13.9807 0.597464 14.5781 1.31442 14.5781H13.2637C13.9807 14.5781 14.5781 13.9807 14.5781 13.2637V4.68412C14.5781 3.96716 13.9807 3.3697 13.2637 3.3697ZM6.6677 1.31442C6.6677 0.979841 6.93058 0.716957 7.28906 0.716957C7.62364 0.716957 7.91042 0.979841 7.91042 1.31442C7.91042 1.649 7.64754 1.91189 7.28906 1.91189C6.95448 1.91189 6.6677 1.6251 6.6677 1.31442ZM1.31442 4.08665H13.2637C13.5983 4.08665 13.8612 4.34954 13.8612 4.68412V6.45261H0.716957V4.68412C0.716957 4.34954 0.979841 4.08665 1.31442 4.08665ZM13.2637 13.8612H1.31442C0.979841 13.8612 0.716957 13.5983 0.716957 13.2637V7.16957H13.8612V13.2637C13.8612 13.5983 13.5983 13.8612 13.2637 13.8612Z"></path>
                          </svg>
                        </span>
                        {formatReadableDate(blog?.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div>
                    {loadingSaveBlog ? (
                      <Spin
                        indicator={<LoadingOutlined spin />}
                        size="medium"
                        className="mr-1"
                      />
                    ) : isSaved ? (
                      <img
                        src="/assets/icons/savedBlogIcon.svg"
                        alt="savedIcon"
                        className="w-6 cursor-pointer hover:opacity-60 transition-all"
                        onClick={handleUnSaveBlog}
                      />
                    ) : (
                      <img
                        src="/assets/icons/saveBlogIcon.svg"
                        alt="saveIcon"
                        className="w-8 cursor-pointer hover:opacity-60 transition-all"
                        onClick={handleSaveBlog}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-3 w-full overflow-hidden rounded">
                  <div className="relative w-full ">
                    <img
                      src={imageUrl}
                      alt="Blog Image"
                      className="w-full object-cover rounded-lg"
                    />
                  </div>
                </div>
                <div className="pt-5 w-full">
                  <div
                    className="text-[#565758] text-base prose w-full min-w-full"
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                  ></div>
                </div>
                <div>
                  <h3 className="mt-10 mb-4 text-base font-medium text-[#788293]">
                    Popular Tags :
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {databasesTags.map((tag) => (
                      <Tag
                        key={tag}
                        className="px-3 py-2 bg-[#F0F2F9] text-black rounded-sm text-sm font-medium border-none"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <CommonRenderComments
              entityType="blog"
              entityOptionIds={id}
              className="lg:!max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetail;
