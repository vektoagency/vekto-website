import type { Metadata } from "next";
import { Old_Standard_TT, Libre_Franklin } from "next/font/google";
import NewspaperHomepage from "./NewspaperHomepage";

const bodySerif = Old_Standard_TT({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-news-serif",
  display: "swap",
});
const uiSans = Libre_Franklin({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "800", "900"],
  variable: "--font-news-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — The Growth Chronicle",
  robots: { index: false, follow: false },
};

export default function PreviewNewspaperPage() {
  return (
    <div className={`${bodySerif.variable} ${uiSans.variable}`}>
      <NewspaperHomepage />
    </div>
  );
}
