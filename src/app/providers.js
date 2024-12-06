//src/app/providers.js

"use client";

import { store } from "@/redux/store";
import { ApolloWrapper } from "../../lib/ApolloWrapper";
import { Provider } from "react-redux";
export function Providers({ children }) {
  return (
    <Provider store={store}>
      <ApolloWrapper>{children}</ApolloWrapper>
    </Provider>
  );
}
