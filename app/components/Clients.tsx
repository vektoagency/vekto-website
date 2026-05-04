"use client";

import { useEffect, useRef, useState } from "react";
import AnimateIn from "./AnimateIn";

type Client = {
  name: string;
  logo: string;
  url: string;
  desc: string;
  circular?: boolean;
  invert?: boolean;
};

const clients: Client[] = [
  { name: "ISOSPORT", logo: "/images/logo-isosport.png", url: "https://neopak.eu", desc: "Energy & functional beverages" },
  { name: "MEN'S CARE", logo: "/images/logo-menscare.png", url: "https://menscarebulgaria.com", desc: "Beard & hair growth", circular: true },
  { name: "PARFEN", logo: "/images/logo-parfen.png", url: "https://parfen.online", desc: "Designer-inspired perfumes", invert: true },
  { name: "BIOTICA", logo: "/images/logo-biotica.png", url: "https://biotica.bg", desc: "Natural supplements", circular: true, invert: true },
  { name: "BEMEACNE", logo: "/images/logo-bemeacne.png", url: "https://bemeacne.bg", desc: "Acne skincare brand" },
  { name: "KRISTA G", logo: "/images/logo-krista-g-2022.png", url: "https://kristag-bg.com", desc: "Natural cosmetics" },
  { name: "GIFTO", logo: "/images/logo-gifto2.png", url: "https://gifto.bg", desc: "Experience voucher platform" },
  { name: "ADVENTURES BG", logo: "/images/logo-adventuresbg.png", url: "https://adventures.bg", desc: "Adventure tourism" },
];

// Single fixed-size logo frame ensures every logo lands in the same slot,
// scaled to fit. Wide logos fill horizontally, circular ones fill the
// shorter axis — but the *container* size is identical for all tiles, so
// the visual rhythm stays consistent across the whole feed.
function BrandTile({ c }: { c: Client }) {
  const invert = c.invert ? "brightness(0) invert(1)" : undefined;
  return (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative shrink-0 w-[170px] md:w-[230px] h-[110px] md:h-[140px] mx-1.5 md:mx-2.5 rounded-md overflow-hidden bg-[#0a0a0a] border border-[#161616] hover:border-[#c8ff00]/55 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_16px_48px_-16px_rgba(200,255,0,0.35)]"
      aria-label={`${c.name} — open website`}
    >
      {/* Phosphor glow on hover — bottom-up sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(200,255,0,0.22) 0%, transparent 75%)",
        }}
      />

      {/* Logo frame — same dimensions for every tile */}
      <div className="absolute inset-x-0 top-0 bottom-[44px] md:bottom-[56px] flex items-center justify-center">
        <div className="relative flex items-center justify-center w-[110px] h-[34px] md:w-[150px] md:h-[46px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.logo}
            alt={c.name}
            draggable={false}
            className="opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              filter: invert,
            }}
          />
        </div>
      </div>

      {/* Brand name + description — bottom strip */}
      <div className="absolute inset-x-0 bottom-0 px-3 py-2 md:py-2.5 flex flex-col items-center text-center border-t border-[#161616] group-hover:border-[#c8ff00]/30 transition-colors duration-500">
        <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#c8ff00]/85 group-hover:text-[#c8ff00] transition-colors duration-500 truncate w-full">
          {c.name}
        </span>
        <span className="text-[9px] md:text-[10px] text-[#7a7a7a] group-hover:text-[#a0a0a0] transition-colors duration-500 truncate w-full leading-tight mt-0.5">
          {c.desc}
        </span>
      </div>
    </a>
  );
}

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // Pause the marquee whenever the section is offscreen — saves GPU work
  // and prevents the animation from drifting/desyncing while invisible.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
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
          className={`flex feed-track py-3 ${inView ? "" : "feed-paused"}`}
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
          /* Slower duration smooths perceived motion — eye reads it as
             premium glide rather than busy scroll. */
          animation: feedScroll 110s linear infinite;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        .feed-track:hover,
        .feed-paused {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .feed-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
