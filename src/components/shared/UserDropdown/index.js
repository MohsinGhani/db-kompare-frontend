import React from "react";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import { useRouter } from "next/navigation";

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
  return (
    <Dropdown
      overlay={
        <Menu
          items={items.map((item) => ({
            ...item,
            onClick: () => {
              if (item.href) {
                route.push(item.href);
              }
            },
          }))}
        />
      }
      trigger={["click"]}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <UserOutlined />
          Alex John
          <DownOutlined style={{ fontSize: "12px" }} />
        </Space>
      </a>
    </Dropdown>
  );
};

export default CommonUserDropdown;
