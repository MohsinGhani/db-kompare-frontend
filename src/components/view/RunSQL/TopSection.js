"use client";

import React, { useState } from "react";
import {
  AlignLeftOutlined,
  EllipsisOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Input, Drawer, List, Spin } from "antd";
import dayjs from "dayjs";
import { getUserFiddles } from "@/utils/runSQL";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-toastify";
import CommonLoader from "@/components/shared/CommonLoader";
dayjs.extend(relativeTime);

const TopSection = ({ user, fiddle }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fiddles, setFiddles] = useState([]);

  // Replace with the actual logged in userId or use props/context

  const openDrawer = async () => {
    setDrawerVisible(true);
    setLoading(true);
    try {
      const fiddlesData = await getUserFiddles(user?.id);
      setFiddles(fiddlesData?.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching fiddles", error);
      setLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <div className="bg-[#FFF6F1] w-full 2xl:px-20 lg:pl-6 px-3 h-16 mb-8 flex justify-between items-center ">
      <AlignLeftOutlined
        className="text-2xl cursor-pointer text-gray-600"
        onClick={openDrawer}
      />
      <div className="w-[300px]">
        <Input placeholder="Fiddle Name" size="large" value={fiddle?.name} />
      </div>
      <Button type="default" icon={<SaveOutlined />}>
        Save
      </Button>
      <FiddleDrawer
        onClose={closeDrawer}
        open={drawerVisible}
        fiddles={fiddles}
        loading={loading}
      />
    </div>
  );
};

export default TopSection;

// Fiddle Drawer
const FiddleDrawer = ({ onClose, open, fiddles, loading }) => {
  return (
    <Drawer title="Your Fiddles" placement="left" onClose={onClose} open={open}>
      {loading ? (
        <CommonLoader />
      ) : (
        <List
          bordered={false}
          dataSource={fiddles}
          renderItem={(item) => (
            <List.Item className="mb-2 p-1 bg-white rounded-md shadow-sm flex items-center justify-between border !px-3">
              <Link href={`/run/${item?.id}`} className="hover:text-primary">
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold text-base hover:text-primary">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created{" "}
                      {dayjs(item.updatedAt || item.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </Link>
              <div>
                <EllipsisOutlined className="text-xl text-gray-600 cursor-pointer" />
              </div>
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};
