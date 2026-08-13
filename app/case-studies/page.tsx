import type { Metadata } from "next";
import dynamic from "next/dynamic";
import SiteHeader from "../components/SiteHeader";
import CaseStudiesClient from "./CaseStudiesClient";

const Contact = dynamic(() => import("../components/Contact"));
const Footer = dynamic(() => import("../components/Footer"));
const ContactModal = dynamic(() => import("../components/ContactModal"));

// /case-studies — deep proof surface. Different from /portfolio (video
// reel) — this is narrative + metrics for premium buyers who want to
// see 'what did you deliver, for whom, how much did it move the
// needle.' Individual case study pages live at /case-studies/[slug];
// this index shows the grid.
export const metadata: Metadata = {
  title: "VEKTO — Case Studies",
  description:
    "Реални резултати за реални бизнеси. Растеж, приходи, ROAS — как сме помогнали на 50+ бизнеса в България и САЩ.",
  openGraph: {
    title: "VEKTO — Case Studies",
    description:
      "Реални резултати за реални бизнеси. Растеж, приходи, ROAS.",
    type: "website",
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <CaseStudiesClient />
        <Contact />
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
