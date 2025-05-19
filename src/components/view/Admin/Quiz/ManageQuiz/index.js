"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Checkbox,
  Space,
  message,
  Spin,
  Modal,
} from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import AdminLayout from "../..";
import { LESSON_CATEGORY, TOPICS_CATEGORIES } from "@/utils/const";
import { ulid } from "ulid";
import { _putFileToS3, _removeFileFromS3 } from "@/utils/s3Services";
import { createQuiz, fetchQuizById, updateQuiz } from "@/utils/quizUtil";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const { Dragger } = Upload;
const { TextArea } = Input;

const normFile = (e) => e?.fileList;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// S3 base URL (e.g. https://your-bucket.s3.amazonaws.com)
const S3_BASE_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

const ManageQuiz = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const userDetails = useSelector((state) => state.auth.userDetails);
  const user = userDetails?.data?.data;

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchQuizById(id)
        .then((res) => {
          const quiz = res.data;
          // Initialize form with existing values and existing image fileList
          form.setFieldsValue({
            name: quiz.name,
            passingPerc: quiz.passingPerc,
            category: quiz.category,
            difficulty: quiz.difficulty,
            description: quiz.description,
            questions: quiz.questions.map((q) => ({
              question: q.question,
              id: q.id,
              file: q.image
                ? [
                    {
                      uid: q.image,
                      name: q.image,
                      status: "done",
                      url: `${S3_BASE_URL}/QUIZZES/${q.image}`,
                    },
                  ]
                : [],
              options: q.options,
              explanation: q.explanation,
            })),
          });
        })
        .catch(() => {
          message.error("Failed to load quiz data");
        })
        .finally(() => setLoading(false));
    }
  }, [id, form]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    console.log("file", file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewVisible(true);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const questionsWithImages = await Promise.all(
        values.questions.map(async (q) => {
          console.log("q", q);
          // Use existing qid or generate new
          const qid = q.id || ulid();
          let imageKey = null;
          if (q.file?.[0]?.originFileObj) {
            const fileObj = q.file[0].originFileObj;
            const ext =
              fileObj.name.split(".").pop().toLowerCase() ||
              fileObj.type.split("/")[1];
            const key = `QUIZZES/${qid}.${ext}`;

            // Check if the file already exists in S3
            if (key !== q.image) {
              // Remove old image if it exists
              await _removeFileFromS3(q.file[0].url);
              // Upload new image
              await _putFileToS3(key, fileObj, 200 * 1024, fileObj.type);
            } else {
              await _putFileToS3(key, fileObj, 200 * 1024, fileObj.type);
            }

            imageKey = `${qid}.${ext}`;
          } else if (q.file?.[0]?.url) {
            imageKey = q.file[0].url.split("/").pop();
          }
          const correctCount = q.options.filter((o) => o.isCorrect).length;
          const options = q.options.map((opt) => {
            const oid = opt.oid || ulid();
            return {
              id: oid,
              text: opt.text,
              isCorrect: opt.isCorrect || false,
            };
          });
          return {
            id: qid,
            question: q.question,
            options,
            explanation: q.explanation,
            image: imageKey,
            isMultipleAnswer: correctCount > 1,
            correctCount,
          };
        })
      );
      const payload = {
        name: values.name,
        passingPerc: values.passingPerc,
        category: values.category,
        difficulty: values.difficulty,
        description: values.description,
        questions: questionsWithImages,
        totalQuestions: questionsWithImages.length,
        createdBy: user?.id,
      };
      if (id) {
        await updateQuiz(id, payload);
        message.success("Quiz updated successfully");
      } else {
        await createQuiz(payload);
        message.success("Quiz created successfully");
      }
      router.push("/admin/quiz");
    } catch (error) {
      console.error(error);
      message.error("Error saving quiz");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin tip="Loading..." style={{ marginTop: 100 }} />;
  }

  return (
    <AdminLayout>
      <div className="max-w-[80%]">
        <h1 className="text-2xl font-semibold mb-4">
          {id ? "Edit Quiz" : "Create Quiz"}
        </h1>
        <Form
          form={form}
          layout="vertical"
          name="manage_quiz"
          onFinish={onFinish}
          initialValues={{ questions: [] }}
        >
          <div className="bg-white border rounded-lg p-6 mb-4">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter quiz name" }]}
            >
              <Input placeholder="Enter name here." />
            </Form.Item>
            <Form.Item
              name="passingPerc"
              label="Passing Percentage (%)"
              rules={[
                { required: true, message: "Please enter passing percentage" },
              ]}
            >
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="Enter passing percentage here."
              />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Please select a category">
                {Object.values(TOPICS_CATEGORIES).map((cat) => (
                  <Select.Option key={cat} value={cat}>
                    {cat}
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
              <Select placeholder="Please select difficulty level">
                {Object.values(LESSON_CATEGORY).map((level) => (
                  <Select.Option key={level} value={level}>
                    {level}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="description" label="Short Description">
              <TextArea rows={4} placeholder="Enter short description here." />
            </Form.Item>
          </div>
          {/* Questions */}
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }, index) => (
                  <div
                    key={key}
                    className="bg-white border rounded-lg p-6 mb-4"
                  >
                    <Space
                      align="baseline"
                      style={{ justifyContent: "space-between", width: "100%" }}
                    >
                      <h3 className="font-semibold text-lg mb-3">
                        Question {index + 1}
                      </h3>
                      <MinusCircleOutlined
                        className="text-red-600"
                        onClick={() => remove(name)}
                      />
                    </Space>
                    <Form.Item
                      name={[name, "question"]}
                      label="Question"
                      rules={[
                        { required: true, message: "Please enter question" },
                      ]}
                    >
                      <Input placeholder="Enter question here" />
                    </Form.Item>
                    <Form.Item
                      name={[name, "file"]}
                      label="Upload Image"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                    >
                      <Dragger
                        accept="image/*"
                        maxCount={1}
                        listType="picture"
                        onPreview={handlePreview}
                        showUploadList={{
                          showPreviewIcon: true,
                          showRemoveIcon: true,
                        }}
                      >
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Click or drag an image to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                          Only images are accepted and will upload upon form
                          submit.
                        </p>
                      </Dragger>
                    </Form.Item>
                    <Form.Item label="Options">
                      <Form.List name={[name, "options"]}>
                        {(
                          optFields,
                          { add: addOption, remove: removeOption }
                        ) => (
                          <>
                            {optFields.map(({ key: optKey, name: optName }) => (
                              <Space
                                key={optKey}
                                align="baseline"
                                style={{ display: "flex", marginBottom: 8 }}
                              >
                                <Form.Item
                                  name={[optName, "text"]}
                                  rules={[
                                    { required: true, message: "Option text" },
                                  ]}
                                >
                                  <Input
                                    placeholder={`Option ${optName + 1}`}
                                  />
                                </Form.Item>
                                <Form.Item
                                  name={[optName, "isCorrect"]}
                                  valuePropName="checked"
                                >
                                  <Checkbox>Mark as correct answer</Checkbox>
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => removeOption(optName)}
                                />
                              </Space>
                            ))}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => addOption()}
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
                    <Form.Item name={[name, "explanation"]} label="Explanation">
                      <TextArea
                        rows={3}
                        placeholder="Enter explanation (optional)"
                      />
                    </Form.Item>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Question
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {id ? "Update Quiz" : "Create Quiz"}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </AdminLayout>
  );
};

export default ManageQuiz;
