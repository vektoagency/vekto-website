import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import FigmaHomepage from "./FigmaHomepage";

const sans = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-figma-sans",
  display: "swap",
});
const mono = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-figma-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — Studio",
  robots: { index: false, follow: false },
};

export default function PreviewFigmaPage() {
  return (
    <div className={`${sans.variable} ${mono.variable}`}>
      <FigmaHomepage />
    </div>
  );
}
