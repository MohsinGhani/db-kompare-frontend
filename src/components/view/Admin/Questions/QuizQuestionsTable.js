// src/pages/admin/questions.jsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CommonTable from "@/components/shared/CommonTable";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { deleteQuizQuestion, fetchQuizzesQuestions } from "@/utils/quizUtil";
import { toast } from "react-toastify";
import ManageQuestionModal from "./ManageQuestionModal";

dayjs.extend(relativeTime);

const QuizQuestionsTable = ({
  isRowSelect = false,
  isModalOpen,
  setIsModalOpen,
  selectedRowKeys,
  setSelectedRowKeys,
}) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const openEditModal = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchQuizzesQuestions();
      setQuestions(data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleDelete = async (record) => {
    setLoading(true);
    try {
      await deleteQuizQuestion(record.id);
      toast.success("Question deleted successfully");
      await loadQuestions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete question");
    } finally {
      setLoading(false);
    }
  };

  // Only supply rowSelection when isRowSelect is true
  const rowSelection = isRowSelect
    ? {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
      }
    : undefined;

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
            onClick={() => openEditModal(record)}
            type="default"
            size="small"
            className="hover:bg-blue-100"
          />
          <Popconfirm
            title="Delete this question?"
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
    <>
      <CommonTable
        rowKey="id"
        dataSource={questions}
        columns={columns}
        loading={loading}
        bordered
        rowSelection={rowSelection}
      />

      <ManageQuestionModal
        isModalOpen={isModalOpen}
        question={editingQuestion}
        onClose={closeModal}
        onSuccess={loadQuestions}
      />
    </>
  );
};

export default QuizQuestionsTable;
