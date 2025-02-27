"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Tag, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { fetchSubmissions } from "@/utils/questionsUtil";

const SubmissionsTable = ({ question, type }) => {
  const [submissionsData, setSubmissionsData] = useState([]);
  const { userDetails } = useSelector((state) => state.auth);
  useEffect(() => {
    const getSubmData = async () => {
      if (question) {
        const res = await fetchSubmissions({
          questionId: question?.id,
          userId: userDetails?.data?.data?.id,
          type,
        });
        setSubmissionsData(res?.data || []);
      }
    };
    getSubmData();
  }, [question, type, userDetails]);

  const handleDelete = (record) => {
    // Implement your delete logic here (e.g., call an API to remove the submission).
    console.log("Delete submission:", record);
  };

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
      title: "Time",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (value) => formatDate(value),
    },
    {
      title: "Time Taken",
      dataIndex: "timetaken",
      key: "timetaken",
      render: (value) => formatTimeTaken(value),
    },
    {
      title: "Execution Time",
      dataIndex: "executiontime",
      key: "executiontime",
      render: (value) => formatExecutionTime(value),
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
    },
    {
      title: "Submission",
      dataIndex: "userQuery", // This is the field from your data
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
    <Table
      columns={columns}
      dataSource={submissionsData}
      rowKey="id"
      pagination={false}
      className="font-normal"
    />
  );
};

export default SubmissionsTable;
