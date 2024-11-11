import React from "react";
import Image from "next/image";
import logo from "../../../public/assets/images/dbLogo.png";

export default function Navbar() {
  return (
    <div className=" w-[73%] flex h-20 justify-between items-center px-4">
      <Image src={logo} alt="Logo" width={200} height={100} />
      <ul className="flex space-x-16 text-black text-lg font-normal">
        <li className="hover:font-medium">
          <a href="/" aria-label="Home">
            Home
          </a>
        </li>
        <li className="hover:font-medium">
          <a href="#" aria-label="About">
            DB Leaderboard
          </a>
        </li>
        <li className="hover:font-medium">
          <a href="#" aria-label="Contact">
            DB Comparison
          </a>
        </li>
      </ul>
    </div>
  );
}
