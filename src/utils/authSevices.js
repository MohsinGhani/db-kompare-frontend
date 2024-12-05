import {
  signIn,
  fetchUserAttributes,
  signOut,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  updatePassword,
  fetchAuthSession,
} from "aws-amplify/auth";

// Helper function to get the JWT token from local storage
const getJWTTokenFromLocalStorage = () => {
  const accessTokenKey = Object.keys(localStorage || []).find((k) =>
    k.includes("accessToken")
  );
  return accessTokenKey ? localStorage.getItem(accessTokenKey) : null;
};

export const handleSignup = (user) => {
  const { password, username, ...resAttributes } = user;

  return signUp({
    username,
    password,
    attributes: resAttributes, // `attributes` is the correct key for user attributes
  });
};

export const handleConfirmSignUp = async (
  username,
  confirmationCode,
  country
) => {
  const params = {
    username,
    confirmationCode,
    ...(country && {
      clientMetadata: {
        country,
      },
    }),
  };

  try {
    const result = await confirmSignUp(
      username,
      confirmationCode,
      params.options
    );
    return result;
  } catch (error) {
    throw new Error(error.message || "Confirmation failed");
  }
};

export const resendSignUpHandler = (username) => {
  return resendSignUpCode(username); // No need to wrap this in an object
};

export const handleLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await signIn(email, password); // `signIn` does not take an object
      let attributes = {};

      if (user.nextStep.signInStep === "DONE") {
        attributes = await fetchUserAttributes();
        const jwtToken = getJWTTokenFromLocalStorage(); // Retrieve token from local storage
        // setCookieHandler(jwtToken); // If you want to handle token cookies, you can uncomment this
      }

      resolve({
        ...user,
        attributes,
      });
    } catch (e) {
      reject(e.message || "Login failed");
    }
  });
};

export const handleLogout = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await signOut({ global: true });
      resolve(true);
    } catch (error) {
      reject(error.message || "Logout failed");
    }
  });
};

export const handleForgotPassword = (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await resetPassword(username);
      resolve(response);
    } catch (e) {
      reject(e.message || "Forgot password failed");
    }
  });
};

export const handleConfirmResetPassword = (username, code, newPassword) => {
  return confirmResetPassword(username, code, newPassword); // Pass the arguments directly
};

export const isLoggedIn = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const jwtToken = getJWTTokenFromLocalStorage();

      if (jwtToken) {
        const { tokens } = await fetchAuthSession();
        // setCookieHandler(jwtToken); // If you want to handle token cookies, you can uncomment this
        resolve(tokens.idToken.payload); // You can also return the payload or other token info
      } else {
        throw new Error("Not logged in");
      }
    } catch (e) {
      await signOut();
      reject("Not logged in");
    }
  });
};

export const handleChangePassword = (oldPassword, newPassword) => {
  return updatePassword(oldPassword, newPassword); // Correct arguments passed directly
};

// Placeholder for verifyEmail
export const verifyEmail = async (email) => {
  // Assuming you might want to send a verification code or use another method
  try {
    // Example: Send an email verification or call another API
    // This part needs further details to implement
    console.log(`Verifying email: ${email}`);
  } catch (e) {
    throw new Error(e.message || "Email verification failed");
  }
};
