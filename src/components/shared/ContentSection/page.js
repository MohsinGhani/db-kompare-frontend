import Image from "next/image";
import React from "react";
import blueline from "../../../../public/assets/images/blueLine.png";

export default function ContentSection({
  heading1,
  heading2,
  paragraph1,
  paragraph2,
  children,
}) {
  return (
    <>
      <div className="lg:px-28 md:px-3  bg-custom-gradient bg-cover bg-center h-full">
        <div className="flex justify-between items-center h-full text-black md:pt-32">
          <div className="my-20 flex gap-7 justify-center text-center px-12 md:px-52 flex-col items-center w-full">
            <h1 className="md:text-5xl text-2xl font-bold">{heading1}</h1>
            <Image src={blueline} alt="blue line" width={600} height={50} />
            <p className="md:text-base  text-sm font-normal text-[#565758] text-center">
              {paragraph1}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full h-auto p-20  px-12 xl:px-28 md:px-3 flex flex-col gap-16 md:gap-10  items-center">
        <div className="md:w-3/5 text-center">
          <h1 className="md:text-5xl text-2xl font-bold mb-4">{heading2}</h1>
          <p className="md:text-base text-sm font-normal text-[#565758] text-center">
            {paragraph2}
          </p>
        </div>
        {children}
      </div>
    </>
  );
}
