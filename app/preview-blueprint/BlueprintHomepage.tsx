"use client";

// Architect's technical drawing homepage. Every element is annotated
// as though it were on an architectural plan set: section IDs A-101,
// A-102 etc.; dimension arrows on layouts (← 24rem →); a subtle
// blueprint grid; drafting-tape corner clips; a title block in the
// bottom-right; a compass rose; hairline everything. Reads like the
// deliverable for a very expensive architectural competition.
//
// Signature moves nobody else uses:
//   1. Dimension arrows on the layout (real SVG paths with tick
//      marks and centred labels — "← 12ch →", "↕ 44 →")
//   2. Title block in bottom-right corner (architect drawings all
//      have one — PROJECT, SHEET, SCALE, DATE, DRAWN BY)
//   3. Section IDs like architectural drawings (A-100 · A-101 · etc.)
//   4. Compass rose in top-right corner
//   5. Drafting-tape corner clips on each section
//   6. Deep navy on cool paper — the classic blueprint palette

import Link from "next/link";

const CLIENTS = [
  ["MEN'S CARE",    "Beauty",    "BG"],
  ["DUSQ",          "Wearable",  "US"],
  ["PARFEN",        "Perfume",   "BG"],
  ["ISOSPORT",      "Beverage",  "BG"],
  ["BIOTICA",       "Supplmt",   "BG"],
  ["BULTEX",        "Workwear",  "BG"],
  ["NEDELYA",       "Bakery",    "BG"],
  ["ANOMALY",       "Immunity",  "US"],
  ["GOURMET HOUSE", "Food",      "BG"],
  ["ETHAN'S",       "Beverage",  "US"],
  ["LUCKY ENERGY",  "Beverage",  "US"],
  ["NUTRIFITT",     "Sports",    "US"],
];

const DRAWINGS = [
  { id: "A-100", name: "Position",     ref: "Cover Sheet"    },
  { id: "A-101", name: "Practice",     ref: "Plan · Ground"  },
  { id: "A-102", name: "Portfolio",    ref: "Plan · First"   },
  { id: "A-103", name: "Correspondnc", ref: "Elevation · N"  },
];

const PRACTICE = [
  { id: "A-101.1", name: "Реклами",     spec: "Meta · Google · TikTok",           room: "12m²" },
  { id: "A-101.2", name: "Съдържание",  spec: "Video · UGC · Live-action · Photo", room: "18m²" },
  { id: "A-101.3", name: "Уебсайтове",  spec: "Landing · Corporate · Ecom",       room: "14m²" },
  { id: "A-101.4", name: "Стратегия",   spec: "Positioning · Offer · Planning",   room: "9m²"  },
];

