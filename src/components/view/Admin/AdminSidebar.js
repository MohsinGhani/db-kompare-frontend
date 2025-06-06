"use client";
import React from "react";
import { Button, Menu } from "antd";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import CommonTypography from "@/components/shared/Typography";
import Image from "next/image";
import {
  DashboardFilled,
  FolderAddFilled,
  LogoutOutlined,
  PictureFilled,
  QuestionCircleFilled,
  SettingFilled,
} from "@ant-design/icons";
import { RemoveAccessTokenFormCookies } from "@/utils/helper";
import { signOut } from "@aws-amplify/auth";

const menuItems = [

  {
    key: "/admin/quiz",
    label: "Quizzes",
    icon: <FolderAddFilled />,
  },
  {
    key: "/admin/questions",
    label: "Questions Bank",
    icon: <QuestionCircleFilled />,
  },
  {
    key: "/admin/gallery",
    label: "Gallery",
    icon: <PictureFilled />,
  },

];

const AdminSidebar = ({ user, setUser }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    RemoveAccessTokenFormCookies();
    window.location.href = "/";
  };

  const onMenuClick = ({ key }) => {
    if (pathname !== key) {
      router.push(key);
    }
  };

  return (
    <>
      <div className=" flex items-center gap-2 my-4 mb-8 justify-center logo">
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
      <Menu
        items={menuItems}
        mode="inline"
        className=" bg-gray-50 !min-h-[(100vh-64px)]"
        selectedKeys={[pathname]}
        onClick={onMenuClick}
      />
      {user && (
        <Button
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className=" absolute bottom-2 bg-red-700/65 text-white hover:!bg-red-700/80 w-full flex items-center justify-center"
        >
          Logout
        </Button>
      )}
    </>
  );
};

export default AdminSidebar;
