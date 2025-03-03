"use client";

import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Select,
  message,
  Form,
  Empty,
  Rate,
  Skeleton,
} from "antd";
import Comment from "./RenderComments"; // Reusable comment renderer component
import CommonTypography from "@/components/shared/Typography";

const { Option } = Select;

const CommonComments = ({
  commentsData, // Array of comment objects passed from parent
  entityOptions, // Array of entity options (each: { id, name })
  defaultEntityId, // Optional default selected entity id for the add-comment form
  entityFieldName, // e.g. "databaseId", "dbtoolId", or "blogId"
  entityLabel, // e.g. "Database", "DBTool", or "Blog"
  onAddComment, // Callback to add comment; should return a promise
  onDeleteComment, // Callback to delete comment; should return a promise
  onDisableComment, // Callback to disable comment; should return a promise
  onUndisableComment, // Callback to undisable comment; should return a promise
  fetchComments, // Callback to refresh comments after an action
  userId, // Current user id
  loading = false, // (Optional) Loading state passed from parent for comment list
}) => {
  const [addCommentLoading, setAddCommentLoading] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState({});
  const [inputForm] = Form.useForm();

  // Watch the selected entity id from the form (field name is dynamic)
  const selectedEntityId = Form.useWatch(entityFieldName, inputForm);
  const selectedEntityOption =
    entityOptions && entityOptions.find((opt) => opt.id === selectedEntityId);

  const handleAddComment = async (values) => {
    // Build payload with generic field name.
    const payload = {
      comment: values.comment,
      [entityFieldName]: values.entityFieldName,
      createdBy: userId,
      ...(values.rating !== undefined && { rating: values.rating }),
    };

    try {
      setAddCommentLoading(true);
      //   await onAddComment(payload);
      message.success("Comment added successfully");
      fetchComments && fetchComments();
      inputForm.resetFields();
    } catch (error) {
      console.error("Error adding comment:", error);
      message.error(
        error.message || "An error occurred while adding the comment"
      );
    } finally {
      setAddCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await onDeleteComment(commentId);
      message.success("Comment or reply deleted successfully!");
      fetchComments && fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      message.error("An error occurred while deleting the comment.");
    }
  };

  const handleDisableComment = async (commentId, status) => {
    try {
      await onDisableComment(commentId, status);
      message.success(
        `Comment or reply ${
          status === "inactive" ? "disabled" : "enabled"
        } successfully!`
      );
      fetchComments && fetchComments();
    } catch (error) {
      console.error("Error updating comment status:", error);
      message.error("An error occurred while updating the comment status.");
    }
  };

  const handleUndisableComment = async (commentId, status) => {
    try {
      await onUndisableComment(commentId, status);
      message.success(
        `Comment or reply ${
          status === "active" ? "undisabled" : "enabled"
        } successfully!`
      );
      fetchComments && fetchComments();
    } catch (error) {
      console.error("Error updating comment status:", error);
      message.error("An error occurred while updating the comment status.");
    }
  };

  const toggleShowAllReplies = (commentId, value) => {
    setShowAllReplies((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };
  return (
    <div className="w-full lg:max-w-[75%]">
      <div className="flex flex-row items-center">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <div className="bg-[#3E53D7] rounded-xl w-14 flex items-center justify-center ml-2">
          <span className="text-white">{commentsData?.length || 0}</span>
        </div>
      </div>

      <Card className="w-full mt-6 rounded-xl !p-2 !md:p-3">
        <div className="space-y-6">
          <Form
            form={inputForm}
            layout="vertical"
            onFinish={handleAddComment}
            initialValues={{ [entityFieldName]: defaultEntityId, rating: 3 }}
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
                <Form.Item
                  name={entityFieldName}
                  rules={[
                    {
                      required: true,
                      message: `Please select ${entityLabel}!`,
                    },
                  ]}
                  className="m-0"
                >
                  <Select
                    placeholder={`Select ${entityLabel}`}
                    popupMatchSelectWidth={false}
                    allowClear
                    className="sm:max-w-40 md:max-w-full w-full mb-2 sm:mb-0"
                  >
                    {entityOptions?.map((db, idx) => (
                      <Option key={idx} value={entityOptions[idx]}>
                        {db}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <div className="flex items-center justify-between border border-[#D9D9D9] rounded-md px-2 sm:ml-2 h-8">
                  <CommonTypography className="text-sm text-[#747474] font-normal opacity-50 pr-2 truncate max-w-32">
                    Rate {selectedEntityOption?.name || entityLabel}:
                  </CommonTypography>
                  <Form.Item className="!m-0 !p-0" name="rating">
                    <Rate
                      defaultValue={3}
                      className="text-[#FFC412] !text-sm"
                      allowClear={false}
                    />
                  </Form.Item>
                </div>
              </div>

              <Button
                type="primary"
                className={`bg-[#3E53D7] text-white h-8 md:h-9 text-xs md:text-sm w-full sm:w-20 mt-2 sm:mt-0 ${
                  addCommentLoading ? "sm:w-28" : ""
                }`}
                htmlType="submit"
                disabled={addCommentLoading}
                loading={addCommentLoading}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Card>

      <div>
        {loading ? (
          <Skeleton active paragraph={{ rows: 3 }} className="pt-12" />
        ) : !commentsData || commentsData.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No comments"
            className="pt-12"
          />
        ) : (
          <div>
            {commentsData
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  level={0}
                  showAllReplies={showAllReplies[comment.id] || false}
                  toggleShowAllReplies={(value) =>
                    toggleShowAllReplies(comment.id, value)
                  }
                  handleDeleteComment={handleDeleteComment}
                  handleDisableComment={handleDisableComment}
                  handleUndisableComment={handleUndisableComment}
                  fetchComments={fetchComments}
                  className="childreply"
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonComments;
