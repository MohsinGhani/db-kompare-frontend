export const awsCognitoConfig = {
  Auth: {
    Cognito: {
      identityPoolId: "eu-west-1:eb4a0ba6-4288-4e55-a2d4-f2ec72b8173e",
      region: "us-east-1",
      userPoolId: "eu-west-1_In5JyXEjQ",
      userPoolWebClientId: "5tktcqkj26tvc3kh92uo53d7m7",

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
