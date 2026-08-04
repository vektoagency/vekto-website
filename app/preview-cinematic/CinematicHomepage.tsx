"use client";

// ============================================================================
// /preview-cinematic — the One-Prompt-Pack treatment, in VEKTO's own language.
//
// The pack's ten prompts all reduce to the same machine: scroll IS the
// playhead. A clip is scrubbed frame by frame as you scroll, text is pinned to
// scroll position rather than fading in on view, a HUD reads out where you are,
// and one word at a time slams onto the screen.
//
// Two deliberate departures from the pack:
//
// 1. The footage is REAL. Every prompt in the pack generates a fictional
//    subject (a Swiss watch, a submersible, a hypercar) with Seedance. VEKTO
//    is an agency selling delivered work, so inventing a showreel would be the
//    one thing that undercuts the page. This scrubs the actual 26-second
//    VEKTO showreel and the work grid plays the actual client spots.
//
// 2. The reel is VERTICAL, so it is not a full-bleed backdrop. Every source
//    video in this project is 9:16 except one — because 9:16 is what the
//    agency ships. Stretching a vertical reel across a 16:9 hero would crop
//    away the work to imitate a layout. It scrubs inside a hard housing
//    instead, and the massive type works around it.
//
// Palette and rules stay brutalist: bone paper, jet black, silver doing the
// job the pack gives to gold. No radii, no soft glows, hard offset shadows.
// ============================================================================

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";

const ScrubReel = dynamic(() => import("./ScrubReel"), { ssr: false });

// ---------------------------------------------------------------------------
// PALETTE — shared with /preview-brutalism so the two previews are comparable.
// ---------------------------------------------------------------------------
const BONE = "#ebe8e0";
const JET = "#0d0d0d";
const SILVER_H =
  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 20%, #8a8a8a 45%, #eaeaea 55%, #6d6d6d 80%, #b0b0b0 100%)";
const GRAPHITE_IN =
  "linear-gradient(90deg, #6d6d6d 0%, #2a2a2a 30%, #5a5a5a 58%, #232323 100%)";
const WORDMARK_METAL =
  "linear-gradient(180deg, #d4d4d4 0%, #a8a8a8 40%, #7a7a7a 70%, #969696 100%)";

// ---------------------------------------------------------------------------
// REAL WORK.
//
// Two rules this list is built on, both of them the hard kind:
//
//  1. Every poster is a frame pulled from THAT video, not a stock frame from
//     the showreel. The first pass reused hero-anim frames as posters, which
//     put an ISOSPORT end-card under a card captioned NUTRIFITT — a client's
//     work presented as another client's. Posters are now extracted per file.
//
//  2. Only brands that can be verified appear. `aslan-gold-script-1.mp4` is
//     in the repo but "Aslan" is on neither the roster nor anywhere else in
//     this project, and reading a client name off a filename is guessing. It
//     is left out rather than captioned with an assumption.
// ---------------------------------------------------------------------------
const WORK = [
  { brand: "NUTRIFITT",     region: "US", src: "/videos/nutrifitt-identity-480p.mp4", poster: "/scrub/work/nutrifitt-identity.webp" },
  { brand: "PARFEN",        region: "BG", src: "/videos/parfen-script-7-480p.mp4",    poster: "/scrub/work/parfen-script-7.webp" },
  { brand: "ISOSPORT",      region: "BG", src: "/videos/isosport-script-2-480p.mp4",  poster: "/scrub/work/isosport-script-2.webp" },
  { brand: "ETHAN'S",       region: "US", src: "/videos/ethans-pre-workout-480p.mp4", poster: "/scrub/work/ethans-pre-workout.webp" },
  { brand: "beMe",          region: "BG", src: "/videos/beme-script-9-480p.mp4",      poster: "/scrub/work/beme-script-9.webp" },
  { brand: "GOURMET HOUSE", region: "BG", src: "/videos/gourmet-2-480p.mp4",          poster: "/scrub/work/gourmet-2.webp" },
  { brand: "NUTRIFITT",     region: "US", src: "/videos/nutrifitt-carnage-480p.mp4",  poster: "/scrub/work/nutrifitt-carnage.webp" },
  { brand: "VEKTO",         region: "BG", src: "/videos/vekto-hf-spot-480p.mp4",      poster: "/scrub/work/vekto-hf-spot.webp" },
] as const;

