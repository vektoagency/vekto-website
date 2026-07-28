import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Square 800×800 OG image — designed to feel like a snapshot of the
// homepage hero (dark bg + lime accents + big multi-line headline +
// trust-badge row + vector-arrow field in the background). User
// specifically asked for this vibe: 'като истинския сайт heroто'.
//
// Every messenger crops slightly differently, so all copy stays inside
// the middle 70% safe area.

export const alt = "VEKTO — AI маркетинг агенция";
export const size = { width: 800, height: 800 };
export const contentType = "image/png";

export default async function Image() {
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
          flexDirection: "column",
          background: "#080808",
          padding: 64,
          position: "relative",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Ambient lime glows — top-right + bottom-left, same treatment
            as the actual hero mesh background */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -220,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,255,0,0.28) 0%, rgba(200,255,0,0) 62%)",
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
              "radial-gradient(circle, rgba(200,255,0,0.14) 0%, rgba(200,255,0,0) 62%)",
          }}
        />

        {/* Vector-arrow field — 5 diagonal lime lines in the background,
            same visual motif as the hero SVG. Kept subtle so headline
            stays dominant. */}
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
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#c8ff00" opacity="0.55" />
            </marker>
          </defs>
          <g
            stroke="#c8ff00"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#og-arrow)"
          >
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
            width={150}
            height={50}
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(200,255,0,0.4)",
              borderRadius: 999,
              padding: "8px 16px",
              fontSize: 15,
              color: "#c8ff00",
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
                background: "#c8ff00",
                display: "block",
              }}
            />
            AI Creative Agency
          </div>
        </div>

        {/* Middle: dominant headline with lime accent — same 'lime
            highlight word' treatment the hero uses */}
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
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: -2,
              color: "#f5f5f5",
              marginBottom: 28,
            }}
          >
            <span>AI видеа и реклами,</span>
            <span
              style={{
                color: "#c8ff00",
                filter: "drop-shadow(0 0 26px rgba(200,255,0,0.5))",
              }}
            >
              които продават.
            </span>
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#a0a0a0",
              maxWidth: 640,
              lineHeight: 1.45,
            }}
          >
            Кинематографични спотове, UGC и AI-задвижени кампании — за
            30+ бранда в България и САЩ.
          </div>
        </div>

        {/* Trust badges row — same three the hero uses */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            zIndex: 1,
            marginBottom: 20,
            fontSize: 15,
            color: "#cfcbc4",
            fontWeight: 500,
          }}
        >
          {[
            "30+ доволни бранда",
            "4.8× среден ROAS",
            "Без ангажимент",
          ].map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{b}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar: domain + placement */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1,
            paddingTop: 18,
            borderTop: "1px solid rgba(200,255,0,0.18)",
            fontSize: 18,
            color: "#6a6560",
          }}
        >
          <span
            style={{
              color: "#c8ff00",
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            vektoagency.com
          </span>
          <span style={{ fontFamily: "monospace", letterSpacing: 3 }}>
            SOFIA · GLOBAL
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
