import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

// Below-the-fold client components — defer their hydration JS so the
// initial route bundle stays lean. Still SSR'd, so HTML appears
// immediately and SEO is unaffected. Only Navbar + Hero hydrate
// eagerly; the rest stream in as the user scrolls.
const SectionNav = dynamic(() => import("./components/SectionNav"));
const Clients = dynamic(() => import("./components/Clients"));
const Services = dynamic(() => import("./components/Services"));
const Stats = dynamic(() => import("./components/Stats"));
const WhyVekto = dynamic(() => import("./components/WhyVekto"));
const Process = dynamic(() => import("./components/Process"));
const Contact = dynamic(() => import("./components/Contact"));
const ContactModal = dynamic(() => import("./components/ContactModal"));
const Footer = dynamic(() => import("./components/Footer"));

export default function Home() {
  return (
    <>
      <Navbar />
      <SectionNav />
      <main>
        <Hero />
        <Clients />
        <Services />
        <Stats />
        <WhyVekto />
        <Process />
        <Contact />
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
