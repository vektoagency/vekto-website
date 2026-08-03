"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Anti-modern brutalism / 90s web revival. Table-based layout,
// rainbow gradients used seriously, pixel icons, blinking marquee,
// visitor counter, "under construction" energy — but the CRAFT is
// 2026 (real accessibility, real responsive scaling, real Cyrillic
// support). Executed with a wink, not as parody.
//
// Palette: hot pink, cyan, chrome yellow, safety orange on eggshell
// background. Blackened borders everywhere. Nothing is rounded.

const CLIENTS = [
  "MEN'S CARE", "DUSQ", "PARFEN", "ISOSPORT", "BIOTICA",
  "BULTEX", "NEDELYA", "ANOMALY", "GOURMET HOUSE",
  "ETHAN'S", "LUCKY ENERGY", "NUTRIFITT",
];

const SERVICES = [
  { icon: "★", name: "PPC ADS",    color: "#FF3D9E", detail: "Meta · Google · TikTok"    },
  { icon: "◉", name: "CREATIVE",   color: "#00E5FF", detail: "Video · UGC · AI"          },
  { icon: "▲", name: "WEBSITES",   color: "#FFC800", detail: "Ecom · Landing · Portals"  },
  { icon: "◆", name: "STRATEGY",   color: "#FF6B00", detail: "Growth · Offer · Brand"    },
];

const NEWS = [
  { d: "04.08.26", n: "🔥 NOW ACCEPTING 12 NEW BRANDS FOR 2026" },
  { d: "01.08.26", n: "★ NEW CASE: MEN'S CARE — 5.2× REVENUE LIFT" },
  { d: "24.07.26", n: "✦ VEKTO x DUSQ — US LAUNCH CAMPAIGN LIVE" },
  { d: "10.07.26", n: "▲ BULTEX + NEDELYA JOIN THE ROSTER" },
];

