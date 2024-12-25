import { Credentials } from "./credentials";
export const awsCognitoConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: Credentials.cognito.userPoolClientId,
      region: Credentials.cognito.region,
      userPoolId: Credentials.cognito.userPoolId,
      identityPoolId: Credentials.cognito.identityPoolId,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_AWS_SOCIAL_LOGIN_DOMAIN,
          scopes: ["email", "profile", "openid"],
          redirectSignIn: [process.env.NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_IN_URL],
          redirectSignOut: [
            process.env.NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_OUT_URL,
          ],
          responseType: "token",
        },
      },
      username: true,
      email: true,
    },
  },
  Storage: {
    S3: {
      bucket: Credentials.S3.bucket,
      region: Credentials.cognito.region,
    },
  },
};
