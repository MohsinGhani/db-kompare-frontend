"use client";

import CommonTable from "@/components/shared/CommonTable";
import { DIFFICULTY } from "@/utils/const";
import { fetchUserSubmissions } from "@/utils/questionsUtil";
import { Tag } from "antd";
import { useRouter } from "nextjs-toploader/app";
import React, { useEffect, useState } from "react";

const difficultyOrder = { EASY: 1, MEDIUM: 2, HARD: 3 };

const QuestionsTable = ({ questions, loading, user, setQuestions }) => {
  const router = useRouter();
  const [userSubmissions, setUserSubmissions] = useState([]);

  useEffect(() => {
    if (!user) return;
    const getUserSubmission = async () => {
      try {
        // Make sure to await the response from fetchUserSubmissions
        const res = await fetchUserSubmissions(user.id);
        setUserSubmissions(res?.data || []);
      } catch (error) {
        console.log(error?.message);
      }
    };
    getUserSubmission();
  }, [user]);

  const enrichedQuestions = questions.map((item, ind) => {
    const submission = userSubmissions.find(
      (sub) => sub?.questionId === item?.id
    );
    const storedQuery = localStorage.getItem(`query-${item.id}`);
    const inProgressFromStorage = storedQuery !== null && storedQuery !== "";

    let status = "-";
    if (submission) {
      status = submission.queryStatus ? "Solved" : "Error";
    } else if (inProgressFromStorage && user) {
      status = "In Progress";
    } else {
      status = "Not Started";
    }

    return { ...item, ind: ind + 1, status };
  });

  const columns = [
    {
      title: "Q.No",
      dataIndex: "questionNo",
      key: "questionNo",
      sorter: (a, b) => a.questionNo - b.questionNo,
      render: (no) => no, // Just return the number, no need for custom div/span
    },
    {
      title: "Company",
      dataIndex: "companies",
      key: "companies",
      render: (companies) => (
        <div>{companies.length > 0 && <p>{companies[0]?.name}</p>}</div>
      ),
      sorter: (a, b) =>
        a.companies[0]?.name.localeCompare(b.companies[0]?.name),
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
      render: (text) => {
        const color =
          text === "Solved"
            ? "#17A44B"
            : text === "Error"
            ? "#DE3D28"
            : text === "In Progress"
            ? "#DA8607"
            : "#848484";
        return <Tag color={color}>{text}</Tag>;
      },
      hidden: user ? false : true,
    },
  ];

  return (
    <CommonTable
      columns={columns}
      dataSource={enrichedQuestions?.map((item) => ({ ...item }))}
      loading={loading}
      className="cursor-pointer transition max-w-[600px] md:max-w-full overflow-auto questions-table"
      bordered
      pagination={false}
      rowKey="id"
      onRow={(record) => ({
        onClick: () => router.push(`/questions/${record.id}`),
      })}
      rowClassName={(record) => {
        const status = record?.status;
        return status === "Solved"
          ? "row-solved"
          : status === "Error"
          ? "row-error"
          : status === "In Progress"
          ? "row-in-progress"
          : "row-default";
      }}
    />
  );
};

export default QuestionsTable;
