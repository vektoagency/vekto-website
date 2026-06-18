// Modern USB flash drive — fully detailed, 3D-looking, with VEKTO
// as the printed brand wordmark. Server-component-safe (no 'use
// client') so it server-renders inside the initial HTML and paints
// with the hero. Pure inline SVG + CSS 3D tilt/perspective + lime LED.
//
// Detail layers (front-to-back):
//   1. Body fill (5-stop matte-black gradient).
//   2. Left bevel highlight + right bevel shadow (3D depth illusion).
//   3. Top hairline + lime brand kiss + bottom shelf reflection.
//   4. Specular highlight clipped to body silhouette (CSS animated).
//   5. Engraved spec text near right edge (VKT-26 · 256GB).
//   6. Side micro-screws (corner detail).
//   7. LED pulse near connector edge.
//   8. VEKTO wordmark printed brand label.
//   9. Lanyard hole.
//  10. USB-A connector with brushed-steel face + 4 contact pins.

export default function FlashkaDrive() {
  return (
    <div className="flashka-drive-perspective" aria-hidden="true">
      <div className="flashka-drive-wrap">
        <svg
          className="flashka-drive-svg"
          viewBox="0 28 380 100"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
        >
          <defs>
            {/* Anodized-aluminum body — 6 stops for richer curvature. */}
            <linearGradient id="fdBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#2c2c2c" />
              <stop offset="12%"  stopColor="#1a1a1a" />
              <stop offset="35%"  stopColor="#0d0d0d" />
              <stop offset="55%"  stopColor="#080808" />
              <stop offset="82%"  stopColor="#161616" />
              <stop offset="100%" stopColor="#202020" />
            </linearGradient>
            {/* Brushed-steel USB-A connector */}
            <linearGradient id="fdSteel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#3a3a3a" />
              <stop offset="50%"  stopColor="#5e5e5e" />
              <stop offset="100%" stopColor="#252525" />
            </linearGradient>
            {/* Brushed pattern overlay on connector — vertical hairlines */}
            <pattern id="fdBrushed" x="0" y="0" width="2" height="42" patternUnits="userSpaceOnUse">
              <rect width="1" height="42" fill="rgba(255,255,255,0.08)" />
              <rect x="1" width="1" height="42" fill="rgba(0,0,0,0.08)" />
            </pattern>
            {/* LED bloom — bright core + soft halo */}
            <radialGradient id="fdLed" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#f5ffb0" stopOpacity="1" />
              <stop offset="20%"  stopColor="#eaff7a" stopOpacity="1" />
              <stop offset="55%"  stopColor="#c8ff00" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c8ff00" stopOpacity="0" />
            </radialGradient>
            {/* Body side-shading: thin gradient applied as overlay to
                give the body a curved-edge feel (lighter top, darker
                middle, lighter bottom). */}
            <linearGradient id="fdSideShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.05)" />
              <stop offset="50%"  stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
            </linearGradient>
            {/* Logo mask — alpha-channel mask. Small brand label
                positioned upper-center on the body. */}
            <mask id="fdLogoMask" style={{ maskType: "alpha" }}>
              <image
                href="/images/logo.webp"
                x="155" y="68"
                width="70" height="14"
                preserveAspectRatio="xMidYMid meet"
              />
            </mask>
            {/* Diagonal specular sweep gradient */}
            <linearGradient id="fdSpec" x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
              <stop offset="42%"  stopColor="rgba(255,255,255,0)" />
              <stop offset="50%"  stopColor="rgba(255,255,255,0.28)" />
              <stop offset="58%"  stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            {/* Body clipPath — keeps specular band inside silhouette */}
            <clipPath id="fdBodyClip">
              <rect x="70" y="44" width="240" height="70" rx="8" />
            </clipPath>
          </defs>

          {/* ===================== USB-A CONNECTOR (LEFT) ===================== */}
          {/* Connector base metal */}
          <rect
            x="22" y="58" width="48" height="42"
            fill="url(#fdSteel)"
            stroke="#1a1a1a" strokeWidth="0.5"
          />
          {/* Brushed-steel pattern overlay */}
          <rect x="22" y="58" width="48" height="42" fill="url(#fdBrushed)" opacity="0.45" />
          {/* Top edge highlight on connector */}
          <rect x="22" y="58" width="48" height="1" fill="rgba(255,255,255,0.22)" />
          {/* Bottom edge shadow on connector */}
          <rect x="22" y="99" width="48" height="1" fill="rgba(0,0,0,0.4)" />
          {/* Side edges */}
          <rect x="22" y="58" width="0.5" height="42" fill="rgba(255,255,255,0.15)" />
          <rect x="69.5" y="58" width="0.5" height="42" fill="rgba(0,0,0,0.45)" />
          {/* 4 contact pins inside the connector */}
          <rect x="30" y="66" width="32" height="4" fill="#0d0d0d" />
          <rect x="30" y="66" width="32" height="0.5" fill="rgba(255,255,255,0.18)" />
          <rect x="30" y="74" width="32" height="4" fill="#0d0d0d" />
          <rect x="30" y="74" width="32" height="0.5" fill="rgba(255,255,255,0.18)" />
          <rect x="30" y="82" width="32" height="4" fill="#0d0d0d" />
          <rect x="30" y="82" width="32" height="0.5" fill="rgba(255,255,255,0.18)" />
          <rect x="30" y="90" width="32" height="4" fill="#0d0d0d" />
          <rect x="30" y="90" width="32" height="0.5" fill="rgba(255,255,255,0.18)" />

          {/* ===================== DRIVE BODY ===================== */}
          {/* Main body */}
          <rect
            x="70" y="44" width="240" height="70" rx="8"
            fill="url(#fdBody)"
            stroke="#040404" strokeWidth="1"
          />
          {/* Side-shading overlay (top/bottom subtle highlight) */}
          <rect x="70" y="44" width="240" height="70" rx="8" fill="url(#fdSideShade)" />

          {/* Left bevel highlight — 3D depth illusion */}
          <rect x="71" y="46" width="1" height="66" fill="rgba(255,255,255,0.12)" />
          {/* Right bevel shadow — opposite side darker */}
          <rect x="308" y="46" width="1" height="66" fill="rgba(0,0,0,0.65)" />

          {/* Top hairline highlight — catches light */}
          <rect x="70" y="45" width="240" height="1.4" fill="rgba(255,255,255,0.18)" />
          {/* Lime brand kiss along the very top edge */}
          <rect x="70" y="48.5" width="240" height="1.6" fill="#c8ff00" opacity="0.65" />
          {/* Mid-body horizontal hairline — subtle product seam */}
          <rect x="70" y="78" width="240" height="0.4" fill="rgba(255,255,255,0.04)" />
          {/* Bottom shelf reflection */}
          <rect x="70" y="112" width="240" height="1.2" fill="rgba(255,255,255,0.1)" />
          {/* Dark bottom edge shadow */}
          <rect x="70" y="113" width="240" height="0.6" fill="rgba(0,0,0,0.5)" />

          {/* Specular highlight — sliding white band, clipped to body */}
          <g clipPath="url(#fdBodyClip)">
            <rect
              className="flashka-drive-spec"
              x="70" y="44" width="240" height="70"
              fill="url(#fdSpec)"
            />
          </g>

          {/* SMALL ACTIVITY LED — near connector side of body */}
          <g className="flashka-drive-led">
            <circle cx="98" cy="79" r="22" fill="url(#fdLed)" opacity="0.45" />
            <circle cx="98" cy="79" r="11" fill="url(#fdLed)" opacity="0.7" />
            <circle cx="98" cy="79" r="3.5" fill="#f5ffb0" />
            <circle cx="98" cy="79" r="3.5" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
          </g>

          {/* VEKTO WORDMARK — small printed brand label, upper-center */}
          <rect
            x="155" y="68"
            width="70" height="14"
            fill="#c8ff00"
            opacity="0.85"
            mask="url(#fdLogoMask)"
          />
          <rect
            x="155" y="68"
            width="70" height="14"
            fill="#c8ff00"
            opacity="0.22"
            mask="url(#fdLogoMask)"
            style={{ filter: "blur(1.5px)" }}
          />

          {/* Engraved spec text — small product info row below logo */}
          <text
            x="190" y="93"
            textAnchor="middle"
            fontFamily="ui-monospace, 'Geist Mono', monospace"
            fontSize="4.5"
            letterSpacing="0.8"
            fill="rgba(255,255,255,0.28)"
          >
            VKT-26-OS · 256GB · USB 3.2
          </text>

          {/* Capacity / model badge — tiny corner detail (top-right) */}
          <rect x="282" y="56" width="20" height="6" rx="1" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" />
          <text
            x="292" y="60.6"
            textAnchor="middle"
            fontFamily="ui-monospace, 'Geist Mono', monospace"
            fontSize="3.5"
            letterSpacing="0.5"
            fill="rgba(200,255,0,0.55)"
          >
            v.2026
          </text>

          {/* Corner micro-screws — tiny dark dots that suggest assembly */}
          <circle cx="76" cy="50" r="0.7" fill="rgba(0,0,0,0.7)" />
          <circle cx="76" cy="108" r="0.7" fill="rgba(0,0,0,0.7)" />
          <circle cx="304" cy="50" r="0.7" fill="rgba(0,0,0,0.7)" />
          <circle cx="304" cy="108" r="0.7" fill="rgba(0,0,0,0.7)" />

          {/* Lanyard hole near the right edge of body — recessed look */}
          <circle cx="298" cy="79" r="3.8" fill="rgba(0,0,0,0.85)" />
          <circle cx="298" cy="79" r="3.8" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
          <circle cx="298" cy="79" r="2.8" fill="#020202" />
        </svg>
      </div>
    </div>
  );
}
