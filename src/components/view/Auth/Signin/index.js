"use client";

import CommonButton from "@/components/shared/Button";
import Link from "next/link";
import googleIcon from "@/../public/assets/icons/googleIcon.svg";
import Image from "next/image";
import CommonInput from "@/components/shared/CommonInput";
import { Form } from "antd";
import { signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { setEmail, setUserDetails } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { setAccessTokenFromLocalStorage } from "@/utils/helper";
import { socialRegisteration } from "@/utils/authServices";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const Y_API_KEY = process.env.NEXT_PUBLIC_Y_API_KEY;

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
        router.push("/verification-code");
      } else {
        setError(err.message);
      }
    }
  };

  const handleLogin = async (userId) => {
    if (!userId) {
      return;
    }

    try {
      const response = await fetch(
        `https://b8iy915ig0.execute-api.eu-west-1.amazonaws.com/dev/get-user?id=${userId}`,
        {
          method: "GET",
          headers: {
            "x-api-key": Y_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        dispatch(setUserDetails({ data }));
        setAccessTokenFromLocalStorage();
        router.push("/");
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
              onClick={() => socialRegisteration("Google")}
              className="border-stroke mb-6 flex w-full items-center justify-center gap-3 rounded-sm border bg-[#f8f8f8] px-6 py-3 text-lg text-secondary outline-none focus:outline-none hover:bg-[#f8f8f8]"
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
              onClick={() => socialRegisteration("Google")}
              className="border-stroke mb-6 flex w-full items-center justify-center gap-3 rounded-sm border bg-[#f8f8f8] px-6 py-3 text-lg text-secondary outline-none focus:outline-none hover:bg-[#f8f8f8]"
            >
              <Image
                src={googleIcon}
                alt="Google Icon"
                width={20}
                height={20}
              />
              Sign in with Github
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
                {error && (
                  <p className="text-red-500 text-base my-2 text-start">
                    {error}
                  </p>
                )}
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
