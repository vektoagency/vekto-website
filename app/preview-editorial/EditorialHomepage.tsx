"use client";

// Editorial preview homepage — full inversion of the current site
// aesthetic. Cream paper background, serif display type, generous
// margins, magazine-style section headers, restraint on colour.
// Reads like a broadsheet or gallery site rather than a SaaS
// dashboard — which is the whole point: no Claude-built site
// reaches for this look by default.
//
// Type system:
//   Display  → Instrument Serif (variable, italic ready)
//   Body     → Instrument Sans (400/500/600)
//   Micro    → same sans, uppercase tracked as 'dateline'
//
// Colour:
//   Paper    #f5f1e8 (warm cream)
//   Ink      #1a1a17 (near-black, warm)
//   Rule     #d8d2c2 (paper-tone divider)
//   Accent   #c8ff00 (existing brand lime — used ONCE per view)

import Link from "next/link";

const CLIENTS = [
  "MEN'S CARE",
  "DUSQ",
  "PARFEN",
  "ISOSPORT",
  "BIOTICA",
  "BULTEX",
  "NEDELYA",
  "ANOMALY",
  "GOURMET HOUSE",
  "ETHAN'S",
  "LUCKY ENERGY",
  "NUTRIFITT",
];

const FEATURED_WORK = [
  {
    number: "N° 01",
    brand: "MEN'S CARE",
    kicker: "Beauty · DTC",
    headline: "Ръст на месечния оборот 5.2× чрез AI видео + performance",
    metric: "5.2×",
    metricLabel: "revenue lift",
    year: "MMXXVI",
  },
  {
    number: "N° 02",
    brand: "ISOSPORT",
    kicker: "Beverage · Brand",
    headline: "Кинематографична бранд идентичност + мащабируема кампания",
    metric: "3.8×",
    metricLabel: "campaign ROAS",
    year: "MMXXV",
  },
  {
    number: "N° 03",
    brand: "PARFEN",
    kicker: "Perfumes · Ecom",
    headline: "AI UGC система за постоянен поток от нови creatives",
    metric: "40+",
    metricLabel: "видеа месечно",
    year: "MMXXV",
  },
];

const CAPABILITIES = [
  { name: "Реклами", detail: "Meta · Google · TikTok" },
  { name: "Съдържание", detail: "Живи снимки · AI · UGC" },
  { name: "Уебсайтове", detail: "Ecom · Landing · Portali" },
  { name: "Стратегия", detail: "Позициониране · Растеж" },
];

