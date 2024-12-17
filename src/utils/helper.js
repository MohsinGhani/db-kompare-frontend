import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const getJWTTokenFromLocalStorage = () => {
  const getAcceessToken = Object.keys(localStorage || []).filter((k) =>
    k.includes("accessToken")
  );
  return localStorage.getItem(getAcceessToken[0]);
};

export const setAccessTokenFromLocalStorage = () => {
  const accessToken = getJWTTokenFromLocalStorage();

  if (accessToken) {
    console.log("Access Token from Local Storage:", accessToken);
    Cookies.set("accessToken", accessToken, { expires: 1, secure: true });
  } else {
    console.log("No accessToken found in local storage.");
  }
};

export const RemoveAccessTokenFormCookies = () => {
  Cookies.remove("accessToken");
};

export const setCookieHandler = (token) => {
  const decode = jwtDecode(token);
  const expires = new Date(decode.exp * 1000);

  Cookies.set("token", token, { expires, secure: true });
};
