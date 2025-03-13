export const Credentials = {
  cognito: {
    region: process.env.NEXT_PUBLIC_REGION || "",
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || "",
    userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || "",
    identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || "",
  },
  S3: {
    bucket: process.env.NEXT_PUBLIC_BUCKET,
  },
};
