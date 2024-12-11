"use client";

import React, { useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Tag,
  message,
  Form,
  Popconfirm,
} from "antd";
import CommonTypography from "@/components/shared/Typography";
import { getInitials } from "@/utils/getInitials";
import "./tree-view.scss";
import { useSelector } from "react-redux";
import { CommentStatus } from "@/utils/const";
import { formatRelativeTime } from "@/utils/formatDateAndTime";

const Comment = ({
  comment,
  level,
  fetchComments,
  showAllReplies,
  toggleShowAllReplies,
  deleteComment,
  disableComment,
  undisableComment,
  selectedDatabases,
  selectedDatabaseIds,
}) => {
  const [showEditInput, setShowEditInput] = useState(false);
  const [showAddReplyInput, setShowAddReplyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addReplyForm] = Form.useForm();
  const [editReplyForm] = Form.useForm();
  const { userDetails } = useSelector((state) => state.auth);
  const userId = userDetails?.idToken["custom:userId"];
  const userName = userDetails?.idToken["name"];
  const X_API_KEY = process.env.NEXT_PUBLIC_X_API_KEY;

  const databaseName =
    selectedDatabases && selectedDatabaseIds
      ? selectedDatabaseIds.includes(comment.databaseId)
        ? selectedDatabases[selectedDatabaseIds.indexOf(comment.databaseId)]
        : ""
      : "";

  const items = [
    {
      key: "edit",
      label: "Edit",
    },
    ...(level === 0
      ? [
          {
            key: comment.status === CommentStatus.ACTIVE ? "disable" : "enable",
            label:
              comment.status === CommentStatus.INACTIVE ? "Enable" : "Disable",
          },
        ]
      : []),
    {
      key: "delete",
      label: (
        <Popconfirm
          title="Are you sure you want to delete this comment?"
          onConfirm={() =>
            deleteComment(comment.id, comment.parentCommentId || null)
          }
          okText="Yes"
          cancelText="No"
        >
          <span className="text-red-500">Delete</span>
        </Popconfirm>
      ),
    },
  ];

  const handleMenuClick = (key) => {
    if (key === "edit") {
      setShowEditInput(true);
      editReplyForm.setFieldsValue({
        id: comment.id,
        editText: comment.comment,
      });
    } else if (key === "disable") {
      disableComment(comment.id, comment.parentCommentId || null);
    } else if (key === "enable") {
      undisableComment(comment.id, comment.parentCommentId || null);
    }
  };

  const addReply = async (replyData) => {
    const { text, parentCommentId, createdBy } = replyData;

    const payload = {
      comment: text,
      repliedTo: parentCommentId,
      createdBy: createdBy,
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
        throw new Error(errorData.message || "Failed to add reply");
      }

      const data = await response.json();
      message.success("Reply added successfully!");
      fetchComments(selectedDatabaseIds);
    } catch (error) {
      console.error("Error adding reply:", error);
      message.error(
        error.message || "An error occurred while adding the reply"
      );
    } finally {
      addReplyForm.resetFields();
      setLoading(false);
      setShowAddReplyInput(false);
    }
  };

  const handleAddReply = (reply) => {
    if (!reply.trim()) {
      message.error("Please enter a reply.");
      return;
    }

    const newReplyData = {
      createdBy: userId,
      text: reply.trim(),
      replies: [],
      parentCommentId: comment.id,
    };
    addReply(newReplyData);
  };

  const editCommentOrReply = async (id, newText, isReply = false) => {
    const payload = {
      id: id,
      comment: newText,
    };

    try {
      setLoading(true);
      const response = await fetch(
        "https://yftbqyckri.execute-api.eu-west-1.amazonaws.com/dev/update-comment",
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
        fetchComments(selectedDatabaseIds);
        message.success(
          `${isReply ? "Reply" : "Comment"} updated successfully!`
        );
      } else {
        message.error(data.message || "Failed to update comment or reply.");
      }
    } catch (error) {
      console.error("Error editing comment or reply:", error);
      message.error("An error occurred while updating the comment or reply.");
    } finally {
      setLoading(false);
      setShowEditInput(false);
    }
  };

  const handleEdit = (values) => {
    const newText = values.editText.trim();

    if (!newText) {
      message.error("Please enter text.");
      return;
    }

    if (level === 0) {
      editCommentOrReply(values.id, newText, false);
    } else {
      editCommentOrReply(values.id, newText, true);
    }
  };

  return (
    <div className="treeview js-treeview">
      <ul>
        <li>
          {level === 0 && (
            <div className="bg-[#D9D9D9] h-[1px] w-full opacity-70 my-5"></div>
          )}
          <div className={` ${level > 0 ? "pl-0" : ""}`}>
            <div className="flex items-start">
              <Avatar
                className={`bg-[#F6F6FF] text-[#3E53D7] rounded-full p-[18px] mr-1 mt-[2px] ${
                  comment.disabled ? "opacity-70 cursor-default" : ""
                }`}
              >
                {getInitials(comment.createdBy.name)}
              </Avatar>

              <div className="w-full ml-2">
                {showEditInput ? (
                  <div className="flex flex-row items-end">
                    <div className="w-full">
                      <p className="text-xs text-[#3E53D7] font-normal bg-[#F6F6FF] py-1 px-4 rounded-md inline-block">
                        Editing
                      </p>
                      <Form
                        layout="inline"
                        onFinish={handleEdit}
                        className="w-full"
                        form={editReplyForm}
                      >
                        <Form.Item name="id" hidden></Form.Item>
                        <Form.Item
                          name="editText"
                          rules={[
                            {
                              required: true,
                              message: "Please enter updated text!",
                            },
                          ]}
                          className="w-full m-0"
                        >
                          <Input
                            placeholder="Edit your comment"
                            className="px-2 border rounded-lg"
                            suffix={
                              <Button
                                type="text"
                                htmlType="submit"
                                disabled={loading}
                                loading={loading}
                                icon={
                                  <img
                                    src="/assets/icons/send-icon.svg"
                                    className="w-4 h-4 cursor-pointer"
                                    alt="Send Icon"
                                  />
                                }
                              />
                            }
                          />
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-col">
                        <CommonTypography
                          className={`font-semibold text-[13px] md:text-sm capitalize ${
                            comment.status === CommentStatus.INACTIVE
                              ? "text-gray-400 cursor-default"
                              : ""
                          }`}
                        >
                          {comment.createdBy.name}
                        </CommonTypography>
                        <CommonTypography
                          className={`!font-normal !text-xs opacity-70 ${
                            comment.status === CommentStatus.INACTIVE
                              ? "text-gray-400 cursor-default"
                              : ""
                          }`}
                        >
                          {formatRelativeTime(comment.createdAt)}
                        </CommonTypography>
                      </div>
                      <div className="flex flex-row items-center">
                        {level === 0 && (
                          <Tag
                            className={`!text-white bg-[#3E53D7] border-none !font-normal !text-[10px] py-[2px] px-3 rounded-xl hidden md:block ${
                              comment.status === CommentStatus.INACTIVE
                                ? "opacity-70 cursor-default"
                                : ""
                            }`}
                          >
                            {databaseName}
                          </Tag>
                        )}
                        <Dropdown
                          menu={{
                            items: items.map((item) => ({
                              ...item,
                              onClick: () => handleMenuClick(item.key),
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
                      className={`font-normal text-xs md:text-sm text-black my-2 ${
                        comment.status === CommentStatus.INACTIVE
                          ? "text-gray-400 cursor-default"
                          : ""
                      }`}
                    >
                      {comment.comment}
                    </p>

                    {level === 0 && (
                      <div className="custom-button">
                        <Button
                          icon={
                            <img
                              src="/assets/icons/reply-icon.svg"
                              alt="icon"
                              className="w-4 h-4"
                            />
                          }
                          className="bg-[#FAFAFA] text-[#565758]  rounded-2xl font-normal text-sm border-none w-18 h-8 flex items-center justify-center"
                          onClick={() => {
                            setShowAddReplyInput(!showAddReplyInput);
                          }}
                          disabled={comment.status === CommentStatus.INACTIVE}
                        >
                          Reply
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <ul>
                    {comment.replies
                      .slice(0, showAllReplies ? comment.replies.length : 2)
                      .map((reply) => (
                        <li key={reply.id}>
                          <Comment
                            comment={reply}
                            level={level + 1}
                            showAllReplies={showAllReplies[reply.id] || false}
                            toggleShowAllReplies={(value) =>
                              toggleShowAllReplies(reply.id, value)
                            }
                            deleteComment={(replyId, parentId) =>
                              deleteComment(replyId, parentId)
                            }
                            disableComment={(replyId, parentId) =>
                              disableComment(replyId, parentId)
                            }
                            undisableComment={(replyId, parentId) =>
                              undisableComment(replyId, parentId)
                            }
                            fetchComments={() =>
                              fetchComments(selectedDatabaseIds)
                            }
                          />
                        </li>
                      ))}
                    {comment.replies.length > 2 && (
                      <CommonTypography
                        type="text"
                        className="text-[#3E53D7] ml-8 md:ml-14 mt-2 underline border-none shadow-none cursor-pointer"
                        onClick={() => toggleShowAllReplies(!showAllReplies)}
                      >
                        {showAllReplies
                          ? "Load Less Replies"
                          : "Load More Replies"}
                      </CommonTypography>
                    )}
                  </ul>
                )}

                {showAddReplyInput && (
                  <div className="mx-0 md:mx-3 mt-4 flex flex-row items-start">
                    <Avatar className="bg-[#F6F6FF] text-[#3E53D7] rounded-full p-[18px] mr-[6px] mt-[2px] opacity-70 cursor-default">
                      {getInitials(userName)}
                    </Avatar>
                    <div className="w-full ml-2">
                      <p className="text-xs text-[#3E53D7] font-normal bg-[#F6F6FF] py-1 px-4 rounded-md md:inline-block hidden">
                        Replying to {comment.createdBy.name}
                      </p>
                      <p className="text-xs text-[#3E53D7] font-normal bg-[#F6F6FF] py-1 px-4 rounded-md inline-block md:hidden">
                        Replying
                      </p>

                      <Form
                        layout="inline"
                        onFinish={({ reply }) => handleAddReply(reply)}
                        className="w-full"
                        form={addReplyForm}
                      >
                        <Form.Item
                          name="reply"
                          rules={[
                            { required: true, message: "Please add a reply!" },
                          ]}
                          className="w-full m-0"
                        >
                          <Input
                            placeholder="Add a reply"
                            className="px-2 border rounded-lg"
                            suffix={
                              <Button
                                type="text"
                                htmlType="submit"
                                disabled={loading}
                                loading={loading}
                                icon={
                                  <img
                                    src="/assets/icons/send-icon.svg"
                                    className="w-4 h-4 cursor-pointer"
                                    alt="Send Icon"
                                  />
                                }
                              />
                            }
                          />
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Comment;
