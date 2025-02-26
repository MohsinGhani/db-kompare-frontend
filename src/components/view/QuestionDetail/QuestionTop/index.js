import {
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";
import React from "react";
import Timer from "./Timer";

const QuestionTop = ({ question }) => {
  return (
    <div className="h-[69px] bg-[#FFF6F1] w-full  2xl:px-20 lg:pl-6 px-3 flex justify-between items-center">
      <Link href={"/questions"} className="flex items-center gap-2 font-medium">
        <ArrowLeftOutlined />
        Back To Questions
      </Link>
      <div className="flex items-center gap-2">
        <Button
          type="primary"
          className="!bg-white !w-10 h-10 !shadow-none !border-gray-200 hover:!border-gray-200"
          icon={<LeftOutlined className="text-black" />}
        />
        <div className="border w-[400px] p-2 h-10 rounded-md bg-white">
          <p className="text-center text-[#191A15CC] font-normal">
            <span className="font-semibold bg-primary rounded-sm inline-block px-2 text-white mr-1">
              #{question?.questionNo}
            </span>{" "}
            {question?.shortTitle}
          </p>
        </div>
        <Button
          type="primary"
          className="!bg-white !w-10 h-10  !shadow-none !border-gray-200 hover:!border-gray-200"
          icon={<RightOutlined className="text-black" />}
        />
      </div>
      <div>
        <Timer />
      </div>
    </div>
  );
};

export default QuestionTop;
