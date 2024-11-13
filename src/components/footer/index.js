import React from "react";
import Image from "next/image";
import logo from "../../../public/assets/images/dbLogo.png";

export default function Footer() {
  return (
    <div className="h-80 bg-custom-gradient px-10 flex flex-col justify-center items-center">
      <Image
        src={logo}
        alt="DB Logo"
        width={200}
        height={100}
        className="object-contain "
      />

      <div className="flex flex-col justify-center items-center border-b w-full border-[#DFDFDF] py-5">
        <ul className="flex gap-8 mb-6 text-sm font-normal">
          <li>
            <a href="/" className="text-[#535353] hover:font-semibold">
              Home
            </a>
          </li>
          <li>
            <a
              href="/leader-board"
              className="text-[#535353] hover:font-semibold"
            >
              DB Leaderboard
            </a>
          </li>
          <li>
            <a
              href="/db-comparison"
              className="text-[#535353] hover:font-semibold"
            >
              DB Comparison
            </a>
          </li>
        </ul>

        <div className="flex gap-8">
          <Image
            src="/assets/icons/facebook.svg"
            alt="Facebook"
            width={25}
            height={25}
          />

          <Image
            src="/assets/icons/instagram.svg"
            alt="Instagram"
            width={25}
            height={25}
          />

          <Image
            src="/assets/icons/linkedin.svg"
            alt="LinkedIn"
            width={25}
            height={25}
          />
        </div>
      </div>

      <p className="text-[#535353] text-sm text-center mt-4">
        Non-Copyrighted © 2024 Upload by DB Kompare
      </p>
    </div>
  );
}
