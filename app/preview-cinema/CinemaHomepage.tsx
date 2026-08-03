"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Director's Reel homepage — every choice serves the film metaphor:
//   - 3-2-1 countdown on entry (Academy leader)
//   - Persistent film grain overlay
//   - 21:9 widescreen letterbox enforced (top + bottom black bars)
//   - Chapter markers navigate the page
//   - End-credits scroll for services
//   - Cursor replaced by a playhead
//   - Palette: ivory ink on black + one warm red accent
//   - Type: Cormorant Garamond (film-title serif) + JetBrains Mono
//     (behind-the-scenes technical dateline)

const CLIENTS = [
  "MEN'S CARE", "DUSQ", "PARFEN", "ISOSPORT", "BIOTICA",
  "BULTEX", "NEDELYA", "ANOMALY", "GOURMET HOUSE",
  "ETHAN'S", "LUCKY ENERGY", "NUTRIFITT", "PHYTOLIFE",
  "ARTE HOTEL", "KASHMIR HOTEL", "ALPEN PHARMA",
];

const CHAPTERS = [
  { id: "opening",  no: "I",   title: "Opening" },
  { id: "reel",     no: "II",  title: "The Reel" },
  { id: "roster",   no: "III", title: "The Roster" },
  { id: "credits",  no: "IV",  title: "Credits" },
  { id: "outro",    no: "V",   title: "Fade Out" },
];

const CREDITS = [
  { role: "Directed by",       name: "VEKTO Growth Studio" },
  { role: "Performance / Ads", name: "Meta · Google · TikTok" },
  { role: "Creative",          name: "AI Video · Live-action · UGC" },
  { role: "Infrastructure",    name: "Websites · Funnels · CRM" },
  { role: "Strategy",          name: "Positioning · Offer · Growth" },
  { role: "Location",          name: "Sofia, Bulgaria — Working worldwide" },
  { role: "Year",              name: "MMXXVI" },
];

