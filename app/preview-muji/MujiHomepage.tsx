"use client";

// MUJI / Kanda / Japanese warm minimalism homepage. Tiny type on
// massive whitespace, cream paper background, deep aubergine ink,
// thin serifs mixed with clean sans, custom horizontal rule pairs
// (thick + thin duo), single hairline photograph pinned to margin,
// vertical margins deliberately wider than horizontal. Feels like a
// MUJI seasonal catalogue or a Tokyo boutique's press release.
//
// Signature moves:
//   1. Two-line horizontal rules (heavy 1.5px + hairline 0.5px)
//      used as section markers — replaces the standard section rule
//   2. Body text set small (14px on desktop) — restraint via type
//      size, not just whitespace
//   3. Vertical spacing 1.6× horizontal spacing everywhere — feels
//      like a printed leaflet, not a webpage
//   4. Single-photograph column pinned to right margin (like a
//      catalogue's inset image)
//   5. Deep aubergine ink instead of black — warmer, more human

import Link from "next/link";

const CLIENTS = [
  "MEN'S CARE",   "DUSQ",         "PARFEN",       "ISOSPORT",
  "BIOTICA",      "ANOMALY",      "ETHAN'S",      "LUCKY ENERGY",
  "NUTRIFITT",    "BULTEX",       "NEDELYA",      "GOURMET HOUSE",
];

const NOTES = [
  {
    label: "01 — Position",
    body: "Vekto е независимо студио за растеж, което работи с петдесет бранда в България и Съединените щати.",
  },
  {
    label: "02 — Practice",
    body: "Реклами. Съдържание. Уебсайтове. Стратегия. Четири дисциплини, един разговор, един стандарт.",
  },
  {
    label: "03 — Result",
    body: "Средно 4.8× възвращаемост от рекламни кампании. Личен преглед на всеки нов бранд.",
  },
  {
    label: "04 — Selection",
    body: "Приемаме дванадесет нови партньорства годишно. Кванталот на очаквания е предопределен.",
  },
];

