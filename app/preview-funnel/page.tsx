import type { Metadata } from "next";
import { Playfair_Display, Manrope, JetBrains_Mono } from "next/font/google";
import FunnelHomepage from "./FunnelHomepage";

// Playfair Display has full Cyrillic + dramatic display cuts — Fraunces
// was our first pick but ships Latin/Vietnamese only, would break BG copy.
const serif = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-funnel-serif",
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-funnel-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-funnel-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — Влизаш във фунията",
  robots: { index: false, follow: false },
};

export default function PreviewFunnelPage() {
  return (
    <div className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <FunnelHomepage />
    </div>
  );
}
