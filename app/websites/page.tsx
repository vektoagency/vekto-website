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
  title: "VEKTO — Уебсайтове и лендинг страници",
  description:
    "Проектираме и разработваме бързи, конверсионни уебсайтове — от лендинг до пълен ecom магазин. Next.js, Shopify, Webflow. Стартиране за 3-6 седмици.",
  openGraph: {
    images: [OG_IMAGE],
    title: "VEKTO — Уебсайтове и лендинг страници",
    description:
      "Бързи, конверсионни уебсайтове — от лендинг до пълен ecom. Next.js, Shopify, Webflow.",
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
