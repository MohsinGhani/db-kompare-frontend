import React from "react";
import CommonTypography from "../shared/Typography";
import Image from "next/image";
import knowledgeIcon from "@/../public/assets/icons/knowlege.png";
import comparisonIcon from "@/../public/assets/icons/comparisonTools.png";
import realTimeIcon from "@/../public/assets/icons/realTimeUpdate.png";
const MakeUsUnique = () => {
  const uniqueSectionData = [
    {
      title: "Unified Knowledge Access",
      description:
        "Dive into a consolidated database with resources from GitHub repositories, Stack Overflow discussions, Google Search, and Bing Search.",
      icon: knowledgeIcon,
    },
    {
      title: "Powerful Comparison Tools",
      description:
        "Compare codebases, solutions, and answers side-by-side to choose what fits your project or query best.",
      icon: comparisonIcon,
    },
    {
      title: "Real-Time Updates",
      description:
        "Stay ahead with the most up-to-date information directly from trusted platforms.",
      icon: realTimeIcon,
    },
  ];

  return (
    <div className=" rounded-lg  text-5xl shadow-md text-center px-24 py-20 w-full">
      {/* <CommonTypography classes="text-[42px] font-bold">
        What Makes Us Unique
      </CommonTypography>
      <h1>

      <CommonTypography classes="text-base font-normal text-[#565758]">
        Revolutionizing How You Discover and Compare Knowledge
      </CommonTypography> */}
      <CommonTypography classes="text-5xl font-bold">
        What Makes Us Unique
      </CommonTypography>

      <h2></h2>
      <CommonTypography classes="text-base font-normal text-[#565758]">
        Revolutionizing How You Discover and Compare Knowledge
      </CommonTypography>

      <div className="flex justify-between items-center mt-8">
        {uniqueSectionData.map((item, index) => (
          <div
            key={index}
            className={`p-4 flex flex-col gap-5 pl-7 px-10 text-start w-1/3 ${
              index === 0 ? "" : "border-l border-[#E4E4E7]"
            } ${index === uniqueSectionData.length - 1 ? "" : "border-r"}`}
          >
            <Image src={item.icon} alt={item.title} />
            <h3 className="text-black text-2xl font-bold mb-2">{item.title}</h3>
            <p className="text-[#565758] text-base">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MakeUsUnique;
