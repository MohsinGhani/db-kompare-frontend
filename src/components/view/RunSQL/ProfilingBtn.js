import React, { useState } from "react";
import { Button, Dropdown, message } from "antd";
import { FileOutlined, PythonOutlined } from "@ant-design/icons";
import { dataToPipe } from "@/utils/helper";
import { uploadData } from "aws-amplify/storage";
import { ulid } from "ulid";
import { toast } from "react-toastify";

const ProfilingBtn = ({ data, user, fiddleId }) => {
  const [loading, setLoading] = useState(false);

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
      message.error("No data available to download.");
      return;
    }

    switch (e.key) {
      case "1": {
        // CSV download.
        const csvContent = dataToCsv(data?.data?.data || []);
        downloadFile(csvContent, "query_result.csv", "text/csv");
        message.success("CSV file downloaded!");
        break;
      }
      case "2": {
        // PSV download.
        const psvContent = dataToPipe(data?.data?.data || []);
        downloadFile(psvContent, "query_result.psv", "text/plain");
        message.success("PSV file downloaded!");
        break;
      }
      case "3": {
        // JSON download.
        const jsonContent = dataToJson(data?.data?.data || []);
        downloadFile(jsonContent, "query_result.json", "application/json");
        message.success("JSON file downloaded!");
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

  const uploadToS3 = async () => {
    if (!data?.data?.data) {
      toast.error("No data available to upload.");
      return;
    }
    setLoading(true);
    try {
      // 1) Make a unique key under "INPUT/"
      const key = `INPUT/${user?.id}/${fiddleId}/${ulid()}.json`;

      // 2) Serialize your array
      const payload = JSON.stringify(data?.data?.data || []);

      // 3) Upload — *don’t* comment this out, and *await* it
      await uploadData({
        path: key,
        data: payload,
        options: { contentType: "application/json" },
      });

      // only clear loading once the upload finishes
      setLoading(false);
      toast.success(
        "Your profiling report has started successfully. You can check the status in the profile settings."
      );
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  return (
    <Button loading={loading} disabled={loading} onClick={uploadToS3}>
      {loading ? "Loading..." : "Profiling"}
    </Button>
  );
};

export default ProfilingBtn;
