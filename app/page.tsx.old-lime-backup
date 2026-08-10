import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import bunnyData from "./data/bunny-clips.json";
import { heroFeaturedClipIds } from "./data/hero-featured-clips";

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

// Resolve mobile hero clip URLs — used for the preload/prefetch hints
// below. Lives here (home page only) instead of in the root layout so
// /start and other routes don't waste bandwidth pre-fetching videos
// they'll never display. Saved ~2MB per /start landing.
type ClipRecord = { id: string; previewMp4: string | null; thumbnail: string | null };
function resolveHeroClip(clipId: string): { videoUrl: string | null; posterUrl: string | null } {
  const clip = (bunnyData.clips as ClipRecord[]).find((c) => c.id === clipId);
  const src = clip?.previewMp4 ?? null;
  const poster = clip?.thumbnail ?? null;
  const videoUrl = !src
    ? null
    : src.startsWith("/")
      ? src.replace(/\.mp4$/, "-480p.mp4")
      : src.replace("play_1080p.mp4", "play_480p.mp4");
  return { videoUrl, posterUrl: poster };
}
const firstHero = heroFeaturedClipIds[0]
  ? resolveHeroClip(heroFeaturedClipIds[0])
  : { videoUrl: null, posterUrl: null };
const nextHeroClips = heroFeaturedClipIds.slice(1, 4).map(resolveHeroClip);

export default function Home() {
  return (
    <>
      {/* Home-only head hints — Next 16 / React 19 hoists <link>
          elements declared inside Server Component output into <head>.
          Keeping them here (instead of root layout) ensures /start and
          every other route skip these video preloads entirely. */}
      {firstHero.posterUrl && (
        <link
          rel="preload"
          as="image"
          href={firstHero.posterUrl}
          fetchPriority="high"
          media="(max-width: 1023px)"
        />
      )}
      {firstHero.videoUrl && (
        <link
          rel="preload"
          as="video"
          href={firstHero.videoUrl}
          crossOrigin="anonymous"
          fetchPriority="high"
          media="(max-width: 1023px)"
        />
      )}
      {nextHeroClips.map((c, i) =>
        c.videoUrl ? (
          <link
            key={i}
            rel="prefetch"
            as="video"
            href={c.videoUrl}
            crossOrigin="anonymous"
            media="(max-width: 1023px)"
          />
        ) : null
      )}
      <link rel="preconnect" href="https://vz-5279644d-ac4.b-cdn.net" crossOrigin="" />
      <link rel="preconnect" href="https://iframe.mediadelivery.net" crossOrigin="" />
      <link rel="dns-prefetch" href="https://video.bunnycdn.com" />

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
