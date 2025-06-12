"use client";

import React, { useState, useRef } from "react";
import { Modal, Button, Progress, Upload } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { uploadData } from "aws-amplify/storage";
import { toast } from "react-toastify";
import { ulid } from "ulid";

const getFileKey = (path, id, file) => {
  // Remove trailing slashes from path
  const cleanPath = path.replace(/\/+$/, "");

  // Split filename into name and extension
  const lastDotIndex = file.name.lastIndexOf(".");
  const fileExt = lastDotIndex > 0 ? file.name.substring(lastDotIndex) : "";

  return `${cleanPath}/${id}${fileExt}`;
};

export default function CommonFileUploadToS3({
  path = "",
  buttonText = "Upload Files",
  multiple = false,
  modalTitle = "Upload to S3",
  onUploadComplete,
}) {
  const [visible, setVisible] = useState(false);
  const [fileItems, setFileItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const uploadTasks = useRef({}); // Store upload tasks by file ID for cancellation

  const handleBeforeUpload = (file) => {
    const preview = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;
      const fileId = ulid(); // Generate unique ID for each file
    setFileItems((prev) => [
      ...prev,
      { file, preview, progress: 0, status: "ready", result: null,fileId },
    ]);
    return false;
  };

  const handleRemove = (file) => {
    setFileItems((prev) => prev.filter((item) => item.file !== file));
  };

  const cancelSingleUpload = (fileId) => {
    if (uploadTasks.current[fileId]) {
      uploadTasks.current[fileId].cancel();
      setFileItems((prev) =>
        prev.map((item) =>
          item.fileId === fileId
            ? { ...item, status: "cancelled", progress: 0 }
            : item
        )
      );
      toast.info("Upload cancelled");
    }
  };

  const startUpload = async () => {
    if (!fileItems.length) {
      toast.warning("No files selected");
      return;
    }
    setUploading(true);
    uploadTasks.current = {};
    const results = [];

    for (let i = 0; i < fileItems.length; i++) {
      const item = fileItems[i];
      if (item.status === "cancelled") continue;

      setFileItems((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], status: "uploading", progress: 0 };
        return next;
      });
      console.log("Uploading file:", item, "to path:", path);
      // Generate a unique key for the file
  
      const key = getFileKey(path, item.fileId, item.file);
      console.log("Generated key for upload:", key);
      try {
        const task = uploadData({
          path: key,
          data: item.file,
          options: {
            contentType: item.file.type,
            onProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.transferredBytes / progressEvent.totalBytes) *
                  100
              );
              console.log("Upload progress for", item.file.name, ":", percent, "%");
              setFileItems((prev) => {
                const next = [...prev];
                const itemIndex = prev.findIndex(
                  (f) => f.fileId === item.fileId
                );
                if (itemIndex !== -1) {
                  next[itemIndex] = { ...next[itemIndex], progress: percent };
                }
                return next;
              });
            },
          },
        });

        uploadTasks.current[item.fileId] = task; // Store task for cancellation

        const res = await task.result;
        setFileItems((prev) => {
          const next = [...prev];
          const itemIndex = prev.findIndex((f) => f.fileId === item.fileId);
          if (itemIndex !== -1) {
            next[itemIndex] = {
              ...next[itemIndex],
              status: "done",
              result: res,
              progress: 100,
            };
          }
          return next;
        });
        results.push({ file: item.file, key, result: res });
      } catch (err) {
        if (err.message !== "Upload aborted") {
          setFileItems((prev) => {
            const next = [...prev];
            const itemIndex = prev.findIndex((f) => f.fileId === item.fileId);
            if (itemIndex !== -1) {
              next[itemIndex] = { ...next[itemIndex], status: "error" };
            }
            return next;
          });
          toast.error(`Failed to upload ${item.file.name}`);
        }
      } finally {
        delete uploadTasks.current[item.fileId]; // Clean up
      }
    }

    setUploading(false);
    if (onUploadComplete) onUploadComplete(results);

    // Close modal if all files are either done or cancelled
    const allCompleted = fileItems.every(
      (item) =>
        item.status === "done" ||
        item.status === "cancelled" ||
        item.status === "error"
    );
    if (allCompleted) {
      setVisible(false);
    }
  };

  console.log("File items:", fileItems);
  return (
    <>
      <Button icon={<UploadOutlined />} onClick={() => setVisible(true)}>
        {buttonText}
      </Button>
      <Modal
        centered
        title={modalTitle}
        open={visible}
        onCancel={() => !uploading && setVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setVisible(false)}
            disabled={uploading}
          >
            Cancel
          </Button>,
          <Button
            key="upload"
            type="primary"
            onClick={startUpload}
            loading={uploading}
            disabled={
              fileItems.length === 0 ||
              fileItems.every((item) => item.status === "cancelled")
            }
          >
            Upload
          </Button>,
        ]}
      >
        <Upload
          multiple={multiple}
          beforeUpload={handleBeforeUpload}
          onRemove={handleRemove}
          fileList={[]}
          disabled={uploading}
        >
          <Button icon={<PlusOutlined />} disabled={uploading}>
            Select File{multiple ? "s" : ""}
          </Button>
        </Upload>

        {fileItems.map((item) => (
          <div
            key={item.fileId}
            style={{ display: "flex", alignItems: "center", marginTop: 16 }}
          >
            {item.preview ? (
              <img
                src={item.preview}
                alt={item.file.name}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  marginRight: 16,
                }}
                onLoad={() => URL.revokeObjectURL(item.preview)}
              />
            ) : (
              <div style={{ width: 80, marginRight: 16 }}>{item.file.name}</div>
            )}
            <div style={{ flex: 1 }}>
              <div>{item.file.name}</div>
              {item.status === "uploading" && (
                <Progress percent={item.progress} status="active" />
              )}
              {item.status === "error" && (
                <div style={{ color: "red" }}>Upload failed</div>
              )}
              {item.status === "cancelled" && (
                <div style={{ color: "orange" }}>Upload cancelled</div>
              )}
            </div>
            {item.status === "uploading" && (
              <Button
                icon={<CloseOutlined />}
                onClick={() => cancelSingleUpload(item.fileId)}
                type="text"
                danger
                size="small"
              />
            )}
            {/* {(item.status === "done" || item.status === "error" || item.status === "cancelled") && ( */}
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleRemove(item.file)}
              type="text"
              danger
              size="small"
            />
            {/* )} */}
          </div>
        ))}
      </Modal>
    </>
  );
}
