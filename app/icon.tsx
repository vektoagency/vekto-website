import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Square favicon (512×512) using the real VEKTO wordmark — read from
// public/images/logo.webp and rendered centred on a black square with
// generous side padding so the wordmark NEVER gets edge-cropped by
// downstream renderers (email preview cards, browser tabs, app tiles).
// The old static app/icon.png was a landscape wordmark stretched into
// a square — small clients cropped to the centre and only the 'K'
// survived. This version preserves the wordmark intact at every size.

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
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
              "radial-gradient(circle, rgba(200,255,0,0.22) 0%, rgba(200,255,0,0) 65%)",
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
              "radial-gradient(circle, rgba(200,255,0,0.10) 0%, rgba(200,255,0,0) 65%)",
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
