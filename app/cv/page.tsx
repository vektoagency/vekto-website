import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Comic_Neue,
  Space_Grotesk,
  Onest,
  Balsamiq_Sans,
} from "next/font/google";
import { OG_IMAGE } from "../lib/og";
import CvClient from "./CvClient";

// /cv — the presentation page a partner agency hands to its own clients:
// who VEKTO is, the four teams, the work, the brands, the cases. It
// carries no funnel — no header nav, no CTAs, no footer links — because
// the person reading it is the partner's client, not ours. noindex, and
// unlinked from the rest of the site; it travels by URL.

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
  title: "VEKTO — Представяне",
  description: "Кои сме, какво правим и за кого. Криейтиви, уебсайтове, стратегия и AI решения.",
  robots: { index: false, follow: false },
  openGraph: {
    images: [OG_IMAGE],
    title: "VEKTO — Представяне",
    description: "Кои сме, какво правим и за кого.",
  },
};

export default function CvPage() {
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
      <CvClient />
    </div>
  );
}
