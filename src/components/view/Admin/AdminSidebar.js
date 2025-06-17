"use client";
import React from "react";
import { Button, Menu } from "antd";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import CommonTypography from "@/components/shared/Typography";
import Image from "next/image";
import {
  AppstoreFilled,
  FolderAddFilled,
  LogoutOutlined,
  PictureFilled,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { handleLogout } from "@/utils/helper";

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
  {
    key: "/admin/categories",
    label: "Categories",
    icon: <AppstoreFilled />,
  },
];

const AdminSidebar = ({ user, setUser }) => {
  const pathname = usePathname();
  const router = useRouter();

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
        <div className="flex justify-center">
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className=" absolute bottom-2 bg-red-700/65 text-white !border-none !outline-none hover:!text-white hover:!outline-none hover:!border-none hover:!bg-red-800/80 w-full  max-w-[80%]"
          >
            Logout
          </Button>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
