import React from "react";

const data = [
  {
    id: "1",
    createdAt: Date.now(),
    name: "Percentage Calculations",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "2",
    createdAt: Date.now(),
    name: "Joins",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "3",
    createdAt: Date.now(),
    name: "Array Functions",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "4",
    createdAt: Date.now(),
    name: "Date-Time Functions",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "5",
    createdAt: Date.now(),
    name: "Mathematical Functions",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "6",
    createdAt: Date.now(),
    name: "Aggregate Functions",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "7",
    createdAt: Date.now(),
    name: "Ace the Data Science Interview",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "8",
    createdAt: Date.now(),
    name: "Data Type Conversion",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "9",
    createdAt: Date.now(),
    name: "Data Generation Functions",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "10",
    createdAt: Date.now(),
    name: "Window Functions",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "11",
    createdAt: Date.now(),
    name: "Set Operations",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "12",
    createdAt: Date.now(),
    name: "Null Handling",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "13",
    createdAt: Date.now(),
    name: "Conditional Expression",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "14",
    createdAt: Date.now(),
    name: "Top N Results",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "15",
    createdAt: Date.now(),
    name: "Control Flow Functions",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "16",
    createdAt: Date.now(),
    name: "Arithmetic Operators",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "17",
    createdAt: Date.now(),
    name: "Existence Check",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "18",
    createdAt: Date.now(),
    name: "Conditional Logic",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "19",
    createdAt: Date.now(),
    name: "Common Table Expressions (CTE) or Subquery",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "20",
    createdAt: Date.now(),
    name: "String Functions",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "21",
    createdAt: Date.now(),
    name: "Distinct and Unique Handling",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
  {
    id: "22",
    createdAt: Date.now(),
    name: "User Behavior",
    status: "ACTIVE",
    tag_type: null,
    updatedAt: Date.now(),
  },
];

const Tags = () => {
  return (
    <>
      <p className="text-2xl font-bold text-left ">Tags</p>
      <div className="flex flex-wrap gap-2 ">
        {data?.map((item) => (
          <div className="border p-2 rounded-md hover:border-primary hover:text-primary transition cursor-pointer">
            <p className="font-medium">{item?.name}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Tags;
