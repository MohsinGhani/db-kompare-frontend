"use client";

import React, { useRef, useState } from "react";
import { Button, Dropdown, message, Modal } from "antd";
import {
  DownloadOutlined,
  FileOutlined,
  PythonOutlined,
} from "@ant-design/icons";
import { copy, uploadData } from "aws-amplify/storage";
import { csvToPgsql, sanitizeIdentifier } from "./helper";
import { ulid } from "ulid";
import { executeQuery, updateFiddle } from "@/utils/runSQL";
import { toast } from "react-toastify";

const FileImporter = ({ fiddle, setdbStructureQuery, user, fetchData }) => {
  const fileInputRef = useRef(null);
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);

  // Configure file selection based on dropdown choice.
  const handleMenuClick = (e) => {
    if (!user) {
      toast("😀 Please login first, It's totally free!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }

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

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const tableNameRaw = file.name.replace(/\.[^/.]+$/, "");
    const tableName = sanitizeIdentifier(tableNameRaw);
    const id = ulid();
    const fileExt = file.name.split(".").pop();
    const tempKey = `TEMP/${id}.${fileExt}`;

    try {
      toast.loading({ content: "Uploading file to S3...", key: "upload" });

      // 1) Upload to TEMP/
      const { result: uploadPromise } = await uploadData({
        path: tempKey,
        data: file,
        options: { contentType: file.type, onProgress: () => {} },
      });
      await uploadPromise;

      // 2) Kick off your backend import into PG
      const resp = await executeQuery({
        userId: user.id,
        url_KEY: id,
        fileType,
        tableName,
        fileExtension: fileExt,
      });

      // 3) If import errored
      if (!resp?.data) {
        const errorMessage = resp?.message || "Unknown error";
        if (errorMessage.includes("already exists")) {
          toast.error(
            "A table with that name already exists. Please rename your file or choose a different table name."
          );
        } else {
          toast.error(`Processing failed: ${errorMessage}`);
        }
        return;
      }

      // 4) Success – ask if they want to profile now
      Modal.confirm({
        title: `"${tableNameRaw}" has been created!`,
        content: `Do you want to run profiling on this table now?`,
        okText: "Yes, profile it",
        cancelText: "No thanks",
        centered: true,
        onOk: async () => {
          // Copy from TEMP/... → INPUT/{userId}/{fiddleId}/...
          const destinationKey = `INPUT/${user.id}/${fiddle?.id}/${id}.${fileExt}`;

          setLoading(true);
          try {
            await copy({
              source: { path: tempKey },
              destination: { path: destinationKey },
            });
            toast.success("Profiling started!");
          } catch (err) {
            console.error("Error copying file for profiling:", err);
            toast.error("Failed to copy file for profiling.");
          } finally {
            setLoading(false);
          }
        },
      });

      await updateFiddle(
        {
          ...fiddle,
          tables: [
            ...(fiddle?.tables || []),
            {
              name: tableName,
              fileName: tableNameRaw,
              url_KEY: id,
              createdAt: Date.now(),
              fileExtension: fileExt,
            },
          ],
        },
        fiddle?.id
      );
      await fetchData(fiddle?.id);

      toast.success({
        content: "File uploaded and processed successfully!",
        key: "upload",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error(error.message || "Unknown error", { key: "upload" });
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
