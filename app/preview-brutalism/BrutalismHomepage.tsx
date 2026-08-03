"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Neutral-brutalism / restrained 90s revival. Every brutalism DNA move —
// table layout, hard borders, offset shadows, marquee, pixel captions,
// hard-edged services grid — kept intact. Palette stripped down to bone
// paper + jet black + a single brushed-silver accent. Feels expensive
// rather than carnival.
//
// Readability rule: silver is used ONLY as a text-fill on dark grounds
// (wordmark, hero highlight, service icons, big numbers), or as a
// thin bezel/border. Plates and buttons that carry small text sit on
// jet-black or bone-white — never on shiny silver, which washes labels.
//
// Palette:
//   #ebe8e0  bone paper background
//   #0d0d0d  jet black ink and borders
//   #8a8a8a → #eaeaea → #6d6d6d  brushed-silver gradient (accent)
//   #d6d3ca  muted concrete tint (secondary panels)
//
// Language rule: entire preview is Bulgarian. Brand names (VEKTO, DUSQ,
// ISOSPORT, Meta, TikTok, etc.) stay Latin because that's how they're
// registered. No mixed marketing copy.

const CLIENTS = [
  "MEN'S CARE", "DUSQ", "PARFEN", "ISOSPORT", "BIOTICA",
  "BULTEX", "НЕДЕЛЯ", "ANOMALY", "GOURMET HOUSE",
  "ETHAN'S", "LUCKY ENERGY", "NUTRIFITT",
];

const SERVICES = [
  { icon: "★", name: "РЕКЛАМИ",    detail: "Meta · Google · TikTok"      },
  { icon: "◉", name: "СЪДЪРЖАНИЕ", detail: "Видео · UGC · AI"            },
  { icon: "▲", name: "САЙТОВЕ",    detail: "Е-ком · Landing · Портали"   },
  { icon: "◆", name: "СТРАТЕГИЯ",  detail: "Растеж · Оферта · Бранд"     },
];

const NEWS = [
  { d: "04.08.26", n: "★ ПРИЕМАМЕ 12 НОВИ БРАНДА ЗА 2026" },
  { d: "01.08.26", n: "★ НОВ КЕЙС: MEN'S CARE — 5.2× ПРИХОД" },
  { d: "24.07.26", n: "★ VEKTO x DUSQ — САЩ КАМПАНИЯ АКТИВНА" },
  { d: "10.07.26", n: "★ BULTEX + НЕДЕЛЯ СЕ ВЛИВАТ" },
];

const SILVER_GRADIENT =
  "linear-gradient(180deg, #c4c4c4 0%, #f4f4f4 22%, #8a8a8a 48%, #eaeaea 52%, #6d6d6d 82%, #b0b0b0 100%)";
const SILVER_GRADIENT_H =
  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 20%, #8a8a8a 45%, #eaeaea 55%, #6d6d6d 80%, #b0b0b0 100%)";

