// Pure inline SVG of a matte-black USB flash drive plugged into a
// port "milled into the page surface". Server-component-safe (no
// 'use client') — renders inside the initial HTML so it paints with
// the hero, zero decode latency, no extra network round-trip.
// ~3KB markup, ~1KB gzipped. The lime LED is the only animated
// element (CSS pulse, GPU-cheap opacity-only). The visual sits
// below the hero CTA as the page's visual full-stop, pulling the
// eye down toward the form section underneath.

export default function FlashkaDrive() {
  return (
    <div className="flashka-drive-wrap" aria-hidden="true">
      <svg
        viewBox="0 0 380 150"
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
          {/* Brushed-steel USB-A connector */}
          <linearGradient id="fdSteel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="50%" stopColor="#5a5a5a" />
            <stop offset="100%" stopColor="#2a2a2a" />
          </linearGradient>
          {/* LED radial — the only "live" element */}
          <radialGradient id="fdLed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eaff7a" stopOpacity="1" />
            <stop offset="55%" stopColor="#c8ff00" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c8ff00" stopOpacity="0" />
          </radialGradient>
          {/* CNC-milled port (inset rectangle look) */}
          <linearGradient id="fdPort" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020202" />
            <stop offset="100%" stopColor="#0c0c0c" />
          </linearGradient>
        </defs>

        {/* Port cavity — the "page has been milled" surface */}
        <rect
          x="20" y="46" width="120" height="58" rx="4"
          fill="url(#fdPort)"
          stroke="rgba(255,255,255,0.04)" strokeWidth="1"
        />
        {/* Inner port shadow (top edge) — sells the depth */}
        <rect x="20" y="46" width="120" height="3" fill="rgba(0,0,0,0.85)" />

        {/* USB-A metal connector — protrudes from port into housing */}
        <rect
          x="120" y="54" width="60" height="42"
          fill="url(#fdSteel)"
          stroke="#1a1a1a" strokeWidth="0.5"
        />
        {/* 4 contact pins inside the connector — the engineering tell */}
        <rect x="128" y="62" width="44" height="4" fill="#1a1a1a" />
        <rect x="128" y="70" width="44" height="4" fill="#1a1a1a" />
        <rect x="128" y="78" width="44" height="4" fill="#1a1a1a" />
        <rect x="128" y="86" width="44" height="4" fill="#1a1a1a" />

        {/* Matte-black housing — the body of the drive */}
        <rect
          x="172" y="36" width="190" height="78" rx="6"
          fill="url(#fdBody)"
          stroke="#252525" strokeWidth="1"
        />
        {/* Subtle top highlight strip — ambient bounce */}
        <rect x="172" y="37" width="190" height="1" fill="rgba(255,255,255,0.08)" />
        {/* Hairline lime accent strip — brand kiss along the top edge */}
        <rect x="172" y="40" width="190" height="1.5" fill="#c8ff00" opacity="0.45" />
        {/* Engraved VEKTO wordmark — barely visible, the premium tell */}
        <text
          x="267" y="80"
          textAnchor="middle"
          fontFamily="ui-monospace, 'Geist Mono', monospace"
          fontSize="11"
          fontWeight="600"
          letterSpacing="2.8"
          fill="rgba(200,255,0,0.22)"
        >
          VEKTO
        </text>
        {/* Lanyard hole on far-right */}
        <circle cx="350" cy="75" r="3.5" fill="#020202" stroke="#1a1a1a" strokeWidth="0.5" />

        {/* THE LED — only animated element. Radial gradient + pulse */}
        <g className="flashka-drive-led">
          <circle cx="190" cy="75" r="22" fill="url(#fdLed)" opacity="0.55" />
          <circle cx="190" cy="75" r="4" fill="#eaff7a" />
        </g>

        {/* Machined caption beneath the port — micro editorial detail */}
        <text
          x="80" y="125"
          textAnchor="middle"
          fontFamily="ui-monospace, 'Geist Mono', monospace"
          fontSize="7"
          letterSpacing="1.6"
          fill="rgba(200,255,0,0.42)"
        >
          PORT 01 · СВЪРЗАНО
        </text>
      </svg>
      <div className="flashka-drive-caption">
        Кодът · v.2026 · България
      </div>
    </div>
  );
}
