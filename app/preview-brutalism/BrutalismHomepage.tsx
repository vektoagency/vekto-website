"use client";

// BRUTALISM-STYLED SCROLL-DRIVEN FUNNEL · v2
//
// v1 had three real problems:
//   1. "12 brands per year" scarcity was invented → dropped everywhere;
//      replaced with STAGE 5 "СТАНДАРТЪТ / THE STANDARD" (4 principles
//      that describe how we actually work).
//   2. Individual per-client ROAS lifts (+5.2× etc) were mostly
//      fabricated → dropped; the roster now lists brand + region only.
//   3. Sticky-scroll animations played in the wrong window: the section
//      progress was 0→1 across the whole (viewport + section height),
//      but sticky only latches for the middle portion. So the horizontal
//      pan and slot fill were half-empty at start-of-stick and never
//      reached full at end-of-stick. New hook `useStickyProgress` maps
//      the sticky-active window exactly to 0→1.
//
// Also: added BG/EN language toggle (persisted in localStorage), and
// rewrote the copy to be premium-agency direct instead of hype.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";

// ============================================================================
// PALETTE
// ============================================================================
// SILVER — bright brushed chrome. Use ONLY as text-fill on DARK grounds
// or as physical panel backing. Contains highlights near #f4f4f4 which
// vanish on our bone-paper bg.
const SILVER =
  "linear-gradient(180deg, #c4c4c4 0%, #f4f4f4 22%, #8a8a8a 48%, #eaeaea 52%, #6d6d6d 82%, #b0b0b0 100%)";
const SILVER_H =
  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 20%, #8a8a8a 45%, #eaeaea 55%, #6d6d6d 80%, #b0b0b0 100%)";
// WORDMARK_METAL — cleaner brushed-titanium look for the VEKTO wordmark
// specifically. No mirror-shine highlights, so it reads like a real
// metallic-vinyl brand logo rather than a chrome-plated ornament.
const WORDMARK_METAL =
  "linear-gradient(180deg, #d4d4d4 0%, #a8a8a8 40%, #7a7a7a 70%, #969696 100%)";
// GRAPHITE — dark chrome. Same shine variation but every tone dark
// enough to stay readable on bone / concrete backgrounds. Use as
// text-fill on LIGHT grounds where you want the chrome feel.
const GRAPHITE_H =
  "linear-gradient(90deg, #3a3a3a 0%, #6d6d6d 22%, #2a2a2a 50%, #6d6d6d 78%, #3a3a3a 100%)";

// ============================================================================
// COPY (bg + en). Brand names stay Latin in both languages.
// ============================================================================
type Lang = "bg" | "en";

