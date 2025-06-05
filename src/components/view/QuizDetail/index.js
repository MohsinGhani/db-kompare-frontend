"use client";

// Importing necessary components and libraries
import CommonLoader from "@/components/shared/CommonLoader";
import { createQuizSubmission } from "@/utils/quizUtil";
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Button, Progress, Radio, Checkbox } from "antd";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const S3_BASE_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

// Utility to shuffle an array
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const QuizDetail = ({ quiz }) => {
  // Get quizId from URL parameters
  const { id: quizId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Redux state
  const { userDetails, isUserLoading } = useSelector((state) => state.auth);
  const user = userDetails?.data?.data;

  // Local state
  const [quizData, setQuizData] = useState(null); // The entire quiz object
  const [questions, setQuestions] = useState([]); // Final, shuffled+reduced question objects
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // { questionId, selected: [...] }
  const [selectedOptionIds, setSelectedOptionIds] = useState([]); // For current question
  const [submitLoading, setSubmitLoading] = useState(false);

   // Where desiredQuestions is the number to keep (if present)
  const desiredQuestions = quiz?.desiredQuestions || 0;

  // Storage keys
  const storageKey = `quiz-${quizId}-user-${user?.id}`;
  const questionsKey = `quiz-${quizId}-questions-${user?.id}`;

  /**
   * Redirect to sign-in if user is not logged in.
   * Include current URL (with query) as redirect param.
   */
  useEffect(() => {
    if (!user && !isUserLoading) {
      const currentUrl =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      toast.error("You must be logged in to take a quiz.");
      router.replace(`/signin?redirect=${encodeURIComponent(currentUrl)}`);
    }
  }, [user, isUserLoading, pathname, searchParams, router]);

  /**
   * On mount (and whenever quiz or user changes):
   * 1) Initialize quizData
   * 2) Determine final question set:
   *    - If we've stored question IDs previously, restore that specific order+subset
   *    - Otherwise: shuffle all quiz.questions, slice off `decreaseCount` items, store that array of IDs
   * 3) Restore saved answers and index if available
   */
  useEffect(() => {
    if (!quiz || !user) return;

    setQuizData(quiz);

    // Try to restore question IDs array from localStorage
    const savedQuestionIdsRaw = localStorage.getItem(questionsKey);
    let finalQuestionIds = null;

    if (savedQuestionIdsRaw) {
      try {
        finalQuestionIds = JSON.parse(savedQuestionIdsRaw);
      } catch {
        finalQuestionIds = null;
      }
    }

    if (finalQuestionIds && Array.isArray(finalQuestionIds)) {
      // Reconstruct question objects in the saved order
      const restoredQuestions = finalQuestionIds
        .map((qid) => quiz.questions.find((q) => q.id === qid))
        // Filter out any missing ones (just in case)
        .filter(Boolean);
      setQuestions(restoredQuestions);
    } else {
      // No saved question IDs → shuffle & slice
      const allShuffled = shuffleArray(quiz.questions);
      const totalCount = quiz.questions.length;
      const numToTake =
        desiredQuestions > 0
          ? Math.min(desiredQuestions, totalCount)
          : totalCount;
      const sliced = allShuffled.slice(0, numToTake);
      setQuestions(sliced);

      // Store the final question IDs for future restores
      const slicedIds = sliced.map((q) => q.id);
      localStorage.setItem(questionsKey, JSON.stringify(slicedIds));
    }

    // Next, restore answers & index from localStorage if present
    const savedRaw = localStorage.getItem(storageKey);
    if (savedRaw) {
      try {
        const { answers, index } = JSON.parse(savedRaw);
        setUserAnswers(answers);
        setCurrentIndex(index);

        // Restore selected options for the resumed question
        const resumedAnswer = answers.find(
          (a) => a.questionId === questions[index]?.id
        );
        setSelectedOptionIds(resumedAnswer?.selected || []);
      } catch {
        // If parsing fails, start fresh
        setUserAnswers([]);
        setCurrentIndex(0);
        setSelectedOptionIds([]);
      }
    }
  }, [quiz, user]);

  /**
   * Persist answers and current question index to localStorage on any change
   */
  useEffect(() => {
    if (quizData) {
      const payload = { answers: userAnswers, index: currentIndex };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    }
  }, [userAnswers, currentIndex, quizData]);

  // Show loader while initializing
  if (!quizData || (isUserLoading && !user) || questions.length === 0) {
    return (
      <div className="h-screen">
        <CommonLoader />
      </div>
    );
  }

  // Current question
  const question = questions[currentIndex];
  const isMultiple = question.isMultipleAnswer;
  const maxSelect = question.correctCount;

  /**
   * Handle option selection click
   */
  const handleOptionChange = (id) => {
    if (isMultiple) {
      if (selectedOptionIds.includes(id)) {
        setSelectedOptionIds((prev) => prev.filter((x) => x !== id));
      } else if (selectedOptionIds.length < maxSelect) {
        setSelectedOptionIds((prev) => [...prev, id]);
      } else {
        toast.info(
          `You can select up to ${maxSelect} option${
            maxSelect > 1 ? "s" : ""
          } for this question.`
        );
      }
    } else {
      setSelectedOptionIds([id]);
    }
  };

  /**
   * Save the current question's answer into userAnswers
   */
  const saveAnswer = () => {
    const updated = userAnswers.filter((a) => a.questionId !== question.id);
    updated.push({ questionId: question.id, selected: selectedOptionIds });
    setUserAnswers(updated);
    return updated;
  };

  /**
   * Navigate to the next question or submit if on last
   */
  const goNext = () => {
    const updatedAnswers = saveAnswer();

    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      // Restore any previously saved selection for that question
      const nextSaved = updatedAnswers.find(
        (a) => a.questionId === questions[nextIdx].id
      );
      setSelectedOptionIds(nextSaved?.selected || []);
    } else {
      submitQuiz(updatedAnswers);
    }
  };

  /**
   * Navigate to the previous question, saving current answer first
   */
  const goPrevious = () => {
    if (currentIndex > 0) {
      const updatedAnswers = saveAnswer();
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);

      // Restore selection for the previous question
      const prevSaved = updatedAnswers.find(
        (a) => a.questionId === questions[prevIdx].id
      );
      setSelectedOptionIds(prevSaved?.selected || []);
    }
  };

  /**
   * Submit the quiz
   */
  const submitQuiz = async (updatedAnswersArg) => {
    setSubmitLoading(true);
    const finalAnswers = updatedAnswersArg || saveAnswer();

    const payload = {
      quizId,
      userId: user.id,
      answers: finalAnswers.map(({ questionId, selected }) => ({
        questionId,
        selectedOptionIds: selected,
      })),
    };

    try {
      const response = await createQuizSubmission(payload);
      if (response?.data) {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(questionsKey);
        toast.success("Quiz completed! Redirecting to results…");
        router.replace(`/quizzes/result/${response.data.submissionId}`);
      }
    } catch (err) {
      toast.error(err.message || "Failed to submit quiz. Please try again.");
      setSubmitLoading(false);
    }
  };

  // Progress indicator
  const progressPercent = Math.round(
    ((currentIndex + 1) / questions.length) * 100
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
        <div className="flex items-center gap-1 !text-[#777777]">
          <LockOutlined />
          <p>Certificate</p>
        </div>
      </div>

      {/* Question display section */}
      <div className="container flex justify-center items-center min-h-[90vh] h-full overflow-auto py-6 flex-col">
        <h1 className="text-3xl font-bold text-left pointer-events-none select-none">
          Q{currentIndex + 1}. {question.question}
        </h1>

        {question?.image && (
          <img
            src={`${S3_BASE_URL}/QUIZZES/${question.image}`}
            className="rounded-lg h-[200px] w-full object-contain mt-4"
            alt={`Question ${currentIndex + 1} image`}
          />
        )}

        {isMultiple && (
          <p className="text-primary font-semibold italic text-sm text-left mt-2 ">
            <InfoCircleOutlined /> Select up to {maxSelect} answers
          </p>
        )}

        <div className="flex flex-col items-center justify-center mt-8 max-w-[50%] w-full">
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
              disabled={selectedOptionIds.length === 0 || submitLoading}
              loading={submitLoading}
            >
              {currentIndex < questions.length - 1 ? "Next" : "Submit"}
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
