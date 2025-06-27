"use client";

import CommonWrapper from "@/components/shared/CommonWrapper";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./CheckoutForm";
import { useSelector } from "react-redux";
const options = {
  mode: "payment",
  amount: 1099,
  currency: "usd",
  // Fully customizable with appearance API.
  appearance: {
    /*...*/
  },
};
const Payment = () => {
    const { userDetails } = useSelector((state) => state.auth);
  const user = userDetails?.data?.data;
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);
  return (
    <CommonWrapper className="h-[calc(100vh-112px)] flex items-center justify-center w-full ">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm user={user} />
      </Elements>
    </CommonWrapper>
  );
};

export default Payment;
