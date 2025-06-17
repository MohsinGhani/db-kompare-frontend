import React from "react";
import { Avatar, Layout } from "antd";

const { Header } = Layout;

const AdminHeader = ({user}) => {
  return (
    <Header className="shadow-sm !bg-white leading-4 flex items-center justify-between">
      {user && (
        <div className=" flex items-center gap-2 w-full justify-end">
          <Avatar
            size={"large"}
            src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
          />
          <div className="flex flex-col">
            <p className="font-semibold">{user?.name}</p>
            <p>{user?.email}</p>
          </div>
        </div>
      )}
    </Header>
  );
};

export default AdminHeader;
