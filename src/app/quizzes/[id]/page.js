// app/quiz/[id]/page.js
import React from "react";
import Head from "next/head";
import QuizDetail from "@/components/view/QuizDetail";
import { fetchQuizById } from "@/utils/quizUtil";
import { convertHtmlToText, generateCommonMetadata } from "@/utils/helper";

async function getQuizData(id) {
  const response = await fetchQuizById(id);
  return response?.data;
}

export async function generateMetadata({ params }) {
  const { id } = params;
  const quiz = await getQuizData(id);

  // Build a plain-text description for meta tags
  const rawText = convertHtmlToText(quiz.description || "");
  const maxChars = 160;
  const truncated =
    rawText.length > maxChars ? rawText.slice(0, maxChars).trim() + "…" : rawText;

  // Construct keywords array (optional)
  const keywordsArray = [
    quiz.category,
    quiz.difficulty,
    quiz.name,
    "DB Kompare Quiz",
    `${quiz.category} Quiz`,
  ].filter(Boolean);

  // Canonical URL

  // OpenGraph image URL
  const ogImageUrl = `${process.env.NEXT_PUBLIC_BUCKET_URL}/QUIZZES/${quiz?.quizImage}`;

  // Base metadata from your helper
  const baseMetadata = generateCommonMetadata({
    title: quiz.name,
    description: truncated,
    imageUrl: ogImageUrl,
    siteName: "DB Kompare",
    type: "article",
  });

  return {
    ...baseMetadata,
    metadataBase: new URL("https://www.db-kompare.com"),
    keywords: keywordsArray,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      locale: "en_US",
      type: "article",
      publishedTime: new Date(Number(quiz.createdAt)).toISOString(),
      modifiedTime: new Date().toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${quiz.name} | DB Kompare`,
      description: truncated,
      images: [ogImageUrl],
    },
  };
}

export default async function QuizPage({ params }) {
  const { id } = params;
  const quiz = await getQuizData(id);

  // JSON-LD for structured data
  const rawText = convertHtmlToText(quiz.description || "");
  const isoCreatedAt = new Date(Number(quiz.createdAt)).toISOString();
  const quizUrl = `https://www.db-kompare.com/quiz/${quiz.id}`;
  const ogImageUrl = `${process.env.NEXT_PUBLIC_BUCKET_URL}/QUIZ/${id}.webp`;

  // Build question entities
  const questionEntities = quiz.questions.map((q, idx) => {
    const accepted = q.options.find((opt) => opt.isCorrect);
    return {
      "@type": "Question",
      "@id": `${quizUrl}#question${idx + 1}`,
      name: q.question,
      text: q.question,
      answerCount: q.options.length,
      acceptedAnswer: accepted
        ? {
            "@type": "Answer",
            text: accepted.text,
          }
        : null,
      suggestedAnswer: q.options.map((opt) => ({
        "@type": "Answer",
        text: opt.text,
      })),
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "@id": `${quizUrl}#quiz`,
    name: quiz.name,
    description: rawText,
    dateCreated: isoCreatedAt,
    author: {
      "@type": "Person",
      name: "DB Kompare Team",
    },
    url: quizUrl,
    image: ogImageUrl,
    totalQuestions: quiz.totalQuestions,
    hasPart: questionEntities,
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
        />
      </Head>

      <QuizDetail quiz={quiz} />
    </>
  );
}
