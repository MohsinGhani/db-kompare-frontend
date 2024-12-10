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

const Comment = ({
  comment,
  level,
  showAllReplies,
  toggleShowAllReplies,
  deleteComment,
  disableComment,
  undisableComment,
  addReply,
  editComment,
  editReply,
}) => {
  const [showAddReplyInput, setShowAddReplyInput] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [editText, setEditText] = useState("");
  const [addReplyForm] = Form.useForm();
  const [editReplyForm] = Form.useForm();

  const items = [
    {
      key: "edit",
      label: "Edit",
    },
    {
      key: comment.disabled ? "undisable" : "disable",
      label: comment.disabled ? "Undisable" : "Disable",
    },
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
      setEditText(comment.text);
    } else if (key === "disable") {
      disableComment(comment.id, comment.parentCommentId || null);
    } else if (key === "undisable") {
      undisableComment(comment.id, comment.parentCommentId || null);
    }
  };

  const handleAddReply = (reply) => {
    if (!reply.trim()) {
      message.error("Please enter a reply.");
      return;
    }

    const newReplyData = {
      id: Date.now(),
      author: "Sameer Malik",
      commentedAt: "Just now",
      text: reply.trim(),
      database: comment.database,
      disabled: false,
      replies: [],
      parentCommentId: comment.id,
    };

    if (typeof addReply === "function") {
      addReply(newReplyData);
      addReplyForm.resetFields();
      setShowAddReplyInput(false);
    }
  };

  const handleEdit = (editText) => {
    if (!editText.trim()) {
      message.error("Please enter text.");
      return;
    }

    if (level === 0) {
      if (typeof editComment === "function") {
        editComment(editText);
      } else {
        console.error("editComment function is not defined.");
      }
    } else {
      if (typeof editReply === "function") {
        editReply(comment.id, editText);
      } else {
        console.error("editReply function is not defined.");
      }
    }

    setShowEditInput(false);
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
                className={`bg-[#F6F6FF] text-[#3E53D7] rounded-full p-[18px] md:mr-[6px] mt-[2px] ${
                  comment.disabled ? "opacity-70 cursor-default" : ""
                }`}
              >
                {getInitials(comment.author)}
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
                        onFinish={({ editText }) => handleEdit(editText)}
                        className="w-full"
                      >
                        <Form.Item
                          name="editText"
                          initialValue={editText}
                          form={editReplyForm}
                          rules={[
                            {
                              required: true,
                              message: "Please enter updated text!",
                            },
                          ]}
                          className="w-full m-0"
                        >
                          <Input
                            autoFocus
                            placeholder="Edit your comment"
                            className="px-2 border rounded-lg"
                            onBlur={() => setShowEditInput(false)}
                            suffix={
                              <Button
                                type="text"
                                htmlType="submit"
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
                          className={`font-semibold text-[13px] md:text-sm ${
                            comment.disabled
                              ? "text-gray-400 cursor-default"
                              : ""
                          }`}
                        >
                          {comment.author}
                        </CommonTypography>
                        <CommonTypography
                          className={`!font-normal !text-xs opacity-70 ${
                            comment.disabled
                              ? "text-gray-400 cursor-default"
                              : ""
                          }`}
                        >
                          {comment.commentedAt}
                        </CommonTypography>
                      </div>
                      <div className="flex flex-row items-center">
                        <Tag
                          className={`!text-white bg-[#3E53D7] border-none !font-normal !text-[10px] py-[2px] px-3 rounded-xl hidden md:block ${
                            comment.disabled ? "opacity-70 cursor-default" : ""
                          }`}
                        >
                          {comment.database}
                        </Tag>
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
                        comment.disabled ? "text-gray-400 cursor-default" : ""
                      }`}
                    >
                      {comment.text}
                    </p>

                    {level === 0 && !comment.disabled && (
                      <Button
                        className="bg-[#FAFAFA] text-[#565758] rounded-2xl font-normal text-xs border-none w-14 h-8"
                        onClick={() => {
                          setShowAddReplyInput(!showAddReplyInput);
                          setEditText("");
                        }}
                      >
                        Reply
                      </Button>
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
                            addReply={(replyData) =>
                              addReply(comment.id, replyData)
                            }
                            editComment={null}
                            editReply={(replyId, parentId, newText) =>
                              editReply(replyId, parentId, newText)
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
                      {getInitials(comment.author)}
                    </Avatar>
                    <div className="w-full ml-2">
                      <p className="text-xs text-[#3E53D7] font-normal bg-[#F6F6FF] py-1 px-4 rounded-md md:inline-block hidden">
                        Replying to {comment.author}
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