const COPY = {
  bg: {
    nav: ["Портфолио", "Кейсове", "Анкета"],
    cta: "Запази разговор",
    heroKicker: "VEKTO · AI GROWTH AGENCY · БЪЛГАРИЯ · САЩ",
    heroLine1: "ТВОЯТ ПАРТНЬОР",
    heroLine2Prefix: "ЗА",
    heroLine2Hi: "РАСТЕЖ ОНЛАЙН.",
    heroSub: "Реклами, креатив и сайтове под един покрив.",
    reelLabel: "ШОУРИЙЛ",
    reelHint: "СКРОЛНИ, ЗА ДА ПУСНЕШ",
    scrollCue: "▼ ПРОДЪЛЖИ",
    manifestoEyebrow: "КАК РАБОТИМ",
    manifesto: ["ЯСНО.", "БЪРЗО.", "С ЧИСЛА."],
    manifestoTail: "Без агенцийски мъгли. Виждаш какво излиза и какво връща.",
    workEyebrow: "РАБОТАТА",
    workHeadline1: "РЕАЛНИ БРАНДОВЕ.",
    workHeadline2: "РЕАЛНИ ВИДЕА.",
    workNote: "Всяко видео долу е пуснато по реклама. Мини с мишката, за да го пуснеш.",
    workAll: "ВИЖ ЦЯЛОТО ПОРТФОЛИО",
    proofEyebrow: "РЕЗУЛТАТИ",
    proof: [
      { metric: "5.2×", brand: "MEN'S CARE" },
      { metric: "7.7×", brand: "PARFEN" },
      { metric: "10×",  brand: "FREYA" },
    ],
    proofNote: "ROAS по реални кампании.",
    endEyebrow: "ОТ ТУК НАТАТЪК",
    endLine1: "ИМАШ БРАНД",
    endLine2Hi: "ЗА РАСТЕЖ?",
    endCta: "ЗАПАЗИ РАЗГОВОР",
    endMeta: "България · САЩ",
  },
  en: {
    nav: ["Portfolio", "Case Studies", "Brief"],
    cta: "Book a call",
    heroKicker: "VEKTO · AI GROWTH AGENCY · BULGARIA · USA",
    heroLine1: "YOUR PARTNER",
    heroLine2Prefix: "FOR",
    heroLine2Hi: "ONLINE GROWTH.",
    heroSub: "Ads, creative and websites under one roof.",
    reelLabel: "SHOWREEL",
    reelHint: "SCROLL TO PLAY",
    scrollCue: "▼ CONTINUE",
    manifestoEyebrow: "HOW WE WORK",
    manifesto: ["CLEAR.", "FAST.", "IN NUMBERS."],
    manifestoTail: "No agency fog. You see what ships and what it returns.",
    workEyebrow: "THE WORK",
    workHeadline1: "REAL BRANDS.",
    workHeadline2: "REAL VIDEO.",
    workNote: "Every spot below has run as an ad. Hover to play.",
    workAll: "SEE THE FULL PORTFOLIO",
    proofEyebrow: "RESULTS",
    proof: [
      { metric: "5.2×", brand: "MEN'S CARE" },
      { metric: "7.7×", brand: "PARFEN" },
      { metric: "10×",  brand: "FREYA" },
    ],
    proofNote: "ROAS on real campaigns.",
    endEyebrow: "FROM HERE",
    endLine1: "GOT A BRAND",
    endLine2Hi: "WORTH GROWING?",
    endCta: "BOOK A CALL",
    endMeta: "Bulgaria · USA",
  },
} as const;

