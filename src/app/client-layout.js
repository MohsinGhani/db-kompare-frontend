"use client"; 

import { useEffect, useState } from "react";
import Image from "next/image";
import loadingAnimationIcon from "@/../public/assets/icons/Animation-loader.gif";
import Navbar from "@/components/header";
import Footer from "@/components/footer";

export default function ClientLayout({ children }) {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <>
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
    </>
  );
}
