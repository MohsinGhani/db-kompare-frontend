import React from "react";
import CommonTypography from "../shared/Typography";
import Image from "next/image";
import knowledgeIcon from "@/../public/assets/icons/knowlege.png";
import comparisonIcon from "@/../public/assets/icons/comparisonTools.png";
import realTimeIcon from "@/../public/assets/icons/realTimeUpdate.svg";
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
    <div className="  text-5xl  text-center xl:px-32 lg:px-4 px-9  py-10 md:py-24 w-full">
      <CommonTypography classes="md:text-5xl text-2xl font-bold">
        What Makes Us Unique
      </CommonTypography>
      <br />
      <h2 className="my-4 md:text-base text-sm font-normal text-secondary">
        Revolutionizing How You Discover and Compare Knowledge
      </h2>

      <div className="lg:flex justify-between items-center mt-8">
        {uniqueSectionData.map((item, index) => (
          <div
            key={index}
            className={`p-4 flex flex-col gap-5 md:pl-14 md:px-10 text-start lg:w-1/3 lg:${
              index === 0 ? "" : "border-l border-[#E4E4E7]"
            } lg:${index === uniqueSectionData.length - 1 ? "" : "border-r"}`}
          >
            <Image src={item.icon} alt={item.title} />
            <h3 className="text-black text-2xl font-bold mb-2">{item.title}</h3>
            <p className="text-secondary text-base">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MakeUsUnique;
