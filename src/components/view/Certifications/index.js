"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "antd";
import { fetchQuizzes } from "@/utils/quizUtil";
import dayjs from "dayjs";
import { useRouter } from "nextjs-toploader/app";
import Quizzes from "../Quizzes";

const Certifications = () => {
  return(
     <div className="w-full 2xl:px-20 lg:px-6 px-4 py-24 bg-gray-50">
      <p className="text-5xl font-semibold text-gray-800 italic text-center mb-12">
        Get Free{" "}
        <span className="text-orange-500 font-bold">Certifications</span>
      </p>
      <Quizzes/>
      </div>
  )
}
export default Certifications;
