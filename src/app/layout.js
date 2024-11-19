"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import Navbar from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import loadingAnimationIcon from "@/../public/assets/icons/Animation-loader.gif";
export default function RootLayout({ children }) {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <html lang="en">
      <body className="font-sans bg-white ">
        {" "}
        {mount ? (
          <>
            <Navbar />
            <div>{children}</div>
            <Footer />
          </>
        ) : (
          <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2">
            <Image
              src={loadingAnimationIcon}
              alt="logo"
              width={100}
              height={100}
            />
          </div>
        )}
      </body>
    </html>
  );
}