export default function EditorialHomepage() {
  return (
    <div
      className="min-h-screen font-body"
      style={{
        background: "#f5f1e8",
        color: "#1a1a17",
      }}
    >
      {/* ================= MASTHEAD ================= */}
      <header
        className="border-b"
        style={{ borderColor: "#d8d2c2" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          {/* Wordmark — display serif with italic 'agency' */}
          <Link href="/" className="flex items-baseline gap-3">
            <span
              className="font-display text-3xl md:text-4xl leading-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              VEKTO
            </span>
            <span className="font-display italic text-lg text-neutral-500 hidden sm:inline">
              — growth studio
            </span>
          </Link>

          <nav className="flex items-center gap-6 md:gap-10 text-[13px] md:text-sm">
            <Link href="/case-studies" className="hover:opacity-60 transition-opacity">
              Work
            </Link>
            <Link href="/ai-creative" className="hover:opacity-60 transition-opacity hidden md:inline">
              AI Creative
            </Link>
            <Link href="/websites" className="hover:opacity-60 transition-opacity hidden md:inline">
              Websites
            </Link>
            <a
              href="#contact"
              className="font-semibold underline decoration-1 underline-offset-4 hover:no-underline"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* ================= DATELINE STRIP ================= */}
      <div
        className="border-b py-2.5"
        style={{ borderColor: "#d8d2c2" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-neutral-600 font-mono">
          <span>Sofia · Bulgaria</span>
          <span className="hidden md:inline">Vol. II — Est. 2024</span>
          <span>50 брандa · 4.8× ROAS</span>
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16 md:pt-28 pb-16 md:pb-24">
        {/* Section label — magazine style */}
        <div className="mb-10 md:mb-16">
          <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-neutral-600 font-mono">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "#c8ff00" }}
            />
            Now accepting 12 new partnerships · 2026
          </span>
        </div>

        {/* Massive editorial headline */}
        <h1
          className="font-display leading-[0.96] tracking-[-0.025em] mb-10 md:mb-14 text-balance"
          style={{
            fontSize: "clamp(52px, 10vw, 168px)",
          }}
        >
          Правим брандове,
          <br />
          <em
            className="italic"
            style={{ color: "#5a5a55" }}
          >
            които останалите
          </em>
          <br />
          цитират.
        </h1>

        {/* Dek — the standfirst */}
        <div className="max-w-2xl">
          <p
            className="font-display text-xl md:text-2xl lg:text-[26px] leading-[1.35] mb-8 md:mb-10"
            style={{ letterSpacing: "-0.01em" }}
          >
            Независимо студио за растеж в София, което работи с брандове в
            България и САЩ.
            <em className="italic"> Реклами, съдържание, уебсайтове, стратегия</em> —
            под един покрив, един стандарт.
          </p>

          <div className="flex flex-wrap items-center gap-6 md:gap-8 text-sm md:text-base">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 font-semibold border-b-2 pb-1 transition-all hover:gap-3"
              style={{ borderColor: "#1a1a17" }}
            >
              <span>Разговор</span>
              <span>→</span>
            </a>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <span>Case studies</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CLIENT ROSTER (Section Rule) ================= */}
      <section
        className="border-t border-b py-8 md:py-10"
        style={{ borderColor: "#d8d2c2" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-neutral-500 font-mono whitespace-nowrap">
              — Selected partnerships
            </span>
            <span className="flex-1 h-px bg-neutral-300" />
          </div>
          <div className="flex flex-wrap gap-x-8 md:gap-x-12 gap-y-3 text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-neutral-700">
            {CLIENTS.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED WORK ================= */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 pt-20 md:pt-32 pb-16">
        <div className="mb-12 md:mb-20">
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-neutral-600 font-mono">
            — Features
          </span>
          <h2
            className="font-display leading-[1.02] tracking-[-0.02em] mt-4 max-w-4xl"
            style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}
          >
            Работа, за която говорим{" "}
            <em className="italic" style={{ color: "#5a5a55" }}>
              по цифри.
            </em>
          </h2>
        </div>

        {/* Three-column magazine grid of featured stories */}
        <div className="grid md:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-14 md:gap-y-16">
          {FEATURED_WORK.map((w) => (
            <article key={w.number} className="group">
              {/* Hero image placeholder — real case pages replace this */}
              <div
                className="aspect-[4/5] mb-6 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #e8e1cf 0%, #d8d2c2 100%)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                    {w.brand}
                  </span>
                </div>
                <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600">
                  {w.number}
                </div>
                <div className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500">
                  {w.year}
                </div>
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-600">
                  {w.kicker}
                </span>
              </div>
              <h3
                className="font-display leading-[1.15] tracking-[-0.01em] mb-4"
                style={{ fontSize: "clamp(22px, 2vw, 26px)" }}
              >
                {w.headline}
              </h3>
              <div
                className="flex items-baseline gap-2 pt-3 border-t"
                style={{ borderColor: "#d8d2c2" }}
              >
                <span
                  className="font-display text-3xl md:text-4xl leading-none"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {w.metric}
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-600">
                  {w.metricLabel}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 md:mt-20 flex justify-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 font-semibold border-b-2 pb-1 transition-all hover:gap-3"
            style={{ borderColor: "#1a1a17" }}
          >
            <span>All case studies</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* ================= CAPABILITIES ================= */}
      <section
        className="border-t py-20 md:py-32"
        style={{ borderColor: "#d8d2c2" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4">
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-neutral-600 font-mono">
                — Practice
              </span>
              <h2
                className="font-display leading-[1.02] tracking-[-0.02em] mt-4"
                style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
              >
                Четири дисциплини,
                <br />
                <em className="italic" style={{ color: "#5a5a55" }}>
                  един разговор.
                </em>
              </h2>
            </div>
            <div className="md:col-span-8 md:pt-4">
              <p
                className="font-display text-lg md:text-xl leading-[1.5] mb-12 max-w-2xl"
                style={{ letterSpacing: "-0.005em" }}
              >
                Не мениджираме vendor-и вместо теб. Всичко под един покрив,
                един proj manager, един стандарт — от <em className="italic">
                стратегия</em> до <em className="italic">launch</em>.
              </p>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
                {CAPABILITIES.map((c, i) => (
                  <div
                    key={c.name}
                    className="pb-6 border-b"
                    style={{ borderColor: "#d8d2c2" }}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-3">
                      N° {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3
                      className="font-display text-3xl md:text-4xl leading-none mb-2"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {c.name}
                    </h3>
                    <div className="text-sm text-neutral-600 font-mono uppercase tracking-[0.15em]">
                      {c.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLOSING SPREAD ================= */}
      <section
        id="contact"
        className="border-t py-24 md:py-40 relative overflow-hidden"
        style={{ borderColor: "#d8d2c2" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-neutral-600 font-mono block mb-8">
              — Correspondence
            </span>
            <h2
              className="font-display leading-[0.98] tracking-[-0.025em] mb-10 md:mb-14 text-balance"
              style={{ fontSize: "clamp(44px, 8vw, 128px)" }}
            >
              Приемаме
              <br />
              <em className="italic" style={{ color: "#5a5a55" }}>
                нови партньорства
              </em>
              <br />
              за 2026.
            </h2>

            <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-16 max-w-3xl">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-3">
                  Email
                </div>
                <a
                  href="mailto:vektoagency@gmail.com"
                  className="font-display text-xl md:text-2xl underline decoration-1 underline-offset-4 hover:no-underline"
                >
                  vektoagency@gmail.com
                </a>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-3">
                  Phone
                </div>
                <a
                  href="tel:+359882251474"
                  className="font-display text-xl md:text-2xl underline decoration-1 underline-offset-4 hover:no-underline"
                >
                  +359 88 225 1474
                </a>
              </div>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 font-semibold text-base transition-all hover:gap-4"
              style={{
                background: "#1a1a17",
                color: "#f5f1e8",
              }}
            >
              <span>Резервирай разговор</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= COLOPHON FOOTER ================= */}
      <footer
        className="border-t py-8"
        style={{ borderColor: "#d8d2c2" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-4 text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-mono">
          <span>© VEKTO Agency 2026</span>
          <span className="hidden md:inline">Sofia · Bulgaria — Working with brands in BG + US</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-neutral-800 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-800 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .font-display {
          font-family: var(--font-editorial-serif), Georgia, serif;
          font-feature-settings: "kern" 1, "liga" 1, "onum" 1;
        }
        .font-body {
          font-family: var(--font-editorial-sans), -apple-system, sans-serif;
        }
        .font-mono {
          font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace;
        }
      `}</style>
    </div>
  );
}
