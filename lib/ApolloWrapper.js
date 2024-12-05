// lib/ApolloWrapper.js
"use client";

import { Amplify } from "aws-amplify";
import { awsCognitoConfig } from "./awsCognitoConfig";

export const ApolloWrapper = ({ children }) => {
  Amplify.configure({ ...awsCognitoConfig, srr: true });

  return <>{children}</>;
};
