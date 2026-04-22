import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import TransitionBridge from "./components/TransitionBridge";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vektoagency.com"),
  title: "VEKTO — AI-Driven Vision for the Future of Companies",
  description:
    "From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.",
  openGraph: {
    title: "VEKTO — AI-Driven Vision for the Future of Companies",
    description:
      "From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.",
    url: "https://vektoagency.com",
    siteName: "VEKTO",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VEKTO — AI-Driven Vision for the Future of Companies",
    description:
      "From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.",
  },
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
        <TransitionBridge />
      </body>
    </html>
  );
}
