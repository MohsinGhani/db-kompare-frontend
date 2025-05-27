"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Tag, Button, message, Avatar } from "antd";
import { DeleteOutlined, RedoOutlined, Refr } from "@ant-design/icons";
import dayjs from "dayjs";
import { fetchSubmissions } from "@/utils/questionsUtil";
import CommonTable from "@/components/shared/CommonTable";
import { getInitials } from "@/utils/getInitials";

const SubmissionsTable = ({ question, type }) => {
  const [submissionsData, setSubmissionsData] = useState([]);
  const [submissionsDataLoading, setSubmissionsDataLoading] = useState(false);
  const { userDetails } = useSelector((state) => state.auth);
  const user = userDetails?.data?.data;

  const getSubmData = async () => {
    if (question) {
      setSubmissionsDataLoading(true);
      try {
        let payload = {};
        if (!user) {
          payload = {
            questionId: question?.id,
          };
        } else {
          payload = {
            questionId: question?.id,
            userId: user?.id,
            type,
          };
        }

        const res = await fetchSubmissions(payload);
        setSubmissionsData(res?.data || []);
        setSubmissionsDataLoading(false);
      } catch (error) {
        message.error("Failed to get submission data..!");
        setSubmissionsDataLoading(false);
      }
    }
  };
  useEffect(() => {
    getSubmData();
  }, [question, type, userDetails]);

  // Convert timetaken (in seconds) to a more readable format like "5 min 23 sec"
  const formatTimeTaken = (secondsString) => {
    const totalSeconds = parseInt(secondsString, 10) || 0;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} min ${secs} sec`;
  };

  // Convert executiontime to a fixed decimal (optional)
  const formatExecutionTime = (timeValue) => {
    // e.g., 0.2145 sec
    const numericValue = Number(timeValue);
    return isNaN(numericValue) ? "N/A" : `${numericValue.toFixed(4)} sec`;
  };

  // Use dayjs to format the timestamp
  const formatDate = (timestamp) => {
    // Example: "02/14/2025 18:52" => dayjs(timestamp).format("MM/DD/YYYY HH:mm")
    return dayjs(timestamp).format("MM/DD/YYYY HH:mm");
  };

  const columns = [
    {
      title: "User name",
      dataIndex: "user",
      key: "user",
      width: 140,
      render: (user) => (
        <div className="flex items-center gap-2">
          <Avatar shape="circle" className="bg-[#F6F6FF] text-[#3E53D7]">
            {getInitials(user?.name)}
          </Avatar>
          <p>{user?.name}</p>
        </div>
      ),
      hidden: type === "others" ? false : true,
      sorter: (a, b) => a.user?.name.localeCompare(b.user?.name), // Add sorting for user name
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (value) => formatDate(value),
      sorter: (a, b) => new Date(a.submittedAt) - new Date(b.submittedAt), // Sort by submission date
    },
    {
      title: "Time Taken to Submit",
      dataIndex: "timetaken",
      key: "timetaken",
      render: (value) => formatTimeTaken(value),
      sorter: (a, b) => a.timetaken - b.timetaken, // Sort by time taken
    },
    {
      title: "Query Execution Time",
      dataIndex: "executiontime",
      key: "executiontime",
      render: (value) => formatExecutionTime(value),
      sorter: (a, b) => a.executiontime - b.executiontime, // Sort by execution time
    },
    {
      title: "Status",
      dataIndex: "queryStatus",
      key: "queryStatus",
      render: (value) => (
        <p
          className={`${
            value ? "text-[#17A44B]" : "text-[#E33C33]"
          } font-normal`}
        >
          {value ? "Solved" : "Error"}
        </p>
      ),
      sorter: (a, b) =>
        a.queryStatus === b.queryStatus ? 0 : a.queryStatus ? -1 : 1, // Sort by status (Solved first)
    },
    {
      title: "Submission",
      dataIndex: "userQuery",
      key: "userQuery",
      render: (_, record) => (
        <img
          src="/assets/icons/clipboard.svg"
          className="cursor-pointer text-center w-full h-4"
          onClick={() => {
            navigator.clipboard
              .writeText(record.userQuery)
              .then(() => {
                message.success("Query Copied..!");
              })
              .catch((err) => {
                console.error("Failed to copy text:", err);
              });
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="text-right mb-2">
        <Button
          loading={submissionsDataLoading}
          onClick={getSubmData}
          type="primary"
          icon={<RedoOutlined />}
        >
          Refresh
        </Button>
      </div>
      <CommonTable
        columns={columns}
        dataSource={submissionsData}
        rowKey="id"
        pagination={false}
        className="font-normal common-table"
        bordered
        loading={submissionsDataLoading}
      />
    </>
  );
};

export default SubmissionsTable;
