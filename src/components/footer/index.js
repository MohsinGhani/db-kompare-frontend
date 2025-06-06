"use client";

import { isAdminRoute } from "@/utils/helper";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/assets/icons/logo.gif";
import CommonTypography from "../shared/Typography";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { Navlinks } from "@/utils/const";

const socialLinks = [
  { href: "/assets/icons/facebook.svg", alt: "Facebook", link: "" },
  { href: "/assets/icons/instagram.svg", alt: "Instagram", link: "" },
  {
    href: "/assets/icons/linkedin.svg",
    alt: "LinkedIn",
    link: "https://www.linkedin.com/company/dbkompare-com/about/",
  },
];

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const isEditorScreen = pathname.startsWith("/questions");
  const isQuizDetailScreen = pathname.startsWith("/quizzes/");

  if (isEditorScreen || isAdminRoute(pathname) || isQuizDetailScreen)
    return null;

  const contactEmail = "cooltech814@gmail.com";

  return (
    <div className="relative md:h-80 h-96 bg-custom-gradient px-10 flex flex-col justify-center items-center">
      <div className="flex items-center gap-1 justify-center">
        <Image
          src={logo}
          alt="DB Logo"
          width={40}
          height={100}
          className="object-contain"
        />
        <CommonTypography className="text-2xl font-semibold text-black">
          DB Kompare
        </CommonTypography>
      </div>

      <div className="flex flex-col justify-center items-center border-b w-full border-[#DFDFDF] py-5">
        <ul className="flex flex-wrap justify-center gap-2 md:gap-8 mb-6 text-sm font-normal">
          {Navlinks.map((link, idx) => (
            <li key={idx}>
              <button
                onClick={() => {
                  if (link.href.startsWith("http")) {
                    window.open(link.href, "_blank");
                  } else {
                    router.push(link.href);
                  }
                }}
                className="text-[#535353] hover:font-semibold"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${contactEmail}`}
              className="text-[#535353] hover:font-semibold cursor-pointer"
            >
              Contact Us
            </a>
          </li>
        </ul>

        <div className="flex gap-8">
          {socialLinks.map(({ href, alt, link }, idx) => (
            <Link href={link} key={idx}>
              <Image
                src={href}
                alt={alt}
                width={25}
                height={25}
                style={{ cursor: "pointer" }}
              />
            </Link>
          ))}
        </div>
      </div>

      <p className="text-[#535353] text-sm text-center mt-4">
        Non-Copyrighted © {dayjs().year()} Upload by DB Kompare
      </p>
    </div>
  );
}