type Lang = keyof typeof COPY;

// ---------------------------------------------------------------------------
// HOOKS
// ---------------------------------------------------------------------------
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

/** 0 while a sticky section is latched, 1 as it releases. */
function useStickyProgress(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      if (range <= 0) { setP(rect.top < 0 ? 1 : 0); return; }
      setP(Math.max(0, Math.min(1, -rect.top / range)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
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

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.3) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true); },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return v;
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------
export default function CinematicHomepage() {
  const [lang, setLang] = useState<Lang>("bg");
  useEffect(() => {
    const saved = localStorage.getItem("vekto.lang");
    if (saved === "bg" || saved === "en") setLang(saved);
  }, []);
  const setLangPersist = useCallback((l: Lang) => {
    setLang(l);
    try { localStorage.setItem("vekto.lang", l); } catch {}
  }, []);
  const t = COPY[lang];
  const reduced = useReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const heroP = useStickyProgress(heroRef);
  const manifestoP = useStickyProgress(manifestoRef);

  // --- Lenis ---------------------------------------------------------------
  // The pack calls for Lenis on every build, and a frame-scrub hero genuinely
  // needs it: native wheel scrolling arrives in coarse ~100px jumps, which
  // makes an 84-frame sequence step 3–4 frames at a time and read as stutter.
  // Lenis interpolates between those jumps so the reel scrubs continuously.
  // Skipped entirely under reduced motion — hijacking scroll is exactly what
  // that preference is asking us not to do.
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return (
    <div
      className="relative"
      style={{
        background: BONE,
        color: JET,
        fontFamily: "var(--cine-display), system-ui, sans-serif",
        // Pinned sections translate their content off-axis; clip so none of
        // it can widen the document. `clip` not `hidden`, or every sticky
        // section on the page stops sticking.
        overflowX: "clip",
      }}
    >
      <CursorDot disabled={reduced} />

      {/* CRT texture, same as the brutalist preview. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.055) 0px, rgba(0,0,0,0.055) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <Header lang={lang} setLang={setLangPersist} t={t} />

      <HeroScrub targetRef={heroRef} p={heroP} t={t} reduced={reduced} />
      <HazardStrip />
      <Manifesto targetRef={manifestoRef} p={manifestoP} t={t} />
      <HazardStrip />
      <Work t={t} />
      <HazardStrip />
      <Proof t={t} />
      <HazardStrip />
      <EndCard t={t} />

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CURSOR — the pack asks for a dot with a trailing ring. Silver, not gold.
// Pointer-only: a touch device has no cursor to replace, and the ring would
// just be a stray dot parked wherever the last tap landed.
// ---------------------------------------------------------------------------
function CursorDot({ disabled }: { disabled: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    // `disabled` arrives false on first render and flips true once the
    // reduced-motion query resolves, so this must actively tear the cursor
    // down again — an early `return` alone left it mounted and tracking.
    if (disabled || !window.matchMedia("(pointer: fine)").matches) {
      setOn(false);
      return;
    }
    setOn(true);

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; };
    const loop = () => {
      // Ring lags the dot; that lag is the whole effect.
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [disabled]);

  if (!on) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[300] hidden lg:block">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 w-8 h-8 -ml-4 -mt-4 border-2"
        style={{ borderColor: "rgba(13,13,13,0.45)", willChange: "transform" }}
      />
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-2 h-2 -ml-1 -mt-1"
        style={{ background: JET, willChange: "transform" }}
      />
    </div>
  );
}

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

function Header({ lang, setLang, t }: { lang: Lang; setLang: (l: Lang) => void; t: (typeof COPY)[Lang] }) {
  const hrefs = ["/portfolio", "/case-studies", "/brief"];
  return (
    <div className="border-b-4 border-black relative z-40" style={{ background: JET, color: "#f4f4f4" }}>
      <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-x-6 md:gap-x-10 min-w-0">
          <Link
            href="/preview-cinematic"
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
            {t.nav.map((label, i) => (
              <Link key={label} href={hrefs[i]} className="opacity-70 hover:opacity-100 transition-opacity">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            onClick={() => setLang(lang === "bg" ? "en" : "bg")}
            className="px-2.5 md:px-3 py-2 font-bold uppercase text-xs tracking-[0.25em] transition-colors hover:bg-white hover:text-black"
            style={{ background: "transparent", color: "#f4f4f4", border: "1.5px solid rgba(244,244,244,0.4)" }}
            aria-label={lang === "bg" ? "Switch to English" : "Превключи на български"}
          >
            {lang === "bg" ? "EN" : "БГ"}
          </button>
          <Link
            href="/brief"
            className="inline-flex items-center gap-2 px-3 md:px-4 py-2 border-2 uppercase text-[12px] md:text-[13px] tracking-[0.2em] font-black transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{ background: JET, color: "#f4f4f4", boxShadow: "3px 3px 0 0 #8a8a8a", borderColor: "#f4f4f4" }}
          >
            <span aria-hidden>→</span>
            <span className="hidden sm:inline">{t.cta}</span>
            <span className="sm:hidden">{lang === "bg" ? "Разговор" : "Call"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HERO — the scrub. Sticky for 3.2 viewports; scroll position is the playhead.
// ---------------------------------------------------------------------------
function HeroScrub({
  targetRef, p, t, reduced,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  p: number;
  t: (typeof COPY)[Lang];
  reduced: boolean;
}) {
  const [ready, setReady] = useState(false);
  const onReady = useCallback((r: boolean) => setReady(r), []);

  // Headline tracks in over the first third; the reel keeps scrubbing after.
  const enter = Math.min(1, p / 0.25);
  const frame = Math.round(p * 83) + 1;

  return (
    <section
      ref={targetRef}
      className="relative"
      // Under reduced motion the sticky runway is pointless — there is no
      // scrub to drive — so the hero collapses to a single screen.
      style={{ height: reduced ? "100dvh" : "320vh", background: BONE }}
    >
      <div className="sticky top-0 h-[100dvh] min-h-[100vh] flex flex-col overflow-hidden">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_min(30vw,340px)] items-center gap-8 xl:gap-14 px-6 md:px-14 pt-6 pb-4 max-w-[1500px] mx-auto w-full min-h-0">
          {/* LEFT — type */}
          <div className="min-w-0">
            <div
              className="text-[12px] md:text-xs font-bold uppercase tracking-[0.35em] mb-4 opacity-60"
              style={{ fontFamily: "var(--cine-pixel)" }}
            >
              {t.heroKicker}
            </div>
            <h1
              className="font-black tracking-[-0.03em]"
              style={{ fontSize: "clamp(34px, 4.9vw, 84px)", lineHeight: 0.94 }}
            >
              <span
                className="block"
                style={{
                  opacity: enter,
                  transform: `translateY(${(1 - enter) * 18}px)`,
                  transition: "none",
                }}
              >
                {t.heroLine1}
              </span>
              <span
                className="block"
                style={{
                  opacity: Math.max(0, Math.min(1, (p - 0.06) / 0.19)),
                  transform: `translateY(${(1 - Math.max(0, Math.min(1, (p - 0.06) / 0.19))) * 18}px)`,
                }}
              >
                {t.heroLine2Prefix}{" "}
                <span
                  className="italic"
                  style={{
                    background: GRAPHITE_IN,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {t.heroLine2Hi}
                </span>
              </span>
            </h1>
            <p
              className="mt-6 md:mt-8 text-base md:text-lg max-w-lg leading-[1.5] font-medium opacity-80"
              style={{ fontFamily: "var(--cine-comic)" }}
            >
              {t.heroSub}
            </p>
            <div className="flex flex-wrap gap-3 mt-7 md:mt-9">
              <Link
                href="/brief"
                className="inline-flex items-center gap-2 px-5 md:px-7 py-3 md:py-4 border-2 border-black font-black uppercase text-sm md:text-base tracking-[0.15em] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{ background: JET, color: "#f4f4f4", boxShadow: "5px 5px 0 0 #8a8a8a" }}
              >
                <span aria-hidden>→</span>
                {t.endCta}
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-5 md:px-6 py-3 md:py-4 border-2 border-black font-black uppercase text-sm md:text-base tracking-[0.15em] transition-colors hover:bg-black hover:text-[#ebe8e0]"
                style={{ background: "transparent", color: JET }}
              >
                <span aria-hidden>▶</span>
                {t.nav[0]}
              </Link>
            </div>
          </div>

          {/* RIGHT — the scrubbing reel, in an instrument housing */}
          <div
            className="hidden lg:flex flex-col self-center border-2 border-black"
            style={{ background: JET, boxShadow: "7px 7px 0 0 #8a8a8a" }}
          >
            <div
              className="flex items-center justify-between px-3 py-2 border-b-2 text-[12px] uppercase tracking-[0.25em]"
              style={{ borderColor: "#8a8a8a", color: "#f4f4f4", fontFamily: "var(--cine-pixel)" }}
            >
              <span>{t.reelLabel}</span>
              <span className="tabular-nums opacity-60">
                {String(frame).padStart(3, "0")}/084
              </span>
            </div>
            <ScrubReel progress={p} onReady={onReady} className="w-full" />
            <div
              className="px-3 py-2 border-t-2 text-[12px] uppercase tracking-[0.2em] opacity-60"
              style={{ borderColor: "#8a8a8a", color: "#f4f4f4", fontFamily: "var(--cine-pixel)" }}
            >
              {ready ? t.reelHint : "..."}
            </div>
          </div>
        </div>

        {/* Scroll cue + scrub progress rule */}
        <div
          className="max-w-[1500px] mx-auto w-full shrink-0 px-6 md:px-14 pb-6 md:pb-8"
          style={{ opacity: Math.max(0, 1 - (p - 0.9) / 0.1) }}
        >
          <div className="flex items-center gap-4">
            <div
              className="text-[12px] md:text-xs font-bold uppercase tracking-[0.35em]"
              style={{ fontFamily: "var(--cine-pixel)" }}
            >
              {t.scrollCue}
            </div>
            <div className="flex-1 h-[2px] max-w-40 border-t-2 border-dashed border-black relative">
              <span
                className="absolute left-0 -top-[2px] h-[2px]"
                style={{ width: `${p * 100}%`, background: JET }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MANIFESTO — the pack's kinetic section: one word per scroll step, slammed
// on rather than faded in.
// ---------------------------------------------------------------------------
function Manifesto({
  targetRef, p, t,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  p: number;
  t: (typeof COPY)[Lang];
}) {
  const words = t.manifesto;
  return (
    <section
      ref={targetRef}
      className="relative"
      style={{ height: "260vh", background: JET, color: "#f4f4f4" }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center px-6 md:px-14 max-w-[1500px] mx-auto">
        <div
          className="text-xs font-bold uppercase tracking-[0.35em] mb-10 opacity-60"
          style={{ fontFamily: "var(--cine-pixel)" }}
        >
          {t.manifestoEyebrow}
        </div>
        <div className="space-y-2 md:space-y-4">
          {words.map((w, i) => {
            // Each word owns an equal slice of the scroll; it lands hard at
            // the start of its slice and holds.
            const slice = 0.78 / words.length;
            const local = Math.max(0, Math.min(1, (p - i * slice) / (slice * 0.45)));
            return (
              <div
                key={w}
                className="font-black uppercase leading-[0.9] tracking-[-0.03em]"
                style={{
                  fontSize: "clamp(48px, 11vw, 168px)",
                  opacity: local,
                  transform: `translateX(${(1 - local) * -60}px)`,
                  background: SILVER_H,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {w}
              </div>
            );
          })}
        </div>
        <p
          className="mt-10 md:mt-14 text-base md:text-xl max-w-2xl leading-[1.5] font-medium"
          style={{
            fontFamily: "var(--cine-comic)",
            opacity: Math.max(0, Math.min(1, (p - 0.8) / 0.15)),
          }}
        >
          {t.manifestoTail}
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// WORK — real client spots, hover to play.
// ---------------------------------------------------------------------------
function Work({ t }: { t: (typeof COPY)[Lang] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.1);
  return (
    <section ref={ref} className="px-6 md:px-14 py-20 md:py-28 max-w-[1500px] mx-auto" style={{ background: BONE }}>
      <div
        className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60"
        style={{ fontFamily: "var(--cine-pixel)" }}
      >
        {t.workEyebrow}
      </div>
      <h2
        className="font-black leading-[0.94] tracking-[-0.03em] uppercase mb-6 max-w-4xl"
        style={{ fontSize: "clamp(34px, 5.2vw, 78px)" }}
      >
        {t.workHeadline1}
        <br />
        <span
          style={{
            background: GRAPHITE_IN,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t.workHeadline2}
        </span>
      </h2>
      <p
        className="text-sm md:text-base leading-[1.55] font-medium max-w-2xl mb-12 opacity-75"
        style={{ fontFamily: "var(--cine-comic)" }}
      >
        {t.workNote}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {WORK.map((w, i) => (
          <WorkCard key={w.src} w={w} i={i} inView={inView} />
        ))}
      </div>

      <Link
        href="/portfolio"
        className="inline-flex items-center gap-3 mt-12 px-6 py-4 border-2 border-black font-black uppercase text-sm tracking-[0.2em] transition-colors hover:bg-black hover:text-[#ebe8e0]"
      >
        {t.workAll} <span aria-hidden>→</span>
      </Link>
    </section>
  );
}

function WorkCard({
  w, i, inView,
}: {
  w: (typeof WORK)[number];
  i: number;
  inView: boolean;
}) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Sources are only attached on first hover. Eight <video preload> tags would
  // otherwise pull ~14MB before anyone asked to watch anything.
  const [armed, setArmed] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Play/pause lives in an effect rather than in the pointer handler. Calling
  // play() straight out of onMouseEnter looked right but did nothing on the
  // FIRST hover: the <video> is rendered conditionally on `armed`, so at the
  // moment the handler ran the ref was still null and the call was dropped.
  // Only a second hover ever started playback.
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    if (hovered) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
      setPlaying(false);
    }
  }, [hovered, armed]);

  const start = () => { setArmed(true); setHovered(true); };
  const stop = () => setHovered(false);

  return (
    <figure
      className="border-2 border-black relative group"
      style={{
        background: JET,
        boxShadow: "5px 5px 0 0 #0d0d0d",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 500ms cubic-bezier(0.16,1,0.3,1) ${i * 70}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${i * 70}ms`,
      }}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      tabIndex={0}
    >
      <div className="relative w-full" style={{ aspectRatio: "9 / 16" }}>
        <Image
          src={w.poster}
          alt={`${w.brand} — кадър от реклама на VEKTO`}
          fill
          sizes="(max-width: 768px) 45vw, 22vw"
          className="object-cover"
          unoptimized
        />
        {armed && (
          <video
            ref={vidRef}
            src={w.src}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: playing ? 1 : 0, transition: "opacity 200ms ease" }}
          />
        )}
        <span
          className="absolute top-2 right-2 px-1.5 py-0.5 border text-[11px] uppercase tracking-[0.2em] leading-none z-10"
          style={{ borderColor: "#8a8a8a", background: JET, color: "#f4f4f4", fontFamily: "var(--cine-pixel)" }}
        >
          {w.region}
        </span>
      </div>
      <figcaption
        className="px-2 py-2 border-t-2 text-[12px] uppercase tracking-[0.15em] truncate flex items-center justify-between gap-2"
        style={{ borderColor: "#8a8a8a", color: "#f4f4f4", fontFamily: "var(--cine-pixel)" }}
      >
        <span className="truncate">{w.brand}</span>
        <span className="opacity-60 shrink-0" aria-hidden>{playing ? "■" : "▶"}</span>
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// PROOF — the three real ROAS figures, nothing invented.
// ---------------------------------------------------------------------------
function Proof({ t }: { t: (typeof COPY)[Lang] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.3);
  return (
    <section ref={ref} className="px-6 md:px-14 py-20 md:py-28" style={{ background: "#d6d3ca" }}>
      <div className="max-w-[1500px] mx-auto">
        <div
          className="text-xs font-bold uppercase tracking-[0.35em] mb-10 opacity-60"
          style={{ fontFamily: "var(--cine-pixel)" }}
        >
          {t.proofEyebrow}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {t.proof.map((item, i) => (
            <div
              key={item.brand}
              className="border-2 border-black p-6 md:p-8"
              style={{
                background: BONE,
                boxShadow: "6px 6px 0 0 #0d0d0d",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 550ms cubic-bezier(0.16,1,0.3,1) ${i * 110}ms, transform 650ms cubic-bezier(0.16,1,0.3,1) ${i * 110}ms`,
              }}
            >
              <div
                className="font-black leading-none tabular-nums mb-4"
                style={{
                  fontSize: "clamp(56px, 8vw, 110px)",
                  background: GRAPHITE_IN,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {item.metric}
              </div>
              <div
                className="text-sm uppercase tracking-[0.25em] font-bold"
                style={{ fontFamily: "var(--cine-pixel)" }}
              >
                {item.brand}
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-8 text-xs uppercase tracking-[0.25em] opacity-60"
          style={{ fontFamily: "var(--cine-pixel)" }}
        >
          {t.proofNote}
        </div>
      </div>
    </section>
  );
}

function EndCard({ t }: { t: (typeof COPY)[Lang] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.3);
  return (
    <section
      ref={ref}
      className="px-6 md:px-14 py-28 md:py-40 text-center relative"
      style={{ background: JET, color: "#f4f4f4" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div
          className="text-xs font-bold uppercase tracking-[0.35em] mb-10 opacity-60"
          style={{ fontFamily: "var(--cine-pixel)" }}
        >
          {t.endEyebrow}
        </div>
        <h2
          className="font-black leading-[0.9] tracking-[-0.03em] uppercase mb-14"
          style={{
            fontSize: "clamp(44px, 7.5vw, 120px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 600ms ease, transform 700ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {t.endLine1}
          <br />
          <span
            className="italic"
            style={{
              background: SILVER_H,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.endLine2Hi}
          </span>
        </h2>
        <Link
          href="/brief"
          className="group inline-flex items-center gap-4 px-8 md:px-14 py-5 md:py-8 border-2 border-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(180deg, #c4c4c4 0%, #f4f4f4 22%, #8a8a8a 48%, #eaeaea 52%, #6d6d6d 82%, #b0b0b0 100%)",
            color: JET,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.4) inset, 10px 10px 0 0 #ebe8e0",
          }}
        >
          <span className="font-black text-xl md:text-3xl uppercase tracking-tight">{t.endCta}</span>
          <span className="font-black text-xl md:text-3xl transition-transform group-hover:translate-x-2" aria-hidden>→</span>
        </Link>
        <div
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.25em] opacity-70"
          style={{ fontFamily: "var(--cine-pixel)" }}
        >
          <a href="mailto:vektoagency@gmail.com" className="hover:opacity-100">vektoagency@gmail.com</a>
          <span className="opacity-40">·</span>
          <a href="tel:+359882251474" className="hover:opacity-100">+359 88 225 1474</a>
          <span className="opacity-40">·</span>
          <span>{t.endMeta}</span>
        </div>
      </div>
    </section>
  );
}
