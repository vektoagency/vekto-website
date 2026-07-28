import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Apple touch icon — 512×512.
//
// Uses the real VEKTO wordmark (public/images/logo.webp) centred on a
// black tile with a lime ambient glow. User rejected the invented V
// letterform ('нека излиза логото на векто, не това v').
//
// The wordmark ships as a WHITE wordmark on transparent (that's why it
// reads on the Navbar's dark backdrop), so the tile has to stay dark
// for it to be visible — a lime tile would wash the wordmark out.
// Corner glows keep the tile from reading as a flat black square when
// the messenger clients downscale it into a small compact-card avatar.

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const logoData = await readFile(
    join(process.cwd(), "public/images/logo.webp")
  );
  const logoSrc = `data:image/webp;base64,${logoData.toString("base64")}`;

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
          background: "#080808",
          overflow: "hidden",
        }}
      >
        {/* Ambient lime glow — top-right corner */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,255,0,0.30) 0%, rgba(200,255,0,0) 65%)",
          }}
        />
        {/* Ambient lime glow — bottom-left corner */}
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -120,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,255,0,0.14) 0%, rgba(200,255,0,0) 65%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="VEKTO"
          width={400}
          height={130}
          style={{
            objectFit: "contain",
            zIndex: 1,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
