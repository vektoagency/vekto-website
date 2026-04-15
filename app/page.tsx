import Navbar from "./components/Navbar";
import SectionNav from "./components/SectionNav";
import Hero from "./components/Hero";
import Clients from "./components/Clients";
import Services from "./components/Services";
import Stats from "./components/Stats";
import WhyVekto from "./components/WhyVekto";
import Work from "./components/Work";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

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
        <Work />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
