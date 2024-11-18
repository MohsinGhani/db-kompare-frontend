import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { CheckOutlined } from "@ant-design/icons"; // Importing Antd check icon
import chooseUs from "@/../public/assets/images/chooseUs.png";
import CommonTypography from "../shared/Typography";

const inter = Inter({ subsets: ["latin"] });

export default function ExperiencePage() {
  return (
    <>
      <div className="flex flex-col w-full px-32 items-center justify-between py-9">
        <div className="flex justify-between w-full py-4">
          <div className="flex flex-col w-2/4 items-center justify-center ">
            <Image src={chooseUs} alt="Cube" />
          </div>

          <div className="flex flex-col pr-28 gap-6 w-2/4 items-start justify-center ">
            <CommonTypography className="text-4xl font-bold text-[#191A15]">
              Why Choose Us?
            </CommonTypography>
            <CommonTypography className="text-lg text-[#565758]">
              Get smarter, faster access to the best resources, all in one
              place, to streamline your workflow and find the right solutions
              quickly.
            </CommonTypography>
            <ul className="mt-4 gap-2 flex flex-col space-y-4 text-base text-[#565758]">
              <li>
                <CheckOutlined className="mr-4 text-xl text-[#3E53D7]" />
                Save time by eliminating the need to visit multiple platforms.
              </li>
              <li>
                <CheckOutlined className="mr-4 text-xl text-[#3E53D7]" />
                Find reliable answers faster with consolidated search.
              </li>
              <li>
                <CheckOutlined className="mr-4 text-xl text-[#3E53D7]" />
                Enhance your workflow with intuitive and interactive features.
              </li>
              <li>
                <CheckOutlined className="mr-4 text-xl text-[#3E53D7]" />
                Access the latest resources and solutions, all in one location.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
