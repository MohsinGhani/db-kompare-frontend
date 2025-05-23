"use client";

// Importing necessary components and libraries
import CommonLoader from "@/components/shared/CommonLoader";
import { createQuizSubmission, fetchQuizById } from "@/utils/quizUtil";
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Button, Progress, Radio, Checkbox } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "nextjs-toploader/app";
const S3_BASE_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

const QuizDetail = () => {
  // Get quizId from URL parameters
  const { id: quizId } = useParams();
  const router = useRouter();
  // Local state
  const [quizData, setQuizData] = useState(null); // Stores fetched quiz data
  const [loading, setLoading] = useState(false); // Indicates loading state

  const [currentIndex, setCurrentIndex] = useState(0); // Index of current question
  const [userAnswers, setUserAnswers] = useState([]); // Array of saved answers
  const [selectedOptionIds, setSelectedOptionIds] = useState([]); // Currently selected options
  const userDetails = useSelector((state) => state.auth.userDetails);
  const user = userDetails?.data?.data;

  const storageKey = `quiz-${quizId}-user-${user?.id}`; // Key for saving to localStorage

  // Fetch quiz data and restore saved progress on mount
  useEffect(() => {
    if (quizId) {
      setLoading(true);
      fetchQuizById(quizId)
        .then((res) => {
          const data = res.data;
          setQuizData(data);

          // Restore saved answers and index if available
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            const { answers, index } = JSON.parse(saved);
            setUserAnswers(answers);
            setCurrentIndex(index);

            // Restore selected options for the resumed question
            const restored = answers.find(
              (a) => a.questionId === data.questions[index].id
            );
            setSelectedOptionIds(restored?.selected || []);
          }
        })
        .catch(() => toast.error("Failed to load quiz data"))
        .finally(() => setLoading(false));
    }
  }, [quizId]);

  // Persist answers and current question index to localStorage on any change
  useEffect(() => {
    if (quizData) {
      const payload = { answers: userAnswers, index: currentIndex };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    }
  }, [userAnswers, currentIndex, quizData]);

  // Show loader while fetching data
  if (loading || !quizData) {
    return (
      <div className="h-screen">
        <CommonLoader />
      </div>
    );
  }

  // Extract current question and its properties
  const question = quizData.questions[currentIndex];
  const isMultiple = question.isMultipleAnswer; // Allows multiple selections
  const maxSelect = question.correctCount; // Max number of selectable options

  /**
   * Handle option selection click
   * - For multiple-answer questions, enforce maxSelect
   * - For single-answer, replace selection
   */
  const handleOptionChange = (id) => {
    if (isMultiple) {
      if (selectedOptionIds.includes(id)) {
        // Deselect option
        setSelectedOptionIds((prev) => prev.filter((x) => x !== id));
      } else if (selectedOptionIds.length < maxSelect) {
        // Select option if under limit
        setSelectedOptionIds((prev) => [...prev, id]);
      } else {
        // Notify user when exceeding limit
        toast.info(
          `You can select up to ${maxSelect} options for this question.`
        );
      }
    } else {
      // Single-choice selection
      setSelectedOptionIds([id]);
    }
  };

  /**
   * Save the current question's answer into userAnswers array
   */
  const saveAnswer = () => {
  const updated = userAnswers.filter((a) => a.questionId !== question.id);
  updated.push({ questionId: question.id, selected: selectedOptionIds });
  setUserAnswers(updated);
  return updated; // Return the updated answers
};



  /**
   * Move to the next question or finish quiz
   */
  const goNext = () => {
    saveAnswer();

    if (currentIndex < quizData.questions.length - 1) {
      // Advance to next question
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      //  look in userAnswers to see if the user had already answered that next question
      const nextAns = [
        ...userAnswers.filter((a) => a.questionId !== question.id),
        { questionId: question.id, selected: selectedOptionIds },
      ].find((a) => a.questionId === quizData.questions[nextIdx].id);

      setSelectedOptionIds(nextAns?.selected || []);
    } else {
      submitQuiz();
    }
  };

  /**
   * Move to the previous question while saving current answer
   */
  const goPrevious = () => {
    if (currentIndex > 0) {
      saveAnswer();
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);

      // Restore selection on previous question
      const prevAns = userAnswers.find(
        (a) => a.questionId === quizData.questions[prevIdx].id
      );
      setSelectedOptionIds(prevAns?.selected || []);
    }
  };

  const submitQuiz = async () => {
     const updatedAnswers = saveAnswer(); // Get the updated answers
  
  const payload = {
    quizId,
    userId: user?.id,
    answers: updatedAnswers.map(({ questionId, selected }) => ({
      questionId,
      selectedOptionIds: selected,
    })),
  };
    try {
      // Replace this with your real API endpoint
      const response = await createQuizSubmission(payload);
      if (response?.data) {
        router.push(`/quizzes/result/${response.data.submissionId}`);
      }
      localStorage.removeItem(storageKey);
      toast.success("Quiz completed! See your results below.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Calculate progress percentage
  const progressPercent = Math.round(
    ((currentIndex + 1) / quizData.questions.length) * 100
  );

  return (
    <div className="pt-8 min-h-screen">
      {/* Top navigation and progress bar */}
      <div className="flex items-center gap-1 justify-between container">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.history.back()}
        >
          <ArrowLeftOutlined />
          <p className="font-semibold">Back to menu</p>
        </div>
        <div className="w-[80%]">
          <Progress
            size={["100%", 10]}
            percent={progressPercent}
            showInfo={true}
            strokeColor="#FFC800"
            className="!w-full"
          />
        </div>
        <div className="flex items-center gap-1 !text-[#777777] ">
          <LockOutlined />
          <p>Certificate</p>
        </div>
      </div>

      {/* Question display section */}
      <div className="container flex justify-center items-center min-h-[90vh]  h-full overflow-auto py-6 flex-col">
        <h1 className="text-3xl font-bold text-left">
          Q{currentIndex + 1}. {question.question}
        </h1>
        {question?.image && (
          <img
            src={`${S3_BASE_URL}/QUIZZES/${question.image}`}
            className="rounded-lg h-[200px] w-full object-contain mt-4"
          />
        )}
        {isMultiple && (
          <p className="text-primary font-semibold italic text-sm text-left mt-2">
            <InfoCircleOutlined /> Select up to {maxSelect} answers
          </p>
        )}
        <div className="flex flex-col items-center justify-center mt-8 max-w-[50%] w-full ">
          {question.options.map((option) => {
            const isSelected = selectedOptionIds.includes(option.id);
            return (
              <div
                key={option.id}
                className={`w-full p-4 rounded-md mt-4 flex items-center gap-2 cursor-pointer border ${
                  isSelected ? "border-2 border-primary" : "border-transparent"
                } bg-[#F4F5FF]`}
                onClick={() => handleOptionChange(option.id)}
              >
                {isMultiple ? (
                  <Checkbox checked={isSelected} className="!text-[#FFC800]" />
                ) : (
                  <Radio
                    checked={isSelected}
                    className="!text-[#FFC800] !border-primary !bg-[#F4F5FF]"
                  />
                )}
                <p className="text-lg font-semibold">{option.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation buttons and info footer */}
      <div className="sticky bottom-0 w-full bg-[#F4F5FF] h-[80px] flex items-center justify-center">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              onClick={goPrevious}
              disabled={currentIndex === 0}
              className="rounded-md"
            >
              Previous
            </Button>
            <Button
              onClick={goNext}
              type="primary"
              className="rounded-md"
              disabled={selectedOptionIds.length === 0}
            >
              {currentIndex < quizData.questions.length - 1 ? "Next" : "Submit"}
            </Button>
          </div>
          <div className="flex items-center gap-1 font-semibold">
            <InfoCircleOutlined />
            <p>Score minimum {quizData.passingPerc}% to get certification</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;
