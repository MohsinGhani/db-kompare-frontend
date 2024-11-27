"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "../../../public/assets/icons/logo.gif";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import CommonTypography from "../shared/Typography";
import { Navlinks } from "@/utils/const";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();

  const isDbComparisonPage = path?.startsWith(
    "/db-comparison" || "/db-comparisons/list"
  );
  return (
    <div
      className={`w-full h-20 pt-4  z-10 ${
        path === "/"
          ? " lg:bg-[url('/assets/images/homebg.png')] w-full bg-cover bg-custom-gradient"
          : "fixed bg-custom-gradient"
      }`}
    >
      <div className="2xl:w-[65%] lg:w-4/5 w-full lg:px-28 px-3 flex justify-between items-center">
        <div
          className="flex items-center gap-2 justify-center cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          <Image
            src={logo}
            alt="DB Logo"
            width={50}
            height={100}
            className="object-contain"
          />
          <CommonTypography className="text-2xl font-semibold text-black">
            DB Kompare
          </CommonTypography>
        </div>
        <div className="hidden md:flex space-x-8">
          {Navlinks.map((link, index) => (
            <button
              key={index}
              onClick={() => router.push(link.href)}
              className={`py-2 px-3 ${
                path === link.href ||
                (isDbComparisonPage && link.href === "/db-comparison")
                  ? "font-semibold text-black"
                  : "text-black"
              } hover:font-semibold`}
            >
              {link.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-expanded={isOpen ? "true" : "false"}
        >
          {isOpen ? (
            <CloseOutlined style={{ fontSize: "25px" }} />
          ) : (
            <MenuOutlined style={{ fontSize: "25px" }} />
          )}
        </button>
      </div>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden fixed top-20 left-0 w-full bg-white z-30 transition-all duration-300 ease-in-out`}
      >
        <ul className="text-black text-lg font-normal gap-3 flex flex-col p-4 md:p-0 h-auto justify-start items-start">
          {Navlinks.map((link, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  router.push(link.href);
                  setIsOpen(false);
                }}
                className={`block py-2 px-3 ${
                  path === link.href ||
                  (isDbComparisonPage && link.href === "/db-comparisons")
                    ? "font-semibold text-black"
                    : "text-black"
                } hover:font-semibold bg-white rounded md:bg-transparent md:text-black md:p-0`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