const COPY = {
  bg: {
    marquee:
      "VEKTO GROWTH STUDIO ✦ ЕДИН БРАНД НА НИША ✦ AI-CREATIVE ПРОИЗВОДСТВО ✦ РЕКЛАМИ · СЪДЪРЖАНИЕ · САЙТОВЕ · СТРАТЕГИЯ ✦ 50+ ПАРТНЬОРА В БГ + САЩ ✦ 4.8× СРЕДЕН ROAS ✦ ДАННИТЕ РЕШАВАТ, НЕ МНЕНИЯТА ✦ EST. MMXXIV · SOFIA ✦",
    cta: "ПИШИ НИ",
    nav: {
      studio: "СТУДИО",
      langSwitch: "EN",
    },
    stages: [
      { id: "01", label: "СТУДИО" },
      { id: "02", label: "ПРОБЛЕМ" },
      { id: "03", label: "ФОКУС" },
      { id: "04", label: "БРАНДОВЕ" },
      { id: "05", label: "СТАНДАРТ" },
      { id: "06", label: "QUALIFY" },
      { id: "07", label: "РАЗГОВОР" },
    ],
    stage1: {
      eyebrow: "01 · GROWTH STUDIO",
      pill: "СТУДИО В СОФИЯ · ОТГОВОР ПОД 24Ч",
      headline1: "СТРОИМ РАСТЕЖ.",
      headline2Prefix: "НЕ",
      headline2Highlight: "ОТЧЕТИ.",
      typed: "ВЛЕЗЕ ВЪВ ФУНИЯТА.",
      scrollCue: "▼ СКРОЛНИ ЗА ДА ПРОДЪЛЖИШ",
    },
    stage2: {
      eyebrow: "02 · ЗАЩО СЪЩЕСТВУВАМЕ",
      quoteMain:
        "„Инвестираме сериозно в реклама. Но никой не може да ми каже точно колко се връща.\"",
      quoteAttribution: "— повечето собственици, някога през първата година",
      response: "Ако това ти звучи познато —",
      responseHighlight: "приятели.",
    },
    stage3: {
      eyebrow: "03 · ЧЕТИРИ СТАИ · ЕДИН ПОКРИВ",
      rooms: [
        { id: "01", title: "РЕКЛАМИ",    detail: "Meta · Google · TikTok",       num: "4.8×",  label: "СРЕДЕН ROAS" },
        { id: "02", title: "СЪДЪРЖАНИЕ", detail: "UGC · AI · Live-action",       num: "200+",  label: "АСЕТА / МЕСЕЦ" },
        { id: "03", title: "САЙТОВЕ",    detail: "Landing · E-com · Портали",    num: "12",    label: "LAUNCH / ГОДИНА" },
        { id: "04", title: "СТРАТЕГИЯ",  detail: "Позициониране · Оферта · План", num: "50+",  label: "БРАНДА В ПОРТФЕЙЛА" },
      ],
      roomBadge: "СТАЯ №",
    },
    stage4: {
      eyebrow: "04 · СЪСТАВЪТ",
      headline1: "50+ БРАНДА В ПОРТФЕЙЛА.",
      headline2Prefix: "ИЗБРАН СЕГМЕНТ",
      headline2Highlight: "ТУК.",
      region: { BG: "БГ", US: "САЩ" },
      coda: "12 / 50+ · ОСТАНАЛИТЕ ПО ЗАЯВКА",
    },
    stage5: {
      eyebrow: "05 · СТАНДАРТЪТ",
      headline1: "ЧЕТИРИ ПРИНЦИПА",
      headline2Highlight: "НА КОИТО НЕ ПРАВИМ КОМПРОМИС.",
      note: "Ако някой от тях се сблъска с това, което искаш — не сме правилният екип.",
      principles: [
        {
          num: "01",
          title: "ЕДИН БРАНД НА НИША",
          body: "Не се състезаваме сами със себе си. Ако вече работим с бранд от твоята вертикала — препращаме.",
        },
        {
          num: "02",
          title: "ОТ РЕЗУЛТАТА, НАЗАД",
          body: "Първо: какво ще проследим. После: какво ще пуснем. Ако не можем да го измерим, не го правим.",
        },
        {
          num: "03",
          title: "AI-FIRST. HUMAN-FINAL.",
          body: "AI ускорява производството. Хората филтрират, обучават и защитават бранда.",
        },
        {
          num: "04",
          title: "ДАННИТЕ РЕШАВАТ. МНЕНИЯТА — НЕ.",
          body: "Приемаме тестове. Отхвърляме субективни спорове. Пазарът е арбитърът.",
        },
      ],
    },
    stage6: {
      eyebrow: "06 · QUALIFY · ТИ ЛИ СИ?",
      headlinePrefix: "ОТГОВАРЯШ ЛИ НА ВСИЧКИТЕ",
      headlineHighlight: "ЧЕТИРИ",
      headlineSuffix: "?",
      items: [
        "Правиш €100k+ годишен приход",
        "Готов си да инвестираш в система, не в единични асета",
        "Искаш партньор, не изпълнител",
        "Цениш занаята повече от gimmicks",
      ],
    },
    stage7: {
      eyebrow: "07 · АКО СИ СТИГНАЛ ДОТУК",
      headlinePrefix: "ТОГАВА Е ВРЕМЕ ЗА",
      headlineHighlight: "РАЗГОВОР.",
      cta: "ЗАПАЗИ РАЗГОВОР",
      location: "СОФИЯ, БЪЛГАРИЯ",
      guestbook: "// ГОСТ-КНИГА · ПРАВЕН СЪС ♥ В СОФИЯ · MMXXVI",
      portfolioLink: "← ВИЖ ПЪЛНО ПОРТФОЛИО",
    },
  },
  en: {
    marquee:
      "VEKTO GROWTH STUDIO ✦ ONE BRAND PER NICHE ✦ AI-CREATIVE PIPELINE ✦ ADS · CONTENT · SITES · STRATEGY ✦ 50+ PARTNERS IN BG + US ✦ 4.8× AVERAGE ROAS ✦ DATA DECIDES, OPINIONS DON'T ✦ EST. MMXXIV · SOFIA ✦",
    cta: "EMAIL US",
    nav: {
      studio: "STUDIO",
      langSwitch: "БГ",
    },
    stages: [
      { id: "01", label: "STUDIO" },
      { id: "02", label: "PROBLEM" },
      { id: "03", label: "FOCUS" },
      { id: "04", label: "ROSTER" },
      { id: "05", label: "STANDARD" },
      { id: "06", label: "QUALIFY" },
      { id: "07", label: "TALK" },
    ],
    stage1: {
      eyebrow: "01 · GROWTH STUDIO",
      pill: "SOFIA STUDIO · REPLY UNDER 24H",
      headline1: "WE BUILD GROWTH.",
      headline2Prefix: "NOT",
      headline2Highlight: "REPORTS.",
      typed: "YOU'RE IN THE FUNNEL.",
      scrollCue: "▼ SCROLL TO CONTINUE",
    },
    stage2: {
      eyebrow: "02 · WHY WE EXIST",
      quoteMain:
        "\"We invest seriously in advertising. But nobody can tell me exactly what comes back.\"",
      quoteAttribution: "— most brand owners, some point in year one",
      response: "If that sounds familiar —",
      responseHighlight: "friends.",
    },
    stage3: {
      eyebrow: "03 · FOUR ROOMS · ONE ROOF",
      rooms: [
        { id: "01", title: "ADS",        detail: "Meta · Google · TikTok",        num: "4.8×",  label: "AVERAGE ROAS" },
        { id: "02", title: "CONTENT",    detail: "UGC · AI · Live-action",        num: "200+",  label: "ASSETS / MONTH" },
        { id: "03", title: "WEBSITES",   detail: "Landing · E-com · Portals",     num: "12",    label: "LAUNCHES / YEAR" },
        { id: "04", title: "STRATEGY",   detail: "Positioning · Offer · Plan",    num: "50+",   label: "BRANDS IN PORTFOLIO" },
      ],
      roomBadge: "ROOM №",
    },
    stage4: {
      eyebrow: "04 · THE ROSTER",
      headline1: "50+ BRANDS ON OUR ROSTER.",
      headline2Prefix: "SELECTED CUT",
      headline2Highlight: "SHOWN.",
      region: { BG: "BG", US: "US" },
      coda: "12 / 50+ · REST ON REQUEST",
    },
    stage5: {
      eyebrow: "05 · THE STANDARD",
      headline1: "FOUR PRINCIPLES",
      headline2Highlight: "WE DON'T NEGOTIATE ON.",
      note: "If any of them collide with what you're after — we're probably not the right team.",
      principles: [
        {
          num: "01",
          title: "ONE BRAND PER NICHE",
          body: "We don't compete with ourselves. If we already work with a brand in your vertical — we refer.",
        },
        {
          num: "02",
          title: "FROM THE OUTCOME, BACKWARDS",
          body: "First: what will we measure. Then: what will we run. If we can't measure it, we don't do it.",
        },
        {
          num: "03",
          title: "AI-FIRST. HUMAN-FINAL.",
          body: "AI speeds production. Humans filter, coach and protect the brand.",
        },
        {
          num: "04",
          title: "DATA DECIDES. OPINIONS — DON'T.",
          body: "We accept tests. We reject subjective debate. The market is the arbiter.",
        },
      ],
    },
    stage6: {
      eyebrow: "06 · QUALIFY · IS THIS YOU?",
      headlinePrefix: "DO YOU MEET ALL",
      headlineHighlight: "FOUR",
      headlineSuffix: "?",
      items: [
        "You do €100k+ annual revenue",
        "You're ready to invest in a system, not one-off assets",
        "You want a partner, not a vendor",
        "You value craft over gimmicks",
      ],
    },
    stage7: {
      eyebrow: "07 · IF YOU'VE MADE IT THIS FAR",
      headlinePrefix: "THEN IT'S TIME FOR",
      headlineHighlight: "A CALL.",
      cta: "BOOK A CALL",
      location: "SOFIA, BULGARIA",
      guestbook: "// GUESTBOOK · MADE WITH ♥ IN SOFIA · MMXXVI",
      portfolioLink: "← SEE FULL PORTFOLIO",
    },
  },
};

