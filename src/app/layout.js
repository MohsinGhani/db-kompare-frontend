"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import Navbar from "@/components/header";
import Footer from "@/components/footer";

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
            <div className="md:pt-0 pt-10">{children}</div>
            <Footer />
          </>
        ) : (
          <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2">
            <div className="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-8 h-64 w-64"></div>
          </div>
        )}
      </body>
    </html>
  );
}
