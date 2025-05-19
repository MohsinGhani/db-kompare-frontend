"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../";
import { Button, Table, Space, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { fetchQuizzes, deleteQuiz } from "@/utils/quizUtil";
import CommonTable from "@/components/shared/CommonTable";

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

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteQuiz(id);
      message.success("Quiz deleted");
      await loadQuizzes();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete quiz");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
    },
    {
      title: "Passing %",
      dataIndex: "passingPerc",
      key: "passingPerc",
    },
    {
      title: "Total Questions",
      dataIndex: "totalQuestions",
      key: "totalQuestions",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => router.push(`/admin/quiz/${record.id}`)}
          />
          <Popconfirm
            title="Delete this quiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
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
