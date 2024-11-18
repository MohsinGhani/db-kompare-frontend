"use client";

import CommonButton from "@/components/shared/Button";
import Image from "next/image";
import React from "react";
import chart from "../../public/assets/images/Base Chart.png";
import arrowIcon from "../../public/assets/images/arrow.png";
import blueline from "../../public/assets/images/blue line.png";
import WhyUs from "@/components/Homepage/WhyUs";
import ExperiencePage from "@/components/Homepage/WhyUs";
import ExperienceSection from "@/components/Homepage/ExperienceSection";
import MakeUsUnique from "@/components/Homepage/uniqueSection";
function Home() {
  return (
    <div>
      <div className="lg:pl-28 bg-[url('/assets/images/homebg.png')] bg-cover bg-center h-screen ">
        <div className="flex justify-between items-center h-full px-4 text-black md:pt-32 ">
          <div className="flex justify-between -mt-28 ml-2 ">
            <div className="md:w-3/5 w-full flex flex-col items-center xl:items-start xl:text-start text-center justify-center space-y-4">
              <h1 className="font-extrabold text-3xl 2xl:text-5xl 2xl:leading-[67.52px] tracking-[-1%]">
                Offer technology
                <br />
                and software solutions
              </h1>
              <Image src={blueline} alt="blue line" width={300} height={50} />
              <p className="xl:text-lg xl:text-start text-center font-normal mb-3">
                Accounting is a more diverse profession stability of a long with
                huge Profitability than it is often given creditand.
              </p>
              <div className="md:flex md:space-x-4">
                <CommonButton
                  className="bg-black md:w-40 w-full lg:w-52 mt-3 text-white text-lg  md:text-base  hover:bg-pink-300 hover:text-black transition-all duration-300"
                  style={{ color: "white" }}
                >
                  DB Leaderboard
                </CommonButton>
                <CommonButton className="bg-transparent lg:w-52 md:w-40 w-full mt-3 text-black md:text-base text-lg border border-black">
                  DB Comparison
                </CommonButton>
              </div>
            </div>
            <div className="hidden md:block">
              <Image src={arrowIcon} alt="arrow" width={90} height={50} />
            </div>
          </div>

          <div className="md:flex hidden justify-center">
            <Image src={chart} alt="chart" width={600} height={400} />
          </div>
        </div>
      </div>
      <div>
        <WhyUs />

        <ExperienceSection />
        <MakeUsUnique />
      </div>
    </div>
  );
}

export default Home;
