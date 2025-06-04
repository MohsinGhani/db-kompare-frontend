// app/(whatever)/certifications.jsx
"use client";

import { Mea_Culpa } from "next/font/google";
import Quizzes from "../Quizzes";

// Re‐declare Mea Culpa here:
const meaCulpa = Mea_Culpa({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const Certifications = () => {
  return (
    <div className="w-full 2xl:px-20 lg:px-6 px-4 py-24 bg-gray-50">
      <div className="flex flex-col gap-3 items-center justify-center mb-12">
        <p className="text-5xl font-semibold text-gray-800 text-center">
          Get FREE{" "}
          {/* Apply Mea Culpa only to this <span> */}
          <span className={`${meaCulpa.className} text-7xl !font-semibold`}>
            Certificate
          </span>
        </p>
        <p className="text-sm text-center text-gray-600 font-[Pacifico]">
          You can take the quizzes at your own pace and earn certifications
          upon successful completion.
        </p>
      </div>

      <Quizzes />
    </div>
  );
};
export default Certifications;
