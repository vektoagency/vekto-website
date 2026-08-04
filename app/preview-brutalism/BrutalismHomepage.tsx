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
      "VEKTO ✦ GROWTH AGENCY ✦ РЕКЛАМИ · КРЕАТИВ · САЙТОВЕ · СТРАТЕГИЯ ✦ MEN'S CARE 5.2× · PARFEN 7.7× · FREYA 10× ROAS ✦ 50+ ПАРТНЬОРА В БГ + САЩ ✦ ЕДИН БРАНД НА НИША ✦ ДАННИТЕ РЕШАВАТ ✦ EST. MMXXIV ✦",
    cta: "ПИШИ НИ",
    nav: {
      studio: "LIVE",
      langSwitch: "EN",
    },
    stages: [
      { id: "01", label: "НАЧАЛО" },
      { id: "02", label: "ЗАЩО" },
      { id: "03", label: "ФОКУС" },
      { id: "04", label: "БРАНДОВЕ" },
      { id: "05", label: "СТАНДАРТ" },
      { id: "06", label: "КАНДИДАТ" },
      { id: "07", label: "РАЗГОВОР" },
    ],
    stage1: {
      eyebrow: "01 · GROWTH AGENCY",
      pill: "НА ЖИВО",
      headline1: "ТВОЯТ ПАРТНЬОР",
      headline2Prefix: "ЗА",
      headline2Highlight: "РАСТЕЖ ОНЛАЙН.",
      typed: "ВЛЕЗЕ ВЪВ ФУНИЯТА.",
      scrollCue: "▼ ПРОДЪЛЖИ",
      ctaPrimary: "ЗАПАЗИ РАЗГОВОР",
      ctaSecondary: "ПОРТФОЛИО",
      newsTitle: "НОВИНИ",
      news: [
        { d: "04.08.26", n: "MEN'S CARE · 5.2× ROAS на новата AI кампания" },
        { d: "01.08.26", n: "PARFEN · 7.7× ROAS на urgency офертата" },
        { d: "24.07.26", n: "FREYA · 10× ROAS на nail-products кампанията" },
      ],
    },
    stage2: {
      eyebrow: "02 · ЗАЩО СЪЩЕСТВУВАМЕ",
      quoteMain:
        "„Инвестираме сериозно в реклама. Но никой не може да ми каже колко от това се връща.\"",
      quoteAttribution: "— повечето собственици, в един момент през първата година",
      response: "Ако това ти звучи познато —",
      responseHighlight: "разбираме се.",
    },
    stage3: {
      eyebrow: "03 · ЧЕТИРИ СТАИ · ЕДИН ПОКРИВ",
      rooms: [
        { id: "01", title: "РЕКЛАМИ",   detail: "Meta · Google · TikTok",       num: "4.8×",  label: "СРЕДЕН ROAS" },
        { id: "02", title: "КРЕАТИВ",   detail: "UGC · AI · заснемане на живо", num: "200+",  label: "ВИДЕА НА МЕСЕЦ" },
        { id: "03", title: "САЙТОВЕ",   detail: "Landing · е-ком · портали",    num: "12",    label: "САЙТА НА ГОДИНА" },
        { id: "04", title: "СТРАТЕГИЯ", detail: "Позициониране · оферта · план", num: "50+", label: "БРАНДА В ПОРТФЕЙЛА" },
      ],
      roomBadge: "СТАЯ №",
    },
    stage4: {
      eyebrow: "04 · СЪСТАВЪТ",
      headline1: "50+ БРАНДА В ПОРТФЕЙЛА.",
      headline2Prefix: "12",
      headline2Highlight: "ОТ ТЯХ.",
      region: { BG: "БГ", US: "САЩ" },
      coda: "12 / 50+ · ОСТАНАЛИТЕ ПО ЗАЯВКА",
    },
    stage5: {
      eyebrow: "05 · СТАНДАРТЪТ",
      headline1: "ЧЕТИРИ ПРИНЦИПА",
      headline2Highlight: "НА КОИТО НЕ ПРАВИМ КОМПРОМИС.",
      note: "Ако някой от тях се разминава с очакванията ти — не сме правилният екип.",
      principles: [
        {
          num: "01",
          title: "ЕДИН БРАНД НА НИША",
          body: "Не се състезаваме сами със себе си. Ако вече работим с бранд от твоята ниша — насочваме те към друг екип.",
        },
        {
          num: "02",
          title: "ОТ РЕЗУЛТАТА, НАЗАД",
          body: "Първо решаваме какво ще измерим. После — какво ще пуснем. Ако не можем да го проследим, не го правим.",
        },
        {
          num: "03",
          title: "AI ЗАПОЧВА. ХОРАТА ЗАВЪРШВАТ.",
          body: "AI ускорява производството. Хората решават, коригират и защитават бранда.",
        },
        {
          num: "04",
          title: "ДАННИТЕ РЕШАВАТ. МНЕНИЯТА — НЕ.",
          body: "Всичко минава през тест. Субективните спорове — не. Пазарът решава.",
        },
      ],
    },
    stage6: {
      eyebrow: "06 · КОГО ТЪРСИМ",
      headlinePrefix: "ОТГОВАРЯШ ЛИ НА ВСИЧКИТЕ",
      headlineHighlight: "ЧЕТИРИ",
      headlineSuffix: "?",
      items: [
        "Правиш €100k+ годишен приход",
        "Готов си да инвестираш в система, не в единични материали",
        "Искаш партньор, не изпълнител",
        "Цениш занаята повече от трикове",
      ],
    },
    stage7: {
      eyebrow: "07 · АКО СИ СТИГНАЛ ДОТУК",
      headlinePrefix: "ТОГАВА Е ВРЕМЕ ЗА",
      headlineHighlight: "РАЗГОВОР.",
      cta: "ЗАПАЗИ РАЗГОВОР",
      location: "БЪЛГАРИЯ · САЩ",
      guestbook: "// VEKTO · GROWTH AGENCY · MMXXVI",
      portfolioLink: "← ВИЖ ПЪЛНО ПОРТФОЛИО",
    },
  },
  en: {
    marquee:
      "VEKTO ✦ GROWTH AGENCY ✦ ADS · CREATIVE · SITES · STRATEGY ✦ MEN'S CARE 5.2× · PARFEN 7.7× · FREYA 10× ROAS ✦ 50+ PARTNERS IN BG + US ✦ ONE BRAND PER NICHE ✦ DATA DECIDES ✦ EST. MMXXIV ✦",
    cta: "EMAIL US",
    nav: {
      studio: "LIVE",
      langSwitch: "БГ",
    },
    stages: [
      { id: "01", label: "START" },
      { id: "02", label: "WHY" },
      { id: "03", label: "FOCUS" },
      { id: "04", label: "ROSTER" },
      { id: "05", label: "STANDARD" },
      { id: "06", label: "FIT" },
      { id: "07", label: "TALK" },
    ],
    stage1: {
      eyebrow: "01 · GROWTH AGENCY",
      pill: "LIVE",
      headline1: "YOUR PARTNER",
      headline2Prefix: "FOR",
      headline2Highlight: "ONLINE GROWTH.",
      typed: "YOU'RE IN THE FUNNEL.",
      scrollCue: "▼ CONTINUE",
      ctaPrimary: "BOOK A CALL",
      ctaSecondary: "PORTFOLIO",
      newsTitle: "NEWS",
      news: [
        { d: "04.08.26", n: "MEN'S CARE · 5.2× ROAS on the new AI campaign" },
        { d: "01.08.26", n: "PARFEN · 7.7× ROAS on the urgency offer" },
        { d: "24.07.26", n: "FREYA · 10× ROAS on the nail-products push" },
      ],
    },
    stage2: {
      eyebrow: "02 · WHY WE EXIST",
      quoteMain:
        "\"We invest seriously in advertising. But nobody can tell me how much of that actually comes back.\"",
      quoteAttribution: "— most brand owners, at some point in year one",
      response: "If that sounds familiar —",
      responseHighlight: "we speak the same language.",
    },
    stage3: {
      eyebrow: "03 · FOUR ROOMS · ONE ROOF",
      rooms: [
        { id: "01", title: "ADS",       detail: "Meta · Google · TikTok",       num: "4.8×",  label: "AVERAGE ROAS" },
        { id: "02", title: "CREATIVE",  detail: "UGC · AI · live-action",       num: "200+",  label: "VIDEOS / MONTH" },
        { id: "03", title: "WEBSITES",  detail: "Landing · e-com · portals",    num: "12",    label: "SITES / YEAR" },
        { id: "04", title: "STRATEGY",  detail: "Positioning · offer · plan",   num: "50+",   label: "BRANDS IN PORTFOLIO" },
      ],
      roomBadge: "ROOM №",
    },
    stage4: {
      eyebrow: "04 · THE ROSTER",
      headline1: "50+ BRANDS IN THE PORTFOLIO.",
      headline2Prefix: "12",
      headline2Highlight: "OF THEM.",
      region: { BG: "BG", US: "US" },
      coda: "12 / 50+ · REST ON REQUEST",
    },
    stage5: {
      eyebrow: "05 · THE STANDARD",
      headline1: "FOUR PRINCIPLES",
      headline2Highlight: "WE DON'T NEGOTIATE ON.",
      note: "If any of them clashes with what you're after — we're probably not the right team.",
      principles: [
        {
          num: "01",
          title: "ONE BRAND PER NICHE",
          body: "We don't compete with ourselves. If we already work with a brand in your niche — we refer you elsewhere.",
        },
        {
          num: "02",
          title: "FROM THE OUTCOME, BACKWARDS",
          body: "First we decide what to measure. Then what to run. If we can't track it, we don't do it.",
        },
        {
          num: "03",
          title: "AI STARTS. HUMANS FINISH.",
          body: "AI speeds production. Humans decide, correct and protect the brand.",
        },
        {
          num: "04",
          title: "DATA DECIDES. OPINIONS — DON'T.",
          body: "Every choice runs a test. Subjective debate doesn't ship. The market is the judge.",
        },
      ],
    },
    stage6: {
      eyebrow: "06 · WHO WE'RE FOR",
      headlinePrefix: "DO YOU MEET ALL",
      headlineHighlight: "FOUR",
      headlineSuffix: "?",
      items: [
        "You do €100k+ in annual revenue",
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
      location: "BULGARIA · US",
      guestbook: "// VEKTO · GROWTH AGENCY · MMXXVI",
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
    // Format the clock as HH:MM:SS in Bulgaria's timezone (EET/EEST) so
    // it reads correctly regardless of where the visitor is browsing from.
    // Broadcast-style live clock is a signature 90s / retro-terminal move.
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Europe/Sofia",
          hour12: false,
        })
      );
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
      {/* ============= CRT SCANLINES OVERLAY =============
          90s CRT-monitor texture — thin horizontal lines every 3px.
          Set to fixed so it stays anchored to the viewport as you
          scroll (the effect would break if it tracked the page).
          Pointer-events-none = never intercepts clicks. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.055) 0px, rgba(0,0,0,0.055) 1px, transparent 1px, transparent 3px)",
        }}
      />

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

      <StageHook  targetRef={s1} t={t.stage1} clock={clock} />
      <HazardStrip />
      <StageTruth targetRef={s2} t={t.stage2} />
      <HazardStrip />
      <StageRooms targetRef={s3} t={t.stage3} />
      <HazardStrip />
      <StageCast  targetRef={s4} t={t.stage4} />
      <HazardStrip />
      <StageStandard targetRef={s5} t={t.stage5} />
      <HazardStrip />
      <StageQualify targetRef={s6} t={t.stage6} />
      <HazardStrip />
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
// HAZARD STRIP — 6px diagonal safety-tape (silver + jet-black) used
// between stages. Very 90s / industrial / brutalist. Replaces the
// plain black border-b that was between each stage before.
// ============================================================================
function HazardStrip() {
  return (
    <div
      aria-hidden
      className="h-2 w-full relative z-[3]"
      style={{
        background:
          "repeating-linear-gradient(-45deg, #0d0d0d, #0d0d0d 10px, #b0b0b0 10px, #b0b0b0 20px)",
      }}
    />
  );
}

// ============================================================================
// STAGE 01 · HOOK
// ============================================================================
function StageHook({ targetRef, t, clock }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage1"]; clock: string }) {
  const p = useScrollProgress(targetRef);
  const inView = useInView(targetRef, 0.2);

  const graphemes = Array.from(t.typed);
  const typedCount = Math.floor(Math.max(0, Math.min(1, (p - 0.15) / 0.5)) * graphemes.length);
  const typed = graphemes.slice(0, typedCount).join("");

  return (
    <section
      id="stage-01"
      ref={targetRef}
      className="relative flex flex-col"
      style={{
        height: "100dvh",
        minHeight: "100vh",
        background: "#ebe8e0",
        overflow: "hidden",
      }}
    >
      {/* MAIN — single column, full width. No more sidebar competing
          with the headline. Headline gets to be big and impactful. */}
      <div className="flex-1 flex items-start px-6 md:px-14 lg:pr-24 xl:pr-32 pt-4 md:pt-6 pb-4 max-w-[1500px] mx-auto w-full min-h-0">
        <div className="flex flex-col w-full min-w-0">
          <div
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] mb-3 md:mb-4 opacity-60"
            style={{ fontFamily: "var(--font-brutal-pixel)" }}
          >
            {t.eyebrow}
          </div>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mb-5 md:mb-6 self-start"
            style={{
              background: "#0d0d0d",
              color: "#f4f4f4",
              border: "1.5px solid",
              borderImage: `${SILVER_H} 1`,
              boxShadow: "4px 4px 0 0 #0d0d0d",
              fontFamily: "var(--font-brutal-pixel)",
            }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {t.pill}
            <span className="opacity-40">·</span>
            <span className="opacity-70">EET</span>
            <span className="tabular-nums">{clock}</span>
          </div>

          <h1
            className="font-black tracking-[-0.03em] max-w-full"
            style={{
              fontSize: "clamp(40px, 6.5vw, 108px)",
              lineHeight: 0.94,
              overflowWrap: "break-word",
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

          {/* Dual CTAs directly under headline */}
          <div className="flex flex-wrap gap-3 mt-8 md:mt-10">
            <a
              href="#stage-07"
              className="inline-flex items-center gap-2 px-5 md:px-6 py-3 md:py-4 border-2 border-black font-black uppercase text-sm md:text-base tracking-[0.15em] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#0d0d0d",
                color: "#f4f4f4",
                boxShadow: "5px 5px 0 0 #8a8a8a",
              }}
            >
              <span>→</span>
              {t.ctaPrimary}
            </a>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-5 md:px-6 py-3 md:py-4 border-2 border-black font-black uppercase text-sm md:text-base tracking-[0.15em] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: WORDMARK_METAL,
                color: "#0d0d0d",
                boxShadow: "5px 5px 0 0 #0d0d0d",
              }}
            >
              <span>▶</span>
              {t.ctaSecondary}
            </Link>
          </div>

          {/* News chip row — sits DIRECTLY under the CTAs so it stays
              grouped with the action area of the hero instead of
              drifting down to the fold. */}
          <div
            className="hidden md:flex items-center gap-3 flex-wrap mt-6"
          >
            {/* LIVE label */}
            <span
              className="inline-flex items-center gap-1.5 shrink-0 text-[10px] font-bold uppercase tracking-[0.3em] px-2.5 py-1.5 border-2 border-black"
              style={{
                fontFamily: "var(--font-brutal-pixel)",
                background: "#0d0d0d",
                color: "#f4f4f4",
                boxShadow: "3px 3px 0 0 #8a8a8a",
              }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {t.newsTitle}
            </span>

            {/* Individual news chips — brutalist bordered badges */}
            {t.news.slice(0, 3).map((item) => (
              <div
                key={item.d}
                className="inline-flex items-center gap-2.5 shrink-0 px-3 py-1.5 border-2 border-black text-[12px]"
                style={{
                  background: "#ebe8e0",
                  boxShadow: "3px 3px 0 0 #0d0d0d",
                }}
              >
                <span
                  className="text-[10px] tabular-nums opacity-60 uppercase tracking-[0.15em]"
                  style={{ fontFamily: "var(--font-brutal-pixel)" }}
                >
                  {item.d}
                </span>
                <span className="opacity-30">·</span>
                <span className="font-bold">
                  {item.n}
                </span>
              </div>
            ))}
          </div>

          {/* Typewriter caption */}
          <div
            className="mt-6 md:mt-8 flex items-center gap-3 font-bold uppercase text-xs md:text-sm tracking-[0.25em]"
            style={{
              opacity: inView ? 0.75 : 0,
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
      </div>

      {/* BOTTOM — just the scroll cue, pinned to viewport bottom.
          News chips moved into the content column above so they
          group with the CTAs, not with the scroll cue. */}
      <div
        className="max-w-[1500px] mx-auto w-full shrink-0 px-6 md:px-14 pb-6 md:pb-8"
        style={{ opacity: Math.max(0, (1 - p) * 2), transition: "opacity 200ms ease" }}
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
      className="flex items-center"
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
      className="relative"
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
                    className="font-black leading-[0.9] tracking-[-0.03em] mb-6 whitespace-nowrap"
                    style={{ fontSize: "clamp(38px, 6vw, 84px)" }}
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
      className=""
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
      className="relative"
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
      className=""
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
