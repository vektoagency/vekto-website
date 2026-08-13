import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Square 800×800 OG image — designed to feel like a snapshot of the
// homepage hero. Renders on Vercel via next/og (Satori).
//
// IMPORTANT: Satori's built-in image loader supports PNG / JPEG / SVG
// but not WebP. We read a PNG copy of the wordmark (public/images/
// logo.png) instead of the WebP variant the rest of the site uses.
// Loading a WebP data URI inside ImageResponse fails at build time
// with a cryptic 'u2 is not iterable' from Satori's decode step.

export const alt = "VEKTO — Независима агенция за растеж";
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
          flexDirection: "column",
          background: "#080808",
          padding: 64,
          position: "relative",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Ambient lime glows — same treatment as the actual hero mesh */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -220,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(244,244,244,0.28) 0%, rgba(244,244,244,0) 62%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -240,
            left: -240,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(244,244,244,0.14) 0%, rgba(244,244,244,0) 62%)",
          }}
        />

        {/* Vector-arrow field — 5 diagonal lime lines, same motif as
            the hero SVG. Kept subtle so the headline stays dominant. */}
        <svg
          width="800"
          height="800"
          viewBox="0 0 800 800"
          style={{ position: "absolute", inset: 0, opacity: 0.35 }}
        >
          <defs>
            <marker
              id="og-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f4f4f4" />
            </marker>
          </defs>
          <g stroke="#f4f4f4" strokeWidth="1.6" fill="none" markerEnd="url(#og-arrow)">
            <line x1="60" y1="720" x2="220" y2="540" />
            <line x1="180" y1="800" x2="340" y2="620" />
            <line x1="500" y1="800" x2="660" y2="620" />
            <line x1="620" y1="720" x2="780" y2="540" />
            <line x1="120" y1="200" x2="280" y2="60" />
          </g>
        </svg>

        {/* Top: logo + eyebrow pill (same lockup as the hero header) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="VEKTO"
            width={230}
            height={76}
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(244,244,244,0.4)",
              borderRadius: 999,
              padding: "8px 16px",
              fontSize: 15,
              color: "#f4f4f4",
              letterSpacing: 2.6,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#f4f4f4",
                display: "block",
              }}
            />
            Growth Agency
          </div>
        </div>

        {/* Middle: dominant headline with lime accent */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            zIndex: 1,
            marginTop: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 66,
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: -2,
              color: "#f5f5f5",
              marginBottom: 28,
            }}
          >
            <span>12 нови бизнеса на година.</span>
            <span style={{ color: "#f4f4f4" }}>Твоят следващ.</span>
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#a0a0a0",
              maxWidth: 660,
              lineHeight: 1.45,
            }}
          >
            50+ бизнеса в България и САЩ. 4.8× среден ROAS.
            Един екип, един стандарт — от стратегия до резултат.
          </div>
        </div>

        {/* Bottom bar: domain + placement */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1,
            paddingTop: 18,
            borderTop: "1px solid rgba(244,244,244,0.18)",
            fontSize: 18,
            color: "#6a6560",
          }}
        >
          <span
            style={{
              color: "#f4f4f4",
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            vektoagency.com
          </span>
          <span style={{ fontFamily: "monospace", letterSpacing: 3 }}>
            BULGARIA · US
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
