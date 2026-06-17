// Modern minimalist USB drive — single black body, USB-A connector on
// the left, VEKTO wordmark centered on the body, small lime LED. No
// cap, no seam. Matches the look of the ad creatives:
// matte-black product on dark with strong lime rim light + glow.
// Pure inline SVG + CSS 3D wobble + specular sweep + floor reflection.
// Server-component-safe (no 'use client') so it server-renders inside
// the initial HTML and paints with the hero.

export default function FlashkaDrive() {
  return (
    <div className="flashka-drive-perspective" aria-hidden="true">
      <div className="flashka-drive-wrap">
        <svg
          className="flashka-drive-svg"
          viewBox="0 28 380 170"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
        >
          <defs>
            {/* Anodized-aluminum body — top highlight, matte middle,
                bottom reflection edge. Five stops sell curvature. */}
            <linearGradient id="fdBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#2a2a2a" />
              <stop offset="18%"  stopColor="#171717" />
              <stop offset="50%"  stopColor="#0a0a0a" />
              <stop offset="82%"  stopColor="#161616" />
              <stop offset="100%" stopColor="#1f1f1f" />
            </linearGradient>
            {/* Brushed-steel USB-A connector */}
            <linearGradient id="fdSteel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#3a3a3a" />
              <stop offset="50%"  stopColor="#5e5e5e" />
              <stop offset="100%" stopColor="#252525" />
            </linearGradient>
            {/* Diagonal specular sweep — the highlight that slides
                across a real anodized surface when you tilt it. */}
            <linearGradient id="fdSpec" x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
              <stop offset="45%"  stopColor="rgba(255,255,255,0)" />
              <stop offset="50%"  stopColor="rgba(255,255,255,0.20)" />
              <stop offset="55%"  stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            {/* LED bloom — bright core + soft halo */}
            <radialGradient id="fdLed" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#f5ffb0" stopOpacity="1" />
              <stop offset="20%"  stopColor="#eaff7a" stopOpacity="1" />
              <stop offset="55%"  stopColor="#c8ff00" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c8ff00" stopOpacity="0" />
            </radialGradient>
            {/* Lime rim light — strong glow around the body edges */}
            <radialGradient id="fdRim" cx="50%" cy="50%" r="55%">
              <stop offset="40%"  stopColor="rgba(200,255,0,0)" />
              <stop offset="80%"  stopColor="rgba(200,255,0,0.25)" />
              <stop offset="100%" stopColor="rgba(200,255,0,0.5)" />
            </radialGradient>
            {/* Floor reflection mask gradient */}
            <linearGradient id="fdReflect" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="white" stopOpacity="0.22" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            {/* Logo mask — alpha-channel mask. The dark-on-transparent
                brand logo silhouette is the visible area. */}
            <mask id="fdLogoMask" style={{ maskType: "alpha" }}>
              <image
                href="/images/logo.webp"
                x="160" y="61"
                width="160" height="32"
                preserveAspectRatio="xMidYMid meet"
              />
            </mask>

            {/* Reusable drive group so the floor reflection can mirror
                it via a single <use>. */}
            <g id="fdDrive">
              {/* Lime rim-light glow around the body — sits BEHIND the
                  body so it haloes out from the edges. */}
              <rect
                x="80" y="34"
                width="282" height="92" rx="14"
                fill="url(#fdRim)"
                opacity="0.7"
              />

              {/* USB-A METAL CONNECTOR (left side) */}
              <rect
                x="20" y="58" width="78" height="42"
                fill="url(#fdSteel)"
                stroke="#1a1a1a" strokeWidth="0.5"
              />
              {/* Top edge highlight on connector */}
              <rect x="20" y="58" width="78" height="1" fill="rgba(255,255,255,0.18)" />
              {/* 4 contact pins inside the connector — the engineering tell */}
              <rect x="32" y="66" width="58" height="4" fill="#0d0d0d" />
              <rect x="32" y="74" width="58" height="4" fill="#0d0d0d" />
              <rect x="32" y="82" width="58" height="4" fill="#0d0d0d" />
              <rect x="32" y="90" width="58" height="4" fill="#0d0d0d" />

              {/* DRIVE BODY — single sleek matte-black rectangle */}
              <rect
                x="96" y="44" width="266" height="70" rx="8"
                fill="url(#fdBody)"
                stroke="#050505" strokeWidth="1"
              />
              {/* Top hairline highlight — catches light */}
              <rect x="96" y="45" width="266" height="1.4" fill="rgba(255,255,255,0.16)" />
              {/* Lime brand kiss along the very top edge */}
              <rect x="96" y="48.5" width="266" height="1.6" fill="#c8ff00" opacity="0.6" />
              {/* Bottom reflection edge */}
              <rect x="96" y="112" width="266" height="1.2" fill="rgba(255,255,255,0.1)" />

              {/* Diagonal specular sweep — the moving highlight */}
              <rect
                className="flashka-drive-spec"
                x="96" y="44" width="266" height="70" rx="8"
                fill="url(#fdSpec)"
              />

              {/* SMALL ACTIVITY LED — near connector side of body */}
              <g className="flashka-drive-led">
                <circle cx="124" cy="79" r="22" fill="url(#fdLed)" opacity="0.45" />
                <circle cx="124" cy="79" r="11" fill="url(#fdLed)" opacity="0.7" />
                <circle cx="124" cy="79" r="3.5" fill="#f5ffb0" />
              </g>

              {/* ENGRAVED VEKTO LOGO — centered prominently on the body.
                  Bigger than the previous iteration (160x32 vs 120x22) so
                  it reads as the brand mark, not a small label. */}
              <rect
                x="160" y="61"
                width="160" height="32"
                fill="#c8ff00"
                opacity="0.7"
                mask="url(#fdLogoMask)"
              />
              {/* Subtle inner lime glow behind the logo */}
              <rect
                x="160" y="61"
                width="160" height="32"
                fill="#c8ff00"
                opacity="0.18"
                mask="url(#fdLogoMask)"
                style={{ filter: "blur(2px)" }}
              />

              {/* Lanyard hole at far-right */}
              <circle cx="350" cy="79" r="3.5" fill="#000" stroke="#1a1a1a" strokeWidth="0.5" />
            </g>
          </defs>

          {/* Real drive */}
          <use href="#fdDrive" />

          {/* Floor reflection — drive mirrored vertically, masked to fade */}
          <g transform="translate(0, 232) scale(1, -1)" opacity="0.32">
            <mask id="fdFloorMask">
              <rect x="0" y="0" width="380" height="120" fill="url(#fdReflect)" />
            </mask>
            <g mask="url(#fdFloorMask)">
              <use href="#fdDrive" />
            </g>
          </g>

          {/* Micro editorial caption under the drive */}
          <text
            x="190" y="155"
            textAnchor="middle"
            fontFamily="ui-monospace, 'Geist Mono', monospace"
            fontSize="8"
            letterSpacing="2"
            fill="rgba(200,255,0,0.5)"
          >
            VEKTO OS · v.2026 · BG
          </text>
        </svg>
      </div>
      <div className="flashka-drive-caption">
        Кодът · v.2026 · България
      </div>
    </div>
  );
}
