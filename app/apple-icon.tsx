import { ImageResponse } from "next/og";

// Apple touch icon — 180×180 PNG. iOS home-screen and many chat / link
// preview clients (Messenger, iMessage, Discord) prefer apple-touch-icon
// over the favicon for the small avatar tile. The square wordmark version
// shrinks the 'VEKTO' letters to the point of illegibility at 32-48 px
// avatar sizes those clients render at, so this lockup uses a single
// heavy 'V' letterform that stays sharp all the way down.
//
// The browser-tab favicon stays as the original wordmark app/icon.png —
// that's a different surface where the wordmark crop is acceptable.

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
        {/* Ambient lime glow — reads as a branded mark instead of a
            flat letterform when the icon is shown on a light surface
            (e.g. Messenger preview cards). */}
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
