import type { Metadata } from "next";
import { OG_IMAGE } from "../lib/og";
import dynamic from "next/dynamic";
import SiteHeader from "../components/SiteHeader";
import WebsitesClient from "./WebsitesClient";

const Contact = dynamic(() => import("../components/Contact"));
const Footer = dynamic(() => import("../components/Footer"));
const ContactModal = dynamic(() => import("../components/ContactModal"));

// Dedicated /websites page — deep dive on the web design + development
// capability. Presents the pillar as a standalone service so leads
// arriving via search / referrals with a website-specific brief land
// on a page that speaks their language, not the growth-partner
// umbrella hero.
export const metadata: Metadata = {
  title: "VEKTO — Websites and landing pages",
  description:
    "We design and build fast, high-converting websites, from a landing page to a full e-commerce store. Next.js, Shopify, Webflow. Live in 3-6 weeks.",
  openGraph: {
    images: [OG_IMAGE],
    title: "VEKTO — Websites and landing pages",
    description:
      "Fast, high-converting websites, from a landing page to full e-commerce. Next.js, Shopify, Webflow.",
    type: "website",
  },
};

export default function WebsitesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <WebsitesClient />
        <Contact />
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
