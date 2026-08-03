"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Neutral-brutalism / restrained 90s revival. We keep every brutalism
// DNA move — table layout, hard borders, offset shadows, marquee,
// pixel captions, retro visitor counter, hard-edged services grid —
// but strip the palette down to bone-white + jet black + a single
// metallic-silver accent (rendered as a chrome gradient on the
// wordmark and on the hero emphasis). Feels expensive rather than
// carnival.
//
// Palette:
//   #ebe8e0  bone paper background
//   #0d0d0d  jet black ink and borders
//   #8a8a8a → #eaeaea → #6d6d6d  brushed-silver gradient (accent)
//   #d6d3ca  muted concrete tint (secondary panels)

const CLIENTS = [
  "MEN'S CARE", "DUSQ", "PARFEN", "ISOSPORT", "BIOTICA",
  "BULTEX", "NEDELYA", "ANOMALY", "GOURMET HOUSE",
  "ETHAN'S", "LUCKY ENERGY", "NUTRIFITT",
];

const SERVICES = [
  { icon: "★", name: "PPC ADS",    detail: "Meta · Google · TikTok"    },
  { icon: "◉", name: "CREATIVE",   detail: "Video · UGC · AI"          },
  { icon: "▲", name: "WEBSITES",   detail: "Ecom · Landing · Portals"  },
  { icon: "◆", name: "STRATEGY",   detail: "Growth · Offer · Brand"    },
];

const NEWS = [
  { d: "04.08.26", n: "★ NOW ACCEPTING 12 NEW BRANDS FOR 2026" },
  { d: "01.08.26", n: "★ NEW CASE: MEN'S CARE — 5.2× REVENUE LIFT" },
  { d: "24.07.26", n: "★ VEKTO x DUSQ — US LAUNCH CAMPAIGN LIVE" },
  { d: "10.07.26", n: "★ BULTEX + NEDELYA JOIN THE ROSTER" },
];

// Brushed-silver gradient — used everywhere silver appears.
// Applied via CSS backgroundImage + text-fill for the wordmark, and
// as a solid panel background for chrome plates.
const SILVER_GRADIENT =
  "linear-gradient(180deg, #c4c4c4 0%, #f4f4f4 22%, #8a8a8a 48%, #eaeaea 52%, #6d6d6d 82%, #b0b0b0 100%)";
const SILVER_GRADIENT_H =
  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 20%, #8a8a8a 45%, #eaeaea 55%, #6d6d6d 80%, #b0b0b0 100%)";

