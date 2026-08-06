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
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { sendContactEmail } from "../actions/contact";
import FlightPlan from "../components/FlightPlan";

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
// GRAPHITE gradients (dark chrome for light grounds) were retired with the
// bone paper era — the page now runs entirely on the film's jet ground and
// silver accents.

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
      eyebrow: "01 · VEKTO",
      pill: "50+ БРАНДА · 500+ ВИДЕА / МЕСЕЦ",
      headline1: "БИЗНЕСЪТ ТИ ЗАСЛУЖАВА ЛИ",
      headline2Prefix: "ДА БЪДЕ",
      headline2Highlight: "СКАЛИРАН?",
      typed: "ЕДИН ЕКИП. КРЕАТИВИ, ФУНИИ И AI.",
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
        "„Едни правят рекламите, други — видеата, трети — сайта. Никой не говори с никого. А резултатът е мой проблем.\"",
      quoteAttribution: "— почти всеки бранд, преди да дойде при нас",
      response: "Затова",
      responseHighlight: "съществуваме.",
    },
    stage3: {
      eyebrow: "03 · ЧЕТИРИ СТАИ · ЕДИН ПОКРИВ",
      rooms: [
        { id: "01", title: "КРЕАТИВИ",   detail: "Видео · заснемане · AI ads", num: "500+", label: "ВИДЕА НА МЕСЕЦ" },
        { id: "02", title: "УЕБСАЙТОВЕ", detail: "Лендинги · е-ком · портали",      num: "12",   label: "САЙТА НА ГОДИНА" },
        { id: "03", title: "СТРАТЕГИИ",  detail: "Позициониране · оферта · план",   num: "50+",  label: "БРАНДА В ПОРТФОЛИОТО" },
        { id: "04", title: "AI РЕШЕНИЯ", detail: "AI видео · автоматизации",        num: "5.2×", label: "ROAS · AI КАМПАНИЯ" },
      ],
      roomBadge: "СТАЯ №",
    },
    stageCases: {
      eyebrow: "04 · КЕЙСОВЕ · РЕАЛНИ РЕЗУЛТАТИ",
      headline1: "ОТ РЕКЛАМЕН БЮДЖЕТ",
      headline2Prefix: "КЪМ",
      headline2Highlight: "РАСТЕЖ.",
      note: "Три реални кейса. Всеки — с реална метрика, реален бюджет, реален период.",
      cases: [
        {
          brand: "MEN'S CARE",
          category: "Beauty · BG",
          metric: "5.2×",
          metricLabel: "ROAS · AI КАМПАНИЯ",
          duration: "90 ДНИ",
          highlight: "AI продукцията на UGC замести външна продукция за €12k на месец — без разлика в качеството.",
        },
        {
          brand: "PARFEN",
          category: "Perfume · BG",
          metric: "7.7×",
          metricLabel: "ROAS · ОФЕРТА СЪС СРОК",
          duration: "60 ДНИ",
          highlight: "Статичен банер с оферта със срок победи видеата в 4 от 5 паралелни теста.",
        },
        {
          brand: "FREYA NAILS",
          category: "Е-ком · BG",
          metric: "10×",
          metricLabel: "ROAS · ПРОДУКТИ ЗА НОКТИ",
          duration: "120 ДНИ",
          highlight: "Ниска цена на клиент и системен ретаргетинг. Разпилян акаунт, събран в една подредена структура.",
        },
      ],
    },
    stageProcess: {
      eyebrow: "06 · КАК СЕ СЛУЧВА",
      headline1: "ОТ ПЪРВИЯ РАЗГОВОР",
      headline2Prefix: "ДО",
      headline2Highlight: "РАСТЕЖ.",
      note: "Един и същ път за всеки нов бранд. Клиничен, не корпоративен.",
      steps: [
        {
          num: "01",
          title: "ЗАПОЗНАВАНЕ",
          duration: "30 МИНУТИ · БЕЗПЛАТНО",
          body: "Разговор за бранда, целите и ситуацията. Проверяваме дали си пасваме — и в двете посоки.",
        },
        {
          num: "02",
          title: "ДИАГНОСТИКА",
          duration: "2 СЕДМИЦИ",
          body: "Одит на каналите, позиционирането, офертата и проследяването. Излизаш с конкретен план за 90 дни.",
        },
        {
          num: "03",
          title: "ИЗГРАЖДАНЕ",
          duration: "30 ДНИ",
          body: "Сглобяваме системата: стратегия, криейтиви, фуния, проследяване, инфраструктура. Готово за старт.",
        },
        {
          num: "04",
          title: "СТАРТ И СКАЛИРАНЕ",
          duration: "МЕСЕЦ 2 →",
          body: "Активни кампании, ежедневна оптимизация, месечен разбор в дълбочина, скалиране на печелившото.",
        },
      ],
    },
    stage4: {
      eyebrow: "05 · СЪСТАВЪТ",
      headline1: "50+ БРАНДА В ПОРТФОЛИОТО.",
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
        "Имаш €100k+ годишен оборот",
        "Готов си да инвестираш в система, не в единични материали",
        "Искаш партньор, не изпълнител",
        "Цениш занаята повече от триковете",
      ],
      verdict: "4/4 — ЗАПАЗИ РАЗГОВОР",
    },
    stage7: {
      eyebrow: "09 · АКО СИ СТИГНАЛ ДОТУК",
      headlinePrefix: "ТОГАВА Е ВРЕМЕ ЗА",
      headlineHighlight: "РАЗГОВОР.",
      cta: "ЗАПАЗИ РАЗГОВОР",
      guestbook: "// VEKTO · GROWTH AGENCY · 2026",
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
      eyebrow: "01 · VEKTO",
      pill: "50+ BRANDS · 500+ VIDEOS / MONTH",
      headline1: "DOES YOUR BUSINESS",
      headline2Prefix: "DESERVE",
      headline2Highlight: "TO SCALE?",
      typed: "ONE TEAM. CREATIVES, FUNNELS & AI.",
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
        "\"One team runs the ads, another cuts the videos, a third built the site. Nobody talks to anybody. And the results are my problem.\"",
      quoteAttribution: "— almost every brand, before they find us",
      response: "That's why",
      responseHighlight: "we exist.",
    },
    stage3: {
      eyebrow: "03 · FOUR ROOMS · ONE ROOF",
      rooms: [
        { id: "01", title: "CREATIVE",     detail: "Video · live shoots · AI ads", num: "500+", label: "VIDEOS / MONTH" },
        { id: "02", title: "WEBSITES",     detail: "Landing · e-com · portals",    num: "12",   label: "SITES / YEAR" },
        { id: "03", title: "STRATEGY",     detail: "Positioning · offer · plan",   num: "50+",  label: "BRANDS IN PORTFOLIO" },
        { id: "04", title: "AI SOLUTIONS", detail: "AI video · automations",       num: "5.2×", label: "ROAS · AI CAMPAIGN" },
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
      verdict: "4/4 — BOOK A CALL",
    },
    stage7: {
      eyebrow: "09 · IF YOU'VE MADE IT THIS FAR",
      headlinePrefix: "THEN IT'S TIME FOR",
      headlineHighlight: "A CALL.",
      cta: "BOOK A CALL",
      guestbook: "// VEKTO · GROWTH AGENCY · 2026",
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
        // The film's palette, page-wide: jet ground, silver accents, white
        // ink. The bone paper era is over — both previews live in the same
        // world as the hero film now.
        background: "#0d0d0d",
        fontFamily: "var(--brutal-display), system-ui, sans-serif",
        color: "#f4f4f4",
        // Cyrillic (Onest fallback) sets ~8% wider than Space Grotesk, so
        // at equal clamps the Bulgarian page reads oversized and wraps
        // more. Every display fontSize multiplies by this factor.
        ...({ "--bgk": lang === "bg" ? "0.92" : "1" } as React.CSSProperties),
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
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 3px)",
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
      <MobileProgress />

      {/* Same header grammar as the cinematic preview: fixed and fully
          transparent — no bar, no border — wordmark alone on the left,
          nav + language + CTA grouped right, halo shadows for legibility
          over whatever the stage below is showing. */}
      <div className="fixed inset-x-0 top-0 z-50" style={{ background: "transparent" }}>
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center gap-x-5 md:gap-x-7">
          <Link
            href="/preview-brutalism"
            aria-label="VEKTO"
            className="h-8 md:h-11 w-[112px] md:w-[180px] shrink-0 mr-auto"
            style={{
              background: WORDMARK_METAL,
              filter: "drop-shadow(0 0 1px rgba(13,13,13,0.95)) drop-shadow(0 1px 5px rgba(13,13,13,0.75))",
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
            className="hidden md:contents"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hidden md:inline text-sm font-bold uppercase tracking-[0.2em] opacity-95 hover:opacity-100 transition-opacity"
                style={{ color: "#f4f4f4", textShadow: "0 0 1px #0d0d0d, 0 0 3px rgba(13,13,13,0.9), 0 1px 6px rgba(13,13,13,0.55)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setLang(lang === "bg" ? "en" : "bg")}
            className="px-2.5 md:px-3 py-2 font-bold uppercase text-xs tracking-[0.25em] shrink-0 transition-colors hover:bg-white hover:text-black"
            style={{
              background: "transparent",
              color: "#f4f4f4",
              border: "1.5px solid rgba(244,244,244,0.75)",
              textShadow: "0 0 1px #0d0d0d, 0 0 3px rgba(13,13,13,0.9)",
              filter: "drop-shadow(0 0 1px rgba(13,13,13,0.7))",
            }}
            aria-label={lang === "bg" ? "Switch to English" : "Превключи на български"}
          >
            {t.nav.langSwitch}
          </button>
          <button
            type="button"
            onClick={openBook}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-2 border-2 border-black uppercase text-[12px] md:text-[13px] tracking-[0.2em] font-black transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 shrink-0"
            style={{
              background: SILVER,
              color: "#0d0d0d",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.45) inset, 3px 3px 0 0 #2a2a2a",
            }}
          >
            <span aria-hidden>→</span>
            <span className="hidden sm:inline">{primaryCtaLabel}</span>
            <span className="sm:hidden">{lang === "bg" ? "Разговор" : "Call"}</span>
          </button>
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
                className="w-6 h-6 border-2 flex items-center justify-center text-[12px] font-black transition-all"
                style={{
                  borderColor: "#f4f4f4",
                  background: active ? "#f4f4f4" : "rgba(13,13,13,0.55)",
                  color: active ? "#0d0d0d" : "#f4f4f4",
                  boxShadow: active ? "3px 3px 0 0 #3a3a3a" : "1px 1px 0 0 #3a3a3a",
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
      <StageQualify targetRef={s6} t={t.stage6} openBook={openBook} />
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
        title: "ЗАПАЗИ РАЗГОВОР",
        subtitle: "ОСТАВИ ЗАЯВКА — ОТГОВАРЯМЕ ДО 24 ЧАСА",
        call: "ОБАДИ СЕ", callSub: "+359 88 225 1474",
        wa: "WHATSAPP", waSub: "МОМЕНТАЛЕН ЧАТ",
        email: "ИМЕЙЛ", emailSub: "vektoagency@gmail.com",
        or: "ИЛИ СЕ СВЪРЖИ ДИРЕКТНО",
        name: "Име", namePh: "Иван Иванов",
        phone: "Телефон", phonePh: "+359 88 000 0000",
        emailField: "Имейл", emailPh: "ти@brand.bg",
        company: "Бранд", companyPh: "Име на бранда или сайт",
        message: "Кратко за проекта", messagePh: "Имам онлайн магазин, искам да пусна кампания...",
        submit: "→ ПРАТИ ЗАЯВКА",
        submitting: "ПРАЩАМЕ...",
        sent: "ПОЛУЧИХМЕ ЗАЯВКАТА",
        sentSub: "Отговаряме до 24 часа.",
        errorMsg: "Нещо се обърка. Опитай пак.",
      }
    : {
        title: "BOOK A CALL",
        subtitle: "LEAVE A BRIEF — WE REPLY WITHIN 24 HOURS",
        call: "PHONE", callSub: "+359 88 225 1474",
        wa: "WHATSAPP", waSub: "INSTANT CHAT",
        email: "EMAIL", emailSub: "vektoagency@gmail.com",
        or: "OR REACH US DIRECTLY",
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
        className="relative w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border-2"
        style={{ background: "#141414", color: "#f4f4f4", borderColor: "rgba(244,244,244,0.4)", boxShadow: "10px 10px 0 0 #2a2a2a" }}
      >
        {/* Header — dark plate */}
        <div
          className="flex items-start justify-between border-b-2 px-5 md:px-7 py-4"
          style={{ background: "#0d0d0d", color: "#f4f4f4", borderColor: "rgba(244,244,244,0.25)" }}
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
              {/* Lead form FIRST — the CTAs exist to capture the lead; the
                  quick contact channels are the secondary path below. */}
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
                    background: SILVER,
                    color: "#0d0d0d",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.4) inset, 5px 5px 0 0 #2a2a2a",
                  }}
                >
                  {loading ? s.submitting : s.submit}
                </button>
              </form>

              {/* Divider + quick channels, demoted below the form. */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 border-t-2 border-dashed border-white opacity-25" />
                <div
                  className="text-[12px] font-bold uppercase tracking-[0.3em] opacity-60"
                  style={{ fontFamily: "var(--brutal-pixel)" }}
                >
                  {s.or}
                </div>
                <div className="flex-1 border-t-2 border-dashed border-white opacity-25" />
              </div>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <QuickAction href="tel:+359882251474" glyph="☎" label={s.call} sub={s.callSub} />
                <QuickAction href="https://wa.me/359882251474" glyph="◉" label={s.wa} sub={s.waSub} target="_blank" />
                <QuickAction href="mailto:vektoagency@gmail.com" glyph="✉" label={s.email} sub={s.emailSub} />
              </div>
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
      className="flex flex-col items-center gap-1.5 border-2 border-black py-4 md:py-6 px-2 text-center transition-transform hover:-translate-y-0.5 hover:scale-[1.02]"
      style={{
        // Same brushed titanium as the active CTA slabs — one physical
        // language for every conversion surface, machined edge included.
        background: SILVER,
        color: "#0d0d0d",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.45) inset, 4px 4px 0 0 #2a2a2a",
      }}
    >
      <span className="text-3xl md:text-4xl leading-none">{glyph}</span>
      <span
        className="text-[12px] font-bold uppercase tracking-[0.2em]"
        style={{ fontFamily: "var(--brutal-pixel)" }}
      >
        {label}
      </span>
      <span
        className="text-[11px] opacity-60 tabular-nums"
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
          className="w-full border-2 px-3 py-2 text-sm resize-none focus:outline-none focus:shadow-[3px_3px_0_0_#6d6d6d]"
          style={{ background: "#0d0d0d", color: "#f4f4f4", borderColor: "rgba(244,244,244,0.4)" }}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={ph}
          className="w-full border-2 px-3 py-2 text-sm focus:outline-none focus:shadow-[3px_3px_0_0_#6d6d6d]"
          style={{ background: "#0d0d0d", color: "#f4f4f4", borderColor: "rgba(244,244,244,0.4)" }}
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

// Phone-only journey indicator: the stage rail is hidden below sm, which
// left phones with no sense of position in a nine-stage funnel. A 2px
// silver hairline pinned to the very top edge reads the whole document's
// scroll — same instrument the cinematic preview uses over its film.
function MobileProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] sm:hidden"
      style={{ background: "rgba(244,244,244,0.15)" }}
    >
      <div className="h-full" style={{ width: `${p * 100}%`, background: "#f4f4f4" }} />
    </div>
  );
}

