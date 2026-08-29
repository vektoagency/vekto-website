import type { Metadata } from "next";
import { OG_IMAGE } from "../lib/og";
import dynamic from "next/dynamic";
import SiteHeader from "../components/SiteHeader";
import AICreativeHero from "./AICreativeHero";
import AIServicesGrid from "./AIServicesGrid";

// Below-the-fold sections lazy-loaded so the hero + AI services paint
// fast on cold entry (same pattern as the homepage).
const Clients = dynamic(() => import("../components/Clients"));
const Stats = dynamic(() => import("../components/Stats"));
const Contact = dynamic(() => import("../components/Contact"));
const Footer = dynamic(() => import("../components/Footer"));
const ContactModal = dynamic(() => import("../components/ContactModal"));

// Dedicated AI-Creative page — the old 'AI визия за бъдещето на бизнеса ти'
// hero + 4-AI-services grid, now living on its own route. Umbrella
// homepage promotes VEKTO as a full-stack growth studio; this subpage
// deep-dives on the AI creative capability specifically for visitors
// who arrive via AI-video-focused ads or referrals.
export const metadata: Metadata = {
  title: "VEKTO — AI Creative",
  description:
    "Кинематографични филми, кратки видеа, AI аватари и продуктови визуализации — създадени с AI на скорост и цена, каквито традиционните продукции не могат.",
  openGraph: {
    images: [OG_IMAGE],
    title: "VEKTO — AI Creative",
    description:
      "Кинематографични филми, кратки видеа, AI аватари и продуктови визуализации — създадени с AI.",
    type: "website",
  },
};

export default function AICreativePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <AICreativeHero />
        <Clients />
        <AIServicesGrid />
        <Stats />
        <Contact />
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
