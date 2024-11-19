import Image from "next/image";
import { CheckOutlined } from "@ant-design/icons";
import chooseUs from "@/../public/assets/icons/Animation-about.gif";
import CommonTypography from "../shared/Typography";

export default function ExperiencePage() {
  const chooseList = [
    "Save time by eliminating the need to visit multiple platforms.",
    "Find reliable answers faster with consolidated search.",
    "Enhance your workflow with intuitive and interactive features.",
    "Access the latest resources and solutions, all in one location."
  ]
  return (
    <div className="flex flex-col w-full xl:px-32 lg:px-4 px-9 md:py-9 items-center">
      <div className="md:flex justify-between w-full py-4">
        <div className="md:w-2/4 hidden md:flex justify-center">
          <Image src={chooseUs} alt="Cube" width={600} />
        </div>
        <div className="md:w-2/4 flex justify-center flex-col gap-6">
          <CommonTypography className="text-4xl font-bold text-[#191A15]">Why Choose Us?</CommonTypography>
          <CommonTypography className="text-lg text-[#565758]">
            Get smarter, faster access to the best resources, all in one place, to streamline your workflow and find the right solutions quickly.
          </CommonTypography>
          <ul className="mt-4 space-y-4 text-base text-[#565758]">
            {chooseList.map((text, index) => (
              <li key={index}>
                <CheckOutlined className="mr-4 text-xl text-[#3E53D7]" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
