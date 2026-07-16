import { ImageResponse } from "next/og";

// Apple touch icon — 180×180 PNG. Shown as the compact-card avatar tile
// in Messenger / iMessage / iOS Share Sheet / Discord etc.
//
// Design flip from earlier version: full-bleed LIME background with a
// bold BLACK V that fills the tile edge-to-edge. The previous
// black-bg / lime-V design read as a small letterform floating in dark
// space at compact-card sizes (32–64 px); this inverse reads as a
// proper branded app icon — the whole tile IS the mark.

export const size = { width: 180, height: 180 };
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
          position: "relative",
          fontFamily: "sans-serif",
          // Full-bleed lime with a very subtle top-lit gradient so the
          // tile has a tiny bit of depth instead of reading as a flat
          // colour swatch at large sizes.
          background:
            "linear-gradient(160deg, #d4ff33 0%, #c8ff00 45%, #b0e600 100%)",
          overflow: "hidden",
        }}
      >
        {/* Bold black V — sized to fill nearly the full tile height.
            fontSize is tuned so the cap height lands at ~90% of the
            canvas, no glyph padding. Negative letterSpacing tightens
            the mark against the tile edges. */}
        <div
          style={{
            fontSize: 180,
            fontWeight: 900,
            color: "#0a0a0a",
            letterSpacing: -10,
            lineHeight: 1,
            marginTop: 8,
          }}
        >
          V
        </div>
      </div>
    ),
    { ...size }
  );
}
