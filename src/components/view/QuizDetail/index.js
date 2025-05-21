"use client";

import CommonLoader from "@/components/shared/CommonLoader";
import { fetchQuizById } from "@/utils/quizUtil";
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Button, Progress, Radio } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const QuizDetail = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchQuizById(id)
        .then((res) => {
          setQuizData(res.data);
        })
        .catch(() => {
          toast.error("Failed to load quiz data");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !quizData) {
    <div className="h-screen">
      <CommonLoader />
    </div>;
  }
  return (
    <div className="pt-8">
      {/*--------- TOP SECTION -------------*/}
      <div className="flex items-center gap-1 justify-between container">
        <div className="flex items-center gap-2 cursor-pointer">
          <ArrowLeftOutlined />
          <p className="font-semibold">Back to menu</p>
        </div>
        <div className="w-[80%]">
          <Progress
            size={["100%", 10]}
            percent={30}
            showInfo={false}
            strokeColor="#FFC800"
          />
        </div>
        <div className="flex items-center gap-1 !text-[#777777] ">
          <LockOutlined />
          <p>Certificate</p>
        </div>
      </div>

      {/*--------- QUIZ DETAIL SECTION -------------*/}
      <div className="container flex justify-center items-center h-[calc(100vh-100px)] flex-col">
        <h1 className="text-3xl font-bold text-left">
          Q1. {quizData?.questions[0]?.question}
        </h1>
        <div className="flex flex-col items-center justify-center mt-8 max-w-[50%] w-full ">
          {quizData?.questions[0]?.options?.map((option, index) => (
            <div
              key={option?.id}
              className="bg-[#F4F5FF] w-full p-4 rounded-md mt-4 flex items-center gap-2"
            >
              <Radio className="!text-[#FFC800] !border-[#FFC800] !bg-[#F4F5FF]" />
              <p className="text-lg font-semibold">{option?.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/*--------- BOTTOM SECTION -------------*/}
      <div className="absolute bottom-0 w-full bg-[#F4F5FF] h-[80px] flex items-center justify-center">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-1 font-semibold">
            <InfoCircleOutlined />
            <p>Score minimum {quizData?.passingPerc}% to get certification</p>
          </div>
          <Button type="primary" className="rounded-md">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;
