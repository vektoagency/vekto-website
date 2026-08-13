import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import dynamic from "next/dynamic";
import PortfolioClient from "./PortfolioClient";

// Footer hydrates after first paint — non-critical, below the fold.
const Footer = dynamic(() => import("../components/Footer"));

export const metadata: Metadata = {
  title: "Портфолио — VEKTO",
  description:
    "Selected work — кинематографични филми, UGC, продуктови видеа и AI кампании за бизнеси в България и САЩ.",
  openGraph: {
    title: "Портфолио — VEKTO",
    description:
      "Selected work — кинематографични филми, UGC, продуктови видеа и AI кампании за бизнеси в България и САЩ.",
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
