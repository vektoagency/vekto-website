import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Apple touch icon — 512×512.
//
// Real VEKTO wordmark on a dark tile with corner ambient lime glows.
// See opengraph-image.tsx for why we load public/images/logo.png
// (Satori's image loader doesn't decode WebP).

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const logoData = await readFile(
    join(process.cwd(), "public/images/logo.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

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
          style={{ objectFit: "contain", zIndex: 1 }}
        />
      </div>
    ),
    { ...size }
  );
}
