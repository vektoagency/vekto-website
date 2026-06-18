import type { Metadata } from "next";
import StartClient from "./StartClient";

export const metadata: Metadata = {
  title: "Get Started — VEKTO",
  description:
    "Tell us about your brand — we reply in 24 hours. AI-driven creative agency for cinematic, UGC, and product video at scale.",
  openGraph: {
    title: "Get Started — VEKTO",
    description:
      "Tell us about your brand — we reply in 24 hours. AI-driven creative agency for cinematic, UGC, and product video at scale.",
  },
};

export default function StartPage() {
  return (
    <>
      {/* Resource hints — Next 16 / React 19 hoist these <link>
          tags to <head>. The hints fire during the HTML parse,
          before JS hydration, cutting ~100-300ms off first paint
          of logos + first Cal.com booking interaction. */}
      <link
        rel="preload"
        as="image"
        href="/images/logo.webp"
        fetchPriority="high"
      />
      <link rel="preconnect" href="https://app.cal.com" crossOrigin="" />
      <link rel="preconnect" href="https://cal.com" crossOrigin="" />
      <link rel="dns-prefetch" href="https://connect.facebook.net" />
      <StartClient />
    </>
  );
}
