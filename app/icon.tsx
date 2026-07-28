import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Favicon — 512×512 dynamic icon that overrides the static app/icon.png.
//
// Viber, Slack, and a few other messenger / link-preview clients pull
// the SITE FAVICON for their compact preview cards (not the apple-
// touch-icon that Facebook Messenger and iMessage use). Previously
// Viber was showing the old cropped-wordmark app/icon.png (rendered
// as a black tile with a chunky 'K' fragment). This variant unifies
// the two surfaces so every client renders the same wordmark-on-dark
// tile as the apple-icon.
//
// Dynamic .tsx takes precedence over static .png at the same route
// in Next.js metadata files, so the old icon.png is effectively
// shadowed as long as this file exists.

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
