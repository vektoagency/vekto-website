import type { Metadata } from "next";
import { VT323, Comic_Neue, Space_Grotesk } from "next/font/google";
import BrutalismHomepage from "./BrutalismHomepage";

const pixel = VT323({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-brutal-pixel",
  display: "swap",
});
const comic = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-brutal-comic",
  display: "swap",
});
const groteskDisplay = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-brutal-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — B01",
  robots: { index: false, follow: false },
};

export default function PreviewBrutalismPage() {
  return (
    <div className={`${pixel.variable} ${comic.variable} ${groteskDisplay.variable}`}>
      <BrutalismHomepage />
    </div>
  );
}
