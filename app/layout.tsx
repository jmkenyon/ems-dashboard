import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ToastProvider } from "./providers/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EMS Tool Suite",
  description: "Troubleshoot EMS queries faster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">

      <body className={inter.className}>
      <ToastProvider />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