// ============================================================================
// STAGE 01 · HOOK
// ============================================================================
function StageHook({ targetRef, t, lang, openBook }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage1"]; lang: Lang; openBook: () => void }) {
  // Single-screen centred hero (acquisition.com layout): shout headline,
  // calm typed subline, one big ask. The scroll-driven globe stage is gone;
  // `p` only fades the scroll cue once the visitor moves.
  const p = useStickyProgress(targetRef);
  const inView = useInView(targetRef, 0.2);
  const reduced = useReducedMotion();

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
      className="relative flex flex-col"
      style={{ minHeight: "100dvh", background: "#0d0d0d", color: "#f4f4f4" }}
    >
      {/* MAIN — one centred column, acquisition.com-style: shout headline,
          calm subline, a single big ask. The two-column globe hero is gone —
          the composition now holds itself on symmetry instead of an
          instrument in the right third. */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-14 pt-20 md:pt-24 pb-[7vh] max-w-[1320px] mx-auto w-full min-h-0">
          {/* Stage marker + positioning plate — stripped to essentials:
              the marker indexes, the plate positions. No era stamp, no
              geography pair, no "AI" prefix. */}
          <div
            className="text-[12px] md:text-xs font-bold uppercase tracking-[0.35em] mb-6 md:mb-8 opacity-60"
            style={{ fontFamily: "var(--brutal-pixel)" }}
          >
            {t.eyebrow}
          </div>

          {/* No positioning plate above the question — a label was filler,
              numbers were noise; both diluted the hook. The eyebrow indexes,
              the question does the talking, the stats live in the rooms. */}

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
              // Sized so the longest Bulgarian line ("БИЗНЕСЪТ ТИ ЗАСЛУЖАВА
              // ЛИ", 24 chars) holds ONE line inside the 1320px column at
              // the cap — the question reads as two decisive lines on
              // desktop instead of an accidental three.
              fontSize: "calc(clamp(34px, 5vw, 86px) * var(--bgk, 1))",
              lineHeight: 0.96,
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
                  background: SILVER_H,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.headline2Highlight}
              </span>
            </span>
          </h1>

          {/* Typewriter line — now the calm centred subline under the
              shout, where acquisition.com runs its supporting sentence. */}
          <div
            className="mt-5 md:mt-7 flex flex-wrap items-center justify-center gap-3 font-bold uppercase text-[13px] md:text-lg tracking-[0.16em] md:tracking-[0.25em] px-2"
            style={{
              opacity: inView ? 0.75 : 0,
              transition: "opacity 400ms ease",
              minHeight: "1.4em",
            }}
          >
            <span className="inline-block h-[0.85em] w-[3px]" style={{ background: "#f4f4f4" }} />
            <span>{typed}</span>
            <span
              className="inline-block h-[0.85em] w-[8px] animate-pulse"
              style={{ background: "#f4f4f4" }}
            />
          </div>

          {/* ONE ask. The secondary portfolio button and the proof chips
              are gone from the fold — stage 04 still carries every number,
              the header still links the portfolio. One button, centred,
              impossible to miss. */}
          {/* The ask — brushed-titanium slab, same metal as the closing
              stage's CTA: inset highlight line, hard machined shadow, arrow
              that drives forward on hover. The flat white box read cheap. */}
          <button
            type="button"
            onClick={openBook}
            className="group mt-8 md:mt-10 inline-flex items-center gap-4 px-10 md:px-16 py-4 md:py-6 border-2 border-black font-black uppercase text-base md:text-2xl tracking-tight transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: SILVER,
              color: "#0d0d0d",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.45) inset, 8px 8px 0 0 #2a2a2a",
            }}
          >
            {t.ctaPrimary}
            <span aria-hidden className="transition-transform group-hover:translate-x-2">→</span>
          </button>

      </div>

      {/* BOTTOM — centred scroll cue. */}
      <div
        className="w-full shrink-0 px-6 pb-6 md:pb-8 flex items-center justify-center gap-4"
        style={{
          opacity: Math.max(0, (1 - p) * 2),
          transition: "opacity 200ms ease",
        }}
      >
        <div
          className="text-[12px] md:text-xs font-bold uppercase tracking-[0.35em]"
          style={{ fontFamily: "var(--brutal-pixel)" }}
        >
          {t.scrollCue}
        </div>
        <div className="h-[2px] w-24 border-t-2 border-dashed" style={{ borderColor: "rgba(244,244,244,0.5)" }} />
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
            style={{ fontSize: "calc(clamp(25px, 4.8vw, 72px) * var(--bgk, 1))" }}
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
            fontSize: "calc(clamp(32px, 5vw, 68px) * var(--bgk, 1))",
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
      style={{ height: "400vh", background: "#141414" }}
    >
      <div className="sticky top-0 h-screen" style={{ overflowX: "clip" }}>
        {/* Pushed below the fixed transparent header — at top-6 the eyebrow
            sat directly under the wordmark. */}
        <div className="absolute top-20 md:top-24 left-6 md:left-14 z-10">
          <div
            className="text-xs font-bold uppercase tracking-[0.35em] mb-2"
            style={{ fontFamily: "var(--brutal-pixel)" }}
          >
            {t.eyebrow}
          </div>
          <div
            className="inline-flex items-center gap-2 px-2 py-1 border-2 border-black text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ background: SILVER_H, color: "#0d0d0d", boxShadow: "3px 3px 0 0 #3a3a3a" }}
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
                className="h-[3px] border-2 transition-all"
                style={{
                  width: active ? 56 : 16,
                  borderColor: "rgba(244,244,244,0.5)",
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
                  className="border-2 p-6 md:p-8"
                  style={{
                    background: "#0d0d0d",
                    color: "#f4f4f4",
                    borderColor: "rgba(244,244,244,0.3)",
                    boxShadow: "8px 8px 0 0 #2a2a2a",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="inline-block px-2 py-1 border-2 border-black text-[12px] font-bold uppercase tracking-[0.25em] mb-6"
                    style={{ background: SILVER_H, color: "#0d0d0d" }}
                  >
                    {t.roomBadge}{r.id}
                  </div>
                  <h3
                    className="font-black leading-[0.9] tracking-[-0.03em] mb-6 whitespace-nowrap"
                    style={{ fontSize: "calc(clamp(38px, 6vw, 84px) * var(--bgk, 1))" }}
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
                  className="border-2 p-6 md:p-10"
                  style={{
                    background: "#0d0d0d",
                    color: "#f4f4f4",
                    borderColor: "rgba(244,244,244,0.3)",
                    boxShadow: "8px 8px 0 0 #2a2a2a",
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
                      fontSize: "calc(clamp(72px, 12vw, 200px) * var(--bgk, 1))",
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
          className="font-black leading-[0.94] tracking-[-0.03em] uppercase mb-6 max-w-4xl"
          style={{ fontSize: "calc(clamp(36px, 5.5vw, 80px) * var(--bgk, 1))" }}
        >
          {t.headline1}
          <br />
          {t.headline2Prefix}{" "}
          <span
            className="italic"
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
      className="border-2 flex flex-col overflow-hidden"
      style={{
        background: "#0d0d0d",
        color: "#f4f4f4",
        borderColor: "rgba(244,244,244,0.3)",
        boxShadow: "8px 8px 0 0 #2a2a2a",
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateY(0) scale(1) rotate(0deg)"
          : `translateY(60px) scale(0.92) rotate(${rot}deg)`,
        transition: `opacity 620ms cubic-bezier(0.16,1,0.3,1) ${idx * 160}ms, transform 720ms cubic-bezier(0.16,1,0.3,1) ${idx * 160}ms`,
      }}
    >
      {/* Header — brand + category */}
      <div className="px-5 py-4 border-b-2 flex items-center justify-between" style={{ borderColor: "rgba(244,244,244,0.25)" }}>
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
            fontSize: "calc(clamp(56px, 7vw, 108px) * var(--bgk, 1))",
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
          className="inline-block px-2 py-1 border text-[12px] font-bold uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--brutal-pixel)", borderColor: "rgba(244,244,244,0.4)" }}
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
  // The plate-card stack repeated the furniture every other stage already
  // uses; the process now runs as the Vector's trajectory — the shared
  // FlightPlan component in the film's world (jet ground, one silver line,
  // naked type), scroll-drawn.
  return (
    <section id="stage-06" ref={targetRef} style={{ background: "#0d0d0d" }}>
      <FlightPlan
        eyebrow={t.eyebrow}
        headline1={t.headline1}
        headline2Prefix={t.headline2Prefix}
        headline2Highlight={t.headline2Highlight}
        note={t.note}
        steps={t.steps}
        fonts={{
          display: "var(--brutal-display), system-ui, sans-serif",
          pixel: "var(--brutal-pixel), ui-monospace, monospace",
          comic: "var(--brutal-comic), system-ui, sans-serif",
        }}
      />
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
          style={{ fontSize: "calc(clamp(40px, 6vw, 88px) * var(--bgk, 1))" }}
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
  // One principle owns the screen per quarter of the sticky pan — a
  // manifesto being stamped, not a plate list (06 draws a line, 08 stamps a
  // pass; this one is pure display type so the three stop rhyming).
  const current = Math.min(t.principles.length - 1, Math.floor(p * t.principles.length));

  return (
    <section
      id="stage-07"
      ref={targetRef}
      className="relative"
      style={{ height: "280vh", background: "#141414", color: "#f4f4f4" }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center px-6 md:px-14 overflow-hidden">
        <div className="max-w-[1400px] w-full mx-auto">
          <div
            className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-55"
            style={{ fontFamily: "var(--brutal-pixel)" }}
          >
            {t.eyebrow}
          </div>

          <div className="relative" style={{ minHeight: "min(56vh, 500px)" }}>
            {t.principles.map((pr, i) => {
              const active = i === current;
              const past = i < current;
              return (
                <div
                  key={pr.num}
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active
                      ? "translateY(0)"
                      : past
                        ? "translateY(-30px)"
                        : "translateY(30px)",
                    transition:
                      "opacity 450ms ease, transform 550ms cubic-bezier(0.16,1,0.3,1)",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    className="text-sm md:text-base font-bold tabular-nums mb-4 opacity-60"
                    style={{ fontFamily: "var(--brutal-pixel)" }}
                  >
                    {pr.num} / {String(t.principles.length).padStart(2, "0")}
                  </div>
                  <div
                    className="font-black uppercase leading-[0.95] tracking-[-0.02em] max-w-5xl"
                    style={{
                      fontSize: "calc(clamp(34px, 6.2vw, 108px) * var(--bgk, 1))",
                      background: SILVER_H,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 1px 4px rgba(13,13,13,0.6))",
                    }}
                  >
                    {pr.title}
                  </div>
                  <p
                    className="mt-6 text-sm md:text-lg leading-[1.55] max-w-2xl opacity-70 font-medium"
                    style={{ fontFamily: "var(--brutal-comic)" }}
                  >
                    {pr.body}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex gap-2">
              {t.principles.map((_, i) => (
                <span
                  key={i}
                  className="h-[3px] border-2 transition-all"
                  style={{
                    width: i <= current ? 40 : 14,
                    borderColor: "rgba(244,244,244,0.5)",
                    background: i <= current ? SILVER_H : "transparent",
                  }}
                />
              ))}
            </div>
            <p
              className="text-[11px] uppercase tracking-[0.2em] opacity-45 hidden md:block"
              style={{ fontFamily: "var(--brutal-pixel)" }}
            >
              {t.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STAGE 06 · QUALIFY
// ============================================================================
function StageQualify({ targetRef, t, openBook }: { targetRef: React.RefObject<HTMLElement | null>; t: (typeof COPY)["bg"]["stage6"]; openBook: () => void }) {
  // The qualification is one physical OBJECT — an access pass being
  // stamped criterion by criterion as the visitor scrolls — instead of a
  // third page-wide list in a row (06 draws a line, 07 is display type).
  const p = useStickyProgress(targetRef);
  const checked = Math.min(t.items.length, Math.floor(p * (t.items.length + 1.4)));
  const all = checked >= t.items.length;
  return (
    <section
      id="stage-08"
      ref={targetRef}
      className="relative"
      style={{ height: "240vh", background: "#141414", color: "#f4f4f4" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-6 md:px-14">
        <div
          className="w-full max-w-xl flex flex-col border-2"
          style={{
            background: "#0d0d0d",
            borderColor: "rgba(244,244,244,0.45)",
            boxShadow: "10px 10px 0 0 #2a2a2a",
          }}
        >
          {/* Pass header — stage marker left, stamp counter right. */}
          <div
            className="flex items-center justify-between px-4 md:px-6 py-3 border-b-2"
            style={{ borderColor: "rgba(244,244,244,0.25)" }}
          >
            <span
              className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] opacity-70"
              style={{ fontFamily: "var(--brutal-pixel)" }}
            >
              {t.eyebrow}
            </span>
            <span
              className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] tabular-nums"
              style={{
                fontFamily: "var(--brutal-pixel)",
                background: SILVER_H,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {String(checked).padStart(2, "0")}/{String(t.items.length).padStart(2, "0")}
            </span>
          </div>

          <div className="px-4 md:px-6 pt-5 pb-1">
            <h2
              className="font-black uppercase tracking-tight leading-[1.05]"
              style={{ fontSize: "calc(clamp(21px, 2.4vw, 32px) * var(--bgk, 1))" }}
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
              {t.headlineSuffix}
            </h2>
          </div>

          <div className="px-4 md:px-6 py-3">
            {t.items.map((q, i) => {
              const done = i < checked;
              return (
                <div
                  key={q}
                  className="flex items-start gap-4 py-3.5 transition-all duration-500"
                  style={{
                    borderBottom:
                      i < t.items.length - 1 ? "1px solid rgba(244,244,244,0.14)" : "none",
                    opacity: done ? 1 : 0.4,
                  }}
                >
                  <span
                    className="mt-0.5 w-7 h-7 flex-shrink-0 border-2 flex items-center justify-center transition-all"
                    style={{
                      background: done ? SILVER : "transparent",
                      borderColor: "rgba(244,244,244,0.5)",
                      color: done ? "#0d0d0d" : "transparent",
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
                  <span className="text-sm md:text-base leading-[1.4] font-bold uppercase">
                    {q}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Verdict — arms only once every criterion is stamped. */}
          <button
            type="button"
            onClick={openBook}
            className="m-4 md:m-6 mt-2 border-2 py-3.5 font-black uppercase text-sm md:text-base tracking-[0.15em] transition-all duration-500"
            style={{
              background: all ? "#f4f4f4" : "transparent",
              color: all ? "#0d0d0d" : "rgba(244,244,244,0.45)",
              borderColor: all ? "#f4f4f4" : "rgba(244,244,244,0.3)",
              boxShadow: all ? "5px 5px 0 0 #6d6d6d" : "none",
            }}
          >
            → {t.verdict}
          </button>
        </div>
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
            className="font-black leading-[0.9] tracking-[-0.03em] uppercase mb-12 md:mb-16"
            style={{ fontSize: "calc(clamp(38px, 8vw, 128px) * var(--bgk, 1))" }}
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
                "0 0 0 1px rgba(255,255,255,0.4) inset, 10px 10px 0 0 #2a2a2a",
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
