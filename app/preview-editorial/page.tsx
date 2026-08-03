import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import EditorialHomepage from "./EditorialHomepage";

// Preview route for the editorial design direction. Isolated fonts +
// isolated styles so it doesn't affect the live homepage until we
// decide to promote it.
//
// Playfair Display (classic broadsheet/magazine serif — think Time,
// Vogue templates) + DM Sans for body. Both ship Cyrillic subsets,
// which the Instrument Serif family we tried first does not.

const displaySerif = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-editorial-serif",
  display: "swap",
});

const bodySans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-editorial-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — Editorial preview",
  robots: { index: false, follow: false },
};

export default function PreviewEditorialPage() {
  return (
    <div className={`${displaySerif.variable} ${bodySans.variable}`}>
      <EditorialHomepage />
    </div>
  );
}
