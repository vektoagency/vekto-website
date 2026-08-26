import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Square 800×800 share card: the wordmark on the film's jet ground, and
// nothing else. Everything the card used to carry — headline, claims,
// domain, region line — competed with the mark at thumbnail size, which
// is the size this image is actually seen at.
//
// IMPORTANT: Satori's image loader handles PNG / JPEG / SVG but not
// WebP, so this reads the PNG copy of the wordmark rather than the WebP
// the rest of the site uses — a WebP data URI fails at build time with a
// cryptic 'u2 is not iterable' from Satori's decode step.

export const alt = "VEKTO";
export const size = { width: 800, height: 800 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "#0d0d0d",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={440} height={74} style={{ objectFit: "contain" }} />
      </div>
    ),
    { ...size }
  );
}
