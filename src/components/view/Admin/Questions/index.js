// src/pages/admin/questions.jsx

"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../";
import { Button, Space, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "nextjs-toploader/app";
import CommonTable from "@/components/shared/CommonTable";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { _removeFileFromS3 } from "@/utils/s3Services";
import { fetchQuizzesQuestions } from "@/utils/quizUtil";

dayjs.extend(relativeTime);

const Questions = () => {
    
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await fetchQuizzesQuestions();
      setQuestions(data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

 

  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      ellipsis: true,
      className: "font-semibold text-left",
      onCell: () => ({ style: { padding: "10px 16px" } }),
      render: (text) => <div className="whitespace-pre-wrap">{text}</div>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
      sortDirections: ["ascend", "descend"],
      className: "text-left",
      onCell: () => ({ style: { padding: "10px 16px" } }),
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      sorter: (a, b) => a.difficulty.localeCompare(b.difficulty),
      sortDirections: ["ascend", "descend"],
      className: "text-left",
      onCell: () => ({ style: { padding: "10px 16px" } }),
    },
    {
      title: "Correct Count",
      dataIndex: "correctCount",
      key: "correctCount",
      sorter: (a, b) => a.correctCount - b.correctCount,
      sortDirections: ["ascend", "descend"],
      align: "center",
      onCell: () => ({ style: { padding: "10px 16px", whiteSpace: "nowrap" } }),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => a.createdAt - b.createdAt,
      sortDirections: ["ascend", "descend"],
      render: (ts) => (
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium">
            {new Date(ts).toLocaleString()}
          </span>
          <span className="text-gray-500 text-sm italic">
            {dayjs(ts).fromNow()}
          </span>
        </div>
      ),
      className: "text-left",
      onCell: () => ({ style: { padding: "10px 16px" } }),
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => router.push(`/admin/questions/${record.id}`)}
            type="default"
            size="small"
            className="hover:bg-blue-100"
          />
          <Popconfirm
            title="Delete this question?"
            // onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
              className="hover:bg-red-100"
            />
          </Popconfirm>
        </Space>
      ),
      className: "text-center",
      onCell: () => ({ style: { padding: "10px 16px", whiteSpace: "nowrap" } }),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Questions ({questions.length})</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/admin/questions/new")}
        >
          Create Question
        </Button>
      </div>
      <CommonTable
        rowKey="id"
        dataSource={questions}
        columns={columns}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default Questions;
