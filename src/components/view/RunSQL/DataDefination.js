"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { Button, Input, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CommonTable from "@/components/shared/CommonTable";
import { toast } from "react-toastify";
import { executeQuery } from "@/utils/runSQL";

const DataDefinition = ({ dataSample, user, fetchData, fiddleId }) => {
  // Memoize the tab keys.
  const tabKeys = useMemo(() => Object.keys(dataSample || {}), [dataSample]);
  const [activeTab, setActiveTab] = useState(tabKeys[0] || "");
  const [dataSources, setDataSources] = useState({});
  const [counts, setCounts] = useState({});
  // Loading state for each tab.
  const [loading, setLoading] = useState({});

  // Use refs to track original row keys and original row data.
  const originalKeysRef = useRef(new Set());
  const originalRowsRef = useRef({}); // { tabKey: { key: originalRow, ... } }

  // Initialize data sources and counts when dataSample changes.
  useEffect(() => {
    const initialSources = {};
    const initialCounts = {};
    const origKeys = new Set();
    const origRows = {};

    tabKeys.forEach((tabKey) => {
      const rows = (dataSample[tabKey] || []).map((item, index) => {
        const key = `${tabKey}-${index}`;
        origKeys.add(key);
        if (!origRows[tabKey]) origRows[tabKey] = {};
        origRows[tabKey][key] = { key, ...item };
        return { key, ...item };
      });
      initialSources[tabKey] = rows;
      initialCounts[tabKey] = rows.length;
    });
    setDataSources(initialSources);
    setCounts(initialCounts);
    originalKeysRef.current = origKeys;
    originalRowsRef.current = origRows;

    if (!activeTab && tabKeys.length > 0) {
      setActiveTab(tabKeys[0]);
    }
  }, [dataSample, tabKeys, activeTab]);

  // Add a new row for the given tab. New rows are not part of the original data so they are editable.
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

  // Save the updated row locally (only applicable for new rows).
  const handleSave = (tabKey, row) => {
    const newData = (dataSources[tabKey] || []).map((item) =>
      item.key === row.key ? row : item
    );
    setDataSources({ ...dataSources, [tabKey]: newData });
  };

  // Insert new rows only. Existing rows (originalKeysRef) are not inserted/updated.
  const handleInsert = async (tabKey) => {
    setLoading((prev) => ({ ...prev, [tabKey]: true }));
    const currentRows = dataSources[tabKey] || [];
    const rowsToInsert = currentRows.filter((row) => {
      if (originalKeysRef.current.has(row.key)) return false;
      // Check that the row has at least one non-empty value.
      const keys = Object.keys(row).filter((k) => k !== "key");
      return keys.some((k) => {
        const value = row[k];
        return (
          value !== null && value !== undefined && String(value).trim() !== ""
        );
      });
    });

    const columnsSet = new Set();
    rowsToInsert.forEach((row) => {
      Object.keys(row).forEach((col) => {
        if (col !== "key") {
          columnsSet.add(col);
        }
      });
    });
    const columns = Array.from(columnsSet);
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
    try {
      const res = await executeQuery({
        userId: user.id,
        query: queryString,
      });
      if (!res?.data) {
        toast.error(res?.message?.error || "Insert failed");
      } else {
        toast.success("Data inserted successfully!");
        fetchData(fiddleId); // Refresh the data after insertion.
      }
    } catch (err) {
      toast.error(err?.message || "Error inserting data");
    } finally {
      setLoading((prev) => ({ ...prev, [tabKey]: false }));
    }
  };

  // Create dynamic tab items.
  const items = tabKeys.map((tabKey) => {
    const tabDataSample = dataSample[tabKey] || [];
    const dynamicColumnsKeys =
      tabDataSample.length > 0 ? Object.keys(tabDataSample[0]) : [];
    const columns = dynamicColumnsKeys.map((key) => ({
      title: key.charAt(0) + key.slice(1),
      dataIndex: key,
      render: (text, record) => {
        const isOriginal =
          originalRowsRef.current[tabKey] &&
          originalRowsRef.current[tabKey][record.key] !== undefined;
        return isOriginal ? (
          <span>{text}</span>
        ) : (
          <Input
            defaultValue={text}
            onBlur={(e) =>
              handleSave(tabKey, { ...record, [key]: e.target.value })
            }
          />
        );
      },
    }));

    const editableColumns = columns.map((col) => ({
      ...col,
      onCell: (record) => ({
        record,
        editable: !(
          originalRowsRef.current[tabKey] &&
          originalRowsRef.current[tabKey][record.key] !== undefined
        ),
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
          footer={() => {
            // Determine if any new row exists (i.e. a row not in originalKeysRef).
            const newRowsExist = (dataSources[tabKey] || []).some(
              (row) => !originalKeysRef.current.has(row.key)
            );
            return (
              <div className="flex justify-between items-center bg-[#FCFCFF] p-2">
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
                  disabled={loading[tabKey] || !newRowsExist}
                >
                  {loading[tabKey] ? "Inserting..." : "INSERT"}
                </Button>
              </div>
            );
          }}
        />
      ),
    };
  });

  return (
    <div className="p-2 overflow-auto h-full">
      <Tabs
        type="card"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        tabBarGutter={5}
      />
    </div>
  );
};

export default DataDefinition;
