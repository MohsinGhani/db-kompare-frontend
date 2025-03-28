"use client";
import React, { useEffect, useState } from "react";
import Split from "react-split";
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

  useEffect(() => {
    if (isSolutionCorrect) {
      setTimeout(() => {
        setIsSolutionCorrect(false);
      }, 5000);
    }
  }, [isSolutionCorrect]);

  if (loading) return <CommonLoader />;

  return (
    <>
      <div className="pt-20  relative w-full h-auto min-h-screen overflow-auto  question-details">
        <QuestionTop question={question} time={time} setTime={setTime} />
        <Split
          sizes={[50, 50]} // Initial split sizes (50% each)
          minSize={400} // Minimum width for each panel
          expandToMin={false} // Do not expand to minimum size automatically
          gutterSize={5} // Width of the divider
          gutterAlign="center" // Center the gutter between panels
          snapOffset={30} // Distance at which panels snap to minimum size
          dragInterval={1} // Drag in increments of 1 pixel
          direction="horizontal" // Split horizontally (side-by-side)
          cursor="col-resize" // Cursor style when hovering over the gutter
          className="!h-screen !flex"
        >
          <LeftPanel question={question} user={userDetails?.data?.data} />
          <RightPanel
            question={question}
            isSolutionCorrect={isSolutionCorrect}
            setIsSolutionCorrect={setIsSolutionCorrect}
            user={userDetails?.data?.data}
            time={time}
          />
        </Split>
      </div>

      {/* Display Confetti on correct solution */}
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
