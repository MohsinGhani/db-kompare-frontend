import React from "react";
import { Button, Dropdown, message } from "antd";
import {
  DownloadOutlined,
  FileOutlined,
  PythonOutlined,
} from "@ant-design/icons";
import { dataToPipe } from "@/utils/helper";
import { toast } from "react-toastify";

const DownloadResult = ({ data }) => {
  const dataToCsv = (data) => {
    if (!data || data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const csvRows = [];
    // Create header row.
    csvRows.push(headers.map((header) => `"${header}"`).join(","));
    // Process each row.
    data.forEach((row) => {
      const values = headers.map((header) => {
        let value = row[header];
        if (value === null || value === undefined) {
          value = "";
        } else {
          value = String(value).replace(/"/g, '""');
        }
        return `"${value}"`;
      });
      csvRows.push(values.join(","));
    });
    return csvRows.join("\n");
  };

  const dataToJson = (data) => {
    return JSON.stringify(data, null, 2);
  };

  const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMenuClick = (e) => {
    if (!data?.data?.data) {
      toast.error("No data available to download.");
      return;
    }

    switch (e.key) {
      case "1": {
        // CSV download.
        const csvContent = dataToCsv(data?.data?.data || []);
        downloadFile(csvContent, "query_result.csv", "text/csv");
        toast.success("CSV file downloaded!");
        break;
      }
      case "2": {
        // PSV download.
        const psvContent = dataToPipe(data?.data?.data || []);
        downloadFile(psvContent, "query_result.psv", "text/plain");
        toast.success("PSV file downloaded!");
        break;
      }
      case "3": {
        // JSON download.
        const jsonContent = dataToJson(data?.data?.data || []);
        downloadFile(jsonContent, "query_result.json", "application/json");
        toast.success("JSON file downloaded!");
        break;
      }
      default:
        break;
    }
  };

  // Dropdown menu items.
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
    <Dropdown menu={menuProps} className="!max-w-max" trigger={["click"]}>
      <Button type="default">
        <DownloadOutlined /> Download Result
      </Button>
    </Dropdown>
  );
};

export default DownloadResult;
