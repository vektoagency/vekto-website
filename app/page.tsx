import type { Metadata } from "next";
import { OG_IMAGE } from "./lib/og";
import {
  IBM_Plex_Mono,
  Comic_Neue,
  Space_Grotesk,
  Onest,
  Balsamiq_Sans,
} from "next/font/google";
import BrutalismHomepage from "./preview-brutalism/BrutalismHomepage";

// ============================================================================
// HOMEPAGE — the brutalism funnel IS the site now. Same component the
// /preview-brutalism route serves; this route carries the real, indexable
// metadata. The previous lime homepage lives on in page.tsx.old-lime-backup
// and its components still power /work, /websites and the other legacy
// routes until they are re-themed.
// ============================================================================

// Font strategy: display/comic Latin faces carry a Cyrillic-capable face in
// second position for per-glyph fallback; the pixel/instrument role is IBM
// Plex Mono, which covers both scripts in one face.
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
  title: "VEKTO — Криейтиви, фунии и AI на едно място",
  description:
    "Един екип за криейтиви, фунии и AI решения. 50+ бизнеса в портфолиото, 500+ видеа на месец. Запази 30-минутен разговор — безплатно.",
  openGraph: {
    images: [OG_IMAGE],
    title: "VEKTO — Криейтиви, фунии и AI на едно място",
    description:
      "Един екип за криейтиви, фунии и AI решения. 50+ бизнеса в портфолиото, 500+ видеа на месец.",
    url: "https://vektoagency.com",
    siteName: "VEKTO",
    locale: "bg_BG",
    alternateLocale: ["en_US"],
    type: "website",
  },
};

export default function HomePage() {
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
      <BrutalismHomepage />
    </div>
  );
}
