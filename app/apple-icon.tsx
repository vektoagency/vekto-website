import { ImageResponse } from "next/og";

// Apple touch icon — 512×512, full-bleed lime tile with a heavy black
// chevron 'V' drawn as an SVG path. Uses SVG stroke instead of a text
// glyph so the letter thickness, endpoints, and proportions are pixel-
// exact and don't depend on whatever fallback font Satori picks.
// Result: much more solid + chunky than the text version.

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(160deg, #d4ff33 0%, #c8ff00 45%, #b0e600 100%)",
          overflow: "hidden",
        }}
      >
        <svg width="512" height="512" viewBox="0 0 512 512">
          {/* Two diagonal bars meeting at the bottom centre.
              strokeWidth 160 gives ~31% of the canvas as letter
              thickness — reads as a solid mark, not a delicate glyph.
              strokeLinejoin='miter' keeps the bottom tip razor sharp;
              strokeLinecap='butt' keeps the top ends flat so the V
              hugs the top edge of the tile. */}
          <path
            d="M 92 88 L 256 448 L 420 88"
            stroke="#0a0a0a"
            strokeWidth="160"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
