"use client";

import React from "react";
import { Button, Layout } from "antd";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const { Content, Sider, Header } = Layout;

const AdminLayout = ({ children }) => {
  return (
    <Layout className="admin-layout">
      <Layout>
        {/* Sidebar */}
        <Sider
          width={250}
          collapsible
          breakpoint="lg"
          collapsedWidth="80"
          className=" !bg-white"
          trigger={null}
        >
          <AdminSidebar />
        </Sider>

        {/* Main Content */}
        <Layout className="!bg-white">
          <AdminHeader />
          <Content className="!p-6 content-box">{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