// Brand roster with real logo files from /public/images/logo-*.
type Client = { name: string; region: "BG" | "US"; logo: string };
const ROSTER: Client[] = [
  { name: "MEN'S CARE",    region: "BG", logo: "/images/logo-menscare.png"     },
  { name: "DUSQ",          region: "US", logo: "/images/logo-dusq.webp"        },
  { name: "PARFEN",        region: "BG", logo: "/images/logo-parfen.webp"      },
  { name: "ISOSPORT",      region: "BG", logo: "/images/logo-isosport.webp"    },
  { name: "BIOTICA",       region: "BG", logo: "/images/logo-biotica.webp"     },
  { name: "BULTEX",        region: "BG", logo: "/images/logo-bultex.png"       },
  { name: "НЕДЕЛЯ",        region: "BG", logo: "/images/logo-nedelya.svg"      },
  { name: "ANOMALY",       region: "US", logo: "/images/logo-anomaly.webp"     },
  { name: "GOURMET HOUSE", region: "BG", logo: "/images/logo-gourmethouse.png" },
  { name: "ETHAN'S",       region: "US", logo: "/images/logo-ethans.webp"      },
  { name: "LUCKY ENERGY",  region: "US", logo: "/images/logo-lucky.webp"       },
  { name: "NUTRIFITT",     region: "US", logo: "/images/logo-nutrifitt.webp"   },
];

