"use client";
import React, { useEffect, useState } from "react";
import SplitPane from "react-split-pane";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import QuestionTop from "./QuestionTop";
import { useParams } from "next/navigation";
import { fetchQuestionDetail } from "@/utils/questionsUtil";
import { toast } from "react-toastify";
import Confetti from "react-confetti";

const QuestionDetail = () => {
  const [question, setQuestion] = useState(null);
  const [isSolutionCorrect, setIsSolutionCorrect] = useState(false);
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

  console.log("question", isSolutionCorrect);

  return (
    <>
      <div className="pt-28 md:pt-20 pb-24 relative w-full h-auto min-h-screen overflow-auto  question-details">
        <QuestionTop question={question} />
        <SplitPane
          split="vertical"
          minSize={200}
          maxSize={-200}
          defaultSize="50%"
          className="h-full"
        >
          <LeftPanel question={question} />
          <RightPanel
            question={question}
            isSolutionCorrect={isSolutionCorrect}
            setIsSolutionCorrect={setIsSolutionCorrect}
          />
        </SplitPane>
      </div>
      {isSolutionCorrect && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
        />
      )}
    </>
  );
};

export default QuestionDetail;
