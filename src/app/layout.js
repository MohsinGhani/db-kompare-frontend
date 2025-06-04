import ClientLayout from "./client-layout";
import "@/style/global.scss";
import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "DB Kompare",
    template: "%s | DB Kompare",
  },
  description: "Database comparison platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/assets/icons/Animation-loader.gif"
          type="image/gif"
        />
      </head>
      <body
        className={`${inter.className} ${plusJakartaSans.className} bg-white min-h-screen`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
