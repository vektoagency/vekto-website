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
      <head>
        {/* Preload the Mac GLB + portfolio reel assets so the CRT portfolio
            animation fires instantly on first click. */}
        <link rel="preload" as="fetch" href="/models/mac-128k.glb" type="model/gltf-binary" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/images/hero-anim/video-1s.webp" />
        <link rel="preload" as="image" href="/images/hero-anim/video-2s.webp" />
        <link rel="preload" as="image" href="/images/hero-anim/video-4s.webp" />
        <link rel="preload" as="image" href="/images/hero-anim/video-5s.webp" />
        {/* Warm up Bunny Stream connections so thumbnails + the iframe
            player don't pay DNS/TLS cost the moment the reel opens. */}
        <link rel="preconnect" href="https://vz-5279644d-ac4.b-cdn.net" crossOrigin="" />
        <link rel="preconnect" href="https://iframe.mediadelivery.net" crossOrigin="" />
        <link rel="dns-prefetch" href="https://video.bunnycdn.com" />
      </head>
      <body className="min-h-full flex flex-col bg-[#080808] text-[#f5f5f5]">
        {children}
        <TransitionBridge />
      </body>
    </html>
  );
}
