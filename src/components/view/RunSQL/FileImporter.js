import React, { useRef, useState } from "react";
import { Button, Dropdown, message } from "antd";
import {
  DownloadOutlined,
  FileOutlined,
  PythonOutlined,
} from "@ant-design/icons";
import { jsonToPgsql } from "@/utils/helper";

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
        accept = ".pipe";
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
    if (file) {
      if (fileType === "json") {
        // Derive table name from the file name by removing the extension.
        const tableName = file.name.replace(/\.[^/.]+$/, "");
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target.result);
            const sql = jsonToPgsql(jsonData, tableName);
            setFiddle((pre) => ({ ...pre, dbStructure: sql }));
            console.log("Generated PGSQL:", sql);
            message.success(
              "JSON file converted to PGSQL successfully! Check the console for output."
            );
          } catch (err) {
            console.error("Error parsing JSON:", err);
            message.error("Error parsing JSON file.");
          }
        };
        reader.readAsText(file);
      } else {
        // Handle other file types (e.g., CSV, Pipe) as needed.
        console.log("Selected file:", file);
      }
    }
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
          <DownloadOutlined /> Import
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
