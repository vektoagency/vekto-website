import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import CalInit from "./CalInit";
import WorkClient from "./WorkClient";

export const metadata: Metadata = {
  title: "Work — VEKTO",
  description:
    "Selected projects — brands we helped scale through cinematic storytelling, AI visuals and data-driven creative strategy.",
};

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <CalInit />
      <main className="relative z-[5]">
        <WorkClient />
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
