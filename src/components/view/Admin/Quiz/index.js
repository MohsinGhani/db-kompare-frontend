"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../";
import { Button, Table, Space, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "nextjs-toploader/app";
import { fetchQuizzes, deleteQuiz } from "@/utils/quizUtil";
import CommonTable from "@/components/shared/CommonTable";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { _removeFileFromS3 } from "@/utils/s3Services";

dayjs.extend(relativeTime);
const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await fetchQuizzes();
      setQuizzes(data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);
  const handleDelete = async (quiz) => {
    setLoading(true);
    try {
      if (quiz?.questions?.length) {
        const removalPromises = quiz.questions
          .filter((q) => q.image)
          .map((q) => _removeFileFromS3(`QUIZZES/${q.image}`));
        await Promise.all(removalPromises);
      }

      await deleteQuiz(quiz.id);
      message.success("Quiz and associated images deleted successfully");
      await loadQuizzes();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete quiz and its images");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      // Styling header and cells
      className: "font-semibold text-left",
      onCell: () => ({ style: { padding: "10px 16px" } }),
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
      title: "Passing %",
      dataIndex: "passingPerc",
      key: "passingPerc",
      sorter: (a, b) => Number(a.passingPerc) - Number(b.passingPerc),
      sortDirections: ["ascend", "descend"],
      onCell: () => ({ style: { padding: "10px 16px", whiteSpace: "nowrap" } }),
    },
    {
      title: "Total Questions",
      dataIndex: "totalQuestions",
      key: "totalQuestions",
      sorter: (a, b) => a.totalQuestions - b.totalQuestions,
      sortDirections: ["ascend", "descend"],
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
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => router.push(`/admin/quiz/${record.id}`)}
            type="default"
            size="small"
            className="hover:bg-blue-100"
          />
          <Popconfirm
            title="Delete this quiz?"
            onConfirm={() => handleDelete(record)}
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
        <h1 className="text-2xl font-semibold">Quizzes ({quizzes.length})</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/admin/quiz/new")}
        >
          Create Quiz
        </Button>
      </div>
      <CommonTable
        rowKey="id"
        dataSource={quizzes}
        columns={columns}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default Quiz;
