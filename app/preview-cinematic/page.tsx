import type { Metadata } from "next";
import {
  VT323,
  Comic_Neue,
  Space_Grotesk,
  Onest,
  Pixelify_Sans,
  Balsamiq_Sans,
} from "next/font/google";
import CinematicHomepage from "./CinematicHomepage";

// Same font strategy as /preview-brutalism: none of the Latin faces below
// ships a Cyrillic subset, and Bulgarian is the default language here too, so
// each stack carries a Cyrillic-capable face in second position for per-glyph
// fallback. Without it the entire BG page renders in the system UI font.
const pixelLat = VT323({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--f-cine-pixel-lat", display: "swap" });
const comicLat = Comic_Neue({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--f-cine-comic-lat", display: "swap" });
const displayLat = Space_Grotesk({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "700"], variable: "--f-cine-display-lat", display: "swap" });
const pixelCyr = Pixelify_Sans({ subsets: ["cyrillic", "latin"], weight: ["400", "700"], variable: "--f-cine-pixel-cyr", display: "swap" });
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
        pixelLat.variable, comicLat.variable, displayLat.variable,
        pixelCyr.variable, comicCyr.variable, displayCyr.variable,
      ].join(" ")}
      style={
        {
          "--cine-display": "var(--f-cine-display-lat), var(--f-cine-display-cyr), system-ui, sans-serif",
          "--cine-pixel": "var(--f-cine-pixel-lat), var(--f-cine-pixel-cyr), ui-monospace, monospace",
          "--cine-comic": "var(--f-cine-comic-lat), var(--f-cine-comic-cyr), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <CinematicHomepage />
    </div>
  );
}
