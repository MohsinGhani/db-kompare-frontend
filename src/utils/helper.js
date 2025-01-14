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

export const stripHtml = (html) => {
  if (typeof window !== "undefined") {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  return html.replace(/<[^>]*>?/gm, "").trim();
};

export function generateCommonMetadata({
  title,
  description,
  imageUrl = "https://db-kompare-dev.s3.eu-west-1.amazonaws.com/db-kompare-banner.jpg",
  siteName = "DB Kompare",
  type = "website",
}) {
  const desc =
    description ||
    "DB Kompare is a comprehensive platform designed to simplify the process of comparing over 300 different database systems. Whether you're a developer, business analyst, or IT professional, DB Kompare provides powerful tools to evaluate and compare the performance, scalability, features, and suitability of various databases. With real-time rankings based on search engine results from Google, Bing, Stack Overflow, and other sources, users can make data-driven decisions when selecting the ideal database for their needs. Additionally, DB Kompare features an extensive collection of blogs and articles that cover in-depth insights, tutorials, and the latest trends for each of the 300+ databases listed on the platform. Our database tools and comparison engine also provide accurate, up-to-date data, including performance benchmarks, user reviews, and feature analysis. Whether you're migrating to a new database or optimizing your current system, DB Kompare makes it easier than ever to find the right database solution for your projects.";

  return {
    title: `${title} | ${siteName}`,
    description: desc,
    openGraph: {
      title: `${title} | ${siteName}`,
      description: desc,
      type: type,
      images: [
        {
          url: imageUrl || "",
          width: 1200,
          height: 630,
          alt: title || "Default Image Alt",
        },
      ],
      siteName: siteName,
    },
  };
}
export const convertHtmlToText = (html) => {
  return html?.replace(/<[^>]+>/g, "");
};

export function replaceKeywords(text) {
  if (typeof text !== "string") return text;
  const replacements = {
    DBMS: "DB",
    "Navigational DB": "Hierarchial DB",
    "Wide column store": "Columnar DB",
  };
  let output = text;
  Object.entries(replacements).forEach(([searchValue, replaceValue]) => {
    const regex = new RegExp(searchValue, "gi");
    output = output.replace(regex, replaceValue);
  });
  return output;
}
