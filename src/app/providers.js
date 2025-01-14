//src/app/providers.js
"use client";

import { store } from "@/redux/store";
import { ApolloWrapper } from "../../lib/ApolloWrapper";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
export function Providers({ children }) {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#3E53D7",
          },
          components: {
            Table: {
              padding: 10,
            },
          },
        }}
      >
        <ApolloWrapper>{children}</ApolloWrapper>
      </ConfigProvider>
    </Provider>
  );
}
