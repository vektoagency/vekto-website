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
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { sendContactEmail } from "../actions/contact";

// three.js is ~150KB gzipped — an order of magnitude more than the rest of
// this page. Loading it dynamically with ssr:false keeps it out of the
// initial bundle and off the server render entirely, so the headline and
// CTAs paint without waiting on it. The globe simply appears when ready.
const Globe = dynamic(() => import("./Globe"), { ssr: false });

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
// GRAPHITE_H_IN — same chrome, but the sweep resolves DARK instead of
// mid-grey. Used on terminal words: the symmetric ramp above puts a
// #6d6d6d highlight under the closing syllables, which on the hero
// headline meant the payoff word was the faintest thing on the page.
const GRAPHITE_H_IN =
  "linear-gradient(90deg, #6d6d6d 0%, #2a2a2a 30%, #5a5a5a 58%, #232323 100%)";

// ============================================================================
// REEL FRAMES — hero contact sheet.
// Real posters already shipped for the site's showreel, so the hero shows
// actual delivered work rather than another typographic slab. Captions live
// in COPY per-language and describe only what the frame demonstrably is;
// they never attach a client name or a metric to a frame.
// ============================================================================
const REEL_FRAMES = [
  { src: "/images/posters/hero/video-5s.webp" }, // creator / talking head
  { src: "/images/posters/hero/video-2s.webp" }, // product macro
  { src: "/images/posters/hero/video-7s.webp" }, // aerial / location
] as const;

// ============================================================================
// COPY (bg + en). Brand names stay Latin in both languages.
// ============================================================================
type Lang = "bg" | "en";

