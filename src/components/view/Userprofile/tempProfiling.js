import React, { useEffect, useState, useCallback } from "react";
import { Table, Tag, Button, Space } from "antd";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommonTable from "@/components/shared/CommonTable";
import { ReloadOutlined } from "@ant-design/icons";
import { list, getProperties } from "aws-amplify/storage";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

// Helper to format bytes into human-readable strings
function formatBytes(bytes, decimals = 2) {
  if (!bytes && bytes !== 0) return "—";
  const k = 1024;
  const dm = Math.max(decimals, 0);
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

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
    title: "Input Type",
    dataIndex: "inputFileType",
    key: "inputFileType",
    render: (t) => t || "—",
  },
  {
    title: "Input Size",
    dataIndex: "inputFileSize",
    key: "inputFileSize",
    sorter: (a, b) => (a.inputFileSize || 0) - (b.inputFileSize || 0),
    render: (bytes) => formatBytes(bytes),
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
    title: "Output Type",
    dataIndex: "outputFileType",
    key: "outputFileType",
    render: (t) => t || "—",
  },
  {
    title: "Output Size",
    dataIndex: "outputFileSize",
    key: "outputFileSize",
    sorter: (a, b) => (a.outputFileSize || 0) - (b.outputFileSize || 0),
    render: (bytes) => formatBytes(bytes),
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

      // Enrich each item with metadata from S3
      const withMeta = await Promise.all(
        sorted.map(async (r) => {
          // Input file metadata via list()
          const inList = await list({
            path: r.inputS3Key,
            options: {
              // subpathStrategy: { strategy: "exclude" },
              listAll: true,
            },
          });
          console.log("Input List:", inList);
          const inEntry =
            inList.items.find((i) => i.path === r.inputS3Key) ||
            inList.items[0];
          const inputSize = inEntry?.size;

          // Input type via getProperties()
          const inProps = await getProperties({ path: r.inputS3Key });
          const inputType = inProps.contentType;

          let outputSize = null;
          let outputType = null;
          if (r.status === "SUCCESS") {
            const outList = await list({
              path: r.outputS3Key,
              options: {
                subpathStrategy: { strategy: "exclude" },
                listAll: true,
              },
            });
            const outEntry =
              outList.items.find((i) => i.path === r.outputS3Key) ||
              outList.items[0];
            outputSize = outEntry?.size;

            const outProps = await getProperties({ path: r.outputS3Key });
            outputType = outProps.contentType;
          }

          return {
            ...r,
            inputFileSize: inputSize,
            inputFileType: inputType,
            outputFileSize: outputSize,
            outputFileType: outputType,
          };
        })
      );

      setData(withMeta);
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
