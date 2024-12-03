"use client";

import CommonButton from "@/components/shared/Button";
import Link from "next/link";
import googleIcon from "@/../public/assets/icons/googleIcon.svg";
import Image from "next/image";
import CommonInput from "@/components/shared/CommonInput";
import { Form } from "antd";

const SignIn = () => {
  const onFinish = async (values) => {
    try {
      console.log("Form values:", values);
    } catch (err) {
      console.error("Error:", err?.message);
    }
  };

  return (
    <div className="w-full overflow-hidden bg-background pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[140px]">
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10 sm:px-[60px] sm:py-10">
            <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl">
              Sign in to your account
            </h3>
            <p className="mb-6 text-center text-base font-medium text-secondary">
              Login to your account for a faster checkout.
            </p>
            <button className="border-stroke mb-6 flex w-full items-center justify-center gap-3 rounded-sm border bg-[#f8f8f8] px-6 py-3 text-lg text-secondary outline-none focus:outline-none hover:bg-[#f8f8f8]">
              <Image
                src={googleIcon}
                alt="Google Icon"
                width={20}
                height={20}
              />
              Sign in with Google
            </button>

            <div className="mb-8 flex items-center justify-center">
              <span className="hidden h-[1px] w-full max-w-[60px] bg-[#D9D9D9] sm:block"></span>
              <p className="w-full px-5 text-center text-base font-medium text-secondary">
                Or, sign in with your email
              </p>
              <span className="hidden h-[1px] w-full max-w-[60px] bg-[#D9D9D9] sm:block"></span>
            </div>

            <Form onFinish={onFinish} layout="vertical">
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

              <CommonInput
                label="Your Password"
                name="password"
                placeholder="Enter your password"
                inputType="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              />

              <Form.Item>
                <Link
                  href="/verification-code"
                  className="mb-[10px] mt-[-10px] block w-full text-right text-base font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
                <CommonButton
                  htmlType="submit"
                  className="w-full bg-primary h-7 hover:bg-[#2d3a8c] text-white"
                  style={{ height: "45px" }}
                >
                  Sign In
                </CommonButton>
              </Form.Item>
            </Form>

            <p className="text-center text-base font-medium text-body-color">
              Don’t you have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
