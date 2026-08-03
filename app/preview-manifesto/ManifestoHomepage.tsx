"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Manifesto / poster homepage. Each viewport-height section is ONE
// massive statement, snap-scrolled. No hero image. No card grids. No
// tab bars. Just declarations rendered at typographic scale, each
// section its own axis colour. Feels like flipping through a
// hardcover art book at a museum gift shop.
//
// Signature moves:
//   - Vertical scroll-snap (each spread is full-viewport)
//   - Progress rail on the right showing the "chapters"
//   - Type as image — one massive display serif line per spread
//   - Whitespace as design
//   - Colour changes per spread but stays a monochrome per spread
//   - No CTAs except at the final spread
//   - Kicker on each spread: small mono uppercase / dateline

type Spread = {
  id: string;
  bg: string;
  ink: string;
  accent: string;
  kicker: string;
  line1: string;
  line2?: string;
  italic?: boolean;
  align?: "left" | "center" | "right";
};

const SPREADS: Spread[] = [
  {
    id: "one",
    bg: "#f2ede0",
    ink: "#0a0a0a",
    accent: "#0a0a0a",
    kicker: "I · Sofia · 04.08.MMXXVI",
    line1: "We do not sell campaigns.",
    line2: "We sell partnerships.",
    align: "left",
  },
  {
    id: "two",
    bg: "#0a0a0a",
    ink: "#f2ede0",
    accent: "#f2ede0",
    kicker: "II · The Position",
    line1: "Growth is a system,",
    line2: "not a season.",
    italic: true,
    align: "left",
  },
  {
    id: "three",
    bg: "#c8ff00",
    ink: "#0a0a0a",
    accent: "#0a0a0a",
    kicker: "III · The Practice",
    line1: "Fifty brands.",
    line2: "One standard.",
    align: "center",
  },
  {
    id: "four",
    bg: "#1a1a2e",
    ink: "#f2ede0",
    accent: "#c8ff00",
    kicker: "IV · The Scope",
    line1: "Ads. Creative.",
    line2: "Websites. Strategy.",
    align: "left",
  },
  {
    id: "five",
    bg: "#8b1e1e",
    ink: "#f2ede0",
    accent: "#f2ede0",
    kicker: "V · The Selection",
    line1: "Twelve brands a year.",
    line2: "That is all.",
    italic: true,
    align: "right",
  },
  {
    id: "six",
    bg: "#f2ede0",
    ink: "#0a0a0a",
    accent: "#8b1e1e",
    kicker: "VI · The Proof",
    line1: "Four-point-eight",
    line2: "times return.",
    align: "left",
  },
  {
    id: "seven",
    bg: "#0a0a0a",
    ink: "#f2ede0",
    accent: "#c8ff00",
    kicker: "VII · The Bureau",
    line1: "Sofia to New York.",
    line2: "One team.",
    align: "center",
  },
];

const CTA_SPREAD = {
  bg: "#f2ede0",
  ink: "#0a0a0a",
};

