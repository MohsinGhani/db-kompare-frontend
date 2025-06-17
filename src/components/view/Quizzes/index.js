"use client";
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Avatar } from "antd";
import { fetchQuizzes } from "@/utils/quizUtil";
import { getSingleCategory } from "@/utils/categoriesUtils";
import dayjs from "dayjs";
import { useRouter } from "nextjs-toploader/app";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { DIFFICULTY } from "@/utils/const";

const avatarColors = ["#f56a00", "#7265e6", "#00a2ae", "#ffbf00", "#1890ff"];
const S3_BASE_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

const Quizzes = () => {
  const { userDetails, isUserLoading } = useSelector((state) => state.auth);
  const user = userDetails?.data?.data;

  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  // 1) Load quizzes
  useEffect(() => {
    if (!user && isUserLoading) return;
    setLoading(true);
    const params = { status: "ACTIVE", ...(user ? { userId: user.id } : {}) };

    fetchQuizzes(params)
      .then((res) => {
        setQuizzes(res.data || []);
      })
      .catch(() => {
        toast.error("Failed to load quizzes");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  // 2) Whenever quizzes change, pull in any new category names
  useEffect(() => {
    const uniqueCatIds = Array.from(new Set(quizzes.map((q) => q.category)));
    const missingCatIds = uniqueCatIds.filter((id) => !categories[id]);

    if (missingCatIds.length === 0) return;

    (async () => {
      try {
        const fetched = await Promise.all(
          missingCatIds.map(async (id) => {
            const res = await getSingleCategory(id);
            return { id, name: res?.data?.name ?? "Unknown" };
          })
        );

        setCategories((prev) => ({
          ...prev,
          ...Object.fromEntries(fetched.map((c) => [c.id, c.name])),
        }));
      } catch (err) {
        console.error("Category fetch error", err);
      }
    })();
  }, [quizzes]);

  const handleStartQuiz = (quizId) => {
    if (!user) {
      router.push(`/signin?redirect=${encodeURIComponent("/certifications")}`);
    } else {
      router.push(`/quizzes/${quizId}`);
    }
  };

  if (!loading && quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px]">
        <h2 className="text-2xl font-bold mb-4">No Quizzes Available</h2>
        <p className="text-gray-600">Please check back later.</p>
      </div>
    );
  }

  return (
    <Row gutter={[24, 24]} className="flex justify-center">
      {loading
        ? Array.from({ length: 4 }).map((_, idx) => (
            <Col key={idx} xs={24} sm={12} md={8} lg={8} xl={5}>
              <div className="animate-pulse bg-white rounded-lg h-[500px]" />
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
              startDate,
              endDate,
              taken,
              quizNo,
              recentParticipants = [],
              otherParticipantsCount = 0,
              desiredQuestions = 0,
              image,
            } = quiz;

            const diffColor =
              difficulty === DIFFICULTY.EASY
                ? "text-green-600 bg-green-100"
                : difficulty === DIFFICULTY.MEDIUM ||
                  difficulty === DIFFICULTY.INTERMEDIATE
                ? "text-yellow-600 bg-yellow-100"
                : "text-red-600 bg-red-100";

            const quizImage = image
              ? `${S3_BASE_URL}/${image}`
              : `${S3_BASE_URL}/COMMON/db-kompare-banner.jpg`;
            const categoryName = categories[category] || "Loading...";

            return (
              <Col key={id} xs={24} sm={12} md={8} lg={8} xl={5}>
                <div className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full p-4">
                  {/* header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <img
                        className="w-16 object-contain"
                        src="/assets/icons/quizz.gif"
                        alt="quiz"
                      />
                      <p className="ml-2 font-semibold text-2xl">#{quizNo}</p>
                    </div>
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-md ${diffColor}`}
                    >
                      {difficulty}
                    </span>
                  </div>

                  {/* image */}
                  <div className="h-40 mb-4">
                    <img
                      className="w-full h-full object-cover rounded-lg border"
                      src={quizImage}
                      alt={name}
                    />
                  </div>

                  {/* body */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {name}
                      </h3>
                      <span className="inline-block text-sm mb-2 px-2 py-1 bg-[#EEF0FF] text-primary rounded-md">
                        {categoryName}
                      </span>
                      <p className="text-sm">
                        <b>Questions:</b> {desiredQuestions || totalQuestions}
                      </p>
                      <p className="text-sm">
                        <b>Passing %:</b> {passingPerc}%
                      </p>
                      <p className="text-sm mb-2">
                        <b>Deadline:</b>{" "}
                        {dayjs(endDate).format("dddd, MMM DD, YYYY")}
                      </p>
                      <div className="flex items-center text-sm">
                        <b>Participants:</b>
                        <Avatar.Group className="ml-2">
                          {recentParticipants.map((p, i) => {
                            const bg = avatarColors[i % avatarColors.length];
                            const initial = (p.user?.name ||
                              p.name ||
                              "U")[0].toUpperCase();
                            return (
                              <Avatar key={i} style={{ backgroundColor: bg }}>
                                {initial}
                              </Avatar>
                            );
                          })}
                        </Avatar.Group>
                        {otherParticipantsCount > 0 && (
                          <span className="ml-1">
                            +{otherParticipantsCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* footer */}
                    {taken ? (
                      <div className="mt-4 bg-[#F2FFF6] text-[#17A44B] font-semibold p-2 text-center rounded-md">
                        Successfully Completed !!
                      </div>
                    ) : (
                      <Button
                        type="primary"
                        className="mt-4 w-full"
                        disabled={
                          dayjs().isAfter(dayjs(endDate)) ||
                          dayjs().isBefore(dayjs(startDate))
                        }
                        onClick={() => handleStartQuiz(id)}
                      >
                        Start Quiz
                      </Button>
                    )}
                  </div>
                </div>
              </Col>
            );
          })}
    </Row>
  );
};

export default Quizzes;
