import React from "react";
import CommonTypography from "../shared/Typography";
import CommonButton from "../shared/Button";
import { useRouter } from "next/navigation";

const HomepageCards = () => {
  const router = useRouter();
  const CardsData = [
    {
      title: "Discover Top Resources in Real-Time",
      description:
        "View the leading resources across platforms to find what’s trending and trusted",
      link: {
        href: "/leader-board",
        text: "DB Leaderboard",
      },
    },
    {
      title: "Compare Databases with Ease",
      description:
        "Compare codebases, solutions, and answers side-by-side to choose what fits your project or query best.",
      link: {
        href: "/db-comparisons/list",
        text: "DB Comparison",
      },
    },
  ];

  return (
    <div className="text-5xl shadow-md text-center xl:px-32 lg:px-4 px-6 md:py-20 py-10 w-full">
      <div className="flex md:flex-row flex-col justify-between gap-10 2xl:gap-28 h-auto items-stretch">
        {CardsData.map((item, index) => (
          <div
            key={index}
            className="bg-[#F8F9FD] flex flex-col gap-8 text-center items-center rounded-2xl w-full md:w-2/4 lg:px-10 px-8 2xl:px-32 xl:px-12 p-16"
            style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
          >
            <div>
              <CommonTypography className="text-black sm:text-lg text-2xl xl:text-[40px] md:text-[20px] font-bold ">
                {item.title}
              </CommonTypography>
              <br />

              <h3 className="text-[#565758] text-base md:text-lg my-9">
                {item.description}
              </h3>
            </div>
            <CommonButton
              className="bg-[#3E53D7] border-none md:w-40 w-full lg:w-52 text-white text-lg md:text-base hover:text-black transition-all duration-300"
              style={{ color: "white", border: "none" }}
              onClick={() => router.push(item.link.href)}
            >
              {item.link.text}
            </CommonButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomepageCards;
