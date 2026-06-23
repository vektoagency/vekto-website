import { ImageResponse } from "next/og";

// Next.js auto-routes app/icon.{tsx,png,svg,...} as /icon and uses the
// largest match as the favicon. The dynamic .tsx variant takes precedence
// over the old static app/icon.png (kept around just in case some build
// step still picks it up — safe to delete later).
//
// 512×512 PNG. Black bg + lime "V" lockup. Designed to read cleanly at
// every fallback size where the previous landscape wordmark was getting
// cropped into a "K"-shaped fragment (email preview cards, browser tabs,
// app-switcher tiles, etc.). The padding + letter weight is tuned to
// stay legible down to a 16×16 favicon.

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
          background: "#080808",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Ambient lime glow — soft radial wash so the icon reads as a
            branded mark rather than a flat letterform. */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,255,0,0.28) 0%, rgba(200,255,0,0) 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -120,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,255,0,0.12) 0%, rgba(200,255,0,0) 65%)",
          }}
        />
        {/* The "V" mark. Heavy weight + tight tracking so it doesn't
            visually collapse at 32×32. */}
        <div
          style={{
            fontSize: 380,
            fontWeight: 900,
            color: "#c8ff00",
            letterSpacing: -16,
            lineHeight: 1,
            zIndex: 1,
            marginTop: -10,
          }}
        >
          V
        </div>
      </div>
    ),
    { ...size }
  );
}
