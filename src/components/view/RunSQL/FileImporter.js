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

const FileImporter = ({ setFiddle }) => {
  const fileInputRef = useRef(null);
  const [fileType, setFileType] = useState("");

  // Handle dropdown menu item click to set file type and trigger file selection.
  const handleMenuClick = (e) => {
    let accept;
    switch (e.key) {
      case "1": // CSV
        accept = ".csv";
        setFileType("csv");
        break;
      case "2": // Pipe (adjust as needed)
        accept = ".psv";
        setFileType("pipe");
        break;
      case "3": // JSON
        accept = ".json";
        setFileType("json");
        break;
      default:
        accept = "";
        setFileType("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      // Reset the file input to allow re-selection of the same file.
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Handle file selection.
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Derive and sanitize the table name from the file name.
    const tableNameRaw = file.name.replace(/\.[^/.]+$/, "");
    const tableName = sanitizeIdentifier(tableNameRaw);

    // Mapping fileType values to conversion functions.
    const conversionFunctions = {
      json: (data, tableName) => {
        const jsonData = JSON.parse(data);
        return jsonToPgsql(jsonData, tableName);
      },
      csv: (data, tableName) => csvToPgsql(data, tableName),
      pipe: (data, tableName) => pipeToPgsql(data, tableName),
    };

    // Check if the selected file type is supported.
    if (!conversionFunctions[fileType]) {
      console.log("Unsupported file type:", fileType);
      message.error("Unsupported file type.");
      return;
    }

    // Create a new FileReader to read the file.
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileData = e.target.result;
        const sql = conversionFunctions[fileType](fileData, tableName);

        setFiddle((prev) => ({
          ...prev,
          dbStructure: sql?.output,
          createTableStatement: sql?.createTableStatement,
        }));

        console.log("Generated PGSQL:", sql);

        // Provide a customized success message.
        let successMsg;
        if (fileType === "json") {
          successMsg =
            "JSON file converted to PGSQL successfully! Check the console for output.";
        } else if (fileType === "csv") {
          successMsg =
            "CSV file converted to PGSQL successfully! Check the console for output.";
        } else if (fileType === "pipe") {
          successMsg =
            "Pipe-delimited file converted to PGSQL successfully! Check the console for output.";
        }
        message.success(successMsg);
      } catch (err) {
        console.error("Error processing file:", err);
        message.error("Error processing file.");
      }
    };

    // Read the file using UTF-8 encoding.
    reader.readAsText(file, "UTF-8");
  };

  // Dropdown items.
  const items = [
    {
      label: "CSV",
      key: "1",
      icon: <FileOutlined />,
    },
    {
      label: "Pipe",
      key: "2",
      icon: <PythonOutlined />,
    },
    {
      label: "JSON",
      key: "3",
      icon: <FileOutlined />,
    },
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
