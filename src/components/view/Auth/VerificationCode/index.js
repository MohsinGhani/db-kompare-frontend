"use client";

import CommonButton from "@/components/shared/Button";
import { selectEmail } from "@/redux/slices/authSlice";
import { Button, Form, Input } from "antd";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CodeVerification = () => {
  const [loading, setLoading] = useState(false);
  const [sendingCodeLoading, setSendingCodeLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
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
      setSendingCodeLoading(true);
      await resendSignUpCode({ username: email });
      toast.success("Verfication code sent successfully");
      setCountdown(60);
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setSendingCodeLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);
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
                  style={{ width: "100%", height: "50px" }}
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

            <div className="flex justify-end mt-1 mb-5 -mr-2">
              <Button
                className={`!bg-none !focus:none !shadow-none !border-none hover:!border-none text-[#2d3a8c] font-medium ${
                  countdown > 0 ? "cursor-not-allowed opacity-70" : ""
                }`}
                onClick={handleResendCode}
                loading={sendingCodeLoading}
                disabled={sendingCodeLoading || countdown > 0}
                style={{ background: "none", color: "#2d3a8c" }}
              >
                {sendingCodeLoading
                  ? "Resending Code..."
                  : countdown > 0
                  ? `Resend Code (${countdown}s)`
                  : "Resend Code"}
              </Button>
            </div>

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
