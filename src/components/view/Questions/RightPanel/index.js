import React from "react";
import QuestionFilters from "./QuestionFilters";
import QuestionsTable from "./QuestionsTable";

const RightPanel = () => {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-3xl font-bold">SQL & data Interview Questions</p>
        <p className="text-base text-[#565758] font-normal">
          Practice the most common SQL, Statistics, ML, and Python questions
          asked in FAANG Data Science & Data Analyst interviews!
        </p>
      </div>
      <QuestionFilters />
      <QuestionsTable />
    </div>
  );
};

export default RightPanel;
