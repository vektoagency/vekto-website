import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "VEKTO — AI-Driven Vision for the Future of Companies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/images/logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#080808",
          padding: 80,
          position: "relative",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Ambient lime glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,255,0,0.22) 0%, rgba(200,255,0,0) 65%)",
          }}
        />
        {/* Ambient lime glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -200,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,255,0,0.12) 0%, rgba(200,255,0,0) 65%)",
          }}
        />

        {/* Top: logo + status pill */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="VEKTO" width={180} height={60} style={{ objectFit: "contain" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(200,255,0,0.35)",
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: 18,
              color: "#c8ff00",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#c8ff00", display: "block" }} />
            AI-Powered Creative Agency
          </div>
        </div>

        {/* Middle: headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ color: "#c8ff00" }}>AI-Driven Vision</span>
            <span style={{ color: "#f5f5f5" }}>for the Future</span>
            <span style={{ color: "#f5f5f5" }}>of Companies.</span>
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 26,
              color: "#a0a0a0",
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            From cinematic storytelling to AI-powered short-form systems — we
            create visual ecosystems built to scale.
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1,
            fontSize: 22,
            color: "#6a6560",
          }}
        >
          <span style={{ color: "#c8ff00", fontWeight: 700, letterSpacing: 2 }}>vektoagency.com</span>
          <span>Based in Bulgaria · Working worldwide</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
