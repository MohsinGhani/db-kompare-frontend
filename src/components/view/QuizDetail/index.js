"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Progress, Radio, Checkbox } from "antd";
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  LockOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import CommonLoader from "@/components/shared/CommonLoader";
import { createQuizSubmission } from "@/utils/quizUtil";
import {
  fetchQuizProgress,
  createQuizProgress,
  updateQuizProgress,
} from "@/utils/quizUtil";

const S3_BASE_URL = process.env.NEXT_PUBLIC_BUCKET_URL;
const DEFAULT_TIME_LIMIT_SEC = 30 * 60; // 30 minutes

/** Shuffle array in-place */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Format seconds as MM:SS */
function formatTime(sec) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function QuizDetail({ quiz }) {
  const { id: quizId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails, isUserLoading } = useSelector((s) => s.auth);
  const user = userDetails?.data?.data;

  // State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // { questionId, selected: [] }[]
  const [selectedIds, setSelectedIds] = useState([]);
  const [remainingTime, setRemainingTime] = useState(DEFAULT_TIME_LIMIT_SEC);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for intervals & latest progress
  const timerRef = useRef(null);
  const progressRef = useRef({
    questionIds: [],
    currentIndex: 0,
    remainingTimeSec: 0,
    answersMap: {},
  });

  // ——————————————————————————————
  // 1) Redirect unauthenticated users
  // ——————————————————————————————
  useEffect(() => {
    if (!user && !isUserLoading) {
      const redirectTo =
        pathname + (searchParams?.toString() ? `?${searchParams}` : "");
      toast.error("Please sign in to take the quiz.");
      router.replace(`/signin?redirect=${encodeURIComponent(redirectTo)}`);
    }
  }, [user, isUserLoading, pathname, searchParams, router]);

  // ——————————————————————————————
  // 2) Initialize or fetch progress
  // ——————————————————————————————
  useEffect(() => {
    if (!quiz || !user) return;

    async function initProgress() {
      const baseLimit = quiz.timeLimit ?? DEFAULT_TIME_LIMIT_SEC;
      const resp = await fetchQuizProgress({ userId: user.id, quizId });
      const prog = resp?.data;

      if (prog) {
        // Restore from backend
        const restored = prog.questionIds
          .map((qid) => quiz.questions.find((q) => q.id === qid))
          .filter(Boolean);
        setQuestions(restored);
        setCurrentIndex(prog.currentIndex);
        setRemainingTime(prog.remainingTimeSec);
        setAnswers(
          Object.entries(prog.answersMap).map(([id, sel]) => ({
            questionId: id,
            selected: sel,
          }))
        );
        setSelectedIds(prog.answersMap[restored[prog.currentIndex]?.id] ?? []);
      } else {
        // First-time: shuffle & slice
        const allQs = shuffle(quiz.questions);
        const count = quiz.desiredQuestions
          ? Math.min(quiz.desiredQuestions, allQs.length)
          : allQs.length;
        const sliced = allQs.slice(0, count);

        setQuestions(sliced);
        setRemainingTime(baseLimit);

        await createQuizProgress({
          userId: user.id,
          quizId,
          questionIds: sliced.map((q) => q.id),
          currentIndex: 0,
          remainingTimeSec: baseLimit,
          answersMap: {},
          startedAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
        });
      }

      setIsLoading(false);
    }

    initProgress();
  }, [quiz, user, quizId]);

  // ——————————————————————————————
  // 3) Keep a ref of latest progress
  // ——————————————————————————————
  useEffect(() => {
    progressRef.current = {
      questionIds: questions.map((q) => q.id),
      currentIndex,
      remainingTimeSec: remainingTime,
      answersMap: answers.reduce((m, a) => {
        m[a.questionId] = a.selected;
        return m;
      }, {}),
    };
  }, [questions, currentIndex, remainingTime, answers]);

  // ——————————————————————————————
  // 4) Auto-save every 2 minutes + on unmount
  // ——————————————————————————————
  useEffect(() => {
    if (isLoading) return;

    const saveNow = () => {
      updateQuizProgress({
        userId: user.id,
        quizId,
        ...progressRef.current,
        lastUpdatedAt: new Date().toISOString(),
      });
    };

    const id = setInterval(saveNow, 2 * 60 * 1000);
    return () => {
      clearInterval(id);
      saveNow();
    };
  }, [isLoading, user, quizId]);

  // ——————————————————————————————
  // 5) Countdown timer
  // ——————————————————————————————
  useEffect(() => {
    if (isLoading) return;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemainingTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          toast.info("Time is up! Submitting...");
          handleSubmit(answers);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isLoading, questions]);

  // ——————————————————————————————
  // Handlers
  // ——————————————————————————————
  const handleSelect = useCallback(
    (optionId) => {
      const current = questions[currentIndex];
      const isMulti = current.isMultipleAnswer;
      const max = current.correctCount;

      setSelectedIds((prev) => {
        if (isMulti) {
          if (prev.includes(optionId)) {
            return prev.filter((x) => x !== optionId);
          }
          if (prev.length < max) {
            return [...prev, optionId];
          }
          toast.info(`Up to ${max} selections allowed.`);
          return prev;
        }
        return [optionId];
      });
    },
    [questions, currentIndex]
  );

  const saveCurrentAnswer = () => {
    setAnswers((prev) => {
      const filtered = prev.filter(
        (a) => a.questionId !== questions[currentIndex].id
      );
      return [
        ...filtered,
        { questionId: questions[currentIndex].id, selected: selectedIds },
      ];
    });
  };

  const goNext = () => {
    saveCurrentAnswer();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      const nextId = questions[currentIndex + 1].id;
      setSelectedIds(
        answers.find((a) => a.questionId === nextId)?.selected || []
      );
    } else {
      handleSubmit(answers);
    }
  };

  const goPrev = () => {
    if (currentIndex === 0) return;
    saveCurrentAnswer();
    setCurrentIndex((i) => i - 1);
    const prevId = questions[currentIndex - 1].id;
    setSelectedIds(
      answers.find((a) => a.questionId === prevId)?.selected || []
    );
  };

  const handleSubmit = async (answersArr) => {
    setIsSubmitting(true);
    const payload = {
      quizId,
      userId: user.id,
      answers: answersArr.map(({ questionId, selected }) => ({
        questionId,
        selectedOptionIds: selected,
      })),
    };

    try {
      const { data } = await createQuizSubmission(payload);
      toast.success("Completed! Redirecting to results…");
      router.replace(`/quizzes/result/${data.submissionId}`);
    } catch (err) {
      toast.error(err.message || "Submission failed.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <CommonLoader />;

  const question = questions[currentIndex];
  const percent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="pt-8 min-h-screen">
      {/* Top navigation and progress bar */}
      <div className="flex items-center gap-1 justify-between container">
        <div
          className="flex items-center text-sm md:text-base md:gap-2 cursor-pointer"
          onClick={() => window.history.back()}
        >
          <ArrowLeftOutlined />
          <p className="font-semibold">Back</p>
        </div>
        <div className="w-[80%]">
          <Progress
            size={["100%", 10]}
            percent={percent}
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

      {/* Remaining Timer section */}
      <div className="container flex justify-between items-center w-full mt-12">
        <p className="font-semibold text-lg">
          {currentIndex + 1} of {questions?.length}{" "}
        </p>
        <div className=" flex flex-col justify-center items-center ">
          <ClockCircleOutlined className="text-4xl !text-primary" />
          Remaining Time: {formatTime(remainingTime)}
        </div>
      </div>


      {/* Question display section */}
      <div className="container flex justify-center items-center min-h-[calc(90vh-150px)] h-full overflow-auto py-6 flex-col">
        <h1 className="text-base md:text-2xl lg:text-3xl font-bold text-left pointer-events-none select-none">
          Q{currentIndex + 1}. {question.question}
        </h1>

        {question?.image && (
          <img
            src={`${S3_BASE_URL}/QUIZZES/${question.image}`}
            className="rounded-lg h-[200px] w-full object-contain mt-4"
            alt={`Question ${currentIndex + 1} image`}
          />
        )}

        {question?.isMultipleAnswer && (
          <p className="text-primary font-semibold italic text-sm text-left mt-2 ">
            <InfoCircleOutlined /> Select up to {question.correctCount} answers
          </p>
        )}

        <div className="flex flex-col items-center justify-center mt-4 md:mt-8  md:max-w-[50%] w-full">
          {question?.options.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            return (
              <div
                key={option?.id}
                className={`w-full p-3 md:p-4 rounded-md mt-4 flex items-center gap-2 cursor-pointer border ${
                  isSelected ? "border-2 border-primary" : "border-transparent"
                } bg-[#F4F5FF]`}
                onClick={() => handleSelect(option?.id)}
              >
                {question?.isMultipleAnswer ? (
                  <Checkbox checked={isSelected} className="!text-[#FFC800]" />
                ) : (
                  <Radio
                    checked={isSelected}
                    className="!text-[#FFC800] !border-primary !bg-[#F4F5FF]"
                  />
                )}
                <p className="text-sm md:text-lg font-semibold">{option?.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation buttons and info footer */}
      <div className="sticky bottom-0 w-full bg-[#F4F5FF] h-[100px] md:h-[80px] flex items-center justify-center">
        <div className="container flex justify-between items-center gap-3 md:gap-0 flex-wrap-reverse md:flex-nowrap">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="w-1/2 md:w-max rounded-md"
            >
              Previous
            </Button>
            <Button
              onClick={goNext}
              type="primary"
              className="w-1/2 md:w-max  rounded-md"
              disabled={selectedIds.length === 0 || isSubmitting}
              loading={isSubmitting}
            >
              {currentIndex < questions.length - 1 ? "Next" : "Submit"}
            </Button>
          </div>
          <div className="flex items-center md:text-base text-xs gap-1 font-semibold">
            <InfoCircleOutlined />
            <p>Score minimum {quiz.passingPerc}% to get certification</p>
          </div>
        </div>
      </div>
    </div>
  );
}
