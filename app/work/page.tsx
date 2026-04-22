import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import CalInit from "./CalInit";
import WorkComingSoon from "./WorkComingSoon";

export const metadata: Metadata = {
  title: "Work — VEKTO",
  description:
    "Our work showcase is coming soon — cinematic storytelling, AI visuals and data-driven creative strategy in one reel.",
};

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <CalInit />
      <main className="bg-[#0a0805]">
        <WorkComingSoon />
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
