"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button, Input, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CommonTable from "@/components/shared/CommonTable";
import { toast } from "react-toastify";
import { executeQuery } from "@/utils/runSQL";

const DataDefinition = ({ dataSample, user }) => {
  // Memoize tabKeys so that the array reference remains stable unless dataSample changes.
  const tabKeys = useMemo(() => Object.keys(dataSample || {}), [dataSample]);
  const [activeTab, setActiveTab] = useState(tabKeys[0] || "");
  const [dataSources, setDataSources] = useState({});
  const [counts, setCounts] = useState({});
  // We'll store the keys of the original rows to avoid inserting duplicate rows.
  const originalKeysRef = useRef(new Set());

  // Initialize data sources and counts when dataSample changes.
  useEffect(() => {
    const initialSources = {};
    const initialCounts = {};
    const origKeys = new Set();
    tabKeys.forEach((tabKey) => {
      const data = (dataSample[tabKey] || []).map((item, index) => {
        const key = `${tabKey}-${index}`;
        origKeys.add(key);
        return { key, ...item };
      });
      initialSources[tabKey] = data;
      initialCounts[tabKey] = data.length;
    });
    setDataSources(initialSources);
    setCounts(initialCounts);
    originalKeysRef.current = origKeys;
    if (!activeTab && tabKeys.length > 0) {
      setActiveTab(tabKeys[0]);
    }
  }, [dataSample, tabKeys, activeTab]);

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

  // Handle insert for a given tab.
  // Only rows that are not part of the original data and have at least one non-empty value (ignoring 'key') will be inserted.
  const handleInsert = async (tabKey) => {
    console.log("Inserting data for tab:", tabKey);
    const currentRows = dataSources[tabKey] || [];

    // Filter out rows that are completely empty (ignoring the 'key')
    // and filter out rows that were part of the original data.
    const rowsToInsert = currentRows.filter((row) => {
      if (originalKeysRef.current.has(row.key)) {
        return false;
      }
      const keys = Object.keys(row).filter((k) => k !== "key");
      return keys.some((k) => {
        const value = row[k];
        return (
          value !== null && value !== undefined && String(value).trim() !== ""
        );
      });
    });
    console.log("Rows to insert:", rowsToInsert);

    // if (rowsToInsert.length === 0) {
    //   toast.info("No new data to insert");
    //   return;
    // }

    // Determine columns: union of keys in rowsToInsert, excluding 'key'.
    const columnsSet = new Set();
    rowsToInsert.forEach((row) => {
      Object.keys(row).forEach((col) => {
        if (col !== "key") {
          columnsSet.add(col);
        }
      });
    });
    const columns = Array.from(columnsSet);
    // if (columns.length === 0) {
    //   toast.info("No data columns to insert");
    //   return;
    // }

    // Build a single INSERT query for all rows.
    const valuesClause = rowsToInsert
      .map((row) => {
        const vals = columns.map((col) => {
          const value = row[col];
          if (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
          ) {
            return "NULL";
          } else {
            // Escape single quotes.
            const escaped = String(value).replace(/'/g, "''");
            return `'${escaped}'`;
          }
        });
        return `(${vals.join(", ")})`;
      })
      .join(",\n");

    const queryString = `INSERT INTO ${tabKey} (${columns.join(
      ", "
    )}) VALUES ${valuesClause};`;
    console.log("Insert Query:", queryString);
    try {
      const res = await executeQuery({
        userId: user.id,
        query: queryString,
      });
      if (!res?.data) {
        toast.error("Insert failed");
      } else {
        toast.success("Data inserted successfully!");
        // Optionally, update state or refetch data here.
      }
    } catch (err) {
      toast.error(err?.message || "Error inserting data");
    }
  };

  // Create dynamic tab items using the new antd Tabs API.
  const items = tabKeys.map((tabKey) => {
    const tabDataSample = dataSample[tabKey] || [];
    const dynamicColumnsKeys =
      tabDataSample.length > 0 ? Object.keys(tabDataSample[0]) : [];
    const columns = dynamicColumnsKeys.map((key) => ({
      title: key.charAt(0) + key.slice(1),
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
      label: tabKey.charAt(0) + tabKey.slice(1),
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
          className="data-define-table"
          footer={() => (
            <div className="flex justify-between items-center bg-[#FCFCFF] p-2 ">
              <div
                className="cursor-pointer text-primary"
                onClick={() => handleAdd(tabKey)}
              >
                <PlusOutlined /> New row
              </div>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                size="small"
                onClick={() => handleInsert(tabKey)}
              >
                INSERT
              </Button>
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
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
      />
    </div>
  );
};

export default DataDefinition;
