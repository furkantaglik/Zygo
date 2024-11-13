import type { Metadata } from "next";
import "./globals.css";
import SWRProvider from "./SWRProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Zygo",
  description: "Sosyal Medya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="bottom-center" reverseOrder={false} />
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
