"use client";

import { DIFFICULTY } from "@/utils/const";
import { fetchQuestions } from "@/utils/questionsUtil";
import { Table } from "antd";
import React, { useEffect, useState } from "react";

const columns = [
  {
    title: "Q.No",
    dataIndex: "ind",
    key: "ind",
  },
  {
    title: "Company",
    dataIndex: "companies",
    key: "companies",
    render: (item) => {
      const company = item[0];
      return (
        <div>
          <img />
          <p>{company?.name}</p>
        </div>
      );
    },
  },
  {
    title: "Title",
    dataIndex: "shortTitle",
    key: "shortTitle",
  },
  {
    title: "Category",
    dataIndex: "categories",
    key: "categories",
    render: (item) => {
      const category = item[0];
      return <p>{category}</p>;
    },
  },
  {
    title: "Difficulty",
    dataIndex: "difficulty",
    key: "difficulty",
    render: (text) => (
      <p
        className={`${
          text === DIFFICULTY.EASY
            ? "text-[#17A44B]"
            : text === DIFFICULTY.MEDIUM
            ? "text-[#DA8607]"
            : "text-[#DE3D28]"
        }`}
      >
        {text}
      </p>
    ),
  },
  {
    title: "Status",
    dataIndex: "Status",
    key: "Status",
    render: (text) => <p>-</p>,
  },
];
const difficultyOrder = { EASY: 1, MEDIUM: 2, HARD: 3 };
const QuestionsTable = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const data = await fetchQuestions();
        const sortedQuestions = data?.data?.sort(
          (a, b) =>
            (difficultyOrder[a.difficulty] || 4) -
            (difficultyOrder[b.difficulty] || 4)
        );
        setQuestions(sortedQuestions);
      } catch (err) {
        setError("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={questions?.map((item, ind) => ({
        ...item,
        ind: ind + 1,
      }))}
      loading={loading}
      className="font-medium"
      bordered
    />
  );
};

export default QuestionsTable;
