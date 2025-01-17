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

export const toolMatchesFilters = (tool, filters) => {
  for (const key in filters) {
    const filterVal = filters[key];
    if (filterVal === "DoesNotMatter" || filterVal == null) continue;
    switch (key) {
      case "AccessControl":
        if (tool.access_control?.toLowerCase() !== filterVal.toLowerCase())
          return false;
        break;
      case "VersionControl":
        if (tool.version_control?.toLowerCase() !== filterVal.toLowerCase())
          return false;
        break;
      case "SupportForWorkflow":
        if (
          tool.support_for_workflow?.toLowerCase() !== filterVal.toLowerCase()
        )
          return false;
        break;
      case "WebAccess":
        if (tool.web_access?.toLowerCase() !== filterVal.toLowerCase())
          return false;
        break;

      case "DeploymentOption":
        if (`${tool.deployment_options_on_prem_or_saas}` !== `${filterVal}`)
          return false;
        break;

      case "CustomizationPossible":
        if (
          tool.customization_possible?.toLowerCase() !== filterVal.toLowerCase()
        )
          return false;
        break;

      case "UserCreatedTags":
        if (
          tool.user_created_tags_comments?.toLowerCase() !==
          filterVal.toLowerCase()
        )
          return false;
        break;

      case "ModernWaysOfDeployment":
        if (`${tool?.modern_ways_of_deployment}` !== `${filterVal}`)
          return false;
        break;
      case "IntegrationWithUpstream": {
        const filterArray = Array.isArray(filterVal) ? filterVal : [filterVal];

        if (filterArray.length === 0) break;

        const toolVal =
          tool.api_integration_with_upstream_downstream_systems?.toLowerCase();

        if (!filterArray.some((val) => toolVal === val.toLowerCase())) {
          return false;
        }
        break;
      }

      case "AuthenticationProtocolSupported": {
        const filterArray = Array.isArray(filterVal) ? filterVal : [filterVal];

        if (filterArray.length === 0) break;

        const toolVal = tool.authentication_protocol_supported;

        if (!filterArray.some((val) => `${toolVal}` === `${val}`)) {
          return false;
        }
        break;
      }

      case "FreeCommunityEdition": {
        const filterArray = Array.isArray(filterVal) ? filterVal : [filterVal];

        if (filterArray.includes("DoesNotMatter")) break;

        if (filterArray.length === 0) break;

        const toolVal = tool.free_community_edition;
        if (!filterArray.some((val) => `${toolVal}` === `${val}`)) {
          return false;
        }
        break;
      }

      default:
        break;
    }
  }
  return true;
};

export function formatLabel(label) {
  return label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function timeSinceLastUpdate() {
  const now = new Date();

  const utcNow = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  const lastUpdate = new Date(
    utcNow.getFullYear(),
    utcNow.getMonth(),
    utcNow.getDate(),
    12,
    0,
    0
  );

  if (utcNow < lastUpdate) {
    lastUpdate.setDate(lastUpdate.getDate() - 1);
  }

  const diffMillis = utcNow - lastUpdate;
  const diffMinutes = Math.floor(diffMillis / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMinutes > 0)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  return "Just now";
}
