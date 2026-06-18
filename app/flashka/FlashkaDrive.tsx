// Modern minimalist USB drive — single black body, USB-A connector on
// the left, VEKTO wordmark centered on the body, small lime LED.
// Pure inline SVG + CSS 3D tilt + strong lime rim-light glow.
// Server-component-safe (no 'use client') so it server-renders inside
// the initial HTML and paints with the hero.

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
            {/* Logo mask — alpha-channel mask. Body sits at x=70-310,
                center 190. */}
            <mask id="fdLogoMask" style={{ maskType: "alpha" }}>
              <image
                href="/images/logo.webp"
                x="110" y="61"
                width="160" height="32"
                preserveAspectRatio="xMidYMid meet"
              />
            </mask>
          </defs>

          {/* Lime rim-light glow around the body */}
          <rect
            x="54" y="34"
            width="274" height="92" rx="14"
            fill="url(#fdRim)"
            opacity="0.7"
          />

          {/* USB-A METAL CONNECTOR — short stub on the left */}
          <rect
            x="22" y="58" width="48" height="42"
            fill="url(#fdSteel)"
            stroke="#1a1a1a" strokeWidth="0.5"
          />
          <rect x="22" y="58" width="48" height="1" fill="rgba(255,255,255,0.18)" />
          <rect x="30" y="66" width="32" height="4" fill="#0d0d0d" />
          <rect x="30" y="74" width="32" height="4" fill="#0d0d0d" />
          <rect x="30" y="82" width="32" height="4" fill="#0d0d0d" />
          <rect x="30" y="90" width="32" height="4" fill="#0d0d0d" />

          {/* DRIVE BODY */}
          <rect
            x="70" y="44" width="240" height="70" rx="8"
            fill="url(#fdBody)"
            stroke="#050505" strokeWidth="1"
          />
          <rect x="70" y="45" width="240" height="1.4" fill="rgba(255,255,255,0.16)" />
          <rect x="70" y="48.5" width="240" height="1.6" fill="#c8ff00" opacity="0.6" />
          <rect x="70" y="112" width="240" height="1.2" fill="rgba(255,255,255,0.1)" />

          {/* SMALL ACTIVITY LED — near connector side of body */}
          <g className="flashka-drive-led">
            <circle cx="98" cy="79" r="22" fill="url(#fdLed)" opacity="0.45" />
            <circle cx="98" cy="79" r="11" fill="url(#fdLed)" opacity="0.7" />
            <circle cx="98" cy="79" r="3.5" fill="#f5ffb0" />
          </g>

          {/* ENGRAVED VEKTO LOGO — centered on the body. */}
          <rect
            x="110" y="61"
            width="160" height="32"
            fill="#c8ff00"
            opacity="0.7"
            mask="url(#fdLogoMask)"
          />
          <rect
            x="110" y="61"
            width="160" height="32"
            fill="#c8ff00"
            opacity="0.18"
            mask="url(#fdLogoMask)"
            style={{ filter: "blur(2px)" }}
          />

          {/* Lanyard hole near the right edge of body */}
          <circle cx="298" cy="79" r="3.5" fill="#000" stroke="#1a1a1a" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
}
