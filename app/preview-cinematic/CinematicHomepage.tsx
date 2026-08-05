"use client";

// ============================================================================
// /preview-cinematic v2 — THE VECTOR'S FLIGHT.
//
// The entire funnel is ONE continuous shot. Six Seedance 2.0 clips, chained
// end-frame → start-frame, concatenated into a single frame sequence that
// scroll scrubs from 0 to 1. The camera never cuts; the sections of the site
// are stops along the flight of the talisman — a CNC-machined titanium dart
// ("The Vector") whose path IS the sales narrative:
//
//   vault → ignition → screen → feed → curve → landing
//   hero    what we do  the work  manifesto  ROAS   CTA
//
// Zone boundaries and frame counts live in journey.ts; overlay copy lives in
// journeyCopy.ts. This file is only the machinery.
//
// After the journey the page continues with the interactive sections that
// need dwell time (hover-to-play work grid) — interactivity does not belong
// inside an opacity-fading overlay.
// ============================================================================

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";
import { FRAME_DIR, FRAME_COUNT, FRAME_SETS, ZONES, zoneEnvelope, zoneLocal } from "./journey";
import { JOURNEY_COPY, type JourneyLang } from "./journeyCopy";

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
// REAL WORK — every entry is a video in this repo; every poster is a frame
// extracted from THAT video. Brands only where verifiable.
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

