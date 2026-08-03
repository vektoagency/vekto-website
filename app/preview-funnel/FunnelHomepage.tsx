"use client";

// SCROLL-DRIVEN INTERACTIVE FUNNEL HOMEPAGE
//
// The entire page IS the sales funnel. Each viewport-height is a
// stage. Scrolling is the interaction — every animation is tied to
// scroll position, not autoplay. No colour explosion: deep off-black
// ground, bone-white ink, warm amber accent used sparingly, a single
// chrome-silver moment at the final CTA. Life comes from motion, not
// palette.
//
// Sections (7 stages):
//   1. HOOK      — VEKTO wordmark assembles from 4 corners
//   2. TRUTH     — number counter contrast: spent vs tracked
//   3. FOUR ROOMS — sticky horizontal pan through 4 pillars
//   4. WHO'S IN  — client roster reveals one-by-one on scroll
//   5. OFFER     — 12 slot boxes fill as scroll progresses
//   6. QUALIFY   — checklist auto-marks as it scrolls in
//   7. ASK       — chrome CTA button, single ask
//
// Architecture:
//   - Fixed right-rail funnel-progress indicator (7 stages)
//   - Custom cursor dot (grows over interactive elements)
//   - Grain overlay for texture
//   - Native scroll events + rAF + IntersectionObserver — no libraries

import { useEffect, useRef, useState, type CSSProperties } from "react";

// ============================================================================
// PALETTE
// ============================================================================
const INK       = "#ebe8e0";  // bone-white text
const GROUND    = "#0e0d0b";  // deep off-black background
const GROUND_2  = "#151310";  // one tone up for panels
const AMBER     = "#c69955";  // warm accent, used sparingly
const CHROME =
  "linear-gradient(180deg, #c4c4c4 0%, #f4f4f4 22%, #8a8a8a 48%, #eaeaea 52%, #6d6d6d 82%, #b0b0b0 100%)";
const CHROME_H =
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
  { id: "01", title: "Реклами",     detail: "Meta · Google · TikTok",         num: "4.8×",  label: "Среден ROAS" },
  { id: "02", title: "Съдържание",  detail: "Видео · UGC · Live-action",      num: "200+",  label: "Ассета месец" },
  { id: "03", title: "Сайтове",     detail: "Landing · Е-ком · Портали",      num: "12",    label: "Launch-a година" },
  { id: "04", title: "Стратегия",   detail: "Позициониране · Оферта · План",  num: "50",    label: "Бранда в портфолиото" },
];

const QUALIFY = [
  "Правиш €100k+ годишен приход",
  "Готов си да инвестираш в система, не в единични ассета",
  "Искаш партньор, не изпълнител",
  "Цениш занаята повече от gimmicks",
];

// ============================================================================
// HOOKS
// ============================================================================

// Returns a value 0→1 based on how far a target element has scrolled
// through the viewport. 0 when element top hits viewport bottom;
// 1 when element bottom leaves viewport top.
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
      const next = Math.max(0, Math.min(1, scrolled / total));
      setP(next);
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

