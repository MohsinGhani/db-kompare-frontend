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
import Achievements from "./Achievements";

export default function UserProfile() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // derive the activeKey from the `tab` query, defaulting to "1"
  const activeKey = searchParams.get("tab") || "1";

  // update URL when the tab changes
  const onChange = (key) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const { userDetails } = useSelector((state) => state.auth);
  const user = userDetails?.data?.data;

  const tabConfig = {
    1: {
      label: "Profile",
      subtitle: "Edit and manage your profile",
      content: <UserProfileForm />,
    },
    2: {
      label: "My Blogs",
      subtitle: "Create, edit, and manage your blogs",
      content: (
        <Blog
          type={BlogType.BLOG}
          addroute="add-blog"
          text="Blogs"
          buttonText="Add Blog"
          secondText="Edit and manage your blogs"
        />
      ),
    },
    3: {
      label: "Saved Blogs",
      subtitle: "View and manage your saved blogs",
      content: (
        <Blog
          type={BlogType.SAVED_BLOG}
          addroute="add-blog"
          secondText="Edit and manage your blogs"
        />
      ),
    },
    4: {
      label: "Profile Reports",
      subtitle: "View and analyze your profiling reports",
      content: <ProfilingReport user={user} />,
    },
    5: {
      label: "Achievements",
      subtitle: "View your achievements and milestones",
      content: <Achievements user={user} />,
    },
  };

  const currentTab = tabConfig[activeKey] || tabConfig["1"];

  // Build the items array for Tabs
  const items = Object.entries(tabConfig).map(([key, { label, content }]) => ({
    key,
    label,
    children: content,
  }));

  return (
    <div className="container pt-32 min-h-[560px]">
      <div className="flex flex-col mb-5">
        <CommonTypography type="title">{currentTab.label}</CommonTypography>
        <CommonTypography classes="text-[#565758] text-base">
          {currentTab.subtitle}
        </CommonTypography>
      </div>
      <Tabs activeKey={activeKey} items={items} onChange={onChange} />
    </div>
  );
}
