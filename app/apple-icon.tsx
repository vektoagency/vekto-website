import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Apple touch icon — 180×180 PNG. Same lockup as the favicon (VEKTO
// wordmark centred on black with ambient lime glow). Without this,
// Safari falls back to a screenshot of the page on iOS home-screen
// add-to-home, which compounds the cropped-wordmark problem.

export const size = { width: 180, height: 180 };
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
          background: "#080808",
          position: "relative",
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
              "radial-gradient(circle, rgba(200,255,0,0.22) 0%, rgba(200,255,0,0) 65%)",
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
              "radial-gradient(circle, rgba(200,255,0,0.10) 0%, rgba(200,255,0,0) 65%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="VEKTO"
          width={140}
          height={46}
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
