"use client";

import CommonButton from "@/components/shared/Button";
import CommonInput from "@/components/shared/CommonInput";
import { Form } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPassword } from "aws-amplify/auth";
import { useDispatch } from "react-redux";
import { setEmail } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";

const EmailVerification = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      const output = await resetPassword({ username: values.email });
      handleResetPasswordNextSteps(output);
      dispatch(setEmail(values.email));
      router.push("/new-password");
    } catch (err) {
      toast.error(err);
    }
  };
  function handleResetPasswordNextSteps(output) {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case "CONFIRM_RESET_PASSWORD_WITH_CODE":
        toast.info(`Confirmation code was sent to your email`);
        break;
      case "DONE":
        console.log("Successfully reset password.");
        break;
    }
  }
  return (
    <div className="relative w-full bg-background overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[140px]">
      <div className="flex flex-wrap ">
        <div className="w-full px-4 ">
          <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px]">
            <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
              Email Verification
            </h3>
            <p className="mb-11 text-center text-base font-medium text-secondary">
              Please verify your email for password reset code
            </p>

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

              <Form.Item>
                <CommonButton
                  htmlType="submit"
                  className="w-full bg-primary h-7 hover:bg-[#2d3a8c] text-white"
                  style={{ height: "45px" }}
                >
                  {/* {forgotPasswordLoader ? "Loading..." : "Confirm"} */}
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

export default EmailVerification;
