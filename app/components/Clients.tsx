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

function BrandTile({ c }: { c: Client }) {
  const invert = c.invert ? "brightness(0) invert(1)" : undefined;
  return (
    <div
      className="relative shrink-0 w-[150px] md:w-[210px] h-[96px] md:h-[124px] mx-1.5 md:mx-2.5 rounded-md overflow-hidden bg-[#0a0a0a] border border-[#161616] select-none"
    >
      {/* Logo — center */}
      <div className="absolute inset-x-0 top-0 bottom-9 md:bottom-11 flex items-center justify-center px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.name}
          draggable={false}
          className="md:hidden opacity-80"
          style={{
            maxWidth: c.circular ? "42px" : "108px",
            maxHeight: c.circular ? "42px" : "34px",
            objectFit: "contain",
            filter: invert,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.name}
          draggable={false}
          className="hidden md:block opacity-80"
          style={{
            maxWidth: c.circular ? "60px" : "150px",
            maxHeight: c.circular ? "60px" : "48px",
            objectFit: "contain",
            filter: invert,
          }}
        />
      </div>

      {/* Brand name — bottom strip */}
      <div className="absolute inset-x-0 bottom-0 px-3 py-2 md:py-2.5 flex items-center justify-center font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] border-t border-[#161616]">
        <span className="text-[#9a958e] truncate">{c.name}</span>
      </div>
    </div>
  );
}

export default function Clients() {
  return (
    <section
      className="py-9 md:py-14 border-y border-[#1e1e1c] relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #070707 0%, #0a0a0a 50%, #070707 100%)" }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/30 to-transparent" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-6 md:mb-8">
        <AnimateIn>
          <p className="text-center text-xs text-[#c8ff00] uppercase tracking-widest">
            Trusted by forward-thinking brands
          </p>
        </AnimateIn>
      </div>

      {/* Marquee track — continuous slide, hover pauses, edges masked */}
      <div
        className="relative overflow-hidden"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div
          className="flex feed-track py-3"
          style={{
            width: "max-content",
            willChange: "transform",
          }}
        >
          {[...clients, ...clients, ...clients].map((c, i) => (
            <BrandTile key={`${c.name}-${i}`} c={c} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes feedScroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-33.3333%, 0, 0); }
        }
        .feed-track {
          animation: feedScroll 70s linear infinite;
          backface-visibility: hidden;
        }
        .feed-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .feed-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
