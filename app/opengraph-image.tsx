import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Square 800×800 OG image → Facebook Messenger / iMessage / iOS Share
// Sheet render this as a COMPACT link card (icon on left + copy on
// right) rather than the tall landscape hero card. Matches the look
// the user asked for (ROIimpact-style compact preview).
//
// Design: centred VEKTO wordmark, lime tagline pill, headline +
// sub-copy, domain footer. Every message client crops slightly
// differently, so the important stuff stays inside the middle 60%
// safe area.

export const alt = "VEKTO — AI маркетинг агенция";
export const size = { width: 800, height: 800 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/images/logo.webp"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#080808",
          padding: 72,
          position: "relative",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Ambient lime glow — top-right */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -180,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,255,0,0.24) 0%, rgba(200,255,0,0) 65%)",
          }}
        />
        {/* Ambient lime glow — bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -200,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,255,0,0.14) 0%, rgba(200,255,0,0) 65%)",
          }}
        />

        {/* Top eyebrow — status pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(200,255,0,0.4)",
            borderRadius: 999,
            padding: "10px 22px",
            fontSize: 20,
            color: "#c8ff00",
            letterSpacing: 3,
            textTransform: "uppercase",
            fontWeight: 600,
            zIndex: 1,
            marginBottom: 42,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#c8ff00",
              display: "block",
            }}
          />
          AI Marketing Agency
        </div>

        {/* Logo — centred, dominant */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="VEKTO"
          width={360}
          height={120}
          style={{ objectFit: "contain", zIndex: 1, marginBottom: 46 }}
        />

        {/* Headline */}
        <div
          style={{
            fontSize: 50,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -1,
            textAlign: "center",
            color: "#f5f5f5",
            zIndex: 1,
            maxWidth: 640,
            marginBottom: 24,
          }}
        >
          Създаваме видеа и реклами,
          <br />
          <span style={{ color: "#c8ff00" }}>които продават.</span>
        </div>

        {/* Sub-copy */}
        <div
          style={{
            fontSize: 22,
            color: "#a0a0a0",
            textAlign: "center",
            maxWidth: 560,
            lineHeight: 1.45,
            zIndex: 1,
          }}
        >
          AI-задвижена маркетинг агенция за 30+ бранда в България и САЩ.
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: 46,
            display: "flex",
            gap: 14,
            alignItems: "center",
            zIndex: 1,
            fontSize: 20,
            color: "#c8ff00",
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          vektoagency.com
        </div>
      </div>
    ),
    { ...size }
  );
}
