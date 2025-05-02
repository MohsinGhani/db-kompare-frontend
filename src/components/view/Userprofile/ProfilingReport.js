import React, { useEffect, useState, useCallback } from "react";
import { Table, Tag, Button, Space } from "antd";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommonTable from "@/components/shared/CommonTable";
import { ReloadOutlined } from "@ant-design/icons";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

// Define the columns for the Ant Design Table
const columns = [
  {
    title: "Project Name",
    dataIndex: "fiddleId",
    key: "fiddleId",
    sorter: (a, b) => a.fiddleId.localeCompare(b.fiddleId),
    render: (text, record) => {
      const url = `/run/${text}`;
      return (
        <div className="flex items-center">
          <Link href={url} target="_blank">
            <span className="text-blue-600 font-semibold hover:text-blue-800">
              {record?.fiddleName ?? "Not Available"}
            </span>
          </Link>
        </div>
      );
    },
  },
  {
    title: "Submitted Data",
    dataIndex: "inputS3Key",
    key: "inputS3Key",
    sorter: (a, b) => a.inputS3Key.localeCompare(b.inputS3Key),
    render: (text, record) => {
      const url = `${process.env.NEXT_PUBLIC_BUCKET_URL}/${text}`;
      const label = record?.fileName
        ? `${record.fileName}.${record.fileExtension}`
        : "Submitted Data";
      return (
        <div className="flex items-center">
          <Link href={url} target="_blank">
            <span className="text-green-600 font-medium hover:text-green-800">
              {label}
            </span>
          </Link>
        </div>
      );
    },
  },
  {
    title: "Report File",
    dataIndex: "outputS3Key",
    key: "outputS3Key",
    sorter: (a, b) => {
      const aKey = a.status === "SUCCESS" ? a.outputS3Key : "";
      const bKey = b.status === "SUCCESS" ? b.outputS3Key : "";
      return aKey.localeCompare(bKey);
    },
    render: (text, record) => {
      if (record.status !== "SUCCESS") {
        return <span className="text-gray-400 italic">Not Generated</span>;
      }
      const url = `${process.env.NEXT_PUBLIC_BUCKET_URL}/${text}`;
      const label = record?.fileName
        ? `${record.fileName}.${record.fileExtension} Report`
        : "Generated Report";
      return (
        <div className="flex items-center">
          <Link href={url} target="_blank">
            <span className="text-purple-600 font-medium hover:text-purple-800">
              {label}
            </span>
          </Link>
        </div>
      );
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => a.status.localeCompare(b.status),
    render: (status) => {
      const color =
        status === "SUCCESS"
          ? "success"
          : status === "PENDING"
          ? "yellow"
          : "red";
      return (
        <div className="flex items-center justify-center">
          <Tag color={color} className="font-normal text-sm">
            {status === "PENDING" ? "RUNNING" : status}
          </Tag>
        </div>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    sorter: (a, b) => a.createdAt - b.createdAt,
    defaultSortOrder: "descend",
    render: (ts) => (
      <div className="flex flex-col">
        <span className="text-gray-800 font-medium">
          {new Date(ts).toLocaleString()}
        </span>
        <span className="text-gray-500 text-sm italic">
          {dayjs(ts).fromNow()}
        </span>
      </div>
    ),
  },
  {
    title: "Completed At",
    dataIndex: "completedAt",
    key: "completedAt",
    sorter: (a, b) => (a.completedAt || 0) - (b.completedAt || 0),
    render: (ts) =>
      ts ? (
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium">
            {new Date(ts).toLocaleString()}
          </span>
          <span className="text-gray-500 text-sm italic">
            {dayjs(ts).fromNow()}
          </span>
        </div>
      ) : (
        <span className="text-gray-400">---</span>
      ),
  },
];

const ProfilingReport = ({ user }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data function, memoized
  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_1}/profiling?userId=${user.id}`,
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_Y_API_KEY,
          },
        }
      );
      const result = await response.json();
      // Sort by createdAt descending
      const sorted = (result.data || []).sort(
        (a, b) => b.createdAt - a.createdAt
      );
      setData(sorted);
    } catch (error) {
      console.error("Error fetching profiling report:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button
        onClick={fetchData}
        icon={<ReloadOutlined />}
        loading={loading}
        type="primary"
      >
        Refresh
      </Button>
      <CommonTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        bordered
        loading={loading}
        className="common-table"
      />
    </Space>
  );
};

export default ProfilingReport;
