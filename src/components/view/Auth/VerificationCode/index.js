"use client";

import CommonButton from "@/components/shared/Button";
import CommonTypography from "@/components/shared/Typography";
import { selectEmail } from "@/redux/slices/authSlice";
import { Form, Input } from "antd";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CodeVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const router = useRouter();
  const email = useSelector(selectEmail);

  const onFinish = async () => {
    try {
      setLoading(true);
      await confirmSignUp({
        username: email,
        confirmationCode: otpCode,
      });
      router.push("/signin");
      toast.success("Account verified successfully");
    } catch (err) {
      console.log("err", err);
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  const onChange = (text) => {
    setOtpCode(text);
  };
  const sharedProps = {
    onChange,
  };
  const handleResendCode = async () => {
    try {
      await resendSignUpCode({ username: email });
      toast.success("Verfication code sent successfully");
    } catch (err) {
      toast.error(err?.message);
    }
  };
  return (
    <div className="relative w-full bg-background overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[190px]">
      <div className="flex flex-wrap ">
        <div className="w-full px-4 ">
          <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px]">
            <h3 className="mb-3 text-center text-2xl font-bold !text-black !dark:text-white sm:text-3xl">
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
              <Form.Item className="mb-0">
                <CommonButton
                  htmlType="submit"
                  className="w-full bg-primary h-7 hover:bg-[#2d3a8c] text-white"
                  style={{ height: "45px" }}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? "Confirming..." : "Confirm"}
                </CommonButton>
              </Form.Item>
            </Form>

            <CommonTypography
              type="link"
              className=" text-[#2d3a8c] font-normal mt-2 mb-4 flex justify-end"
              onClick={handleResendCode}
            >
              Resend Code
            </CommonTypography>

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
