// Pure inline SVG of a matte-black USB flash drive — classic
// composition: small CAP on the left, larger DRIVE BODY on the right.
// Server-component-safe (no 'use client') — renders inside the
// initial HTML so it paints with the hero, zero decode latency, no
// extra network round-trip. ~3KB markup, ~1KB gzipped. The lime LED
// is the only animated element (CSS pulse, GPU-cheap opacity-only).

export default function FlashkaDrive() {
  return (
    <div className="flashka-drive-wrap" aria-hidden="true">
      <svg
        viewBox="0 28 380 102"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        <defs>
          {/* Matte-black housing gradient — top highlight, bottom shadow */}
          <linearGradient id="fdBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c1c1c" />
            <stop offset="50%" stopColor="#0a0a0a" />
            <stop offset="100%" stopColor="#141414" />
          </linearGradient>
          {/* Cap gradient — slightly lighter/greyer than body so the cap
              reads as a separate piece you'd grip and pull off. */}
          <linearGradient id="fdCap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#262626" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#202020" />
          </linearGradient>
          {/* LED radial — the only "live" element */}
          <radialGradient id="fdLed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eaff7a" stopOpacity="1" />
            <stop offset="55%" stopColor="#c8ff00" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c8ff00" stopOpacity="0" />
          </radialGradient>
          {/* Logo mask — uses the image's alpha channel so any image
              color (the brand logo is dark-on-transparent) becomes a
              silhouette we can fill with lime via the masked rect
              below. maskType=alpha is the key — luminance would
              invert this since the logo is dark, not white. */}
          <mask id="fdLogoMask" style={{ maskType: "alpha" }}>
            <image
              href="/images/logo.webp"
              x="187" y="63"
              width="120" height="22"
              preserveAspectRatio="xMidYMid meet"
            />
          </mask>
        </defs>

        {/* CAP — small dark grey piece on the left covering the USB
            connector. ~20%% of the total drive width — matches real
            USB cap proportions. */}
        <rect
          x="20" y="42" width="72" height="68" rx="5"
          fill="url(#fdCap)"
          stroke="#0a0a0a" strokeWidth="1"
        />
        {/* Cap top highlight — subtle ambient bounce */}
        <rect x="20" y="43" width="72" height="1" fill="rgba(255,255,255,0.08)" />
        {/* Cap lime accent strip — brand kiss along the top edge */}
        <rect x="20" y="46" width="72" height="1.5" fill="#c8ff00" opacity="0.4" />
        {/* Cap grip ribs — 3 thin horizontal lines suggesting a textured
            grip surface, the way real USB caps have them */}
        <rect x="32" y="62" width="48" height="1" fill="rgba(255,255,255,0.05)" />
        <rect x="32" y="72" width="48" height="1" fill="rgba(255,255,255,0.05)" />
        <rect x="32" y="82" width="48" height="1" fill="rgba(255,255,255,0.05)" />
        {/* Cap shadow seam where it meets the body — sells the 'two
            separate pieces' read */}
        <rect x="91" y="44" width="2" height="64" fill="rgba(0,0,0,0.6)" />

        {/* DRIVE BODY — matte-black main piece, ~70%% of total width */}
        <rect
          x="100" y="36" width="240" height="78" rx="6"
          fill="url(#fdBody)"
          stroke="#252525" strokeWidth="1"
        />
        {/* Subtle top highlight strip — ambient bounce */}
        <rect x="100" y="37" width="240" height="1" fill="rgba(255,255,255,0.08)" />
        {/* Hairline lime accent strip — brand kiss along the top edge */}
        <rect x="100" y="40" width="240" height="1.5" fill="#c8ff00" opacity="0.45" />
        {/* Engraved VEKTO logo — masked via fdLogoMask, filled lime
            at 45%% so it reads as etched into the matte-black housing. */}
        <rect
          x="187" y="63"
          width="120" height="22"
          fill="#c8ff00"
          opacity="0.45"
          mask="url(#fdLogoMask)"
        />
        {/* Lanyard hole on far-right of body */}
        <circle cx="328" cy="75" r="3.5" fill="#020202" stroke="#1a1a1a" strokeWidth="0.5" />

        {/* THE LED — sits on the body near the cap edge, like a real
            drive's activity indicator. Only animated element. */}
        <g className="flashka-drive-led">
          <circle cx="120" cy="75" r="22" fill="url(#fdLed)" opacity="0.55" />
          <circle cx="120" cy="75" r="4" fill="#eaff7a" />
        </g>

        {/* Micro editorial caption — under the cap */}
        <text
          x="56" y="125"
          textAnchor="middle"
          fontFamily="ui-monospace, 'Geist Mono', monospace"
          fontSize="7"
          letterSpacing="1.6"
          fill="rgba(200,255,0,0.42)"
        >
          VEKTO OS · v.2026
        </text>
      </svg>
      <div className="flashka-drive-caption">
        Кодът · v.2026 · България
      </div>
    </div>
  );
}
