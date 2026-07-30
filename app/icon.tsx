import { ImageResponse } from "next/og";

// Favicon — 512×512, matches apple-icon so browser-tab, Viber, Slack,
// and iMessage all pull the same lockup: full-bleed lime tile with a
// heavy black 'V' filling the canvas. User asked to revert to the V
// letterform ('върни favicon-а с V буквата').

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
