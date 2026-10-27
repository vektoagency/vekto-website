import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Comic_Neue,
  Space_Grotesk,
  Onest,
  Balsamiq_Sans,
} from "next/font/google";
import NotFoundBody from "./NotFoundBody";

// 404 — a wrong address used to land on Next's bare screen: no header, no
// wordmark, no way back. It now belongs to the site, and it offers the
// three exits someone who mistyped or followed a dead link actually
// wants: home, the work, or the form.

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
  title: "Page not found — VEKTO",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <NotFoundBody
      fontClass={[
        pixelMono.variable,
        comicLat.variable,
        displayLat.variable,
        comicCyr.variable,
        displayCyr.variable,
      ].join(" ")}
    />
  );
}
