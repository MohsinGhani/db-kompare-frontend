"use client";

import React, { useRef, useState } from "react";
import { Button, Dropdown, message } from "antd";
import {
  DownloadOutlined,
  FileOutlined,
  PythonOutlined,
} from "@ant-design/icons";
import {
  csvToPgsql,
  jsonToPgsql,
  pipeToPgsql,
  sanitizeIdentifier,
} from "./helper";

const FileImporter = ({ fiddle, setdbStructureQuery }) => {
  const fileInputRef = useRef(null);
  const [fileType, setFileType] = useState("");

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
      fileInputRef.current.value = ""; // Reset file input to allow re-selection.
      fileInputRef.current.click();
    }
  };

  // Handle file upload and merge the content.
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Derive and sanitize table name from the file name.
    const tableNameRaw = file.name.replace(/\.[^/.]+$/, "");
    const tableName = sanitizeIdentifier(tableNameRaw);

    const conversionFunctions = {
      json: (data, tableName) => {
        const jsonData = JSON.parse(data);
        return jsonToPgsql(jsonData, tableName);
      },
      csv: (data, tableName) => csvToPgsql(data, tableName),
      pipe: (data, tableName) => pipeToPgsql(data, tableName),
    };

    if (!conversionFunctions[fileType]) {
      console.error("Unsupported file type:", fileType);
      message.error("Unsupported file type.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileData = e.target.result;
        const sql = conversionFunctions[fileType](fileData, tableName);
        const newQuery = sql?.output?.trim() || "";

        // Update the editor's state with the merged query and save any auxiliary statement.
        setdbStructureQuery((prev) => ({
          ...prev,
          dbStructure: newQuery,
        }));

        let successMsg;
        if (fileType === "json") {
          successMsg = "JSON file imported and merged successfully!";
        } else if (fileType === "csv") {
          successMsg = "CSV file imported and merged successfully!";
        } else if (fileType === "pipe") {
          successMsg = "Pipe-delimited file imported and merged successfully!";
        }
        message.success(successMsg);
      } catch (err) {
        console.error("Error processing file:", err);
        message.error("Error processing file.");
      }
    };

    reader.readAsText(file, "UTF-8");
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
      <Dropdown menu={menuProps} className="!max-w-max" trigger={["click"]}>
        <Button type="default">
          <DownloadOutlined /> Import File
        </Button>
      </Dropdown>
      {/* Hidden file input */}
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
