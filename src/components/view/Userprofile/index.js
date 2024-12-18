"use client";

import { Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { BasicDetailsForm } from "./basicdetailsForm";
import { ChangeEmailForm } from "./changeemailForm";
import { ChangePasswordForm } from "./changepasswordForm";
import CommonTypography from "@/components/shared/Typography";
import "./customCollapse.scss";
import { useSelector } from "react-redux";

const DATABASE_API_URL = process.env.NEXT_PUBLIC_DATABASE_API_URL;

const UserProfile = () => {
  const [userData, setUserData] = useState();
  const { userDetails } = useSelector((state) => state.auth);
  const userId = userDetails?.data?.data?.id;
  const Y_API_KEY = process.env.NEXT_PUBLIC_Y_API_KEY;

  const fetchUserDetails = async () => {
    if (!userId) {
      console.warn("User ID is undefined. Skipping fetch.");
      return;
    }

    try {
      const response = await fetch(
        `${DATABASE_API_URL}/get-user?id=${userId}`,
        {
          method: "GET",
          headers: {
            "x-api-key": Y_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
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
    <div className="bg-white lg:pt-28 lg:pl-28 lg:pb-12 h-full lg:max-w-[75%] px-8 pt-24 pb-8">
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
