import React, { useEffect, useState, useCallback } from "react";
import { Table, Tag, Button, Space } from "antd";
import Link from "next/link";

// Define the columns for the Ant Design Table
const columns = [
  {
    title: "Project",
    dataIndex: "fiddleId",
    key: "fiddleId",
    render: (text) => {
      const url = `/run/${text}`;
      return (
        <Link href={url} target="_blank" className="text-primary underline">
          Project
        </Link>
      );
    },
  },
  {
    title: "Input Data",
    dataIndex: "inputS3Key",
    key: "inputS3Key",
    render: (text) => {
      const url = `${process.env.NEXT_PUBLIC_BUCKET_URL}/${text}`;
      return (
        <Link href={url} target="_blank" className="text-primary underline">
          Submitted Data
        </Link>
      );
    },
  },
  {
    title: "Generated Report",
    dataIndex: "outputS3Key",
    key: "outputS3Key",
    render: (text, record) => {
      if (record.status !== "SUCCESS") {
        return (
          <span className="text-gray-400 cursor-not-allowed">
            Generated Report
          </span>
        );
      }
      const url = `${process.env.NEXT_PUBLIC_BUCKET_URL}/${text}`;
      return (
        <Link href={url} target="_blank" className="text-primary underline">
          Generated Report
        </Link>
      );
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const color =
        status === "SUCCESS"
          ? "success"
          : status === "PENDING"
          ? "yellow"
          : "red";
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (ts) => new Date(ts).toLocaleString(),
  },
  {
    title: "Completed At",
    dataIndex: "completedAt",
    key: "completedAt",
    render: (ts) =><p>
       {ts ? new Date(ts).toLocaleString():"---"}
    </p>,
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
      <Button onClick={fetchData} loading={loading} type="primary" >
        Refresh Reports
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        bordered
        loading={loading}
      />
    </Space>
  );
};

export default ProfilingReport;
