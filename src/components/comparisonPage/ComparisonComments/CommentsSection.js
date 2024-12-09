"use client";

import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Select,
  message,
  Avatar,
  Tag,
  Dropdown,
  Popconfirm,
} from "antd";
import CommonTypography from "@/components/shared/Typography";
import { getInitials } from "@/utils/getInitials";

const { Option } = Select;

const renderComments = (
  comments,
  level = 0,
  showAllReplies,
  toggleShowAllReplies,
  deleteComment,
  disableComment
) => {
  const items = [
    {
      key: "edit",
      label: "Edit",
    },
    {
      key: "disable",
      label: "Disable",
    },
    {
      key: "delete",
      label: <span className="text-red-500">Delete</span>,
    },
  ];

  const [showAddReplyInput, setShowAddReplyInput] = useState(false);

  return comments.map((comment) => (
    <div
      key={comment.id}
      className={`flex ${level > 0 ? "pl-8 pt-4 relative" : "pt-5 "}`}
    >
      <Avatar
        className={`bg-[#F6F6FF] text-[#3E53D7] rounded-full p-4 ${
          comment.disabled ? "opacity-70 cursor-default" : ""
        }`}
      >
        {getInitials(comment.author)}
      </Avatar>
      <div className="w-full ml-2">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <CommonTypography
              className={`font-semibold ${
                comment.disabled ? "text-gray-400 cursor-default" : ""
              }`}
            >
              {comment.author}
            </CommonTypography>
            <CommonTypography
              className={`!font-normal !text-xs opacity-70 ${
                comment.disabled ? "text-gray-400 cursor-default" : ""
              }`}
            >
              {comment.commentedAt}
            </CommonTypography>
          </div>

          <div className="flex flex-row items-center">
            <Tag className="!text-white bg-[#3E53D7] border-none !font-normal !text-[10px] py-[2px] px-3 rounded-xl">
              {comment.database}
            </Tag>

            <Dropdown
              menu={{
                items: items.map((item) => ({
                  ...item,
                  onClick:
                    item.key === "delete"
                      ? () => deleteComment(comment.id)
                      : item.key === "disable"
                      ? () => disableComment(comment.id)
                      : null,
                })),
              }}
              trigger={["click"]}
              placement="bottom"
              arrow={{ pointAtCenter: true }}
            >
              <img
                src="/assets/icons/dropdown-icon.svg"
                width={25}
                height={25}
                alt="Dropdown Icon"
                className="ml-2 cursor-pointer hover:opacity-70"
              />
            </Dropdown>
          </div>
        </div>

        <p
          className={`font-normal text-sm text-black my-2 ${
            comment.disabled ? "text-gray-400 cursor-default" : ""
          }`}
        >
          {comment.text}
        </p>

        {level === 0 && !comment.disabled && (
          <Button
            className="bg-[#FAFAFA] text-[#565758] rounded-2xl font-normal text-xs border-none w-14 h-8"
            onClick={() => setShowAddReplyInput(!showAddReplyInput)}
          >
            Reply
          </Button>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies
              .slice(0, showAllReplies ? comment.replies.length : 2)
              .map((reply) => (
                <div key={reply.id}>
                  {renderComments(
                    [reply],
                    level + 1,
                    showAllReplies,
                    toggleShowAllReplies,
                    (replyId) => deleteComment(replyId, comment.id),
                    (replyId) => disableComment(replyId, comment.id)
                  )}
                </div>
              ))}
            {comment.replies.length > 2 && (
              <CommonTypography
                type="text"
                className="text-[#3E53D7] p-0 mt-1 ml-[74px] underline border-none shadow-none cursor-pointer"
                onClick={() => toggleShowAllReplies(!showAllReplies)}
              >
                {showAllReplies ? "Load Less Replies" : "Load More Replies"}
              </CommonTypography>
            )}

            {showAddReplyInput && level === 0 && (
              <div className="m-2 mt-4 flex flex-row">
                <Avatar className="bg-[#F6F6FF] text-[#3E53D7] rounded-full p-4 opacity-70 cursor-default">
                  {getInitials("Zain Shareef")}
                </Avatar>
                <Input
                  placeholder="Add a reply"
                  onChange={(e) => setNewComment(e.target.value)}
                  className="p-[6px] ml-2"
                  suffix={
                    <img
                      src="/assets/icons/send-icon.svg"
                      className="w-4 h-4 mr-2"
                    />
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  ));
};

const CommentsSection = ({ selectedDatabases }) => {
  const [newComment, setNewComment] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState("");
  const [commentsData, setCommentsData] = useState([
    {
      id: 1,
      author: "Zain Shareef",
      commentedAt: "2 hrs ago",
      text: "This is the first comment",
      database: "Mongo DB",
      disabled: false,
      replies: [
        {
          id: 1,
          author: "John Doe",
          commentedAt: "1 hr ago",
          text: "This is a reply to the first comment",
          parentCommentId: 1,
          database: "Mongo DB",
          disabled: false,
          replies: [],
        },
        {
          id: 2,
          author: "Alice Smith",
          commentedAt: "30 mins ago",
          text: "Another reply to the first comment",
          parentCommentId: 1,
          database: "Mongo DB",
          disabled: false,
          replies: [],
        },
        {
          id: 3,
          author: "Alice Smith",
          commentedAt: "30 mins ago",
          text: "Another reply to the first comment",
          parentCommentId: 1,
          database: "Mongo DB",
          disabled: false,
          replies: [],
        },
      ],
    },
    {
      id: 2,
      author: "Zain Shareef",
      commentedAt: "3 hrs ago",
      text: "This is the second comment",
      database: "MySQL",
      disabled: false,
      replies: [],
    },
  ]);
  const [showAllReplies, setShowAllReplies] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedDatabase) {
      message.error("Please provide both a comment and select a database.");
      return;
    }

    const newCommentData = {
      id: commentsData.length + 1,
      author: "Current User",
      commentedAt: "Just now",
      text: newComment.trim(),
      database: selectedDatabase,
      disabled: false,
      replies: [],
    };

    setCommentsData([...commentsData, newCommentData]);
    setNewComment("");
    setSelectedDatabase("");
    message.success("Comment added successfully!");
  };

  const toggleShowAllReplies = (value) => {
    setShowAllReplies(value);
  };

  const deleteComment = (commentId, parentCommentId = null) => {
    if (parentCommentId === null) {
      setCommentsData(
        commentsData.filter((comment) => comment.id !== commentId)
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
      message.success("Comment and its replies disabled.");
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

  return (
    <div className="max-w-[70%] ">
      <div className="flex flex-row items-center ">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <div className="bg-[#3E53D7] rounded-xl w-14 flex items-center justify-center ml-2">
          <span className="text-white">{commentsData.length}</span>
        </div>
      </div>

      <Card className="w-full mt-6 rounded-xl p-3">
        <div className="space-y-6">
          <Input
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border-none !p-0 focus:ring-0 focus:outline-none"
          />
          <div className="flex items-center justify-between">
            <Select
              placeholder="Select database"
              popupMatchSelectWidth={false}
              allowClear
              onChange={setSelectedDatabase}
              className="w-40"
            >
              {selectedDatabases?.map((db, idx) => (
                <Option key={idx} value={db}>
                  {db}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              className="bg-[#3E53D7] text-white h-9 text-sm"
              onClick={handleAddComment}
            >
              Submit
            </Button>
          </div>
        </div>
      </Card>

      {/* Comments List */}
      <div className="mt-6">
        {commentsData.length === 0 ? (
          <p className="text-center text-gray-500">No comments yet.</p>
        ) : (
          renderComments(
            commentsData,
            0,
            showAllReplies,
            toggleShowAllReplies,
            deleteComment,
            disableComment
          )
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