export default function BrutalismHomepage() {
  // Live Sofia studio clock — replaces the old visitor counter.
  // Reads as "СТУДИО · 15:42:03", ticks every second. Feels alive
  // like a broadcast slate, without the goofy visitor-counter energy.
  const [clock, setClock] = useState<string>("--:--:--");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const t = setInterval(tick, 1000);
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
      {/* ===== TOP MARQUEE — silver text on black ===== */}
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
              ✦ VEKTO GROWTH STUDIO ✦ EST. MMXXIV ✦ СОФИЯ · БГ ✦ 50+ БРАНДА ✦ 4.8× ROAS ✦ 3/12 СВОБОДНИ МЕСТА ✦ AI · СЪДЪРЖАНИЕ · РАСТЕЖ ✦
            </span>
          ))}
        </div>
      </div>

      {/* ===== TABLE LAYOUT (deliberately deprecated) ===== */}
      <table className="w-full border-separate border-spacing-0" cellPadding={0} cellSpacing={0}>
        <tbody>
          {/* ROW 1 — MASTHEAD ===================================================== */}
          <tr>
            <td colSpan={3} className="border-b-4 border-black">
              <div
                className="p-4 md:p-6 flex items-center justify-between gap-3"
                style={{ background: "#0d0d0d" }}
              >
                {/* Real VEKTO wordmark, chrome-filled via CSS mask */}
                <div
                  aria-label="VEKTO"
                  className="h-9 md:h-14 w-[150px] md:w-[230px]"
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

                {/* CTA — dark plate, silver rim, silver text (readable) */}
                <a
                  href="mailto:vektoagency@gmail.com"
                  className="hidden md:inline-block px-5 py-2 font-bold uppercase text-sm tracking-[0.2em] transition-colors hover:bg-white hover:text-black"
                  style={{
                    background: "#0d0d0d",
                    color: "#f4f4f4",
                    border: "1.5px solid",
                    borderImage: `${SILVER_GRADIENT_H} 1`,
                  }}
                >
                  ✉ ПИШИ НИ
                </a>
              </div>
            </td>
          </tr>

          {/* ROW 2 — NAV ========================================================== */}
          <tr>
            <td colSpan={3} className="border-b-2 border-black" style={{ background: "#ffffff" }}>
              <div className="flex flex-wrap items-center justify-between px-4 py-2 gap-2 text-[13px] md:text-sm font-bold uppercase tracking-[0.15em]">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <a href="#services" className="hover:underline decoration-2 underline-offset-4">★ Услуги</a>
                  <Link href="/case-studies" className="hover:underline decoration-2 underline-offset-4">★ Работа</Link>
                  <Link href="/portfolio" className="hover:underline decoration-2 underline-offset-4">★ Портфолио</Link>
                  <a href="#contact" className="hover:underline decoration-2 underline-offset-4">★ Контакт</a>
                </div>
                {/* Live studio clock */}
                <div
                  className="text-[11px] flex items-center gap-2"
                  style={{ fontFamily: "var(--font-brutal-pixel)" }}
                >
                  <span
                    aria-hidden
                    className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"
                  />
                  СТУДИО ·
                  <span className="bg-black px-2 py-0.5 text-white tabular-nums">
                    {clock}
                  </span>
                </div>
              </div>
            </td>
          </tr>

          {/* ROW 3 — HERO ROW (main + sidebar) ==================================== */}
          <tr>
            <td colSpan={2} className="border-r-2 border-black border-b-2 align-top">
              <div className="p-6 md:p-12 relative overflow-hidden" style={{ background: "#ebe8e0" }}>
                {/* Subtle silver halo */}
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
                  {/* Availability pill — dark plate + silver rim (readable) */}
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-6"
                    style={{
                      background: "#0d0d0d",
                      color: "#f4f4f4",
                      border: "1.5px solid",
                      borderImage: `${SILVER_GRADIENT_H} 1`,
                      boxShadow: "4px 4px 0 0 #0d0d0d",
                    }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
                      aria-hidden
                    />
                    ПРИЕМАМЕ БРАНДОВЕ · 3/12 СВОБОДНИ
                  </div>

                  <h1
                    className="text-[52px] md:text-[104px] lg:text-[128px] font-black leading-[0.88] tracking-[-0.04em] mb-8"
                    style={{ WebkitTextStroke: "1px black" }}
                  >
                    СТРОИМ{" "}
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
                      РАСТЕЖ.
                    </span>
                    <br />
                    НЕ ПРОЕКТИ.
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
                      → ЗАПАЗИ РАЗГОВОР
                    </a>
                    <Link
                      href="/case-studies"
                      className="px-6 py-3 border-2 border-black font-bold uppercase tracking-wide hover:translate-x-1 hover:translate-y-1 transition-transform text-white"
                      style={{
                        background: "#0d0d0d",
                        boxShadow: "6px 6px 0 0 #8a8a8a",
                      }}
                    >
                      ▶ ВИЖ РАБОТА
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
                  ✦ НОВИНИ ✦
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

              {/* Newsletter card */}
              <div className="p-4 border-b-2 border-black" style={{ background: "#ebe8e0" }}>
                <div className="text-xs font-black uppercase tracking-[0.2em] mb-2">
                  ✉ БЮЛЕТИН
                </div>
                <div
                  className="text-[13px] mb-3"
                  style={{ fontFamily: "var(--font-brutal-comic)" }}
                >
                  Growth случаи всеки петък. Без спам от 2024.
                </div>
                <div
                  className="border-2 border-black bg-white px-2 py-1.5 text-sm"
                  style={{ fontFamily: "var(--font-brutal-pixel)" }}
                >
                  ТВОЯТ@ИМЕЙЛ.БГ
                </div>
                <button
                  className="mt-2 w-full bg-black text-white font-bold uppercase text-xs py-2 hover:bg-white hover:text-black border-2 border-black transition-colors"
                >
                  ▶ АБОНИРАЙ СЕ
                </button>
              </div>

              {/* STATS — dark plates with silver-gradient numbers (readable) */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 text-center">
                  {[
                    ["50+", "БРАНДА"],
                    ["4.8×", "ROAS"],
                    ["12", "МЕСТА"],
                    ["100%", "ВЪТРЕ"],
                  ].map(([v, l]) => (
                    <div
                      key={l}
                      className="border-2 border-black p-3 relative"
                      style={{
                        background: "#0d0d0d",
                        boxShadow: "inset 0 0 0 1px rgba(180,180,180,0.35)",
                      }}
                    >
                      <div
                        className="text-2xl font-black leading-none"
                        style={{
                          background: SILVER_GRADIENT_H,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {v}
                      </div>
                      <div
                        className="text-[9px] font-bold tracking-[0.2em] mt-1.5 text-white/80"
                      >
                        {l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </td>
          </tr>

          {/* ROW 4 — SERVICES GRID ================================================ */}
          <tr>
            <td colSpan={2} className="border-b-2 border-black" id="services">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t-0">
                {SERVICES.map((s, i) => {
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

          {/* ROW 5 — ROSTER ======================================================= */}
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
                    СЪСТАВЪТ
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

          {/* ROW 6 — CONTACT + FOOTER ============================================= */}
          <tr>
            <td colSpan={3} id="contact">
              <div className="p-6 md:p-14 relative overflow-hidden" style={{ background: "#ebe8e0" }}>
                <div className="max-w-4xl">
                  <div className="text-xs font-bold uppercase tracking-[0.25em] mb-4">
                    // КОНТАКТ
                  </div>
                  <h2 className="text-[44px] md:text-[88px] lg:text-[112px] font-black leading-[0.9] tracking-[-0.04em] mb-10">
                    ТВОЯТ БРАНД{" "}
                    <span
                      className="italic"
                      style={{
                        background: SILVER_GRADIENT_H,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      ЗАСЛУЖАВА
                    </span>
                    <br />
                    СИСТЕМА ЗА РАСТЕЖ.
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 max-w-2xl mb-8">
                    <a
                      href="mailto:vektoagency@gmail.com"
                      className="border-4 border-black bg-white p-5 hover:bg-black hover:text-white transition-colors"
                      style={{ boxShadow: "8px 8px 0 0 #8a8a8a" }}
                    >
                      <div className="text-xs font-bold uppercase tracking-[0.2em] mb-1 opacity-60">
                        ✉ Имейл
                      </div>
                      <div className="text-lg md:text-xl font-black break-all">
                        vektoagency@gmail.com
                      </div>
                    </a>
                    <a
                      href="tel:+359882251474"
                      className="border-4 border-black p-5 text-white hover:bg-white hover:text-black transition-colors"
                      style={{
                        background: "#0d0d0d",
                        boxShadow: "8px 8px 0 0 #8a8a8a",
                      }}
                    >
                      <div
                        className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
                        style={{
                          background: SILVER_GRADIENT_H,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        ☎ Телефон
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
                    // ГОСТ-КНИГА · ПОСЛЕДНО ОБНОВЕНО 04.08.2026 · ПРАВЕН СЪС ♥ В СОФИЯ
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
