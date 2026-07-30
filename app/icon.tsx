import { ImageResponse } from "next/og";

// Apple touch icon — bumped 180×180 → 512×512.
//
// Facebook Messenger, iMessage, and iOS Share Sheet all cache and
// UPSCALE the apple-touch-icon for their compact link cards. At the
// old 180×180 resolution, the letter edges pixelated visibly when
// the client stretched to 256×256 or 300×300 display sizes. 512×512
// is the largest apple-touch-icon size iOS/PWAs consume, so serving
// that gives the browser + messenger clients plenty of downscale
// headroom — no upscale = no jagged edges.
//
// Design stays the same: full-bleed lime tile with a heavy black V
// that fills the canvas edge-to-edge, subtle gradient for depth.

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
          position: "relative",
          fontFamily: "sans-serif",
          background:
            "linear-gradient(160deg, #d4ff33 0%, #c8ff00 45%, #b0e600 100%)",
          overflow: "hidden",
        }}
      >
        {/* Bold black V — proportions scale with the canvas: fontSize
            = 90% of side, letterSpacing negative to hug the tile
            edges. At 512 that's fontSize:512 letterSpacing:-28. */}
        <div
          style={{
            fontSize: 512,
            fontWeight: 900,
            color: "#0a0a0a",
            letterSpacing: -28,
            lineHeight: 1,
            marginTop: 22,
          }}
        >
          V
        </div>
      </div>
    ),
    { ...size }
  );
}
