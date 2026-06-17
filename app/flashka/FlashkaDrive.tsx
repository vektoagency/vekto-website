// Photoreal-ish USB drive in pure SVG + CSS 3D. Server-component-safe
// (no 'use client') so it server-renders inside the initial HTML and
// paints with the hero — zero decode latency, no extra network round-
// trip. ~5KB markup, ~1.5KB gzipped. The 3D-feel comes from:
//
//   1. perspective + slow rotateY/rotateX wobble on the wrap (CSS).
//   2. Stacked gradient layers on the body (top highlight band,
//      mid matte fill, bottom reflection band) — sells anodized
//      aluminum, not flat illustration.
//   3. Specular sweep across the body — a thin angled highlight
//      that animates left-right with the wobble.
//   4. Strong radial LED bloom + halo via SVG <radialGradient>.
//   5. Floor reflection underneath — second drive image flipped
//      with mask-image gradient fade.

export default function FlashkaDrive() {
  return (
    <div className="flashka-drive-perspective" aria-hidden="true">
      <div className="flashka-drive-wrap">
        <svg
          className="flashka-drive-svg"
          viewBox="0 28 380 102"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
        >
          <defs>
            {/* Anodized-aluminum body — top highlight, matte middle,
                bottom reflection edge. Three stops sell the curvature. */}
            <linearGradient id="fdBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#2a2a2a" />
              <stop offset="20%"  stopColor="#161616" />
              <stop offset="50%"  stopColor="#0a0a0a" />
              <stop offset="80%"  stopColor="#161616" />
              <stop offset="100%" stopColor="#1f1f1f" />
            </linearGradient>
            {/* Cap — slightly lighter than the body so the two pieces
                read as physically separate. */}
            <linearGradient id="fdCap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#323232" />
              <stop offset="50%"  stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#252525" />
            </linearGradient>
            {/* Diagonal specular sweep — the highlight that slides
                across a real anodized surface when you tilt it. */}
            <linearGradient id="fdSpec" x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
              <stop offset="45%"  stopColor="rgba(255,255,255,0)" />
              <stop offset="50%"  stopColor="rgba(255,255,255,0.18)" />
              <stop offset="55%"  stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            {/* LED bloom — bigger spread + brighter core than the
                previous version. This is the WOW element. */}
            <radialGradient id="fdLed" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#f5ffb0" stopOpacity="1" />
              <stop offset="20%"  stopColor="#eaff7a" stopOpacity="1" />
              <stop offset="55%"  stopColor="#c8ff00" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c8ff00" stopOpacity="0" />
            </radialGradient>
            {/* Floor reflection mask — fades the mirrored drive */}
            <linearGradient id="fdReflect" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="white" stopOpacity="0.22" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            {/* Logo mask — alpha-channel mask so the dark-on-transparent
                logo silhouette can be filled with our lime. */}
            <mask id="fdLogoMask" style={{ maskType: "alpha" }}>
              <image
                href="/images/logo.webp"
                x="187" y="63"
                width="120" height="22"
                preserveAspectRatio="xMidYMid meet"
              />
            </mask>
            {/* Reusable drive group so the floor reflection can mirror
                it with a single <use>. */}
            <g id="fdDrive">
              {/* CAP */}
              <rect
                x="20" y="42" width="72" height="68" rx="5"
                fill="url(#fdCap)"
                stroke="#050505" strokeWidth="1"
              />
              <rect x="20" y="43" width="72" height="1" fill="rgba(255,255,255,0.1)" />
              <rect x="20" y="46" width="72" height="1.5" fill="#c8ff00" opacity="0.5" />
              {/* Cap grip ribs — fine textured surface */}
              <rect x="30" y="58" width="52" height="0.8" fill="rgba(255,255,255,0.06)" />
              <rect x="30" y="64" width="52" height="0.8" fill="rgba(255,255,255,0.06)" />
              <rect x="30" y="70" width="52" height="0.8" fill="rgba(255,255,255,0.06)" />
              <rect x="30" y="76" width="52" height="0.8" fill="rgba(255,255,255,0.06)" />
              <rect x="30" y="82" width="52" height="0.8" fill="rgba(255,255,255,0.06)" />
              <rect x="30" y="88" width="52" height="0.8" fill="rgba(255,255,255,0.06)" />
              <rect x="30" y="94" width="52" height="0.8" fill="rgba(255,255,255,0.06)" />
              {/* Cap-body separation seam */}
              <rect x="91" y="44" width="2.5" height="64" fill="rgba(0,0,0,0.85)" />
              <rect x="93" y="44" width="0.5" height="64" fill="rgba(255,255,255,0.08)" />

              {/* BODY */}
              <rect
                x="100" y="36" width="240" height="78" rx="7"
                fill="url(#fdBody)"
                stroke="#050505" strokeWidth="1"
              />
              {/* Top hairline highlight — catches light */}
              <rect x="100" y="37" width="240" height="1.2" fill="rgba(255,255,255,0.14)" />
              {/* Lime brand kiss along the top */}
              <rect x="100" y="40.5" width="240" height="1.5" fill="#c8ff00" opacity="0.55" />
              {/* Bottom reflection edge */}
              <rect x="100" y="112" width="240" height="1" fill="rgba(255,255,255,0.08)" />

              {/* Diagonal specular sweep — the moving highlight */}
              <rect
                className="flashka-drive-spec"
                x="100" y="36" width="240" height="78" rx="7"
                fill="url(#fdSpec)"
              />

              {/* Engraved VEKTO logo */}
              <rect
                x="187" y="63"
                width="120" height="22"
                fill="#c8ff00"
                opacity="0.55"
                mask="url(#fdLogoMask)"
              />
              {/* Subtle inner lime glow behind the logo */}
              <rect
                x="187" y="63"
                width="120" height="22"
                fill="#c8ff00"
                opacity="0.08"
                mask="url(#fdLogoMask)"
                style={{ filter: "blur(2px)" }}
              />

              {/* Lanyard hole on far right */}
              <circle cx="328" cy="75" r="3.5" fill="#000" stroke="#1a1a1a" strokeWidth="0.5" />
              <circle cx="328" cy="75" r="3.5" fill="rgba(255,255,255,0.04)" />

              {/* LED — bigger bloom, brighter core */}
              <g className="flashka-drive-led">
                <circle cx="120" cy="75" r="28" fill="url(#fdLed)" opacity="0.5" />
                <circle cx="120" cy="75" r="16" fill="url(#fdLed)" opacity="0.7" />
                <circle cx="120" cy="75" r="5"  fill="#f5ffb0" />
              </g>
            </g>
          </defs>

          {/* Real drive */}
          <use href="#fdDrive" />

          {/* Floor reflection — same drive mirrored, masked to fade */}
          <g transform="translate(0, 234) scale(1, -1)" opacity="0.35">
            <mask id="fdFloorMask">
              <rect x="0" y="0" width="380" height="120" fill="url(#fdReflect)" />
            </mask>
            <g mask="url(#fdFloorMask)">
              <use href="#fdDrive" />
            </g>
          </g>

          {/* Micro editorial caption — under the cap */}
          <text
            x="56" y="125"
            textAnchor="middle"
            fontFamily="ui-monospace, 'Geist Mono', monospace"
            fontSize="7"
            letterSpacing="1.6"
            fill="rgba(200,255,0,0.45)"
          >
            VEKTO OS · v.2026
          </text>
        </svg>
      </div>
      <div className="flashka-drive-caption">
        Кодът · v.2026 · България
      </div>
    </div>
  );
}
