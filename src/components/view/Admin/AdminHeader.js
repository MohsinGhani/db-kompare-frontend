import React from "react";
import { Layout } from "antd";

const { Header } = Layout;

const AdminHeader = ({ user, setUser }) => {
  return (
    <Header className="flex items-center justify-between   !p-2 !px-8 border-b !shadow-xl !h-auto">
      <img
        src="/assets/logo.png"
        alt="logo"
        className="h-16 w-auto object-contain"
      />
PP
    </Header>
  );
};

export default AdminHeader;