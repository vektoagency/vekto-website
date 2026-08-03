"use client";

// BRUTALISM-STYLED SCROLL-DRIVEN FUNNEL
//
// Aesthetic stays exactly as before — chrome-silver on jet black +
// bone paper ground, hard 2px borders, hard-offset shadows, marquee
// at the top, live studio clock, pixel-mono captions. What changes:
// the content is now organised as a 7-stage sales funnel. Each stage
// is at least one viewport tall; two of them (the four rooms and the
// slot fill) use sticky-scroll interactions. Everything else animates
// on IntersectionObserver enter.
//
// Bugs fixed from the earlier /preview-funnel attempt:
//   1. NO overflow-x on any ancestor of a sticky section — that was
//      the root cause of janky sticky behaviour last time. Instead,
//      any panel that must clip horizontally does so on itself with
//      overflow-x: clip (safer than hidden).
//   2. No custom cursor (was causing mobile weirdness).
//   3. Cyrillic-safe string slicing for the typewriter.
//
// Palette:
//   #ebe8e0  bone paper (ground)
//   #0d0d0d  jet black ink / plates
//   silver gradient (accent, text-fills and rims only)
//   #d6d3ca  muted concrete tint (secondary panels)

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SILVER =
  "linear-gradient(180deg, #c4c4c4 0%, #f4f4f4 22%, #8a8a8a 48%, #eaeaea 52%, #6d6d6d 82%, #b0b0b0 100%)";
const SILVER_H =
  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 20%, #8a8a8a 45%, #eaeaea 55%, #6d6d6d 80%, #b0b0b0 100%)";

const CLIENTS = [
  { name: "MEN'S CARE",   lift: "+5.2×" },
  { name: "DUSQ",         lift: "+3.8×" },
  { name: "PARFEN",       lift: "+7.7×" },
  { name: "ISOSPORT",     lift: "+4.4×" },
  { name: "BIOTICA",      lift: "+2.9×" },
  { name: "BULTEX",       lift: "+4.1×" },
  { name: "НЕДЕЛЯ",       lift: "+3.5×" },
  { name: "ANOMALY",      lift: "+6.2×" },
  { name: "GOURMET HOUSE",lift: "+5.0×" },
  { name: "ETHAN'S",      lift: "+4.7×" },
  { name: "LUCKY ENERGY", lift: "+3.3×" },
  { name: "NUTRIFITT",    lift: "+8.1×" },
];

const ROOMS = [
  { id: "01", title: "РЕКЛАМИ",    detail: "Meta · Google · TikTok",     num: "4.8×", label: "СРЕДЕН ROAS" },
  { id: "02", title: "СЪДЪРЖАНИЕ", detail: "Видео · UGC · Live-action",  num: "200+", label: "АСЕТА / МЕСЕЦ" },
  { id: "03", title: "САЙТОВЕ",    detail: "Landing · Е-ком · Портали",  num: "12",   label: "LAUNCH / ГОДИНА" },
  { id: "04", title: "СТРАТЕГИЯ",  detail: "Позициониране · Оферта",     num: "50",   label: "БРАНДА В ПОРТФЕЙЛА" },
];

const QUALIFY = [
  "Правиш €100k+ годишен приход",
  "Готов си да инвестираш в система, не в единични асета",
  "Искаш партньор, не изпълнител",
  "Цениш занаята повече от gimmicks",
];

const STAGES = [
  { id: "01", label: "HOOK" },
  { id: "02", label: "ИСТИНА" },
  { id: "03", label: "СТАИ" },
  { id: "04", label: "СЪСТАВ" },
  { id: "05", label: "ОФЕРТА" },
  { id: "06", label: "QUALIFY" },
  { id: "07", label: "ASK" },
];

// ============================================================================
// HOOKS
// ============================================================================
function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      setP(Math.max(0, Math.min(1, scrolled / total)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
}

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.35) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || v) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true); },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, v]);
  return v;
}

function useCounter(trigger: boolean, to: number, ms = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, to, ms]);
  return n;
}

