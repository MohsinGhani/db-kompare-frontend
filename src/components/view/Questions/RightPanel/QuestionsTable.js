"use client";

import { DIFFICULTY } from "@/utils/const";
import { Table } from "antd";
import { useRouter } from "nextjs-toploader/app";
import React from "react";

const difficultyOrder = { EASY: 1, MEDIUM: 2, HARD: 3 };

const columns = [
  {
    title: "Q.No",
    dataIndex: "ind",
    key: "ind",
    sorter: (a, b) => a.ind - b.ind,
  },
  {
    title: "Company",
    dataIndex: "companies",
    key: "companies",
    render: (companies) => (
      <div>{companies.length > 0 && <p>{companies[0]?.name}</p>}</div>
    ),
  },
  {
    title: "Title",
    dataIndex: "shortTitle",
    key: "shortTitle",
    sorter: (a, b) => a.shortTitle.localeCompare(b.shortTitle),
  },
  {
    title: "Category",
    dataIndex: "categories",
    key: "categories",
    render: (categories) => <p>{categories[0]}</p>,
    sorter: (a, b) =>
      (a.categories[0] || "").localeCompare(b.categories[0] || ""),
  },
  {
    title: "Difficulty",
    dataIndex: "difficulty",
    key: "difficulty",
    render: (difficulty) => (
      <p
        className={`${
          difficulty === DIFFICULTY.EASY
            ? "text-green-600"
            : difficulty === DIFFICULTY.MEDIUM
            ? "text-orange-600"
            : "text-red-600"
        }`}
      >
        {difficulty}
      </p>
    ),
    sorter: (a, b) =>
      (difficultyOrder[a.difficulty] || 4) -
      (difficultyOrder[b.difficulty] || 4),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: () => <p>-</p>,
  },
];

const QuestionsTable = ({ questions, loading }) => {
  const router = useRouter();

  return (
    <Table
      columns={columns}
      dataSource={questions.map((item, ind) => ({ ...item, ind: ind + 1 }))}
      loading={loading}
      className="font-medium max-w-[600px] md:max-w-full overflow-auto"
      bordered
      pagination={false}
      rowKey="id"
      onRow={(record) => ({
        onClick: () => router.push(`/questions/${record.id}`),
      })}
      rowClassName="cursor-pointer transition"
    />
  );
};

export default QuestionsTable;
