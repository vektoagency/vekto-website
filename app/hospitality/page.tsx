import type { Metadata } from "next";
import { IBM_Plex_Mono, Comic_Neue, Space_Grotesk, Noto_Sans_Thai } from "next/font/google";
import { OG_IMAGE } from "../lib/og";
import HospitalityClient from "./HospitalityClient";

// /hospitality — the /cv format cut down for hotels and villa owners in
// Thailand: hero, the work, what we do for a property, contact. English and
// Thai only (its own toggle, outside the site's BG/EN system - the middleware
// pins the site chrome to English on this route). Thai needs its own face:
// none of the site's display fonts carry Thai glyphs.

const pixelMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--f-pixel", display: "swap" });
const comicLat = Comic_Neue({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--f-comic-lat", display: "swap" });
const displayLat = Space_Grotesk({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "700"], variable: "--f-display-lat", display: "swap" });
const thai = Noto_Sans_Thai({ subsets: ["thai", "latin"], weight: ["400", "500", "700", "900"], variable: "--f-thai", display: "swap" });

const title = "VEKTO — Video for hotels and villas";
const description = "Short vertical video, direct booking pages and ads for hotels, resorts and villas. Client work from VEKTO.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { images: [OG_IMAGE], title, description, type: "website" },
};

export default function HospitalityPage() {
  return (
    <div
      className={[pixelMono.variable, comicLat.variable, displayLat.variable, thai.variable].join(" ")}
      style={
        {
          "--brutal-display": "var(--f-display-lat), var(--f-thai), system-ui, sans-serif",
          "--brutal-pixel": "var(--f-pixel), var(--f-thai), ui-monospace, monospace",
          "--brutal-comic": "var(--f-comic-lat), var(--f-thai), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <HospitalityClient />
    </div>
  );
}
