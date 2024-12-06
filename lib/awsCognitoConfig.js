export const awsCognitoConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
      loginWith: {
        oauth: {
          scopes: ["email", "profile", "openid"],
          redirectSignIn: "http://localhost:3000/",
          redirectSignOut: "http://localhost:3000/",
          responseType: "token",
        },
      },
      username: true,
      email: true,
    },
  },
};
