import type { Metadata } from "next";
import { OG_IMAGE } from "../lib/og";
import SiteHeader from "../components/SiteHeader";
import dynamic from "next/dynamic";
import PortfolioClient from "./PortfolioClient";

// Footer hydrates after first paint — non-critical, below the fold.
const Footer = dynamic(() => import("../components/Footer"));

export const metadata: Metadata = {
  title: "Portfolio — VEKTO",
  description:
    "Selected work: cinematic films, UGC, product videos and AI campaigns for businesses in Bulgaria and the US.",
  openGraph: {
    images: [OG_IMAGE],
    title: "Portfolio — VEKTO",
    description:
      "Selected work: cinematic films, UGC, product videos and AI campaigns for businesses in Bulgaria and the US.",
    type: "website",
  },
};

export default function PortfolioPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-20 bg-[#080808]">
        <PortfolioClient />
      </main>
      <Footer />
    </>
  );
}
