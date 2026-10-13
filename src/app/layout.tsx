import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর | Bazar Dor",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর ও দামের পরিবর্তন এক নজরে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body
        className={`${hindSiliguri.className} flex min-h-screen flex-col antialiased`}
      >
        <div className="sticky top-0 z-50 w-full">
          <Navbar />
        </div>

        <div className="flex-1">
          {children}
        </div>

        <Toaster position="top-right" />

        <Footer />
      </body>
    </html>
  );
}
