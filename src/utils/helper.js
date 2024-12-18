import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const getAmplifyUserToken = () => {
  const getAcceessToken = Object.keys(localStorage || []).filter((k) =>
    k.includes("accessToken")
  );
  return localStorage.getItem(getAcceessToken[0]);
};

export const setAccessTokenFromLocalStorage = () => {
  const accessToken = getAmplifyUserToken();

  if (accessToken) {
    Cookies.set("accessToken", accessToken, { expires: 1, secure: true });
  }
};

export const RemoveAccessTokenFormCookies = () => {
  Cookies.remove("accessToken");
};

export const setCookieHandler = (accessToken) => {
  const decode = jwtDecode(accessToken);
  const expires = new Date(decode.exp * 1000);

  Cookies.set("accessToken", accessToken, { expires, secure: true });
};
