import { ImageResponse } from "next/og";

// Favicon — 512×512, matches apple-icon. Full-bleed lime tile with a
// heavy black chevron 'V' drawn as an SVG stroke path (see apple-icon
// for why SVG instead of text).

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(160deg, #d4ff33 0%, #c8ff00 45%, #b0e600 100%)",
          overflow: "hidden",
        }}
      >
        <svg width="512" height="512" viewBox="0 0 512 512">
          <path
            d="M 92 88 L 256 448 L 420 88"
            stroke="#0a0a0a"
            strokeWidth="160"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
