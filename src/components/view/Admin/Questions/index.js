"use client";
import React, { useState } from "react";
import AdminLayout from "../";
import { Button, Upload } from "antd";
import { EditFilled, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { _removeFileFromS3 } from "@/utils/s3Services";
import { createQuizQuesions } from "@/utils/quizUtil";
import { toast } from "react-toastify";
import QuizQuestionsTable from "./QuizQuestionsTable";

dayjs.extend(relativeTime);

const Questions = () => {
  const [uploading, setUploading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // Handle JSON file upload
  const handleFileUpload = (file) => {
    const isJson =
      file.type === "application/json" || file.name.endsWith(".json");
    if (!isJson) {
      toast.error("You can only upload JSON files.");
      return Upload.LIST_IGNORE;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const text = reader.result;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          toast.error("JSON must be a non-empty array of questions.");
        } else {
          await createQuizQuesions(parsed);
          toast.success("Questions uploaded successfully");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to parse or upload JSON");
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
      setUploading(false);
    };
    reader.readAsText(file);

    return Upload.LIST_IGNORE;
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Questions Bank</h1>
        <div className="flex items-center space-x-2">
          {selectedRowKeys?.length > 0 && (
            <Button
              type="primary"
              icon={<EditFilled />}
              onClick={openCreateModal}
            >
              Bulk Edit
            </Button>
          )}
          <Upload
            accept=".json"
            beforeUpload={handleFileUpload}
            showUploadList={false}
            disabled={uploading}
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              loading={uploading}
            >
              Bulk Upload Questions
            </Button>
          </Upload>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Create Question
          </Button>
        </div>
      </div>
      <QuizQuestionsTable
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isRowSelect
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </AdminLayout>
  );
};

export default Questions;
