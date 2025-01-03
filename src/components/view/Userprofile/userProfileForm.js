"use client";

import { Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { BasicDetailsForm } from "./basicdetailsForm";
import { ChangeEmailForm } from "./changeemailForm";
import { ChangePasswordForm } from "./changepasswordForm";
import "./customCollapse.scss";
import { useSelector } from "react-redux";

const UserProfileForm = () => {
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
      className: "!px-0 bg-[#FAFAFA]",
    },
  ];

  return (
    <div className="bg-white h-full lg:max-w-[75%] mb-32">
      <div className="min-h-full h-full">
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

export default UserProfileForm;
