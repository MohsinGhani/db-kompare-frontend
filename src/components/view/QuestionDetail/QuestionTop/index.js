import {
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Popover } from "antd";
import Link from "next/link";
import React from "react";
import Timer from "./Timer";
import { DIFFICULTY } from "@/utils/const";
import { useRouter } from "nextjs-toploader/app";

const QuestionTop = ({ question, time, setTime }) => {
  const router = useRouter();
  const { prevQuestion, nextQuestion } = question || {};

  const renderPopoverContent = (q) => (
    <>
      <p className="text-gray-500 -mt-2">{q?.shortTitle}</p>
      <p
        className={`${
          q?.difficulty === DIFFICULTY.EASY
            ? "text-green-600"
            : q?.difficulty === DIFFICULTY.MEDIUM
            ? "text-orange-600"
            : "text-red-600"
        } text-sm font-semibold`}
      >
        {q?.difficulty}
      </p>
    </>
  );

  const handleNavigation = (targetId) => {
    if (targetId) {
      router.push(`/questions/${targetId}`);
    }
  };

  return (
    <div className="h-[69px] bg-[#FFF6F1] w-full 2xl:px-20 lg:pl-6 px-3 flex justify-between items-center">
      <Link href="/questions" className="flex items-center gap-2 font-medium">
        <ArrowLeftOutlined />
        Back To Questions
      </Link>
      <div className="flex items-center gap-2">
        {prevQuestion ? (
          <Popover
            content={renderPopoverContent(prevQuestion)}
            placement="bottom"
            title={`#${prevQuestion.questionNo} Previous question`}
          >
            <Button
              onClick={() => handleNavigation(prevQuestion.id)}
              type="primary"
              className="!bg-white !w-10 h-10 !shadow-none !border-gray-200 hover:!border-gray-200"
              icon={<LeftOutlined className="text-black" />}
            />
          </Popover>
        ) : (
          <Button
            disabled
            type="primary"
            className="!bg-white !w-10 h-10 !shadow-none   hover:!border-gray-200 !border-gray-200"
            icon={<LeftOutlined className="text-gray-200" />}
          />
        )}

        <div className="border w-[400px] p-2 h-10 rounded-md bg-white">
          <p className="text-center text-[#191A15CC] font-normal">
            <span className="font-semibold bg-primary rounded-sm inline-block px-2 text-white mr-1">
              #{question?.questionNo}
            </span>{" "}
            {question?.shortTitle}
          </p>
        </div>

        {nextQuestion ? (
          <Popover
            content={renderPopoverContent(nextQuestion)}
            placement="bottom"
            title={`#${nextQuestion.questionNo} Next question`}
          >
            <Button
              onClick={() => handleNavigation(nextQuestion.id)}
              type="primary"
              className="!bg-white !w-10 h-10 !shadow-none !border-gray-200 hover:!border-gray-200"
              icon={<RightOutlined className="text-black" />}
            />
          </Popover>
        ) : (
          <Button
            disabled
            type="primary"
            className="!bg-white !w-10 h-10 !shadow-none !border-gray-200 hover:!border-gray-200"
            icon={<RightOutlined className="text-gray-200" />}
          />
        )}
      </div>
      <div>
        <Timer time={time} setTime={setTime} />
      </div>
    </div>
  );
};

export default QuestionTop;