export default function BrutalismHomepage() {
  const [visitors, setVisitors] = useState(0);
  useEffect(() => {
    const start = 42_000 + Math.floor(Math.random() * 8000);
    setVisitors(start);
    const t = setInterval(() => setVisitors((v) => v + 1), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "#ebe8e0",
        fontFamily: "var(--font-brutal-grotesk), system-ui, sans-serif",
        color: "#0d0d0d",
      }}
    >
      {/* ===== TOP MARQUEE — silver bar on black ===== */}
      <div
        className="border-y-2 border-black overflow-hidden py-1.5"
        style={{ background: "#0d0d0d" }}
      >
        <div className="whitespace-nowrap flex marquee-anim">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="text-sm md:text-base tracking-[0.15em] font-black px-8"
              style={{
                background: SILVER_GRADIENT_H,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ✦ VEKTO GROWTH STUDIO ✦ EST. MMXXIV ✦ SOFIA · BG ✦ 50+ BRANDS ✦ 4.8× ROAS ✦ 12 SLOTS LEFT ✦ AI · CREATIVE · GROWTH ✦
            </span>
          ))}
        </div>
      </div>

      {/* ===== TABLE LAYOUT (deliberately deprecated) ===== */}
      <table className="w-full border-separate border-spacing-0" cellPadding={0} cellSpacing={0}>
        <tbody>
          {/* ROW 1 — MASTHEAD */}
          <tr>
            <td colSpan={3} className="border-b-4 border-black">
              <div
                className="p-4 md:p-6 flex items-center justify-between gap-3"
                style={{ background: "#0d0d0d" }}
              >
                <div className="flex items-center gap-3">
                  {/* Chrome V plate */}
                  <div
                    className="w-11 h-11 md:w-14 md:h-14 border-2 border-black flex items-center justify-center font-black text-2xl md:text-3xl text-black"
                    style={{
                      background: SILVER_GRADIENT,
                      boxShadow: "2px 2px 0 0 #000, inset 0 0 0 1px rgba(255,255,255,0.4)",
                      fontFamily: "var(--font-brutal-grotesk)",
                    }}
                  >
                    V
                  </div>
                  {/* Real VEKTO wordmark, masked with brushed-silver gradient
                      so it reads as one continuous chrome plate with the V. */}
                  <div
                    aria-label="VEKTO"
                    className="h-8 md:h-12 w-[128px] md:w-[196px]"
                    style={{
                      background: SILVER_GRADIENT,
                      WebkitMaskImage: "url(/images/logo.png)",
                      maskImage: "url(/images/logo.png)",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "left center",
                      maskPosition: "left center",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                    }}
                  />
                </div>
                <a
                  href="mailto:vektoagency@gmail.com"
                  className="hidden md:inline-block px-5 py-2 border-2 border-white font-bold uppercase text-sm tracking-wide text-black hover:invert transition-all"
                  style={{ background: SILVER_GRADIENT }}
                >
                  ✉ EMAIL US
                </a>
              </div>
            </td>
          </tr>

          {/* ROW 2 — NAV */}
          <tr>
            <td colSpan={3} className="border-b-2 border-black" style={{ background: "#ffffff" }}>
              <div className="flex flex-wrap items-center justify-between px-4 py-2 gap-2 text-[13px] md:text-sm font-bold uppercase tracking-[0.15em]">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <a href="#services" className="hover:underline decoration-2 underline-offset-4">★ Services</a>
                  <Link href="/case-studies" className="hover:underline decoration-2 underline-offset-4">★ Work</Link>
                  <Link href="/portfolio" className="hover:underline decoration-2 underline-offset-4">★ Portfolio</Link>
                  <a href="#contact" className="hover:underline decoration-2 underline-offset-4">★ Contact</a>
                </div>
                <div
                  className="text-[11px]"
                  style={{ fontFamily: "var(--font-brutal-pixel)" }}
                >
                  VISITORS:{" "}
                  <span className="bg-black px-2 py-0.5 text-white">
                    {visitors.toLocaleString()}
                  </span>
                </div>
              </div>
            </td>
          </tr>

          {/* ROW 3 — HERO ROW (main + sidebar) */}
          <tr>
            <td colSpan={2} className="border-r-2 border-black border-b-2 align-top">
              <div className="p-6 md:p-12 relative overflow-hidden" style={{ background: "#ebe8e0" }}>
                {/* Subtle silver halo instead of rainbow blob */}
                <div
                  aria-hidden
                  className="absolute -top-24 -right-24 w-[420px] h-[420px] -z-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(180,180,180,0.55) 0%, rgba(180,180,180,0) 65%)",
                    filter: "blur(20px)",
                  }}
                />
                <div className="relative">
                  <div
                    className="inline-block border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] mb-6"
                    style={{
                      background: SILVER_GRADIENT_H,
                      boxShadow: "4px 4px 0 0 #000",
                      color: "#0d0d0d",
                    }}
                  >
                    ⚡ CURRENTLY ACCEPTING BRANDS
                  </div>
                  <h1
                    className="text-[52px] md:text-[104px] lg:text-[128px] font-black leading-[0.88] tracking-[-0.04em] mb-8"
                    style={{ WebkitTextStroke: "1px black" }}
                  >
                    WE BUILD{" "}
                    <span
                      className="italic"
                      style={{
                        background: SILVER_GRADIENT_H,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        WebkitTextStroke: "0",
                      }}
                    >
                      GROWTH.
                    </span>
                    <br />
                    NOT PROJECTS.
                  </h1>

                  <p
                    className="text-lg md:text-xl leading-snug max-w-xl mb-8 font-bold"
                    style={{ fontFamily: "var(--font-brutal-comic)" }}
                  >
                    Независимо студио. 50+ бранда в БГ и САЩ.
                    Реклами · Съдържание · Сайтове · Стратегия — под един покрив.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href="mailto:vektoagency@gmail.com"
                      className="bg-black text-white px-6 py-3 border-2 border-black font-bold uppercase tracking-wide hover:translate-x-1 hover:translate-y-1 transition-transform"
                      style={{ boxShadow: "6px 6px 0 0 #8a8a8a" }}
                    >
                      → BOOK A CALL
                    </a>
                    <Link
                      href="/case-studies"
                      className="text-black px-6 py-3 border-2 border-black font-bold uppercase tracking-wide hover:translate-x-1 hover:translate-y-1 transition-transform"
                      style={{
                        background: SILVER_GRADIENT_H,
                        boxShadow: "6px 6px 0 0 #0d0d0d",
                      }}
                    >
                      ▶ SEE WORK
                    </Link>
                  </div>
                </div>
              </div>
            </td>
            <td
              rowSpan={2}
              className="border-b-2 border-black align-top w-[280px] hidden lg:table-cell"
              style={{ background: "#d6d3ca" }}
            >
              {/* SIDEBAR — NEWS TICKER */}
              <div className="p-4 border-b-2 border-black">
                <div
                  className="text-lg font-black uppercase mb-2 tracking-[0.1em]"
                  style={{ fontFamily: "var(--font-brutal-pixel)" }}
                >
                  ✦ LATEST NEWS ✦
                </div>
                <div className="space-y-2 text-[13px]">
                  {NEWS.map((n) => (
                    <div key={n.d} className="border-b border-dashed border-black pb-2 last:border-0">
                      <div
                        className="text-[10px]"
                        style={{ fontFamily: "var(--font-brutal-pixel)" }}
                      >
                        {n.d}
                      </div>
                      <div className="font-bold leading-tight">{n.n}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA CARD — chrome plate */}
              <div className="p-4 border-b-2 border-black" style={{ background: "#ebe8e0" }}>
                <div className="text-xs font-black uppercase tracking-[0.2em] mb-2">
                  ✉ MAILING LIST
                </div>
                <div
                  className="text-[13px] mb-3"
                  style={{ fontFamily: "var(--font-brutal-comic)" }}
                >
                  Growth случаи всеки петък. Спам-free от 2024.
                </div>
                <div
                  className="border-2 border-black bg-white px-2 py-1.5 text-sm"
                  style={{ fontFamily: "var(--font-brutal-pixel)" }}
                >
                  YOUR@EMAIL.COM
                </div>
                <button
                  className="mt-2 w-full bg-black text-white font-bold uppercase text-xs py-2 hover:bg-white hover:text-black border-2 border-black transition-colors"
                >
                  ▶ SUBSCRIBE
                </button>
              </div>

              {/* STATS — chrome plates */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 text-center">
                  {[["50+", "BRANDS"], ["4.8×", "ROAS"], ["12", "SLOTS"], ["100%", "IN-HOUSE"]].map(([v, l]) => (
                    <div
                      key={l}
                      className="border-2 border-black p-3 text-black"
                      style={{
                        background: SILVER_GRADIENT,
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)",
                      }}
                    >
                      <div className="text-2xl font-black leading-none">{v}</div>
                      <div className="text-[9px] font-bold tracking-[0.2em] mt-1">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </td>
          </tr>

          {/* ROW 4 — SERVICES GRID */}
          <tr>
            <td colSpan={2} className="border-b-2 border-black" id="services">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t-0">
                {SERVICES.map((s, i) => {
                  // Alternate two neutral tones for grid rhythm.
                  const bg = i % 2 === 0 ? "#ebe8e0" : "#d6d3ca";
                  return (
                    <div
                      key={s.name}
                      className={`p-6 md:p-8 border-r-2 border-black ${i === SERVICES.length - 1 ? "border-r-0" : ""} ${i >= 2 ? "border-t-2 md:border-t-0" : ""} relative overflow-hidden hover:z-10 hover:scale-[1.02] transition-transform`}
                      style={{ background: bg }}
                    >
                      <div
                        className="text-6xl md:text-7xl font-black mb-4 leading-none"
                        style={{
                          WebkitTextStroke: "1.5px #0d0d0d",
                          color: "transparent",
                          background: SILVER_GRADIENT,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                        }}
                      >
                        {s.icon}
                      </div>
                      <div className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none mb-2">
                        {s.name}
                      </div>
                      <div
                        className="text-xs font-bold uppercase tracking-[0.15em]"
                      >
                        {s.detail}
                      </div>
                    </div>
                  );
                })}
              </div>
            </td>
          </tr>

          {/* ROW 5 — ROSTER */}
          <tr>
            <td colSpan={3} className="border-b-2 border-black text-white" style={{ background: "#0d0d0d" }}>
              <div className="p-6 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 border-2 border-white flex items-center justify-center text-2xl font-black text-black"
                    style={{ background: SILVER_GRADIENT }}
                  >
                    ★
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black uppercase">
                    OUR CAST
                  </h2>
                  <div
                    className="flex-1 h-[3px]"
                    style={{ background: SILVER_GRADIENT_H }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {CLIENTS.map((c) => (
                    <div
                      key={c}
                      className="border-2 border-white bg-black px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold uppercase tracking-[0.15em] hover:text-black cursor-default transition-all"
                      style={{
                        // hover flips to silver chrome via a CSS var
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = SILVER_GRADIENT;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#0d0d0d";
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </td>
          </tr>

          {/* ROW 6 — CONTACT + FOOTER */}
          <tr>
            <td colSpan={3} id="contact">
              <div className="p-6 md:p-14 relative overflow-hidden" style={{ background: "#ebe8e0" }}>
                <div className="max-w-4xl">
                  <div className="text-xs font-bold uppercase tracking-[0.25em] mb-4">
                    // CONTACT.INFO
                  </div>
                  <h2 className="text-[44px] md:text-[88px] lg:text-[112px] font-black leading-[0.9] tracking-[-0.04em] mb-10">
                    YOUR BRAND{" "}
                    <span
                      className="italic"
                      style={{
                        background: SILVER_GRADIENT_H,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      DESERVES
                    </span>
                    <br />
                    A GROWTH SYSTEM.
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 max-w-2xl mb-8">
                    <a
                      href="mailto:vektoagency@gmail.com"
                      className="border-4 border-black bg-white p-5 hover:bg-black hover:text-white transition-colors"
                      style={{ boxShadow: "8px 8px 0 0 #8a8a8a" }}
                    >
                      <div className="text-xs font-bold uppercase tracking-[0.2em] mb-1 opacity-60">
                        ✉ Email
                      </div>
                      <div className="text-lg md:text-xl font-black break-all">
                        vektoagency@gmail.com
                      </div>
                    </a>
                    <a
                      href="tel:+359882251474"
                      className="border-4 border-black p-5 text-black hover:bg-black hover:text-white transition-colors"
                      style={{
                        background: SILVER_GRADIENT,
                        boxShadow: "8px 8px 0 0 #0d0d0d",
                      }}
                    >
                      <div className="text-xs font-bold uppercase tracking-[0.2em] mb-1 opacity-70">
                        ☎ Phone
                      </div>
                      <div className="text-lg md:text-xl font-black">
                        +359 88 225 1474
                      </div>
                    </a>
                  </div>

                  {/* Guestbook line */}
                  <div
                    className="mt-14 text-xs tracking-[0.15em] opacity-60 border-t-2 border-dashed border-black pt-4"
                    style={{ fontFamily: "var(--font-brutal-pixel)" }}
                  >
                    // GUESTBOOK · SITE LAST UPDATED 04.08.2026 · BEST VIEWED IN ANY BROWSER · MADE WITH ♥ IN SOFIA
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <style jsx global>{`
        @keyframes marquee-anim {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.33%); }
        }
        .marquee-anim {
          animation: marquee-anim 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
