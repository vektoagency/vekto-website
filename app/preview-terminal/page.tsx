import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import TerminalHomepage from "./TerminalHomepage";

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-terminal-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — Terminal",
  robots: { index: false, follow: false },
};

export default function PreviewTerminalPage() {
  return (
    <div className={mono.variable}>
      <TerminalHomepage />
    </div>
  );
}
