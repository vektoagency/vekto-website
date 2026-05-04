import AnimateIn from "./AnimateIn";

type Client = { name: string; logo: string; circular?: boolean; invert?: boolean };

const clients: Client[] = [
  { name: "ISOSPORT", logo: "/images/logo-isosport.png" },
  { name: "MEN'S CARE", logo: "/images/logo-menscare.png", circular: true },
  { name: "PARFEN", logo: "/images/logo-parfen.png", invert: true },
  { name: "BIOTICA", logo: "/images/logo-biotica.png", circular: true, invert: true },
  { name: "BEMEACNE", logo: "/images/logo-bemeacne.png" },
  { name: "KRISTA G", logo: "/images/logo-krista-g-2022.png" },
  { name: "GIFTO", logo: "/images/logo-gifto2.png" },
  { name: "ADVENTURES BG", logo: "/images/logo-adventuresbg.png" },
];

const ROW_SIZE = 4;

function Hex({ c, idx }: { c: Client; idx: number }) {
  const invert = c.invert ? "brightness(0) invert(1)" : undefined;
  // Each hex floats with a different phase delay — produces a gentle
  // wave across the comb instead of every cell bobbing in unison.
  const floatDelay = `${(idx % 4) * 0.4 + (idx >= 4 ? 0.2 : 0)}s`;
  // Scroll-in stagger
  const inDelay = `${idx * 70}ms`;

  return (
    <div
      className="hex-outer relative group cursor-default"
      style={{
        animation: `hexIn 0.7s cubic-bezier(0.25,0.8,0.3,1) ${inDelay} both, hexFloat 4.6s ease-in-out ${floatDelay} infinite`,
      }}
    >
      {/* Outer hex — lime gradient acts as a 1.5px border ring */}
      <div className="hex-shape absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(200,255,0,0.45) 0%, rgba(200,255,0,0.08) 60%, rgba(200,255,0,0.25) 100%)",
        }}
      />
      {/* Inner hex — dark fill, slightly inset */}
      <div className="hex-shape absolute inset-[2px] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#0f0f0a]"
        style={{ background: "#0a0a0a" }}
      />
      {/* Phosphor glow on hover */}
      <div
        className="hex-shape absolute inset-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(200,255,0,0.28) 0%, rgba(200,255,0,0.06) 45%, transparent 75%)",
        }}
      />
      {/* Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.name}
          className="md:hidden opacity-65 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
          style={{
            maxWidth: c.circular ? "44px" : "62px",
            maxHeight: c.circular ? "44px" : "32px",
            objectFit: "contain",
            filter: invert,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.name}
          className="hidden md:block opacity-65 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
          style={{
            maxWidth: c.circular ? "62px" : "92px",
            maxHeight: c.circular ? "62px" : "44px",
            objectFit: "contain",
            filter: invert,
          }}
        />
      </div>
    </div>
  );
}

export default function Clients() {
  // Auto-chunk into rows of ROW_SIZE — scales with any number of brands.
  const rows: Client[][] = [];
  for (let i = 0; i < clients.length; i += ROW_SIZE) {
    rows.push(clients.slice(i, i + ROW_SIZE));
  }

  return (
    <section
      className="py-10 md:py-16 border-y border-[#1e1e1c] relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #070707 0%, #0a0a0a 50%, #070707 100%)" }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/30 to-transparent" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/20 to-transparent" />

      {/* Faint hex pattern in background — subtle "comb" hint */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(200,255,0,1) 0.5px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <AnimateIn>
          <p className="text-center text-xs text-[#c8ff00] uppercase tracking-widest mb-10 md:mb-12">
            Trusted by forward-thinking brands
          </p>

          <div className="honeycomb flex flex-col items-center">
            {rows.map((row, ri) => (
              <div
                key={ri}
                className={`honeycomb-row flex ${ri > 0 ? "honeycomb-row-overlap" : ""} ${ri % 2 === 1 ? "honeycomb-row-offset" : ""}`}
              >
                {row.map((c, ci) => (
                  <Hex key={c.name} c={c} idx={ri * ROW_SIZE + ci} />
                ))}
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>

      <style>{`
        /* Hex sizing — pointy-top regular hexagon. h = w * 2/√3 ≈ 1.155w */
        .hex-outer {
          width: 84px;
          height: 97px;
          margin: 0 3px;
        }
        .hex-shape {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
        /* Honeycomb tessellation: even rows shift right by half hex,
           subsequent rows overlap by 25% of hex height for true comb fit. */
        .honeycomb-row-offset {
          margin-left: 45px;
        }
        .honeycomb-row-overlap {
          margin-top: -24px;
        }

        @media (min-width: 768px) {
          .hex-outer {
            width: 124px;
            height: 143px;
            margin: 0 5px;
          }
          .honeycomb-row-offset {
            margin-left: 67px;
          }
          .honeycomb-row-overlap {
            margin-top: -36px;
          }
        }

        @keyframes hexIn {
          from { opacity: 0; transform: translateY(14px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes hexFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hex-outer { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
