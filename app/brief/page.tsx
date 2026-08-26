import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Comic_Neue,
  Space_Grotesk,
  Onest,
  Balsamiq_Sans,
} from "next/font/google";
import BriefClient from "./BriefClient";

// Same three font roles the homepage and /start carry, so the brief sits
// in the film's world rather than the theme it was born in.
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
  title: "Бриф за проект — VEKTO",
  openGraph: {
    title: "Бриф за проект — VEKTO",
  },
};

export default function BriefPage() {
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
      <BriefClient />
    </div>
  );
}
