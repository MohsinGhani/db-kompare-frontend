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
  DatePicker,
} from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import AdminLayout from "../..";
import {
  LESSON_CATEGORY,
  rankingOptions,
  TOPICS_CATEGORIES,
} from "@/utils/const";
import { ulid } from "ulid";
import { _putFileToS3, _removeFileFromS3 } from "@/utils/s3Services";
import { createQuiz, fetchQuizById, updateQuiz } from "@/utils/quizUtil";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import CommonLoader from "@/components/shared/CommonLoader";

const { Dragger } = Upload;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

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
          const quiz = res?.data;
          // Convert startDate and endDate strings to dayjs objects if present
          const startDate = quiz.startDate ? dayjs(quiz.startDate) : null;
          const endDate = quiz.endDate ? dayjs(quiz.endDate) : null;
          const quizImageList = quiz.quizImage
            ? [
                {
                  uid: quiz.quizImage,
                  name: "Quiz Image",
                  status: "done",
                  url: `${S3_BASE_URL}/QUIZZES/${quiz.quizImage}`,
                },
              ]
            : [];
          form.setFieldsValue({
            name: quiz.name,
            passingPerc: quiz.passingPerc,
            category: quiz.category,
            difficulty: quiz.difficulty,
            description: quiz.description,
            validDateRange: startDate && endDate ? [startDate, endDate] : [],
            file: quizImageList,
            quizImage: quiz?.quizImage,
            decreaseQuestions: quiz?.decreaseQuestions || 0,
            questions: quiz.questions.map((q) => ({
              question: q.question,
              id: q.id,
              file: q.image
                ? [
                    {
                      uid: q.image,
                      name: "Uploaded Image",
                      status: "done",
                      url: `${S3_BASE_URL}/QUIZZES/${q.image}`,
                    },
                  ]
                : [],
              options: q.options,
              explanation: q.explanation,
              image: q.image,
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
      const qid = id || ulid();

      // 1️⃣ Quiz‐level image:
      let quizImageKey = null;
      if (values.file?.[0]?.originFileObj) {
        // A brand‐new file was chosen:
        const fileObj = values.file[0].originFileObj;
        const ext = (
          fileObj.name.split(".").pop() || fileObj.type.split("/")[1]
        ).toLowerCase();
        const newKey = `QUIZZES/${qid}-cover.${ext}`;
        // If editing and they replaced the old cover, you may want to remove it:
        if (id && values.quizImage && values.quizImage !== newKey) {
          await _removeFileFromS3(`QUIZZES/${quiz.image}`);
        }

        // Finally upload:
        await _putFileToS3(newKey, fileObj, 200 * 1024, fileObj.type);
        quizImageKey = `${qid}-cover.${ext}`;
      } else if (values.file?.[0]?.url) {
        // They didn't change it, so grab the existing filename:
        quizImageKey = values.file[0].url.split("/").pop();
      }

      // Process questions with images and other data
      const questionsWithImages = await Promise.all(
        values.questions.map(async (q) => {
          let imageKey = null;
          const questionId = q.id || ulid();
          if (q.file?.[0]?.originFileObj) {
            const fileObj = q.file[0].originFileObj;
            const ext =
              fileObj.name.split(".").pop().toLowerCase() ||
              fileObj.type.split("/")[1];
            const newKey = `QUIZZES/${questionId}.${ext}`;
            const oldKey = q?.image ? `QUIZZES/${q?.image}` : null;

            if (id && oldKey && oldKey !== newKey) {
              try {
                await _removeFileFromS3(oldKey);
                console.log("Old image removed successfully:", oldKey);
              } catch (err) {
                console.error("Failed to remove old image:", oldKey, err);
              }
            }

            await _putFileToS3(newKey, fileObj, 200 * 1024, fileObj.type);
            imageKey = `${qid}.${ext}`;
          } else if (q.file?.[0]?.url) {
            imageKey = q.file[0].url.split("/").pop();
          }

          const correctCount = q.options.filter((o) => o.isCorrect).length;
          const options = q.options.map((opt) => ({
            id: opt.oid || ulid(),
            text: opt.text,
            isCorrect: opt.isCorrect || false,
          }));

          return {
            id: questionId,
            question: q.question,
            options,
            explanation: q.explanation,
            image: imageKey,
            isMultipleAnswer: correctCount > 1,
            correctCount,
          };
        })
      );

      // Extract startDate and endDate from RangePicker
      const [startDate, endDate] = values.validDateRange || [];

      const payload = {
        name: values.name,
        passingPerc: values.passingPerc,
        category: values.category,
        difficulty: values.difficulty,
        description: values.description,
        questions: questionsWithImages,
        totalQuestions: questionsWithImages.length,
        createdBy: user?.id,
        startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
        endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
        quizImage: quizImageKey,
        decreaseQuestions: values.decreaseQuestions || 0,
      };

      console.log("Payload to be sent:", payload);
      if (id) {
        await updateQuiz(id, payload);
        message.success("Quiz updated successfully");
      } else {
        await createQuiz(payload);
        message.success("Quiz created successfully");
      }

      router.push("/admin/quiz");
    } catch (error) {
      console.error("Error saving quiz:", error);
      message.error("Error saving quiz");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen">
        <CommonLoader />
      </div>
    );
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
              name="validDateRange"
              label="Valid Date Range"
              rules={[
                {
                  type: "array",
                  required: true,
                  message: "Please select valid date range",
                },
              ]}
            >
              <RangePicker
                disabledDate={(current) => {
                  // Disable all days before today
                  return current && current < dayjs().startOf("day");
                }}
              />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select showSearch placeholder="Please select a category">
                {rankingOptions.slice(1).map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
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
            <Form.Item
              name="decreaseQuestions"
              label="Decrease Questions"
            >
            <Input
                type="number"
                min={0}
                max={100}
                placeholder="Enter how many questions to decrease by."
              />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <TextArea rows={4} placeholder="Enter description here." />
            </Form.Item>
            <Form.Item
              name={"file"}
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
                  Only images are accepted and will upload upon form submit.
                </p>
              </Dragger>
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
                                    className="!w-full"
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
