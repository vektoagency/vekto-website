import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import CinemaHomepage from "./CinemaHomepage";

const displaySerif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-cinema-serif",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-cinema-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — Reel",
  robots: { index: false, follow: false },
};

export default function PreviewCinemaPage() {
  return (
    <div className={`${displaySerif.variable} ${mono.variable}`}>
      <CinemaHomepage />
    </div>
  );
}
