"use client";

// Swiss International / Vignelli / Unimark homepage. Hardcore grid
// discipline, museum-catalog numeric IDs, hairline dividers (0.5px
// only), single warm rust accent, no radius anywhere, generous
// left/right margins that never break. Feels like the Bauhaus
// exhibition catalogue or MIT Press dust jacket.
//
// Signature moves nobody else uses:
//   1. Numeric IDs on every element (01 · 02.1 · 03.4.1)
//   2. Hairline discipline — 0.5px only, no thicker rules
//   3. Section labels rendered as (Sub-No / Total-No) fractions
//   4. Deliberate imperfect ligatures — the italic 'ampersand' gets
//      its own oversized moment
//   5. Everything left-aligned — no centering, ever, except numbers
//      in tables which get right-aligned per Swiss tradition.

import Link from "next/link";

const CLIENTS = [
  ["01", "MEN'S CARE",    "Beauty / DTC",       "Sofia",       "2024"],
  ["02", "DUSQ",          "Wearable",           "New York",    "2025"],
  ["03", "PARFEN",        "Perfumery",          "Sofia",       "2024"],
  ["04", "ISOSPORT",      "Beverage",           "Sofia",       "2024"],
  ["05", "BIOTICA",       "Supplements",        "Sofia",       "2024"],
  ["06", "ANOMALY",       "Immunity",           "New York",    "2025"],
  ["07", "ETHAN'S",       "Plant-Based Drinks", "Los Angeles", "2025"],
  ["08", "LUCKY ENERGY",  "Zero-Sugar Drinks",  "New York",    "2025"],
  ["09", "NUTRIFITT",     "Sports Nutrition",   "New York",    "2025"],
  ["10", "BULTEX",        "Workwear",           "Sofia",       "2026"],
  ["11", "NEDELYA",       "Bakery",             "Sofia",       "2026"],
  ["12", "GOURMET HOUSE", "Fine Foods",         "Sofia",       "2026"],
];

const PRACTICE = [
  { id: "01.01", name: "Reklami",     detail: "Meta · Google · TikTok · X",             },
  { id: "01.02", name: "Sadarzhanie", detail: "Video · Live-action · UGC · Photography" },
  { id: "01.03", name: "Uebsayti",    detail: "Landing · Corporate · Ecommerce",        },
  { id: "01.04", name: "Strategiya",  detail: "Positioning · Offer · Planning",         },
];

const NUMBERS = [
  { id: "02.01", value: "50",       unit: "Brands",           note: "In BG + US" },
  { id: "02.02", value: "4.8×",     unit: "Average ROAS",     note: "Ad campaigns" },
  { id: "02.03", value: "12",       unit: "New Partnerships", note: "Per year, capped" },
  { id: "02.04", value: "MMXXIV",   unit: "Founded",          note: "Sofia, BG" },
];

