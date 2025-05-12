import React, { useState, useEffect } from "react";
import { Button, Flex, Modal, Progress, Space, Tag, Typography } from "antd";
import {
  list,
  getProperties,
  downloadData,
  isCancelError,
} from "aws-amplify/storage";
import CommonTable from "@/components/shared/CommonTable";
import { DownloadOutlined } from "@ant-design/icons";

// Helper to format bytes into human-readable strings
function formatBytes(bytes, decimals = 2) {
  if (bytes == null) return "—";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = Math.max(decimals, 0);
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
const { Text } = Typography;
const SampleFilesModal = ({ user }) => {
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadTasks, setDownloadTasks] = useState({}); // { [key]: { task, progress } }

  // Fetch list of files under SAMPLE_FILES/
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await list({
        path: "SAMPLE_FILES/",
        accessLevel: "public",
        options: {
          subpathStrategy: { strategy: "exclude" },
          listAll: true,
        },
      });
      const realItems = res.items.filter((i) => i.path !== "SAMPLE_FILES/");
      const enriched = await Promise.all(
        realItems.map(async (item) => {
          const props = await getProperties({
            path: item.path,
            accessLevel: "public",
          });
          return {
            key: item.path,
            filename: item.path.split("/").pop(),
            size: item.size,
            contentType: props.contentType,
          };
        })
      );
      setFiles(enriched);
    } catch (err) {
      console.error("Error listing sample files", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle download with progress and cancellation
  const handleDownload = (path, filename) => {
    const downloadTask = downloadData({
      path,
      accessLevel: "public",
      options: {
        onProgress: (progress) => {
          const percent = Math.round(
            (progress.transferredBytes / progress.totalBytes) * 100
          );
          setDownloadTasks((tasks) => ({
            ...tasks,
            [path]: { ...tasks[path], progress: percent },
          }));
        },
      },
    });
    // initialize task state
    setDownloadTasks((tasks) => ({
      ...tasks,
      [path]: { task: downloadTask, progress: 0 },
    }));

    // perform download
    downloadTask.result
      .then(({ body }) => {
        // trigger browser download
        const blob = new Blob([body]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        if (isCancelError(err)) {
          console.log("Download canceled:", filename);
        } else {
          console.error("Download error:", err);
        }
      })
      .finally(() => {
        setDownloadTasks((tasks) => {
          const newTasks = { ...tasks };
          delete newTasks[path];
          return newTasks;
        });
      });
  };

  // Cancel a download task
  const handleCancel = (path) => {
    const entry = downloadTasks[path];
    if (entry && entry.task) {
      entry.task.cancel();
    }
  };

  useEffect(() => {
    if (visible) fetchFiles();
  }, [visible]);

  const columns = [
    {
      title: "Filename",
      dataIndex: "filename",
      key: "filename",
      render: (text) => (
        <Text strong ellipsis={{ tooltip: text }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Type",
      dataIndex: "contentType",
      key: "contentType",
      render: (type) => <Tag color="geekblue">{type}</Tag>,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (bytes) => <Text code>{formatBytes(bytes)}</Text>,
      sorter: (a, b) => (a.size || 0) - (b.size || 0),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const entry = downloadTasks[record.key];
        return (
          <Flex gap={8} align="center">
            {entry ? (
              <Space align="center">
                <Progress
                  percent={entry.progress}
                  size="small"
                  style={{ width: 120 }}
                />
                <Button
                  size="small"
                  danger
                  onClick={() => handleCancel(record.key)}
                >
                  Cancel
                </Button>
              </Space>
            ) : (
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(record.key, record.filename)}
              >
                Download
              </Button>
            )}
            {/* <Button  type="primary">
                Use
            </Button> */}
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Sample Files
      </Button>
      <Modal
        title="Sample Files"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width="80%"
        centered
      >
        <CommonTable
          columns={columns}
          dataSource={files}
          rowKey="key"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Modal>
    </>
  );
};

export default SampleFilesModal;
