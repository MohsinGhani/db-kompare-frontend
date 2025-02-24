"use client";
import React, { useEffect, useState } from "react";
import SplitPane from "react-split-pane";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import QuestionTop from "./QuestionTop";
import { useParams } from "next/navigation";
import { fetchQuestionDetail } from "@/utils/questionsUtil";
import { toast } from "react-toastify";

const QuestionDetail = () => {
  const [question, setQuestion] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const getQuestionData = async () => {
        try {
          const data = await fetchQuestionDetail(id);
          setQuestion(data?.data);
        } catch (error) {
          toast.error(error?.message || "Failed to fetch question detail");
        }
      };
      getQuestionData();
    }
  }, [id]);

  console.log("question", question);

  return (
    <div className="pt-28 md:pt-20 pb-24 min-h-screen h-full w-full overflow-hidden mb-24 question-details">
      <QuestionTop question={question} />
      <SplitPane
        split="vertical"
        minSize={500}
        maxSize={-500}
        defaultSize="50%"
        className="w-full "
      >
        <LeftPanel question={question} />
        <RightPanel question={question} />
      </SplitPane>
    </div>
  );
};

export default QuestionDetail;