export default function SwissHomepage() {
  return (
    <div
      className="min-h-screen text-[#141312] font-display selection:bg-[#c85832] selection:text-[#f4f1eb]"
      style={{
        background: "#f4f1eb",
        fontFamily: "var(--font-swiss-display), system-ui, sans-serif",
      }}
    >
      {/* ===== MASTHEAD ===== */}
      <header className="border-b border-[#141312]/20" style={{ borderBottomWidth: "0.5px" }}>
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 px-6 md:px-10 py-4 items-baseline">
          <div className="col-span-6 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-70 mb-1">
              §01
            </div>
            <div className="text-xl md:text-2xl font-medium tracking-tight">
              Vekto Growth Studio
            </div>
          </div>
          <div className="col-span-6 md:col-span-3 md:col-start-4 font-mono text-[11px] uppercase tracking-[0.25em] opacity-70">
            <div>Sofia · Bulgaria</div>
            <div>Est. MMXXIV</div>
          </div>
          <nav className="col-span-12 md:col-span-6 mt-3 md:mt-0 md:text-right font-mono text-[11px] uppercase tracking-[0.25em]">
            <Link href="/case-studies" className="mr-6 md:mr-8 hover:text-[#c85832]">Cases</Link>
            <Link href="/portfolio" className="mr-6 md:mr-8 hover:text-[#c85832]">Reel</Link>
            <a href="#contact" className="hover:text-[#c85832]">Contact</a>
          </nav>
        </div>
      </header>

      {/* ===== SECTION 01 · POSITION ===== */}
      <section className="border-b border-[#141312]/20 py-16 md:py-28" style={{ borderBottomWidth: "0.5px" }}>
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 px-6 md:px-10">
          <div className="col-span-12 md:col-span-3 font-mono text-[11px] uppercase tracking-[0.25em] mb-6 md:mb-0">
            <div className="opacity-70">Section 01 / 06</div>
            <div className="mt-1">Position</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            {/* Massive display headline */}
            <h1
              className="leading-[0.94] tracking-[-0.03em] font-light mb-14 md:mb-20"
              style={{ fontSize: "clamp(52px, 9vw, 148px)" }}
            >
              An independent
              <br />
              growth studio,
              <br />
              <span style={{ color: "#c85832" }}>working</span> from Sofia
              <br />
              to New York.
            </h1>

            <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 max-w-4xl">
              <p className="col-span-12 md:col-span-8 text-lg md:text-xl leading-[1.55]">
                Vekto е независимо студио за растеж, което работи с петдесет
                бранда в България и Съединените щати. Работим като разширение
                на екипа на клиента — от стратегия и позициониране до реклами,
                съдържание и уебсайтове. Един стандарт, един project manager,
                един разговор.
              </p>
              <div className="col-span-12 md:col-span-4 mt-8 md:mt-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-70 mb-2">
                  Correspondence
                </div>
                <a
                  href="mailto:vektoagency@gmail.com"
                  className="block text-base md:text-lg underline decoration-[0.5px] underline-offset-[6px] hover:text-[#c85832] hover:decoration-[#c85832]"
                >
                  vektoagency@gmail.com
                </a>
                <a
                  href="tel:+359882251474"
                  className="block text-base md:text-lg mt-1 underline decoration-[0.5px] underline-offset-[6px] hover:text-[#c85832] hover:decoration-[#c85832]"
                >
                  +359 88 225 1474
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 02 · NUMBERS ===== */}
      <section className="border-b border-[#141312]/20 py-16 md:py-28" style={{ borderBottomWidth: "0.5px" }}>
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 px-6 md:px-10">
          <div className="col-span-12 md:col-span-3 font-mono text-[11px] uppercase tracking-[0.25em] mb-8 md:mb-0">
            <div className="opacity-70">Section 02 / 06</div>
            <div className="mt-1">Numbers</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {NUMBERS.map((n) => (
                <div key={n.id} className="border-t border-[#141312]/40 pt-3" style={{ borderTopWidth: "0.5px" }}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-70 mb-3">
                    {n.id}
                  </div>
                  <div
                    className="font-light tracking-[-0.03em] leading-none mb-2"
                    style={{ fontSize: "clamp(44px, 5vw, 76px)" }}
                  >
                    {n.value}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em]">
                    {n.unit}
                  </div>
                  <div className="text-[13px] opacity-60 mt-1">{n.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 03 · PRACTICE ===== */}
      <section className="border-b border-[#141312]/20 py-16 md:py-28" style={{ borderBottomWidth: "0.5px" }}>
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 px-6 md:px-10">
          <div className="col-span-12 md:col-span-3 font-mono text-[11px] uppercase tracking-[0.25em] mb-8 md:mb-0">
            <div className="opacity-70">Section 03 / 06</div>
            <div className="mt-1">Practice</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-1 gap-y-8 md:gap-y-10 max-w-4xl">
              {PRACTICE.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-12 gap-x-4 md:gap-x-6 border-t border-[#141312]/40 pt-5"
                  style={{ borderTopWidth: "0.5px" }}
                >
                  <div className="col-span-2 font-mono text-[11px] uppercase tracking-[0.25em] opacity-70">
                    {p.id}
                  </div>
                  <div className="col-span-10 md:col-span-6">
                    <div
                      className="font-light tracking-[-0.02em] leading-none"
                      style={{ fontSize: "clamp(28px, 3.4vw, 44px)" }}
                    >
                      {p.name}
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-4 mt-2 md:mt-0 font-mono text-[11px] uppercase tracking-[0.25em] md:text-right opacity-80 self-end">
                    {p.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 04 · SPECIMEN LIST (ROSTER) ===== */}
      <section className="border-b border-[#141312]/20 py-16 md:py-28" style={{ borderBottomWidth: "0.5px" }}>
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 px-6 md:px-10">
          <div className="col-span-12 md:col-span-3 font-mono text-[11px] uppercase tracking-[0.25em] mb-8 md:mb-0">
            <div className="opacity-70">Section 04 / 06</div>
            <div className="mt-1">Specimens</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            {/* Header row */}
            <div
              className="grid grid-cols-12 gap-x-4 md:gap-x-6 border-t border-[#141312]/60 border-b pb-2 pt-2 font-mono text-[10px] uppercase tracking-[0.28em] opacity-70"
              style={{ borderTopWidth: "0.5px", borderBottomWidth: "0.5px" }}
            >
              <div className="col-span-1">N°</div>
              <div className="col-span-5 md:col-span-4">Specimen</div>
              <div className="col-span-6 md:col-span-4">Category</div>
              <div className="hidden md:block md:col-span-2">Origin</div>
              <div className="hidden md:block md:col-span-1 text-right">Year</div>
            </div>
            {CLIENTS.map((c) => (
              <div
                key={c[0]}
                className="grid grid-cols-12 gap-x-4 md:gap-x-6 border-b border-[#141312]/15 py-3 text-[15px]"
                style={{ borderBottomWidth: "0.5px" }}
              >
                <div className="col-span-1 font-mono text-[11px] tracking-[0.15em] opacity-70 self-center">
                  {c[0]}
                </div>
                <div className="col-span-5 md:col-span-4 tracking-tight font-medium self-center">
                  {c[1]}
                </div>
                <div className="col-span-6 md:col-span-4 opacity-70 self-center">
                  {c[2]}
                </div>
                <div className="hidden md:block md:col-span-2 opacity-70 self-center">
                  {c[3]}
                </div>
                <div className="hidden md:block md:col-span-1 text-right font-mono text-[11px] opacity-70 self-center">
                  {c[4]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 05 · IMPRINT (Contact) ===== */}
      <section id="contact" className="border-b border-[#141312]/20 py-16 md:py-28" style={{ borderBottomWidth: "0.5px" }}>
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 px-6 md:px-10">
          <div className="col-span-12 md:col-span-3 font-mono text-[11px] uppercase tracking-[0.25em] mb-8 md:mb-0">
            <div className="opacity-70">Section 05 / 06</div>
            <div className="mt-1">Imprint</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2
              className="leading-[0.92] tracking-[-0.03em] font-light mb-12"
              style={{ fontSize: "clamp(40px, 6vw, 96px)" }}
            >
              To open{" "}
              <span
                className="italic"
                style={{
                  color: "#c85832",
                  fontFamily: "Georgia, serif",
                }}
              >
                &
              </span>
              {" "}account,
              <br />
              write to us.
            </h2>
            <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 max-w-4xl">
              <div className="col-span-12 md:col-span-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-70 mb-2">
                  05.01 · Correspondence
                </div>
                <a
                  href="mailto:vektoagency@gmail.com"
                  className="text-lg md:text-xl underline decoration-[0.5px] underline-offset-[6px] hover:text-[#c85832] hover:decoration-[#c85832]"
                >
                  vektoagency@gmail.com
                </a>
              </div>
              <div className="col-span-12 md:col-span-4 mt-8 md:mt-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-70 mb-2">
                  05.02 · Voice
                </div>
                <a
                  href="tel:+359882251474"
                  className="text-lg md:text-xl underline decoration-[0.5px] underline-offset-[6px] hover:text-[#c85832] hover:decoration-[#c85832]"
                >
                  +359 88 225 1474
                </a>
              </div>
              <div className="col-span-12 md:col-span-4 mt-8 md:mt-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-70 mb-2">
                  05.03 · Response
                </div>
                <div className="text-lg md:text-xl">Under 24 hours.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 06 · COLOPHON ===== */}
      <footer className="py-8">
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 px-6 md:px-10 font-mono text-[10px] uppercase tracking-[0.28em]">
          <div className="col-span-12 md:col-span-3 opacity-70">
            Section 06 / 06 · Colophon
          </div>
          <div className="col-span-12 md:col-span-6 mt-2 md:mt-0 opacity-70">
            Set in Space Grotesk. Printed digitally. Sofia · Bulgaria · MMXXVI.
          </div>
          <div className="col-span-12 md:col-span-3 mt-2 md:mt-0 md:text-right opacity-70">
            © Vekto — All positions reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
