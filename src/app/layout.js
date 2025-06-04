import ClientLayout from "./client-layout";
import "@/style/global.scss"
import "./globals.css";
import { Mea_Culpa } from "next/font/google";

const meaCulpa = Mea_Culpa({
  weight: ["400", "700"],
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
         {/* <link
          href="https://fonts.googleapis.com/css2?family=Mea+Culpa&family=Plus+Jakarta+Sans:wght@200;400;600;800&display=swap"
          rel="stylesheet"
        /> */}
      </head>
      <body className={`${meaCulpa.className} bg-white min-h-screen`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
