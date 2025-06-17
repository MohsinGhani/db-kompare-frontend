"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useSelector } from "react-redux";
import { Image } from "antd";
import { handleFetchAuthSession } from "@/utils/authServices";
import { isAdmin } from "@/utils/helper";

const getHash = () =>
  typeof window !== "undefined" ? window.location.hash : "";

const AuthFlowHandler = () => {
  const [loader, setLoader] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hash, setHash] = useState(getHash());
  const { userDetails } = useSelector((state) => state.auth);
  const user = userDetails?.data?.data || null;
  const router = useRouter();

  const hasAuthError = hash.includes("error_description");

  // ensure we run only on the client
  useEffect(() => {
    setIsClient(true);
    setHash(getHash());
  }, []);

  const performAuth = async () => {
    if (!hasAuthError) {
      try {
        await handleFetchAuthSession();
      } catch (err) {
        console.error("Auth session fetch failed:", err);
      }
    }
  };

  useEffect(() => {
    setLoader(true);

    // 1) kick off the OAuth callback fetch if needed
    if (!hasAuthError && !userDetails) {
      performAuth();
      return;
    }

    // 2) once we have a user (and no error), redirect:
    if (!hasAuthError && userDetails) {
      // pull out any saved post-login path
      const customPath = localStorage.getItem("customOAuthState");
      localStorage.removeItem("customOAuthState");

      // first, by role:
      if (isAdmin(userDetails.data.data.role)) {
        router.replace("/admin/quiz");
        return;
      } else {
        router.replace("/");
      }

      // then override if we had a specific target:
      if (customPath) {
        router.replace(customPath);
      }
    }
  }, [userDetails, hasAuthError, router]);

  if (!isClient) return null;

  return (
    <div className="mx-auto flex h-screen w-full max-w-[800px] items-center justify-center">
      {hasAuthError && (
        <div className="text-center font-[500]">
          There was an issue with your profile. Please email{" "}
          <span className="text-primary">dbkompare@gmail.com</span> with your
          registered username or email address. We will try to resolve your
          issue ASAP. Thank you!
        </div>
      )}

      {loader && !hasAuthError && !userDetails && (
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
