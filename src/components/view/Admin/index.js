"use client";

import React from "react";
import { Button, Layout } from "antd";
import AdminSidebar from "./AdminSidebar";


const { Content, Sider ,Header } = Layout;

const AdminLayout = ({ children }) => {

  return (
    <Layout className="admin-layout">
      <Layout>
        {/* Sidebar */}
        <Sider
          width={200}
          collapsible
          breakpoint="lg"
          collapsedWidth="80"
          className="!min-h-screen !overflow-auto !bg-white"
          trigger={null}
        >
          <AdminSidebar/>
        </Sider>

        {/* Main Content */}
        <Layout className="!bg-white ">
                 <Header className="shadow-sm bg-white" >
       
        </Header>
          <Content style={{ margin: 0, minHeight: 280 }}>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;