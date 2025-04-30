"use client";

import React, { useRef, useState } from "react";
import { Button, Dropdown, message } from "antd";
import {
  DownloadOutlined,
  FileOutlined,
  PythonOutlined,
} from "@ant-design/icons";
import { uploadData } from "aws-amplify/storage";
import { csvToPgsql, sanitizeIdentifier } from "./helper";
import { ulid } from "ulid";
import { executeQuery, updateFiddle } from "@/utils/runSQL";

const FileImporter = ({ fiddle, setdbStructureQuery, user, fetchData }) => {
  const fileInputRef = useRef(null);
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);

  // Configure file selection based on dropdown choice.
  const handleMenuClick = (e) => {
    let accept;
    switch (e.key) {
      case "1":
        accept = ".csv";
        setFileType("csv");
        break;
      case "2":
        accept = ".psv";
        setFileType("pipe");
        break;
      case "3":
        accept = ".json";
        setFileType("json");
        break;
      default:
        accept = "";
        setFileType("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Handle file upload to S3 via Amplify Storage
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    // Derive and sanitize table name from the file name
    const tableNameRaw = file.name.replace(/\.[^/.]+$/, "");
    const tableName = sanitizeIdentifier(tableNameRaw);
    const id = ulid();

    // Build a unique S3 key preserving extension
    const fileExtension = file.name.split(".").pop();
    const key = `TEMP/${id}.${fileExtension}`;

    try {
      message.loading({ content: "Uploading file to S3...", key: "upload" });

      // Upload to S3
      const { result: uploadPromise } = await uploadData({
        path: key,
        data: file,
        options: {
          contentType: file.type,
          onProgress: ({ transferredBytes, totalBytes }) => {
            const pct = totalBytes
              ? Math.round((transferredBytes / totalBytes) * 100)
              : 0;
            console.log(`Upload is ${pct}% done.`);
          },
        },
      });
      const uploadResult = await uploadPromise;

      // Trigger backend processing
      const resp = await executeQuery({
        userId: user.id,
        url_KEY: id,
        fileType,
        tableName,
        fileExtension,
      });

      // Update fiddle if backend returned data
      if (resp?.data) {
        await updateFiddle(
          {
            ...fiddle,
            tables: [
              ...(fiddle?.tables || []),
              {
                name: tableName,
                fileName: tableNameRaw,
                url_KEY: id,
                createdAt: new Date().getTime(),
                fileExtension,
              },
            ],
          },
          fiddle?.id
        );
        await fetchData(fiddle?.id);
      }

      message.success({
        content: "File uploaded and processed successfully!",
        key: "upload",
      });
    } catch (error) {
      console.error("Error processing file:", error);
      message.error({ content: error?.message, key: "upload" });
    } finally {
      setLoading(false);
    }
  };

  const items = [
    { label: "CSV", key: "1", icon: <FileOutlined /> },
    { label: "Pipe", key: "2", icon: <PythonOutlined /> },
    { label: "JSON", key: "3", icon: <FileOutlined /> },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <>
      <Dropdown menu={menuProps} trigger={["click"]}>
        <Button type="default" loading={loading} disabled={loading}>
          <DownloadOutlined /> Import File
        </Button>
      </Dropdown>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default FileImporter;