function useCurrentStage(refs: React.RefObject<HTMLElement | null>[]) {
  const [i, setI] = useState(0);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const mid = window.innerHeight * 0.4;
      let best = 0;
      let bestDist = Infinity;
      refs.forEach((r, idx) => {
        const el = r.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const d = Math.abs(center - mid);
        if (d < bestDist) { bestDist = d; best = idx; }
      });
      setI(best);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [refs]);
  return i;
}

// ============================================================================
// COMPONENT
// ============================================================================
export default function BrutalismHomepage() {
  const [clock, setClock] = useState("--:--:--");
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

  const s1 = useRef<HTMLElement>(null);
  const s2 = useRef<HTMLElement>(null);
  const s3 = useRef<HTMLElement>(null);
  const s4 = useRef<HTMLElement>(null);
  const s5 = useRef<HTMLElement>(null);
  const s6 = useRef<HTMLElement>(null);
  const s7 = useRef<HTMLElement>(null);
  const stage = useCurrentStage([s1, s2, s3, s4, s5, s6, s7]);

  return (
    // NB: NO overflow hidden on this wrapper — that breaks sticky in
    // stages 3 & 5. Any horizontal clipping must happen inside the
    // stage that needs it, using overflow-x: clip.
    <div
      className="relative"
      style={{
        background: "#ebe8e0",
        fontFamily: "var(--font-brutal-grotesk), system-ui, sans-serif",
        color: "#0d0d0d",
      }}
    >
      {/* ============= TOP MARQUEE — silver text on black ============= */}
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
                background: SILVER_H,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ✦ VEKTO GROWTH STUDIO ✦ EST. MMXXIV ✦ СОФИЯ · БГ ✦ 50+ БРАНДА ✦ 4.8× ROAS ✦ 3/12 СВОБОДНИ МЕСТА ✦
            </span>
          ))}
        </div>
      </div>

      {/* ============= MASTHEAD (fixed on top) ============= */}
      <div className="border-b-4 border-black" style={{ background: "#0d0d0d" }}>
        <div className="p-4 md:p-5 flex items-center justify-between gap-3">
          <div
            aria-label="VEKTO"
            className="h-9 md:h-12 w-[150px] md:w-[200px]"
            style={{
              background: SILVER,
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
          <a
            href="mailto:vektoagency@gmail.com"
            className="hidden md:inline-block px-5 py-2 font-bold uppercase text-sm tracking-[0.2em] transition-colors hover:bg-white hover:text-black"
            style={{
              background: "#0d0d0d",
              color: "#f4f4f4",
              border: "1.5px solid",
              borderImage: `${SILVER_H} 1`,
            }}
          >
            ✉ ПИШИ НИ
          </a>
        </div>
      </div>

      {/* ============= NAV STRIP (with live clock) ============= */}
      <div className="border-b-2 border-black bg-white">
        <div className="flex flex-wrap items-center justify-between px-4 py-2 gap-2 text-[13px] md:text-sm font-bold uppercase tracking-[0.15em]">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {STAGES.map((s, i) => (
              <a
                key={s.id}
                href={`#stage-${s.id}`}
                className="hover:underline decoration-2 underline-offset-4"
                style={{ opacity: stage === i ? 1 : 0.55 }}
              >
                ★ {s.id} {s.label}
              </a>
            ))}
          </div>
          <div
            className="text-[11px] flex items-center gap-2"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            <span aria-hidden className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            СТУДИО ·
            <span className="bg-black px-2 py-0.5 text-white tabular-nums">
              {clock}
            </span>
          </div>
        </div>
      </div>

      {/* ============= RIGHT-RAIL FUNNEL INDICATOR ============= */}
      <div
        aria-hidden
        className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-1.5 pointer-events-none"
      >
        {STAGES.map((s, i) => {
          const active = i === stage;
          return (
            <div key={s.id} className="flex items-center gap-2 justify-end">
              <span
                className="text-[10px] font-bold tracking-[0.2em]"
                style={{
                  fontFamily: "var(--font-brutal-pixel)",
                  opacity: active ? 1 : 0,
                  transition: "opacity 180ms ease",
                }}
              >
                {s.label}
              </span>
              <span
                className="w-6 h-6 border-2 border-black flex items-center justify-center text-[10px] font-black transition-all"
                style={{
                  background: active ? SILVER : "#ebe8e0",
                  boxShadow: active ? "3px 3px 0 0 #0d0d0d" : "1px 1px 0 0 #0d0d0d",
                  transform: active ? "translate(-2px,-2px)" : "translate(0,0)",
                }}
              >
                {s.id}
              </span>
            </div>
          );
        })}
      </div>

      {/* =========================================================== */}
      {/* STAGE 01 — HOOK                                              */}
      {/* =========================================================== */}
      <StageHook targetRef={s1} />

      {/* STAGE 02 — ИСТИНА */}
      <StageTruth targetRef={s2} />

      {/* STAGE 03 — ЧЕТИРИ СТАИ (sticky horizontal pan) */}
      <StageRooms targetRef={s3} />

      {/* STAGE 04 — СЪСТАВ */}
      <StageCast targetRef={s4} />

      {/* STAGE 05 — ОФЕРТА (sticky, slots fill) */}
      <StageOffer targetRef={s5} />

      {/* STAGE 06 — QUALIFY */}
      <StageQualify targetRef={s6} />

      {/* STAGE 07 — ASK */}
      <StageAsk targetRef={s7} />

      <style jsx global>{`
        @keyframes marquee-anim {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.33%); }
        }
        .marquee-anim {
          animation: marquee-anim 40s linear infinite;
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}

// ============================================================================
// STAGE 01 · HOOK
// ============================================================================
function StageHook({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const p = useScrollProgress(targetRef);
  const inView = useInView(targetRef, 0.2);

  // Cyrillic-safe: split by grapheme units via Array.from
  const fullType = "ВЛЕЗЕ ВЪВ ФУНИЯТА.";
  const graphemes = Array.from(fullType);
  const typedCount = Math.floor(Math.max(0, Math.min(1, (p - 0.15) / 0.5)) * graphemes.length);
  const typed = graphemes.slice(0, typedCount).join("");

  return (
    <section
      id="stage-01"
      ref={targetRef}
      className="border-b-2 border-black relative"
      style={{ minHeight: "100vh", background: "#ebe8e0" }}
    >
      <div className="px-6 md:px-14 py-16 md:py-24 max-w-[1400px] mx-auto">
        <div
          className="text-xs font-bold uppercase tracking-[0.35em] mb-10 opacity-60"
          style={{ fontFamily: "var(--font-brutal-pixel)" }}
        >
          01 · HOOK — ВЪВЕДЕНИЕ
        </div>

        {/* Availability pill */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-10"
          style={{
            background: "#0d0d0d",
            color: "#f4f4f4",
            border: "1.5px solid",
            borderImage: `${SILVER_H} 1`,
            boxShadow: "4px 4px 0 0 #0d0d0d",
          }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          ПРИЕМАМЕ БРАНДОВЕ · 3/12 СВОБОДНИ
        </div>

        <h1
          className="font-black leading-[0.86] tracking-[-0.04em] mb-8"
          style={{
            fontSize: "clamp(60px, 12vw, 172px)",
            WebkitTextStroke: "1px black",
          }}
        >
          СТРОИМ{" "}
          <span
            className="italic"
            style={{
              background: SILVER_H,
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

        {/* Typewriter caption */}
        <div
          className="mt-14 md:mt-20 flex items-center gap-3 font-bold uppercase text-lg md:text-2xl tracking-[0.15em]"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 400ms ease" }}
        >
          <span
            className="inline-block h-[1em] w-[3px]"
            style={{ background: "#0d0d0d" }}
          />
          <span>{typed}</span>
          <span
            className="inline-block h-[1em] w-[10px] animate-pulse"
            style={{ background: SILVER_H }}
          />
        </div>

        {/* Scroll cue */}
        <div
          className="mt-16 md:mt-24 flex items-center gap-4"
          style={{ opacity: 1 - p * 3, transition: "opacity 200ms ease" }}
        >
          <div
            className="text-xs font-bold uppercase tracking-[0.35em]"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            ▼ СКРОЛНИ ЗА ДА ПРОДЪЛЖИШ
          </div>
          <div className="flex-1 h-[2px] max-w-32 border-t-2 border-dashed border-black" />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STAGE 02 · ИСТИНА
// ============================================================================
function StageTruth({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const inView = useInView(targetRef, 0.35);
  const spent = useCounter(inView, 5000, 1800);
  const [showZero, setShowZero] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setShowZero(true), 1200);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <section
      id="stage-02"
      ref={targetRef}
      className="border-b-2 border-black"
      style={{ background: "#0d0d0d", color: "#f4f4f4", minHeight: "100vh" }}
    >
      <div className="px-6 md:px-14 py-20 md:py-32 max-w-[1400px] mx-auto">
        <div
          className="text-xs font-bold uppercase tracking-[0.35em] mb-14 opacity-60"
          style={{ fontFamily: "var(--font-brutal-pixel)" }}
        >
          02 · ХАПЛИВАТА ИСТИНА
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 md:gap-x-12 mb-24">
          {/* Left — spend counter */}
          <div className="border-2 border-white p-6 md:p-10" style={{ boxShadow: "8px 8px 0 0 #8a8a8a" }}>
            <div
              className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-70 mb-6"
              style={{ fontFamily: "var(--font-brutal-pixel)" }}
            >
              СРЕДЕН МЕСЕЧЕН РАЗХОД ПРИ АГЕНЦИЯ
            </div>
            <div
              className="font-black leading-none tabular-nums"
              style={{ fontSize: "clamp(56px, 11vw, 160px)", letterSpacing: "-0.03em" }}
            >
              €{spent.toLocaleString("bg-BG")}
            </div>
          </div>

          {/* Right — zero pulse */}
          <div
            className="p-6 md:p-10 relative"
            style={{
              background: showZero ? SILVER : "transparent",
              color: showZero ? "#0d0d0d" : "#8a8a8a",
              border: "2px solid #f4f4f4",
              boxShadow: "8px 8px 0 0 #0d0d0d",
              transition: "background 500ms, color 500ms",
            }}
          >
            <div
              className="text-[11px] font-bold uppercase tracking-[0.25em] mb-6"
              style={{ fontFamily: "var(--font-brutal-pixel)", opacity: 0.7 }}
            >
              ПРОСЛЕДЕНИ КЪМ РЕАЛЕН ПРИХОД
            </div>
            <div
              className="font-black leading-none tabular-nums"
              style={{ fontSize: "clamp(56px, 11vw, 160px)", letterSpacing: "-0.03em" }}
            >
              €0
            </div>
          </div>
        </div>

        <h2
          className="font-black leading-[0.94] tracking-[-0.03em] max-w-4xl uppercase"
          style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
        >
          Повечето агенции доставят{" "}
          <span className="italic opacity-60">deliverables.</span>
          <br />
          Ти искаш{" "}
          <span
            style={{
              background: SILVER_H,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            растеж.
          </span>
        </h2>
      </div>
    </section>
  );
}

// ============================================================================
// STAGE 03 · ЧЕТИРИ СТАИ (sticky horizontal pan)
// ============================================================================
function StageRooms({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const p = useScrollProgress(targetRef);
  const translate = -300 * p;

  return (
    <section
      id="stage-03"
      ref={targetRef}
      className="border-b-2 border-black relative"
      style={{ height: "400vh", background: "#d6d3ca" }}
    >
      {/* NB: overflow-x clip on the sticky container, NOT ancestor */}
      <div
        className="sticky top-0 h-screen"
        style={{ overflowX: "clip" }}
      >
        {/* Fixed section header */}
        <div className="absolute top-6 md:top-10 left-6 md:left-14 z-10">
          <div
            className="text-xs font-bold uppercase tracking-[0.35em] mb-2"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            03 · ЧЕТИРИ СТАИ · ЕДИН ПОКРИВ
          </div>
          <div
            className="inline-flex items-center gap-2 px-2 py-1 border-2 border-black text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ background: SILVER_H, boxShadow: "3px 3px 0 0 #0d0d0d" }}
          >
            {String(Math.min(4, Math.floor(p * 4) + 1)).padStart(2, "0")} / 04
          </div>
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-6 md:left-14 z-10 flex gap-2">
          {ROOMS.map((_, i) => {
            const active = Math.floor(p * 4 - 0.001) === i || (p >= 1 && i === 3);
            return (
              <span
                key={i}
                className="h-[3px] border-2 border-black transition-all"
                style={{
                  width: active ? 56 : 16,
                  background: active ? SILVER_H : "transparent",
                }}
              />
            );
          })}
        </div>

        {/* Horizontal pan track */}
        <div
          className="flex h-full"
          style={{
            width: "400vw",
            transform: `translateX(${translate}vw)`,
            willChange: "transform",
          }}
        >
          {ROOMS.map((r) => (
            <div
              key={r.id}
              className="w-screen h-full flex-shrink-0 flex items-center justify-center px-6 md:px-20"
            >
              <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 w-full items-center">
                {/* Left panel — room name */}
                <div
                  className="border-2 border-black p-6 md:p-10"
                  style={{
                    background: "#ebe8e0",
                    boxShadow: "8px 8px 0 0 #0d0d0d",
                  }}
                >
                  <div
                    className="inline-block px-2 py-1 border-2 border-black text-[10px] font-bold uppercase tracking-[0.25em] mb-6"
                    style={{ background: SILVER_H }}
                  >
                    СТАЯ №{r.id}
                  </div>
                  <h3
                    className="font-black leading-[0.9] tracking-[-0.03em] mb-6"
                    style={{ fontSize: "clamp(48px, 9vw, 128px)" }}
                  >
                    {r.title}
                  </h3>
                  <div
                    className="text-xs font-bold uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-brutal-pixel)" }}
                  >
                    {r.detail}
                  </div>
                </div>

                {/* Right panel — stat plate (dark bg + silver number) */}
                <div
                  className="border-2 border-black p-6 md:p-10"
                  style={{
                    background: "#0d0d0d",
                    color: "#f4f4f4",
                    boxShadow: "8px 8px 0 0 #8a8a8a",
                  }}
                >
                  <div
                    className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-70 mb-4"
                    style={{ fontFamily: "var(--font-brutal-pixel)" }}
                  >
                    {r.label}
                  </div>
                  <div
                    className="font-black leading-none tabular-nums"
                    style={{
                      fontSize: "clamp(72px, 12vw, 200px)",
                      letterSpacing: "-0.03em",
                      background: SILVER_H,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {r.num}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STAGE 04 · СЪСТАВ
// ============================================================================
function StageCast({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const inView = useInView(targetRef, 0.15);
  return (
    <section
      id="stage-04"
      ref={targetRef}
      className="border-b-2 border-black"
      style={{ background: "#0d0d0d", color: "#f4f4f4", minHeight: "100vh" }}
    >
      <div className="px-6 md:px-14 py-20 md:py-28 max-w-[1400px] mx-auto">
        <div
          className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60"
          style={{ fontFamily: "var(--font-brutal-pixel)" }}
        >
          04 · СЪСТАВЪТ
        </div>
        <h2
          className="font-black leading-[0.94] tracking-[-0.03em] uppercase mb-14"
          style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
        >
          50 БРАНДА В ПОРТФЕЙЛА.
          <br />
          12{" "}
          <span
            style={{
              background: SILVER_H,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ПРЕДСТАВЕНИ.
          </span>
        </h2>

        <div className="border-t-2 border-white/25">
          {CLIENTS.map((c, i) => (
            <div
              key={c.name}
              className="grid grid-cols-12 gap-x-4 py-4 md:py-5 border-b-2 border-white/25 items-baseline transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(18px)",
                transitionDelay: `${i * 70}ms`,
              }}
            >
              <div
                className="col-span-1 text-[11px] opacity-50 tabular-nums font-bold"
                style={{ fontFamily: "var(--font-brutal-pixel)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="col-span-6 md:col-span-8 font-black text-lg md:text-3xl tracking-tight uppercase">
                {c.name}
              </div>
              <div
                className="col-span-5 md:col-span-3 text-right font-black text-base md:text-2xl tabular-nums"
                style={{
                  background: SILVER_H,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {c.lift} ROAS
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STAGE 05 · ОФЕРТА (sticky, slots fill on scroll)
// ============================================================================
function StageOffer({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const p = useScrollProgress(targetRef);
  const filled = Math.min(9, Math.floor(p * 12));
  return (
    <section
      id="stage-05"
      ref={targetRef}
      className="border-b-2 border-black relative"
      style={{ height: "180vh", background: "#ebe8e0" }}
    >
      <div className="sticky top-0 h-screen flex items-center px-6 md:px-14">
        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14 items-center">
          <div>
            <div
              className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60"
              style={{ fontFamily: "var(--font-brutal-pixel)" }}
            >
              05 · ОФЕРТА
            </div>
            <h2
              className="font-black leading-[0.92] tracking-[-0.03em] uppercase mb-8"
              style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
            >
              ПРИЕМАМЕ{" "}
              <span
                style={{
                  background: SILVER_H,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                12 БРАНДА
              </span>
              <br />
              ГОДИШНО. НЕ ПОВЕЧЕ.
            </h2>
            <p
              className="text-base md:text-lg leading-[1.5] font-bold max-w-md mb-8"
              style={{ fontFamily: "var(--font-brutal-comic)" }}
            >
              Едно ниво на внимание. Един стандарт. Един разговор
              от стратегия до launch.
            </p>
            <div
              className="inline-flex items-center gap-3 px-4 py-3 border-2 border-black"
              style={{ background: "#0d0d0d", color: "#f4f4f4", boxShadow: "6px 6px 0 0 #8a8a8a" }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-70"
                style={{ fontFamily: "var(--font-brutal-pixel)" }}
              >
                ОСТАВАТ
              </span>
              <span
                className="font-black text-3xl md:text-4xl tabular-nums leading-none"
                style={{
                  background: SILVER_H,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {12 - filled}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-70"
                style={{ fontFamily: "var(--font-brutal-pixel)" }}
              >
                ЗА 2026
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {Array.from({ length: 12 }).map((_, i) => {
              const isFilled = i < filled;
              const isNext = i === filled;
              return (
                <div
                  key={i}
                  className="aspect-square border-2 border-black transition-all duration-500 flex items-center justify-center text-[11px] tabular-nums font-black"
                  style={{
                    background: isFilled ? SILVER : "#ebe8e0",
                    boxShadow: isFilled
                      ? "3px 3px 0 0 #0d0d0d"
                      : "1px 1px 0 0 rgba(13,13,13,0.5)",
                    transform: isNext ? "scale(1.06) translate(-2px,-2px)" : "scale(1)",
                    color: isFilled ? "#0d0d0d" : "rgba(13,13,13,0.4)",
                    fontFamily: "var(--font-brutal-pixel)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STAGE 06 · QUALIFY
// ============================================================================
function StageQualify({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const p = useScrollProgress(targetRef);
  const checked = Math.min(QUALIFY.length, Math.floor(p * QUALIFY.length * 1.7));
  return (
    <section
      id="stage-06"
      ref={targetRef}
      className="border-b-2 border-black"
      style={{ background: "#d6d3ca", minHeight: "100vh" }}
    >
      <div className="px-6 md:px-14 py-20 md:py-28 max-w-[1400px] mx-auto">
        <div
          className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60"
          style={{ fontFamily: "var(--font-brutal-pixel)" }}
        >
          06 · QUALIFY — ТИ ЛИ СИ?
        </div>
        <h2
          className="font-black leading-[0.94] tracking-[-0.03em] uppercase mb-14 max-w-4xl"
          style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
        >
          ОТГОВАРЯШ ЛИ НА ВСИЧКИТЕ{" "}
          <span
            style={{
              background: SILVER_H,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ЧЕТИРИ
          </span>
          ?
        </h2>

        <ul className="space-y-5 md:space-y-7 max-w-4xl">
          {QUALIFY.map((q, i) => {
            const done = i < checked;
            return (
              <li
                key={q}
                className="flex items-start gap-4 md:gap-6 transition-all duration-500 border-2 border-black p-4 md:p-6"
                style={{
                  opacity: done ? 1 : 0.4,
                  background: done ? "#ebe8e0" : "transparent",
                  boxShadow: done ? "6px 6px 0 0 #0d0d0d" : "none",
                }}
              >
                <span
                  className="mt-1 w-8 h-8 md:w-11 md:h-11 flex-shrink-0 border-2 border-black flex items-center justify-center transition-all"
                  style={{
                    background: done ? SILVER : "transparent",
                    color: done ? "#0d0d0d" : "transparent",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8L7 12L13 4"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="square"
                      style={{
                        strokeDasharray: 20,
                        strokeDashoffset: done ? 0 : 20,
                        transition: "stroke-dashoffset 500ms ease-out",
                      }}
                    />
                  </svg>
                </span>
                <span
                  className="text-lg md:text-2xl leading-[1.35] font-bold uppercase"
                >
                  {q}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ============================================================================
// STAGE 07 · ASK
// ============================================================================
function StageAsk({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const inView = useInView(targetRef, 0.35);
  return (
    <section
      id="stage-07"
      ref={targetRef}
      className="relative"
      style={{ background: "#0d0d0d", color: "#f4f4f4", minHeight: "100vh" }}
    >
      <div className="px-6 md:px-14 py-24 md:py-40 max-w-[1400px] mx-auto text-center relative">
        {/* Ambient chrome halo */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <div
            className="w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full transition-opacity duration-1000"
            style={{
              background:
                "radial-gradient(circle, rgba(180,180,180,0.18) 0%, rgba(180,180,180,0) 60%)",
              opacity: inView ? 1 : 0,
            }}
          />
        </div>

        <div className="relative">
          <div
            className="text-xs font-bold uppercase tracking-[0.35em] mb-10 opacity-60"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            07 · АКО СИ СТИГНАЛ ДОТУК
          </div>
          <h2
            className="font-black leading-[0.9] tracking-[-0.03em] uppercase mb-16"
            style={{ fontSize: "clamp(48px, 8vw, 128px)" }}
          >
            ТОГАВА Е ВРЕМЕ ЗА{" "}
            <span
              className="italic"
              style={{
                background: SILVER_H,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              РАЗГОВОР.
            </span>
          </h2>

          {/* Chrome CTA */}
          <a
            href="mailto:vektoagency@gmail.com"
            className="group inline-flex items-center gap-4 px-8 md:px-14 py-5 md:py-8 border-2 border-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: SILVER,
              color: "#0d0d0d",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.4) inset, 10px 10px 0 0 #ebe8e0, 0 0 80px rgba(180,180,180,0.2)",
            }}
          >
            <span className="font-black text-xl md:text-3xl uppercase tracking-tight">
              ЗАПАЗИ РАЗГОВОР
            </span>
            <span className="font-black text-xl md:text-3xl transition-transform group-hover:translate-x-2">
              →
            </span>
          </a>

          <div
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.25em] opacity-70"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            <a href="mailto:vektoagency@gmail.com" className="hover:opacity-100">
              vektoagency@gmail.com
            </a>
            <span className="opacity-40">·</span>
            <a href="tel:+359882251474" className="hover:opacity-100">
              +359 88 225 1474
            </a>
            <span className="opacity-40">·</span>
            <span>СОФИЯ, БЪЛГАРИЯ</span>
          </div>

          {/* Guestbook line */}
          <div
            className="mt-24 text-[10px] tracking-[0.2em] opacity-40 border-t-2 border-dashed border-white/40 pt-4 max-w-3xl mx-auto uppercase"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            // ГОСТ-КНИГА · ПРАВЕН СЪС ♥ В СОФИЯ · MMXXVI
          </div>

          <Link
            href="/portfolio"
            className="mt-6 inline-block text-[10px] uppercase tracking-[0.3em] opacity-50 hover:opacity-100 underline decoration-2 underline-offset-4"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            ← ВИЖ ПЪЛНО ПОРТФОЛИО
          </Link>
        </div>
      </div>
    </section>
  );
}
