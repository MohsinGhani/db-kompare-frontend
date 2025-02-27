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
import CommonLoader from "@/components/shared/CommonLoader";
import { useSelector } from "react-redux";

const QuestionDetail = () => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSolutionCorrect, setIsSolutionCorrect] = useState(false);
  const [time, setTime] = useState(0);
  const { userDetails } = useSelector((state) => state.auth);
  const { id } = useParams();

  // Fetching Question
  useEffect(() => {
    if (id) {
      const getQuestionData = async () => {
        try {
          setLoading(true);
          const data = await fetchQuestionDetail(id);
          setQuestion(data?.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          toast.error(error?.message || "Failed to fetch question detail");
        }
      };
      getQuestionData();
    }
  }, [id]);

  if (loading) return <CommonLoader />;

  return (
    <>
      <div className="pt-28 md:pt-20 pb-24 relative w-full h-auto min-h-screen overflow-auto  question-details">
        <QuestionTop question={question} time={time} setTime={setTime} />
        <SplitPane
          split="vertical"
          minSize={200}
          maxSize={-200}
          defaultSize="50%"
          className="h-full"
        >
          <LeftPanel question={question} user={userDetails?.data?.data} />
          <RightPanel
            question={question}
            isSolutionCorrect={isSolutionCorrect}
            setIsSolutionCorrect={setIsSolutionCorrect}
            user={userDetails?.data?.data}
            timer={time}
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
