"use client";

import React from "react";
import CommonTypography from "@/components/shared/Typography";
import Comment from "./Comment";

const ReplyList = ({
  comment,
  className,
  showAllReplies,
  toggleShowAllReplies,
  handleDeleteComment,
  handleDisableComment,
  handleUndisableComment,
  fetchComments,
  entityOptions,
  entityOptionIds,
  entityType,
  level,
}) => {
  if (!comment.replies || comment.replies.length === 0) return null;

  const repliesToShow = comment.replies.slice(
    0,
    showAllReplies ? comment.replies.length : 2
  );

  return (
    <ul className="cmnt-tree">
      {repliesToShow.map((reply, index) => (
        <li className={`cmnt-tree-child ${className}`} key={reply.id}>
          <Comment
            comment={reply}
            level={level + 1}
            showAllReplies={showAllReplies[reply.id] || false}
            toggleShowAllReplies={(value) =>
              toggleShowAllReplies(reply.id, value)
            }
            handleDeleteComment={handleDeleteComment}
            handleDisableComment={handleDisableComment}
            handleUndisableComment={handleUndisableComment}
            fetchComments={fetchComments}
            entityOptions={entityOptions}
            entityOptionIds={entityOptionIds}
            entityType={entityType}
            className={className}
          />

          {index === repliesToShow.length - 1 && comment.replies.length > 2 && (
            <CommonTypography
              type="text"
              className="text-[#3E53D7] ml-[72px] mt-2 underline border-none shadow-none cursor-pointer"
              onClick={() => toggleShowAllReplies(!showAllReplies)}
            >
              {showAllReplies ? "Load Less Replies" : "Load More Replies"}
            </CommonTypography>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ReplyList;
