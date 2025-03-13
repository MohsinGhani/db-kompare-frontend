"use client";

import React from "react";
import { Card, Form, Input, Button, Rate } from "antd";
import CommonTypography from "@/components/shared/Typography";

/**
 * Renders the inline edit form for a comment or reply.
 * The parent <Comment /> decides whether to show or hide it.
 */
const CommentEditForm = ({
  editReplyForm,
  handleEdit,
  editLoading,
  entityType,
  isAdmin,
}) => {
  return (
    <div className="flex flex-row items-end">
      <div className="w-full">
        <p className="text-xs text-[#3E53D7] font-normal bg-[#F6F6FF] py-1 px-4 rounded-md inline-block">
          Editing
        </p>
        <Card className="w-full rounded-xl p-1 sm:p-2 h-auto">
          <Form
            layout="inline"
            onFinish={handleEdit}
            className="w-full"
            form={editReplyForm}
          >
            <Form.Item name="id" hidden />
            <div className="w-full justify-between items-center">
              <Form.Item
                name="editText"
                className="w-full m-0 sm:px-2 sm:py-1 pb-2 sm:pb-0"
              >
                <Input.TextArea
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  placeholder={`${
                    isAdmin ? "Edit comment" : "Edit your comment"
                  }`}
                  className="flex-1 resize-none border-none focus:ring-0 focus:outline-none rounded-lg h-8 mb-4 text-xs sm:text-sm"
                  maxLength={1000}
                  showCount
                />
              </Form.Item>

              <div className="w-full flex flex-row justify-between mt-1 sm:mt-3">
                <div className="flex items-center border border-[#D9D9D9] rounded-md px-2 h-8 sm:ml-2">
                  <CommonTypography className="text-sm text-[#747474] font-normal opacity-50 pr-2 hidden sm:block">
                    Rate {entityType ? entityType : "entity"}:
                  </CommonTypography>
                  <Form.Item className="!p-0 !m-0" name="rating">
                    <Rate
                      defaultValue={3}
                      className="text-[#FFC412] !text-sm"
                      allowClear={false}
                    />
                  </Form.Item>
                </div>

                <Form.Item>
                  <Button
                    className="-mr-2 sm:mr-0"
                    type="text"
                    htmlType="submit"
                    disabled={editLoading}
                    loading={editLoading}
                    icon={
                      <img
                        src="/assets/icons/send-icon.svg"
                        className="w-4 h-4 cursor-pointer"
                        alt="Send Icon"
                      />
                    }
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CommentEditForm;
