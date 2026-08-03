import type { Metadata } from "next";
import { Bruno_Ace, Rubik_Mono_One, Manrope } from "next/font/google";
import VaporwaveHomepage from "./VaporwaveHomepage";

const chrome = Rubik_Mono_One({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: "400",
  variable: "--font-vapor-chrome",
  display: "swap",
});
const display = Bruno_Ace({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vapor-display",
  display: "swap",
});
const body = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-vapor-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — Sunset Cut",
  robots: { index: false, follow: false },
};

export default function PreviewVaporwavePage() {
  return (
    <div className={`${chrome.variable} ${display.variable} ${body.variable}`}>
      <VaporwaveHomepage />
    </div>
  );
}
