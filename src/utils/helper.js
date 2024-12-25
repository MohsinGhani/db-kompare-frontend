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
  const expires = new Date();
  expires.setDate(expires.getDate() + 1);
  if (accessToken) {
    Cookies.set("accessToken", accessToken, { expires, secure: true });
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

export const validateSession = () => {
  if (typeof window !== "undefined") {
    const cookieToken = Cookies.get("accessToken");
    const localStorageToken = getAmplifyUserToken();

    if (!cookieToken) {
      if (localStorageToken) {
        const getAcceessToken = Object.keys(localStorage || []).filter((k) =>
          k.includes("accessToken")
        );
        localStorage.removeItem(getAcceessToken[0]);
        window.location.reload();
      }

      return false;
    }

    return true;
  }
};

export const compressImage = (file, maxFileSize) => {
  const maxWidthOrHeight = 1000;
  maxFileSize = maxFileSize || 300;
  //if the file size is less than 300 KB'S then we can't compress the image
  if (file.size / 1024 < maxFileSize) return file;
  else {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        maxHeight: maxWidthOrHeight,
        maxWidth: maxWidthOrHeight,
        quality: 0.8,
        convertSize: 0,
        success(res) {
          resolve(res);
        },
        error(err) {
          reject(err);
        },
      });
    });
  }
};
