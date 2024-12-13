"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { IT_SKILLS } from "@/utils/const";
import { toast } from "react-toastify";

const { Option } = Select;

export const BasicDetailsForm = ({ userData }) => {
  const [basicDetailsLoading, setBasicDetailsLoading] = useState(false);
  const [basicDetailsForm] = Form.useForm();
  const Y_API_KEY = process.env.NEXT_PUBLIC_Y_API_KEY;

  const handleBasicDetailsSubmit = async (values) => {
    const { name, skills } = values;
    const payload = {
      id: userData.data.id,
      name,
      skills,
    };
    try {
      setBasicDetailsLoading(true);
      const response = await fetch(
        "https://b8iy915ig0.execute-api.eu-west-1.amazonaws.com/dev/update-user",
        {
          method: "POST",
          headers: {
            "x-api-key": Y_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Details Updated Successfully");
      }
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setBasicDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (userData && userData.data) {
      basicDetailsForm.setFieldsValue({
        name: userData.data.name,
        email: userData.data.email,
        skills: userData.data.skills || [],
      });
    }
  }, [userData, basicDetailsForm]);

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
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

// export default BasicDetailsForm;
