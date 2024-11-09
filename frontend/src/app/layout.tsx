import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Head from "next/head";

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
      <body>{children}</body>
    </html>
  );
}
