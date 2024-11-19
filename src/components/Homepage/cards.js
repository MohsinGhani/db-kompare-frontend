import React from "react";
import CommonTypography from "../shared/Typography";
import CommonButton from "../shared/Button";

const HomepageCards = () => {
  const CardsData = [
    {
      title: "Discover Top Resources in Real-Time",
      description:
        "View the leading resources across platforms to find what’s trending and trusted",
      link: "DB  Leaderboard",
    },
    {
      title: "Compare Databases with Ease",
      description:
        "Compare codebases, solutions, and answers side-by-side to choose what fits your project or query best.",
      link: "DB Comparison",
    },
  ];

  return (
    <div className="text-5xl shadow-md text-center xl:px-32 lg:px-4 px-6 md:py-20 py-10 w-full">
      <div className="flex md:flex-row flex-col justify-between gap-10 2xl:gap-28 items-center">
        {CardsData.map((item, index) => (
          <div
            key={index}
            className="bg-[#F8F9FD] flex w-full md:w-2/4 lg:px-10 px-8 2xl:px-32 xl:px-12 p-16 flex-col gap-8 text-center items-center rounded-2xl"
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div >
              <CommonTypography className="text-black sm:text-lg text-2xl md:text-[40px] font-bold ">
                {item.title}
              </CommonTypography>
              <br/>
              {/* <CommonTypography className="text-[#565758] text-base md:text-lg">
                {item.description}
              </CommonTypography> */}
              <h3 className="text-[#565758] text-base md:text-lg my-9">
                {item.description}
              </h3>
            </div>
            <CommonButton
              className="bg-[#3E53D7] border-none md:w-40 w-full lg:w-52  text-white text-lg md:text-base hover:text-black transition-all duration-300"
              style={{ color: "white", border: "none" }}
            >
              {item.link}
            </CommonButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomepageCards;
