"use client";
import React from "react";
import { Form, Input, Button, Select } from "antd";

const { Option } = Select;

export const BasicDetailsForm = ({ form, onFinish, loading }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        name: "Henry",
        email: "henry@example.com",
        skills: ["Test X", "Test X"],
      }}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="skills"
        label="Skills"
        rules={[
          { required: true, message: "Please select at least one skill!" },
        ]}
      >
        <Select mode="tags" style={{ width: "100%" }}>
          <Option value="Test X">Test X</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="bg-blue-600"
        >
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

// export default BasicDetailsForm;
