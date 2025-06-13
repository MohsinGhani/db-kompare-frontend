"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import loadingAnimationIcon from "@/../public/assets/icons/Animation-loader.gif";
import Navbar from "@/components/header";
import Footer from "@/components/footer";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientLayout({ children }) {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <>
      <NextTopLoader
        color="#4A6CF7"
        initialPosition={0.08}
        crawlSpeed={200}
        height={5}
        crawl={true}
        showSpinner={true}
        easing="ease"
        speed={200}
        shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        template='<div class="bar" role="bar"><div class="peg"></div></div> 
                <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        zIndex={4000}
        showAtBottom={false}
      />
      <ToastContainer
        style={{
          zIndex: 3000,
        }}
      />
      <Providers>
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
      </Providers>{" "}
    </>
  );
}
