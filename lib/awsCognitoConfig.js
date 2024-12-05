export const awsCognitoConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: "3oagb86hl2rn7vk8btdhiiltt9",
      userPoolId: "eu-west-1_NGNKtdSEL",
      identityPoolId: "eu-west-1:983c266a-d70e-44ec-bd7a-7bd381ecba43",

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
