"use client";

import React, { useEffect, useState } from "react";
import { CommentStatus } from "@/utils/const";
import CommentInput from "./CommentInput";
import CommentsList from "./CommentsList";
import useComments from "./useComments"; // adjust path if necessary
import "./tree-view.scss";

const CommonRenderComments = ({
  entityType, // e.g., "database", "blog", etc.
  entityOptions, // Array of names for the dropdown
  entityOptionIds, // Array of corresponding IDs
  userId, // The current user's ID (for status changes)
  className,
}) => {
  const {
    comments,
    loading,
    updateLoading,
    deleteLoading,
    addLoading,
    statusLoading,
    fetchComments,
    addNewComment,
    removeComment,
    changeCommentStatus,
    updateCommentContent,
  } = useComments(entityOptionIds);

  // Define state for tracking which comments should show all replies
  const [showAllReplies, setShowAllReplies] = useState({});

  useEffect(() => {
    fetchComments();
  }, [entityOptionIds, fetchComments]);

  return (
    <div className={`w-full lg:max-w-[75%] ${className}`}>
      <div className="flex flex-row items-center my-3">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <div className="bg-[#3E53D7] rounded-xl w-14 flex items-center justify-center ml-2">
          <span className="text-white">{comments.length}</span>
        </div>
      </div>

      <CommentInput
        entityType={entityType}
        entityOptions={entityOptions}
        entityOptionIds={entityOptionIds}
        onSubmit={addNewComment}
        loading={addLoading}
      />

      <CommentsList
        commentsData={comments}
        loading={loading}
        handleDeleteComment={removeComment}
        handleDisableComment={(commentId) =>
          changeCommentStatus(commentId, CommentStatus.INACTIVE, userId)
        }
        handleUndisableComment={(commentId) =>
          changeCommentStatus(commentId, CommentStatus.ACTIVE, userId)
        }
        showAllReplies={showAllReplies}
        toggleShowAllReplies={setShowAllReplies}
        fetchComments={fetchComments}
        entityOptions={entityOptions}
        entityOptionIds={entityOptionIds}
        addNewComment={addNewComment}
        updateCommentContent={updateCommentContent}
        entityType={entityType}
      />
    </div>
  );
};

export default CommonRenderComments;
