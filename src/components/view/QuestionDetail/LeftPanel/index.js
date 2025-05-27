import CommonMarkdown from "@/components/shared/CommonMarkdown";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import SubmissionsTable from "./SubmissionsTable";

const LeftPanel = ({ question, user }) => {
  const tabItems = [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-1">
          <img
            src="/assets/icons/question.gif"
            alt="question"
            className="w-6 h-6"
          />
          Questions
        </div>
      ),
      children: (
        <div className="h-full overflow-auto py-4">
          <CommonMarkdown markdown={question?.description} />
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex items-center gap-1">
          <img
            src="/assets/icons/solution.gif"
            alt="solution"
            className="w-6 h-6"
          />
          Solution
        </div>
      ),
      children: <CommonMarkdown markdown={question?.solutionExplanation} />,
      disabled: !user,
    },
    {
      key: "3",
      label: (
        <div className="flex items-center gap-1">
          <img
            src="/assets/icons/y-subm.gif"
            alt="y-subm"
            className="w-6 h-6"
          />
          Your submissions
        </div>
      ),
      children: <SubmissionsTable question={question} type="self" />,
      disabled: !user,
    },
    {
      key: "4",
      label: (
        <div className="flex items-center gap-1">
          <img
            src="/assets/icons/o-subm.gif"
            alt="o-subm"
            className="w-6 h-6"
          />
          Other submissions
        </div>
      ),
      children: <SubmissionsTable question={question} type="others" />,
    },
  ];
  return (
    <div className="w-full h-full overflow-auto bg-[#F6FFFD] px-4 py-6 ">
      <div className="flex items-center justify-between gap-3 ">
        <p className="font-bold text-2xl w-3/5">{question?.title}</p>
        <div className="flex items-center gap-2">
          <div>
            <p className="text-[#565758]">Source From</p>
            <p className="text-[#191A15] text-sm font-semibold">
              {question?.companies[0]?.name}
            </p>
          </div>
          <div className="border-r-2" />
          <div>
            <p className="text-[#565758]">Difficulty</p>
            <p className="text-[#191A15] text-sm font-semibold">
              {question?.difficulty}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 h-full">
        <Tabs animated defaultActiveKey="1" items={tabItems} />
      </div>
    </div>
  );
};

export default LeftPanel;
