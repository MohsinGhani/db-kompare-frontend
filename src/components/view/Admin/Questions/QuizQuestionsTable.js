// src/pages/admin/questions.jsx

"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Space, Popconfirm, Select } from "antd";
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

  // Derive unique categories (skip first dummy element if needed)
  const categoryOptions = useMemo(
    () =>
      rankingOptions.slice(1).map((opt) => ({
        label: opt.label,
        value: opt.value,
      })),
    []
  );

  // Derive subcategories based on current questions + applied categoryFilter
  const availableSubcategories = useMemo(() => {
    const setSub = new Set();
    questions.forEach((q) => {
      if (!categoryFilter || q.category === categoryFilter) {
        if (q.subcategory) {
          setSub.add(q.subcategory);
        }
      }
    });
    return Array.from(setSub).sort();
  }, [questions, categoryFilter]);

  // Filtered questions for table rendering
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const byCategory = categoryFilter ? q.category === categoryFilter : true;
      const bySubcategory =
        subcategoryFilter && subcategoryFilter !== "all"
          ? q.subcategory === subcategoryFilter
          : true;
      return byCategory && bySubcategory;
    });
  }, [questions, categoryFilter, subcategoryFilter]);

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
      title: "Subcategory",
      dataIndex: "subcategory",
      key: "subcategory",
      sorter: (a, b) => {
        if (!a.subcategory) return -1;
        if (!b.subcategory) return 1;
        return a.subcategory.localeCompare(b.subcategory);
      },
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
      <div className="flex mt-8 mb-4 gap-2 items-center">
        <Select
          showSearch
          placeholder="Select Category"
          className="w-64"
          allowClear
          value={categoryFilter}
          onChange={(val) => {
            setCategoryFilter(val);
            setSubcategoryFilter(null);
          }}
        >
          {categoryOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Select Subcategory"
          className="w-64"
          showSearch
          allowClear
          value={subcategoryFilter}
          onChange={(val) => setSubcategoryFilter(val)}
        >
          <Select.Option key="all" value="all">
            All Subcategories
          </Select.Option>
          {availableSubcategories.map((sub) => (
            <Select.Option key={sub} value={sub}>
              {sub}
            </Select.Option>
          ))}
        </Select>

        {isRowSelect && (
          <Button
            type="primary"
            onClick={openBulkEditModal}
            disabled={!selectedRowKeys.length}
          >
            Bulk Edit
          </Button>
        )}
      </div>

      <CommonTable
        rowKey="id"
        dataSource={filteredQuestions}
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
      <CommonModal
        isModalOpen={isBulkModalOpen}
        handleOk={handleBulkEditOk}
        handleCancel={handleBulkEditCancel}
        title="Bulk Edit Questions"
        centered
        destroyOnClose
        width={400}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-medium mb-1">New Category</label>
            <Select
              showSearch
              placeholder="Select Category"
              className="w-full"
              allowClear
              value={bulkCategory}
              onChange={(val) => {
                setBulkCategory(val);
                setBulkSubcategory(null);
              }}
            >
              {categoryOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block font-medium mb-1">New Subcategory</label>
            <Select
              placeholder="Select Subcategory"
              className="w-full"
              showSearch
              allowClear
              value={bulkSubcategory}
              onChange={(val) => setBulkSubcategory(val)}
            >
              {/**
                If user picks a new bulkCategory, you might restrict subcategories
                to those under that category; otherwise show all from existing data.
              */}
              {/**
                We derive options from all questions that match either
                the currently selected bulkCategory or all if none chosen.
              */}
              {Array.from(
                new Set(
                  questions
                    .filter((q) =>
                      bulkCategory ? q.category === bulkCategory : true
                    )
                    .map((q) => q.subcategory)
                    .filter((s) => !!s)
                )
              )
                .sort()
                .map((sub) => (
                  <Select.Option key={sub} value={sub}>
                    {sub}
                  </Select.Option>
                ))}
            </Select>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default QuizQuestionsTable;
