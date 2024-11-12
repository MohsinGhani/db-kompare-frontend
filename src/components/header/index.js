"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "../../../public/assets/images/dbLogo.png";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const path = usePathname();
  console.log(path);

  return (
    <div
      className={`w-full h-20 fixed z-10 ${
        path === "/" ? "bg-transparent" : "bg-custom-gradient"
      }`}
    >
      <div className="lg:w-[75%] w-full lg:px-28 pl-10 flex justify-between items-center">
        <Image
          src={logo}
          alt="DB Logo"
          width={200}
          height={100}
          className="object-contain"
        />

        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen ? "true" : "false"}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>

          {isOpen ? (
            <CloseOutlined style={{ fontSize: "25px" }} />
          ) : (
            <MenuOutlined style={{ fontSize: "25px" }} />
          )}
        </button>

        <div
          className={`${
            isOpen ? "block bg-white" : "hidden"
          } w-full md:block md:w-auto bg-black 2xl:transparent md:bg-transparent rounded-md`}
          id="navbar-default"
        >
          <ul className=" text-black  text-lg font-normal gap-3 flex flex-col p-4 md:p-0 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="/"
                className="block  py-2 px-3 hover:font-semibold text-black bg-white rounded md:bg-transparent md:text-black md:p-0 "
              >
                Home{" "}
              </a>
            </li>
            <li>
              <a
                href="/leader-board"
                className="block py-2 px-3 hover:font-semibold text-black bg-white rounded md:bg-transparent md:text-black md:p-0 "
              >
                DB Leaderboard
              </a>
            </li>
            <li>
              <a
                href="/db-comparison"
                className="block py-2 px-3 hover:font-semibold text-black bg-white rounded md:bg-transparent md:text-black md:p-0 "
              >
                DB Comparison
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
