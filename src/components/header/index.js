"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../public/assets/icons/logo.gif";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import CommonTypography from "../shared/Typography";
import { Navlinks } from "@/utils/const";
import CommonButton from "../shared/Button";
import CommonUserDropdown from "../shared/UserDropdown";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { useDispatch, useSelector } from "react-redux";
import { selectEmail, setUserDetails } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const isDbComparisonPage = path?.startsWith(
    "/db-comparison" || "/db-comparisons/list"
  );
  const authRoutes = [
    "/signin",
    "/signup",
    "/new-password",
    "/verification-code",
  ];
  const dispatch = useDispatch();
  const email = useSelector(selectEmail);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const session = await fetchAuthSession();

        if (!session || !session.tokens || !session.tokens.idToken) {
          return;
        }

        const idToken = session.tokens.idToken.payload;

        const currentUser = await getCurrentUser();

        if (currentUser || email) {
          dispatch(setUserDetails({ idToken, ...currentUser }));
          setUser(true);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [email, dispatch, router, setUserDetails]);

  return (
    <div
      className={`w-full h-20 pt-3 z-10 ${
        path === "/"
          ? "lg:bg-[url('/assets/images/homebg.png')] w-full bg-cover bg-custom-gradient"
          : "fixed bg-custom-gradient"
      }`}
    >
      <div
        className={`w-full 2xl:px-20 lg:pl-6 px-3 flex justify-between items-center`}
      >
        <div
          className="flex items-center gap-2 justify-center cursor-pointer"
          onClick={() => {
            router.push("/");
            setIsOpen(false);
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
        <div className="hidden lg:flex space-x-8">
          {Navlinks.map((link, index) => (
            <button
              key={index}
              onClick={() => {
                if (link.href.startsWith("http")) {
                  window.open(link.href, "_blank");
                } else {
                  router.push(link.href);
                }
              }}
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
        {!authRoutes.includes(path) && (
          <div className="lg:block hidden">
            {user ? (
              <CommonUserDropdown />
            ) : (
              <CommonButton
                className="bg-primary text-white"
                style={{ height: "40px" }}
                onClick={() => {
                  router.push("/signin");
                }}
              >
                Vendor Login
              </CommonButton>
            )}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
        } lg:hidden fixed top-20 left-0 p-7 w-full bg-white z-30 transition-all duration-300 ease-in-out`}
      >
        <ul className="text-black text-lg font-normal gap-3 flex flex-col p-4 md:p-0 h-auto justify-start items-start">
          {Navlinks.map((link, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  if (link.href.startsWith("http")) {
                    window.open(link.href, "_blank");
                  } else {
                    router.push(link.href);
                    setIsOpen(false);
                  }
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
