import Cookies from "js-cookie";

export const setAccessTokenFromLocalStorage = () => {
  const accessToken = localStorage.getItem(
    "CognitoIdentityServiceProvider.3oagb86hl2rn7vk8btdhiiltt9.9275b414-60b1-7035-ccb2-a5fee4c69985.accessToken"
  );

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
