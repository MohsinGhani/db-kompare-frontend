"use client";

import "./globals.css"; // Ensure Plus Jakarta Sans is in globals.css
import { useEffect, useState } from "react";
import Navbar from "@/components/header";

export default function RootLayout({ children }) {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <html lang="en">
      <body className="font-sans bg-white">
        {" "}
        {/* Apply Tailwind's default sans with Plus Jakarta Sans */}
        {mount ? (
          <>
            <Navbar />
            <div className="md:pt-0 pt-10">{children}</div>
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
