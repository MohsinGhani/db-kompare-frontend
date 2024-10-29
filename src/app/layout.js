"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.className} max-w-7xl m-auto px-6`}>
        {mount ? (
          <>{children}</>
        ) : (
          <div className="absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 ">
            <div className="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-8 h-64 w-64"></div>
          </div>
        )}
      </body>
    </html>
  );
}
