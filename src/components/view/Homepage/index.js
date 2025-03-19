"use client";

import CommonButton from "@/components/shared/Button";
import Image from "next/image";
import React from "react";
import blueline from "@/../public/assets/images/blue line.png";
import HomepageSlider from "@/components/homepage/slider";
import arrowIcon from "@/../public/assets/images/arrow.png";
import chart from "@/../public/assets/images/Base Chart.png";
import WhyUs from "@/components/homepage/whyUs";
import ExperienceSection from "@/components/homepage/experienceSection";
import MakeUsUnique from "@/components/homepage/uniqueSection";
import HomepageCards from "@/components/homepage/cards";
import { useRouter } from "nextjs-toploader/app";
import OurBlogs from "@/components/homepage/ourBlog";
export default function Homepage() {
  const router = useRouter();
  return (
    <div>
      <div className="lg:pl-28 bg-[url('/assets/images/homebg.png')] bg-cover  bg-center md:h-[90vh] h-[70vh] ">
        <div className="flex justify-between gap-5 items-center h-full px-4 text-black md:pt-32 ">
          <div className="flex justify-between ml-2 ">
            <div className="md:w-3/5 w-full flex flex-col items-center xl:items-start xl:text-start text-center justify-center space-y-4">
              <h1 className="font-extrabold text-3xl 2xl:text-5xl 2xl:leading-[67.52px] tracking-[-1%]">
                Compare DBs and Discover
                <br />
                <span className="text-primary">DB Internals</span>
              </h1>
              <Image src={blueline} alt="blue line" width={300} height={50} />
              <p className="xl:text-lg xl:text-start text-center font-normal mb-3">
                COMPARE and RANK SQL , NOSQL , Graph Databases based on
                popularity , features and PRICE We have noticed that most
                comparisions focus on postives about a technology but we focus
                on the NEGATIVES, DISADVANTAGES and LIMITATIONS of a
                database/software product
              </p>
              <div className="md:flex md:space-x-4">
                <CommonButton
                  className="bg-primary md:w-40 w-full lg:w-52 mt-3 text-white text-lg  md:text-base  hover:bg-pink-300 hover:text-black transition-all duration-300"
                  style={{ color: "white" }}
                  onClick={() => router.push("/leader-board")}
                >
                  DB Leaderboard
                </CommonButton>
                <CommonButton
                  className="bg-transparent border border-[#3E53D7]  lg:w-52 md:w-40 w-full mt-3 text-primary md:text-base text-lg "
                  onClick={() => router.push("/db-comparisons/list/options")}
                >
                  DB Comparison
                </CommonButton>
              </div>
            </div>
            <div className="hidden md:block">
              <Image src={arrowIcon} alt="arrow" width={90} height={50} />
            </div>
          </div>

          <div className="md:flex hidden justify-center">
            <Image src={chart} alt="chart" width={900} height={400} />
          </div>
        </div>
      </div>
      <div>
        <HomepageSlider />
        <WhyUs />
        <ExperienceSection />
        <MakeUsUnique />
        <OurBlogs />
        <HomepageCards />
      </div>
    </div>
  );
}
