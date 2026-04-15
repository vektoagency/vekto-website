import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "VEKTO — AI-Driven Vision for the Future of Brands",
  description:
    "From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <head />
      <body className="min-h-full flex flex-col bg-[#080808] text-[#f5f5f5]">
        {children}
      </body>
    </html>
  );
}
