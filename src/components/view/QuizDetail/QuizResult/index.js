"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, Divider, Progress, Tag } from "antd";
import { CheckCircleOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { fetchQuizSubmissionById } from "@/utils/quizUtil";

const QuizResult = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (id) {
      fetchResults();
    }
  }, [id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetchQuizSubmissionById(id);
      if (response.data) {
        setResult(response.data);
      } else {
        throw new Error(response.message || "Failed to load results");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to determine if a question was answered correctly
  const isQuestionCorrect = (questionId) => {
    if (!result || !result.quizDetails?.questions) return false;
    
    const question = result.quizDetails.questions.find(q => q.id === questionId);
    const userAnswer = result.answers.find(a => a.questionId === questionId);
    
    if (!question || !userAnswer) return false;

    const correctOptionIds = question.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt.id);

    // For multiple answer questions
    if (question.isMultipleAnswer) {
      return (
        userAnswer.selectedOptionIds.length === correctOptionIds.length &&
        userAnswer.selectedOptionIds.every(id => correctOptionIds.includes(id))
      );
    }
    // For single answer questions
    return (
      userAnswer.selectedOptionIds.length === 1 &&
      correctOptionIds.includes(userAnswer.selectedOptionIds[0])
    );
  };

  const isPassed = result?.status === "PASSED";

  if (loading) return <div>Loading results...</div>;
  if (!result) return <div>Results not found</div>;

  return (
    <div className="py-8 min-h-screen container">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-3">Quiz Results</h1>
        <Progress 
          type="circle" 
          percent={result?.percentageScore} 
          strokeColor={isPassed ? '#52c41a' : '#f5222d'}
        />

        <p className="text-lg font-semibold mt-2">
          {isPassed ? "Great" : "Failed"}
        </p>
        <p className="text-lg ">
          {isPassed
            ? "Congratulations on your achievement"
            : "Better Luck Next Time"}
        </p>
      </div>

      <div className="border rounded-lg p-4 mt-6 flex justify-between items-center">
        <div className="flex items-start gap-2">
          <img src={"/assets/icons/certificate.png"} alt="Certificate" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">
              {result?.quizDetails?.name}
            </h2>
            <p className="text-sm text-gray-500">
              {isPassed
                ? "You have passed the quiz"
                : "You have not passed the quiz"}
            </p>
          </div>
        </div>
        {isPassed ? (
          <Button type="primary" className="!h-12">Get Certificate</Button>
        ) : (
          <p>Better Luck next time</p>
        )}
      </div>

      <p className="font-semibold text-base my-5">Attempted questions:</p>

      {result.answers.map((answer) => {
        const question = result.quizDetails?.questions?.find(q => q.id === answer.questionId);
        if (!question) return null;
        
        const isCorrect = isQuestionCorrect(question.id);
        const correctOptions = question.options.filter(opt => opt.isCorrect);
        const userSelectedOptions = answer.selectedOptionIds.map(id => 
          question.options.find(opt => opt.id === id)
        ).filter(Boolean);

        return (
          <Card
            key={question.id}
            className={`mb-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}
            style={{ borderLeft: `4px solid ${isCorrect ? '#52c41a' : '#f5222d'}` }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Q: {question.question}</h3>
              {isCorrect ? (
                <Tag icon={<CheckOutlined />} color="success">Correct</Tag>
              ) : (
                <Tag icon={<CloseOutlined />} color="error">Incorrect</Tag>
              )}
            </div>

            <Divider className="my-3" />

            <div className="mb-3">
              <h4 className="font-medium">Your Answer:</h4>
              {userSelectedOptions.length > 0 ? (
                <ul className="list-disc pl-5">
                  {userSelectedOptions.map(option => (
                    <li key={option.id} className={option.isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {option.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No answer selected</p>
              )}
            </div>

            {!isCorrect && (
              <div className="mt-2">
                <h4 className="font-medium">Correct Answer:</h4>
                <ul className="list-disc pl-5">
                  {correctOptions.map(option => (
                    <li key={option.id} className="text-green-600">
                      {option.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {question.explanation && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <h4 className="font-medium">Explanation:</h4>
                <p>{question.explanation}</p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default QuizResult;