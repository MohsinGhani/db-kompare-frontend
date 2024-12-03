"use client";

import CommonButton from "@/components/shared/Button";
import CommonInput from "@/components/shared/CommonInput";
import { Form } from "antd";
import Link from "next/link";

const NewPassword = () => {
  const onFinish = async (values) => {
    try {
      console.log("values", values);
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return (
    <div className="relative w-full bg-background overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[140px]">
      <div className="flex flex-wrap ">
        <div className="w-full px-4 ">
          <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px]">
            <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
              New Password
            </h3>
            <p className="mb-11 text-center text-base font-medium text-secondary">
              Please check your email for password reset code
            </p>

            <Form onFinish={onFinish} layout="vertical">
              <CommonInput
                label="OTP"
                name="confirmationCode"
                placeholder="Enter your OTP"
                inputType="text"
                rules={[
                  {
                    required: true,
                    message: "Please enter your otp",
                    type: "text",
                  },
                ]}
              />
              <CommonInput
                label="Password"
                name="password"
                placeholder="Enter your password"
                inputType="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password",
                  },
                ]}
              />
              <CommonInput
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm your password"
                inputType="password"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Confirm password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              />

              <Form.Item>
                <CommonButton
                  htmlType="submit"
                  className="w-full bg-primary h-7 hover:bg-[#2d3a8c] text-white"
                  style={{ height: "45px" }}
                >
                  Confirm
                </CommonButton>
              </Form.Item>
            </Form>

            <p className="text-center text-base font-medium text-body-color">
              Continue to DB Kompare{" "}
              <Link href="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
