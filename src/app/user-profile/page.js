"use client";
import CommonTypography from "@/components/shared/Typography";
import Blog from "@/components/view/Blog";
import UserProfile from "@/components/view/Userprofile";
import { Tabs } from "antd";
import React from "react";

export default function Page() {
  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: "1",
      label: "Profile",
      children: <UserProfile />,
    },
    {
      key: "2",
      label: "My Blogs",
      children: (
        <Blog
          route="/add-blog"
          text="Blogs"
          buttonText="Add Blog"
          secondText=" Edit and manage your blogs"
        />
      ),
    },
  ];

  return (
    <div className="container py-32">
      <div className="flex flex-col mb-5">
        <CommonTypography type="title">Edit Profile</CommonTypography>
        <CommonTypography classes="text-[#565758] text-base">
          Edit and manage your profile
        </CommonTypography>
      </div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
