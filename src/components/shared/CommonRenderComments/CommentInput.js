"use client";

import React, { useState } from "react";
import { Card, Form, Input, Select, Button, Rate } from "antd";
import CommonTypography from "@/components/shared/Typography";
import { ENTITY_TYPE } from "@/utils/const";

const { Option } = Select;

const CommentInput = ({
  entityType = "entity", // e.g., "database", "blog", "dbtool"
  entityOptions = [], // Array of option names (e.g., ["Postgres", "MySQL"])
  entityOptionIds = [], // Array of corresponding ids (e.g., [1, 2])
  onSubmit, // Callback to handle submission of the comment
  loading = false, // Loading state for submit button
  rateDefaultValue = 3, // default rate value
  rateLabel = "Rate", // label prefix for the rating
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // Include the entity type along with form values
    const payload = {
      ...values,
      entityType,
    };
    // Only add entityId if the entity type is neither DATABASE nor DBTOOL
    if (
      entityType !== ENTITY_TYPE.DATABASE &&
      entityType !== ENTITY_TYPE.DBTOOL
    ) {
      payload["entityId"] = entityOptionIds;
    }
    onSubmit && onSubmit(payload);
    // Optionally, reset the form after submission
    form.resetFields();
  };

  // Watch the entityId field to determine the currently selected entity name.
  const selectedEntityId = Form.useWatch("entityId", form);
  const selectedEntityName =
    selectedEntityId && entityOptionIds.includes(selectedEntityId)
      ? entityOptions[entityOptionIds.indexOf(selectedEntityId)]
      : "";

  return (
    <Card className="w-full rounded-xl !p-2 !md:p-3">
      <div className="space-y-6">
        <Form
          initialValues={{
            rating: rateDefaultValue,
          }}
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            name="comment"
            rules={[
              {
                max: 1000,
                message: "Comment cannot exceed 1000 characters!",
              },
            ]}
            className="mb-2"
          >
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 4 }}
              placeholder="Add a comment"
              className="border-none focus:ring-0 focus:outline-none h-8"
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <div className="sm:flex items-center justify-between mt-8">
            <div className="flex flex-col sm:flex-row">
              {entityType !== "blog" && (
                <Form.Item
                  name="entityId"
                  rules={[
                    { required: true, message: `Please select ${entityType}!` },
                  ]}
                  className="m-0"
                >
                  <Select
                    placeholder={`Select ${entityType}`}
                    popupMatchSelectWidth={false}
                    allowClear
                    className="sm:max-w-40 md:max-w-full w-full mb-2 sm:mb-0"
                  >
                    {entityOptions?.map((option, idx) => (
                      <Option key={idx} value={entityOptionIds[idx]}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <div className="flex items-center justify-between border border-[#D9D9D9] rounded-md px-2 sm:ml-2 h-8">
                <CommonTypography className="text-sm text-[#747474] font-normal opacity-50 pr-2 truncate max-w-32">
                  {rateLabel} {selectedEntityName || entityType}:
                </CommonTypography>
                <Form.Item className="!m-0 !p-0" name="rating">
                  <Rate
                    className="text-[#FFC412] !text-sm"
                    allowClear={false}
                  />
                </Form.Item>
              </div>
            </div>

            <Button
              type="primary"
              className={`bg-[#3E53D7] text-white h-8 md:h-9 text-xs md:text-sm w-full sm:w-20 mt-2 sm:mt-0 ${
                loading ? "sm:w-28" : ""
              }`}
              htmlType="submit"
              disabled={loading}
              loading={loading}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </Card>
  );
};

export default CommentInput;
