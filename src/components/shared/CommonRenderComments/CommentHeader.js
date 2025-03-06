"use client";

import React from "react";
import { Avatar, Dropdown, Rate, Tag } from "antd";
import CommonTypography from "@/components/shared/Typography";
import { CommentStatus } from "@/utils/const";
import { formatRelativeTime } from "@/utils/formatDateAndTime";
import { getInitials } from "@/utils/getInitials";

/**
 * Renders the avatar, user name, date, rating, and action dropdown.
 * This subcomponent is used within <Comment /> to preserve the same structure.
 */
const CommentHeader = ({
  comment,
  entityName,
  level,
  isAdmin,
  isAuthor,
  uniqueItems,
  handleMenuClick,
  userDetails,
}) => {
  const isInactive = comment.status === CommentStatus.INACTIVE;

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col">
        <CommonTypography
          className={`font-semibold text-[13px] md:text-sm capitalize mb-1 ${
            isInactive ? "text-gray-400 cursor-default" : ""
          }`}
        >
          {comment.createdBy.name}
        </CommonTypography>

        <CommonTypography
          className={`!font-normal !text-xs opacity-70 ${
            isInactive ? "text-gray-400 cursor-default" : ""
          }`}
        >
          {formatRelativeTime(comment.createdAt)}
          <div className="-mt-1 rate-container">
            <Rate
              disabled
              value={comment.rating}
              className={`text-[#FFC412] !text-[11px] ${
                isInactive ? "cursor-default opacity-50" : ""
              }`}
            />
          </div>
        </CommonTypography>
      </div>

      <div className="flex flex-row items-center">
        {level === 0 && entityName && (
          <Tag
            className={`!text-white bg-[#3E53D7] border-none !font-normal !text-[10px] py-[2px] px-3 rounded-xl hidden md:block ${
              isInactive ? "opacity-70 cursor-default" : ""
            }`}
          >
            {entityName}
          </Tag>
        )}

        {userDetails && (isAuthor || isAdmin) && uniqueItems.length > 0 && (
          <Dropdown
            menu={{
              items: uniqueItems.map((item) => ({
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
        )}
      </div>
    </div>
  );
};

export default CommentHeader;
