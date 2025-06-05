// src/components/ManageQuestionModal.jsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Space,
  message,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import CommonModal from "@/components/shared/CommonModal";
import { LESSON_CATEGORY, rankingOptions } from "@/utils/const";
import { createQuizQuesions, updateQuizQuestion } from "@/utils/quizUtil";

const ManageQuestionModal = ({
  isModalOpen,
  question = null,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (question) {
      form.setFieldsValue({
        question: question.question,
        category: question.category,
        difficulty: question.difficulty,
        explanation: question.explanation,
        image: question.image,
        options: question.options.map((opt) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      });
    } else {
      form.resetFields();
    }
  }, [question, form]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  const onFinish = useCallback(
    async (values) => {
      setSubmitting(true);
      try {
        const formattedOptions = values.options.map((opt) => ({
          text: opt.text.trim(),
          isCorrect: Boolean(opt.isCorrect),
        }));
        const correctCount = formattedOptions.filter((o) => o.isCorrect).length;
        const payload = {
          question: values.question.trim(),
          category: values.category,
          difficulty: values.difficulty,
          explanation: values.explanation?.trim() || "",
          image: values.image?.trim() || null,
          options: formattedOptions,
          correctCount,
          isMultipleAnswer: correctCount > 1,
        };

        if (question?.id) {
          await updateQuizQuestion(question.id, payload);
          message.success("Question updated successfully");
        } else {
          await createQuizQuesions([payload]);
          message.success("Question created successfully");
        }

        form.resetFields();
        onSuccess?.();
        onClose();
      } catch (err) {
        console.error(err);
        message.error("Failed to save question");
      } finally {
        setSubmitting(false);
      }
    },
    [question, form, onClose, onSuccess]
  );

  return (
    <CommonModal
      isModalOpen={isModalOpen}
      handleCancel={handleCancel}
      footer={null}
      title={question ? "Edit Question" : "Create Question"}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ options: [{ text: "", isCorrect: false }] }}
      >
        <Form.Item
          name="question"
          label="Question"
          rules={[{ required: true, message: "Please enter the question" }]}
        >
          <Input placeholder="Enter question here" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            showSearch
            placeholder="Select a category"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {rankingOptions.slice(1).map(({ value, label }) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="difficulty"
          label="Difficulty Level"
          rules={[
            { required: true, message: "Please select difficulty level" },
          ]}
        >
          <Select placeholder="Select difficulty level">
            {Object.values(LESSON_CATEGORY).map((level) => (
              <Select.Option key={level} value={level}>
                {level}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="explanation" label="Explanation">
          <Input.TextArea
            rows={3}
            placeholder="Enter explanation (optional)"
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="image"
          label="Image S3 Key"
          tooltip="Enter the S3 key if an image is already uploaded; otherwise leave blank"
        >
          <Input placeholder="e.g. question-123.png" />
        </Form.Item>

        <Form.Item label="Options" required>
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    align="baseline"
                    style={{ display: "flex", marginBottom: 8 }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "text"]}
                      rules={[{ required: true, message: "Option text" }]}
                    >
                      <Input placeholder={`Option ${name + 1}`} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "isCorrect"]}
                      valuePropName="checked"
                    >
                      <Checkbox>Correct</Checkbox>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Option
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitting}
          >
            {question ? "Update Question" : "Add Question"}
          </Button>
        </Form.Item>
      </Form>
    </CommonModal>
  );
};

export default ManageQuestionModal;
