import { Flex, Skeleton } from "antd";
import React from "react";

const BlogSkeleton = () => {
  return (
    <Flex
      vertical
      size={10}
      className="h-full min-h-[500px] w-full rounded-md p-4 shadow-md"
    >
      <Skeleton.Image active className="!w-full !h-[240px]" />
      <Skeleton className="mt-10" />
    </Flex>
  );
};

export default BlogSkeleton;
