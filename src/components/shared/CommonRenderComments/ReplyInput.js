"use client";

import React from "react";
import { Avatar, Card, Form, Input, Button, Rate } from "antd";
import CommonTypography from "@/components/shared/Typography";
import { getInitials } from "@/utils/getInitials";

/**
 * Renders the reply input form at the bottom of a comment.
 */
const ReplyInput = ({
  addReplyForm,
  handleAddReply,
  addReplyLoading,
  userName,
  replyingToName,
  entityType,
}) => {
  return (
    <div className="sm:pl-14 mx-0 md:mx-3 mt-4 flex flex-row items-start">
      <Avatar className="bg-[#F6F6FF] text-[#3E53D7] rounded-full p-[18px] mr-[6px] mt-[2px] opacity-70 cursor-default">
        {getInitials(userName || "Anonymous")}
      </Avatar>
      <div className="w-full ml-2">
        <p className="text-xs text-[#3E53D7] font-normal bg-[#F6F6FF] py-1 px-4 rounded-md md:inline-block hidden">
          Replying to {replyingToName}
        </p>
        <p className="text-xs text-[#3E53D7] font-normal bg-[#F6F6FF] py-1 px-4 rounded-md inline-block md:hidden">
          Replying
        </p>

        <Card className="w-full rounded-xl p-1 sm:p-2">
          <Form
            layout="inline"
            onFinish={handleAddReply}
            className="w-full"
            form={addReplyForm}
          >
            <Form.Item
              name="reply"
              className="w-full m-0 sm:px-2 sm:py-1 pb-2 sm:pb-0"
            >
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 4 }}
                maxLength={1000}
                showCount
                placeholder="Add a reply"
                className="px-1 border rounded-lg border-none focus:ring-0 focus:outline-none h-8 mb-2"
              />
            </Form.Item>

            <div className="w-full flex flex-row justify-between mt-2 sm:mt-3">
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
                  disabled={addReplyLoading}
                  loading={addReplyLoading}
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
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ReplyInput;
