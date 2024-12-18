export const awsCognitoConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
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
};
