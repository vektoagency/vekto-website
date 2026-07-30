import { ImageResponse } from "next/og";

// Apple touch icon — 512×512, full-bleed lime tile with a heavy black
// 'V' filling the canvas edge to edge. User asked to revert to the V
// letterform after trying the wordmark variant ('върни favicon-а с V
// буквата'). Single letter reads sharp at every compact-card avatar
// size (32-96 px) where the wordmark shrinks past legibility.

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
