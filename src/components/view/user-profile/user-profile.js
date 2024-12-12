"use client";

import { Form, Collapse, message } from "antd";
import React, { useState } from "react";
import { BasicDetailsForm } from "./basic-details-form";
import { ChangeEmailForm } from "./change-email-form";
import { ChangePasswordForm } from "./change-password-form";
import CommonTypography from "@/components/shared/Typography";

const UserProfile = () => {
  const [basicDetailsForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // const [activeKey, setActiveKey] = useState(["1"]);

  const handleBasicDetailsSubmit = async (values) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("Profile updated successfully!");
      console.log("Basic details:", values);
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (values) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("Email updated successfully!");
      console.log("New email:", values);
    } catch (error) {
      message.error("Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("Password updated successfully!");
      console.log("Password updated");
      passwordForm.resetFields();
    } catch (error) {
      message.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: "1",
      label: "Basic Details",
      children: (
        <BasicDetailsForm
          form={basicDetailsForm}
          onFinish={handleBasicDetailsSubmit}
          loading={loading}
        />
      ),
    },
    {
      key: "2",
      label: "Change Email",
      children: (
        <ChangeEmailForm
          form={emailForm}
          onFinish={handleEmailSubmit}
          loading={loading}
        />
      ),
    },
    {
      key: "3",
      label: "Change Password",
      children: (
        <ChangePasswordForm
          form={passwordForm}
          onFinish={handlePasswordSubmit}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <div className="bg-background pt-24 px-12 h-screen w-full">
      <div>
        <div className=" flex flex-col py-4">
          <CommonTypography className="text-2xl font-semibold">
            Edit Profile
          </CommonTypography>
          <CommonTypography className="text-gray-500">
            Edit and manage your profile
          </CommonTypography>
        </div>

        <Collapse
          items={items}
          // activeKey={activeKey}
          // onChange={(keys) => setActiveKey(keys)}
          expandIconPosition="end"
          className="bg-white"
        ></Collapse>
      </div>
    </div>
  );
};

export default UserProfile;