const COPY = {
  bg: {
    cta: "ПИШИ НИ",
    nav: {
      langSwitch: "EN",
    },
    stages: [
      { id: "01", label: "НАЧАЛО" },
      { id: "02", label: "ЗАЩО" },
      { id: "03", label: "ФОКУС" },
      { id: "04", label: "КЕЙСОВЕ" },
      { id: "05", label: "БРАНДОВЕ" },
      { id: "06", label: "ПРОЦЕС" },
      { id: "07", label: "СТАНДАРТ" },
      { id: "08", label: "КАНДИДАТ" },
      { id: "09", label: "РАЗГОВОР" },
    ],
    stage1: {
      eyebrow: "01 · VEKTO · EST. MMXXIV",
      pill: "AI GROWTH AGENCY · БЪЛГАРИЯ · САЩ",
      headline1: "ТВОЯТ ПАРТНЬОР",
      headline2Prefix: "ЗА",
      headline2Highlight: "РАСТЕЖ ОНЛАЙН.",
      typed: "ЕДИН ЕКИП. РЕКЛАМИ, КРЕАТИВ, САЙТ.",
      scrollCue: "▼ ПРОДЪЛЖИ",
      ctaPrimary: "ЗАПАЗИ РАЗГОВОР",
      ctaSecondary: "ПОРТФОЛИО",
      proofTitle: "ROAS",
      proof: [
        { metric: "5.2×", brand: "MEN'S CARE" },
        { metric: "7.7×", brand: "PARFEN" },
        { metric: "10×",  brand: "FREYA" },
      ],
      globeTitle: "ОБХВАТ",
      globeBg: "БЪЛГАРИЯ",
      globeUs: "САЩ",
      globeNote: "БРАНДА В ПОРТФЕЙЛА",
      globeLink: "ВИЖ ГИ",
      sheetTitle: "ОТ РОЛКАТА",
      sheetNote: "9:16 · ЗА REELS / TIKTOK",
      sheetCaptions: ["КРЕАТОР", "ПРОДУКТ", "ЛОКАЦИЯ"],
      sheetAlt: [
        "Кадър от рекламно видео — креатор говори пред камера",
        "Кадър от рекламно видео — макро план на продукт",
        "Кадър от рекламно видео — въздушна снимка на локация",
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
    stageCases: {
      eyebrow: "04 · КЕЙСОВЕ · РЕАЛНИ РЕЗУЛТАТИ",
      headline1: "ОТ РЕКЛАМЕН БЮДЖЕТ",
      headline2Prefix: "КЪМ",
      headline2Highlight: "РАСТЕЖ.",
      note: "Три реални case-а. Всеки — с реален метрик, реален бюджет, реален период.",
      cases: [
        {
          brand: "MEN'S CARE",
          category: "Beauty · BG",
          metric: "5.2×",
          metricLabel: "ROAS · AI КАМПАНИЯ",
          duration: "90 ДНИ",
          highlight: "AI-generated UGC pipeline замести €12k/месец външна продукция без загуба на качество.",
        },
        {
          brand: "PARFEN",
          category: "Perfume · BG",
          metric: "7.7×",
          metricLabel: "ROAS · URGENCY ОФЕРТА",
          duration: "60 ДНИ",
          highlight: "Static banner с urgency copy победи video creative в 4 от 5 паралелни теста.",
        },
        {
          brand: "FREYA NAILS",
          category: "E-com · BG",
          metric: "10×",
          metricLabel: "ROAS · NAIL PRODUCTS",
          duration: "120 ДНИ",
          highlight: "Low-CAC funnel + retargeting stack. Fragmented account-структура преработена в един pipeline.",
        },
      ],
    },
    stageProcess: {
      eyebrow: "06 · КАК СЕ СЛУЧВА",
      headline1: "ОТ ПЪРВИЯ РАЗГОВОР",
      headline2Prefix: "ДО",
      headline2Highlight: "РАСТЕЖ.",
      note: "Стандартен path за всеки нов бранд. Клиничен, не корпоративен.",
      steps: [
        {
          num: "01",
          title: "ЗАПОЗНАВАНЕ",
          duration: "30 МИНУТИ · БЕЗПЛАТНО",
          body: "Разговор за бранда, целите, ситуацията. Проверяваме дали сме fit — от двете страни.",
        },
        {
          num: "02",
          title: "DIAGNOSTIC SPRINT",
          duration: "2 СЕДМИЦИ",
          body: "Audit на текущи канали, positioning, offer, tracking. Излизаш с конкретен 90-дневен план.",
        },
        {
          num: "03",
          title: "SETUP PHASE",
          duration: "30 ДНИ",
          body: "Изграждаме stack-а: стратегия, creative, funnel, tracking, инфраструктура. Launch-ready.",
        },
        {
          num: "04",
          title: "LAUNCH & SCALE",
          duration: "МЕСЕЦ 2 →",
          body: "Активни кампании, ежедневна оптимизация, месечни deep-dives, скалиране на печелившите тестове.",
        },
      ],
    },
    stage4: {
      eyebrow: "05 · СЪСТАВЪТ",
      headline1: "50+ БРАНДА В ПОРТФЕЙЛА.",
      headline2Prefix: "12",
      headline2Highlight: "ОТ ТЯХ.",
      region: { BG: "БГ", US: "САЩ" },
      coda: "12 / 50+ · ОСТАНАЛИТЕ ПО ЗАЯВКА",
    },
    stage5: {
      eyebrow: "07 · СТАНДАРТЪТ",
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
      eyebrow: "08 · КОГО ТЪРСИМ",
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
      eyebrow: "09 · АКО СИ СТИГНАЛ ДОТУК",
      headlinePrefix: "ТОГАВА Е ВРЕМЕ ЗА",
      headlineHighlight: "РАЗГОВОР.",
      cta: "ЗАПАЗИ РАЗГОВОР",
      location: "БЪЛГАРИЯ · САЩ",
      guestbook: "// VEKTO · GROWTH AGENCY · MMXXVI",
      portfolioLink: "← ВИЖ ПЪЛНО ПОРТФОЛИО",
    },
  },
  en: {
    cta: "EMAIL US",
    nav: {
      langSwitch: "БГ",
    },
    stages: [
      { id: "01", label: "START" },
      { id: "02", label: "WHY" },
      { id: "03", label: "FOCUS" },
      { id: "04", label: "CASES" },
      { id: "05", label: "ROSTER" },
      { id: "06", label: "PROCESS" },
      { id: "07", label: "STANDARD" },
      { id: "08", label: "FIT" },
      { id: "09", label: "TALK" },
    ],
    stage1: {
      eyebrow: "01 · VEKTO · EST. MMXXIV",
      pill: "AI GROWTH AGENCY · BULGARIA · USA",
      headline1: "YOUR PARTNER",
      headline2Prefix: "FOR",
      headline2Highlight: "ONLINE GROWTH.",
      typed: "ONE TEAM. ADS, CREATIVE, SITE.",
      scrollCue: "▼ CONTINUE",
      ctaPrimary: "BOOK A CALL",
      ctaSecondary: "PORTFOLIO",
      proofTitle: "ROAS",
      proof: [
        { metric: "5.2×", brand: "MEN'S CARE" },
        { metric: "7.7×", brand: "PARFEN" },
        { metric: "10×",  brand: "FREYA" },
      ],
      globeTitle: "REACH",
      globeBg: "BULGARIA",
      globeUs: "USA",
      globeNote: "BRANDS ON THE ROSTER",
      globeLink: "SEE THEM",
      sheetTitle: "FROM THE REEL",
      sheetNote: "9:16 · FOR REELS / TIKTOK",
      sheetCaptions: ["CREATOR", "PRODUCT", "LOCATION"],
      sheetAlt: [
        "Frame from an ad video — creator speaking to camera",
        "Frame from an ad video — macro shot of a product",
        "Frame from an ad video — aerial shot of a location",
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
    stageCases: {
      eyebrow: "04 · CASES · REAL RESULTS",
      headline1: "FROM AD BUDGET",
      headline2Prefix: "TO",
      headline2Highlight: "GROWTH.",
      note: "Three real cases. Each with a real metric, real budget, real period.",
      cases: [
        {
          brand: "MEN'S CARE",
          category: "Beauty · BG",
          metric: "5.2×",
          metricLabel: "ROAS · AI CAMPAIGN",
          duration: "90 DAYS",
          highlight: "AI-generated UGC pipeline replaced €12k/mo of external production with no quality loss.",
        },
        {
          brand: "PARFEN",
          category: "Perfume · BG",
          metric: "7.7×",
          metricLabel: "ROAS · URGENCY OFFER",
          duration: "60 DAYS",
          highlight: "Static banner with urgency copy beat video creative in 4 out of 5 parallel tests.",
        },
        {
          brand: "FREYA NAILS",
          category: "E-com · BG",
          metric: "10×",
          metricLabel: "ROAS · NAIL PRODUCTS",
          duration: "120 DAYS",
          highlight: "Low-CAC funnel + retargeting stack. Fragmented account structure rebuilt into one pipeline.",
        },
      ],
    },
    stageProcess: {
      eyebrow: "06 · HOW IT UNFOLDS",
      headline1: "FROM FIRST CALL",
      headline2Prefix: "TO",
      headline2Highlight: "GROWTH.",
      note: "Standard path for every new brand. Clinical, not corporate.",
      steps: [
        {
          num: "01",
          title: "DISCOVERY CALL",
          duration: "30 MIN · FREE",
          body: "Conversation about the brand, goals, situation. We check if we're a fit — from both sides.",
        },
        {
          num: "02",
          title: "DIAGNOSTIC SPRINT",
          duration: "2 WEEKS",
          body: "Audit of current channels, positioning, offer, tracking. You leave with a concrete 90-day plan.",
        },
        {
          num: "03",
          title: "SETUP PHASE",
          duration: "30 DAYS",
          body: "We build the stack: strategy, creative, funnel, tracking, infrastructure. Launch-ready.",
        },
        {
          num: "04",
          title: "LAUNCH & SCALE",
          duration: "MONTH 2 →",
          body: "Live campaigns, daily optimization, monthly deep-dives, scaling winning tests.",
        },
      ],
    },
    stage4: {
      eyebrow: "05 · THE ROSTER",
      headline1: "50+ BRANDS IN THE PORTFOLIO.",
      headline2Prefix: "12",
      headline2Highlight: "OF THEM.",
      region: { BG: "BG", US: "US" },
      coda: "12 / 50+ · REST ON REQUEST",
    },
    stage5: {
      eyebrow: "07 · THE STANDARD",
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
      eyebrow: "08 · WHO WE'RE FOR",
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
      eyebrow: "09 · IF YOU'VE MADE IT THIS FAR",
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

// Derived from ROSTER rather than typed out, so the globe readout can never
// disagree with the logo grid on stage 05.
const BG_COUNT = ROSTER.filter((c) => c.region === "BG").length;
const US_COUNT = ROSTER.filter((c) => c.region === "US").length;

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

// True when the visitor has asked the OS to reduce motion. Every timed
// reveal on this page checks it: the page is animation-heavy (sticky pans,
// counters, typewriter, staggered card entries) and none of it carries
// meaning that is lost when it snaps into place instead.
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduced;
}

// Whether to run the WebGL hero at all. Three independent reasons not to:
// a viewport too narrow for a two-column hero, a visitor who asked for
// reduced motion, or a device with no WebGL. In every case the reel contact
// sheet takes the slot and the hero stays a single screen tall.
function useGlobeEnabled(reduced: boolean) {
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const hasWebGL = () => {
      try {
        return !!document.createElement("canvas").getContext("webgl2");
      } catch {
        return false;
      }
    };
    const apply = () => setCapable(mq.matches && hasWebGL());
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return capable && !reduced;
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

// Number counter — animates from 0 to `to` when `trigger` flips true.
// Preserves decimals (unlike useCounter which rounds). Used by the
// case-card metrics (5.2×, 7.7×, 10×) so numbers tick up on enter
// instead of just appearing.
function useCounterFloat(trigger: boolean, to: number, ms = 1400, decimals = 1) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      const mult = Math.pow(10, decimals);
      setN(Math.round(to * eased * mult) / mult);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, to, ms, decimals]);
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
  const [lang, setLang] = useLanguage();
  const t = COPY[lang];

  const s1 = useRef<HTMLElement>(null);
  const s2 = useRef<HTMLElement>(null);
  const s3 = useRef<HTMLElement>(null);
  const sCases = useRef<HTMLElement>(null);
  const sProcess = useRef<HTMLElement>(null);
  const s4 = useRef<HTMLElement>(null);
  const s5 = useRef<HTMLElement>(null);
  const s6 = useRef<HTMLElement>(null);
  const s7 = useRef<HTMLElement>(null);
  // Memoised: useCurrentStage takes the array as an effect dependency, so a
  // fresh literal on every render tore down and re-attached the scroll
  // listener continuously.
  const stageRefs = useMemo(
    () => [s1, s2, s3, sCases, s4, sProcess, s5, s6, s7],
    [],
  );
  const stage = useCurrentStage(stageRefs);

  // Action-oriented nav — real destinations only.
  //
  // "Работа"/"Work" was dropped: /work is nothing but a redirect to
  // /portfolio, so the nav carried a link pointing at another link in the
  // same nav. Three near-synonyms (Work / Portfolio / Case Studies) also
  // gave a visitor no way to tell them apart. Two distinct destinations
  // remain — the reel and the written cases — plus the brief form.
  const NAV_LINKS =
    lang === "bg"
      ? [
          { label: "Портфолио", href: "/portfolio"    },
          { label: "Кейсове",   href: "/case-studies" },
          { label: "Анкета",    href: "/brief"        },
        ]
      : [
          { label: "Portfolio",    href: "/portfolio"    },
          { label: "Case Studies", href: "/case-studies" },
          { label: "Brief",        href: "/brief"        },
        ];

  const primaryCtaLabel = lang === "bg" ? "Резервирай разговор" : "Book a call";
  const [bookOpen, setBookOpen] = useState(false);
  const openBook = useCallback(() => setBookOpen(true), []);
  const closeBook = useCallback(() => setBookOpen(false), []);

  return (
    <div
      className="relative"
      style={{
        background: "#ebe8e0",
        fontFamily: "var(--brutal-display), system-ui, sans-serif",
        color: "#0d0d0d",
        // Several stages enter by sliding in from off-axis
        // (translateX(±50px) in Process, rotate in Roster, translateX(-30px)
        // in Why). Those pre-entry transforms widened the document, which
        // gave the whole page a horizontal scroll on phones — 403px of
        // scrollable width in a 390px viewport. `clip` rather than `hidden`
        // because `hidden` would make this a scroll container and break
        // every position:sticky stage inside it.
        overflowX: "clip",
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

      {/* ============= SINGLE-ROW HEADER =============
          Masthead + nav in one strip on dark bg:
            [LOGO] | [nav links] | [БГ|EN] [→ Резервирай разговор]
          Nav links are md+ only. Below that the header used flex-wrap,
          which stacked logo / four links / language / CTA into a
          three-row block that ate a third of a phone viewport. On mobile
          the header is now one non-wrapping row and the same
          destinations stay reachable from the footer CTA block. */}
      <div
        className="border-b-4 border-black"
        style={{ background: "#0d0d0d", color: "#f4f4f4" }}
      >
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
          {/* LEFT — wordmark + inline nav */}
          <div className="flex items-center gap-x-6 md:gap-x-10 min-w-0">
            <Link
              href="/preview-brutalism"
              aria-label="VEKTO"
              className="h-8 md:h-11 w-[112px] md:w-[180px] shrink-0"
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
            <nav
              aria-label={lang === "bg" ? "Основна навигация" : "Main navigation"}
              className="hidden md:flex items-center gap-x-7 text-sm font-bold uppercase tracking-[0.2em]"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT — language + primary CTA */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button
              onClick={() => setLang(lang === "bg" ? "en" : "bg")}
              className="px-2.5 md:px-3 py-2 font-bold uppercase text-xs tracking-[0.25em] transition-colors hover:bg-white hover:text-black"
              style={{
                background: "transparent",
                color: "#f4f4f4",
                border: "1.5px solid rgba(244,244,244,0.4)",
              }}
              aria-label={lang === "bg" ? "Switch to English" : "Превключи на български"}
            >
              {t.nav.langSwitch}
            </button>
            <button
              type="button"
              onClick={openBook}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 border-2 uppercase text-[12px] md:text-[13px] tracking-[0.2em] font-black transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#0d0d0d",
                color: "#f4f4f4",
                boxShadow: "3px 3px 0 0 #8a8a8a",
                borderColor: "#f4f4f4",
              }}
            >
              <span aria-hidden>→</span>
              <span className="hidden sm:inline">{primaryCtaLabel}</span>
              <span className="sm:hidden">{lang === "bg" ? "Разговор" : "Call"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============= RIGHT-RAIL FUNNEL INDICATOR =============
          Was aria-hidden + pointer-events-none: it looks exactly like a
          section index, so visitors tried to click it and nothing
          happened. Every stage already has an id, so the rail is now a
          real jump nav. */}
      <nav
        aria-label={lang === "bg" ? "Секции" : "Sections"}
        className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-1.5"
      >
        {t.stages.map((s, i) => {
          const active = i === stage;
          return (
            <a
              key={s.id}
              href={`#stage-${s.id}`}
              aria-current={active ? "true" : undefined}
              aria-label={`${s.id} — ${s.label}`}
              className="flex items-center gap-2 justify-end group"
            >
              <span
                className="text-[12px] font-bold tracking-[0.2em] group-hover:opacity-100"
                style={{
                  fontFamily: "var(--brutal-pixel)",
                  opacity: active ? 1 : 0,
                  transition: "opacity 180ms ease",
                }}
              >
                {s.label}
              </span>
              <span
                className="w-6 h-6 border-2 border-black flex items-center justify-center text-[12px] font-black transition-all"
                style={{
                  background: active ? SILVER : "#ebe8e0",
                  color: "#0d0d0d",
                  boxShadow: active ? "3px 3px 0 0 #0d0d0d" : "1px 1px 0 0 #0d0d0d",
                  transform: active ? "translate(-2px,-2px)" : "translate(0,0)",
                }}
              >
                {s.id}
              </span>
            </a>
          );
        })}
      </nav>

      <StageHook  targetRef={s1} t={t.stage1} lang={lang} openBook={openBook} />
      <HazardStrip />
      <StageTruth targetRef={s2} t={t.stage2} />
      <HazardStrip />
      <StageRooms targetRef={s3} t={t.stage3} />
      <HazardStrip />
      <StageCases targetRef={sCases} t={t.stageCases} />
      <HazardStrip />
      <StageCast  targetRef={s4} t={t.stage4} />
      <HazardStrip />
      <StageProcess targetRef={sProcess} t={t.stageProcess} />
      <HazardStrip />
      <StageStandard targetRef={s5} t={t.stage5} />
      <HazardStrip />
      <StageQualify targetRef={s6} t={t.stage6} />
      <HazardStrip />
      <StageAsk   targetRef={s7} t={t.stage7} openBook={openBook} />

      <style jsx global>{`
        /* Smooth scrolling is a preference, not a given — the right-rail
           jump nav would otherwise fling a motion-sensitive visitor
           across nine full-height stages. */
        @media (prefers-reduced-motion: no-preference) {
          html { scroll-behavior: smooth; }
        }
        /* This page is animation-dense (sticky pans, counters, staggered
           card entries, pulsing carets). None of it encodes meaning, so
           under reduce it all resolves to its end state immediately. */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* Brutalist contact modal — same behaviour as the main site
          (email/phone/WhatsApp/lead form), styled to match this page.
          Opens when any 'Book a call' button fires openBook(). */}
      <BookModal open={bookOpen} onClose={closeBook} lang={lang} />
    </div>
  );
}

// ============================================================================
// BOOK MODAL — brutalist contact modal
// Same shape as the main site's ContactModal (phone / WhatsApp / email /
// lead form → sendContactEmail server action), but rendered in brutalist
// language so it stays consistent with the rest of the preview.
// ============================================================================
function BookModal({ open, onClose, lang }: { open: boolean; onClose: () => void; lang: Lang }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setSent(false);
    setError("");

    // Remember who opened the modal so focus can be handed back on close —
    // otherwise a keyboard user is dropped at the top of the document.
    const opener = document.activeElement as HTMLElement | null;

    const FOCUSABLE =
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      // Trap Tab inside the panel. Without this, tabbing walks straight
      // out of an aria-modal dialog and into the page behind the backdrop.
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [open, onClose]);

  const bg = lang === "bg";
  const s = bg
    ? {
        title: "РЕЗЕРВИРАЙ РАЗГОВОР",
        subtitle: "3 БЪРЗИ ОПЦИИ — ИЗБЕРИ КОЯ ТИ ПАСВА",
        call: "ОБАДИ СЕ", callSub: "+359 88 225 1474",
        wa: "WHATSAPP", waSub: "МОМЕНТАЛЕН ЧАТ",
        email: "ИМЕЙЛ", emailSub: "vektoagency@gmail.com",
        or: "ИЛИ ОСТАВИ ЗАЯВКА",
        name: "Име", namePh: "Иван Иванов",
        phone: "Телефон", phonePh: "+359 88 000 0000",
        emailField: "Имейл", emailPh: "ти@brand.bg",
        company: "Бранд", companyPh: "Име на бранда или сайт",
        message: "Кратко за проекта", messagePh: "Правя e-com, искам да пусна кампания...",
        submit: "→ ПРАТИ ЗАЯВКА",
        submitting: "ПРАЩАМЕ...",
        sent: "ПОЛУЧИХМЕ ЗАЯВКАТА",
        sentSub: "Отговаряме до 24 часа.",
        errorMsg: "Нещо се обърка. Опитай пак.",
      }
    : {
        title: "BOOK A CALL",
        subtitle: "3 QUICK OPTIONS — PICK WHAT WORKS",
        call: "PHONE", callSub: "+359 88 225 1474",
        wa: "WHATSAPP", waSub: "INSTANT CHAT",
        email: "EMAIL", emailSub: "vektoagency@gmail.com",
        or: "OR SEND A BRIEF",
        name: "Name", namePh: "Jane Doe",
        phone: "Phone", phonePh: "+1 000 000 0000",
        emailField: "Email", emailPh: "you@brand.com",
        company: "Brand", companyPh: "Brand name or website",
        message: "Short project note", messagePh: "We run e-com, want to launch a campaign...",
        submit: "→ SEND BRIEF",
        submitting: "SENDING...",
        sent: "GOT IT",
        sentSub: "We reply within 24 hours.",
        errorMsg: "Something went wrong. Try again.",
      };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await sendContactEmail(formData);
    setLoading(false);
    if (result.success) setSent(true);
    else setError(s.errorMsg);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop owns the click-to-close, so the dialog element itself is
          not also the dismiss target. role/aria-modal moved onto the panel
          where assistive tech expects them, and the panel is labelled by
          its own heading rather than announcing as an unnamed dialog. */}
      <button
        type="button"
        aria-label={bg ? "Затвори" : "Close"}
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: "rgba(0,0,0,0.82)" }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-modal-title"
        className="relative w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border-2 border-black"
        style={{ background: "#ebe8e0", boxShadow: "10px 10px 0 0 #8a8a8a" }}
      >
        {/* Header — dark plate */}
        <div
          className="flex items-start justify-between border-b-2 border-black px-5 md:px-7 py-4"
          style={{ background: "#0d0d0d", color: "#f4f4f4" }}
        >
          <div>
            <div
              className="text-[12px] font-bold uppercase tracking-[0.3em] opacity-70 mb-1"
              style={{ fontFamily: "var(--brutal-pixel)" }}
            >
              {s.subtitle}
            </div>
            <h2
              id="book-modal-title"
              className="font-black text-lg md:text-2xl uppercase tracking-tight"
              style={{
                background: SILVER_H,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {s.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 md:w-10 md:h-10 border-2 border-white font-black text-lg leading-none flex items-center justify-center transition-colors hover:bg-white hover:text-black flex-shrink-0"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7">
          {sent ? (
            <div
              className="text-center py-12 px-6 border-2 border-black"
              style={{
                background: SILVER,
                color: "#0d0d0d",
                boxShadow: "6px 6px 0 0 #0d0d0d",
              }}
            >
              <div className="text-4xl mb-4">✓</div>
              <div className="font-black text-xl md:text-2xl uppercase tracking-tight mb-2">
                {s.sent}
              </div>
              <div
                className="text-xs uppercase tracking-[0.25em] opacity-70"
                style={{ fontFamily: "var(--brutal-pixel)" }}
              >
                {s.sentSub}
              </div>
            </div>
          ) : (
            <>
              {/* 3 quick action chips */}
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
                <QuickAction href="tel:+359882251474" glyph="☎" label={s.call} sub={s.callSub} />
                <QuickAction href="https://wa.me/359882251474" glyph="◉" label={s.wa} sub={s.waSub} target="_blank" />
                <QuickAction href="mailto:vektoagency@gmail.com" glyph="✉" label={s.email} sub={s.emailSub} />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 border-t-2 border-dashed border-black opacity-30" />
                <div
                  className="text-[12px] font-bold uppercase tracking-[0.3em] opacity-60"
                  style={{ fontFamily: "var(--brutal-pixel)" }}
                >
                  {s.or}
                </div>
                <div className="flex-1 border-t-2 border-dashed border-black opacity-30" />
              </div>

              {/* Lead form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField name="name" label={s.name} ph={s.namePh} required />
                  <FormField name="phone" label={s.phone} ph={s.phonePh} required type="tel" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField name="email" label={s.emailField} ph={s.emailPh} required type="email" />
                  <FormField name="company" label={s.company} ph={s.companyPh} required />
                </div>
                <FormField name="message" label={s.message} ph={s.messagePh} required textarea />

                {error && (
                  <div className="text-[12px] font-bold uppercase tracking-widest p-3 border-2 border-red-600 text-red-600 bg-red-50">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border-2 border-black py-4 font-black text-base md:text-lg uppercase tracking-[0.15em] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "#0d0d0d",
                    color: "#f4f4f4",
                    boxShadow: "5px 5px 0 0 #8a8a8a",
                  }}
                >
                  {loading ? s.submitting : s.submit}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  glyph,
  label,
  sub,
  target,
}: {
  href: string;
  glyph: string;
  label: string;
  sub: string;
  target?: string;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className="flex flex-col items-center gap-1 border-2 border-black py-3 md:py-4 px-2 text-center transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
      style={{
        background: "#0d0d0d",
        color: "#f4f4f4",
        boxShadow: "3px 3px 0 0 #8a8a8a",
      }}
    >
      <span className="text-3xl md:text-4xl" style={{
        background: SILVER_H,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>{glyph}</span>
      <span
        className="text-[12px] md:text-[11px] font-bold uppercase tracking-[0.2em]"
        style={{ fontFamily: "var(--brutal-pixel)" }}
      >
        {label}
      </span>
      <span
        className="text-[12px] md:text-[11px] opacity-60 tabular-nums hidden md:block"
        style={{ fontFamily: "var(--brutal-pixel)" }}
      >
        {sub}
      </span>
    </a>
  );
}

function FormField({
  name,
  label,
  ph,
  type = "text",
  required,
  textarea,
}: {
  name: string;
  label: string;
  ph: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <div>
      <label
        className="block text-[12px] font-bold uppercase tracking-[0.25em] mb-1.5 opacity-70"
        style={{ fontFamily: "var(--brutal-pixel)" }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          placeholder={ph}
          rows={3}
          className="w-full border-2 border-black bg-white px-3 py-2 text-sm resize-none focus:outline-none focus:shadow-[3px_3px_0_0_#0d0d0d]"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={ph}
          className="w-full border-2 border-black bg-white px-3 py-2 text-sm focus:outline-none focus:shadow-[3px_3px_0_0_#0d0d0d]"
        />
      )}
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
function StageHook({ targetRef, t, lang, openBook }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage1"]; lang: Lang; openBook: () => void }) {
  // The hero is now a sticky stage: the content column stays pinned for
  // ~2.5 viewports while scroll drives the globe from 0 to 1. Same hook the
  // Rooms and Standard stages already use, so the funnel behaves
  // consistently. `p` is 0 the instant the stage latches and 1 when it
  // releases — everything the globe does is a function of it, which means
  // scrolling back up plays the whole sequence in reverse.
  const p = useStickyProgress(targetRef);
  const inView = useInView(targetRef, 0.2);
  const reduced = useReducedMotion();
  const showGlobe = useGlobeEnabled(reduced);

  // Typewriter: types character-by-character once the section is in view.
  // The old approach was tied to useScrollProgress, but the hero starts
  // at the top of the page so p immediately jumps to ~0.5 on first paint,
  // which meant ~70% of the text was already 'typed' before the user did
  // anything — no visible animation. Time-based reveal fixes it.
  const graphemes = Array.from(t.typed);
  const [typedCount, setTypedCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    // Reduced motion: the line is content, so it still appears — it just
    // appears whole instead of being animated in.
    if (reduced) { setTypedCount(graphemes.length); return; }
    setTypedCount(0);
    let i = 0;
    // Small pre-delay so the first character appears just after the CTAs
    // finish their entry-fade, then ~55ms per character.
    const startAfter = setTimeout(() => {
      const tick = setInterval(() => {
        i += 1;
        setTypedCount(i);
        if (i >= graphemes.length) clearInterval(tick);
      }, 55);
      // Cleanup for the interval when the effect re-runs / unmounts.
      cleanup = () => clearInterval(tick);
    }, 600);
    let cleanup: (() => void) | undefined;
    return () => {
      clearTimeout(startAfter);
      cleanup?.();
    };
  }, [inView, reduced, graphemes.length]);
  const typed = graphemes.slice(0, typedCount).join("");

  return (
    <section
      id="stage-01"
      ref={targetRef}
      className="relative"
      style={{
        // Sticky runway. Only taken when the globe is actually mounted —
        // without it there is nothing for the extra scroll to drive, and
        // 2.5 screens of pinned static text is just a tax on the visitor.
        height: showGlobe ? "260vh" : "100dvh",
        minHeight: showGlobe ? undefined : "100vh",
        background: "#ebe8e0",
      }}
    >
    <div
      className="sticky top-0 flex flex-col overflow-hidden"
      style={{ height: "100dvh", minHeight: "100vh" }}
    >
      {/* MAIN — two columns from lg up.
          The single-column version left the entire right third of the
          viewport as bare paper: an agency that ships 200+ videos a
          month was showing nothing above the fold, and the composition
          had nothing holding its right edge. The globe fills both gaps;
          on smaller screens, and under reduced motion, the reel contact
          sheet stands in for it. */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_min(30vw,380px)] items-center gap-8 xl:gap-12 px-6 md:px-14 lg:pr-24 xl:pr-28 pt-4 md:pt-6 pb-4 max-w-[1500px] mx-auto w-full min-h-0">
        <div className="flex flex-col w-full min-w-0">
          {/* Stage marker + positioning plate. These used to say
              "01 · GROWTH AGENCY" and "AI GROWTH AGENCY · EST. MMXXIV" —
              the same three words twice, 40px apart. The marker now does
              indexing, the plate does positioning + geography. */}
          <div
            className="text-[12px] md:text-xs font-bold uppercase tracking-[0.35em] mb-3 md:mb-4 opacity-60"
            style={{ fontFamily: "var(--brutal-pixel)" }}
          >
            {t.eyebrow}
          </div>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 text-[12px] md:text-xs font-bold uppercase tracking-[0.25em] mb-5 md:mb-6 self-start"
            style={{
              background: "#0d0d0d",
              color: "#f4f4f4",
              border: "1.5px solid",
              borderImage: `${SILVER_H} 1`,
              boxShadow: "4px 4px 0 0 #0d0d0d",
              fontFamily: "var(--brutal-pixel)",
            }}
          >
            {t.pill}
          </div>

          {/* whitespace-nowrap used to be pinned on both lines while the
              section clipped overflow, so any width where the line did
              not fit silently cut the headline off. That was already a
              risk in English and is a certainty in Bulgarian: Cyrillic
              runs materially wider here (longer strings, and Onest sets
              wider than Space Grotesk). The lines now wrap, and the type
              scale is sized against the Bulgarian string, not the
              English one. */}
          <h1
            className="font-black tracking-[-0.03em] max-w-full"
            style={{
              fontSize: "clamp(34px, 4.9vw, 84px)",
              lineHeight: 0.94,
              overflowWrap: "break-word",
              hyphens: "none",
            }}
          >
            <span className="block">{t.headline1}</span>
            <span className="block">
              {t.headline2Prefix}{" "}
              <span
                className="italic"
                style={{
                  // Reversed relative to GRAPHITE_H: the old direction
                  // bottomed out light exactly on the last word, so the
                  // single most important word in the headline was also
                  // the lowest-contrast thing on the screen.
                  background: GRAPHITE_H_IN,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.headline2Highlight}
              </span>
            </span>
          </h1>

          {/* CTAs. The secondary used to be a full chrome slab that
              out-shouted the black primary sitting next to it; it is now
              a quiet outline so the hierarchy reads in one glance. */}
          <div className="flex flex-wrap gap-3 mt-7 md:mt-9">
            <button
              type="button"
              onClick={openBook}
              className="inline-flex items-center gap-2 px-5 md:px-7 py-3 md:py-4 border-2 border-black font-black uppercase text-sm md:text-base tracking-[0.15em] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#0d0d0d",
                color: "#f4f4f4",
                boxShadow: "5px 5px 0 0 #8a8a8a",
              }}
            >
              <span aria-hidden>→</span>
              {t.ctaPrimary}
            </button>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-5 md:px-6 py-3 md:py-4 border-2 border-black font-black uppercase text-sm md:text-base tracking-[0.15em] transition-colors hover:bg-black hover:text-[#ebe8e0]"
              style={{ background: "transparent", color: "#0d0d0d" }}
            >
              <span aria-hidden>▶</span>
              {t.ctaSecondary}
            </Link>
          </div>

          {/* Proof strip. Replaces three dated news chips that repeated
              the same three ROAS figures already carried by stage 04 —
              and that would have read as a stale newsfeed within a
              month. No dates, no maintenance, works on mobile. */}
          <div className="flex items-stretch flex-wrap gap-2 md:gap-3 mt-6 md:mt-8">
            <span
              className="inline-flex items-center shrink-0 text-[12px] font-bold uppercase tracking-[0.3em] px-2.5 py-2 border-2 border-black"
              style={{
                fontFamily: "var(--brutal-pixel)",
                background: "#0d0d0d",
                color: "#f4f4f4",
                boxShadow: "3px 3px 0 0 #8a8a8a",
              }}
            >
              {t.proofTitle}
            </span>
            {t.proof.map((item) => (
              <div
                key={item.brand}
                className="inline-flex items-baseline gap-2 shrink-0 px-3 py-1.5 border-2 border-black"
                style={{ background: "#ebe8e0", boxShadow: "3px 3px 0 0 #0d0d0d" }}
              >
                <span className="font-black text-base md:text-lg tabular-nums leading-none">
                  {item.metric}
                </span>
                <span
                  className="text-[12px] uppercase tracking-[0.15em] opacity-70 leading-none"
                  style={{ fontFamily: "var(--brutal-pixel)" }}
                >
                  {item.brand}
                </span>
              </div>
            ))}
          </div>

          {/* Typewriter caption. Was "YOU'RE IN THE FUNNEL." — a joke
              about the page rather than anything said to the buyer. */}
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

        {/* GLOBE — the scroll-driven hero.
            Sits inside the same hard-bordered instrument housing the rest
            of the page uses, with VT323 plates reading out what the
            sequence is currently showing. Everything in the readout comes
            from the real ROSTER array, so the counts cannot drift away
            from the logos on stage 05. */}
        {showGlobe && (
          <div
            className="hidden lg:flex flex-col self-center border-2 border-black"
            style={{ background: "#0d0d0d", boxShadow: "7px 7px 0 0 #8a8a8a" }}
          >
            <div
              className="flex items-center justify-between px-3 py-2 border-b-2 text-[12px] uppercase tracking-[0.25em]"
              style={{ borderColor: "#8a8a8a", color: "#f4f4f4", fontFamily: "var(--brutal-pixel)" }}
            >
              <span>{t.globeTitle}</span>
              <span className="tabular-nums opacity-60">
                {String(Math.round(p * 100)).padStart(3, "0")}%
              </span>
            </div>

            <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
              <Globe progress={p} className="absolute inset-0" />
              {/* Marker labels are DOM, not WebGL: crisp VT323 at any DPI,
                  selectable, and they cost nothing to render. They fade in
                  on the same thresholds the 3D markers land on. */}
              <div
                className="absolute right-3 top-3 px-2 py-1 border text-[11px] uppercase tracking-[0.2em] transition-opacity duration-300"
                style={{
                  borderColor: "#8a8a8a", color: "#f4f4f4",
                  fontFamily: "var(--brutal-pixel)",
                  opacity: p > 0.24 ? 1 : 0,
                }}
              >
                {t.globeBg} · {BG_COUNT}
              </div>
              <div
                className="absolute left-3 bottom-3 px-2 py-1 border text-[11px] uppercase tracking-[0.2em] transition-opacity duration-300"
                style={{
                  borderColor: "#8a8a8a", color: "#f4f4f4",
                  fontFamily: "var(--brutal-pixel)",
                  opacity: p > 0.44 ? 1 : 0,
                }}
              >
                {t.globeUs} · {US_COUNT}
              </div>
            </div>

            <div
              className="px-3 py-2 border-t-2 text-[12px] uppercase tracking-[0.2em] flex items-center justify-between gap-2"
              style={{ borderColor: "#8a8a8a", color: "#f4f4f4", fontFamily: "var(--brutal-pixel)" }}
            >
              <span className="opacity-60">{t.globeNote}</span>
              <Link href="/portfolio" className="opacity-80 hover:opacity-100 shrink-0">
                {t.globeLink} →
              </Link>
            </div>
          </div>
        )}

        {/* CONTACT SHEET — stands in wherever the globe does not run:
            below lg, and under prefers-reduced-motion. Three real frames
            from the reel; captions stay factual (format + discipline) and
            never attach a client or a result to a frame. */}
        <Link
          href="/portfolio"
          aria-label={lang === "bg" ? "Виж портфолиото" : "See the portfolio"}
          className={`${showGlobe ? "hidden" : "hidden lg:block"} group border-2 border-black self-center`}
          style={{ background: "#0d0d0d", boxShadow: "7px 7px 0 0 #8a8a8a" }}
        >
          <div
            className="flex items-center justify-between px-3 py-2 border-b-2 text-[12px] uppercase tracking-[0.25em]"
            style={{ borderColor: "#8a8a8a", color: "#f4f4f4", fontFamily: "var(--brutal-pixel)" }}
          >
            <span>{t.sheetTitle}</span>
            <span className="opacity-60 transition-transform group-hover:translate-x-1">→</span>
          </div>
          <div className="grid grid-cols-3 gap-[2px] p-[2px]" style={{ background: "#8a8a8a" }}>
            {REEL_FRAMES.map((f, i) => (
              <figure key={f.src} className="relative" style={{ background: "#0d0d0d" }}>
                <div className="relative w-full" style={{ aspectRatio: "9 / 16" }}>
                  <Image
                    src={f.src}
                    alt={t.sheetAlt[i]}
                    fill
                    sizes="140px"
                    className="object-cover"
                    priority={i === 0}
                    unoptimized
                  />
                </div>
                <figcaption
                  className="px-1.5 py-1 text-[11px] uppercase tracking-[0.1em] truncate"
                  style={{ fontFamily: "var(--brutal-pixel)", color: "#f4f4f4" }}
                >
                  {t.sheetCaptions[i]}
                </figcaption>
              </figure>
            ))}
          </div>
          <div
            className="px-3 py-2 border-t-2 text-[12px] uppercase tracking-[0.2em] opacity-60"
            style={{ borderColor: "#8a8a8a", color: "#f4f4f4", fontFamily: "var(--brutal-pixel)" }}
          >
            {t.sheetNote}
          </div>
        </Link>
      </div>

      {/* BOTTOM — scroll cue plus, while the globe is running, a progress
          rule that shows how much of the sticky sequence is left. Without
          it a pinned viewport reads as a stuck page. */}
      <div
        className="max-w-[1500px] mx-auto w-full shrink-0 px-6 md:px-14 pb-6 md:pb-8"
        style={{
          // Fades only at the very end of the sticky run, not immediately.
          opacity: showGlobe ? Math.max(0, 1 - (p - 0.88) / 0.12) : Math.max(0, (1 - p) * 2),
          transition: "opacity 200ms ease",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="text-[12px] md:text-xs font-bold uppercase tracking-[0.35em]"
            style={{ fontFamily: "var(--brutal-pixel)" }}
          >
            {t.scrollCue}
          </div>
          <div className="flex-1 h-[2px] max-w-32 border-t-2 border-dashed border-black relative">
            {showGlobe && (
              <span
                className="absolute left-0 -top-[2px] h-[2px]"
                style={{ width: `${p * 100}%`, background: "#0d0d0d" }}
              />
            )}
          </div>
        </div>
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
          style={{ fontFamily: "var(--brutal-pixel)" }}
        >
          {t.eyebrow}
        </div>

        {/* Pull quote — the honest agitation. This is a real quotation,
            so it is marked up as one; the section's own heading is the
            response below it. Stage 02 was previously the only stage on
            the page with no heading element at all. */}
        <figure
          className="border-l-4 pl-6 md:pl-14 max-w-5xl transition-all duration-700"
          style={{
            borderColor: "#8a8a8a",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-30px)",
          }}
        >
          <blockquote
            className="font-black leading-[1.05] tracking-[-0.02em] mb-10"
            style={{ fontSize: "clamp(30px, 4.8vw, 72px)" }}
          >
            {t.quoteMain}
          </blockquote>
          <figcaption
            className="text-sm md:text-base uppercase tracking-[0.25em] opacity-70"
            style={{ fontFamily: "var(--brutal-pixel)" }}
          >
            {t.quoteAttribution}
          </figcaption>
        </figure>

        <h2
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
        </h2>
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
            style={{ fontFamily: "var(--brutal-pixel)" }}
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
              // Extra right padding from lg up so a room panel never slides
              // under the fixed stage rail — which now takes clicks, so
              // overlapping it would swallow them.
              className="w-screen h-full flex-shrink-0 flex items-center justify-center px-6 md:px-16 lg:pr-28"
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
                    className="inline-block px-2 py-1 border-2 border-black text-[12px] font-bold uppercase tracking-[0.25em] mb-6"
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
                    style={{ fontFamily: "var(--brutal-pixel)" }}
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
                    style={{ fontFamily: "var(--brutal-pixel)" }}
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
// ============================================================================
// STAGE 04 · CASES — 3 real case cards, before/duration/highlight
// Reveals as a stagger on scroll-in. Each card = hard-bordered plate
// with big silver metric on dark ground, brand + duration + one-liner.
// ============================================================================
function StageCases({ targetRef, t }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stageCases"] }) {
  const inView = useInView(targetRef, 0.15);
  return (
    <section
      id="stage-04"
      ref={targetRef}
      className=""
      style={{ background: "#ebe8e0", minHeight: "100vh" }}
    >
      <div className="px-6 md:px-14 py-20 md:py-28 max-w-[1400px] mx-auto">
        <div
          className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60"
          style={{ fontFamily: "var(--brutal-pixel)" }}
        >
          {t.eyebrow}
        </div>

        <h2
          className="font-black leading-[0.94] tracking-[-0.03em] uppercase mb-6 max-w-4xl"
          style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
        >
          {t.headline1}
          <br />
          {t.headline2Prefix}{" "}
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
          className="text-sm md:text-base leading-[1.55] font-medium max-w-2xl mb-14 opacity-75"
          style={{ fontFamily: "var(--brutal-comic)" }}
        >
          {t.note}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {t.cases.map((c, i) => (
            <CaseCard key={c.brand} c={c} inView={inView} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Individual case card — extracted so it can own its own counter + enter
// animation. Card enters with rotate+scale+translate (alternating rotate
// direction per card for punchy variation), metric number ticks up from
// 0 to target after the card lands.
function CaseCard({
  c,
  inView,
  idx,
}: {
  c: { brand: string; category: string; metric: string; metricLabel: string; duration: string; highlight: string };
  inView: boolean;
  idx: number;
}) {
  // Parse '5.2×' → { num: 5.2, suffix: '×' }
  const match = c.metric.match(/(\d+(?:\.\d+)?)(.*)/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : c.metric;
  const decimals = c.metric.includes(".") ? 1 : 0;

  // Trigger counter shortly after this card's stagger delay so the tick
  // starts as the card settles into place, not before it arrives.
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const start = idx * 160 + 350;
    const t = setTimeout(() => setTriggered(true), start);
    return () => clearTimeout(t);
  }, [inView, idx]);
  const displayed = useCounterFloat(triggered, target, 1300, decimals);
  const displayStr =
    decimals > 0 ? displayed.toFixed(1) + suffix : Math.round(displayed) + suffix;

  // Alternate rotation direction for a livelier grid entry.
  const rot = idx % 2 === 0 ? -1.5 : 1.5;

  return (
    <div
      className="border-2 border-black flex flex-col overflow-hidden"
      style={{
        background: "#ebe8e0",
        boxShadow: "8px 8px 0 0 #0d0d0d",
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateY(0) scale(1) rotate(0deg)"
          : `translateY(60px) scale(0.92) rotate(${rot}deg)`,
        transition: `opacity 620ms cubic-bezier(0.16,1,0.3,1) ${idx * 160}ms, transform 720ms cubic-bezier(0.16,1,0.3,1) ${idx * 160}ms`,
      }}
    >
      {/* Header — brand + category */}
      <div className="px-5 py-4 border-b-2 border-black flex items-center justify-between">
        <div className="font-black text-lg uppercase tracking-tight">
          {c.brand}
        </div>
        <div
          className="text-[12px] uppercase tracking-[0.2em] opacity-60"
          style={{ fontFamily: "var(--brutal-pixel)" }}
        >
          {c.category}
        </div>
      </div>

      {/* Metric plate — dark bg with silver-fill counter */}
      <div
        className="px-5 py-8 md:py-10 border-b-2 border-black flex-1 flex flex-col justify-center"
        style={{ background: "#0d0d0d", color: "#f4f4f4" }}
      >
        <div
          className="font-black leading-none tabular-nums"
          style={{
            fontSize: "clamp(56px, 7vw, 108px)",
            background: SILVER_H,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.03em",
          }}
        >
          {displayStr}
        </div>
        <div
          className="text-[12px] uppercase tracking-[0.25em] opacity-70 mt-3 font-bold"
          style={{ fontFamily: "var(--brutal-pixel)" }}
        >
          {c.metricLabel}
        </div>
      </div>

      {/* Duration + highlight */}
      <div className="p-5 space-y-3">
        <div
          className="inline-block px-2 py-1 border border-black text-[12px] font-bold uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--brutal-pixel)" }}
        >
          {c.duration}
        </div>
        <p className="text-[13px] leading-[1.5] font-medium">
          {c.highlight}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// STAGE 05 · PROCESS — 4-step engagement roadmap
// Vertical stack of numbered steps, each a bordered plate. Reveals in
// stagger as it scrolls into view. Each step has: big number, title,
// duration badge, body copy.
// ============================================================================
function StageProcess({ targetRef, t }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stageProcess"] }) {
  const inView = useInView(targetRef, 0.15);
  return (
    <section
      id="stage-06"
      ref={targetRef}
      className=""
      style={{ background: "#d6d3ca", minHeight: "100vh" }}
    >
      <div className="px-6 md:px-14 py-20 md:py-28 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-10 items-start">
          {/* Left — sticky headline */}
          <div className="md:col-span-5 md:sticky md:top-40">
            <div
              className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60"
              style={{ fontFamily: "var(--brutal-pixel)" }}
            >
              {t.eyebrow}
            </div>
            <h2
              className="font-black leading-[0.94] tracking-[-0.03em] uppercase mb-6"
              style={{ fontSize: "clamp(34px, 5vw, 76px)" }}
            >
              {t.headline1}
              <br />
              {t.headline2Prefix}{" "}
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
              className="text-sm md:text-base leading-[1.55] opacity-75 max-w-md font-medium"
              style={{ fontFamily: "var(--brutal-comic)" }}
            >
              {t.note}
            </p>
          </div>

          {/* Right — step stack. Cards enter with alternating side slide
              + scale so the list feels like it's snapping into position
              rather than just fading in. */}
          <div className="md:col-span-7 space-y-4 md:space-y-6">
            {t.steps.map((s, i) => (
              <div
                key={s.num}
                className="border-2 border-black p-5 md:p-7"
                style={{
                  background: "#ebe8e0",
                  boxShadow: "6px 6px 0 0 #0d0d0d",
                  opacity: inView ? 1 : 0,
                  transform: inView
                    ? "translateX(0) scale(1)"
                    : `translateX(${i % 2 === 0 ? -50 : 50}px) scale(0.96)`,
                  transition: `opacity 620ms cubic-bezier(0.16,1,0.3,1) ${i * 130}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${i * 130}ms`,
                }}
              >
                <div className="flex items-baseline gap-4 md:gap-6">
                  <div
                    className="text-3xl md:text-5xl font-black tabular-nums flex-shrink-0"
                    style={{
                      background: GRAPHITE_H,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {s.num}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                      <h3 className="font-black text-lg md:text-2xl uppercase tracking-tight leading-tight">
                        {s.title}
                      </h3>
                      <span
                        className="text-[12px] font-bold uppercase tracking-[0.2em] px-2 py-1 border border-black shrink-0"
                        style={{
                          fontFamily: "var(--brutal-pixel)",
                          background: "#0d0d0d",
                          color: "#f4f4f4",
                        }}
                      >
                        {s.duration}
                      </span>
                    </div>
                    <p
                      className="text-sm md:text-base leading-[1.55] font-medium opacity-85"
                      style={{ fontFamily: "var(--brutal-comic)" }}
                    >
                      {s.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StageCast({ targetRef, t }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage4"] }) {
  const inView = useInView(targetRef, 0.15);
  return (
    <section
      id="stage-05"
      ref={targetRef}
      className=""
      style={{ background: "#0d0d0d", color: "#f4f4f4", minHeight: "100vh" }}
    >
      <div className="px-6 md:px-14 py-20 md:py-28 max-w-[1400px] mx-auto">
        <div
          className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60"
          style={{ fontFamily: "var(--brutal-pixel)" }}
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
          {ROSTER.map((c, i) => {
            // Alternate rotation direction per column for a punchier
            // pop-into-place feel across the whole grid.
            const rot = i % 2 === 0 ? -2 : 2;
            return (
            <div
              key={c.name}
              className="border-2 border-white bg-white flex flex-col relative"
              style={{
                aspectRatio: "5/4",
                boxShadow: "5px 5px 0 0 #8a8a8a",
                opacity: inView ? 1 : 0,
                transform: inView
                  ? "translateY(0) scale(1) rotate(0deg)"
                  : `translateY(30px) scale(0.85) rotate(${rot}deg)`,
                transition: `opacity 620ms cubic-bezier(0.16,1,0.3,1) ${i * 55}ms, transform 720ms cubic-bezier(0.16,1,0.3,1) ${i * 55}ms`,
              }}
            >
              {/* Region badge in top-right corner */}
              <span
                className="absolute top-1.5 right-1.5 border border-black bg-white px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.2em] leading-none z-10"
                style={{ fontFamily: "var(--brutal-pixel)", color: "#0d0d0d" }}
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
                className="border-t-2 border-black px-2 py-2 text-center text-[12px] md:text-[11px] font-bold uppercase tracking-[0.2em] leading-none"
                style={{ color: "#0d0d0d" }}
              >
                {c.name}
              </div>
            </div>
          );
          })}
        </div>

        {/* Coda under the grid */}
        <div
          className="mt-10 text-xs uppercase tracking-[0.25em] opacity-60"
          style={{ fontFamily: "var(--brutal-pixel)" }}
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
      id="stage-07"
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
              style={{ fontFamily: "var(--brutal-pixel)" }}
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
              style={{ fontFamily: "var(--brutal-comic)" }}
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
                        style={{ fontFamily: "var(--brutal-comic)" }}
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
      id="stage-08"
      ref={targetRef}
      className=""
      style={{ background: "#d6d3ca", minHeight: "100vh" }}
    >
      <div className="px-6 md:px-14 py-20 md:py-28 max-w-[1400px] mx-auto">
        <div
          className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60"
          style={{ fontFamily: "var(--brutal-pixel)" }}
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
function StageAsk({ targetRef, t, openBook }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage7"]; openBook: () => void }) {
  const inView = useInView(targetRef, 0.35);
  return (
    <section
      id="stage-09"
      ref={targetRef}
      className="relative"
      style={{ background: "#0d0d0d", color: "#f4f4f4", minHeight: "100vh" }}
    >
      <div className="px-6 md:px-14 py-24 md:py-40 max-w-[1400px] mx-auto text-center relative">
        {/* A soft radial bloom used to sit behind this block and an 80px
            glow around the CTA. Both are the generic dark-page-with-a-glow
            look this design is explicitly built against, and neither
            survives the "no gradients on physical elements" rule. The
            hazard rules below do the same framing job with hard edges. */}
        <div
          aria-hidden
          className="absolute inset-x-6 md:inset-x-14 top-10 bottom-10 pointer-events-none border-y-2 border-dashed transition-opacity duration-700"
          style={{ borderColor: "rgba(244,244,244,0.14)", opacity: inView ? 1 : 0 }}
        />

        <div className="relative">
          <div
            className="text-xs font-bold uppercase tracking-[0.35em] mb-10 opacity-60"
            style={{ fontFamily: "var(--brutal-pixel)" }}
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

          <button
            type="button"
            onClick={openBook}
            className="group inline-flex items-center gap-4 px-8 md:px-14 py-5 md:py-8 border-2 border-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: SILVER,
              color: "#0d0d0d",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.4) inset, 10px 10px 0 0 #ebe8e0",
            }}
          >
            <span className="font-black text-xl md:text-3xl uppercase tracking-tight">
              {t.cta}
            </span>
            <span className="font-black text-xl md:text-3xl transition-transform group-hover:translate-x-2">
              →
            </span>
          </button>

          <div
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.25em] opacity-70"
            style={{ fontFamily: "var(--brutal-pixel)" }}
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
            className="mt-24 text-[12px] tracking-[0.2em] opacity-40 border-t-2 border-dashed border-white/40 pt-4 max-w-3xl mx-auto uppercase"
            style={{ fontFamily: "var(--brutal-pixel)" }}
          >
            {t.guestbook}
          </div>

          <Link
            href="/portfolio"
            className="mt-6 inline-block text-[12px] uppercase tracking-[0.3em] opacity-50 hover:opacity-100 underline decoration-2 underline-offset-4"
            style={{ fontFamily: "var(--brutal-pixel)" }}
          >
            {t.portfolioLink}
          </Link>
        </div>
      </div>
    </section>
  );
}
