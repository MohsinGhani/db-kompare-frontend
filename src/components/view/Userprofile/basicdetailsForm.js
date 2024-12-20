"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select } from "antd";
import { IT_SKILLS } from "@/utils/const";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserDetails } from "@/redux/slices/authSlice";

const { Option } = Select;
const Y_API_KEY = process.env.NEXT_PUBLIC_Y_API_KEY;
const API_BASE_URL_1 = process.env.NEXT_PUBLIC_API_BASE_URL_1;

export const BasicDetailsForm = ({ userData }) => {
  const [basicDetailsLoading, setBasicDetailsLoading] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [basicDetailsForm] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData && userData.data) {
      setOriginalData({
        name: userData.data.name,
        email: userData.data.email,
        skills: userData.data.skills || [],
      });
      basicDetailsForm.setFieldsValue({
        name: userData.data.name,
        email: userData.data.email,
        skills: userData.data.skills || [],
      });
    }
  }, [userData, basicDetailsForm]);

  const handleBasicDetailsSubmit = async (values) => {
    const { name, skills } = values;
    const payload = {
      id: userData.data.id,
      name,
      skills,
    };

    if (
      name === originalData.name &&
      skills.toString() === originalData.skills.toString()
    ) {
      toast.info("No changes made to the data.");
      return;
    }

    try {
      setBasicDetailsLoading(true);
      const response = await fetch(`${API_BASE_URL_1}/update-user`, {
        method: "POST",
        headers: {
          "x-api-key": Y_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setUserDetails({ data }));
        toast.success("Details Updated Successfully");
      }
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setBasicDetailsLoading(false);
    }
  };

  return (
    <Form
      form={basicDetailsForm}
      layout="vertical"
      onFinish={handleBasicDetailsSubmit}
      className=" bg-[#FAFAFA] p-4"
    >
      <div className="flex flex-row items-center justify-between">
        <Form.Item
          name="name"
          label="Name"
          className="w-full mr-3 mb-2"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input className="h-9" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          className="w-full mb-2"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input className="h-9" disabled />
        </Form.Item>
      </div>

      <Form.Item name="skills" label="Skills" className="mb-5">
        <Select mode="tags" style={{ width: "100%" }} className="h-9">
          {IT_SKILLS.map((skill) => (
            <Option key={skill} value={skill}>
              {skill}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item className="mb-1">
        <Button
          type="primary"
          htmlType="submit"
          loading={basicDetailsLoading}
          disabled={basicDetailsLoading}
          className="bg-[#3E53D7]"
        >
          {basicDetailsLoading ? "Saving Changes" : "Save Changes"}
        </Button>
      </Form.Item>
    </Form>
  );
};