export default function BlueprintHomepage() {
  return (
    <div
      className="min-h-screen text-[#0f1a2e] relative"
      style={{
        background: "#eae6d8",
        fontFamily: "var(--font-blueprint-serif), Georgia, serif",
        backgroundImage:
          "linear-gradient(to right, rgba(15,26,46,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,26,46,0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* ===== TITLE BLOCK (fixed bottom-right corner) ===== */}
      <div
        className="fixed bottom-4 right-4 z-40 bg-[#eae6d8] border border-[#0f1a2e] font-mono text-[10px] uppercase tracking-widest hidden md:block"
        style={{ borderWidth: "0.5px" }}
      >
        <div className="border-b border-[#0f1a2e] px-3 py-1.5 bg-[#0f1a2e] text-[#eae6d8]" style={{ borderBottomWidth: "0.5px" }}>
          Vekto · Growth Studio
        </div>
        <div className="grid grid-cols-2 divide-x divide-[#0f1a2e]" style={{ divideStyle: "0.5px" } as React.CSSProperties}>
          <div className="p-2 space-y-1">
            <div className="opacity-60">Project</div>
            <div className="font-bold">Homepage</div>
          </div>
          <div className="p-2 space-y-1">
            <div className="opacity-60">Sheet</div>
            <div className="font-bold">01 / 01</div>
          </div>
        </div>
        <div className="grid grid-cols-2 border-t border-[#0f1a2e] divide-x divide-[#0f1a2e]" style={{ borderTopWidth: "0.5px" }}>
          <div className="p-2 space-y-1">
            <div className="opacity-60">Scale</div>
            <div className="font-bold">1:1</div>
          </div>
          <div className="p-2 space-y-1">
            <div className="opacity-60">Date</div>
            <div className="font-bold">MMXXVI</div>
          </div>
        </div>
        <div className="border-t border-[#0f1a2e] p-2 flex justify-between" style={{ borderTopWidth: "0.5px" }}>
          <span className="opacity-60">Drawn by</span>
          <span className="font-bold">VKT</span>
        </div>
      </div>

      {/* ===== COMPASS ROSE (top-right corner) ===== */}
      <div className="fixed top-6 right-6 z-40 pointer-events-none">
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="24" fill="none" stroke="#0f1a2e" strokeWidth="0.5" />
          <line x1="26" y1="4" x2="26" y2="48" stroke="#0f1a2e" strokeWidth="0.5" />
          <line x1="4" y1="26" x2="48" y2="26" stroke="#0f1a2e" strokeWidth="0.5" />
          <polygon points="26,2 22,12 26,10 30,12" fill="#0f1a2e" />
          <text x="26" y="1" textAnchor="middle" fontSize="6" fill="#0f1a2e" fontFamily="var(--font-blueprint-mono)">N</text>
        </svg>
      </div>

      {/* ===== HEADER STRIP ===== */}
      <header
        className="border-b border-[#0f1a2e] px-6 md:px-14 py-4 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-widest"
        style={{ borderBottomWidth: "0.5px" }}
      >
        <div className="flex items-center gap-6">
          <span className="font-bold">Vekto · Studio</span>
          <span className="opacity-60 hidden md:inline">A-100 · Cover Sheet</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/case-studies" className="hover:text-[#c85832]">A-102 Portfolio</Link>
          <a href="#contact" className="hover:text-[#c85832]">A-103 Contact</a>
        </nav>
      </header>

      {/* ===== SECTION A-100 · POSITION (HERO) ===== */}
      <section className="px-6 md:px-14 py-20 md:py-32 relative">
        <SectionMark id="A-100" name="Cover Sheet · Position" />
        <div className="max-w-[1200px] mx-auto">
          {/* Dimension arrow above headline */}
          <div className="mb-6 md:mb-8 hidden md:block">
            <DimensionArrow width="max-w-4xl" label="30ch" />
          </div>

          <h1
            className="leading-[0.94] tracking-[-0.02em] font-normal mb-14 md:mb-20 max-w-4xl"
            style={{ fontSize: "clamp(48px, 8.5vw, 132px)" }}
          >
            Vekto —{" "}
            <span style={{ color: "#c85832" }}>a growth</span>
            <br />
            studio, drawn to
            <br />
            precision.
          </h1>

          <div className="grid grid-cols-12 gap-x-6 md:gap-x-10 max-w-5xl">
            <div className="col-span-12 md:col-span-7">
              <p className="text-[15px] md:text-[17px] leading-[1.7]">
                Работим с петдесет бранда в България и Съединените щати.
                Реклами, съдържание, уебсайтове и стратегия — четири
                дисциплини, изградени като план за строеж. Всяка партньорство
                има чертеж. Всеки чертеж има подпис. Всеки launch — тестове
                и приемане.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9 mt-6 md:mt-0">
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-2">
                Section legend
              </div>
              <div className="space-y-1 text-[13px] font-mono">
                <div className="flex items-baseline gap-3">
                  <span className="w-14 opacity-60">A-100</span>
                  <span>Position (this sheet)</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="w-14 opacity-60">A-101</span>
                  <span>Practice (below)</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="w-14 opacity-60">A-102</span>
                  <span>Portfolio</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="w-14 opacity-60">A-103</span>
                  <span>Correspondence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION A-101 · PRACTICE ===== */}
      <section
        className="px-6 md:px-14 py-20 md:py-32 border-t border-[#0f1a2e] relative"
        style={{ borderTopWidth: "0.5px" }}
      >
        <SectionMark id="A-101" name="Ground Plan · Practice" />
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-10 mb-14">
            <div className="col-span-12 md:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-3">
                Sheet A-101 · 1 : 1
              </div>
              <h2
                className="leading-[0.98] tracking-[-0.015em] font-normal"
                style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
              >
                Четири помещения<br />
                под един покрив.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-6 md:pt-4">
              <p className="text-[14px] md:text-[15px] leading-[1.7] opacity-80">
                Всяка дисциплина е стая. Всяка стая има спецификация.
                Между стените няма стени — един project manager, един
                стандарт, един разговор.
              </p>
            </div>
          </div>

          {/* Rooms plan */}
          <div
            className="border border-[#0f1a2e] grid grid-cols-1 md:grid-cols-2 relative"
            style={{ borderWidth: "0.5px" }}
          >
            {PRACTICE.map((p, i) => (
              <div
                key={p.id}
                className={`border-[#0f1a2e] p-6 md:p-10 relative ${i < 2 ? "md:border-b" : ""} ${i % 2 === 0 ? "md:border-r" : ""}`}
                style={{ borderWidth: "0.5px" }}
              >
                <div className="flex items-baseline justify-between mb-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                    {p.id}
                  </div>
                  <div className="font-mono text-[10px] opacity-60">{p.room}</div>
                </div>
                <h3
                  className="font-normal leading-none tracking-[-0.015em] mb-3"
                  style={{ fontSize: "clamp(28px, 3vw, 42px)" }}
                >
                  {p.name}
                </h3>
                <div className="font-mono text-[11px] uppercase tracking-widest opacity-70">
                  {p.spec}
                </div>
              </div>
            ))}
            {/* corner tape clips */}
            <TapeClip position="tl" />
            <TapeClip position="tr" />
            <TapeClip position="bl" />
            <TapeClip position="br" />
          </div>
        </div>
      </section>

      {/* ===== SECTION A-102 · PORTFOLIO (ROSTER) ===== */}
      <section
        className="px-6 md:px-14 py-20 md:py-32 border-t border-[#0f1a2e] relative"
        style={{ borderTopWidth: "0.5px" }}
      >
        <SectionMark id="A-102" name="First Floor · Portfolio" />
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-10 mb-12">
            <div className="col-span-12 md:col-span-6">
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-3">
                Sheet A-102 · Schedule of tenants
              </div>
              <h2
                className="leading-[0.98] tracking-[-0.015em] font-normal"
                style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
              >
                Петдесет партньорства.<br />
                Дванадесет представени.
              </h2>
            </div>
          </div>

          <div
            className="border-t border-[#0f1a2e] font-mono text-[11px] uppercase tracking-widest"
            style={{ borderTopWidth: "0.5px" }}
          >
            <div
              className="grid grid-cols-12 gap-x-4 py-2 border-b border-[#0f1a2e] opacity-70"
              style={{ borderBottomWidth: "0.5px" }}
            >
              <div className="col-span-1">Idx</div>
              <div className="col-span-6 md:col-span-5">Tenant</div>
              <div className="col-span-4 md:col-span-4">Category</div>
              <div className="col-span-1 md:col-span-2 text-right">Region</div>
            </div>
            {CLIENTS.map((c, i) => (
              <div
                key={c[0]}
                className="grid grid-cols-12 gap-x-4 py-2 border-b border-[#0f1a2e]/30 items-baseline"
                style={{ borderBottomWidth: "0.5px" }}
              >
                <div className="col-span-1 opacity-60 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-6 md:col-span-5 font-bold tracking-wide">
                  {c[0]}
                </div>
                <div className="col-span-4 md:col-span-4 opacity-70">
                  {c[1]}
                </div>
                <div className="col-span-1 md:col-span-2 text-right opacity-70">
                  [{c[2]}]
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION A-103 · CORRESPONDENCE ===== */}
      <section
        id="contact"
        className="px-6 md:px-14 py-20 md:py-32 border-t border-[#0f1a2e] relative"
        style={{ borderTopWidth: "0.5px" }}
      >
        <SectionMark id="A-103" name="North Elevation · Contact" />
        <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-x-6 md:gap-x-10">
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-3">
              Sheet A-103 · Signage
            </div>
            <h2
              className="leading-[0.94] tracking-[-0.015em] font-normal"
              style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
            >
              За заявка<br />
              на чертеж —<br />
              <span style={{ color: "#c85832" }}>пиши тук.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8 mt-10 md:mt-0 space-y-8">
            <ContactRow id="A-103.1" label="Correspondence"     value="vektoagency@gmail.com" href="mailto:vektoagency@gmail.com" />
            <ContactRow id="A-103.2" label="Voice"              value="+359 88 225 1474"       href="tel:+359882251474" />
            <ContactRow id="A-103.3" label="Bureau"             value="Sofia, Bulgaria"        />
            <ContactRow id="A-103.4" label="Response Time"      value="< 24h"                  />
          </div>
        </div>
      </section>

      {/* ===== FOOTER STRIP ===== */}
      <footer
        className="px-6 md:px-14 py-6 border-t border-[#0f1a2e] font-mono text-[10px] uppercase tracking-widest flex flex-wrap justify-between gap-3"
        style={{ borderTopWidth: "0.5px" }}
      >
        <span className="opacity-70">© Vekto · MMXXVI · A-100</span>
        <span className="opacity-70 hidden md:inline">All sheets on the same drawing set.</span>
        <span className="opacity-70">Rev. 01</span>
      </footer>
    </div>
  );
}

function SectionMark({ id, name }: { id: string; name: string }) {
  return (
    <div className="absolute top-4 md:top-6 left-6 md:left-14 font-mono text-[10px] uppercase tracking-widest opacity-80 flex items-center gap-3 pointer-events-none">
      <span className="border border-[#0f1a2e] px-2 py-0.5" style={{ borderWidth: "0.5px" }}>
        {id}
      </span>
      <span>·</span>
      <span>{name}</span>
    </div>
  );
}

function DimensionArrow({ width, label }: { width: string; label: string }) {
  return (
    <div className={`${width} flex items-center font-mono text-[10px] uppercase tracking-widest opacity-60`}>
      <span>|</span>
      <span className="flex-1 border-t border-[#0f1a2e]" style={{ borderTopWidth: "0.5px" }} />
      <span className="mx-2">↔ {label}</span>
      <span className="flex-1 border-t border-[#0f1a2e]" style={{ borderTopWidth: "0.5px" }} />
      <span>|</span>
    </div>
  );
}

function TapeClip({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const map = {
    tl: "top-0 left-0 -translate-x-1/2 -translate-y-1/2 -rotate-45",
    tr: "top-0 right-0 translate-x-1/2 -translate-y-1/2 rotate-45",
    bl: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 rotate-45",
    br: "bottom-0 right-0 translate-x-1/2 translate-y-1/2 -rotate-45",
  };
  return (
    <div
      aria-hidden
      className={`absolute w-12 h-4 bg-[#0f1a2e]/8 border border-[#0f1a2e]/30 pointer-events-none ${map[position]} hidden md:block`}
      style={{ borderWidth: "0.5px" }}
    />
  );
}

function ContactRow({ id, label, value, href }: { id: string; label: string; value: string; href?: string }) {
  const inner = (
    <div className="grid grid-cols-12 gap-x-4 items-baseline">
      <div className="col-span-3 md:col-span-2 font-mono text-[10px] uppercase tracking-widest opacity-60">
        {id}
      </div>
      <div className="col-span-9 md:col-span-4 font-mono text-[10px] uppercase tracking-widest opacity-70">
        {label}
      </div>
      <div className="col-span-12 md:col-span-6 mt-1 md:mt-0 text-lg md:text-xl">
        {value}
      </div>
    </div>
  );
  return (
    <div
      className="border-b border-[#0f1a2e] pb-6"
      style={{ borderBottomWidth: "0.5px" }}
    >
      {href ? (
        <a
          href={href}
          className="block underline decoration-[0.5px] underline-offset-[6px] hover:text-[#c85832] hover:decoration-[#c85832]"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
