"use client";

import CommonButton from "@/components/shared/Button";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Checkbox, Form } from "antd";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import googleIcon from "@/../public/assets/icons/googleIcon.svg";
import githubIcon from "@/../public/assets/icons/githubIcon.svg";
import Image from "next/image";
import CommonInput from "@/components/shared/CommonInput";
import CommonModal from "@/components/shared/CommonModal";
import CommonTypography from "@/components/shared/Typography";
import { signUp } from "aws-amplify/auth";
import { useDispatch } from "react-redux";
import { setEmail } from "@/redux/slices/authSlice";
import { socialRegisteration } from "@/utils/authServices";
import { toast } from "react-toastify";

const API_BASE_URL_1 = process.env.NEXT_PUBLIC_API_BASE_URL_1;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const Y_API_KEY = process.env.NEXT_PUBLIC_Y_API_KEY;

  const checkUserExists = async (email) => {
    if (!email) {
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL_1}/is-user-exist?email=${email}`,
        {
          method: "GET",
          headers: {
            "x-api-key": Y_API_KEY,
          },
        }
      );

      const data = await response.json();
      return data?.data[0]?.email === email;
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const exists = await checkUserExists(values.email);
      if (exists) {
        toast.error("User already exists");
      } else {
        await signUp({
          username: values.email,
          password: values.password,
          options: {
            userAttributes: {
              name: values.name,
            },
          },
          autoConfirmUser: true,
        });
        dispatch(setEmail(values.email));
        setIsModal(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative w-full bg-background overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[120px]">
        <div className="flex flex-wrap ">
          <div className="w-full px-4 ">
            <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10  dark:bg-dark sm:px-[60px] sm:py-10">
              <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Create your account
              </h3>
              <p className="mb-6 text-center text-base font-medium text-secondary">
                It’s totally free and super easy
              </p>
              <button
                onClick={() => socialRegisteration("Google")}
                className="border-stroke mb-6 flex w-full items-center justify-center gap-3 rounded-sm border bg-white px-6 py-3 text-lg text-secondary outline-none focus:outline-none hover:bg-[#f8f8f8]"
              >
                <Image
                  src={googleIcon}
                  alt="Google Icon"
                  width={20}
                  height={20}
                />
                Sign in with Google
              </button>

              <button
                onClick={() => socialRegisteration({ custom: "GitHub" })}
                className="border-stroke mb-6 flex w-full items-center justify-center gap-3 rounded-sm border bg-white px-6 py-3 text-lg text-secondary outline-none focus:outline-none hover:bg-[#f8f8f8]"
              >
                <Image
                  src={githubIcon}
                  alt="Github Icon"
                  width={20}
                  height={20}
                />
                Sign in with Github
              </button>

              <div className="mb-8 flex items-center justify-center">
                <span className="hidden h-[1px] w-full max-w-[60px] bg-[#D9D9D9] sm:block"></span>
                <p className="w-full px-5 text-center text-base font-medium text-secondary">
                  Or, register with your email
                </p>
                <span className="hidden h-[1px] w-full max-w-[60px] bg-[#D9D9D9] sm:block"></span>
              </div>

              <Form onFinish={onFinish} layout="vertical">
                <CommonInput
                  label="Full Name"
                  name="name"
                  placeholder="Enter your full name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your full name",
                    },
                  ]}
                />

                <CommonInput
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  inputType="text"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email",
                      type: "email",
                    },
                  ]}
                />
                {/* <CommonInput
                  label="Confirm Email"
                  name="confirmEmail"
                  placeholder="Enter your email"
                  inputType="text"
                  dependencies={["email"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your email",
                      type: "email",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("email") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Email addresses do not match!")
                        );
                      },
                    }),
                  ]}
                /> */}

                <CommonInput
                  label="Your Password"
                  name="password"
                  placeholder="Enter your password"
                  inputType="password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                  ]}
                />

                {/* <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(
                                "Please accept the terms and conditions"
                              )
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    <p className="text-secondary text-base ">
                      By creating an account you agree to the{" "}
                      <span className="text-primary cursor-pointer">
                        Terms and Conditions
                      </span>{" "}
                      and{" "}
                      <span className="text-primary cursor-pointer">
                        Privacy Policy
                      </span>
                    </p>
                  </Checkbox>
                </Form.Item> */}

                <Form.Item>
                  <CommonButton
                    htmlType="submit"
                    className="w-full bg-primary h-7 hover:bg-[#2d3a8c] text-white"
                    style={{ height: "45px" }}
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Signup"}
                  </CommonButton>
                </Form.Item>
              </Form>
              <p className="text-center text-base font-medium text-body-color">
                Already using DB Kompare?{" "}
                <Link href="/signin" className="text-primary hover:underline ">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="absolute left-0 top-0 z-[-1]"></div>
      </div>

      <CommonModal
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModal(false)}
        handleOk={() => {}}
        closable
        centered
        width={500}
      >
        <div className="flex flex-col items-center justify-center gap-[4px]">
          <CheckCircleOutlined className="text-[40px] !text-primary" />

          <CommonTypography classes="text-base font-medium text-body-color">
            Success !!{" "}
          </CommonTypography>
          <CommonTypography classes="text-base font-medium text-body-color mb-4">
            Your account has been created successfully.
          </CommonTypography>
          <CommonButton onClick={() => router.push("/verification-code")}>
            Verify Email
          </CommonButton>
        </div>
      </CommonModal>
    </>
  );
};

export default Signup;
