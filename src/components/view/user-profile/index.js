"use client";

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Form, Input, Button } from "antd";
import React from "react";
import CommonButton from "@/components/shared/Button"; // Ensure the path is correct
import CommonInput from "@/components/shared/CommonInput"; // Ensure the path is correct

export default function UserProfile() {
  // Define the form instance
  const [form] = Form.useForm();

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form Data Saved:", values);
        alert("Form Data Saved!");
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  return (
    <div className="bg-background pt-24 h-screen w-full">
      <div className="relative w-full bg-background overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[10px]">
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="mx-auto w-4/6 rounded bg-white px-6 py-5 shadow-three">
              <h3 className="mb-3 text-start text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Edit Profile
              </h3>
              <div>
                <Form form={form} layout="vertical">
                  {/* <div className=" w-full py-6 text-center">
                    <Avatar
                      size={{
                        xs: 80,
                        sm: 90,
                        md: 90,
                        lg: 120,
                        xl: 130,
                        xxl: 150,
                      }}
                      icon={<UserOutlined />}
                    />
                  </div> */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <CommonInput
                      label="Full Name"
                      name="name"
                      placeholder="John"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your full name",
                        },
                      ]}
                    />

                    <CommonInput
                      label="Last Name"
                      name="lastName"
                      placeholder="John"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your last name",
                        },
                      ]}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row mt-2 gap-4">
                    <CommonInput
                      label="Email"
                      name="email"
                      placeholder="abc@gmail.com"
                      rules={[
                        {
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}
                    />

                    <CommonInput
                      label="Phone Number"
                      placeholder="123 456 7890"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your phone number",
                        },
                      ]}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row mt-2 gap-4">
                    <CommonInput
                      label="Country"
                      name="country"
                      placeholder="United States"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your country",
                        },
                      ]}
                    />

                    <CommonInput
                      label="City"
                      name="city"
                      placeholder="New York"
                      rules={[
                        { required: true, message: "Please enter your city" },
                      ]}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row mt-2 gap-4">
                    <CommonInput
                      label="State"
                      placeholder="New York"
                      name="state"
                      rules={[
                        { required: true, message: "Please enter your state" },
                      ]}
                    />

                    <CommonInput
                      label="Zipcode"
                      name="zipcode"
                      placeholder="10001"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your zipcode",
                        },
                      ]}
                    />
                  </div>
                  {/* Buttons */}
                  <div className="md:flex justify-end gap-3 mt-4">
                    <CommonButton
                      className="bg-transparent border md:w-60 w-full mb-3 text-black h-7 hover:bg-[#2d3a8c]"
                      style={{ height: "45px" }}
                      onClick={() => form.resetFields()}
                    >
                      Cancel
                    </CommonButton>
                    <CommonButton
                      onClick={handleSave}
                      className="bg-primary h-7 md:w-60 w-full mb-3 hover:bg-[#2d3a8c] text-white"
                      style={{ height: "45px" }}
                    >
                      Save Changes
                    </CommonButton>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
