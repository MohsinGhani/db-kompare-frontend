"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  DatePicker,
  Image,
} from "antd";
import {
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import AdminLayout from "../..";
import { LESSON_CATEGORY } from "@/utils/const";
import { _putFileToS3, _removeFileFromS3 } from "@/utils/s3Services";
import { createQuiz, fetchQuizById, updateQuiz } from "@/utils/quizUtil";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import CommonLoader from "@/components/shared/CommonLoader";
import QuizQuestionsTable from "../../Questions/QuizQuestionsTable";
import CommonS3ImagePicker from "@/components/shared/CommonS3ImagePicker";
import CommonCategoryTreeSelect from "@/components/shared/CommonCategoryTreeSelect";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ManageQuiz = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [quizData, setQuizData] = useState(null);

  // Image picker state
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
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
          setSelectedRowKeys(quiz.questionIds || []);
          if (quiz.image) {
            setSelectedImages([
              {
                key: quiz.image,
                url: `${process.env.NEXT_PUBLIC_BUCKET_URL}/${quiz.image}`,
              },
            ]);
          }
          form.setFieldsValue({
            name: quiz.name,
            passingPerc: quiz.passingPerc,
            category: quiz.category,
            difficulty: quiz.difficulty,
            description: quiz.description,
            validDateRange: startDate && endDate ? [startDate, endDate] : [],
            image: quiz?.image,
            desiredQuestions: quiz?.desiredQuestions || 0,
          });
        })
        .catch(() => {
          message.error("Failed to load quiz data");
        })
        .finally(() => setLoading(false));
    }
  }, [id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const [startDate, endDate] = values.validDateRange || [];
      const imageKey = selectedImages[0]?.key || null;

      const payload = {
        name: values.name,
        passingPerc: values.passingPerc,
        category: values.category,
        difficulty: values.difficulty,
        description: values.description,
        createdBy: user?.id || null,
        startDate: startDate?.format("YYYY-MM-DD") || null,
        endDate: endDate?.format("YYYY-MM-DD") || null,
        image: imageKey,
        desiredQuestions: values.desiredQuestions || 0,
        questionIds: selectedRowKeys,
        totalQuestions: selectedRowKeys.length,
        timeLimit: values.timeLimit || 1800,
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
      console.error("Error saving quiz:", error);
      message.error("Error saving quiz");
    } finally {
      setLoading(false);
    }
  };

  // Remove a selected image by key
  const removeSelectedImage = useCallback((key) => {
    setSelectedImages((prev) => prev.filter((img) => img.key !== key));
  }, []);


  if (loading) {
    return (
      <div className="h-screen">
        <CommonLoader />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full xl:max-w-[80%]">
        <h1 className="text-2xl font-semibold mb-4">
          {id ? "Edit Quiz" : "Create Quiz"}
        </h1>
        <Form
          form={form}
          layout="vertical"
          name="manage_quiz"
          onFinish={onFinish}
          initialValues={{
            timeLimit: 1800,
            passingPerc: 50,
            difficulty: LESSON_CATEGORY.BASIC,
            validDateRange: [
              dayjs().startOf("day"),
              dayjs().add(2, "months").endOf("day"),
            ]
          }}
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
              name="timeLimit"
              label="Time Limit (in seconds)"
              rules={[
                { required: true, message: "Please enter time limit" },
                {
                  type: "number",
                  min: 1800,
                  message: "Time limit must be at least 1,900 seconds",
                },
              ]}
            >
              <Input
                type="number"
                min={1800}
                style={{ width: "100%" }}
                placeholder="Enter time limit in seconds"
              />
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
              <CommonCategoryTreeSelect placeholder="Select Category" />
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
              onSelect={(items) => {
                setSelectedImages(items);
                setPickerVisible(false);
              }}
              onClose={() => setPickerVisible(false)}
            />
          </div>
 
          {/* Questions */}
          <div className="bg-white border rounded-lg p-6 mb-4">
            <p className="text-lg font-semibold mb-3">
              Select Questions From Questions Bank
            </p>
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
    </AdminLayout>
  );
};

export default ManageQuiz;
