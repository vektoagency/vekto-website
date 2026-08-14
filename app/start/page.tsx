import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Comic_Neue,
  Space_Grotesk,
  Onest,
  Balsamiq_Sans,
} from "next/font/google";
import StartClient from "./StartClient";

// Same font strategy as the homepage — /start now speaks the same funnel
// language, so it carries the same three roles: display (Space Grotesk +
// Onest for Cyrillic), pixel/instrument (IBM Plex Mono, both scripts in
// one face), comic/body-notes (Comic Neue + Balsamiq). Identical config
// to app/page.tsx so Next dedupes the payloads.
const pixelMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--f-pixel",
  display: "swap",
});
const comicLat = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--f-comic-lat",
  display: "swap",
});
const displayLat = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--f-display-lat",
  display: "swap",
});
const displayCyr = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--f-display-cyr",
  display: "swap",
});
const comicCyr = Balsamiq_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
  variable: "--f-comic-cyr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Опиши проекта си — VEKTO",
  description:
    "Криейтиви, фунии и AI решения — всичко на едно място. Разкажи ни за бизнеса си — отговаряме лично до 24 часа.",
  openGraph: {
    title: "Опиши проекта си — VEKTO",
    description:
      "Криейтиви, фунии и AI решения — всичко на едно място. Разкажи ни за бизнеса си — отговаряме лично до 24 часа.",
  },
};

export default function StartPage() {
  return (
    <div
      className={[
        pixelMono.variable,
        comicLat.variable,
        displayLat.variable,
        comicCyr.variable,
        displayCyr.variable,
      ].join(" ")}
      style={
        {
          "--brutal-display":
            "var(--f-display-lat), var(--f-display-cyr), system-ui, sans-serif",
          "--brutal-pixel": "var(--f-pixel), ui-monospace, monospace",
          "--brutal-comic":
            "var(--f-comic-lat), var(--f-comic-cyr), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      {/* Resource hints — Next 16 / React 19 hoist these <link>
          tags to <head>. The hints fire during the HTML parse,
          before JS hydration, cutting ~100-300ms off first paint
          of logos + first Cal.com booking interaction. */}
      <link
        rel="preload"
        as="image"
        href="/images/logo.webp"
        fetchPriority="high"
      />
      <link rel="preconnect" href="https://app.cal.com" crossOrigin="" />
      <link rel="preconnect" href="https://cal.com" crossOrigin="" />
      <link rel="dns-prefetch" href="https://connect.facebook.net" />
      <StartClient />
    </div>
  );
}
