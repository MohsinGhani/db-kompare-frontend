"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Space,
  message,
  Image,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import CommonModal from "@/components/shared/CommonModal";
import { DIFFICULTY, LESSON_CATEGORY, rankingOptions } from "@/utils/const";
import { createQuizQuesions, updateQuizQuestion } from "@/utils/quizUtil";
import CommonS3ImagePicker from "@/components/shared/CommonS3ImagePicker";
import CommonCategoryTreeSelect from "@/components/shared/CommonCategoryTreeSelect";

const S3_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

const ManageQuestionModal = ({
  isModalOpen,
  question = null,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Image picker state
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Initialize form & images when editing
  useEffect(() => {
    if (question) {
      form.setFieldsValue({
        question: question.question,
        category: question.category.name,
        difficulty: question.difficulty,
        explanation: question.explanation,
        options: question.options.map((opt) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      });
      // Map existing image keys to display items
      if (Array.isArray(question.images)) {
        setSelectedImages(
          question.images.map((key) => ({ key, url: `${S3_URL}/${key}` }))
        );
      } else {
        setSelectedImages([]);
      }
    } else {
      form.resetFields();
      setSelectedImages([]);
    }
  }, [question, form]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    setSelectedImages([]);
    onClose();
  }, [form, onClose]);

  // Remove a selected image by key
  const removeSelectedImage = useCallback((key) => {
    setSelectedImages((prev) => prev.filter((img) => img.key !== key));
  }, []);

  const onFinish = useCallback(
    async (values) => {
      // setSubmitting(true);
      try {
        // Prepare options
        const formattedOptions = values.options.map((opt) => ({
          text: opt.text.trim(),
          isCorrect: Boolean(opt.isCorrect),
        }));
        const correctCount = formattedOptions.filter((o) => o.isCorrect).length;

        // Build payload including image keys array
        const payload = {
          question: values.question.trim(),
          category: values.category,
          difficulty: values.difficulty,
          explanation: values.explanation?.trim() || "",
          images: selectedImages.map((img) => img.key),
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
        setSelectedImages([]);
        onSuccess?.();
        onClose();
      } catch (err) {
        console.error(err);
        message.error("Failed to save question");
      } finally {
        setSubmitting(false);
      }
    },
    [question, form, onClose, onSuccess, selectedImages]
  );

  console.log("question", question);

  return (
    <CommonModal
      isModalOpen={isModalOpen}
      handleCancel={handleCancel}
      footer={null}
      title={question ? "Edit Question" : "Create Question"}
      destroyOnClose
      forceRender
      
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          difficulty: DIFFICULTY.EASY,
          options: [{ text: "", isCorrect: false }],
        }}
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
          <CommonCategoryTreeSelect
            placeholder="Select category"
            onChange={(value, categoryName) =>
              form.setFieldsValue({ category: categoryName, categoryName })
            }
          />
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

        {/* Image Picker */}
        <div style={{ marginBottom: 16 }}>
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() => setPickerVisible(true)}
          >
            Select Images from S3
          </Button>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedImages.map((img) => (
              <div
                key={img.key}
                style={{ position: "relative", display: "inline-block" }}
              >
                <Image
                  preview
                  width={80}
                  src={img.url}
                  alt="Selected"
                  style={{ border: "1px solid #ddd", borderRadius: 4 }}
                />
                <CloseCircleOutlined
                  onClick={() => removeSelectedImage(img.key)}
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    fontSize: 16,
                    color: "#ff4d4f",
                    cursor: "pointer",
                    background: "#fff",
                    borderRadius: "50%",
                  }}
                />
              </div>
            ))}
          </div>
          <CommonS3ImagePicker
            visible={pickerVisible}
            multiple
            onSelect={(items) => {
              // merge new items, avoid duplicates
              setSelectedImages((prev) => {
                const existingKeys = new Set(prev.map((i) => i.key));
                return [
                  ...prev,
                  ...items.filter((i) => !existingKeys.has(i.key)),
                ];
              });
              setPickerVisible(false);
            }}
            onClose={() => setPickerVisible(false)}
          />
        </div>

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
          <Button type="primary" htmlType="submit" block loading={submitting}>
            {question ? "Update Question" : "Add Question"}
          </Button>
        </Form.Item>
      </Form>
    </CommonModal>
  );
};

export default ManageQuestionModal;
