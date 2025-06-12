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
import QuizQuestionsTable from "../../Questions/QuizQuestionsTable";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const[quizData, setQuizData] = useState(null);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const user = userDetails?.data?.data;

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchQuizById(id)
        .then((res) => {
          const quiz = res?.data;
          setQuizData(quiz);
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
            desiredQuestions: quiz?.desiredQuestions || 0,
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
    console.log("Form values:", values);
    setLoading(true);
    try {
      const qid = id || ulid();

      // Extract startDate and endDate from RangePicker
      const [startDate, endDate] = values.validDateRange || [];

      const payload = {
        name: values.name,
        passingPerc: values.passingPerc,
        category: values.category,
        difficulty: values.difficulty,
        description: values.description,
        questions:quizData.questions,
        totalQuestions: quizData.questions.length,
        createdBy: user?.id,
        startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
        endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
        quizImage: quizData.quizImage,
        desiredQuestions: values.desiredQuestions || 0,
        questionIds: selectedRowKeys,
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

console.log("selectedRowKeys:", selectedRowKeys);

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
            <Form.Item name="desiredQuestions" label="Desired No of Questions">
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
          <div className="bg-white border rounded-lg p-6 mb-4">
            <p className="text-lg font-semibold mb-3">Select Questions</p>
            <QuizQuestionsTable
              isRowSelect={true}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
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
