"use client";

import CommonTypography from "@/components/shared/Typography";
import { Tabs } from "antd";
import React, { useState } from "react";
import Blog from "../Blog";
import UserProfileForm from "./userProfileForm";
import { BlogType } from "@/utils/const";

export default function UserProfile() {
  const [activeKey, setActiveKey] = useState("1");

  const onChange = (key) => {
    setActiveKey(key);
  };

  const items = [
    {
      key: "1",
      label: "Profile",
      children: <UserProfileForm />,
    },
    {
      key: "2",
      label: "My Blogs",
      children: (
        <Blog
          type={BlogType.BLOG}
          addroute="add-blog"
          text="Blogs"
          buttonText="Add Blog"
          secondText=" Edit and manage your blogs"
        />
      ),
    },
    {
      key: "3",
      label: "Saved Blogs",
      children: (
        <Blog
          type={BlogType.SAVED_BLOG}
          addroute="add-blog"
          text="Blogs"
          buttonText="Add Blog"
          secondText=" Edit and manage your blogs"
        />
      ),
    },
  ];

  return (
    <div className="container py-32 ">
      <div className="flex flex-col mb-5">
        <CommonTypography type="title">
          {activeKey === "1" ? "Profile" : "Blog"}
        </CommonTypography>
        <CommonTypography classes="text-[#565758] text-base">
          Edit and manage your {activeKey === "1" ? "Profile" : "Blog"}
        </CommonTypography>
      </div>
      <Tabs activeKey={activeKey} items={items} onChange={onChange} />
    </div>
  );
}
