import type { Metadata } from "next";
import { IBM_Plex_Serif, JetBrains_Mono } from "next/font/google";
import BlueprintHomepage from "./BlueprintHomepage";

const serif = IBM_Plex_Serif({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-blueprint-serif",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-blueprint-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — Drawing A-101",
  robots: { index: false, follow: false },
};

export default function PreviewBlueprintPage() {
  return (
    <div className={`${serif.variable} ${mono.variable}`}>
      <BlueprintHomepage />
    </div>
  );
}
