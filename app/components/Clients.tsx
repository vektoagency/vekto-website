"use client";

import { useEffect, useState } from "react";
import AnimateIn from "./AnimateIn";

type Client = { name: string; logo: string; tag?: string; circular?: boolean; invert?: boolean };

const clients: Client[] = [
  { name: "ISOSPORT", logo: "/images/logo-isosport.png", tag: "CINEMATIC" },
  { name: "MEN'S CARE", logo: "/images/logo-menscare.png", tag: "RETAINER", circular: true },
  { name: "PARFEN", logo: "/images/logo-parfen.png", tag: "BRAND FILM", invert: true },
  { name: "BIOTICA", logo: "/images/logo-biotica.png", tag: "PRODUCT", circular: true, invert: true },
  { name: "BEMEACNE", logo: "/images/logo-bemeacne.png", tag: "UGC" },
  { name: "KRISTA G", logo: "/images/logo-krista-g-2022.png", tag: "SOCIAL" },
  { name: "GIFTO", logo: "/images/logo-gifto2.png", tag: "E-COMMERCE" },
  { name: "ADVENTURES BG", logo: "/images/logo-adventuresbg.png", tag: "BRAND" },
];

// Pause cycling when section scrolls offscreen — saves a setInterval and
// removes any chance of jank when the user is below the fold.
function useLiveSpotlight(count: number, interval: number) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % count), interval);
    return () => clearInterval(id);
  }, [count, interval]);
  return active;
}

function BrandTile({ c, isLive }: { c: Client; isLive: boolean }) {
  const invert = c.invert ? "brightness(0) invert(1)" : undefined;
  return (
    <div
      className={`group relative shrink-0 w-[170px] md:w-[230px] h-[100px] md:h-[130px] mx-1.5 md:mx-2.5 rounded-md overflow-hidden transition-all duration-500 ${
        isLive ? "scale-[1.04]" : "scale-100"
      }`}
      style={{
        background: isLive
          ? "linear-gradient(180deg, rgba(200,255,0,0.06) 0%, rgba(200,255,0,0.02) 50%, rgba(0,0,0,0) 100%), #0a0a0a"
          : "#0a0a0a",
        border: `1px solid ${isLive ? "rgba(200,255,0,0.55)" : "rgba(200,255,0,0.1)"}`,
        boxShadow: isLive
          ? "0 0 0 1px rgba(200,255,0,0.18), 0 16px 48px -16px rgba(200,255,0,0.4), inset 0 1px 0 rgba(200,255,0,0.15)"
          : "inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      {/* Phosphor sweep at bottom on live */}
      {isLive && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(200,255,0,0.18) 0%, transparent 75%)",
          }}
        />
      )}

      {/* "LIVE" status pill — top-left corner */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.22em]">
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            isLive ? "bg-[#c8ff00]" : "bg-[#2a2a2a]"
          } ${isLive ? "animate-pulse" : ""}`}
        />
        <span className={isLive ? "text-[#c8ff00]" : "text-[#3a3a3a]"}>
          {isLive ? "LIVE" : "IDLE"}
        </span>
      </div>

      {/* Index number in top-right — like a broadcast slot */}
      <div className="absolute top-2.5 right-3 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.18em] text-[#3a3a3a]">
        #{c.name.length.toString().padStart(2, "0")}
      </div>

      {/* Logo — center */}
      <div className="absolute inset-0 flex items-center justify-center pt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.name}
          className={`md:hidden transition-all duration-500 ${
            isLive ? "opacity-100 scale-105" : "opacity-65"
          } group-hover:opacity-100`}
          style={{
            maxWidth: c.circular ? "42px" : "100px",
            maxHeight: c.circular ? "42px" : "32px",
            objectFit: "contain",
            filter: invert,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.name}
          className={`hidden md:block transition-all duration-500 ${
            isLive ? "opacity-100 scale-105" : "opacity-65"
          } group-hover:opacity-100`}
          style={{
            maxWidth: c.circular ? "62px" : "150px",
            maxHeight: c.circular ? "62px" : "48px",
            objectFit: "contain",
            filter: invert,
          }}
        />
      </div>

      {/* Bottom strip — brand name + tag, mono terminal style */}
      <div className="absolute inset-x-0 bottom-0 px-3 py-2 flex items-center justify-between font-mono text-[8px] md:text-[10px] uppercase tracking-[0.18em] border-t border-[#161616]">
        <span className={`transition-colors duration-300 truncate pr-2 ${isLive ? "text-white" : "text-[#9a958e]"}`}>
          {c.name}
        </span>
        {c.tag && (
          <span className={`shrink-0 transition-colors duration-300 ${isLive ? "text-[#c8ff00]" : "text-[#3a3a3a]"}`}>
            {c.tag}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Clients() {
  const activeIdx = useLiveSpotlight(clients.length, 2800);

  return (
    <section
      className="py-9 md:py-14 border-y border-[#1e1e1c] relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #070707 0%, #0a0a0a 50%, #070707 100%)" }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/30 to-transparent" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/20 to-transparent" />

      {/* Header — "broadcast control" panel */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-6 md:mb-8">
        <AnimateIn>
          <div className="flex items-center justify-center gap-3 md:gap-5 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#c8ff00]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
              ON AIR
            </span>
            <span aria-hidden className="h-px w-6 md:w-12 bg-[#c8ff00]/40" />
            <span className="text-[#ece8e1]">Trusted by forward-thinking brands</span>
            <span aria-hidden className="h-px w-6 md:w-12 bg-[#c8ff00]/40" />
            <span className="text-[#c8ff00]/60">{clients.length}/∞</span>
          </div>
        </AnimateIn>
      </div>

      {/* Marquee track — continuous left scroll, edge-masked.
          Hovering pauses the scroll so users can read brand details. */}
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
          {/* Triple-loop the set so the seamless seam never reveals empty edge */}
          {[...clients, ...clients, ...clients].map((c, i) => {
            const realIdx = i % clients.length;
            return (
              <BrandTile key={`${c.name}-${i}`} c={c} isLive={realIdx === activeIdx} />
            );
          })}
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
