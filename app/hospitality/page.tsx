import type { Metadata } from "next";
import { OG_IMAGE } from "../lib/og";
import SiteHeader from "../components/SiteHeader";
import dynamic from "next/dynamic";
import HospitalityClient from "./HospitalityClient";

// Footer hydrates after first paint — non-critical, below the fold.
const Footer = dynamic(() => import("../components/Footer"));

const title = "Hospitality — VEKTO";
const description =
  "Video, direct booking pages and paid ads for hotels, resorts and villas. Client work from VEKTO.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [OG_IMAGE],
    title,
    description,
    type: "website",
  },
};

export default function HospitalityPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-20 bg-[#080808]">
        <HospitalityClient />
      </main>
      <Footer />
    </>
  );
}
