"use client";

import React, { useState, useEffect } from "react";
import { Card, Input, Button, Select, message, Form, Empty } from "antd";
import Comment from "./RenderComments";
import { useSelector } from "react-redux";
import { CommentStatus } from "@/utils/const";

const { Option } = Select;

const CommentsSection = ({ selectedDatabases, selectedDatabaseIds }) => {
  const [commentsData, setCommentsData] = useState([]);
  const [showAllReplies, setShowAllReplies] = useState({});
  const [loading, setLoading] = useState(false);
  const [inputForm] = Form.useForm();
  const { userDetails } = useSelector((state) => state.auth);
  const userId = userDetails?.idToken["custom:userId"];
  const X_API_KEY = process.env.NEXT_PUBLIC_X_API_KEY;

  const fetchComments = async (selectedDatabaseIds) => {
    if (!selectedDatabaseIds || selectedDatabaseIds.length === 0) {
      return;
    }
    try {
      const response = await fetch(
        "https://yftbqyckri.execute-api.eu-west-1.amazonaws.com/dev/get-comments",
        {
          method: "POST",
          headers: {
            "x-api-key": X_API_KEY,
          },
          body: JSON.stringify({
            ids: selectedDatabaseIds,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setCommentsData(data.data || []);
      } else if (response.status === 404) {
        setCommentsData([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  // Function to add a new comment
  const handleAddComment = async (values) => {
    const { comment, databaseId } = values;

    const payload = {
      comment: comment,
      databaseId: databaseId,
      createdBy: userId,
    };

    try {
      setLoading(true);
      const response = await fetch(
        "https://yftbqyckri.execute-api.eu-west-1.amazonaws.com/dev/create-comment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": X_API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add comment");
      }

      const data = await response.json();
      message.success("Comment added successfully");
      fetchComments(selectedDatabaseIds);
      inputForm.resetFields();
    } catch (error) {
      console.error("Error adding comment:", error);
      message.error(
        error.message || "An error occurred while adding the comment"
      );
    } finally {
      setLoading(false);
    }
  };
  // Function to delete a comment or reply
  const deleteComment = async (commentId) => {
    const payload = { commentId };

    try {
      const response = await fetch(
        "https://yftbqyckri.execute-api.eu-west-1.amazonaws.com/dev/delete-comment",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": X_API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        message.success("Comment or reply deleted successfully!");
        fetchComments(selectedDatabaseIds);
      } else {
        message.error(data.message || "Failed to delete comment or reply.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      message.error("An error occurred while deleting the comment.");
    }
  };
  // Function to disable a comment
  const disableComment = async (commentId, status) => {
    const payload = {
      id: commentId,
      status: CommentStatus.INACTIVE,
      updatedBy: userId,
    };

    try {
      const response = await fetch(
        "https://yftbqyckri.execute-api.eu-west-1.amazonaws.com/dev/update-comment-status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": X_API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        message.success(
          `Comment or reply ${
            status === CommentStatus.INACTIVE ? "disabled" : "enabled"
          } successfully!`
        );
        fetchComments(selectedDatabaseIds);
        return data;
      } else {
        message.error(
          data.message || "Failed to update comment or reply status."
        );
      }
    } catch (error) {
      console.error("Error updating comment status:", error);
      message.error(
        "An error occurred while updating the comment or reply status."
      );
    }
  };
  // Function to enable a comment
  const undisableComment = async (commentId, status) => {
    const payload = {
      id: commentId,
      status: CommentStatus.ACTIVE,
      updatedBy: userId,
    };

    try {
      const response = await fetch(
        "https://yftbqyckri.execute-api.eu-west-1.amazonaws.com/dev/update-comment-status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": X_API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        message.success(
          `Comment or reply ${
            status === CommentStatus.ACTIVE ? "undisabled" : "enabled"
          } successfully!`
        );
        fetchComments(selectedDatabaseIds);
        return data;
      } else {
        message.error(
          data.message || "Failed to update comment or reply status."
        );
      }
    } catch (error) {
      console.error("Error updating comment status:", error);
      message.error(
        "An error occurred while updating the comment or reply status."
      );
    }
  };
  // Function to toggle the visibility of all replies
  const toggleShowAllReplies = (commentId, value) => {
    setShowAllReplies((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };
  useEffect(() => {
    if (selectedDatabaseIds) {
      fetchComments(selectedDatabaseIds);
    }
  }, [selectedDatabaseIds]);

  return (
    <div className="w-full lg:max-w-[75%] ">
      <div className="flex flex-row items-center ">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <div className="bg-[#3E53D7] rounded-xl w-14 flex items-center justify-center ml-2">
          <span className="text-white">{commentsData.length}</span>
        </div>
      </div>

      <Card className="w-full mt-6 rounded-xl p-2 md:p-3">
        <div className="space-y-6">
          <Form
            onFinish={(values) => {
              handleAddComment(values);
            }}
            layout="vertical"
            form={inputForm}
          >
            <Form.Item
              name="comment"
              rules={[{ required: true, message: "Please add a comment!" }]}
              className="mb-2"
            >
              <Input
                placeholder="Add a comment"
                className="border-none focus:ring-0 focus:outline-none h-8"
              />
            </Form.Item>

            <div className="flex items-center justify-between">
              <Form.Item
                name="databaseId"
                rules={[{ required: true, message: "Please select database!" }]}
                className="m-0"
              >
                <Select
                  placeholder="Select database"
                  popupMatchSelectWidth={false}
                  allowClear
                  className="max-w-40 md:max-w-full w-full"
                >
                  {selectedDatabases?.map((db, idx) => (
                    <Option key={idx} value={selectedDatabaseIds[idx]}>
                      {db}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Button
                type="primary"
                className={`bg-[#3E53D7] text-white h-8 md:h-9 text-xs md:text-sm w-20 ${
                  loading ? "w-28" : ""
                } `}
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

      <div className="">
        {commentsData?.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No comments"
            className="pt-12"
          />
        ) : (
          commentsData?.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              level={0}
              selectedDatabases={selectedDatabases}
              selectedDatabaseIds={selectedDatabaseIds}
              showAllReplies={showAllReplies[comment.id] || false}
              toggleShowAllReplies={(value) =>
                toggleShowAllReplies(comment.id, value)
              }
              deleteComment={(commentId, parentCommentId) =>
                deleteComment(commentId, parentCommentId)
              }
              disableComment={(commentId, parentCommentId) =>
                disableComment(commentId, parentCommentId)
              }
              undisableComment={(commentId, parentCommentId) =>
                undisableComment(commentId, parentCommentId)
              }
              fetchComments={fetchComments}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;