// The 12 named brands from the brutalism roster — same logos, same regions.
const ROSTER = [
  { name: "MEN'S CARE",    region: "BG" as const, logo: "/images/logo-menscare.png" },
  { name: "DUSQ",          region: "US" as const, logo: "/images/logo-dusq.webp" },
  { name: "PARFEN",        region: "BG" as const, logo: "/images/logo-parfen.webp" },
  { name: "ISOSPORT",      region: "BG" as const, logo: "/images/logo-isosport.webp" },
  { name: "BIOTICA",       region: "BG" as const, logo: "/images/logo-biotica.webp" },
  { name: "BULTEX",        region: "BG" as const, logo: "/images/logo-bultex.png" },
  { name: "НЕДЕЛЯ",        region: "BG" as const, logo: "/images/logo-nedelya.svg" },
  { name: "ANOMALY",       region: "US" as const, logo: "/images/logo-anomaly.webp" },
  { name: "GOURMET HOUSE", region: "BG" as const, logo: "/images/logo-gourmethouse.png" },
  { name: "ETHAN'S",       region: "US" as const, logo: "/images/logo-ethans.webp" },
  { name: "LUCKY ENERGY",  region: "US" as const, logo: "/images/logo-lucky.webp" },
  { name: "NUTRIFITT",     region: "US" as const, logo: "/images/logo-nutrifitt.webp" },
];

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
  const [lang, setLang] = useState<JourneyLang>("bg");
  useEffect(() => {
    const saved = localStorage.getItem("vekto.lang");
    if (saved === "bg" || saved === "en") setLang(saved);
  }, []);
  const setLangPersist = useCallback((l: JourneyLang) => {
    setLang(l);
    try { localStorage.setItem("vekto.lang", l); } catch {}
  }, []);
  const t = JOURNEY_COPY[lang];
  const reduced = useReducedMotion();

  // Lenis: a frame scrub needs interpolated wheel deltas — native wheel
  // steps arrive ~100px at a time, which reads as 3-4 skipped frames.
  // Never installed under reduced motion.
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.35, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, [reduced]);

  return (
    <div
      className="relative"
      style={{
        background: BONE,
        color: JET,
        fontFamily: "var(--cine-display), system-ui, sans-serif",
        overflowX: "clip",
      }}
    >
      <CursorDot disabled={reduced} />

      {/* CRT texture over everything, including the film. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <Header lang={lang} setLang={setLangPersist} />

      {reduced ? (
        <StaticJourney t={t} />
      ) : (
        <Journey t={t} lang={lang} />
      )}

      <HazardStrip />
      <Roster t={t} />
      <HazardStrip />
      <Process t={t} />
      <HazardStrip />
      <Fit t={t} />
      <HazardStrip />
      <Work t={t} />
      <HazardStrip />
      <EndCard t={t} />
      <Footer lang={lang} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// JOURNEY — the one-shot scrub. ~2.2 viewports of runway per zone keeps the
// scrub pace comfortable: 288 frames over ~12 viewports ≈ 42px of scroll per
// frame under Lenis interpolation.
// ---------------------------------------------------------------------------
function Journey({ t, lang }: { t: (typeof JOURNEY_COPY)[JourneyLang]; lang: JourneyLang }) {
  const ref = useRef<HTMLElement>(null);
  const p = useStickyProgress(ref);
  // Full-bleed film: desktop pulls the 1600px set, phones the 960px one.
  // Decided once on mount from the media query; a mid-session resize across
  // the boundary re-decodes, which is acceptable for how rare it is.
  const [frameSet, setFrameSet] = useState<(typeof FRAME_SETS)[keyof typeof FRAME_SETS]>(FRAME_SETS.sd);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setFrameSet(mq.matches ? FRAME_SETS.hd : FRAME_SETS.sd);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  const frame = Math.round(p * (FRAME_COUNT - 1)) + 1;
  // Zones are unequal fractions since v4, so the active zone is found by
  // boundary, not by dividing progress into sixths.
  const rawZoneIdx = ZONES.findIndex((z) => p < z.to);
  const zoneIdx = rawZoneIdx === -1 ? ZONES.length - 1 : rawZoneIdx;

  const Z = Object.fromEntries(ZONES.map((z) => [z.id, z]));

  return (
    <section ref={ref} className="relative" style={{ height: `${ZONES.length * 220}vh`, background: JET }}>
      <div className="sticky top-0 h-[100dvh] min-h-[100vh] overflow-hidden">
        {/* THE FILM — full-bleed, scrubbed by scroll. */}
        <ScrubReel
          progress={p}
          cover
          frames={frameSet}
          className="absolute inset-0"
        />

        {/* ZONE RAIL — the funnel's own navigation. Numbered stops on the
            right edge; clicking one scrolls the runway to that zone. Lives
            inside the sticky viewport so it exists exactly while the
            journey does. */}
        <nav
          aria-label={lang === "bg" ? "Зони" : "Zones"}
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col gap-1.5"
        >
          {ZONES.map((z, i) => {
            const active = i === zoneIdx;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => {
                  const el = ref.current;
                  if (!el) return;
                  const runway = el.offsetHeight - window.innerHeight;
                  // Land a hair inside the zone so its overlay is already up.
                  window.scrollTo(0, el.offsetTop + runway * (z.from + 0.02));
                }}
                className="flex items-center gap-2 justify-end group"
                aria-current={active ? "true" : undefined}
              >
                <span
                  className="text-[11px] font-bold tracking-[0.2em] transition-opacity duration-150 group-hover:opacity-100"
                  style={{
                    fontFamily: "var(--cine-pixel)",
                    color: "#f4f4f4",
                    textShadow: "0 0 6px rgba(13,13,13,0.9)",
                    opacity: active ? 1 : 0,
                  }}
                >
                  {t.rail[i]}
                </span>
                <span
                  className="w-6 h-6 border-2 flex items-center justify-center text-[11px] font-black transition-all"
                  style={{
                    borderColor: "#f4f4f4",
                    background: active ? "#f4f4f4" : "rgba(13,13,13,0.45)",
                    color: active ? JET : "#f4f4f4",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </nav>

        {/* HUD — instrument readout, bottom left. */}
        <div
          className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-30 flex items-center gap-3 px-3 py-2 border-2"
          style={{ borderColor: "rgba(244,244,244,0.5)", background: "rgba(13,13,13,0.66)", color: "#f4f4f4" }}
        >
          <span className="text-[11px] uppercase tracking-[0.3em] tabular-nums" style={{ fontFamily: "var(--cine-pixel)" }}>
            {t.hud.zone} {String(zoneIdx + 1).padStart(2, "0")}/06
          </span>
          <span className="opacity-40">·</span>
          <span className="text-[11px] uppercase tracking-[0.3em] tabular-nums" style={{ fontFamily: "var(--cine-pixel)" }}>
            {t.hud.frame} {String(frame).padStart(3, "0")}/{String(FRAME_COUNT).padStart(3, "0")}
          </span>
          <span className="relative w-24 h-[2px]" style={{ background: "rgba(244,244,244,0.25)" }}>
            <span className="absolute left-0 top-0 h-full" style={{ width: `${p * 100}%`, background: "#f4f4f4" }} />
          </span>
        </div>

        {/* ZONE 1 · HOOK — naked type over the dark vault, as the original
            design: no plate, white display type with the silver highlight. */}
        <ZoneOverlay p={p} z={Z.vault} className="items-start justify-center text-left">
          <div className="max-w-[1500px] w-full mx-auto px-6 md:px-14">
            {/* The dart owns the centre-right of this shot; the column stops
                at ~40% width so type never crosses the object. */}
            <div className="max-w-xl">
              <div className="text-[12px] md:text-xs font-bold uppercase tracking-[0.35em] mb-4 opacity-80" style={{ fontFamily: "var(--cine-pixel)", color: "#f4f4f4" }}>
                {t.zones.vault.kicker}
              </div>
              <h1 className="font-black tracking-[-0.03em]" style={{ fontSize: "clamp(28px, 3.1vw, 56px)", lineHeight: 0.96, color: "#f4f4f4" }}>
                <span className="block">{t.zones.vault.h1a}</span>
                <span className="block">
                  {t.zones.vault.h1b}{" "}
                  <span className="italic" style={{ background: SILVER_H, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {t.zones.vault.h1hi}
                  </span>
                </span>
              </h1>
              <div className="flex flex-wrap gap-3 mt-8 pointer-events-auto">
                <Link
                  href="/brief"
                  className="inline-flex items-center gap-2 px-5 md:px-7 py-3 md:py-4 border-2 font-black uppercase text-sm md:text-base tracking-[0.15em] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
                  style={{ background: "#f4f4f4", color: JET, borderColor: "#f4f4f4", boxShadow: "5px 5px 0 0 rgba(138,138,138,0.9)" }}
                >
                  <span aria-hidden>→</span>
                  {t.zones.vault.ctaPrimary}
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-5 md:px-6 py-3 md:py-4 border-2 font-black uppercase text-sm md:text-base tracking-[0.15em] transition-colors hover:bg-white hover:text-black"
                  style={{ background: "transparent", color: "#f4f4f4", borderColor: "rgba(244,244,244,0.7)" }}
                >
                  <span aria-hidden>▶</span>
                  {t.zones.vault.ctaSecondary}
                </Link>
              </div>
              <div className="flex items-stretch flex-wrap gap-2 mt-6">
                <span className="inline-flex items-center shrink-0 text-[11px] font-bold uppercase tracking-[0.3em] px-2.5 py-2 border-2" style={{ fontFamily: "var(--cine-pixel)", background: JET, color: "#f4f4f4", borderColor: "rgba(244,244,244,0.6)" }}>
                  {t.zones.vault.proofTitle}
                </span>
                {t.zones.vault.proof.map((item) => (
                  <span key={item.brand} className="inline-flex items-baseline gap-2 shrink-0 px-3 py-1.5 border-2 border-black" style={{ background: "rgba(235,232,224,0.94)" }}>
                    <span className="font-black text-base tabular-nums leading-none" style={{ color: JET }}>{item.metric}</span>
                    <span className="text-[11px] uppercase tracking-[0.15em] opacity-70 leading-none" style={{ fontFamily: "var(--cine-pixel)", color: JET }}>{item.brand}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-3 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.35em]" style={{ fontFamily: "var(--cine-pixel)", color: "#f4f4f4", textShadow: "0 0 6px rgba(13,13,13,0.9)" }}>
              <span aria-hidden>▼</span>
              <span>{t.scrollCue}</span>
              <span className="relative w-24 h-[2px]" style={{ background: "rgba(244,244,244,0.3)" }}>
                <span className="absolute left-0 top-0 h-full" style={{ width: `${p * 100}%`, background: "#f4f4f4" }} />
              </span>
            </div>
          </div>
        </ZoneOverlay>

        {/* ZONE 2 · WHY — the quote as naked white type. */}
        <ZoneOverlay p={p} z={Z.ignition} className="items-start justify-center">
          <div className="max-w-[1500px] w-full mx-auto px-6 md:px-14">
            <div className="max-w-xl">
              <Kicker text={t.zones.why.kicker} />
              <blockquote className="font-black tracking-[-0.02em]" style={{ fontSize: "clamp(22px, 2.6vw, 42px)", lineHeight: 1.08, color: "#f4f4f4" }}>
                {t.zones.why.quote}
              </blockquote>
              <div className="mt-4 text-[11px] md:text-xs uppercase tracking-[0.25em] opacity-70" style={{ fontFamily: "var(--cine-pixel)", color: "#f4f4f4" }}>
                {t.zones.why.attribution}
              </div>
              <div className="mt-6 font-black uppercase tracking-tight" style={{ fontSize: "clamp(18px, 2vw, 32px)", color: "#f4f4f4" }}>
                {t.zones.why.response}{" "}
                <span className="italic" style={{ background: SILVER_H, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {t.zones.why.responseHi}
                </span>
              </div>
            </div>
          </div>
        </ZoneOverlay>

        {/* ZONE 3 · FOCUS — four rooms as open columns, silver numerals. */}
        <ZoneOverlay p={p} z={Z.screen} className="items-end justify-center pb-16 md:pb-20">
          {/* The screen pass fills the centre of the frame — the rooms sit in
              the lower band where the shot is floor and darkness. */}
          <div className="max-w-[1500px] w-full mx-auto px-6 md:px-14">
            <Kicker text={t.zones.focus.kicker} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 mt-3">
              {t.zones.focus.rooms.map((r, i) => {
                const local = zoneLocal(p, Z.screen);
                const on = local > 0.12 + i * 0.14;
                return (
                  <div
                    key={r.title}
                    style={{
                      opacity: on ? 1 : 0,
                      transform: on ? "translateY(0)" : "translateY(16px)",
                      transition: "opacity 300ms ease, transform 380ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <div className="font-black uppercase tracking-tight text-lg md:text-2xl" style={{ color: "#f4f4f4" }}>{r.title}</div>
                    <div className="text-[11px] uppercase tracking-[0.15em] opacity-70 mt-1" style={{ fontFamily: "var(--cine-pixel)", color: "#f4f4f4" }}>{r.detail}</div>
                    <div className="font-black tabular-nums mt-2" style={{ fontSize: "clamp(28px, 3vw, 48px)", lineHeight: 1, background: SILVER_H, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{r.num}</div>
                    <div className="text-[11px] uppercase tracking-[0.2em] opacity-70 mt-1" style={{ fontFamily: "var(--cine-pixel)", color: "#f4f4f4" }}>{r.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </ZoneOverlay>

        {/* ZONE 4 · STANDARD — the original kinetic silver words, no plates. */}
        <StandardOverlay p={p} z={Z.feed} kicker={t.zones.standard.kicker} words={t.zones.standard.principles} />

        {/* ZONE 5 · CASES — the original light cards over the white curve. */}
        <ZoneOverlay p={p} z={Z.curve} className="items-start justify-center">
          <div className="max-w-[1500px] w-full mx-auto px-6 md:px-14">
            <Kicker text={t.zones.cases.kicker} dark />
            <div className="flex flex-wrap gap-4 md:gap-6 mt-2">
              {t.zones.cases.cases.map((c, i) => {
                const local = zoneLocal(p, Z.curve);
                const on = local > 0.18 + i * 0.16;
                return (
                  <div
                    key={c.brand}
                    className="border-2 border-black px-5 py-4"
                    style={{
                      background: "rgba(235,232,224,0.92)",
                      boxShadow: "6px 6px 0 0 #0d0d0d",
                      opacity: on ? 1 : 0,
                      transform: on ? "translateY(0)" : "translateY(16px)",
                      transition: "opacity 300ms ease, transform 380ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <div className="text-[11px] uppercase tracking-[0.25em] opacity-70 mb-1" style={{ fontFamily: "var(--cine-pixel)", color: JET }}>
                      {c.brand} · {c.duration}
                    </div>
                    <div className="font-black tabular-nums leading-none" style={{ fontSize: "clamp(34px, 4.5vw, 72px)", color: JET }}>
                      {c.metric}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.25em] font-bold mt-2 opacity-80" style={{ fontFamily: "var(--cine-pixel)", color: JET }}>
                      {c.label}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 text-[11px] uppercase tracking-[0.3em] opacity-80" style={{ fontFamily: "var(--cine-pixel)", color: JET }}>
              {t.zones.cases.note}
            </div>
          </div>
        </ZoneOverlay>

        {/* ZONE 6 · CALL — dark type straight on the white film, chrome CTA. */}
        <ZoneOverlay p={p} z={Z.landing} className="items-center justify-start">
          {/* The monument stands dead centre; the ask lives in the empty
              left half of the bone-white frame. */}
          <div className="max-w-[1500px] w-full mx-auto px-6 md:px-14">
          <div className="max-w-xl text-left">
            <Kicker text={t.zones.landing.kicker} dark />
            <h2 className="font-black uppercase tracking-[-0.03em]" style={{ fontSize: "clamp(32px, 4.2vw, 72px)", lineHeight: 0.94, color: JET }}>
              {t.zones.landing.h2a}
              <br />
              <span className="italic" style={{ background: GRAPHITE_IN, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {t.zones.landing.h2hi}
              </span>
            </h2>
            <div className="mt-10 pointer-events-auto inline-block">
              <Link
                href="/brief"
                className="group inline-flex items-center gap-4 px-8 md:px-12 py-5 md:py-7 border-2 border-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(180deg, #c4c4c4 0%, #f4f4f4 22%, #8a8a8a 48%, #eaeaea 52%, #6d6d6d 82%, #b0b0b0 100%)",
                  color: JET,
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.4) inset, 8px 8px 0 0 #0d0d0d",
                }}
              >
                <span className="font-black text-lg md:text-2xl uppercase tracking-tight">{t.zones.landing.cta}</span>
                <span className="font-black text-lg md:text-2xl transition-transform group-hover:translate-x-2" aria-hidden>→</span>
              </Link>
            </div>
            <div className="mt-8 text-[11px] uppercase tracking-[0.3em] opacity-70" style={{ fontFamily: "var(--cine-pixel)", color: JET }}>
              {t.zones.landing.meta}
            </div>
          </div>
          </div>
        </ZoneOverlay>
      </div>
    </section>
  );
}

/** Generic pinned overlay for one zone: fades with the zone envelope and
    ignores pointer events except where a child opts back in (CTAs). */
function ZoneOverlay({
  p, z, className, children,
}: {
  p: number;
  z: { from: number; to: number };
  className?: string;
  children: React.ReactNode;
}) {
  const env = zoneEnvelope(p, z as never);
  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col pointer-events-none ${className ?? ""}`}
      style={{ opacity: env, visibility: env <= 0.001 ? "hidden" : "visible", paddingTop: "12vh" }}
    >
      {children}
    </div>
  );
}

/** Zone 4's kinetic principles — the original treatment: huge silver
    gradient words sliding in over the film, one per slice, no plates. */
function StandardOverlay({
  p, z, kicker, words,
}: {
  p: number;
  z: { from: number; to: number };
  kicker: string;
  words: readonly string[];
}) {
  const env = zoneEnvelope(p, z as never);
  const local = zoneLocal(p, z as never);
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-start justify-center pointer-events-none"
      style={{ opacity: env, visibility: env <= 0.001 ? "hidden" : "visible" }}
    >
      <div className="max-w-[1500px] w-full mx-auto px-6 md:px-14">
        {/* Confined to the left half: the corridor's vanishing point and the
            dart hold the centre of the frame. */}
        <Kicker text={kicker} />
        <div className="space-y-1 md:space-y-2 max-w-xl xl:max-w-2xl">
          {words.map((w, i) => {
            const slice = 0.8 / words.length;
            const tt = Math.max(0, Math.min(1, (local - i * slice) / (slice * 0.4)));
            return (
              <div
                key={w}
                className="font-black uppercase leading-[1.0] tracking-[-0.02em]"
                style={{
                  fontSize: "clamp(22px, 2.9vw, 46px)",
                  opacity: tt,
                  transform: `translateX(${(1 - tt) * -50}px)`,
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
      </div>
    </div>
  );
}

function Kicker({ text, dark, center }: { text: string; dark?: boolean; center?: boolean }) {
  return (
    <div
      className={`text-[11px] md:text-xs font-bold uppercase tracking-[0.35em] mb-4 opacity-75 ${center ? "text-center" : ""}`}
      style={{ fontFamily: "var(--cine-pixel)", color: dark ? JET : "#f4f4f4" }}
    >
      {text}
    </div>
  );
}

// ---------------------------------------------------------------------------
// STATIC JOURNEY — reduced motion: the six zones as plain stacked sections,
// each on a still from its zone. No scrub, no Lenis, no pinning.
// ---------------------------------------------------------------------------
function StaticJourney({ t }: { t: (typeof JOURNEY_COPY)[JourneyLang] }) {
  const still = `${FRAME_DIR}/001.webp`;
  return (
    <section className="relative flex items-center" style={{ minHeight: "92vh", background: JET }}>
      <Image src={still} alt="" fill className="object-cover opacity-80" unoptimized />
      <div className="relative z-10 max-w-[1500px] w-full mx-auto px-6 md:px-14 py-24">
        <div className="border-2 border-black p-6 md:p-9 max-w-3xl" style={{ background: "rgba(235,232,224,0.97)", boxShadow: "8px 8px 0 0 #0d0d0d" }}>
          <div className="inline-block px-2.5 py-1.5 border-2 border-black text-[11px] font-bold uppercase tracking-[0.3em]" style={{ fontFamily: "var(--cine-pixel)", background: JET, color: "#f4f4f4" }}>
            {t.zones.vault.kicker}
          </div>
          <h1 className="font-black tracking-[-0.03em] mt-4" style={{ fontSize: "clamp(32px, 4.6vw, 78px)", lineHeight: 0.94, color: JET }}>
            {t.zones.vault.h1a} {t.zones.vault.h1b} {t.zones.vault.h1hi}
          </h1>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href="/brief" className="inline-flex items-center gap-2 px-6 py-4 border-2 border-black font-black uppercase text-sm tracking-[0.15em]" style={{ background: JET, color: "#f4f4f4" }}>
              → {t.zones.vault.ctaPrimary}
            </Link>
            <Link href="/portfolio" className="inline-flex items-center gap-2 px-6 py-4 border-2 border-black font-black uppercase text-sm tracking-[0.15em]" style={{ color: JET }}>
              ▶ {t.zones.vault.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SHARED CHROME (header, cursor, hazard, work grid, footer)
// ---------------------------------------------------------------------------
function CursorDot({ disabled }: { disabled: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (disabled || !window.matchMedia("(pointer: fine)").matches) {
      setOn(false);
      return;
    }
    setOn(true);
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; };
    const loop = () => {
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
      <div ref={ringRef} className="absolute top-0 left-0 w-8 h-8 -ml-4 -mt-4 border-2" style={{ borderColor: "rgba(244,244,244,0.6)", mixBlendMode: "difference", willChange: "transform" }} />
      <div ref={dotRef} className="absolute top-0 left-0 w-2 h-2 -ml-1 -mt-1" style={{ background: "#f4f4f4", mixBlendMode: "difference", willChange: "transform" }} />
    </div>
  );
}

function HazardStrip() {
  return (
    <div
      aria-hidden
      className="h-2 w-full relative z-[3]"
      style={{ background: "repeating-linear-gradient(-45deg, #0d0d0d, #0d0d0d 10px, #b0b0b0 10px, #b0b0b0 20px)" }}
    />
  );
}

function Header({ lang, setLang }: { lang: JourneyLang; setLang: (l: JourneyLang) => void }) {
  const links = lang === "bg"
    ? [["Портфолио", "/portfolio"], ["Кейсове", "/case-studies"], ["Анкета", "/brief"]]
    : [["Portfolio", "/portfolio"], ["Case Studies", "/case-studies"], ["Brief", "/brief"]];
  const cta = lang === "bg" ? "Запази разговор" : "Book a call";
  // Fixed and FULLY transparent — no bar, no scrim, no blur: the film runs
  // uninterrupted to the top edge. Legibility over the bone-white zones
  // comes from a dark drop-shadow halo around every element instead of a
  // background. Layout: wordmark alone on the left; everything else — nav,
  // language, CTA — grouped on the right.
  return (
    <div className="fixed inset-x-0 top-0 z-50" style={{ background: "transparent" }}>
      {/* Fully transparent strip — no bar, no scrim. Legibility over the
          bone-white zones comes from a tight near-opaque dark outline plus
          a soft halo on every element (text-shadow on text, drop-shadow on
          the masked logo). mix-blend difference was tried first and looked
          right on paper, but Chromium flattens the blend over the
          GPU-composited canvas film, so glyphs stayed white-on-white. The
          nav landmark uses display:contents so links sit as direct row
          children without losing the <nav> semantics. */}
      <div className="px-4 md:px-6 py-3 md:py-4 flex items-center gap-x-5 md:gap-x-7">
        <Link
          href="/preview-cinematic"
          aria-label="VEKTO"
          className="h-8 md:h-11 w-[112px] md:w-[180px] shrink-0 mr-auto"
          style={{
            background: "#f4f4f4",
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
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="hidden md:inline text-sm font-bold uppercase tracking-[0.2em] opacity-95 hover:opacity-100 transition-opacity"
              style={{ color: "#f4f4f4", textShadow: "0 0 1px #0d0d0d, 0 0 3px rgba(13,13,13,0.9), 0 1px 6px rgba(13,13,13,0.55)" }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setLang(lang === "bg" ? "en" : "bg")}
          className="px-2.5 md:px-3 py-2 font-bold uppercase text-xs tracking-[0.25em] shrink-0"
          style={{
            background: "transparent",
            color: "#f4f4f4",
            border: "1.5px solid rgba(244,244,244,0.75)",
            textShadow: "0 0 1px #0d0d0d, 0 0 3px rgba(13,13,13,0.9)",
            filter: "drop-shadow(0 0 1px rgba(13,13,13,0.7))",
          }}
          aria-label={lang === "bg" ? "Switch to English" : "Превключи на български"}
        >
          {lang === "bg" ? "EN" : "БГ"}
        </button>
        <Link
          href="/brief"
          className="inline-flex items-center gap-2 px-3 md:px-4 py-2 border-2 uppercase text-[12px] md:text-[13px] tracking-[0.2em] font-black transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 shrink-0"
          style={{ background: JET, color: "#f4f4f4", boxShadow: "3px 3px 0 0 #8a8a8a", borderColor: "#f4f4f4" }}
        >
          <span aria-hidden>→</span>
          <span className="hidden sm:inline">{cta}</span>
          <span className="sm:hidden">{lang === "bg" ? "Разговор" : "Call"}</span>
        </Link>
      </div>
    </div>
  );
}

// 05 · THE ROSTER — the 12 named brands, jet ground like the brutalism stage.
function Roster({ t }: { t: (typeof JOURNEY_COPY)[JourneyLang] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.12);
  return (
    <section ref={ref} className="px-6 md:px-14 py-20 md:py-28" style={{ background: JET, color: "#f4f4f4" }}>
      <div className="max-w-[1500px] mx-auto">
        <div className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60" style={{ fontFamily: "var(--cine-pixel)" }}>
          {t.roster.eyebrow}
        </div>
        <h2 className="font-black leading-[0.94] tracking-[-0.03em] uppercase mb-12" style={{ fontSize: "clamp(32px, 4.8vw, 72px)" }}>
          {t.roster.headline1}
          <br />
          {t.roster.headline2Prefix}{" "}
          <span style={{ background: SILVER_H, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {t.roster.headline2Highlight}
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {ROSTER.map((c, i) => (
            <div
              key={c.name}
              className="border-2 border-white bg-white flex flex-col relative"
              style={{
                aspectRatio: "5/4",
                boxShadow: "5px 5px 0 0 #8a8a8a",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 550ms cubic-bezier(0.16,1,0.3,1) ${i * 45}ms, transform 650ms cubic-bezier(0.16,1,0.3,1) ${i * 45}ms`,
              }}
            >
              <span className="absolute top-1.5 right-1.5 border border-black bg-white px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.2em] leading-none z-10" style={{ fontFamily: "var(--cine-pixel)", color: JET }}>
                {t.roster.region[c.region]}
              </span>
              <div className="flex-1 flex items-center justify-center p-4 md:p-6 min-h-0">
                <Image src={c.logo} alt={c.name} width={220} height={110} className="max-h-full max-w-full w-auto h-auto object-contain" unoptimized />
              </div>
              <div className="border-t-2 border-black px-2 py-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] leading-none" style={{ color: JET }}>
                {c.name}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-xs uppercase tracking-[0.25em] opacity-60" style={{ fontFamily: "var(--cine-pixel)" }}>
          {t.roster.coda}
        </div>
      </div>
    </section>
  );
}

// 06 · PROCESS — four numbered steps, bone ground.
function Process({ t }: { t: (typeof JOURNEY_COPY)[JourneyLang] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.12);
  return (
    <section ref={ref} className="px-6 md:px-14 py-20 md:py-28" style={{ background: "#d6d3ca" }}>
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-10 items-start">
        <div className="md:col-span-5">
          <div className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60" style={{ fontFamily: "var(--cine-pixel)" }}>
            {t.process.eyebrow}
          </div>
          <h2 className="font-black leading-[0.94] tracking-[-0.03em] uppercase" style={{ fontSize: "clamp(30px, 4.4vw, 64px)", color: JET }}>
            {t.process.headline1}
            <br />
            {t.process.headline2Prefix}{" "}
            <span style={{ background: GRAPHITE_IN, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {t.process.headline2Highlight}
            </span>
          </h2>
        </div>
        <div className="md:col-span-7 space-y-4 md:space-y-5">
          {t.process.steps.map((st, i) => (
            <div
              key={st.num}
              className="border-2 border-black p-5 md:p-6"
              style={{
                background: "#ebe8e0",
                boxShadow: "6px 6px 0 0 #0d0d0d",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : `translateX(${i % 2 === 0 ? -30 : 30}px)`,
                transition: `opacity 550ms cubic-bezier(0.16,1,0.3,1) ${i * 110}ms, transform 650ms cubic-bezier(0.16,1,0.3,1) ${i * 110}ms`,
              }}
            >
              <div className="flex items-baseline gap-4 md:gap-5">
                <div className="text-3xl md:text-4xl font-black tabular-nums flex-shrink-0" style={{ background: GRAPHITE_IN, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {st.num}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                    <h3 className="font-black text-base md:text-xl uppercase tracking-tight leading-tight" style={{ color: JET }}>{st.title}</h3>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] px-2 py-1 border border-black shrink-0" style={{ fontFamily: "var(--cine-pixel)", background: JET, color: "#f4f4f4" }}>
                      {st.duration}
                    </span>
                  </div>
                  <p className="text-sm md:text-base leading-[1.5] font-medium opacity-85" style={{ fontFamily: "var(--cine-comic)", color: JET }}>{st.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 08 · FIT — the four qualification checks, bone ground.
function Fit({ t }: { t: (typeof JOURNEY_COPY)[JourneyLang] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.15);
  return (
    <section ref={ref} className="px-6 md:px-14 py-20 md:py-28" style={{ background: BONE }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60" style={{ fontFamily: "var(--cine-pixel)" }}>
          {t.fit.eyebrow}
        </div>
        <h2 className="font-black leading-[0.94] tracking-[-0.03em] uppercase mb-12 max-w-4xl" style={{ fontSize: "clamp(30px, 4.6vw, 68px)", color: JET }}>
          {t.fit.headlinePrefix}{" "}
          <span style={{ background: GRAPHITE_IN, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {t.fit.headlineHighlight}
          </span>
          {t.fit.headlineSuffix}
        </h2>
        <ul className="space-y-4 md:space-y-5 max-w-4xl">
          {t.fit.items.map((q, i) => (
            <li
              key={q}
              className="flex items-start gap-4 md:gap-6 border-2 border-black p-4 md:p-6"
              style={{
                background: "#ebe8e0",
                boxShadow: "6px 6px 0 0 #0d0d0d",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(18px)",
                transition: `opacity 500ms cubic-bezier(0.16,1,0.3,1) ${i * 120}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
              }}
            >
              <span className="mt-1 w-8 h-8 md:w-10 md:h-10 flex-shrink-0 border-2 border-black flex items-center justify-center" style={{ background: "linear-gradient(180deg, #c4c4c4 0%, #f4f4f4 22%, #8a8a8a 48%, #eaeaea 52%, #6d6d6d 82%, #b0b0b0 100%)", color: JET }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8L7 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
                </svg>
              </span>
              <span className="text-base md:text-xl leading-[1.35] font-bold uppercase" style={{ color: JET }}>{q}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Work({ t }: { t: (typeof JOURNEY_COPY)[JourneyLang] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.1);
  return (
    <section ref={ref} className="px-6 md:px-14 py-20 md:py-28 max-w-[1500px] mx-auto" style={{ background: BONE }}>
      <div className="text-xs font-bold uppercase tracking-[0.35em] mb-6 opacity-60" style={{ fontFamily: "var(--cine-pixel)" }}>
        {t.after.workEyebrow}
      </div>
      <h2 className="font-black leading-[0.94] tracking-[-0.03em] uppercase mb-6 max-w-4xl" style={{ fontSize: "clamp(34px, 5.2vw, 78px)" }}>
        {t.after.workHeadline1}
        <br />
        <span style={{ background: "linear-gradient(90deg, #6d6d6d 0%, #2a2a2a 30%, #5a5a5a 58%, #232323 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          {t.after.workHeadline2}
        </span>
      </h2>
      <p className="text-sm md:text-base leading-[1.55] font-medium max-w-2xl mb-12 opacity-75" style={{ fontFamily: "var(--cine-comic)" }}>
        {t.after.workNote}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {WORK.map((w, i) => (
          <WorkCard key={w.src} w={w} i={i} inView={inView} />
        ))}
      </div>
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-2 mt-10 text-sm font-bold uppercase tracking-[0.2em] underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100"
      >
        {t.after.workAll} <span aria-hidden>→</span>
      </Link>
    </section>
  );
}

function WorkCard({ w, i, inView }: { w: (typeof WORK)[number]; i: number; inView: boolean }) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [armed, setArmed] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Play/pause lives in an effect: the <video> renders conditionally on
  // `armed`, so a play() call inside the pointer handler fires while the ref
  // is still null on the FIRST hover and gets dropped.
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
      onMouseEnter={() => { setArmed(true); setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => { setArmed(true); setHovered(true); }}
      onBlur={() => setHovered(false)}
      tabIndex={0}
    >
      <div className="relative w-full" style={{ aspectRatio: "9 / 16" }}>
        <Image src={w.poster} alt={`${w.brand} — кадър от реклама на VEKTO`} fill sizes="(max-width: 768px) 45vw, 22vw" className="object-cover" unoptimized />
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
        <span className="absolute top-2 right-2 px-1.5 py-0.5 border text-[11px] uppercase tracking-[0.2em] leading-none z-10" style={{ borderColor: "#8a8a8a", background: JET, color: "#f4f4f4", fontFamily: "var(--cine-pixel)" }}>
          {w.region}
        </span>
      </div>
      <figcaption className="px-2 py-2 border-t-2 text-[12px] uppercase tracking-[0.15em] truncate flex items-center justify-between gap-2" style={{ borderColor: "#8a8a8a", color: "#f4f4f4", fontFamily: "var(--cine-pixel)" }}>
        <span className="truncate">{w.brand}</span>
        <span className="opacity-60 shrink-0" aria-hidden>{playing ? "■" : "▶"}</span>
      </figcaption>
    </figure>
  );
}

// The funnel's last word is the ask, not the archive: the page used to end
// on a "see the full portfolio" button, which walks the visitor OUT of the
// funnel right at its bottom. Portfolio is a text link above; this is the
// close.
function EndCard({ t }: { t: (typeof JOURNEY_COPY)[JourneyLang] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.3);
  return (
    <section ref={ref} className="px-6 md:px-14 py-24 md:py-36 text-center" style={{ background: JET, color: "#f4f4f4" }}>
      <div
        className="text-xs font-bold uppercase tracking-[0.35em] mb-8 opacity-60"
        style={{ fontFamily: "var(--cine-pixel)" }}
      >
        {t.endCard.eyebrow}
      </div>
      <h2
        className="font-black leading-[0.9] tracking-[-0.03em] uppercase mb-12"
        style={{
          fontSize: "clamp(40px, 6.5vw, 110px)",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 600ms ease, transform 700ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {t.endCard.h1}
        <br />
        <span
          className="italic"
          style={{ background: SILVER_H, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          {t.endCard.h2}
        </span>
      </h2>
      <Link
        href="/brief"
        className="group inline-flex items-center gap-4 px-8 md:px-14 py-5 md:py-8 border-2 border-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "linear-gradient(180deg, #c4c4c4 0%, #f4f4f4 22%, #8a8a8a 48%, #eaeaea 52%, #6d6d6d 82%, #b0b0b0 100%)",
          color: JET,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.4) inset, 10px 10px 0 0 #2a2a2a",
        }}
      >
        <span className="font-black text-xl md:text-3xl uppercase tracking-tight">{t.endCard.cta}</span>
        <span className="font-black text-xl md:text-3xl transition-transform group-hover:translate-x-2" aria-hidden>→</span>
      </Link>
      <div
        className="mt-10 text-[11px] uppercase tracking-[0.3em] opacity-60"
        style={{ fontFamily: "var(--cine-pixel)" }}
      >
        {t.endCard.meta}
      </div>
    </section>
  );
}

function Footer({ lang }: { lang: JourneyLang }) {
  return (
    <section className="px-6 md:px-14 py-16 text-center" style={{ background: JET, color: "#f4f4f4" }}>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.25em] opacity-70" style={{ fontFamily: "var(--cine-pixel)" }}>
        <a href="mailto:vektoagency@gmail.com" className="hover:opacity-100">vektoagency@gmail.com</a>
        <span className="opacity-40">·</span>
        <a href="tel:+359882251474" className="hover:opacity-100">+359 88 225 1474</a>
        <span className="opacity-40">·</span>
        <span>{lang === "bg" ? "България · САЩ" : "Bulgaria · USA"}</span>
      </div>
    </section>
  );
}
