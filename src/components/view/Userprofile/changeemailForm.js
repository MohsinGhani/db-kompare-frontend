"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import {
  updateUserAttribute,
  confirmUserAttribute,
  fetchAuthSession,
} from "aws-amplify/auth";
import { toast } from "react-toastify";
import CommonModal from "@/components/shared/CommonModal";
import CommonButton from "@/components/shared/Button";
import { useSelector } from "react-redux";
import { ProviderType } from "@/utils/const";

const API_BASE_URL_1 = process.env.NEXT_PUBLIC_API_BASE_URL_1;

export const ChangeEmailForm = ({ email }) => {
  const { userDetails } = useSelector((state) => state.auth);

  const userId = userDetails?.data?.data?.id;

  const [emailLoading, setEmailLoading] = useState(false);
  const [emailModalLoading, setEmailModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [emailForm] = Form.useForm();
  const [providerName, setProviderName] = useState("");

  const handleEmailSubmit = async (values) => {
    const newEmail = values.email;

    if (newEmail.trim().toLowerCase() === email.trim().toLowerCase()) {
      toast.info("The new email is the same as the current email.");
      return;
    }
    try {
      setEmailLoading(true);
      await updateUserAttribute({
        userAttribute: {
          attributeKey: "email",
          value: newEmail,
        },
      });
      toast.success("Verification Code is sent to your email successfully");
      setIsModalOpen(true);
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const onFinish = async () => {
    if (!otpCode) return;

    try {
      setEmailModalLoading(true);
      await confirmUserAttribute({
        confirmationCode: otpCode,
        userAttributeKey: "email",
      });

      const email = emailForm.getFieldValue("email");

      const payload = {
        id: userId,
        email,
      };

      await fetch(`${API_BASE_URL_1}/update-user`, {
        method: "POST",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_Y_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast.success("Email updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setEmailModalLoading(false);
    }
  };

  const onChange = (text) => {
    setOtpCode(text);
  };

  const sharedProps = {
    onChange,
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const session = await fetchAuthSession();
        if (session) {
          const identities = session?.tokens?.idToken?.payload?.identities;
          if (identities && identities.length > 0) {
            setProviderName(identities[0]?.providerName || "");
          }
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (email) {
      emailForm.setFieldsValue({
        email: email,
      });
    }
  }, [email, emailForm]);

  return (
    <div>
      {providerName === ProviderType.GOOGLE && (
        <div className=" p-3 rounded bg-yellow-100 border border-yellow-300 text-yellow-800">
          <p className="text-sm font-medium">
            To update your email, please create a new account with the new
            address.
          </p>
        </div>
      )}
      <Form
        form={emailForm}
        layout="vertical"
        onFinish={handleEmailSubmit}
        className=" bg-[#FAFAFA] p-4"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            className="h-9"
            disabled={providerName === ProviderType.GOOGLE}
          />
        </Form.Item>

        <Form.Item className="mb-1">
          <Button
            type="primary"
            htmlType="submit"
            loading={emailLoading}
            disabled={emailLoading || providerName === ProviderType.GOOGLE}
            className={`bg-[#3E53D7] ${
              providerName === ProviderType.GOOGLE ? "pointer-events-none" : ""
            }`}
          >
            {emailLoading ? "Loading..." : "Change Email"}
          </Button>
        </Form.Item>
      </Form>
      <CommonModal
        destroyOnClose
        isModalOpen={isModalOpen}
        handleCancel={() => {
          setIsModalOpen(false);
          setOtpCode("");
        }}
        handleOk={() => {}}
        closable
        centered
        width={500}
      >
        <div className="flex flex-wrap w-full">
          <div className="w-full sm:px-4 ">
            <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-6 sm:py-10 shadow-three dark:bg-dark ">
              <h3 className="mb-3 text-center text-2xl font-bold !text-black dark:text-white sm:text-3xl">
                Code Verification
              </h3>
              <p className="mb-8 text-center text-base font-medium text-secondary">
                Please enter the code we sent to your email.{" "}
              </p>

              <Form layout="vertical" onFinish={onFinish}>
                <div className="my-5">
                  <Input.OTP
                    style={{ width: "100%", height: "50px" }}
                    {...sharedProps}
                  />
                </div>

                <Form.Item>
                  <CommonButton
                    htmlType="submit"
                    className={`w-full bg-primary h-7 hover:bg-[#2d3a8c] text-white ${
                      otpCode.length !== 6 ? "pointer-events-none" : ""
                    }`}
                    style={{ height: "45px" }}
                    loading={emailModalLoading}
                    disabled={emailModalLoading || otpCode.length !== 6}
                  >
                    {emailModalLoading ? "Confirming..." : "Confirm"}
                  </CommonButton>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </CommonModal>
    </div>
  );
};
