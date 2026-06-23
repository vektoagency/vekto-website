import { ImageResponse } from "next/og";

// Apple touch icon — 180×180 PNG. Same lockup as the favicon but at the
// iOS home-screen size. Without this, Safari falls back to a screenshot
// of the page which compounds the cropped-wordmark problem.

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
          background: "#080808",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -42,
            right: -42,
            width: 126,
            height: 126,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,255,0,0.28) 0%, rgba(200,255,0,0) 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -42,
            left: -42,
            width: 126,
            height: 126,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,255,0,0.12) 0%, rgba(200,255,0,0) 65%)",
          }}
        />
        <div
          style={{
            fontSize: 134,
            fontWeight: 900,
            color: "#c8ff00",
            letterSpacing: -6,
            lineHeight: 1,
            zIndex: 1,
            marginTop: -4,
          }}
        >
          V
        </div>
      </div>
    ),
    { ...size }
  );
}
