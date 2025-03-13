"use client";

import React, { useEffect, useState } from "react";
import { Form, Radio, message } from "antd";
import { useParams } from "next/navigation";
import CommonEditor from "../shared/CommonEditor";
import CommonButton from "../shared/Button";
import CommonInput from "../shared/CommonInput";
import CustomSelect from "../shared/CustomSelect";
import ImageUploader from "../shared/ImageUploader";
import CommonTypography from "../shared/Typography";
import { fetchDatabases } from "@/utils/databaseUtils";
import { useSelector } from "react-redux";
import { addBlog } from "@/utils/blogUtil";
import { BlogStatus } from "@/utils/const";
import { useRouter } from "nextjs-toploader/app";
import { ulid } from "ulid";
import { _putFileToS3 } from "@/utils/s3Services";
import { toast } from "react-toastify";

const AddBlog = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [databases, setDatabases] = useState([]);
  const [addBlogLoading, setAddBlogLoading] = useState(false);
  const { userDetails } = useSelector((state) => state.auth);
  const userId = userDetails?.data?.data?.id;
  const route = useRouter();

  const handleImageUpload = (file) => {
    form.setFieldsValue({ image: file });
  };

  const onFinish = async (values) => {
    const id = ulid();

    const payload = {
      id,
      title: values.title,
      description: values.description,
      createdBy: userId,
      status: values.status,
      databases: values.tags,
    };
    try {
      setAddBlogLoading(true);
      await _putFileToS3(`BLOG/${id}.webp`, values?.image);
      const response = await addBlog(payload);
      if (response.data) {
        toast.success("Blog added successfully");
        form.resetFields();
        route.push(`/blog/${response?.data?.id}`);
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      toast.error(error?.message || "An error occurred while adding the blog");
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
    <div className="h-full w-full max-w-[1300px] py-24 px-10 sm:px-20 md:py-32 md:px-20 lg:pl-60 ">
      <CommonTypography classes="text-3xl font-bold">Add Blog</CommonTypography>
      <Form
        form={form}
        requiredMark={false}
        style={{ marginTop: "40px" }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="image"
          rules={[{ required: true, message: "Please add an image" }]}
          label={
            <CommonTypography classes="text-base font-semibold">
              Image
            </CommonTypography>
          }
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
            options={databases
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((db) => ({
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
          name="status"
          label={
            <CommonTypography classes="text-base font-semibold">
              Please select whether the blog is private or public.
            </CommonTypography>
          }
          initialValue="PUBLIC"
        >
          <Radio.Group>
            <Radio value="PUBLIC">Public</Radio>
            <Radio value="PRIVATE">Private</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="description"
          rules={[{ required: true, message: "Please add Details" }]}
          style={{ fontSize: "23px" }}
          label={
            <CommonTypography classes="text-base font-semibold">
              Description
            </CommonTypography>
          }
        >
          <div className="md:mb-12 mb-28">
            <CommonEditor
              value={form.getFieldValue("description")}
              onChange={handleEditorChange}
            />
          </div>
        </Form.Item>
        <Form.Item>
          <CommonButton
            className={`bg-primary text-white ${
              addBlogLoading ? "md:max-w-[160px]" : "md:max-w-[140px]"
            }  w-full`}
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