export default function ManifestoHomepage() {
  const [current, setCurrent] = useState(0);

  // Track which spread is currently in view for the progress rail
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      const idx = Math.min(SPREADS.length, Math.round(y / h));
      setCurrent(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="font-serif overflow-x-hidden"
      style={{
        fontFamily: "var(--font-manifesto), 'Times New Roman', serif",
        scrollSnapType: "y mandatory",
      }}
    >
      {/* ===== FIXED MINIMAL NAV (masthead) ===== */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 pointer-events-none"
      >
        <span
          className="text-sm md:text-base tracking-widest pointer-events-auto transition-colors duration-500"
          style={{
            color: current < SPREADS.length ? SPREADS[current].ink : CTA_SPREAD.ink,
            mixBlendMode: "difference",
          }}
        >
          VEKTO
        </span>
        <Link
          href="/case-studies"
          className="text-xs md:text-sm tracking-widest uppercase pointer-events-auto transition-colors duration-500 hover:opacity-70"
          style={{
            color: current < SPREADS.length ? SPREADS[current].ink : CTA_SPREAD.ink,
            mixBlendMode: "difference",
          }}
        >
          Work ↗
        </Link>
      </div>

      {/* ===== PROGRESS RAIL ===== */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 md:gap-3 pointer-events-auto">
        {SPREADS.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="block group"
            aria-label={`Go to spread ${i + 1}`}
          >
            <div
              className="w-6 md:w-8 h-px transition-all duration-500"
              style={{
                background: current === i ? SPREADS[current].ink : "#88888880",
                transform: current === i ? "scaleX(1)" : "scaleX(0.4)",
                mixBlendMode: "difference",
                transformOrigin: "right",
              }}
            />
          </a>
        ))}
      </div>

      {/* ===== SPREADS ===== */}
      {SPREADS.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className="min-h-screen w-full flex flex-col justify-center px-6 md:px-16 lg:px-24 relative"
          style={{
            background: s.bg,
            color: s.ink,
            scrollSnapAlign: "start",
          }}
        >
          {/* Kicker */}
          <div
            className="absolute top-20 md:top-24 left-6 md:left-16 lg:left-24 text-[10px] md:text-xs tracking-[0.4em] uppercase opacity-70"
            style={{ fontFamily: "ui-monospace, monospace" }}
          >
            {s.kicker}
          </div>

          {/* Statement */}
          <div
            className={`max-w-6xl ${s.align === "center" ? "mx-auto text-center" : s.align === "right" ? "ml-auto text-right" : ""}`}
          >
            <h1
              className={`leading-[0.85] tracking-[-0.035em] ${s.italic ? "italic" : ""}`}
              style={{
                fontSize: "clamp(64px, 15vw, 260px)",
                fontWeight: s.italic ? 300 : 700,
                fontFamily: "var(--font-manifesto), serif",
              }}
            >
              {s.line1}
              {s.line2 && (
                <>
                  <br />
                  <span style={{ color: s.accent }}>{s.line2}</span>
                </>
              )}
            </h1>
          </div>

          {/* Folio (page number, bottom corner) */}
          <div
            className="absolute bottom-8 md:bottom-10 left-6 md:left-16 lg:left-24 text-[10px] md:text-xs tracking-[0.35em] opacity-60"
            style={{ fontFamily: "ui-monospace, monospace" }}
          >
            — {String(i + 1).padStart(2, "0")} / {String(SPREADS.length + 1).padStart(2, "0")} —
          </div>
        </section>
      ))}

      {/* ===== FINAL SPREAD — THE ONLY CTA ===== */}
      <section
        id="apply"
        className="min-h-screen w-full flex flex-col justify-center px-6 md:px-16 lg:px-24 relative"
        style={{
          background: CTA_SPREAD.bg,
          color: CTA_SPREAD.ink,
          scrollSnapAlign: "start",
        }}
      >
        <div
          className="absolute top-20 md:top-24 left-6 md:left-16 lg:left-24 text-[10px] md:text-xs tracking-[0.4em] uppercase opacity-70"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
          VIII · Correspondence
        </div>

        <div className="max-w-4xl">
          <h1
            className="leading-[0.9] tracking-[-0.03em] italic mb-14"
            style={{
              fontSize: "clamp(52px, 11vw, 200px)",
              fontWeight: 300,
              fontFamily: "var(--font-manifesto), serif",
            }}
          >
            Write to us.
          </h1>

          <div className="space-y-8 max-w-2xl">
            <div>
              <div
                className="text-[10px] md:text-xs tracking-[0.35em] uppercase opacity-60 mb-2"
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                Bureau
              </div>
              <a
                href="mailto:vektoagency@gmail.com"
                className="text-xl md:text-3xl italic underline decoration-1 underline-offset-8 hover:no-underline"
                style={{ fontFamily: "var(--font-manifesto), serif" }}
              >
                vektoagency@gmail.com
              </a>
            </div>
            <div>
              <div
                className="text-[10px] md:text-xs tracking-[0.35em] uppercase opacity-60 mb-2"
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                Voice
              </div>
              <a
                href="tel:+359882251474"
                className="text-xl md:text-3xl italic underline decoration-1 underline-offset-8 hover:no-underline"
                style={{ fontFamily: "var(--font-manifesto), serif" }}
              >
                +359 88 225 1474
              </a>
            </div>
            <div>
              <div
                className="text-[10px] md:text-xs tracking-[0.35em] uppercase opacity-60 mb-2"
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                Response
              </div>
              <div
                className="text-xl md:text-3xl italic"
                style={{ fontFamily: "var(--font-manifesto), serif" }}
              >
                Under twenty-four hours.
              </div>
            </div>
          </div>

          <div className="mt-20 pt-6 border-t border-black/20 flex justify-between text-[10px] md:text-xs tracking-[0.35em] uppercase opacity-60" style={{ fontFamily: "ui-monospace, monospace" }}>
            <span>© VEKTO · MMXXVI</span>
            <span className="hidden md:inline">Sofia, Bulgaria</span>
            <span>vektoagency.com</span>
          </div>
        </div>

        <div
          className="absolute bottom-8 md:bottom-10 left-6 md:left-16 lg:left-24 text-[10px] md:text-xs tracking-[0.35em] opacity-60"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
          — {String(SPREADS.length + 1).padStart(2, "0")} / {String(SPREADS.length + 1).padStart(2, "0")} —
        </div>
      </section>
    </div>
  );
}