export default function MujiHomepage() {
  return (
    <div
      className="min-h-screen text-[#2f2530] selection:bg-[#5a3f5c] selection:text-[#faf7ef]"
      style={{
        background: "#faf7ef",
        fontFamily: "var(--font-muji-sans), system-ui, sans-serif",
      }}
    >
      {/* ===== TOP RUNNING HEAD ===== */}
      <div className="px-6 md:px-16 pt-8 md:pt-14">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between font-serif italic text-[13px] md:text-[14px] tracking-wide">
          <span>Vekto — Studio Notes</span>
          <span className="hidden md:inline opacity-70">Vol. II · 2026 · Sofia</span>
          <span className="opacity-70">Spread 01</span>
        </div>
      </div>

      {/* ===== HERO SPREAD ===== */}
      <section className="px-6 md:px-16 pt-28 md:pt-40 pb-32 md:pb-52">
        <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-x-6 md:gap-x-12">
          {/* Small dateline in left margin */}
          <div className="col-span-12 md:col-span-3 md:pt-6">
            <div className="text-[11px] uppercase tracking-[0.3em] opacity-60 mb-2 font-sans">
              Studio · Est. 2024
            </div>
            <div className="font-serif italic text-[15px] leading-snug opacity-80 max-w-[220px]">
              A small, quiet growth studio in Sofia, working with
              brands in Bulgaria and the United States.
            </div>
          </div>

          {/* Massive display headline */}
          <div className="col-span-12 md:col-span-9 mt-14 md:mt-0">
            <h1
              className="font-serif font-normal leading-[0.98] tracking-[-0.015em]"
              style={{ fontSize: "clamp(48px, 9vw, 156px)" }}
            >
              Растежът се <span className="italic" style={{ color: "#5a3f5c" }}>прави</span>
              <br />
              бавно. И тихо.
              <br />
              И заедно.
            </h1>
            <RulePair className="mt-14 md:mt-20" />
            <p className="text-[15px] md:text-[16px] leading-[1.75] max-w-[540px] mt-10 md:mt-14 opacity-80">
              Работим с петдесет бранда. Приемаме дванадесет нови на година.
              Средно 4.8× възвращаемост от реклами. Един екип, един стандарт,
              един разговор — от стратегия до launch.
            </p>
          </div>
        </div>
      </section>

      {/* ===== NOTES SPREAD ===== */}
      <section className="px-6 md:px-16 py-32 md:py-52">
        <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-x-6 md:gap-x-12 gap-y-12 md:gap-y-24">
          <div className="col-span-12 md:col-span-3">
            <div className="text-[11px] uppercase tracking-[0.3em] opacity-60 mb-3">
              II — Notes
            </div>
            <RulePair />
            <div className="font-serif italic text-[15px] leading-snug opacity-80 mt-6 max-w-[220px]">
              Four notes on how we work. In no particular order of
              importance — each carries the same weight.
            </div>
          </div>

          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14 md:gap-y-20">
              {NOTES.map((n) => (
                <div key={n.label}>
                  <div className="text-[10px] uppercase tracking-[0.35em] opacity-60 mb-3">
                    {n.label}
                  </div>
                  <div className="font-serif text-[20px] md:text-[24px] leading-[1.4] max-w-[400px]">
                    {n.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SPECIMEN INSET (photograph placeholder) ===== */}
      <section className="px-6 md:px-16 py-32 md:py-40">
        <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-x-6 md:gap-x-12">
          <div className="col-span-12 md:col-span-3">
            <div className="text-[11px] uppercase tracking-[0.3em] opacity-60 mb-3">
              Plate 01
            </div>
            <RulePair />
            <div className="font-serif italic text-[15px] leading-snug opacity-80 mt-6 max-w-[220px]">
              A specimen from the archive. Reproduction unavailable in
              this edition.
            </div>
          </div>

          <div className="col-span-12 md:col-span-9 mt-10 md:mt-0">
            {/* Inset "photograph" panel */}
            <div
              className="relative w-full max-w-[720px]"
              style={{ aspectRatio: "4/5" }}
            >
              <div
                className="absolute inset-0 border"
                style={{
                  borderColor: "#2f253026",
                  borderWidth: "0.5px",
                  background:
                    "linear-gradient(135deg, #f2ede0 0%, #ebe4d0 40%, #d9cfb3 100%)",
                }}
              />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between font-serif italic text-[13px] opacity-70">
                <span>Studio, Sofia — 2026</span>
                <span>Fig. 01</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SPECIMEN LIST (roster) ===== */}
      <section className="px-6 md:px-16 py-32 md:py-52">
        <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-x-6 md:gap-x-12">
          <div className="col-span-12 md:col-span-3">
            <div className="text-[11px] uppercase tracking-[0.3em] opacity-60 mb-3">
              III — Selected Brands
            </div>
            <RulePair />
            <div className="font-serif italic text-[15px] leading-snug opacity-80 mt-6 max-w-[220px]">
              A partial list, in the order they joined the studio.
              Twelve of fifty.
            </div>
          </div>

          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 md:gap-y-10">
              {CLIENTS.map((c, i) => (
                <div key={c} className="flex items-baseline gap-3">
                  <span className="text-[11px] font-mono opacity-50 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[16px] tracking-tight font-medium">
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CORRESPONDENCE (Contact) ===== */}
      <section className="px-6 md:px-16 py-32 md:py-52">
        <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-x-6 md:gap-x-12">
          <div className="col-span-12 md:col-span-3">
            <div className="text-[11px] uppercase tracking-[0.3em] opacity-60 mb-3">
              IV — Correspondence
            </div>
            <RulePair />
          </div>

          <div className="col-span-12 md:col-span-9 mt-10 md:mt-0">
            <h2
              className="font-serif font-normal leading-[0.98] tracking-[-0.015em] mb-16"
              style={{ fontSize: "clamp(40px, 6vw, 96px)" }}
            >
              За да отвориш{" "}
              <span className="italic" style={{ color: "#5a3f5c" }}>
                разговор,
              </span>
              <br />
              пиши тук.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-0 max-w-4xl">
              <div>
                <div className="text-[10px] uppercase tracking-[0.35em] opacity-60 mb-2">
                  Bureau
                </div>
                <a
                  href="mailto:vektoagency@gmail.com"
                  className="font-serif text-[18px] md:text-[22px] italic underline decoration-[0.5px] underline-offset-[6px] hover:text-[#5a3f5c] hover:decoration-[#5a3f5c] transition-colors"
                >
                  vektoagency@gmail.com
                </a>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.35em] opacity-60 mb-2">
                  Voice
                </div>
                <a
                  href="tel:+359882251474"
                  className="font-serif text-[18px] md:text-[22px] italic underline decoration-[0.5px] underline-offset-[6px] hover:text-[#5a3f5c] hover:decoration-[#5a3f5c] transition-colors"
                >
                  +359 88 225 1474
                </a>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.35em] opacity-60 mb-2">
                  Response
                </div>
                <div className="font-serif italic text-[18px] md:text-[22px]">
                  Under 24 hours.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COLOPHON ===== */}
      <footer className="px-6 md:px-16 pt-16 pb-14">
        <div className="max-w-[1200px] mx-auto">
          <RulePair />
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 font-serif italic text-[13px] opacity-70">
            <span>© Vekto — Studio, MMXXVI</span>
            <span className="hidden md:inline">Sofia, Bulgaria — Set in EB Garamond &amp; Manrope</span>
            <div className="flex gap-6 not-italic font-sans text-[11px] uppercase tracking-[0.3em]">
              <Link href="/case-studies" className="hover:text-[#5a3f5c]">Work</Link>
              <Link href="/privacy" className="hover:text-[#5a3f5c]">Privacy</Link>
              <Link href="/terms" className="hover:text-[#5a3f5c]">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .font-serif { font-family: var(--font-muji-serif), 'EB Garamond', Georgia, serif; }
        .font-sans  { font-family: var(--font-muji-sans), system-ui, sans-serif; }
      `}</style>
    </div>
  );
}

// Signature two-line horizontal rule — heavy + hairline pair. Replaces
// the standard <hr>. Used as section marker throughout, never for
// decoration inside a section.
function RulePair({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div style={{ height: "1.5px", background: "#2f2530" }} />
      <div style={{ height: "0.5px", background: "#2f2530", marginTop: "5px", opacity: 0.6 }} />
    </div>
  );
}
