"use client";

import React from "react";
import { Button } from "antd";
import { CommentStatus } from "@/utils/const";

/**
 * Renders the main comment text and the "Reply" button for top-level comments.
 * Classes remain the same to preserve styling.
 */
const CommentBody = ({
  comment,
  level,
  showAddReplyInput,
  setShowAddReplyInput,
}) => {
  const isInactive = comment.status === CommentStatus.INACTIVE;

  return (
    <>
      <p
        className={`font-normal text-xs md:text-sm text-black my-2 ${
          isInactive ? "text-gray-400 cursor-default" : ""
        }`}
      >
        {comment.comment}
      </p>

      {level === 0 && (
        <div className="custom-button mb-5">
          <Button
            icon={
              <img
                src="/assets/icons/reply-icon.svg"
                alt="icon"
                className="w-4 h-4"
              />
            }
            className="bg-[#FAFAFA] text-[#565758] rounded-2xl font-normal text-sm border-none w-18 h-8 flex items-center justify-center"
            onClick={() => setShowAddReplyInput(!showAddReplyInput)}
            disabled={isInactive}
          >
            Reply
          </Button>
        </div>
      )}
    </>
  );
};

export default CommentBody;
