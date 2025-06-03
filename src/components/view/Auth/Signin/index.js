"use client";

import CommonButton from "@/components/shared/Button";
import Link from "next/link";
import googleIcon from "@/../public/assets/icons/googleIcon.svg";
import githubIcon from "@/../public/assets/icons/githubIcon.svg";
import linkedInIcon from "@/../public/assets/icons/linkedInIcon.png";
import Image from "next/image";
import CommonInput from "@/components/shared/CommonInput";
import { Form } from "antd";
import { signIn } from "aws-amplify/auth";
import { useRouter } from "nextjs-toploader/app";
import { setEmail, setUserDetails } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import {
  setAccessTokenFromLocalStorage,
  validateSession,
} from "@/utils/helper";
import { socialRegisteration } from "@/utils/authServices";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const API_BASE_URL_1 = process.env.NEXT_PUBLIC_API_BASE_URL_1;

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const dispatch = useDispatch();
  const Y_API_KEY = process.env.NEXT_PUBLIC_Y_API_KEY;

  const redirectParam = searchParams?.get("redirect");

  const isValidRedirect = (path) => {
    return path && path.startsWith("/");
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await signIn({
        username: values.email,
        password: values.password,
      });

      const session = await fetchAuthSession();
      const idToken = session.tokens.idToken.payload;

      const userId = idToken["custom:userId"];
      handleLogin(userId);
    } catch (err) {
      console.error("Sign-in error:", err?.message);
      setLoading(false);
      if (
        err.message &&
        err.message.includes(
          "Cannot read properties of undefined (reading 'idToken')"
        )
      ) {
        dispatch(setEmail(values.email));
        router.replace("/verification-code");
      } else {
        toast.error(err?.message);
      }
    }
  };

  const handleLogin = async (userId) => {
    if (!userId) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL_1}/get-user?id=${userId}`, {
        method: "GET",
        headers: {
          "x-api-key": Y_API_KEY,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(setUserDetails({ data }));
        setAccessTokenFromLocalStorage();
        const redirectPath = isValidRedirect(redirectParam)
          ? decodeURIComponent(redirectParam)
          : "/";
        router.replace(redirectPath);
      } else if (response.status === 404) {
        console.warn("User not found.");
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const resp = validateSession();
  }, []);
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
            <button
              onClick={() => socialRegisteration("Google", redirect)}
              className="border-stroke mb-6 flex w-full items-center justify-center gap-3 rounded-sm border bg-white px-6 py-3 text-lg text-secondary outline-none focus:outline-none hover:bg-[#f8f8f8]"
            >
              <Image
                src={googleIcon}
                alt="Google Icon"
                width={20}
                height={20}
              />
              Continue with Google
            </button>
            <button
              onClick={() =>
                socialRegisteration({ custom: "GitHub" }, redirect)
              }
              className="border-stroke mb-6 flex w-full items-center justify-center gap-3 rounded-sm border bg-white px-6 py-3 text-lg text-secondary outline-none focus:outline-none hover:bg-[#f8f8f8]"
            >
              <Image
                src={githubIcon}
                alt="Github Icon"
                width={20}
                height={20}
              />
              Continue with Github
            </button>
            <button
              onClick={() =>
                socialRegisteration({ custom: "LinkedIn" }, redirect)
              }
              className="border-stroke mb-6 flex w-full items-center justify-center gap-3 rounded-sm border bg-white px-6 py-3 text-lg text-secondary outline-none focus:outline-none hover:bg-[#f8f8f8]"
            >
              <Image
                src={linkedInIcon}
                alt="Github Icon"
                width={20}
                height={20}
              />
              Continue with LinkedIn
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
                  href="/email-verification"
                  className="mb-[10px] mt-[-10px] block w-full text-right text-base font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </Link>

                <CommonButton
                  htmlType="submit"
                  className="w-full bg-primary h-7 hover:bg-[#2d3a8c] text-white flex items-center justify-center gap-2"
                  style={{ height: "45px" }}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
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
