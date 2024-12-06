"use client";

import CommonButton from "@/components/shared/Button";
import { selectEmail } from "@/redux/slices/authSlice";
import { Form, Input } from "antd";
import { confirmSignUp } from "aws-amplify/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CodeVerification = () => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const email = useSelector(selectEmail);
  const onFinish = async () => {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: otpCode,
      });
      router.push("/signin");
      toast.success("Account verified successfully");
    } catch (err) {
      console.log("err", err);
      setError(err?.message);
    }
  };
  const onChange = (text) => {
    setOtpCode(text);
  };

  const sharedProps = {
    onChange,
  };
  return (
    <div className="relative  w-full bg-background overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[190px]">
      <div className="flex flex-wrap ">
        <div className="w-full px-4 ">
          <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px]">
            <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
              Code Verification
            </h3>
            <p className="mb-8 text-center text-base font-medium text-secondary">
              Please enter the code we sent to your email.{" "}
            </p>

            <Form onFinish={onFinish} layout="vertical">
              <div className="my-5">
                <Input.OTP
                  type="number"
                  style={{ width: "100%" }}
                  formatter={(str) => str.toUpperCase()}
                  {...sharedProps}
                />
              </div>
              {error && (
                <p className="text-red-500 text-base my-2 text-start">
                  {error}
                </p>
              )}
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

export default CodeVerification;
