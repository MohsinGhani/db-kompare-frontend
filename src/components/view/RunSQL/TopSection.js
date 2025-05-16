"use client";

import React, { useEffect, useState } from "react";
import {
  AlignLeftOutlined,
  EllipsisOutlined,
  PlusCircleFilled,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Input, Drawer, List, Spin } from "antd";
import dayjs from "dayjs";
import { addFiddle, getUserFiddles, updateFiddle } from "@/utils/runSQL";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-toastify";
import CommonLoader from "@/components/shared/CommonLoader";
dayjs.extend(relativeTime);

const TopSection = ({ user, fiddle, fetchData }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [fiddleName, setFiddleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [fiddles, setFiddles] = useState([]);

  // Replace with the actual logged in userId or use props/context
  useEffect(() => {
    setFiddleName(fiddle?.name || "");
  }, [fiddle]);

  const openDrawer = async () => {
    setDrawerVisible(true);
    setLoading(true);
    try {
      if (!user) {
        setLoading(false);
        return;
      }
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

  const handleSave = async () => {
    if (!user) {
      toast("😀 Please login first, It's totally free!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }

    setSaveLoading(true);
    const payload = {
      ...fiddle,
      name: fiddleName,
    };
    try {
      await updateFiddle(payload, fiddle?.id);
      await fetchData(fiddle?.id);
      toast.success("Fiddle saved successfully!");
    } catch (error) {
      toast.error("Error saving fiddle", error);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="bg-[#FFF6F1] w-full 2xl:px-20 lg:pl-6 px-3 h-16 mb-4 flex justify-between items-center ">
      <AlignLeftOutlined
        className="text-2xl cursor-pointer text-gray-600"
        onClick={openDrawer}
      />
      <div className="w-[300px]">
        <Input
          placeholder="Fiddle Name"
          size="large"
          value={fiddleName}
          onChange={(e) => setFiddleName(e.target.value)}
          disabled={!user}
        />
      </div>
      <Button
        onClick={handleSave}
        loading={saveLoading}
        type="default"
        icon={<SaveOutlined />}
      >
        Save
      </Button>
      <FiddleDrawer
        onClose={closeDrawer}
        open={drawerVisible}
        fiddles={fiddles}
        setFiddles={setFiddles}
        loading={loading}
        user={user}
      />
    </div>
  );
};

export default TopSection;

// Fiddle Drawer
const FiddleDrawer = ({
  onClose,
  open,
  fiddles,
  loading,
  user,
  setFiddles,
}) => {
  const [fiddleAddLoading, setFiddleAddLoading] = useState(false);

  const handleAddFiddle = async () => {
    if (!user) {
      toast("😀 Please login first, It's totally free!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }

    setFiddleAddLoading(true);
    try {
      const payload = { ownerId: user?.id };
      const fiddleAdded = await addFiddle(payload);
      if (fiddleAdded) {
        const { data } = await getUserFiddles(user?.id);
        setFiddles(data);
      }
      setFiddleAddLoading(false);
    } catch (error) {
      setFiddleAddLoading(false);
      toast.error("Error creating new fiddle", error);
    }
  };
  return (
    <Drawer title="Your Fiddles" placement="left" onClose={onClose} open={open}>
      {loading ? (
        <CommonLoader />
      ) : (
        <>
          <Button
            onClick={handleAddFiddle}
            loading={fiddleAddLoading}
            icon={<PlusCircleFilled />}
            type="primary"
            className="mb-4 ml-auto w-full"
          >
            Create New
          </Button>
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
        </>
      )}
    </Drawer>
  );
};
