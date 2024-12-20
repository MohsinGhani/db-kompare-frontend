import React from "react";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Space } from "antd";
import { useRouter } from "nextjs-toploader/app";
import { signOut } from "aws-amplify/auth";
import { useSelector } from "react-redux";
import { selectUserDetails } from "@/redux/slices/authSlice";
import { RemoveAccessTokenFormCookies } from "@/utils/helper";
import { getInitials } from "@/utils/getInitials";

const CommonUserDropdown = () => {
  const router = useRouter();
  const loginUserDetails = useSelector(selectUserDetails);
  const userName = loginUserDetails?.data?.data?.name;

  const handleMenuClick = async ({ key }) => {
    switch (key) {
      case "1":
        router.push("/user-profile");
        break;
      case "2":
        await signOut();
        RemoveAccessTokenFormCookies();
        window.location.href = "/";
        break;
      default:
        break;
    }
  };

  const menu = {
    items: [
      {
        key: "1",
        icon: <SettingOutlined className="pr-3 !text-lg " />,
        label: "Settings",
        className:
          "h-14 !pl-5 !text-sm !bg-gray-100 hover:!bg-[#dce0f8] hover:!text-[#3E53D7] !rounded-none transition-all !cursor-pointer ",
      },
      {
        key: "2",
        icon: <LogoutOutlined className="pr-3 !text-lg" />,
        label: "Logout",
        className:
          "h-14 !pl-6 !text-sm !bg-gray-100 hover:!bg-[#dce0f8] hover:!text-[#3E53D7] !rounded-none transition-all !cursor-pointer",
      },
    ],
    onClick: handleMenuClick,
    className: "!mt-5 w-48 !bg-white !px-0 !rounded-none",
  };

  return (
    <Dropdown
      menu={menu}
      trigger={["click"]}
      className="cursor-pointer"
      placement="bottom"
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Avatar className="bg-[#F6F6FF] text-[#3E53D7] w-9 h-9 ">
            {getInitials(userName)}
          </Avatar>
          <div className="lg:block hidden">
            <span className="capitalize">{userName}</span>
            <DownOutlined className="text-xs ml-2" />
          </div>
        </Space>
      </a>
    </Dropdown>
  );
};

export default CommonUserDropdown;
