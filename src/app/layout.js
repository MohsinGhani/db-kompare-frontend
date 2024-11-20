import "./globals.css";
import ClientLayout from "./client-layout";  

export const metadata = {
  title: {
    absolute: '',
    default: "db kompare",
    template: "%s | db kompare"
  },
  description: "Database comparison platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/icons/Animation-loader.gif" type="image/gif" />
      </head>
      <body className="font-sans bg-white min-h-screen">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
