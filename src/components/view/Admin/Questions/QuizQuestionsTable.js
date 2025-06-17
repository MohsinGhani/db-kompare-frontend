// src/pages/admin/questions.jsx

"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Space, Popconfirm, Select, Modal, Form } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CommonTable from "@/components/shared/CommonTable";
import CommonModal from "@/components/shared/CommonModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  deleteQuizQuestion,
  fetchQuizzesQuestions,
  bulkUpdateQuizQuestions,
} from "@/utils/quizUtil";
import { toast } from "react-toastify";
import ManageQuestionModal from "./ManageQuestionModal";
import { rankingOptions } from "@/utils/const";
import CommonCategoryTreeSelect from "@/components/shared/CommonCategoryTreeSelect";

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

  // Filtering state
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [subcategoryFilter, setSubcategoryFilter] = useState(null);

  // Bulk edit modal state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState(null);
  const [bulkSubcategory, setBulkSubcategory] = useState(null);

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
    let data;
    try {
      if (categoryFilter) {
        const queryParams = {
          category: categoryFilter,
        };
        data = await fetchQuizzesQuestions(queryParams);
      } else {
        data = await fetchQuizzesQuestions();
      }
      setQuestions(data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions, categoryFilter]);

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

  // Bulk edit handlers
  const openBulkEditModal = () => {
    setBulkCategory(null);
    setBulkSubcategory(null);
    setIsBulkModalOpen(true);
  };

  const handleBulkEditOk = async () => {
    if (!bulkCategory && !bulkSubcategory) {
      toast.warning("Select at least one field to update");
      return;
    }
    setLoading(true);
    try {
      // Assuming bulkUpdateQuizQuestions takes (idsArray, payload)
      const payload = {};
      if (bulkCategory) payload.category = bulkCategory;
      if (bulkSubcategory) payload.subcategory = bulkSubcategory;

      await bulkUpdateQuizQuestions(selectedRowKeys, payload);
      toast.success("Questions updated successfully");
      setIsBulkModalOpen(false);
      setSelectedRowKeys([]);
      await loadQuestions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to bulk update questions");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkEditCancel = () => {
    setIsBulkModalOpen(false);
  };

  // Only supply rowSelection when isRowSelect is true
const rowSelection = isRowSelect
  ? {
      selectedRowKeys,
      onChange: (keys) => {
        // Merging the new keys with the previously selected keys and removing duplicates
        const updatedKeys = [...new Set([...selectedRowKeys, ...keys])];
        setSelectedRowKeys(updatedKeys); // Set the updated keys
      },
    }
  : undefined;

  const columns = [
    {
      title: "Question NO",
      dataIndex: "questionNo",
      key: "questionNo",
      ellipsis: true,
      className: "font-semibold text-left",
      onCell: () => ({ style: { padding: "10px 16px" } }),
      render: (text) => <div className="whitespace-pre-wrap">{text}</div>,
      sorter: (a, b) => a.questionNo - b.questionNo,
    },
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      ellipsis: true,
      width: "40%",
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
      render: (category) => (
        <p className="whitespace-pre-wrap capitalize">{category?.name}</p>
      ),
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
      <div className="flex mt-8 mb-4 gap-2 items-center">
        <CommonCategoryTreeSelect
          className="w-96"
          onChange={(value) => setCategoryFilter(value)}
          onClear={() => setCategoryFilter(null)}
        />

        {/* 
        {isRowSelect && (
          <Button
            type="primary"
            onClick={openBulkEditModal}
            disabled={!selectedRowKeys.length}
          >
            Bulk Edit
          </Button>
        )} */}
      </div>

      <CommonTable
        rowKey="id"
        dataSource={questions}
        columns={columns}
        loading={loading}
        bordered
        rowSelection={rowSelection}
      />

      {/* Single Question Modal */}
      <ManageQuestionModal
        isModalOpen={isModalOpen}
        question={editingQuestion}
        onClose={closeModal}
        onSuccess={loadQuestions}
      />

      {/* Bulk Edit Modal */}
      {/* <Modal
        open={isBulkModalOpen}
        onOk={handleBulkEditOk}
        onCancel={handleBulkEditCancel}
        title="Bulk Edit Questions"
        centered
        destroyOnClose
        width={400}
      >
    <Form form={form} layout="vertical" name="bulk-edit-form">
        <div className="flex flex-col gap-4">
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <CommonCategoryTreeSelect
              placeholder="Select Category"
              onChange={handleCategoryChange}
            />
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="Difficulty Level"
            rules={[{ required: true, message: "Please select difficulty level" }]}
          >
            <Select
              placeholder="Select difficulty level"
              onChange={handleDifficultyChange}
              className="w-full"
            >
              {Object.values(LESSON_CATEGORY).map((level) => (
                <Select.Option key={level} value={level}>
                  {level}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
      </Modal> */}
    </>
  );
};

export default QuizQuestionsTable;
