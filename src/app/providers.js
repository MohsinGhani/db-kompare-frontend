"use client";

import { ApolloWrapper } from "../../lib/ApolloWrapper";

export function Providers({ children }) {
  return <ApolloWrapper>{children}</ApolloWrapper>;
}
