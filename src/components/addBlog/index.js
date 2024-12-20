"use client";

import React, { useEffect, useState } from "react";
import { Form, message } from "antd";
import { useParams } from "next/navigation";
import CommonEditor from "../shared/CommonEditor";
import CommonButton from "../shared/Button";
import CommonInput from "../shared/CommonInput";
import CustomSelect from "../shared/CustomSelect";
import ImageUploader from "./ImageUploader";
import CommonTypography from "../shared/Typography";
import { fetchDatabases } from "@/utils/databaseUtils";
import { useSelector } from "react-redux";
import { addBlog } from "@/utils/blogUtil";
import { BlogStatus } from "@/utils/const";

const AddBlog = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [databases, setDatabases] = useState([]);
  const [addBlogLoading, setAddBlogLoading] = useState(false);
  const { userDetails } = useSelector((state) => state.auth);
  const userId = userDetails?.data?.data?.id;

  const handleImageUpload = (file) => {
    form.setFieldsValue({ image: file });
  };

  const onFinish = async (values) => {
    const payload = {
      title: values.title,
      description: values.description,
      createdBy: userId,
      status: BlogStatus.PUBLIC,
      databases: values.tags,
    };
    console.log(payload);

    try {
      setAddBlogLoading(true);
      const response = await addBlog(payload);
      if (response.data) {
        message.success("Blog added successfully");
        form.resetFields();
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      message.error(error.message || "An error occurred while adding the blog");
    } finally {
      setAddBlogLoading(false);
    }
  };

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
    <div className="h-full w-full max-w-[1100px] py-24 md:py-32  container">
      <CommonTypography classes="text-3xl font-bold">Add Blog</CommonTypography>
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
            className="bg-primary text-white mt-8 md:max-w-[130px] w-full"
            htmltype="submit"
            loading={addBlogLoading}
            disabled={addBlogLoading}
          >
            {addBlogLoading ? "Uploading..." : "Upload"}
          </CommonButton>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddBlog;
