"use client";
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Avatar } from "antd";
import { fetchQuizzes } from "@/utils/quizUtil";
import dayjs from "dayjs";
import { useRouter } from "nextjs-toploader/app";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { DIFFICULTY } from "@/utils/const";
import { getSingleCategory } from "@/utils/categoriesUtils";
const avatarColors = ["#f56a00", "#7265e6", "#00a2ae", "#ffbf00", "#1890ff"];

const S3_BASE_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

const Quizzes = () => {
  const userDetails = useSelector((state) => state.auth.userDetails);
  const user = userDetails?.data?.data;
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const params = {
      status: "ACTIVE",
      ...(user ? { userId: user.id } : {}),
    };

    // Fetch quizzes
    fetchQuizzes(params)
      .then(async (res) => {
        const quizzesData = res.data || [];
        setQuizzes(quizzesData);

        // Fetch categories for all quizzes
        const categoriesData = await Promise.all(
          quizzesData.map(async (quiz) => {
            if (!categories[quiz.category]) {
              const categoryDetail = await getSingleCategory(quiz.category);
              console.log("categories", categoryDetail);
              return {
                id: quiz.category,
                name: categoryDetail?.data.name || "Unknown",
              };
            }
            return { id: quiz.category, name: categories[quiz.category] }; // If already fetched
          })
        );

        const categoriesMap = categoriesData.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});

        setCategories(categoriesMap);
      })
      .catch(() => {
        // Handle error notification if needed
        toast.error("Failed to load quizzes");
      })
      .finally(() => setLoading(false));
  }, [user]);
  const handleStartQuiz = (quizId) => {
    // Check if the user is logged in
    if (!user) {
      const afterLogin = `/certifications`; // or `/quizzes/${quizId}`

      // Push them to /signin with ?redirect=…
      router.push(`/signin?redirect=${encodeURIComponent(afterLogin)}`);
      return;
    } else {
      // Redirect to quiz page
      router.push(`/quizzes/${quizId}`);
    }
  };

  if (quizzes.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px]">
        <h2 className="text-2xl font-bold mb-4">No Quizzes Available</h2>
        <p className="text-gray-600">Please check back later.</p>
      </div>
    );
  }

  return (
    <>
      <Row gutter={[24, 24]} className="flex justify-center">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Col xs={24} sm={12} md={8} lg={8} xl={5} key={idx}>
                <div className="animate-pulse bg-white rounded-lg h-[500px]" />
              </Col>
            ))
          : quizzes.map((quiz, ind) => {
              const {
                id,
                name,
                category,
                difficulty,
                totalQuestions,
                passingPerc,
                endDate,
                startDate,
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
                  : difficulty === DIFFICULTY.MEDIUM
                  ? "text-yellow-600 bg-yellow-100"
                  : "text-red-600 bg-red-100";

              const quizImage = `${S3_BASE_URL}/${image}`;
              const categoryName = categories[category] || "Loading..."; // Use the pre-fetched category

              return (
                <Col xs={24} sm={12} md={8} lg={8} xl={5} key={id}>
                  <div className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="rounded-lg flex items-center">
                        <img
                          className="w-16 object-contain"
                          alt={name}
                          src={`/assets/icons/quizz.gif`}
                        />
                        <p className="rounded-full font-semibold text-2xl">
                          #{quizNo}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-md ${diffColor}`}
                      >
                        {difficulty}
                      </span>
                    </div>
                    <div className="h-40 relative">
                      <img
                        className="w-full h-40 object-cover rounded-lg border"
                        alt={name}
                        src={
                          image
                            ? quizImage
                            : "https://db-kompare-dev.s3.eu-west-1.amazonaws.com/COMMON/db-kompare-banner.jpg"
                        }
                      />
                    </div>

                    <div className="my-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {name}
                        </h3>
                        <div className="text-sm text-primary border-primary border my-4 w-max bg-[#EEF0FF] px-2 py-1 rounded-md">
                          {categoryName}
                        </div>

                        <p className="text-sm mb-2">
                          <span className="font-semibold">
                            Number of Questions:
                          </span>{" "}
                          {desiredQuestions || totalQuestions}
                        </p>
                        <p className="text-sm mb-2">
                          <span className="font-semibold">
                            Passing Percentage:{" "}
                          </span>{" "}
                          {passingPerc}%
                        </p>
                        <p className="mb-2 text-sm">
                          <span className="font-semibold">Deadline:</span>{" "}
                          <span className=" ">
                            {dayjs(endDate).format("dddd, MMM DD, YYYY")}
                          </span>
                        </p>
                        <div className="flex items-center text-sm ">
                          <span className="font-semibold">Participants:</span>{" "}
                          <Avatar.Group className="ml-2">
                            {recentParticipants?.map((participant, idx) => {
                              const bgColor =
                                avatarColors[idx % avatarColors.length];
                              const name =
                                participant.user?.name ||
                                participant.name ||
                                "U";
                              const initial = name.charAt(0).toUpperCase();

                              return (
                                <Avatar
                                  key={participant.user?.id || idx}
                                  style={{ backgroundColor: bgColor }}
                                >
                                  {initial}
                                </Avatar>
                              );
                            })}
                          </Avatar.Group>
                          <span>
                            {recentParticipants?.length > 0 && "+"}
                            {otherParticipantsCount}{" "}
                            {recentParticipants?.length > 0 && "more"}
                          </span>
                        </div>
                      </div>
                      {taken ? (
                        <div className="bg-[#F2FFF6] text-[#17A44B] font-semibold p-2 rounded-md mt-6 text-center">
                          Successfully Completed !!
                        </div>
                      ) : (
                        <Button
                          type="primary"
                          disabled={
                            dayjs().isAfter(dayjs(endDate)) ||
                            dayjs().isBefore(dayjs(startDate))
                          }
                          onClick={() => handleStartQuiz(id)}
                          className="mt-6 bg-primary hover:!bg-primary text-white hover:!text-white h font-semibold !py-2 rounded-lg transition-colors duration-200"
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
    </>
  );
};

export default Quizzes;
