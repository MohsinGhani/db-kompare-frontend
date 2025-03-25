"use client";

import React, { useState } from "react";
import { Table, Button, Input, Popconfirm, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CommonTable from "@/components/shared/CommonTable";

const DataDefination = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);

  const handleAdd = () => {
    const newData = {
      key: count,
      id: null,
      username: null,
      role: null,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    if (index > -1) {
      newData[index] = row;
      setDataSource(newData);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      editable: true,
      render: (text, record) => (
        <Input
          defaultValue={text}
          onBlur={(e) => {
            handleSave({ ...record, id: e.target.value });
          }}
        />
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      editable: true,
      render: (text, record) => (
        <Input
          defaultValue={text}
          onBlur={(e) => {
            handleSave({ ...record, username: e.target.value });
          }}
        />
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      editable: true,
      render: (text, record) => (
        <Input
          defaultValue={text}
          onBlur={(e) => {
            handleSave({ ...record, role: e.target.value });
          }}
        />
      ),
    },
  ];

  const editableColumns = columns.map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
    }),
  }));

  return (
    <div className="p-2 pb-10 overflow-auto h-full">
      <Tabs defaultActiveKey="users" onChange={setActiveTab}>
        <Tabs.TabPane tab="Posts" key="posts">
          <div className="table-container" style={{ marginBottom: "20px" }}>
            <CommonTable
              components={{
                body: {
                  cell: ({ children, ...restProps }) => (
                    <td {...restProps}>{children}</td>
                  ),
                },
              }}
              bordered
              dataSource={dataSource}
              columns={editableColumns}
              rowClassName="editable-row"
              pagination={false}
              size="small"
              footer={() => (
                <div
                  className="bg-[#FCFCFF] p-2 cursor-pointer text-primary "
                  onClick={handleAdd}
                  type="text"
                >
                  <PlusOutlined /> New row
                </div>
              )}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default DataDefination;
