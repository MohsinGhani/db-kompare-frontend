"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "antd";
import { fetchQuizzes } from "@/utils/quizUtil";
import dayjs from "dayjs";
import { useRouter } from "nextjs-toploader/app";

const Certifications = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes({ status: "ACTIVE" })
      .then((res) => {
        setQuizzes(res.data || []);
      })
      .catch(() => {
        // Optional: handle error notification
      })
      .finally(() => setLoading(false));
  }, []);

  // Compute remaining time text
  const getRemaining = (startDate, endDate) => {
    // Compare dates at start of day to count full days remaining
    const today = dayjs().startOf("day");
    const end = dayjs(endDate).startOf("day");
    const diffDays = end.diff(today, "day");
    if (diffDays > 1) return `${diffDays} days left`;
    if (diffDays === 1) return `1 day left`;
    // If less than a day, show hours remaining from now
    const diffHours = end.diff(dayjs(), "hour");
    if (diffHours > 1) return `${diffHours} hours left`;
    if (diffHours === 1) return `1 hour left`;
    return "Expiring soon";
  };

  return (
    <div className="w-full 2xl:px-20 lg:px-6 px-4 py-24 bg-gray-50">
      <p className="text-5xl font-semibold text-gray-800 italic text-center mb-12">
        Get Free{" "}
        <span className="text-orange-500 font-bold">Certifications</span>
      </p>

      <Row gutter={[24, 24]} className="flex justify-center">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Col xs={24} sm={12} md={8} lg={6} key={idx}>
                <div className="animate-pulse bg-white rounded-lg h-80" />
              </Col>
            ))
          : quizzes.map((quiz) => {
              const {
                id,
                name,
                category,
                difficulty,
                totalQuestions,
                passingPerc,
                endDate,
                startDate,
              } = quiz;

              // Difficulty color
              const diffColor =
                difficulty === "BASIC"
                  ? "text-green-600 bg-green-100"
                  : difficulty === "INTERMEDIATE"
                  ? "text-yellow-600 bg-yellow-100"
                  : "text-red-600 bg-red-100";

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={id}>
                  <div className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                    <img
                      className="w-full h-40 object-contain rounded-t-lg"
                      alt={name}
                      src={`/assets/icons/quiz.gif`}
                    />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                          {name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                            {category}
                          </span>
                          <span
                            className={`text-sm font-semibold px-2 py-1 rounded-md ${diffColor}`}
                          >
                            {difficulty}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">
                          <span className="font-semibold">
                            Number of Questions:
                          </span>{" "}
                          {totalQuestions}
                        </p>
                        <p className="text-gray-700 text-sm mb-2">
                          <span className="font-semibold">Pass Rate:</span>{" "}
                          {passingPerc}%
                        </p>
                        <p className="text-gray-700 text-sm">
                          <span className="font-semibold">Time Left:</span>{" "}
                          <span className="text-orange-500 font-semibold">
                            {getRemaining(startDate, endDate)}
                          </span>
                        </p>
                      </div>
                      <Button
                        type="primary"
                        disabled={
                          dayjs().isAfter(dayjs(endDate)) ||
                          dayjs().isBefore(dayjs(startDate))
                        }
                        onClick={() => router.push(`/quizzes/${id}`)}
                        className="mt-6 bg-primary hover:!bg-primary text-white hover:!text-white h font-semibold !py-2 rounded-lg transition-colors duration-200"
                      >
                        Start Quiz
                      </Button>
                      {/* <button
                        onClick={() => router.push(`/quizzes/${id}`)}
                        className="mt-6 bg-orange-500 hover:!bg-orange-600 text-white hover:!text-white h font-semibold !py-2 rounded-lg transition-colors duration-200"
                      >
                        Start Quiz
                      </button> */}
                    </div>
                  </div>
                </Col>
              );
            })}
      </Row>
    </div>
  );
};

export default Certifications;
