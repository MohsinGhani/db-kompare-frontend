"use client";

import { Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { BasicDetailsForm } from "./basic-details-form";
import { ChangeEmailForm } from "./change-email-form";
import { ChangePasswordForm } from "./change-password-form";
import CommonTypography from "@/components/shared/Typography";
import "./custom-collapse.scss";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const [userData, setUserData] = useState();
  const { userDetails } = useSelector((state) => state.auth);
  const userId = userDetails?.idToken["custom:userId"];
  const Y_API_KEY = process.env.NEXT_PUBLIC_Y_API_KEY;

  const fetchUserDetails = async () => {
    if (!userId) {
      console.warn("User ID is undefined. Skipping fetch.");
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
        setUserData(data);
      } else if (response.status === 404) {
        console.warn("User not found.");
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const items = [
    {
      key: "1",
      label: "Basic Details",
      children: <BasicDetailsForm userData={userData} />,
      className: "!px-0 mb-6 bg-[#FAFAFA]",
    },
    {
      key: "2",
      label: "Change Email",
      children: <ChangeEmailForm email={userData?.data?.email} />,
      className: "!px-0 mb-6 bg-[#FAFAFA]",
    },
    {
      key: "3",
      label: "Change Password",
      children: <ChangePasswordForm email={userData?.data?.email} />,
      className: "!px-0 mb-6 bg-[#FAFAFA]",
    },
  ];

  return (
    <div className="bg-white pt-24 px-12 h-full max-w-[75%] ">
      <div className="min-h-[calc(100vh-416px)] h-full">
        <div className=" flex flex-col py-4">
          <CommonTypography className="text-2xl font-semibold">
            Edit Profile
          </CommonTypography>
          <CommonTypography className="text-gray-500">
            Edit and manage your profile
          </CommonTypography>
        </div>

        <Collapse
          items={items}
          defaultActiveKey={["1", "2", "3"]}
          expandIconPosition="end"
          className=" border-none custom-collapse bg-white mt-2"
        ></Collapse>
      </div>
    </div>
  );
};

export default UserProfile;
