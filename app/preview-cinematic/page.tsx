import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Comic_Neue,
  Space_Grotesk,
  Onest,
  Balsamiq_Sans,
} from "next/font/google";
import CinematicHomepage from "./CinematicHomepage";
import BrutalismHomepage from "../preview-brutalism/BrutalismHomepage";
import ResponsiveVariant from "./ResponsiveVariant";

// Font strategy: the display/comic Latin faces carry a Cyrillic-capable face
// in second position for per-glyph fallback. The pixel role moved from
// VT323/Pixelify (near-unreadable at label sizes, especially the Cyrillic)
// to IBM Plex Mono — same instrument-terminal character, real legibility,
// one face for both scripts.
const pixelMono = IBM_Plex_Mono({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "700"], variable: "--f-cine-pixel", display: "swap" });
const comicLat = Comic_Neue({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--f-cine-comic-lat", display: "swap" });
const displayLat = Space_Grotesk({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "700"], variable: "--f-cine-display-lat", display: "swap" });
const comicCyr = Balsamiq_Sans({ subsets: ["cyrillic", "latin"], weight: ["400", "700"], variable: "--f-cine-comic-cyr", display: "swap" });
const displayCyr = Onest({ subsets: ["cyrillic", "latin"], weight: ["400", "500", "700"], variable: "--f-cine-display-cyr", display: "swap" });

export const metadata: Metadata = {
  title: "VEKTO — C01",
  robots: { index: false, follow: false },
};

export default function PreviewCinematicPage() {
  return (
    <div
      className={[
        pixelMono.variable, comicLat.variable, displayLat.variable,
        comicCyr.variable, displayCyr.variable,
      ].join(" ")}
      style={
        {
          "--cine-display": "var(--f-cine-display-lat), var(--f-cine-display-cyr), system-ui, sans-serif",
          "--cine-pixel": "var(--f-cine-pixel), ui-monospace, monospace",
          "--cine-comic": "var(--f-cine-comic-lat), var(--f-cine-comic-cyr), system-ui, sans-serif",
          // The mobile variant renders BrutalismHomepage, which reads the
          // --brutal-* stacks. Both pages load the exact same faces, so the
          // aliases resolve to the already-loaded --f-cine-* variables — no
          // extra font payload.
          "--brutal-display": "var(--f-cine-display-lat), var(--f-cine-display-cyr), system-ui, sans-serif",
          "--brutal-pixel": "var(--f-cine-pixel), ui-monospace, monospace",
          "--brutal-comic": "var(--f-cine-comic-lat), var(--f-cine-comic-cyr), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <ResponsiveVariant film={<CinematicHomepage />} brutalism={<BrutalismHomepage />} />
    </div>
  );
}
