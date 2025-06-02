import Certifications from "@/components/view/Certifications";
import { generateCommonMetadata } from "@/utils/helper";
import React from "react";


const title = "Certifications";
const description =
  "Earn FREE certifications by completing quizzes on DB Kompare. Take quizzes at your own pace and showcase your skills with official certificates.";

export const metadata = generateCommonMetadata({
  title,
  description,
});

const page = () => {
  return <Certifications />;
};

export default page;
