// lib/ApolloWrapper.js
"use client";

import { Amplify } from "aws-amplify";
import { awsCognitoConfig } from "./awsCognitoConfig";
import { Hub } from "aws-amplify/utils";

export const ApolloWrapper = ({ children }) => {
  Amplify.configure({ ...awsCognitoConfig, srr: true });

  Hub.listen("auth", ({ payload: { event, data } }) => {
    switch (event) {
      case "customOAuthState":
        localStorage.setItem("customOAuthState", data);
    }
  });
  
  return <>{children}</>;
};