export default function CinemaHomepage() {
  const [count, setCount] = useState<number | null>(3);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (count === null) return;
    if (count === 0) {
      const t = setTimeout(() => { setCount(null); setPlaying(true); }, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => (c ?? 0) - 1), 900);
    return () => clearTimeout(t);
  }, [count]);

  // Cursor playhead — track mouse position, render custom triangle
  const [pos, setPos] = useState({ x: -100, y: -100 });
  useEffect(() => {
    if (!playing) return;
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [playing]);

  return (
    <>
      {/* ===== ACADEMY LEADER COUNTDOWN ===== */}
      {count !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
          <div className="absolute inset-0 bg-noise pointer-events-none opacity-30" />
          <svg width="380" height="380" viewBox="0 0 380 380" className="relative">
            <circle cx="190" cy="190" r="180" fill="none" stroke="#eae0c8" strokeWidth="0.5" opacity="0.4" />
            <circle cx="190" cy="190" r="150" fill="none" stroke="#eae0c8" strokeWidth="0.5" opacity="0.4" />
            <line x1="190" y1="10" x2="190" y2="370" stroke="#eae0c8" strokeWidth="0.5" opacity="0.4" />
            <line x1="10" y1="190" x2="370" y2="190" stroke="#eae0c8" strokeWidth="0.5" opacity="0.4" />
            <text x="190" y="240" textAnchor="middle" fill="#eae0c8" fontSize="220" fontFamily="var(--font-cinema-serif)" fontWeight="700">
              {count}
            </text>
          </svg>
        </div>
      )}

      <div
        className="min-h-screen bg-black text-[#eae0c8] font-serif relative overflow-x-hidden"
        style={{ cursor: playing ? "none" : "auto" }}
      >
        {/* Persistent film grain */}
        <div aria-hidden className="fixed inset-0 bg-noise pointer-events-none opacity-[0.09] z-[60]" />

        {/* Top letterbox — always visible */}
        <div aria-hidden className="fixed top-0 left-0 right-0 h-[52px] md:h-[80px] bg-black z-40 flex items-end pb-2 pointer-events-none">
          <div className="w-full px-6 md:px-10 flex items-center justify-between font-mono text-[9px] md:text-[11px] uppercase tracking-[0.3em] text-[#eae0c8]/60">
            <span>REC · 24fps</span>
            <span className="hidden md:inline">VKT / REEL 26 / TAKE 01</span>
            <span>0:00:00:00</span>
          </div>
        </div>

        {/* Bottom letterbox */}
        <div aria-hidden className="fixed bottom-0 left-0 right-0 h-[52px] md:h-[80px] bg-black z-40 flex items-start pt-2 pointer-events-none">
          <div className="w-full px-6 md:px-10 flex items-center justify-between font-mono text-[9px] md:text-[11px] uppercase tracking-[0.3em] text-[#eae0c8]/60">
            <span>SOFIA · BG</span>
            <span className="hidden md:inline">SCROLL TO PLAY ↓</span>
            <span>© MMXXVI</span>
          </div>
        </div>

        {/* Cursor playhead */}
        {playing && (
          <div
            aria-hidden
            className="fixed z-[70] pointer-events-none mix-blend-difference"
            style={{
              left: pos.x - 8,
              top: pos.y - 8,
              transform: "translate3d(0,0,0)",
            }}
          >
            <svg width="16" height="20" viewBox="0 0 16 20">
              <polygon points="0,0 16,10 0,20" fill="#eae0c8" />
            </svg>
          </div>
        )}

        {/* ===== CHAPTER I — OPENING ===== */}
        <section id="opening" className="min-h-screen flex flex-col justify-center pt-24 pb-24 px-6 md:px-14 relative">
          <div className="mb-10 md:mb-14 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#a24525] flex items-center gap-4">
            <span className="w-8 h-px bg-[#a24525]" />
            <span>Chapter I — Opening</span>
          </div>

          <h1
            className="font-serif italic leading-[0.88] tracking-tight text-balance"
            style={{ fontSize: "clamp(64px, 14vw, 240px)", fontWeight: 300 }}
          >
            Growth,
            <br />
            in <em style={{ color: "#a24525" }}>widescreen.</em>
          </h1>

          <div className="mt-14 md:mt-24 max-w-2xl grid grid-cols-[1fr_auto] gap-8 items-end">
            <p className="text-lg md:text-2xl leading-[1.4]" style={{ fontWeight: 300 }}>
              50 бранда в България и САЩ. Един режисьор.
              <em style={{ color: "#a24525" }}> Един кадър.</em>
            </p>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#eae0c8]/50 text-right whitespace-nowrap">
              Runtime<br />00:00:00
            </div>
          </div>
        </section>

        {/* ===== CHAPTER II — THE REEL ===== */}
        <section id="reel" className="min-h-screen py-24 px-6 md:px-14 relative border-t border-[#eae0c8]/10">
          <div className="mb-12 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#a24525] flex items-center gap-4">
            <span className="w-8 h-px bg-[#a24525]" />
            <span>Chapter II — The Reel</span>
          </div>

          <div className="grid md:grid-cols-[240px_1fr] gap-12 md:gap-20">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#eae0c8]/60 space-y-2">
              <div>REEL / 26</div>
              <div>ASPECT / 2.39:1</div>
              <div>COLOR / GRADED</div>
              <div>LEN / 04:32</div>
            </div>
            <div>
              <h2
                className="font-serif italic leading-[1.02] mb-10 tracking-tight text-balance"
                style={{ fontSize: "clamp(36px, 5vw, 76px)", fontWeight: 300 }}
              >
                Кадри, които се <em style={{ color: "#a24525" }}>помнят.</em>
              </h2>
              <div
                className="aspect-[21/9] border border-[#eae0c8]/20 flex items-center justify-center relative"
                style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1512 100%)" }}
              >
                <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.15]" />
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#eae0c8]/50">
                  [ WIDESCREEN · SHOWREEL LOADS HERE ]
                </div>
                <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[#eae0c8]/60">
                  ● REC
                </div>
                <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[#eae0c8]/60">
                  ▶ PLAY
                </div>
              </div>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-3 mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-[#eae0c8] hover:text-[#a24525] transition-colors border-b border-[#eae0c8]/30 pb-1"
              >
                <span>▶</span>
                <span>View full reel</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== CHAPTER III — THE ROSTER ===== */}
        <section id="roster" className="min-h-screen py-24 px-6 md:px-14 relative border-t border-[#eae0c8]/10">
          <div className="mb-12 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#a24525] flex items-center gap-4">
            <span className="w-8 h-px bg-[#a24525]" />
            <span>Chapter III — The Roster</span>
          </div>

          <h2
            className="font-serif italic leading-[0.98] mb-12 md:mb-20 tracking-tight text-balance"
            style={{ fontSize: "clamp(40px, 7vw, 108px)", fontWeight: 300 }}
          >
            The cast, in order of <em style={{ color: "#a24525" }}>appearance.</em>
          </h2>

          <div className="grid md:grid-cols-[80px_1fr_120px] font-mono text-[11px] md:text-[13px] uppercase tracking-[0.25em]">
            {CLIENTS.map((c, i) => (
              <div key={c} className="contents">
                <div className="py-4 md:py-5 text-[#eae0c8]/50 border-t border-[#eae0c8]/10">
                  {String(i + 1).padStart(3, "0")}
                </div>
                <div className="py-4 md:py-5 border-t border-[#eae0c8]/10">{c}</div>
                <div className="hidden md:block py-4 md:py-5 text-[#eae0c8]/50 border-t border-[#eae0c8]/10 text-right">
                  {(2024 + (i % 3)).toString()}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CHAPTER IV — END CREDITS ===== */}
        <section id="credits" className="min-h-screen py-24 px-6 md:px-14 relative border-t border-[#eae0c8]/10 flex flex-col items-center justify-center text-center">
          <div className="mb-16 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#a24525]">
            Chapter IV — Credits
          </div>

          <div className="max-w-md space-y-6 md:space-y-8">
            {CREDITS.map((c) => (
              <div key={c.role} className="space-y-1">
                <div className="font-mono text-[9px] md:text-[11px] uppercase tracking-[0.3em] text-[#eae0c8]/50">
                  {c.role}
                </div>
                <div className="font-serif text-2xl md:text-4xl italic leading-tight" style={{ fontWeight: 300 }}>
                  {c.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CHAPTER V — FADE OUT / CTA ===== */}
        <section id="outro" className="min-h-screen py-24 px-6 md:px-14 relative border-t border-[#eae0c8]/10 flex flex-col items-center justify-center text-center">
          <div className="mb-12 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#a24525]">
            Chapter V — Fade Out
          </div>
          <h2
            className="font-serif italic leading-[0.9] mb-14 tracking-tight text-balance"
            style={{ fontSize: "clamp(56px, 12vw, 200px)", fontWeight: 300 }}
          >
            The end.<br />
            <em style={{ color: "#a24525" }}>Or the start.</em>
          </h2>
          <a
            href="mailto:vektoagency@gmail.com"
            className="font-mono text-[11px] md:text-[13px] uppercase tracking-[0.3em] border border-[#eae0c8] px-8 py-4 hover:bg-[#eae0c8] hover:text-black transition-colors"
          >
            Cast me · vektoagency@gmail.com
          </a>
          <div className="mt-24 font-mono text-[9px] uppercase tracking-[0.4em] text-[#eae0c8]/40">
            ═══ FIN ═══
          </div>
        </section>

        {/* Chapter navigation — right rail on desktop */}
        <nav aria-hidden className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4 font-mono text-[10px] uppercase tracking-[0.25em]">
          {CHAPTERS.map((ch) => (
            <a key={ch.id} href={`#${ch.id}`} className="flex items-center gap-3 text-[#eae0c8]/50 hover:text-[#eae0c8] transition-colors">
              <span className="w-6 h-px bg-current" />
              <span>{ch.no}</span>
            </a>
          ))}
        </nav>
      </div>

      <style jsx global>{`
        .font-serif { font-family: var(--font-cinema-serif), Georgia, serif; }
        .font-mono  { font-family: var(--font-cinema-mono), ui-monospace, monospace; }
        .bg-noise {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.92  0 0 0 0 0.88  0 0 0 0 0.78  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          animation: grain 0.8s steps(6) infinite;
        }
        @keyframes grain {
          0%   { transform: translate(0, 0); }
          20%  { transform: translate(-4%, 3%); }
          40%  { transform: translate(3%, -3%); }
          60%  { transform: translate(-2%, 4%); }
          80%  { transform: translate(4%, -2%); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </>
  );
}
