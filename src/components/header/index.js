"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "../../../public/assets/images/dbLogo.png";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/leader-board", label: "DB Leaderboard" },
    { href: "/db-comparison", label: "DB Comparison" },
  ];
  const isDbComparisonPage = path?.startsWith("/db-comparison");
  return (
    <div
      className={`w-full h-20 fixed z-10 ${
        path === "/" ? "lg:bg-none bg-custom-gradient" : "bg-custom-gradient"
      }`}
    >
      <div className="2xl:w-[65%] lg:w-4/5 w-full lg:px-28 px-3 flex justify-between items-center">
        <Image
          src={logo}
          alt="DB Logo"
          width={200}
          height={100}
          className="object-contain"
        />
        <div className="hidden md:flex space-x-8">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`py-2 px-3 ${
                path === link.href ||
                (isDbComparisonPage && link.href === "/db-comparison")
                  ? "font-semibold text-black"
                  : "text-black"
              } hover:font-semibold`}
            >
              {link.label}
            </a>
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
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className={`block py-2 px-3 ${
                  path === link.href ||
                  (isDbComparisonPage && link.href === "/db-comparison")
                    ? "font-semibold text-black"
                    : "text-black"
                } hover:font-semibold bg-white rounded md:bg-transparent md:text-black md:p-0`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
