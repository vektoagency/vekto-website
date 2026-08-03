import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import SwissHomepage from "./SwissHomepage";

// IBM Plex Sans has a strong Vignelli/Neue Haas Grotesk feel and ships
// full Cyrillic subsets — Space Grotesk (our first pick) doesn't.
const display = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-swiss-display",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-swiss-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — 01",
  robots: { index: false, follow: false },
};

export default function PreviewSwissPage() {
  return (
    <div className={`${display.variable} ${mono.variable}`}>
      <SwissHomepage />
    </div>
  );
}
