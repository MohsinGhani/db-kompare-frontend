// useComments.js
"use client";

import { useState, useCallback } from "react";
import { message } from "antd";
import {
  fetchCommentsData,
  addComment,
  deleteComment,
  updateCommentStatus,
  updateComment,
} from "@/utils/commentUtils";
import { CommentStatus } from "@/utils/const";
import { useSelector } from "react-redux";

export default function useComments(entityIds = []) {
  const { userDetails } = useSelector((state) => state.auth);
  const user = userDetails?.data?.data;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Separate loading states for different actions
  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    let ids = entityIds;
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    if (ids.length === 0) return;
    setLoading(true);
    try {
      const data = await fetchCommentsData(ids);
      setComments(data.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      message.error("Error fetching comments.");
    } finally {
      setLoading(false);
    }
  }, [entityIds]);

  const addNewComment = async (payload) => {
    let data = { ...payload };

    // Add user info if available
    if (user) {
      data["createdBy"] = user.id;
    }

    try {
      setAddLoading(true);
      const response = await addComment(data);
      if (response.data) {
        message.success("Comment added successfully");
        fetchComments();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      message.error(
        error.message || "An error occurred while adding the comment"
      );
    } finally {
      setAddLoading(false);
    }
  };

  const updateCommentContent = async (payload) => {
    try {
      setUpdateLoading(true);
      const response = await updateComment(payload);
      if (response?.data) {
        message.success("Comment updated successfully");
        fetchComments();
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      message.error("An error occurred while updating the comment.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const removeComment = async (commentId) => {
    try {
      setDeleteLoading(true);
      const response = await deleteComment({ commentId });
      if (response.message === "Comment deleted successfully") {
        message.success("Comment or reply deleted successfully!");
        fetchComments();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      message.error("An error occurred while deleting the comment.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const changeCommentStatus = async (commentId, status, updatedBy) => {
    try {
      setStatusLoading(true);
      const payload = {
        id: commentId,
        status: status,
        updatedBy: updatedBy,
      };
      const response = await updateCommentStatus(payload);
      if (response.data) {
        const actionText =
          status === CommentStatus.INACTIVE ? "disabled" : "enabled";
        message.success(`Comment or reply ${actionText} successfully!`);
        fetchComments();
      }
    } catch (error) {
      console.error("Error updating comment status:", error);
      message.error("An error occurred while updating the comment status.");
    } finally {
      setStatusLoading(false);
    }
  };

  return {
    comments,
    loading,
    addLoading,
    updateLoading,
    deleteLoading,
    statusLoading,
    fetchComments,
    addNewComment,
    updateCommentContent,
    removeComment,
    changeCommentStatus,
  };
}
