import React, { useState } from "react";
import { Button, Dropdown, Tag } from "antd";
import { toast } from "react-toastify";
import { uploadData, downloadData } from "aws-amplify/storage";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

const ProfilingWithFile = ({ tables, user, fiddleId }) => {
  const [loading, setLoading] = useState(false);

  const isRecent = (createdAt) => Date.now() - createdAt <= TWO_DAYS_MS;

  // Build menu items with full table metadata, adding a "NEW" tag for recent tables
  const items = tables?.map((table) => {
    const { createdAt } = table;
    const recent = createdAt ? isRecent(createdAt) : false;
    const label = (
      <span>
        {table.fileName || table.name}
        {recent && <span className="!text-xs text-red-700 !ml-2">New</span>}
      </span>
    );

    return {
      label,
      key: table.url_KEY,
      disabled: !table.fileName,
      table,
    };
  });

  const handleClick = async ({ key, item }) => {
    const { table } = item.props;
    if (!table?.fileName) {
      toast.error("No file available to profile.");
      return;
    }

    // Derive extension and S3 paths
    const extension = table.fileExtension || table.fileName.split('.')?.pop();
    const sourceKey = `TEMP/${key}.${extension}`;
    const destinationKey = `INPUT/${user.id}/${fiddleId}/${key}.${extension}`;

    setLoading(true);
    try {
      // Download binary data using Amplify Gen2 Storage
      const { body, contentType } = await downloadData({ path: sourceKey }).result;

      // Re-upload to new path
      await uploadData({
        path: destinationKey,
        data: body,
        options: { contentType },
      }).result;

      toast.success(`Profiling started for complete table.`);
    } catch (error) {
      console.error("Error copying file for profiling:", error);
      toast.error("Failed to copy file for profiling.");
    } finally {
      setLoading(false);
    }
  };

  const menuProps = { items, onClick: handleClick };

  return (
    <Dropdown menu={menuProps} trigger={["click"]}>
      <Button type="default" loading={loading} disabled={loading}>
        {loading ? "Processing..." : "Complete Table Profiling"}
      </Button>
    </Dropdown>
  );
};

export default ProfilingWithFile;
