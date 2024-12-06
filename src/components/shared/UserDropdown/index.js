import React from "react";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Space } from "antd";
import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { useSelector } from "react-redux";
import { selectUserDetails, setEmail } from "@/redux/slices/authSlice";
import { RemoveAccessTokenFormCookies } from "@/utils/helper";

const items = [
  {
    key: "1",
    label: "My Account",
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: "Profile",
    href: "/user-profile",
  },
  {
    key: "3",
    label: "Settings",
    icon: <SettingOutlined />,
  },
  {
    key: "4",
    icon: <LogoutOutlined />,
    label: "Logout",
  },
];

const CommonUserDropdown = () => {
  const route = useRouter();
  const loginUserDetails = useSelector(selectUserDetails);
  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part[0].toUpperCase()).join("");
    return initials;
  };

  const userName = loginUserDetails?.idToken?.name;
  return (
    <Dropdown
      menu={
        <Menu
          items={items.map((item) => ({
            ...item,
            onClick: async () => {
              if (item.href) {
                route.push(item.href);
              } else if (item.label === "Logout") {
                await signOut();
                RemoveAccessTokenFormCookies();
                route.push("/signin");
              }
            },
          }))}
        />
      }
      trigger={["click"]}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Avatar style={{ backgroundColor: "#F6F6FF", color: "#3E53D7" }}>
            {getInitials(userName)}
          </Avatar>
          {loginUserDetails?.idToken?.name}
          <DownOutlined style={{ fontSize: "12px" }} />
        </Space>
      </a>
    </Dropdown>
  );
};

export default CommonUserDropdown;
