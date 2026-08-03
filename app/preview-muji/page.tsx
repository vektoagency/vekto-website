import type { Metadata } from "next";
import { EB_Garamond, Manrope } from "next/font/google";
import MujiHomepage from "./MujiHomepage";

const serif = EB_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-muji-serif",
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-muji-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — Studio",
  robots: { index: false, follow: false },
};

export default function PreviewMujiPage() {
  return (
    <div className={`${serif.variable} ${sans.variable}`}>
      <MujiHomepage />
    </div>
  );
}
