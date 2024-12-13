"use client";
import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { updatePassword } from "aws-amplify/auth";

export const ChangePasswordForm = ({ email }) => {
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordForm] = Form.useForm();

  const handlePasswordSubmit = async (values) => {
    const { oldPassword, confirmPassword } = values;
    console.log(values);
    try {
      setPasswordLoading(true);
      await updatePassword({
        oldPassword: oldPassword,
        newPassword: confirmPassword,
      });
      toast.success("Password reset successful");
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setPasswordLoading(false);
      passwordForm.resetFields();
    }
  };

  return (
    <Form
      form={passwordForm}
      layout="vertical"
      onFinish={handlePasswordSubmit}
      className=" bg-[#FAFAFA] p-4"
    >
      <Form.Item
        className="mb-3"
        name="oldPassword"
        label="Old Password"
        rules={[{ required: true, message: "Please input your old password!" }]}
      >
        <Input.Password className="h-9" />
      </Form.Item>

      <Form.Item
        className="mb-3"
        name="newPassword"
        label="New Password"
        rules={[
          { required: true, message: "Please input your new password!" },
          { min: 8, message: "Password must be at least 8 characters!" },
        ]}
      >
        <Input.Password className="h-9" />
      </Form.Item>

      <Form.Item
        className="mb-5"
        name="confirmPassword"
        label="Confirm New Password"
        dependencies={["newPassword"]}
        rules={[
          { required: true, message: "Please confirm your new password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The two passwords do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password className="h-9" />
      </Form.Item>

      <Form.Item className="mb-1">
        <Button
          type="primary"
          htmlType="submit"
          loading={passwordLoading}
          className="bg-[#3E53D7]"
        >
          Change Password
        </Button>
      </Form.Item>
    </Form>
  );
};
