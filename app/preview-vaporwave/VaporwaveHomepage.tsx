"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Miami / synthwave / Ferrari-Testarossa energy. Sunset gradient
// (magenta → coral → gold → cyan), chrome typography with real
// gradient reflections, an animated perspective grid horizon, palm
// silhouettes, italic script accents. Feels like an 80s title card
// but built with 2026 CSS. Confidence via excess, not restraint.

const SERVICES = [
  { name: "ADS",       tint: "#FF2A6D" },
  { name: "CREATIVE",  tint: "#FFC800" },
  { name: "WEBSITES",  tint: "#05D9E8" },
  { name: "STRATEGY",  tint: "#B537F2" },
];

const CLIENTS = [
  "MEN'S CARE", "DUSQ", "PARFEN", "ISOSPORT", "ANOMALY",
  "ETHAN'S", "NUTRIFITT", "LUCKY ENERGY", "BULTEX", "NEDELYA",
  "GOURMET HOUSE", "BIOTICA",
];

export default function VaporwaveHomepage() {
  const [sun, setSun] = useState(0);
  useEffect(() => {
    // sun pulses subtly
    const t = setInterval(() => setSun((s) => (s + 1) % 100), 60);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a0616 0%, #1a0a3a 20%, #4a1a5a 40%, #8a1e58 55%, #d94a3d 70%, #ffa500 82%, #ffd97a 92%, #05d9e8 100%)",
        fontFamily: "var(--font-vapor-body), system-ui, sans-serif",
        color: "#0a0616",
      }}
    >
      {/* ===== STARFIELD ===== */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[50vh] pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => {
          const x = (i * 137.5) % 100;
          const y = (i * 47.3) % 45;
          const s = 1 + (i % 3);
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white/70"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${s}px`,
                height: `${s}px`,
                boxShadow: "0 0 4px white",
              }}
            />
          );
        })}
      </div>

      {/* ===== SUN ===== */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          top: `${28 + Math.sin(sun / 12) * 1}%`,
          width: "420px",
          height: "420px",
          background:
            "radial-gradient(circle, #ffe27a 0%, #ffb84d 25%, #ff5c9c 55%, #b537f2 85%, transparent 100%)",
          filter: "blur(4px)",
          opacity: 0.9,
        }}
      />
      {/* sun cut into slices */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ top: `${28 + Math.sin(sun / 12) * 1}%`, width: "420px", height: "420px" }}
      >
        {[70, 85, 100, 115].map((y) => (
          <div
            key={y}
            className="absolute left-0 right-0 h-1.5"
            style={{
              top: `${y}%`,
              background: "#0a0616",
              opacity: 0.5,
              transform: `scaleY(${1 + (y - 85) / 40})`,
            }}
          />
        ))}
      </div>

      {/* ===== PERSPECTIVE GRID HORIZON ===== */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[45vh] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, #0a0616 60%, #0a0616 100%)",
          perspective: "600px",
        }}
      >
        <div
          className="absolute inset-x-[-20%] bottom-0 h-full origin-top"
          style={{
            transform: "rotateX(60deg)",
            backgroundImage:
              "linear-gradient(to right, #ff2a6d 1px, transparent 1px), linear-gradient(to bottom, #ff2a6d 1px, transparent 1px)",
            backgroundSize: "80px 40px",
            maskImage: "linear-gradient(to top, black 30%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 30%, transparent 100%)",
          }}
        />
      </div>

      {/* ===== PALM SILHOUETTES ===== */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute bottom-[25vh] left-2 md:left-8 w-24 md:w-40 h-40 md:h-64 pointer-events-none"
      >
        <g fill="#0a0616">
          <rect x="47" y="60" width="6" height="40" />
          <path d="M50 60 Q30 45 15 30 Q28 42 47 55 Z" />
          <path d="M50 60 Q70 45 85 30 Q72 42 53 55 Z" />
          <path d="M50 60 Q35 40 25 15 Q40 35 48 52 Z" />
          <path d="M50 60 Q65 40 75 15 Q60 35 52 52 Z" />
          <path d="M50 60 Q45 45 42 22 Q48 45 50 55 Z" />
          <path d="M50 60 Q55 45 58 22 Q52 45 50 55 Z" />
        </g>
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute bottom-[25vh] right-2 md:right-8 w-20 md:w-32 h-32 md:h-52 pointer-events-none"
      >
        <g fill="#0a0616">
          <rect x="47" y="60" width="6" height="40" />
          <path d="M50 60 Q30 45 15 30 Q28 42 47 55 Z" />
          <path d="M50 60 Q70 45 85 30 Q72 42 53 55 Z" />
          <path d="M50 60 Q40 40 30 20 Q45 38 48 52 Z" />
          <path d="M50 60 Q60 40 70 20 Q55 38 52 52 Z" />
        </g>
      </svg>

      {/* ===== TOP BAR ===== */}
      <div className="relative z-20 flex items-center justify-between px-4 md:px-10 py-4 md:py-6">
        <div className="font-chrome text-lg md:text-2xl tracking-widest text-white" style={{ textShadow: "0 0 12px #ff2a6d, 0 0 2px white" }}>
          VEKTO∷STUDIO
        </div>
        <nav className="flex items-center gap-4 md:gap-8 text-white font-bold text-sm">
          <Link href="/case-studies" className="hover:text-[#05d9e8] transition-colors" style={{ textShadow: "0 0 6px rgba(0,0,0,0.6)" }}>
            WORK
          </Link>
          <a href="#services" className="hover:text-[#ffc800] transition-colors hidden md:inline" style={{ textShadow: "0 0 6px rgba(0,0,0,0.6)" }}>
            SERVICES
          </a>
          <a href="#contact" className="hover:text-[#ff2a6d] transition-colors" style={{ textShadow: "0 0 6px rgba(0,0,0,0.6)" }}>
            CONTACT
          </a>
        </nav>
      </div>

      {/* ===== HERO ===== */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-8 md:pt-20 pb-24">
        <div
          className="font-display text-sm md:text-base tracking-[0.5em] uppercase mb-8"
          style={{
            color: "white",
            textShadow: "0 0 12px #ff2a6d, 0 2px 0 rgba(0,0,0,0.4)",
          }}
        >
          ∷ Growth · Made in Sofia ∷
        </div>

        {/* Chrome title */}
        <h1
          className="font-chrome leading-[0.9] tracking-tight mb-8 relative"
          style={{
            fontSize: "clamp(56px, 12vw, 176px)",
            background:
              "linear-gradient(180deg, #ffffff 0%, #ffe4a3 40%, #ff9dbb 65%, #b6f0ff 85%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter:
              "drop-shadow(0 4px 0 rgba(0,0,0,0.4)) drop-shadow(0 0 40px rgba(255,42,109,0.6))",
          }}
        >
          FUTURE
          <br />
          GROWTH
        </h1>

        <div
          className="max-w-2xl text-lg md:text-2xl font-bold text-white leading-tight mb-10"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(255,42,109,0.4)" }}
        >
          50 бранда. 4.8× ROAS. Един екип на растежа —{" "}
          <span
            className="italic font-normal"
            style={{
              color: "#ffe27a",
              textShadow: "0 0 20px #ff2a6d",
            }}
          >
            от София до Маями.
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:vektoagency@gmail.com"
            className="font-chrome text-sm md:text-base tracking-widest px-6 py-3 md:px-8 md:py-4 text-white border-2 hover:scale-105 transition-transform"
            style={{
              background: "linear-gradient(90deg, #ff2a6d 0%, #b537f2 100%)",
              borderColor: "#05d9e8",
              boxShadow: "0 8px 24px -8px #ff2a6d, 0 0 20px #b537f240, inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            RIDE WITH US →
          </a>
          <Link
            href="/case-studies"
            className="font-chrome text-sm md:text-base tracking-widest px-6 py-3 md:px-8 md:py-4 text-white border-2 hover:scale-105 transition-transform"
            style={{
              background: "transparent",
              borderColor: "#05d9e8",
              boxShadow: "0 0 20px #05d9e880",
              textShadow: "0 0 8px #05d9e8",
            }}
          >
            SEE THE REEL
          </Link>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section
        className="relative z-10 mx-4 md:mx-10 rounded-2xl border-2 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6"
        style={{
          background: "rgba(10, 6, 22, 0.7)",
          borderColor: "#05d9e8",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 0 40px -8px #b537f280, inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        {[
          { v: "50+", l: "BRANDS", c: "#ff2a6d" },
          { v: "4.8×", l: "AVG ROAS", c: "#ffc800" },
          { v: "12", l: "SLOTS/YR", c: "#05d9e8" },
          { v: "BG·US", l: "MARKETS", c: "#b537f2" },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div
              className="font-chrome text-4xl md:text-6xl leading-none mb-2"
              style={{
                color: s.c,
                textShadow: `0 0 20px ${s.c}, 0 0 4px white`,
              }}
            >
              {s.v}
            </div>
            <div className="text-white font-bold tracking-widest text-xs">{s.l}</div>
          </div>
        ))}
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="relative z-10 px-4 md:px-10 mt-20 mb-20">
        <div className="text-center mb-10">
          <div
            className="font-display text-sm md:text-base tracking-[0.5em] uppercase text-white mb-3"
            style={{ textShadow: "0 0 12px #b537f2" }}
          >
            ∷ Services ∷
          </div>
          <h2
            className="font-chrome leading-[0.95] tracking-tight"
            style={{
              fontSize: "clamp(36px, 6vw, 84px)",
              background:
                "linear-gradient(180deg, #ffffff 0%, #ff9dbb 60%, #b6f0ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.4))",
            }}
          >
            FOUR TIRES.
            <br />
            ONE ENGINE.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto">
          {SERVICES.map((s, i) => (
            <div
              key={s.name}
              className="rounded-xl border-2 p-6 md:p-8 text-center hover:scale-[1.03] transition-transform"
              style={{
                background: "rgba(10, 6, 22, 0.7)",
                borderColor: s.tint,
                boxShadow: `0 0 30px -6px ${s.tint}, inset 0 1px 0 rgba(255,255,255,0.15)`,
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                className="font-chrome text-4xl md:text-5xl mb-3 leading-none"
                style={{ color: s.tint, textShadow: `0 0 20px ${s.tint}` }}
              >
                0{i + 1}
              </div>
              <div className="text-white font-black tracking-widest text-sm md:text-base">
                {s.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ROSTER MARQUEE ===== */}
      <section className="relative z-10 py-12 border-y-2 border-[#05d9e8]/40 overflow-hidden mb-24" style={{ background: "rgba(10, 6, 22, 0.6)", backdropFilter: "blur(8px)" }}>
        <div className="overflow-hidden">
          <div className="whitespace-nowrap flex vapor-marquee">
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <span key={i} className="mx-8 font-chrome text-2xl md:text-4xl text-white/90" style={{ textShadow: "0 0 10px #ff2a6d" }}>
                {c} <span className="text-[#05d9e8] mx-2">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section id="contact" className="relative z-10 text-center px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-chrome leading-[0.9] tracking-tight mb-8"
            style={{
              fontSize: "clamp(44px, 8vw, 108px)",
              background: "linear-gradient(180deg, #ffffff 0%, #ffe4a3 50%, #ff9dbb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.4)) drop-shadow(0 0 30px #ff2a6d80)",
            }}
          >
            NEON
            <br />
            OR NOTHING.
          </h2>
          <p className="text-white/90 text-base md:text-lg mb-8 font-bold" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}>
            12 позиции за 2026. Личен review. Отговор до 24 часа.
          </p>
          <a
            href="mailto:vektoagency@gmail.com"
            className="inline-block font-chrome text-lg md:text-xl tracking-widest px-10 py-5 text-white border-2 hover:scale-105 transition-transform"
            style={{
              background:
                "linear-gradient(90deg, #ff2a6d 0%, #ffc800 50%, #05d9e8 100%)",
              borderColor: "white",
              boxShadow:
                "0 12px 40px -10px #ff2a6d, 0 0 40px #ffc80080, inset 0 2px 0 rgba(255,255,255,0.4)",
            }}
          >
            VEKTOAGENCY@GMAIL.COM →
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 pt-8 pb-6 px-4 md:px-10 text-center text-white/70 text-xs tracking-widest">
        <div>© MMXXVI · VEKTO GROWTH STUDIO · MADE IN SOFIA · PROVEN WORLDWIDE</div>
      </footer>

      <style jsx global>{`
        .font-chrome  { font-family: var(--font-vapor-chrome), sans-serif; }
        .font-display { font-family: var(--font-vapor-display), sans-serif; }
        @keyframes vapor-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .vapor-marquee { animation: vapor-marquee 42s linear infinite; }
      `}</style>
    </div>
  );
}
