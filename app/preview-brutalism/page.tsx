import type { Metadata } from "next";
import {
  VT323,
  Comic_Neue,
  Space_Grotesk,
  Onest,
  Pixelify_Sans,
  Balsamiq_Sans,
} from "next/font/google";
import BrutalismHomepage from "./BrutalismHomepage";

// ---------------------------------------------------------------------------
// LATIN FACES — the intended look.
// ---------------------------------------------------------------------------
const pixelLat = VT323({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--f-pixel-lat",
  display: "swap",
});
const comicLat = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--f-comic-lat",
  display: "swap",
});
const displayLat = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--f-display-lat",
  display: "swap",
});

// ---------------------------------------------------------------------------
// CYRILLIC FACES — required, not optional.
//
// None of the three faces above ships a Cyrillic subset. Verified against
// next/font's own font-data manifest:
//   Space Grotesk -> latin, latin-ext, vietnamese
//   VT323         -> latin, latin-ext, vietnamese
//   Comic Neue    -> latin
// Bulgarian is this page's DEFAULT language, so without a Cyrillic-capable
// face in each stack the entire BG version — headline included — silently
// renders in the system UI font and none of the typography design applies.
//
// Listing a Cyrillic face SECOND in each stack gives per-glyph fallback:
// Latin characters keep the intended face, Cyrillic characters get a
// matched substitute. Brand names stay Latin in both languages, so mixed
// strings still render correctly.
//
// Substitutes chosen for closest character match:
//   Onest         ~ Space Grotesk (geometric grotesk, same weight range)
//   Pixelify Sans ~ VT323         (pixel/terminal face)
//   Balsamiq Sans ~ Comic Neue    (casual marker face)
// ---------------------------------------------------------------------------
const displayCyr = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--f-display-cyr",
  display: "swap",
});
const pixelCyr = Pixelify_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
  variable: "--f-pixel-cyr",
  display: "swap",
});
const comicCyr = Balsamiq_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
  variable: "--f-comic-cyr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEKTO — B01",
  robots: { index: false, follow: false },
};

export default function PreviewBrutalismPage() {
  return (
    <div
      className={[
        pixelLat.variable,
        comicLat.variable,
        displayLat.variable,
        pixelCyr.variable,
        comicCyr.variable,
        displayCyr.variable,
      ].join(" ")}
      // Composite stacks live on the same element as the font variables so
      // both halves resolve. Components reference only these three.
      style={
        {
          "--brutal-display":
            "var(--f-display-lat), var(--f-display-cyr), system-ui, sans-serif",
          "--brutal-pixel":
            "var(--f-pixel-lat), var(--f-pixel-cyr), ui-monospace, monospace",
          "--brutal-comic":
            "var(--f-comic-lat), var(--f-comic-cyr), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <BrutalismHomepage />
    </div>
  );
}