export default function BrutalismHomepage() {
  const [visitors, setVisitors] = useState(0);
  useEffect(() => {
    // Simulated visitor counter
    const start = 42_000 + Math.floor(Math.random() * 8000);
    setVisitors(start);
    const t = setInterval(() => setVisitors((v) => v + 1), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "#f2ede0",
        fontFamily: "var(--font-brutal-grotesk), system-ui, sans-serif",
        color: "#0a0a0a",
      }}
    >
      {/* Marquee at very top */}
      <div className="border-y-2 border-black overflow-hidden bg-black text-white py-1.5">
        <div className="whitespace-nowrap flex marquee-anim">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-sm md:text-base tracking-wider font-bold px-8">
              ★ VEKTO GROWTH STUDIO ★ EST. MMXXIV ★ SOFIA · BG ★ 50+ BRANDS ★ 4.8× ROAS ★ 12 SLOTS LEFT ★ AI · CREATIVE · GROWTH ★
            </span>
          ))}
        </div>
      </div>

      {/* ===== TABLE LAYOUT — deliberately deprecated ===== */}
      <table className="w-full border-separate border-spacing-0" cellPadding={0} cellSpacing={0}>
        <tbody>
          {/* ROW 1 — MASTHEAD */}
          <tr>
            <td colSpan={3} className="border-b-4 border-black">
              <div
                className="p-4 md:p-6 flex items-center justify-between gap-3"
                style={{
                  background:
                    "linear-gradient(90deg, #FF3D9E 0%, #FFC800 33%, #00E5FF 66%, #A259FF 100%)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 md:w-14 md:h-14 border-4 border-black bg-white flex items-center justify-center font-black text-2xl md:text-3xl"
                    style={{ fontFamily: "var(--font-brutal-grotesk)" }}
                  >
                    V
                  </div>
                  <div className="leading-none">
                    <div className="text-2xl md:text-4xl font-black tracking-tight">
                      VEKTO<span className="text-white">.STUDIO</span>
                    </div>
                    <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase mt-1">
                      GROWTH · MADE · IN · BULGARIA
                    </div>
                  </div>
                </div>
                <a
                  href="mailto:vektoagency@gmail.com"
                  className="hidden md:inline-block bg-black text-white px-5 py-2 border-2 border-black font-bold uppercase text-sm tracking-wide hover:bg-white hover:text-black transition-colors"
                >
                  ✉ EMAIL US
                </a>
              </div>
            </td>
          </tr>

          {/* ROW 2 — NAV */}
          <tr>
            <td colSpan={3} className="border-b-2 border-black bg-white">
              <div className="flex flex-wrap items-center justify-between px-4 py-2 gap-2 text-[13px] md:text-sm font-bold uppercase tracking-wider">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <a href="#services" className="hover:bg-yellow-300 px-1">★ Services</a>
                  <Link href="/case-studies" className="hover:bg-cyan-300 px-1">★ Work</Link>
                  <Link href="/portfolio" className="hover:bg-pink-300 px-1">★ Portfolio</Link>
                  <a href="#contact" className="hover:bg-orange-300 px-1">★ Contact</a>
                </div>
                <div className="font-mono text-[11px]" style={{ fontFamily: "var(--font-brutal-pixel)" }}>
                  VISITORS: <span className="bg-black text-lime-300 px-2 py-0.5">{visitors.toLocaleString()}</span>
                </div>
              </div>
            </td>
          </tr>

          {/* ROW 3 — HERO ROW (main + sidebar) */}
          <tr>
            <td colSpan={2} className="border-r-2 border-black border-b-2 align-top">
              <div className="p-6 md:p-12 relative overflow-hidden">
                <div
                  aria-hidden
                  className="absolute -top-32 -right-32 w-96 h-96 -z-0"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #FF3D9E, #FFC800, #00E5FF, #A259FF, #FF3D9E)",
                    filter: "blur(60px)",
                    opacity: 0.4,
                  }}
                />
                <div className="relative">
                  <div
                    className="inline-block border-2 border-black bg-yellow-300 px-3 py-1 text-xs font-bold uppercase tracking-widest mb-6"
                    style={{ boxShadow: "4px 4px 0 0 #000" }}
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
                        background:
                          "linear-gradient(90deg, #FF3D9E 0%, #FFC800 50%, #00E5FF 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
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
                      style={{ boxShadow: "6px 6px 0 0 #FF3D9E" }}
                    >
                      → BOOK A CALL
                    </a>
                    <Link
                      href="/case-studies"
                      className="bg-white text-black px-6 py-3 border-2 border-black font-bold uppercase tracking-wide hover:translate-x-1 hover:translate-y-1 transition-transform"
                      style={{ boxShadow: "6px 6px 0 0 #00E5FF" }}
                    >
                      ▶ SEE WORK
                    </Link>
                  </div>
                </div>
              </div>
            </td>
            <td rowSpan={2} className="border-b-2 border-black align-top w-[280px] hidden lg:table-cell">
              {/* SIDEBAR — NEWS TICKER */}
              <div className="p-4 bg-cyan-100 border-b-2 border-black">
                <div
                  className="text-lg font-black uppercase mb-2"
                  style={{ fontFamily: "var(--font-brutal-pixel)" }}
                >
                  ✦ LATEST NEWS ✦
                </div>
                <div className="space-y-2 text-[13px]">
                  {NEWS.map((n) => (
                    <div key={n.d} className="border-b border-dashed border-black pb-2 last:border-0">
                      <div className="font-mono text-[10px]" style={{ fontFamily: "var(--font-brutal-pixel)" }}>
                        {n.d}
                      </div>
                      <div className="font-bold leading-tight">{n.n}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA CARD */}
              <div className="p-4 bg-pink-200 border-b-2 border-black">
                <div className="text-xs font-black uppercase tracking-widest mb-2">
                  ✉ MAILING LIST
                </div>
                <div className="text-[13px] mb-3" style={{ fontFamily: "var(--font-brutal-comic)" }}>
                  Growth случаи всеки петък. Спам-free от 2024.
                </div>
                <div
                  className="border-2 border-black bg-white px-2 py-1.5 text-sm font-mono"
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

              {/* STATS */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 text-center">
                  {[["50+", "BRANDS"], ["4.8×", "ROAS"], ["12", "SLOTS"], ["100%", "IN-HOUSE"]].map(([v, l]) => (
                    <div key={l} className="border-2 border-black bg-yellow-200 p-3">
                      <div className="text-2xl font-black leading-none">{v}</div>
                      <div className="text-[9px] font-bold tracking-widest mt-1">{l}</div>
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
                {SERVICES.map((s, i) => (
                  <div
                    key={s.name}
                    className={`p-6 md:p-8 border-r-2 border-black ${i === SERVICES.length - 1 ? "border-r-0" : ""} ${i >= 2 ? "border-t-2 md:border-t-0" : ""} relative overflow-hidden hover:z-10 hover:scale-[1.02] transition-transform`}
                    style={{ background: s.color }}
                  >
                    <div className="text-6xl md:text-7xl font-black mb-4 leading-none" style={{ WebkitTextStroke: "2px black", color: "white" }}>
                      {s.icon}
                    </div>
                    <div className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none mb-2">
                      {s.name}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      {s.detail}
                    </div>
                  </div>
                ))}
              </div>
            </td>
          </tr>

          {/* ROW 5 — ROSTER */}
          <tr>
            <td colSpan={3} className="border-b-2 border-black bg-black text-white">
              <div className="p-6 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-yellow-300 border-2 border-white flex items-center justify-center text-2xl font-black text-black">
                    ★
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black uppercase">
                    OUR CAST
                  </h2>
                  <div className="flex-1 h-1 bg-yellow-300" />
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {CLIENTS.map((c) => (
                    <div
                      key={c}
                      className="border-2 border-white bg-black px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 hover:text-black transition-colors cursor-default"
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
              <div className="p-6 md:p-14 relative overflow-hidden" style={{ background: "#f2ede0" }}>
                <div className="max-w-4xl">
                  <div className="text-xs font-bold uppercase tracking-widest mb-4">
                    // CONTACT.INFO
                  </div>
                  <h2 className="text-[44px] md:text-[88px] lg:text-[112px] font-black leading-[0.9] tracking-[-0.04em] mb-10">
                    YOUR BRAND{" "}
                    <span
                      className="italic"
                      style={{
                        background:
                          "linear-gradient(90deg, #FF3D9E 0%, #00E5FF 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
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
                      className="border-4 border-black bg-white p-5 hover:bg-black hover:text-white transition-colors group"
                      style={{ boxShadow: "8px 8px 0 0 #FF3D9E" }}
                    >
                      <div className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60">
                        ✉ Email
                      </div>
                      <div className="text-lg md:text-xl font-black break-all">
                        vektoagency@gmail.com
                      </div>
                    </a>
                    <a
                      href="tel:+359882251474"
                      className="border-4 border-black bg-white p-5 hover:bg-black hover:text-white transition-colors group"
                      style={{ boxShadow: "8px 8px 0 0 #00E5FF" }}
                    >
                      <div className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60">
                        ☎ Phone
                      </div>
                      <div className="text-lg md:text-xl font-black">
                        +359 88 225 1474
                      </div>
                    </a>
                  </div>

                  {/* Guestbook line */}
                  <div
                    className="mt-14 text-xs font-mono tracking-wider opacity-60 border-t-2 border-dashed border-black pt-4"
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
