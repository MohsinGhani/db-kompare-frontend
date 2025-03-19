import QuestionDetail from "@/components/view/QuestionDetail";
import { generateCommonMetadata } from "@/utils/helper";
import { fetchQuestionDetail } from "@/utils/questionsUtil";
import React from "react";

async function getQuestionData(id) {
  const response = await fetchQuestionDetail(id);
  return response.data;
}

export async function generateMetadata({ params }) {
  const { id } = params;
  const question = await getQuestionData(id);
  return generateCommonMetadata({
    title: `Q.${question?.questionNo} - ${question?.shortTitle}` || "Question",
    description: question?.seoDescription || "Learn with DB Kompare",
    siteName: "DB Kompare",
    type: "article",
  });
}

const page = () => {
  return (
    <>
      <QuestionDetail />
    </>
  );
};

export default page;
