// This File for ALL AUTENTICATION HELPER FUNCTIONS

// ——————————————————————————————
//  PRACTICE SQL QUERY RELATED API CALLS
// ——————————————————————————————



import {
  fetchUserAttributes,
  signInWithRedirect,
  fetchAuthSession,
} from "aws-amplify/auth";
import { setCookieHandler } from "./helper";

const getAmplifyUserToken = () => {
  const getAcceessToken = Object.keys(localStorage || []).filter((k) =>
    k.includes("accessToken")
  );
  return localStorage.getItem(getAcceessToken[0]);
};

export const handleLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await signIn({
        username: email,
        password,
      });
      let attributes = {};

      if (user.nextStep.signInStep === "DONE") {
        attributes = await fetchUserAttributes();
        const jwtToken = getAmplifyUserToken();
        setCookieHandler(jwtToken);
      }

      resolve({
        ...user,
        attributes,
      });
    } catch (e) {
      reject(e);
    }
  });
};
export const socialRegisteration = async (provider, customState) => {
  const details = {
    provider,
  };
  if (customState) {
    details["customState"] = customState;
  }

  return signInWithRedirect(details);
};

export const handleFetchAuthSession = async () => {
  try {
    await fetchAuthSession();
    const accessToken = getAmplifyUserToken();
    setCookieHandler(accessToken);
  } catch (e) {
    throw e;
  }
};
