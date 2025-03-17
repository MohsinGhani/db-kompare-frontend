"use client";

import React from "react";
import { Skeleton, Empty } from "antd";
import Comment from "./Comment";

const CommentsList = ({
  commentsData = [],
  loading = false,
  entityOptions,
  entityOptionIds,
  entityType,
  showAllReplies,
  toggleShowAllReplies,
  handleDeleteComment,
  handleDisableComment,
  handleUndisableComment,
  fetchComments,
  addNewComment,
  updateCommentContent,
}) => {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 3 }} className="pt-12" />;
  }

  if (!commentsData || commentsData.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No comments"
        className="pt-12"
      />
    );
  }

  return (
    <div className="w-full ">
      {commentsData
        ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        ?.map((comment) => (
          <Comment
            key={comment?.id}
            comment={comment}
            level={0}
            entityOptions={entityOptions}
            entityOptionIds={entityOptionIds}
            entityType={entityType}
            showAllReplies={showAllReplies[comment?.id] || false}
            toggleShowAllReplies={(value) =>
              toggleShowAllReplies(comment?.id, value)
            }
            handleDeleteComment={handleDeleteComment}
            handleDisableComment={handleDisableComment}
            handleUndisableComment={handleUndisableComment}
            fetchComments={fetchComments}
            className="childreply"
            addNewComment={addNewComment}
            updateCommentContent={updateCommentContent}
          />
        ))}
    </div>
  );
};

export default CommentsList;
