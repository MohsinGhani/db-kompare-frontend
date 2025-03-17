// Comment.js
"use client";

import React, { useState, useRef, useEffect, Fragment } from "react";
import { Avatar, Form, message } from "antd";
import { useSelector } from "react-redux";
import { CommentStatus, UserRole } from "@/utils/const";
import { getInitials } from "@/utils/getInitials";
import CommentHeader from "./CommentHeader";
import CommentBody from "./CommentBody";
import CommentEditForm from "./CommentEditForm";
import ReplyInput from "./ReplyInput";
import ReplyList from "./ReplyList";
import "./tree-view.scss";

/**
 * Main Comment component that renders:
 * - The avatar, header, and body of a comment
 * - The inline edit form (if in edit mode)
 * - The reply input (if activated)
 * - Recursive rendering of replies via <ReplyList />
 */
const Comment = ({
  comment,
  level,
  fetchComments,
  showAllReplies,
  toggleShowAllReplies,
  handleDeleteComment,
  handleDisableComment,
  handleUndisableComment,
  entityOptions,
  entityOptionIds,
  entityType,
  addNewComment,
  updateCommentContent,
  className,
  updateLoading,
  deleteLoading,
  addLoading,
  statusLoading,
}) => {
  const [showEditInput, setShowEditInput] = useState(false);
  const [showAddReplyInput, setShowAddReplyInput] = useState(false);
  const [addReplyLoading, setAddReplyLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [addReplyForm] = Form.useForm();
  const [editReplyForm] = Form.useForm();
  const editInputRef = useRef(null);

  const { userDetails } = useSelector((state) => state.auth);
  const userId = userDetails?.data?.data?.id;
  const userName = userDetails?.data?.data?.name;
  const userRole = userDetails?.data?.data?.role;

  const isAuthor = comment.createdBy.id === userId;
  const isAdmin = userRole === UserRole.ADMIN;

  // Determine the entity field (e.g., databaseId) and resolve its name.
  const entityName =
    entityOptions && entityOptionIds
      ? entityOptionIds.includes(comment?.entityId)
        ? entityOptions[entityOptionIds.indexOf(comment?.entityId)]
        : ""
      : "";

  // Build dropdown menu items based on user role and authorship.
  const buildMenuItems = () => {
    const items = [];
    if (isAdmin) {
      items.push(
        { key: "edit", label: "Edit" },
        {
          key: comment.status === CommentStatus.ACTIVE ? "disable" : "enable",
          label:
            comment.status === CommentStatus.INACTIVE ? "Enable" : "Disable",
        },
        {
          key: "delete",
          label: "Delete",
        }
      );
    }
    if (isAuthor && userRole === UserRole.VENDOR) {
      items.push(
        { key: "edit", label: "Edit" },
        { key: "delete", label: "Delete" }
      );
    }
    return items.filter(
      (item, index, self) => index === self.findIndex((t) => t.key === item.key)
    );
  };

  const uniqueItems = buildMenuItems();

  const handleMenuClick = (key) => {
    if (key === "edit") {
      setShowEditInput(true);
      editReplyForm.setFieldsValue({
        id: comment.id,
        editText: comment.comment,
        rating: comment.rating,
      });
    } else if (key === "disable") {
      handleDisableComment(comment.id, comment.parentCommentId || null);
    } else if (key === "enable") {
      handleUndisableComment(comment.id, comment.parentCommentId || null);
    } else if (key === "delete") {
      handleDeleteComment(comment.id, comment.parentCommentId || null);
    }
  };

  // Add a reply via an API call through the container callback.
  const addReply = async (replyData, rating) => {
    try {
      setAddReplyLoading(true);
      const payload = {
        comment: replyData.text,
        repliedTo: replyData.parentCommentId,
        createdBy: replyData.createdBy,
        entityType,
        ...(rating !== undefined && { rating }),
      };
      await addNewComment(payload);
      message.success("Reply added successfully!");
      fetchComments();
    } catch (error) {
      console.error("Error adding reply:", error);
      message.error(
        error.message || "An error occurred while adding the reply"
      );
    } finally {
      addReplyForm.resetFields();
      setShowAddReplyInput(false);
      setAddReplyLoading(false);
    }
  };

  const handleAddReply = (values) => {
    const { reply, rating } = values;
    const newReplyData = {
      createdBy: userId,
      text: reply && reply.trim(),
      replies: [],
      parentCommentId: comment.id,
    };
    addReply(newReplyData, rating);
  };

  const editCommentOrReply = async (id, newText, isReply, rating) => {
    const payload = {
      id,
      comment: newText,
      ...(rating !== undefined && { rating }),
    };
    try {
      setEditLoading(true);
      await updateCommentContent(payload);
    } catch (error) {
      message.error("An error occurred while updating the comment or reply.");
    } finally {
      setEditLoading(false);
      setShowEditInput(false);
    }
  };

  const handleEdit = (values) => {
    const rating = values.rating;
    const newText = values?.editText?.trim();
    editCommentOrReply(values.id, newText, level > 0, rating);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editInputRef.current &&
        !editInputRef.current.contains(event.target)
      ) {
        setShowEditInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="treeview">
      <ul className="cmnt-tree">
        {level === 0 && (
          <div className="bg-[#D9D9D9] h-[1px] w-full opacity-70 my-5"></div>
        )}
        <li className="cmnt-tree-child">
          <div className="">
            {/* Empty div preserved for structural reasons */}
          </div>
          <div className={`${level > 0 ? "pl-0" : ""}`}>
            <div className="relative flex items-start" ref={editInputRef}>
              {/* Avatar remains in place */}
              <Avatar
                className={`bg-[#F6F6FF] text-[#3E53D7] rounded-full p-[18px] mr-1 mt-[2px] ${
                  comment.status === CommentStatus.INACTIVE
                    ? "bg-[#FAFAFA] cursor-default"
                    : ""
                }`}
              >
                {getInitials(comment?.createdBy?.name)}
              </Avatar>

              <div className="w-full ml-2">
                {showEditInput ? (
                  <CommentEditForm
                    editReplyForm={editReplyForm}
                    handleEdit={handleEdit}
                    editLoading={editLoading}
                    entityType={entityType}
                    isAdmin={isAdmin}
                  />
                ) : (
                  <Fragment>
                    <CommentHeader
                      comment={comment}
                      entityName={entityName}
                      level={level}
                      isAdmin={isAdmin}
                      isAuthor={isAuthor}
                      uniqueItems={uniqueItems}
                      handleMenuClick={handleMenuClick}
                      userDetails={userDetails}
                    />
                    <CommentBody
                      comment={comment}
                      level={level}
                      showAddReplyInput={showAddReplyInput}
                      setShowAddReplyInput={setShowAddReplyInput}
                    />
                  </Fragment>
                )}
                <ReplyList
                  comment={comment}
                  className={className}
                  showAllReplies={showAllReplies}
                  toggleShowAllReplies={toggleShowAllReplies}
                  handleDeleteComment={handleDeleteComment}
                  handleDisableComment={handleDisableComment}
                  handleUndisableComment={handleUndisableComment}
                  fetchComments={fetchComments}
                  entityOptions={entityOptions}
                  entityOptionIds={entityOptionIds}
                  entityType={entityType}
                  level={level}
                />
              </div>
            </div>
          </div>
        </li>
        {showAddReplyInput && (
          <ReplyInput
            addReplyForm={addReplyForm}
            handleAddReply={handleAddReply}
            addReplyLoading={addReplyLoading}
            userName={userName}
            replyingToName={comment.createdBy.name}
            entityType={entityType}
          />
        )}
      </ul>
    </div>
  );
};

export default Comment;
