"use client";
import React from "react";
import { Form, Input, Button } from "antd";

export const ChangeEmailForm = ({ form, onFinish, loading }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        email: "henry@example.com",
      }}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="bg-blue-600"
        >
          Change Email
        </Button>
      </Form.Item>
    </Form>
  );
};

// export default ChangeEmailForm;
