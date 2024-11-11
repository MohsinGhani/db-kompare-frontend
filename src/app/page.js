import Navbar from "@/components/header";
import CommonButton from "@/components/shared/Button";
import Image from "next/image";
import React from "react";
import chart from "../../public/assets/images/Base Chart.png";
import arrowIcon from "../../public/assets/images/arrow.png";
import blueline from "../../public/assets/images/blue line.png";
function Home() {
  return (
    <div className="pl-28 bg-[url('/assets/images/homebg.png')] bg-cover bg-center h-screen overflow-hidden">
      <Navbar />
      <div className="flex justify-between items-center h-full px-6 text-black">
        <div className="flex justify-between ">
          <div className="w-3/5  flex flex-col justify-center space-y-4 ">
            <h1 className="font-extrabold text-5xl leading-[67.52px] tracking-[-1%] ">
              Offer technology
              <br />
              and software solutions
            </h1>
            <Image src={blueline} alt="blue line" width={300} height={50} />
            <p className="text-lg font-normal mb-3">
              Accounting is a more diverse profession stability of a long with
              huge Profitability than it is often given creditand.
            </p>
            <div className="flex space-x-4 mt-3">
              <CommonButton
                className="bg-black text-white text-lg "
                style={{ color: "white" }}
              >
                Learn More
              </CommonButton>
              <CommonButton className="bg-transparent text-black text-lg border border-black">
                Contact Us
              </CommonButton>
            </div>
          </div>

          <div>
            <Image src={arrowIcon} alt="arrow" width={90} height={50} />
          </div>
        </div>

        <div className="flex justify-center">
          <Image src={chart} alt="chart" width={600} height={400} />
        </div>
      </div>
    </div>
  );
}

export default Home;
