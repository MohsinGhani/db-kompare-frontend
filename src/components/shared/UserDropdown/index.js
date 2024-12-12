import React from "react";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Space } from "antd";
import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { useSelector } from "react-redux";
import { selectUserDetails } from "@/redux/slices/authSlice";
import { RemoveAccessTokenFormCookies } from "@/utils/helper";
import { getInitials } from "@/utils/getInitials";

const CommonUserDropdown = () => {
  const router = useRouter();
  const loginUserDetails = useSelector(selectUserDetails);
  const userName = loginUserDetails?.idToken?.name;

  const handleMenuClick = async ({ key }) => {
    switch (key) {
      // case "2":
      //   router.push("/user-profile");
      //   break;
      case "3":
        router.push("/user-profile");
        break;
      case "4":
        await signOut();
        RemoveAccessTokenFormCookies();
        router.push("/");
        window.location.reload();
        break;
      default:
        break;
    }
  };

  const menu = {
    items: [
      {
        key: "1",
        label: "My Account",
        disabled: true,
      },
      {
        type: "divider",
      },
      // {
      //   key: "2",
      //   icon: <UserOutlined />,
      //   label: "Profile",
      // },
      {
        key: "3",
        icon: <SettingOutlined />,
        label: "Settings",
      },
      {
        key: "4",
        icon: <LogoutOutlined />,
        label: "Logout",
      },
    ],
    onClick: handleMenuClick,
    className: "!mt-3",
  };

  return (
    <Dropdown menu={menu} trigger={["click"]} className="cursor-pointer">
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Avatar className="bg-[#F6F6FF] text-[#3E53D7] w-9 h-9 ">
            {getInitials(userName)}
          </Avatar>
          <span className="capitalize">{userName}</span>
          <DownOutlined className="text-xs" />
        </Space>
      </a>
    </Dropdown>
  );
};

export default CommonUserDropdown;