// Fires once when element first enters viewport at threshold.
function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.4) {
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

// Counts an integer up from 0 to `to` over `ms` once triggered.
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

// Tracks which of a list of section refs is closest to viewport center.
function useCurrentStage(refs: React.RefObject<HTMLElement | null>[]) {
  const [i, setI] = useState(0);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const mid = window.innerHeight / 2;
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

export default function FunnelHomepage() {
  const hookRef    = useRef<HTMLElement>(null);
  const truthRef   = useRef<HTMLElement>(null);
  const roomsRef   = useRef<HTMLElement>(null);
  const castRef    = useRef<HTMLElement>(null);
  const offerRef   = useRef<HTMLElement>(null);
  const qualifyRef = useRef<HTMLElement>(null);
  const askRef     = useRef<HTMLElement>(null);

  const refs = [hookRef, truthRef, roomsRef, castRef, offerRef, qualifyRef, askRef];
  const stage = useCurrentStage(refs);
  const stageLabels = ["HOOK", "ИСТИНА", "СТАИТЕ", "СЪСТАВ", "ОФЕРТА", "QUALIFY", "ASK"];

  // Custom cursor (dot that grows on interactive elements)
  const [cursor, setCursor] = useState({ x: -100, y: -100, big: false });
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      const big = !!el?.closest("a, button, [data-interactive]");
      setCursor({ x: e.clientX, y: e.clientY, big });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="relative overflow-x-hidden"
      style={{
        background: GROUND,
        color: INK,
        fontFamily: "var(--font-funnel-sans), system-ui, sans-serif",
      }}
    >
      {/* ============= GRAIN OVERLAY ============= */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>\")",
        }}
      />

      {/* ============= CUSTOM CURSOR ============= */}
      <div
        aria-hidden
        className="pointer-events-none fixed z-[100] hidden md:block transition-[width,height,background] duration-200 ease-out"
        style={{
          left: cursor.x,
          top: cursor.y,
          width: cursor.big ? 40 : 10,
          height: cursor.big ? 40 : 10,
          background: cursor.big ? AMBER : INK,
          transform: "translate(-50%, -50%)",
          borderRadius: "9999px",
          mixBlendMode: "difference",
        }}
      />

      {/* ============= FIXED FUNNEL PROGRESS RAIL ============= */}
      <div
        aria-hidden
        className="pointer-events-none fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:block"
      >
        <div className="flex flex-col items-end gap-2">
          {stageLabels.map((label, i) => {
            const active = i === stage;
            return (
              <div key={label} className="flex items-center gap-3">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.25em] transition-all ${active ? "opacity-100" : "opacity-30"}`}
                  style={{ color: active ? AMBER : INK }}
                >
                  {String(i + 1).padStart(2, "0")} · {label}
                </span>
                <span
                  className="w-8 h-[1.5px] transition-all"
                  style={{
                    background: active ? AMBER : "rgba(235,232,224,0.25)",
                    transform: active ? "scaleX(1.4)" : "scaleX(1)",
                    transformOrigin: "right",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ============= 1 · HOOK ============= */}
      <SectionHook targetRef={hookRef} />

      {/* ============= 2 · TRUTH ============= */}
      <SectionTruth targetRef={truthRef} />

      {/* ============= 3 · FOUR ROOMS (sticky horizontal pan) ============= */}
      <SectionRooms targetRef={roomsRef} />

      {/* ============= 4 · CAST ============= */}
      <SectionCast targetRef={castRef} />

      {/* ============= 5 · OFFER ============= */}
      <SectionOffer targetRef={offerRef} />

      {/* ============= 6 · QUALIFY ============= */}
      <SectionQualify targetRef={qualifyRef} />

      {/* ============= 7 · ASK ============= */}
      <SectionAsk targetRef={askRef} />

      <style jsx global>{`
        html, body {
          background: ${GROUND};
          color: ${INK};
          cursor: none;
        }
        @media (max-width: 767px) {
          html, body { cursor: auto; }
        }
        ::selection { background: ${AMBER}; color: ${GROUND}; }
        .font-serif { font-family: var(--font-funnel-serif), Georgia, serif; }
        .font-mono  { font-family: var(--font-funnel-mono), monospace; }
      `}</style>
    </div>
  );
}

// ============================================================================
// 1 · HOOK — VEKTO letters assemble from 4 corners; instruction types out
// ============================================================================
function SectionHook({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const p = useScrollProgress(targetRef);
  // 4 letters that come from 4 corners and settle into position
  const letters = ["V", "E", "K", "T"];
  const corners: CSSProperties[] = [
    { transform: `translate(${(1 - p) * -80}vw, ${(1 - p) * -50}vh) rotate(${(1 - p) * -25}deg)` },
    { transform: `translate(${(1 - p) *  80}vw, ${(1 - p) * -50}vh) rotate(${(1 - p) *  25}deg)` },
    { transform: `translate(${(1 - p) * -80}vw, ${(1 - p) *  50}vh) rotate(${(1 - p) *  25}deg)` },
    { transform: `translate(${(1 - p) *  80}vw, ${(1 - p) *  50}vh) rotate(${(1 - p) * -25}deg)` },
  ];
  const oOpacity = Math.max(0, (p - 0.4) / 0.4);
  const typedChars = Math.floor(Math.min(1, Math.max(0, (p - 0.5) / 0.4)) * 24);
  const fullType = "Влезе във фунията.";
  const typed = fullType.slice(0, typedChars);

  return (
    <section
      ref={targetRef}
      className="relative"
      style={{ height: "200vh", background: GROUND }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient amber halo */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 60%, rgba(198,153,85,0.12) 0%, rgba(198,153,85,0) 55%)",
          }}
        />

        <div className="relative flex items-center justify-center leading-none">
          {letters.map((L, i) => (
            <span
              key={L + i}
              className="font-serif font-black inline-block"
              style={{
                fontSize: "clamp(80px, 22vw, 320px)",
                letterSpacing: "-0.04em",
                transition: "none",
                ...corners[i],
              }}
            >
              {L}
            </span>
          ))}
          {/* O appears at end via opacity */}
          <span
            className="font-serif font-black inline-block"
            style={{
              fontSize: "clamp(80px, 22vw, 320px)",
              letterSpacing: "-0.04em",
              opacity: oOpacity,
              color: AMBER,
              transform: `scale(${0.6 + 0.4 * oOpacity})`,
              transformOrigin: "center",
              transition: "opacity 60ms linear",
            }}
          >
            O
          </span>
        </div>

        {/* Typed instruction */}
        <div
          className="mt-10 md:mt-16 font-mono uppercase text-sm md:text-base tracking-[0.3em] h-6"
          style={{ opacity: p > 0.5 ? 1 : 0 }}
        >
          <span>{typed}</span>
          <span
            className="inline-block ml-1 w-[8px] h-[1em] align-middle animate-pulse"
            style={{ background: AMBER }}
          />
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{ opacity: 1 - p * 2.5 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-60">
            Скролни за да продължиш
          </span>
          <div className="w-[1px] h-14 relative overflow-hidden" style={{ background: "rgba(235,232,224,0.15)" }}>
            <span
              className="absolute inset-x-0 top-0 h-4 animate-scroll-cue"
              style={{ background: `linear-gradient(180deg, transparent, ${AMBER})` }}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll-cue {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
        .animate-scroll-cue {
          animation: scroll-cue 1.8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

// ============================================================================
// 2 · TRUTH — Number contrast: monthly spend counts UP, tracked revenue DOWN
// ============================================================================
function SectionTruth({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const inView = useInView(targetRef, 0.35);
  const spent = useCounter(inView, 5000, 1800);
  // "Tracked" stays at 0 but pulses in
  const [showZero, setShowZero] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setShowZero(true), 1200);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <section
      ref={targetRef}
      className="min-h-screen flex items-center justify-center px-6 md:px-14 py-32"
      style={{ background: GROUND }}
    >
      <div className="max-w-[1200px] w-full">
        <div className="font-mono text-[10px] uppercase tracking-[0.35em] mb-10 opacity-50">
          02 · Хапливата истина
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 md:gap-x-16 mb-24">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60 mb-4">
              Среден месечен разход при агенция
            </div>
            <div
              className="font-serif font-black leading-none tabular-nums"
              style={{ fontSize: "clamp(72px, 12vw, 180px)", letterSpacing: "-0.03em" }}
            >
              €{spent.toLocaleString("bg-BG")}
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60 mb-4">
              Проследени към реален приход
            </div>
            <div
              className="font-serif font-black leading-none tabular-nums transition-opacity duration-500"
              style={{
                fontSize: "clamp(72px, 12vw, 180px)",
                letterSpacing: "-0.03em",
                color: AMBER,
                opacity: showZero ? 1 : 0.15,
              }}
            >
              €0
            </div>
          </div>
        </div>

        <h2
          className="font-serif leading-[0.98] tracking-[-0.02em] max-w-3xl"
          style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
        >
          Повечето агенции доставят{" "}
          <span className="italic opacity-70">deliverables.</span>
          <br />
          Ти искаш <span style={{ color: AMBER }}>растеж</span>.
        </h2>
      </div>
    </section>
  );
}

// ============================================================================
// 3 · FOUR ROOMS — Sticky horizontal pan through 4 service pillars
// ============================================================================
function SectionRooms({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const p = useScrollProgress(targetRef);
  // 4 rooms → translateX from 0% to -300% across the pan
  const translate = -300 * p; // -300% at the end

  return (
    <section
      ref={targetRef}
      className="relative"
      style={{ height: "400vh", background: GROUND_2 }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Fixed section header */}
        <div className="absolute top-8 md:top-12 left-6 md:left-14 z-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.35em] opacity-50 mb-2">
            03 · Четири стаи под един покрив
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">
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
                className="h-[2px] transition-all"
                style={{
                  width: active ? 48 : 12,
                  background: active ? AMBER : "rgba(235,232,224,0.25)",
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
            transition: "transform 60ms linear",
          }}
        >
          {ROOMS.map((r, i) => (
            <div
              key={r.id}
              className="w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-24"
            >
              <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 w-full">
                <div>
                  <div
                    className="font-mono text-[11px] uppercase tracking-[0.3em] mb-4"
                    style={{ color: AMBER }}
                  >
                    Стая № {r.id}
                  </div>
                  <h3
                    className="font-serif font-black leading-[0.9] tracking-[-0.02em] mb-6"
                    style={{ fontSize: "clamp(56px, 9vw, 140px)" }}
                  >
                    {r.title}
                  </h3>
                  <div className="font-mono text-sm uppercase tracking-[0.15em] opacity-70">
                    {r.detail}
                  </div>
                </div>
                <div className="md:flex md:items-end">
                  <div>
                    <div
                      className="font-serif font-black leading-none tabular-nums"
                      style={{
                        fontSize: "clamp(64px, 10vw, 160px)",
                        letterSpacing: "-0.03em",
                        color: AMBER,
                      }}
                    >
                      {r.num}
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-70 mt-2">
                      {r.label}
                    </div>
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
// 4 · CAST — Client roster reveals one-by-one on scroll
// ============================================================================
function SectionCast({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const inView = useInView(targetRef, 0.2);
  return (
    <section
      ref={targetRef}
      className="min-h-screen px-6 md:px-14 py-32 flex items-center"
      style={{ background: GROUND }}
    >
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="font-mono text-[10px] uppercase tracking-[0.35em] mb-6 opacity-50">
          04 · Съставът
        </div>
        <h2
          className="font-serif leading-[0.94] tracking-[-0.02em] mb-16 max-w-3xl"
          style={{ fontSize: "clamp(44px, 6.5vw, 96px)" }}
        >
          Петдесет бранда.<br />
          Дванадесет представени тук.
        </h2>

        <div className="border-t border-white/10">
          {CLIENTS.map((c, i) => (
            <div
              key={c.name}
              className="grid grid-cols-12 gap-x-4 py-4 md:py-5 border-b border-white/10 items-baseline transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${i * 90}ms`,
              }}
            >
              <div className="col-span-1 font-mono text-[11px] opacity-40 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="col-span-6 md:col-span-8 font-serif text-xl md:text-3xl font-medium">
                {c.name}
              </div>
              <div
                className="col-span-5 md:col-span-3 text-right font-mono text-sm md:text-base tabular-nums"
                style={{ color: AMBER }}
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
// 5 · OFFER — 12 slot boxes fill as scroll progresses
// ============================================================================
function SectionOffer({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const p = useScrollProgress(targetRef);
  const filled = Math.min(9, Math.floor(p * 12));
  return (
    <section
      ref={targetRef}
      className="relative"
      style={{ height: "180vh", background: GROUND_2 }}
    >
      <div className="sticky top-0 h-screen flex items-center px-6 md:px-14">
        <div className="max-w-[1200px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14 items-center">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] mb-6 opacity-50">
              05 · Офертата
            </div>
            <h2
              className="font-serif leading-[0.94] tracking-[-0.02em] mb-8"
              style={{ fontSize: "clamp(40px, 5.5vw, 84px)" }}
            >
              Приемаме{" "}
              <span style={{ color: AMBER }}>12 бранда</span> годишно.
              <br />
              Не повече.
            </h2>
            <p className="text-base md:text-lg leading-[1.7] opacity-80 max-w-md">
              Едно ниво на внимание. Един стандарт. Един разговор от
              стратегия до launch. Затова — квота, не масовост.
            </p>
            <div className="mt-8 font-mono text-sm uppercase tracking-[0.2em]">
              Остават{" "}
              <span
                className="font-serif font-black text-2xl md:text-3xl align-middle tabular-nums"
                style={{ color: AMBER }}
              >
                {12 - filled}
              </span>{" "}
              за 2026
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {Array.from({ length: 12 }).map((_, i) => {
              const isFilled = i < filled;
              const isNext = i === filled;
              return (
                <div
                  key={i}
                  className="aspect-square border transition-all duration-500 flex items-center justify-center font-mono text-[10px] tabular-nums"
                  style={{
                    background: isFilled ? AMBER : "transparent",
                    borderColor: isFilled ? AMBER : "rgba(235,232,224,0.2)",
                    color: isFilled ? GROUND : "rgba(235,232,224,0.4)",
                    transform: isNext ? "scale(1.06)" : "scale(1)",
                    boxShadow: isNext ? `0 0 0 1px ${AMBER}` : "none",
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
// 6 · QUALIFY — Auto-checking checklist as it scrolls in
// ============================================================================
function SectionQualify({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const p = useScrollProgress(targetRef);
  const checked = Math.min(QUALIFY.length, Math.floor(p * QUALIFY.length * 1.6));
  return (
    <section
      ref={targetRef}
      className="min-h-screen px-6 md:px-14 py-32 flex items-center"
      style={{ background: GROUND }}
    >
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="font-mono text-[10px] uppercase tracking-[0.35em] mb-6 opacity-50">
          06 · Ти ли си партньорът, който търсим
        </div>
        <h2
          className="font-serif leading-[0.94] tracking-[-0.02em] mb-16 max-w-3xl"
          style={{ fontSize: "clamp(40px, 5.5vw, 84px)" }}
        >
          Ако отговаряш на всичките четири —{" "}
          <span style={{ color: AMBER }}>говорим</span>.
        </h2>

        <ul className="space-y-6 md:space-y-8 max-w-3xl">
          {QUALIFY.map((q, i) => {
            const done = i < checked;
            return (
              <li
                key={q}
                className="flex items-start gap-4 md:gap-6 transition-all duration-500"
                style={{ opacity: done ? 1 : 0.35 }}
              >
                <span
                  className="mt-1 md:mt-2 w-7 h-7 md:w-9 md:h-9 flex-shrink-0 border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: done ? AMBER : "rgba(235,232,224,0.35)",
                    background: done ? AMBER : "transparent",
                    color: done ? GROUND : "transparent",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
                  className="font-serif text-2xl md:text-4xl leading-[1.25]"
                  style={{ textDecoration: done ? "none" : "none" }}
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
// 7 · ASK — Single chrome CTA. Everything else fades away.
// ============================================================================
function SectionAsk({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const inView = useInView(targetRef, 0.4);
  return (
    <section
      ref={targetRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 md:px-14 py-32 relative"
      style={{ background: GROUND }}
    >
      {/* Ambient chrome halo behind CTA */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div
          className="w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full transition-opacity duration-1000"
          style={{
            background: "radial-gradient(circle, rgba(180,180,180,0.15) 0%, rgba(180,180,180,0) 60%)",
            opacity: inView ? 1 : 0,
          }}
        />
      </div>

      <div className="relative text-center max-w-4xl">
        <div className="font-mono text-[10px] uppercase tracking-[0.35em] mb-10 opacity-50">
          07 · Ако си стигнал дотук
        </div>
        <h2
          className="font-serif leading-[0.92] tracking-[-0.02em] mb-16"
          style={{ fontSize: "clamp(52px, 8vw, 128px)" }}
        >
          Тогава е време за{" "}
          <span className="italic" style={{ color: AMBER }}>разговор</span>.
        </h2>

        {/* Chrome CTA button */}
        <a
          href="mailto:vektoagency@gmail.com"
          data-interactive
          className="group inline-flex items-center gap-4 px-8 md:px-12 py-5 md:py-7 relative transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: CHROME,
            color: GROUND,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.4) inset, 0 24px 48px -12px rgba(0,0,0,0.6), 0 0 60px rgba(180,180,180,0.15)",
          }}
        >
          <span className="font-serif font-black text-2xl md:text-4xl tracking-tight">
            Запази разговор
          </span>
          <span
            className="font-serif font-black text-2xl md:text-4xl transition-transform group-hover:translate-x-2"
          >
            →
          </span>
        </a>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 font-mono text-xs uppercase tracking-[0.25em] opacity-60">
          <a href="mailto:vektoagency@gmail.com" data-interactive className="hover:opacity-100">
            vektoagency@gmail.com
          </a>
          <span className="opacity-40">·</span>
          <a href="tel:+359882251474" data-interactive className="hover:opacity-100">
            +359 88 225 1474
          </a>
          <span className="opacity-40">·</span>
          <span>София, България</span>
        </div>
      </div>

      {/* Footer strip */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center font-mono text-[10px] uppercase tracking-[0.3em] opacity-30">
        © VEKTO · MMXXVI · Studio
      </div>

      <style jsx>{`
        /* Guarantee the CTA text uses chrome even inside dark theme */
      `}</style>
    </section>
  );
}
