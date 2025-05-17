"use client";

import React from "react";
import { Form, Input, Select, Button, Upload, Checkbox, Space } from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import AdminLayout from "../..";
import { LESSON_CATEGORY, TOPICS_CATEGORIES } from "@/utils/const";

const { Dragger } = Upload;
const { TextArea } = Input;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const ManageQuiz = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form values:", values);
    // Handle form submission
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Create Quiz</h1>

      <Form
        form={form}
        layout="vertical"
        name="manage_quiz"
        onFinish={onFinish}
        initialValues={{ questions: [] }}
      >
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

        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                <div className="bg-white border rounded-lg p-6 mb-4" key={key}>
                  <Space
                    align="baseline"
                    style={{ justifyContent: "space-between", width: "100%" }}
                  >
                    <h3>Question {index + 1}</h3>
                    <MinusCircleOutlined
                      className="text-red-600"
                      onClick={() => remove(name)}
                    />
                  </Space>

                  <Form.Item
                    {...restField}
                    name={[name, "question"]}
                    fieldKey={[fieldKey, "question"]}
                    label="Question"
                    rules={[
                      { required: true, message: "Please enter question" },
                    ]}
                  >
                    <Input placeholder="Enter question here" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "file"]}
                    fieldKey={[fieldKey, "file"]}
                    label="Upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                  >
                    <Dragger beforeUpload={() => false} multiple={false}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                      <p className="ant-upload-hint">
                        Support for a single upload.
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
                          {optFields.map(
                            ({
                              key: optKey,
                              name: optName,
                              fieldKey: optFieldKey,
                              ...optRestField
                            }) => (
                              <Space
                                key={optKey}
                                align="baseline"
                                style={{ display: "flex", marginBottom: 8 }}
                              >
                                <Form.Item
                                  {...optRestField}
                                  name={[optName, "text"]}
                                  fieldKey={[optFieldKey, "text"]}
                                  rules={[
                                    { required: true, message: "Option text" },
                                  ]}
                                >
                                  <Input
                                    placeholder={`Option ${optName + 1}`}
                                  />
                                </Form.Item>

                                <Form.Item
                                  {...optRestField}
                                  name={[optName, "isCorrect"]}
                                  fieldKey={[optFieldKey, "isCorrect"]}
                                  valuePropName="checked"
                                >
                                  <Checkbox>Mark as correct answer</Checkbox>
                                </Form.Item>

                                <MinusCircleOutlined
                                  onClick={() => removeOption(optName)}
                                />
                              </Space>
                            )
                          )}
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

                  <Form.Item
                    {...restField}
                    name={[name, "explanation"]}
                    fieldKey={[fieldKey, "explanation"]}
                    label="Explanation"
                  >
                    <TextArea rows={3} />
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
            Create Quiz
          </Button>
        </Form.Item>
      </Form>
    </AdminLayout>
  );
};

export default ManageQuiz;
