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
  return <StartClient />;
}
