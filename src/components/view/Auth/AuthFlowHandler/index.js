"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useSelector } from "react-redux";
import { Image } from "antd";
import { handleFetchAuthSession } from "@/utils/authServices";
import { isAdmin } from "@/utils/helper";

const getHash = () =>
  typeof window !== "undefined" ? window.location.hash : undefined;

const AuthFlowHandler = () => {
  const [loader, setLoader] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hash, setHash] = useState(getHash());
  const { userDetails } = useSelector((state) => state.auth);
  const user = userDetails?.data?.data || null;
  const router = useRouter();
  const routerRef = useRef("{}");

  const has_auth_error = hash?.includes("error_description");

  const authFlowHandler = async () => {
    if (!has_auth_error) {
      try {
        await handleFetchAuthSession();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const customOAuthState = localStorage.getItem("customOAuthState");
    if (customOAuthState) routerRef.current = customOAuthState;
    return () => {
      localStorage.removeItem("customOAuthState");
    };
  }, [router]);

  useEffect(() => {
    setLoader(true);
    if (!userDetails && !has_auth_error) {
      authFlowHandler();
    } else if (userDetails && !has_auth_error) {
      if (isAdmin(userDetails?.data?.data?.role)) {
        console.log("Admin user");
        router.replace("/admin/quiz");
      } else {
        router.replace("/");
      }
    }
  }, [userDetails, router]);

  useEffect(() => {
    if (user) {
      const query = routerRef.current;
      router.replace(`${query || "/"}`);
    }
  }, [user]);

  if (!isClient) return null;

  return (
    <div className="mx-auto flex h-screen w-full max-w-[800px] items-center justify-center">
      {has_auth_error && (
        <div className="text-center font-[500]">
          There was an issue with your profile. Please email{" "}
          <span className="text-primary">dbkompare@gmail.com</span> with your
          registered username or email address. We will try to resolve your
          issue ASAP. Thank you!
        </div>
      )}

      {loader && !has_auth_error && !userDetails && (
        <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2">
          <Image
            src="/assets/icons/Animation-loader.gif"
            alt="logo"
            width={100}
            height={100}
            preview={false}
          />
        </div>
      )}
    </div>
  );
};

export default AuthFlowHandler;
