"use client";

import React, { useState } from "react";
import { Card, Input, Button, Select, message, Form } from "antd";
import Comment from "./RenderComments";
import { commentsDummyData } from "@/shared/json/data.json";

const { Option } = Select;

const CommentsSection = ({ selectedDatabases }) => {
  const [commentsData, setCommentsData] = useState(commentsDummyData);
  const [showAllReplies, setShowAllReplies] = useState({});

  const [inputForm] = Form.useForm();

  // Function to add a new comment
  const handleAddComment = (values) => {
    const { comment, database } = values;
    console.log(values);
    if (!comment.trim() || !database) {
      message.error("Please provide both a comment and select a database.");
      return;
    }

    const newCommentData = {
      id: Date.now(),
      author: "Sameer Malik",
      commentedAt: "Just now",
      text: comment.trim(),
      database: database,
      disabled: false,
      replies: [],
    };

    setCommentsData([...commentsData, newCommentData]);
    inputForm.resetFields();
    message.success("Comment added successfully!");
  };

  // Function to toggle the visibility of all replies
  const toggleShowAllReplies = (commentId, value) => {
    setShowAllReplies((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };

  // Function to delete a comment or reply
  const deleteComment = (commentId, parentCommentId = null) => {
    if (parentCommentId === null) {
      setCommentsData((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      message.success("Comment deleted successfully!");
    } else {
      setCommentsData((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: comment.replies.filter(
                (reply) => reply.id !== commentId
              ),
            };
          }
          return comment;
        })
      );
      message.success("Reply deleted successfully!");
    }
  };

  // Function to disable a comment or reply
  const disableComment = (commentId, parentCommentId = null) => {
    if (parentCommentId === null) {
      setCommentsData((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              disabled: true,
              replies: comment.replies.map((reply) => ({
                ...reply,
                disabled: true,
              })),
            };
          }
          return comment;
        })
      );
      message.success("Comment disabled.");
    } else {
      setCommentsData((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId ? { ...reply, disabled: true } : reply
              ),
            };
          }
          return comment;
        })
      );
      message.success("Reply disabled.");
    }
  };

  const undisableComment = (commentId, parentCommentId = null) => {
    if (parentCommentId === null) {
      // Enable top-level comment and its replies
      setCommentsData((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              disabled: false,
              replies: comment.replies.map((reply) => ({
                ...reply,
                disabled: false,
              })),
            };
          }
          return comment;
        })
      );
      message.success("Comment and its replies enabled.");
    } else {
      // Enable reply
      setCommentsData((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId ? { ...reply, disabled: false } : reply
              ),
            };
          }
          return comment;
        })
      );
      message.success("Reply enabled.");
    }
  };

  // Function to add a reply to a comment
  const addReply = (parentCommentId, replyData) => {
    setCommentsData((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...comment.replies, replyData],
          };
        }
        return comment;
      })
    );
    message.success("Reply added successfully!");
  };

  // Function to edit a top-level comment
  const editComment = (commentId, newText) => {
    setCommentsData((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, text: newText } : comment
      )
    );
    message.success("Comment updated successfully!");
  };

  // Function to edit a reply
  const editReply = (replyId, parentCommentId, newText) => {
    console.log(replyId, parentCommentId, newText);
    setCommentsData((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === replyId ? { ...reply, text: newText } : reply
            ),
          };
        }
        return comment;
      })
    );
    message.success("Reply updated successfully!");
  };

  return (
    <div className="w-full lg:max-w-[70%] ">
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
                className="border-none !p-0 focus:ring-0 focus:outline-none h-8"
              />
            </Form.Item>

            <div className="flex items-center justify-between">
              <Form.Item
                name="database"
                rules={[{ required: true, message: "Please select database!" }]}
                className="m-0"
              >
                <Select
                  placeholder="Select database"
                  popupMatchSelectWidth={false}
                  allowClear
                  className="max-w-40 md:max-w-full w-full "
                >
                  {selectedDatabases?.map((db, idx) => (
                    <Option key={idx} value={db}>
                      {db}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Button
                type="primary"
                className="bg-[#3E53D7] text-white h-8 md:h-9 text-xs md:text-sm w-20 "
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Card>

      <div className="">
        {commentsData.length === 0 ? (
          <p className="text-center text-gray-500">No comments yet.</p>
        ) : (
          commentsData.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              level={0}
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
              addReply={(replyData) => addReply(comment.id, replyData)}
              editComment={(newText) => editComment(comment.id, newText)}
              editReply={(replyId, newText) =>
                editReply(replyId, comment.id, newText)
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
