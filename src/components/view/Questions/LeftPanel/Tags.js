"use client";

import { fetchTags } from "@/utils/questionsUtil";
import React, { useEffect, useState } from "react";

const Tags = ({ filters, setFilters }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getTags = async () => {
      const res = await fetchTags();
      setData(res?.data);
    };
    getTags();
  }, []);

  // Toggle the tag selection in the filters
  const handleTagClick = (tag) => {
    const tagId = tag?.id;
    if (!tagId) return;
    setFilters((prevFilters) => {
      const isSelected = prevFilters?.tags.includes(tagId);
      const newTags = isSelected
        ? prevFilters.tags.filter((id) => id !== tagId)
        : [...prevFilters.tags, tagId];
      return { ...prevFilters, tags: newTags };
    });
  };

  return (
    <>
      <p className="text-2xl font-bold text-left">Tags</p>
      <div className="flex flex-wrap gap-2">
        {data?.map((item) => {
          const isSelected = filters?.tags?.includes(item?.id);
          return (
            <div
              key={item.id}
              onClick={() => handleTagClick(item)}
              className={`flex items-center gap-2 border p-2 rounded-md transition cursor-pointer ${
                isSelected
                  ? "bg-primary border-primary text-white"
                  : "hover:border-primary hover:text-primary"
              }`}
            >
              <p className="font-medium text-xs">{item?.name}</p>
              <p
                className={`text-xs ${
                  isSelected ? "text-white" : " text-gray-500 "
                } font-medium `}
              >{`(${item?.count})`}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Tags;
