import CodeVerification from "@/components/view/Auth/VerificationCode";
import React from "react";
export const metadata = {
  title: {
    absolute: "Verification | DB Kompare",
  },
};
export default function page() {
  return <CodeVerification />;
}