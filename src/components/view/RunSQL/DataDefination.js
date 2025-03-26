"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CommonTable from "@/components/shared/CommonTable";

const DataDefinition = ({ dataSample }) => {
  console.log("Data sample:", dataSample);

  // Memoize tabKeys so that the array reference remains stable unless dataSample changes.
  const tabKeys = useMemo(() => Object.keys(dataSample || {}), [dataSample]);

  const [activeTab, setActiveTab] = useState(tabKeys[0] || "");
  const [dataSources, setDataSources] = useState({});
  const [counts, setCounts] = useState({});

  // Initialize data sources and counts when dataSample changes.
  useEffect(() => {
    const initialSources = {};
    const initialCounts = {};
    tabKeys.forEach((tabKey) => {
      const data = (dataSample[tabKey] || []).map((item, index) => ({
        key: item.id ? item.id.toString() : `${tabKey}-${index}`,
        ...item,
      }));
      initialSources[tabKey] = data;
      initialCounts[tabKey] = data.length;
    });
    setDataSources(initialSources);
    setCounts(initialCounts);
    // Update activeTab if it hasn't been set yet.
    if (!activeTab && tabKeys.length > 0) {
      setActiveTab(tabKeys[0]);
    }
  }, [dataSample, tabKeys]);

  // Add a new row for the given tab.
  const handleAdd = (tabKey) => {
    const currentData = dataSources[tabKey] || [];
    const tabDataSample = dataSample[tabKey] || [];
    const dynamicKeys =
      tabDataSample.length > 0 ? Object.keys(tabDataSample[0]) : [];
    const newRow = { key: `${tabKey}-${counts[tabKey]}` };
    dynamicKeys.forEach((key) => {
      newRow[key] = null;
    });
    const updatedData = [...currentData, newRow];
    setDataSources({ ...dataSources, [tabKey]: updatedData });
    setCounts({ ...counts, [tabKey]: counts[tabKey] + 1 });
  };

  // Save the updated row for a given tab.
  const handleSave = (tabKey, row) => {
    const currentData = dataSources[tabKey] || [];
    const newData = currentData.map((item) =>
      item.key === row.key ? row : item
    );
    setDataSources({ ...dataSources, [tabKey]: newData });
  };

  // Create dynamic tab items using the new antd Tabs API.
  const items = tabKeys.map((tabKey) => {
    const tabDataSample = dataSample[tabKey] || [];
    const dynamicColumnsKeys =
      tabDataSample.length > 0 ? Object.keys(tabDataSample[0]) : [];
    const columns = dynamicColumnsKeys.map((key) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataIndex: key,
      editable: true,
      render: (text, record) => (
        <Input
          defaultValue={text}
          onBlur={(e) =>
            handleSave(tabKey, { ...record, [key]: e.target.value })
          }
        />
      ),
    }));

    const editableColumns = columns.map((col) => ({
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
      }),
    }));

    return {
      key: tabKey,
      label: tabKey.charAt(0).toUpperCase() + tabKey.slice(1),
      children: (
        <CommonTable
          components={{
            body: {
              cell: ({ children, ...restProps }) => (
                <td {...restProps}>{children}</td>
              ),
            },
          }}
          bordered
          dataSource={dataSources[tabKey]}
          columns={editableColumns}
          rowClassName="editable-row"
          pagination={false}
          size="small"
          footer={() => (
            <div
              className="bg-[#FCFCFF] p-2 cursor-pointer text-primary"
              onClick={() => handleAdd(tabKey)}
            >
              <PlusOutlined /> New row
            </div>
          )}
        />
      ),
    };
  });

  return (
    <div className="p-2 overflow-auto h-full">
      <Tabs
        type="card"
        animated
        defaultActiveKey={activeTab}
        items={items}
        onChange={(key) => {
          setActiveTab(key);
          console.log("Active tab:", key);
        }}
      />
    </div>
  );
};

export default DataDefinition;
