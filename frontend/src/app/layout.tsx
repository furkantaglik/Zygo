import type { Metadata } from "next";
import "./globals.css";
import SWRProvider from "./SWRProvider";

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
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
