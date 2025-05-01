"use client";

import CommonTypography from "@/components/shared/Typography";
import { Tabs } from "antd";
import React from "react";
import Blog from "../Blog";
import UserProfileForm from "./userProfileForm";
import { BlogType } from "@/utils/const";
import ProfilingReport from "./ProfilingReport";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function UserProfile() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1) derive the activeKey from the `tab` query, defaulting to "1"
  const activeKey = searchParams.get("tab") || "1";

  // 2) when the tab changes, update the URL with the new `tab` param
  const onChange = (key) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const { userDetails } = useSelector((state) => state.auth);
  const user = userDetails?.data?.data;

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
          secondText=" Edit and manage your blogs"
        />
      ),
    },
    {
      key: "4",
      label: "Profile Reports",
      children: <ProfilingReport user={user} />,
    },
  ];

  return (
    <div className="container pt-32 min-h-[560px]">
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
