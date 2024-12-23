"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Form, message } from "antd";
import { useParams } from "next/navigation";
import CommonEditor from "../shared/CommonEditor";
import CommonButton from "../shared/Button";
import CommonInput from "../shared/CommonInput";
import CustomSelect from "../shared/CustomSelect";
import ImageUploader from "../shared/ImageUploader";
import CommonTypography from "../shared/Typography";
import { fetchDatabases } from "@/utils/databaseUtils";
import { BlogStatus } from "@/utils/const";
import { editBlog, fetchBlogById } from "@/utils/blogUtil";
import { useRouter } from "nextjs-toploader/app";
import loadingAnimationIcon from "@/../public/assets/icons/Animation-loader.gif";

const EditBlog = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [databases, setDatabases] = useState([]);
  const [blogData, setBlogData] = useState();
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [editBlogLoading, setEditBlogLoading] = useState(false);
  const route = useRouter();

  const handleImageUpload = (file) => {
    form.setFieldsValue({ image: file });
  };

  const onFinish = async (values) => {
    const payload = {
      id: id,
      title: values.title,
      description: values.description,
      status: BlogStatus.PUBLIC,
      databases: values.tags,
    };

    try {
      setEditBlogLoading(true);
      const response = await editBlog(payload);
      if (response.data) {
        message.success("Blog updated successfully");
        form.resetFields();
        route.push(`/blog/${id}`);
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      message.error(
        error.message || "An error occurred while updating the blog"
      );
    } finally {
      setEditBlogLoading(false);
    }
  };

  const handleFetchBlogData = async () => {
    try {
      setLoadingBlog(true);
      const response = await fetchBlogById(id);
      if (response.data) {
        setBlogData(response.data);
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
    } finally {
      setLoadingBlog(false);
    }
  };

  useEffect(() => {
    handleFetchBlogData();
  }, [id]);

  useEffect(() => {
    if (blogData) {
      form.setFieldsValue({
        title: blogData.title,
        description: blogData.description,
        tags: blogData.databases,
      });
    }
  }, [blogData]);

  // Fetch databases (names and IDs) for the tags select
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDatabases();
        if (Array.isArray(result.data)) {
          const namesAndIds = result.data.map((item) => ({
            name: item.name,
            id: item.id,
          }));
          setDatabases(namesAndIds);
        }
      } catch (error) {
        console.error("Error fetching databases: ", error.message);
      }
    };

    fetchData();
  }, []);

  const handleEditorChange = (value) => {
    form.setFieldsValue({ description: value });
  };

  return (
    <div className="h-full w-full min-h-screen max-w-[1100px] py-24 md:py-32 container">
      {loadingBlog ? (
        <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2">
          <Image
            src={loadingAnimationIcon}
            alt="Loading..."
            width={100}
            height={100}
          />
        </div>
      ) : (
        <div>
          <CommonTypography classes="text-3xl font-bold">
            Edit Blog
          </CommonTypography>

          <Form
            form={form}
            requiredMark={false}
            style={{ marginTop: "20px" }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="image"
              rules={[{ required: true, message: "Please add an image" }]}
            >
              <ImageUploader
                s3Image={id && `BLOG/${id}`}
                onImageUpload={handleImageUpload}
              />
            </Form.Item>

            <CommonInput
              label="Title"
              name="title"
              placeholder="Enter your title"
              inputType="text"
              rules={[{ required: true, message: "Please enter your title" }]}
            />

            <Form.Item
              name="tags"
              label={
                <CommonTypography classes="text-base font-semibold">
                  Tags
                </CommonTypography>
              }
              rules={[{ required: true, message: "Please add tags" }]}
            >
              <CustomSelect
                options={databases.map((db) => ({
                  id: db.id,
                  label: db.name,
                  value: db.id,
                }))}
                mode="tags"
                size="large"
                placeholder="Select tags"
              />
            </Form.Item>

            <Form.Item
              name="description"
              rules={[{ required: true, message: "Please add Details" }]}
              style={{ fontSize: "23px" }}
            >
              <div className="md:mb-12 mb-28 mt-5">
                <CommonEditor
                  value={form.getFieldValue("description")}
                  onChange={handleEditorChange}
                />
              </div>
            </Form.Item>

            <Form.Item>
              <CommonButton
                className={`bg-primary text-white mt-8 md:max-w-[130px] w-full ${
                  editBlogLoading ? "md:max-w-[160px]" : ""
                }`}
                htmltype="submit"
                loading={editBlogLoading}
                disabled={editBlogLoading}
              >
                {editBlogLoading ? "Editing Blog..." : "Edit Blog"}
              </CommonButton>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default EditBlog;
