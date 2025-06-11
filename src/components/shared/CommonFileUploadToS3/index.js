"use client";

import React, { useState } from "react";
import { Modal, Button, Progress, Upload, message } from "antd";
import { PlusOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { uploadData } from "aws-amplify/storage";

/**
 * CommonFileUploadToS3
 * A reusable component to select files, preview, and upload to S3 with progress,
 * using aws-amplify/storage's uploadData API directly.
 *
 * Props:
 * - path: string — S3 prefix/folder to upload files into
 * - buttonText: string — text for the trigger button
 * - multiple: boolean — allow selecting multiple files
 * - contentType: string — default MIME type for upload
 * - modalTitle: string — title of upload dialog
 * - onUploadComplete: (results: Array<{ file: File, key: string, result: any }>) => void
 */
export default function CommonFileUploadToS3({
  path,
  buttonText = "Upload Files",
  multiple = false,
  contentType = "application/octet-stream",
  modalTitle = "Upload to S3",
  onUploadComplete,
}) {
  const [visible, setVisible] = useState(false);
  const [fileItems, setFileItems] = useState([]); // { file, preview, progress, status, result }
  const [uploading, setUploading] = useState(false);

  // add selected file to state
  const handleBeforeUpload = (file) => {
    const preview = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;
    setFileItems((prev) => [
      ...prev,
      { file, preview, progress: 0, status: "ready", result: null },
    ]);
    return false; // prevent default upload
  };

  // remove a file from list
  const handleRemove = (file) => {
    setFileItems((prev) => prev.filter((item) => item.file !== file));
  };

  // perform upload for all files sequentially
  const startUpload = async () => {
    if (!fileItems.length) {
      message.warning("No files selected");
      return;
    }
    setUploading(true);
    const results = [];

    for (let i = 0; i < fileItems.length; i++) {
      const item = fileItems[i];
      // mark uploading
      setFileItems((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], status: "uploading", progress: 0 };
        return next;
      });

      const key = `${path.replace(/\/+$/, "")}/${item.file.name}`;
      try {
        const task = uploadData({
          path: key,
          data: item.file,
          options: {
            contentType,
            progressCallback: (progressEvent) => {
              const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              setFileItems((prev) => {
                const next = [...prev];
                next[i] = { ...next[i], progress: percent };
                return next;
              });
            },
          },
        });
        // wait for result
        const res = await task.result;
        // mark done
        setFileItems((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], status: "done", result: res, progress: 100 };
          return next;
        });
        results.push({ file: item.file, key, result: res });
      } catch (err) {
        console.error("Upload error:", err);
        setFileItems((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], status: "error" };
          return next;
        });
        message.error(`Failed to upload ${item.file.name}`);
      }
    }

    setUploading(false);
    if (onUploadComplete) onUploadComplete(results);
  };

  return (
    <>
      <Button icon={<UploadOutlined />} onClick={() => setVisible(true)}>
        {buttonText}
      </Button>
      <Modal
        title={modalTitle}
        open={visible}
        onCancel={() => !uploading && setVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)} disabled={uploading}>
            Cancel
          </Button>,
          <Button key="upload" type="primary" onClick={startUpload} loading={uploading}>
            Upload
          </Button>,
        ]}
      >
        <Upload
          multiple={multiple}
          beforeUpload={handleBeforeUpload}
          onRemove={handleRemove}
          fileList={[]}
        >
          <Button icon={<PlusOutlined />} disabled={uploading}>
            Select File{multiple ? "s" : ""}
          </Button>
        </Upload>

        {fileItems.map((item, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
            {item.preview ? (
              <img
                src={item.preview}
                alt={item.file.name}
                style={{ width: 80, height: 80, objectFit: "cover", marginRight: 16 }}
              />
            ) : (
              <div style={{ width: 80, marginRight: 16 }}>{item.file.name}</div>
            )}
            <div style={{ flex: 1 }}>
              <div>{item.file.name}</div>
              {item.status === "uploading" && <Progress percent={item.progress} />}
              {item.status === "error" && <div style={{ color: "red" }}>Upload failed</div>}
            </div>
            {item.status === "done" && (
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleRemove(item.file)}
                type="text"
              />
            )}
          </div>
        ))}
      </Modal>
    </>
  );
}
