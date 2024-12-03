import "./globals.css";
import ClientLayout from "./client-layout";

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
      <body className="font-sans bg-white min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
