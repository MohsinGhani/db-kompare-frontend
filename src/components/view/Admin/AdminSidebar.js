// components/AdminSidebar.js
"use client";
import React from "react";
import { Menu } from "antd";
import { usePathname } from "next/navigation";
import CommonTypography from "@/components/shared/Typography";
import Image from "next/image";
import {
  DashOutlined,
  FolderAddFilled,
  SettingFilled,
  SmallDashOutlined,
} from "@ant-design/icons";

const menuItems = [
  {
    key: "/admin/quiz",
    label: "Quiz",
    icon: <FolderAddFilled />,
  },
  {
    key: "/admin/settings",
    label: "Settings",
    icon: <SettingFilled />,
  },
];

const AdminSidebar = ({ user, setUser }) => {
  const pathname = usePathname();

  return (
    <Menu mode="inline" className="!h-full bg-gray-50">
      <div className="flex items-center gap-2 my-4 mb-8 justify-center logo">
        <Image
          src={"/assets/icons/logo.gif"}
          alt="DB Logo"
          width={36}
          height={36}
          className="object-contain"
        />
        <CommonTypography className="text-lg font-semibold text-black">
          DB Kompare
        </CommonTypography>
      </div>
      {menuItems.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default AdminSidebar;