// ============================================================================
// HOOKS
// ============================================================================
function useLanguage(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>("bg");
  useEffect(() => {
    const saved = localStorage.getItem("vekto.lang");
    if (saved === "bg" || saved === "en") setLang(saved);
  }, []);
  const set = useCallback((l: Lang) => {
    setLang(l);
    try { localStorage.setItem("vekto.lang", l); } catch {}
  }, []);
  return [lang, set];
}

// Progress 0→1 across the whole time the section overlaps the viewport
// (top hits viewport bottom → bottom leaves viewport top).
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

// Progress 0→1 ONLY across the sticky-active window (from when the
// section top hits viewport top, to when the section bottom hits
// viewport bottom). Outside that window, returns 0 (before) or 1 (after).
// This is what we want for horizontal pans and slot fills inside sticky.
function useStickyProgress(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Sticky is active while rect.top ∈ [-(rect.height - vh), 0]
      const range = rect.height - vh;
      if (range <= 0) { setP(rect.top < 0 ? 1 : 0); return; }
      const scrolled = -rect.top;
      setP(Math.max(0, Math.min(1, scrolled / range)));
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
  const [lang, setLang] = useLanguage();
  const t = COPY[lang];

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
    <div
      className="relative"
      style={{
        background: "#ebe8e0",
        fontFamily: "var(--font-brutal-grotesk), system-ui, sans-serif",
        color: "#0d0d0d",
      }}
    >
      {/* ============= MARQUEE ============= */}
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
              ✦ {t.marquee}
            </span>
          ))}
        </div>
      </div>

      {/* ============= MASTHEAD ============= */}
      <div className="border-b-4 border-black" style={{ background: "#0d0d0d" }}>
        <div className="p-4 md:p-5 flex items-center justify-between gap-3">
          <div
            aria-label="VEKTO"
            className="h-9 md:h-12 w-[150px] md:w-[200px]"
            style={{
              background: WORDMARK_METAL,
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
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "bg" ? "en" : "bg")}
              className="px-3 py-2 font-bold uppercase text-xs tracking-[0.25em] transition-colors hover:bg-white hover:text-black"
              style={{
                background: "transparent",
                color: "#f4f4f4",
                border: "1.5px solid rgba(244,244,244,0.4)",
              }}
              aria-label="Switch language"
            >
              {t.nav.langSwitch}
            </button>

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
              ✉ {t.cta}
            </a>
          </div>
        </div>
      </div>

      {/* ============= NAV STRIP ============= */}
      <div className="border-b-2 border-black bg-white">
        <div className="flex flex-wrap items-center justify-between px-4 py-2 gap-2 text-[13px] md:text-sm font-bold uppercase tracking-[0.15em]">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {t.stages.map((s, i) => (
              <a
                key={s.id}
                href={`#stage-${s.id}`}
                className="hover:underline decoration-2 underline-offset-4 transition-opacity"
                style={{ opacity: stage === i ? 1 : 0.5 }}
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
            {t.nav.studio} ·
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
        {t.stages.map((s, i) => {
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

      <StageHook  targetRef={s1} t={t.stage1} />
      <StageTruth targetRef={s2} t={t.stage2} />
      <StageRooms targetRef={s3} t={t.stage3} />
      <StageCast  targetRef={s4} t={t.stage4} />
      <StageStandard targetRef={s5} t={t.stage5} />
      <StageQualify targetRef={s6} t={t.stage6} />
      <StageAsk   targetRef={s7} t={t.stage7} />

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
function StageHook({ targetRef, t }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage1"] }) {
  const p = useScrollProgress(targetRef);
  const inView = useInView(targetRef, 0.2);

  const graphemes = Array.from(t.typed);
  const typedCount = Math.floor(Math.max(0, Math.min(1, (p - 0.15) / 0.5)) * graphemes.length);
  const typed = graphemes.slice(0, typedCount).join("");

  return (
    <section
      id="stage-01"
      ref={targetRef}
      className="border-b-2 border-black relative flex flex-col"
      style={{ minHeight: "100vh", background: "#ebe8e0", overflow: "hidden" }}
    >
      {/* MAIN — centered vertically */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-14 pt-10 md:pt-14 pb-6 max-w-[1400px] mx-auto w-full">
        <div
          className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] mb-5 md:mb-6 opacity-60"
          style={{ fontFamily: "var(--font-brutal-pixel)" }}
        >
          {t.eyebrow}
        </div>

        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-8 md:mb-12 self-start"
          style={{
            background: "#0d0d0d",
            color: "#f4f4f4",
            border: "1.5px solid",
            borderImage: `${SILVER_H} 1`,
            boxShadow: "4px 4px 0 0 #0d0d0d",
          }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {t.pill}
        </div>

        {/* Two lines, each guaranteed to fit on ONE row via calibrated clamp.
            Max 88px so 'СТРОИМ РАСТЕЖ.' (14 char incl space + period) at
            ~48px avg-char stays under ~700px — fits in every desktop width.
            Bulgarian caps run slightly wider than Latin, so hard cap 88. */}
        <h1
          className="font-black tracking-[-0.03em]"
          style={{
            fontSize: "clamp(40px, 6.5vw, 88px)",
            lineHeight: 0.96,
          }}
        >
          <span className="block whitespace-nowrap">{t.headline1}</span>
          <span className="block whitespace-nowrap">
            {t.headline2Prefix}{" "}
            <span
              className="italic"
              style={{
                background: GRAPHITE_H,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.headline2Highlight}
            </span>
          </span>
        </h1>

        {/* Typewriter caption — sits close to the headline, small type */}
        <div
          className="mt-8 md:mt-12 flex items-center gap-3 font-bold uppercase text-sm md:text-base tracking-[0.2em]"
          style={{
            opacity: inView ? 0.85 : 0,
            transition: "opacity 400ms ease",
            minHeight: "1.4em",
          }}
        >
          <span className="inline-block h-[0.85em] w-[3px]" style={{ background: "#0d0d0d" }} />
          <span>{typed}</span>
          <span
            className="inline-block h-[0.85em] w-[8px] animate-pulse"
            style={{ background: "#0d0d0d" }}
          />
        </div>
      </div>

      {/* BOTTOM — scroll cue always pinned to viewport bottom */}
      <div
        className="px-6 md:px-14 pb-8 md:pb-12 max-w-[1400px] mx-auto w-full"
        style={{ opacity: 1 - p * 3, transition: "opacity 200ms ease" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em]"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            {t.scrollCue}
          </div>
          <div className="flex-1 h-[2px] max-w-32 border-t-2 border-dashed border-black" />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STAGE 02 · WHY WE EXIST (pull quote — no fake numbers)
// ============================================================================
function StageTruth({ targetRef, t }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage2"] }) {
  const inView = useInView(targetRef, 0.35);
  return (
    <section
      id="stage-02"
      ref={targetRef}
      className="border-b-2 border-black flex items-center"
      style={{ background: "#0d0d0d", color: "#f4f4f4", minHeight: "100vh" }}
    >
      <div className="px-6 md:px-14 py-24 md:py-40 max-w-[1400px] mx-auto w-full">
        <div
          className="text-xs font-bold uppercase tracking-[0.35em] mb-14 opacity-60"
          style={{ fontFamily: "var(--font-brutal-pixel)" }}
        >
          {t.eyebrow}
        </div>

        {/* Pull quote — the honest agitation */}
        <div
          className="border-l-4 pl-6 md:pl-14 max-w-5xl transition-all duration-700"
          style={{
            borderColor: "#8a8a8a",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-30px)",
          }}
        >
          <p
            className="font-black leading-[1.05] tracking-[-0.02em] mb-10"
            style={{ fontSize: "clamp(30px, 4.8vw, 72px)" }}
          >
            {t.quoteMain}
          </p>
          <p
            className="text-sm md:text-base uppercase tracking-[0.25em] opacity-70"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            {t.quoteAttribution}
          </p>
        </div>

        <div
          className="mt-16 md:mt-24 font-black uppercase tracking-tight leading-tight max-w-4xl transition-all duration-700 delay-300"
          style={{
            fontSize: "clamp(32px, 5vw, 68px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {t.response}{" "}
          <span
            className="italic"
            style={{
              background: SILVER_H,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.responseHighlight}
          </span>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STAGE 03 · FOUR ROOMS · sticky horizontal pan (progress now normalized)
// ============================================================================
function StageRooms({ targetRef, t }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage3"] }) {
  const p = useStickyProgress(targetRef);
  const translate = -300 * p;
  const currentRoom = Math.min(4, Math.floor(p * 4) + 1);

  return (
    <section
      id="stage-03"
      ref={targetRef}
      className="border-b-2 border-black relative"
      style={{ height: "400vh", background: "#d6d3ca" }}
    >
      <div className="sticky top-0 h-screen" style={{ overflowX: "clip" }}>
        <div className="absolute top-6 md:top-10 left-6 md:left-14 z-10">
          <div
            className="text-xs font-bold uppercase tracking-[0.35em] mb-2"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            {t.eyebrow}
          </div>
          <div
            className="inline-flex items-center gap-2 px-2 py-1 border-2 border-black text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ background: SILVER_H, boxShadow: "3px 3px 0 0 #0d0d0d" }}
          >
            {String(currentRoom).padStart(2, "0")} / 04
          </div>
        </div>

        <div className="absolute bottom-8 left-6 md:left-14 z-10 flex gap-2">
          {t.rooms.map((_, i) => {
            const active = i + 1 === currentRoom;
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

        <div
          className="flex h-full"
          style={{
            width: "400vw",
            transform: `translateX(${translate}vw)`,
            willChange: "transform",
          }}
        >
          {t.rooms.map((r) => (
            <div
              key={r.id}
              className="w-screen h-full flex-shrink-0 flex items-center justify-center px-6 md:px-16"
            >
              <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 w-full items-center">
                <div
                  className="border-2 border-black p-6 md:p-8"
                  style={{
                    background: "#ebe8e0",
                    boxShadow: "8px 8px 0 0 #0d0d0d",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="inline-block px-2 py-1 border-2 border-black text-[10px] font-bold uppercase tracking-[0.25em] mb-6"
                    style={{ background: SILVER_H }}
                  >
                    {t.roomBadge}{r.id}
                  </div>
                  <h3
                    className="font-black leading-[0.9] tracking-[-0.03em] mb-6"
                    style={{
                      fontSize: "clamp(32px, 5vw, 72px)",
                      wordBreak: "break-word",
                    }}
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
// STAGE 04 · ROSTER · brand + region only, no fabricated per-client stats
// ============================================================================
function StageCast({ targetRef, t }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage4"] }) {
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
          {t.eyebrow}
        </div>
        <h2
          className="font-black leading-[0.94] tracking-[-0.03em] uppercase mb-14"
          style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
        >
          {t.headline1}
          <br />
          {t.headline2Prefix}{" "}
          <span
            style={{
              background: SILVER_H,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.headline2Highlight}
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {ROSTER.map((c, i) => (
            <div
              key={c.name}
              className="border-2 border-white bg-white flex flex-col relative transition-all duration-700"
              style={{
                aspectRatio: "5/4",
                boxShadow: "5px 5px 0 0 #8a8a8a",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(18px)",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              {/* Region badge in top-right corner */}
              <span
                className="absolute top-1.5 right-1.5 border border-black bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] leading-none z-10"
                style={{ fontFamily: "var(--font-brutal-pixel)", color: "#0d0d0d" }}
              >
                {t.region[c.region]}
              </span>

              {/* Logo panel */}
              <div className="flex-1 flex items-center justify-center p-4 md:p-6 min-h-0">
                <Image
                  src={c.logo}
                  alt={c.name}
                  width={220}
                  height={110}
                  className="max-h-full max-w-full w-auto h-auto object-contain"
                  unoptimized
                />
              </div>

              {/* Name plate at bottom */}
              <div
                className="border-t-2 border-black px-2 py-2 text-center text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] leading-none"
                style={{ color: "#0d0d0d" }}
              >
                {c.name}
              </div>
            </div>
          ))}
        </div>

        {/* Coda under the grid */}
        <div
          className="mt-10 text-xs uppercase tracking-[0.25em] opacity-60"
          style={{ fontFamily: "var(--font-brutal-pixel)" }}
        >
          {t.coda}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STAGE 05 · THE STANDARD (replaces the fake "12 slots" scarcity)
// 4 principles fill in as scroll progresses through this section.
// ============================================================================
function StageStandard({ targetRef, t }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage5"] }) {
  const p = useStickyProgress(targetRef);
  // Reveal a principle every quarter of the sticky pan
  const revealed = Math.min(t.principles.length, Math.floor(p * (t.principles.length + 0.5)));

  return (
    <section
      id="stage-05"
      ref={targetRef}
      className="border-b-2 border-black relative"
      style={{ height: "280vh", background: "#ebe8e0" }}
    >
      <div className="sticky top-0 h-screen flex items-center px-6 md:px-14">
        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10 items-start">
          {/* Left column — anchored headline */}
          <div className="md:col-span-5 md:sticky md:top-40">
            <div
              className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60"
              style={{ fontFamily: "var(--font-brutal-pixel)" }}
            >
              {t.eyebrow}
            </div>
            <h2
              className="font-black leading-[0.92] tracking-[-0.03em] uppercase mb-6"
              style={{ fontSize: "clamp(34px, 5vw, 76px)" }}
            >
              {t.headline1}
              <br />
              <span
                style={{
                  background: GRAPHITE_H,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.headline2Highlight}
              </span>
            </h2>
            <p
              className="text-sm md:text-base leading-[1.55] max-w-md opacity-75 font-medium"
              style={{ fontFamily: "var(--font-brutal-comic)" }}
            >
              {t.note}
            </p>
            <div className="mt-8 flex gap-2">
              {t.principles.map((_, i) => (
                <span
                  key={i}
                  className="h-[3px] border-2 border-black transition-all"
                  style={{
                    width: i < revealed ? 40 : 14,
                    background: i < revealed ? GRAPHITE_H : "transparent",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right column — principle stack */}
          <div className="md:col-span-7 space-y-4 md:space-y-6">
            {t.principles.map((pr, i) => {
              const done = i < revealed;
              return (
                <div
                  key={pr.num}
                  className="border-2 border-black p-5 md:p-7 transition-all duration-500"
                  style={{
                    background: done ? "#ebe8e0" : "transparent",
                    boxShadow: done ? "6px 6px 0 0 #0d0d0d" : "none",
                    opacity: done ? 1 : 0.35,
                    transform: done ? "translateY(0)" : "translateY(10px)",
                  }}
                >
                  <div className="flex items-baseline gap-4 md:gap-6">
                    <div
                      className="text-3xl md:text-5xl font-black tabular-nums flex-shrink-0"
                      style={{
                        background: done ? GRAPHITE_H : "transparent",
                        color: done ? "transparent" : "#0d0d0d",
                        WebkitBackgroundClip: done ? "text" : "initial",
                        WebkitTextFillColor: done ? "transparent" : "initial",
                        backgroundClip: done ? "text" : "initial",
                      }}
                    >
                      {pr.num}
                    </div>
                    <div>
                      <h3 className="font-black text-lg md:text-2xl uppercase tracking-tight leading-tight mb-2">
                        {pr.title}
                      </h3>
                      <p
                        className="text-sm md:text-base leading-[1.55] font-medium opacity-85"
                        style={{ fontFamily: "var(--font-brutal-comic)" }}
                      >
                        {pr.body}
                      </p>
                    </div>
                  </div>
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
function StageQualify({ targetRef, t }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage6"] }) {
  const p = useScrollProgress(targetRef);
  const checked = Math.min(t.items.length, Math.floor(p * t.items.length * 1.7));
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
          {t.eyebrow}
        </div>
        <h2
          className="font-black leading-[0.94] tracking-[-0.03em] uppercase mb-14 max-w-4xl"
          style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
        >
          {t.headlinePrefix}{" "}
          <span
            style={{
              background: GRAPHITE_H,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.headlineHighlight}
          </span>
          {t.headlineSuffix}
        </h2>

        <ul className="space-y-5 md:space-y-7 max-w-4xl">
          {t.items.map((q, i) => {
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
                <span className="text-lg md:text-2xl leading-[1.35] font-bold uppercase">
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
function StageAsk({ targetRef, t }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage7"] }) {
  const inView = useInView(targetRef, 0.35);
  return (
    <section
      id="stage-07"
      ref={targetRef}
      className="relative"
      style={{ background: "#0d0d0d", color: "#f4f4f4", minHeight: "100vh" }}
    >
      <div className="px-6 md:px-14 py-24 md:py-40 max-w-[1400px] mx-auto text-center relative">
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
            {t.eyebrow}
          </div>
          <h2
            className="font-black leading-[0.9] tracking-[-0.03em] uppercase mb-16"
            style={{ fontSize: "clamp(48px, 8vw, 128px)" }}
          >
            {t.headlinePrefix}{" "}
            <span
              className="italic"
              style={{
                background: SILVER_H,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.headlineHighlight}
            </span>
          </h2>

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
              {t.cta}
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
            <span>{t.location}</span>
          </div>

          <div
            className="mt-24 text-[10px] tracking-[0.2em] opacity-40 border-t-2 border-dashed border-white/40 pt-4 max-w-3xl mx-auto uppercase"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            {t.guestbook}
          </div>

          <Link
            href="/portfolio"
            className="mt-6 inline-block text-[10px] uppercase tracking-[0.3em] opacity-50 hover:opacity-100 underline decoration-2 underline-offset-4"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            {t.portfolioLink}
          </Link>
        </div>
      </div>
    </section>
  );
}
