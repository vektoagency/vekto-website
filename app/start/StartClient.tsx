"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { getCalApi } from "@calcom/embed-react";
import { startCopy } from "./translations";
import { submitStartLead } from "../actions/start-lead";
import { trackEvent } from "../components/MetaPixel";
import { useLang } from "../i18n/LangProvider";
import SiteHeader from "../components/SiteHeader";

// Lazy-load the below-fold sections (How it works · Stats · Compare ·
// FAQ · Final CTA) — keeps the initial JS bundle for hero+form lean
// so cold paid-traffic landings paint instantly. ssr=true keeps the
// HTML there for crawlers; only the hydration JS is split.
const StartBelowFold = dynamic(() => import("./StartBelowFold"), {
  loading: () => null,
});

// The film's silver — same horizontal gradient the homepage uses for its
// italic display highlights.
const SILVER_H =
  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 22%, #8a8a8a 45%, #eaeaea 62%, #c8c8c8 78%, #ffffff 100%)";


// Brand logos used in the social-proof marquee. Mirrors the Clients
// component's roster so the landing page reads as the same brand world.
// Kept in-sync manually — if a brand joins Clients.tsx it should also
// appear here (and vice-versa).
// Two per-logo flags for optical evening-out:
//   `invert`  — dark-ink source, needs hue-preserving invert to read
//               on the dark tile
//   `stacked` — multi-line logos (icon-above-word, wordmark + tagline)
//               and single-line logos with lots of whitespace baked
//               into the source PNG that would otherwise render
//               smaller than neighbours. Bumps them to a taller
//               height tier so they optically match.
const SOCIAL_PROOF_LOGOS = [
  { name: "MEN'S CARE", logo: "/images/logo-menscare.png", invert: true },
  { name: "DUSQ", logo: "/images/logo-dusq.webp", invert: true },
  { name: "PARFEN", logo: "/images/logo-parfen.webp", invert: true },
  { name: "BULTEX", logo: "/images/logo-bultex.png" },
  { name: "NEDELYA", logo: "/images/logo-nedelya.svg" },
  { name: "BIOTICA", logo: "/images/logo-biotica.webp", invert: true, stacked: true },
  { name: "ANOMALY", logo: "/images/logo-anomaly.webp", invert: true },
  { name: "ETHAN'S", logo: "/images/logo-ethans.webp", invert: true },
  { name: "NUTRIFITT", logo: "/images/logo-nutrifitt.webp", stacked: true },
  { name: "ISOSPORT", logo: "/images/logo-isosport.webp" },
  { name: "LUCKY ENERGY", logo: "/images/logo-lucky.webp", invert: true, stacked: true },
  { name: "BEMEACNE", logo: "/images/logo-bemeacne.webp" },
  { name: "TASTE FLAVOR CO.", logo: "/images/logo-tasteflavor.webp", stacked: true },
  { name: "EVENTLINK", logo: "/images/logo-eventlink.webp" },
  { name: "GIFTO", logo: "/images/logo-adventuresbg.webp" },
  { name: "ADVENTURES BG", logo: "/images/logo-gifto2.webp" },
  { name: "ALPEN PHARMA", logo: "/images/logo-alpenpharma.png", invert: true, stacked: true },
  { name: "NIDO", logo: "/images/logo-nido.png", stacked: true },
  { name: "ARTE HOTEL", logo: "/images/logo-artehotel.png" },
  { name: "KASHMIR HOTEL", logo: "/images/logo-kashmirhotel.png", invert: true },
  { name: "CARTEL CAFFE", logo: "/images/logo-cartelcaffe.svg" },
  { name: "PHYTOLIFE", logo: "/images/logo-phytolife.webp", invert: true },
  { name: "GOURMET HOUSE", logo: "/images/logo-gourmethouse.png", invert: true },
];

export default function StartClient() {
  // Language lives in the global LangProvider (vekto-lang cookie) so the
  // shared SiteHeader toggle switches this page's copy too.
  const { lang } = useLang();
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState("");
  const [phone, setPhone] = useState("");
  const [utm, setUtm] = useState<{
    source?: string; medium?: string; campaign?: string;
    content?: string; term?: string; referrer?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setUtm({
        source: params.get("utm_source") || undefined,
        medium: params.get("utm_medium") || undefined,
        campaign: params.get("utm_campaign") || undefined,
        content: params.get("utm_content") || undefined,
        term: params.get("utm_term") || undefined,
        referrer: document.referrer || undefined,
      });
    } catch {}
    setHydrated(true);
  }, []);

  // Cal.com namespace registration — deferred to idle so it doesn't
  // block the landing page's critical render path.
  useEffect(() => {
    const initCal = async () => {
      try {
        const cal = await getCalApi({ namespace: "30min" });
        cal("ui", {
          theme: "dark",
          cssVarsPerTheme: {
            light: { "cal-brand": "#f4f4f4" },
            dark: { "cal-brand": "#f4f4f4" },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      } catch {}
    };
    type WindowWithIdle = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    const w = typeof window !== "undefined" ? (window as WindowWithIdle) : null;
    if (w?.requestIdleCallback) {
      w.requestIdleCallback(() => initCal(), { timeout: 2500 });
    } else {
      setTimeout(initCal, 1500);
    }
  }, []);

  // Scroll-triggered reveal animations on data-animate elements.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-animate]");
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-animate-in", "true");
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [done]);

  const t = startCopy[lang];

  const handleSubmit = async () => {
    setErrorMsg(null);
    // All four fields are now business-critical for follow-up: name +
    // email + phone + business name. Validate in the order shown so the
    // first empty field gets the error message instead of a generic one.
    if (!name.trim()) { setErrorMsg(t.error.requiredName); return; }
    // Explicit email format check — HTML5 required only covers emptiness,
    // and this form uses a button onClick handler (not <form> onSubmit) so
    // the browser's built-in type='email' validator never fires. Without
    // this, Resend rejects the send with a 422 'invalid reply_to' because
    // we pass data.email straight through to replyTo.
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg(t.error.requiredEmail); return;
    }
    if (!phone.trim()) { setErrorMsg(t.error.requiredPhone); return; }
    if (!brand.trim()) { setErrorMsg(t.error.requiredBrand); return; }
    setSubmitting(true);
    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const res = await submitStartLead({
      lang, name, email, brand,
      phone,
      contentType: "",
      contentTypeLabel: "",
      budget: "",
      budgetLabel: "",
      message: "",
      eventId,
      utmSource: utm.source,
      utmMedium: utm.medium,
      utmCampaign: utm.campaign,
      utmContent: utm.content,
      utmTerm: utm.term,
      referrer: utm.referrer,
    });
    setSubmitting(false);
    if (res.success) {
      trackEvent(
        "Lead",
        { content_name: "start" },
        { eventID: eventId }
      );
      setDone(true);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setErrorMsg(t.error.generic);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#0d0d0d",
        color: "#f4f4f4",
        fontFamily: "var(--brutal-display), system-ui, sans-serif",
        // Cyrillic display sets wider — same factor the homepage uses.
        ...({ "--bgk": lang === "bg" ? "0.92" : "1" } as React.CSSProperties),
        overflowX: "clip",
      }}
    >
      {/* CRT scanlines — same fixed overlay as the homepage */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* ─────────────────  HEADER — shared site header  ───────────────── */}
      <SiteHeader solid ctaHref="#anketa" />

      <main className="flex-1">
        {!done ? (
          <>
            {/* ─────────────  HERO (above the fold, brand promise)  ───────────── */}
            <section className="relative overflow-hidden">
              {/* Modern hero background — Linear/Vercel-style.
                  Three layered radial gradients (mesh) drifting slowly +
                  a subtle 1px dot grid overlay. Pure CSS, GPU-accelerated,
                  zero images. Replaces the old single ambient glow with
                  something that reads 2026-modern. */}
              {/* Animated vector field — diagonal arrows stagger-draw on
                  load, literally rendering 'vectors' behind the headline.
                  Brand-coherent (agency name = vector), designer polish
                  (stroke-dashoffset draw-in is high-end web craft). */}
              <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1400 800"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <marker
                      id="vk-arrow"
                      viewBox="0 0 10 10"
                      refX="9"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f4f4f4" opacity="0.55" />
                    </marker>
                  </defs>
                  <g
                    className="vector-field"
                    stroke="#f4f4f4"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    markerEnd="url(#vk-arrow)"
                  >
                    {/* Wide-spread anchors — visible only on desktop */}
                    <line x1="-30" y1="720" x2="240" y2="350" pathLength="100" />
                    <line x1="1160" y1="830" x2="1430" y2="450" pathLength="100" />
                    {/* Dense center cluster — visible on mobile crop AND
                        forms a clear vector field behind the headline */}
                    <line x1="300" y1="780" x2="510" y2="500" pathLength="100" />
                    <line x1="430" y1="700" x2="640" y2="420" pathLength="100" />
                    <line x1="560" y1="830" x2="770" y2="540" pathLength="100" />
                    <line x1="690" y1="710" x2="900" y2="420" pathLength="100" />
                    <line x1="820" y1="800" x2="1030" y2="520" pathLength="100" />
                    <line x1="950" y1="700" x2="1160" y2="420" pathLength="100" />
                    {/* Top row — small arrows above the headline */}
                    <line x1="380" y1="240" x2="540" y2="100" pathLength="100" />
                    <line x1="850" y1="240" x2="1010" y2="100" pathLength="100" />
                  </g>
                </svg>
              </div>
              <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-4 md:pt-16 pb-8 md:pb-12 text-center">
                <p
                  className="font-bold uppercase tracking-[0.35em] opacity-55 text-[10px] md:text-xs mb-5 md:mb-7 animate-[startFade_0.5s_ease-out_both]"
                  style={{ fontFamily: "var(--brutal-pixel)" }}
                >
                  {t.meta.stageEyebrow}
                </p>
                <h1
                  className="font-black uppercase leading-[1.02] tracking-[-0.03em] mb-5 md:mb-7 animate-[startFade_0.55s_0.05s_ease-out_both]"
                  style={{
                    // Sized so each sentence holds one line — two lines
                    // total on every viewport (no text-balance: it split
                    // the sentences into even halves on phones).
                    fontSize: "calc(clamp(21px, 5.6vw, 76px) * var(--bgk, 1))",
                    textShadow: "0 2px 30px rgba(0,0,0,0.5)",
                  }}
                >
                  <span className="block">{t.meta.h1Top}</span>
                  <span className="block">
                    {t.meta.h1Pre}{" "}
                    <span
                      className="italic pr-[0.08em]"
                      style={{
                        background: SILVER_H,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {t.meta.h1Hl}
                    </span>{" "}
                    {t.meta.h1Post}
                  </span>
                </h1>

                {/* Trust row — instrument type, silver ticks */}
                <div
                  className="flex flex-wrap items-center justify-center gap-x-5 md:gap-x-8 gap-y-2 mb-7 md:mb-9 animate-[startFade_0.65s_0.15s_ease-out_both]"
                  style={{ fontFamily: "var(--brutal-pixel)" }}
                >
                  {t.meta.trustBadges.map((b) => (
                    <span key={b} className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.14em] opacity-85">
                      <span className="mr-1.5" aria-hidden>✓</span>
                      {b}
                    </span>
                  ))}
                </div>

                {/* Primary CTA — scrolls to form */}
                <button
                  onClick={scrollToForm}
                  className="group inline-flex items-center justify-center gap-2 bg-[#f4f4f4] text-[#0d0d0d] font-black uppercase tracking-[0.15em] px-7 md:px-9 py-3.5 md:py-4 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform text-[13px] md:text-[14px] animate-[startFade_0.7s_0.2s_ease-out_both]"
                  style={{ boxShadow: "4px 4px 0 0 #3a3a3a" }}
                >
                  <span>{t.cta.submit}</span>
                  <span className="text-[17px] leading-none transition-transform duration-200 group-hover:translate-x-1">↓</span>
                </button>
                <p
                  className="mt-3.5 text-[10px] md:text-[11px] uppercase tracking-[0.12em] opacity-60 animate-[startFade_0.75s_0.25s_ease-out_both]"
                  style={{ fontFamily: "var(--brutal-pixel)" }}
                >
                  {t.meta.ctaMicro}
                </p>
              </div>
            </section>

            {/* ─────────────  SOCIAL PROOF MARQUEE  ───────────── */}
            <section
              className="py-4 md:py-6 relative overflow-hidden"
              style={{
                background: "#141414",
                borderTop: "1px solid rgba(244,244,244,0.14)",
                borderBottom: "1px solid rgba(244,244,244,0.14)",
              }}
            >
              <p
                className="text-center text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] opacity-55 mb-5 md:mb-6"
                style={{ fontFamily: "var(--brutal-pixel)" }}
              >
                {t.socialProof.heading}
              </p>
              <div
                className="relative overflow-hidden"
                style={{
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
                  maskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
                }}
              >
                {/* Each brand sits inside a fixed-size flexbox 'cell'
                    — 128px×64px on mobile, 176px×80px on desktop.
                    The <img> inside is constrained by max-height +
                    max-width (via the tier classes) so wide wordmarks
                    and taller stacked logos both scale to fit the same
                    optical footprint. Result: no logo dominates the
                    others regardless of its native aspect ratio. */}
                <div className="flex sp-marquee gap-6 md:gap-10 w-max">
                  {[...SOCIAL_PROOF_LOGOS, ...SOCIAL_PROOF_LOGOS, ...SOCIAL_PROOF_LOGOS].map((c, i) => (
                    <div
                      key={`${c.name}-${i}`}
                      className="shrink-0 w-32 md:w-44 h-16 md:h-20 flex items-center justify-center px-2 md:px-3 opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.logo}
                        alt={c.name}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                        className={`w-auto object-contain max-w-full ${
                          c.stacked
                            ? "max-h-11 md:max-h-14"
                            : "max-h-8 md:max-h-10"
                        }`}
                        // Hue-preserving invert — same filter Clients.tsx
                        // uses. See there for the rationale.
                        style={{ filter: c.invert ? "invert(1) hue-rotate(180deg) saturate(1.15)" : undefined }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ─────────────  FORM SECTION (the conversion point)  ───────────── */}
            <section ref={formRef} id="anketa" className="relative scroll-mt-24">
              <div className="max-w-2xl mx-auto px-5 md:px-8 py-8 md:py-14">
                <div data-animate className="reveal text-center mb-8 md:mb-10">
                  <p
                    className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] opacity-55 mb-4"
                    style={{ fontFamily: "var(--brutal-pixel)" }}
                  >
                    {t.formSection.eyebrow}
                  </p>
                  <h2
                    className="font-black uppercase leading-[1.02] tracking-[-0.03em] mb-3 md:mb-4"
                    style={{ fontSize: "calc(clamp(26px, 4.6vw, 48px) * var(--bgk, 1))" }}
                  >
                    {t.formSection.h2}{" "}
                    <span
                      className="italic pr-[0.08em]"
                      style={{
                        background: SILVER_H,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {t.formSection.h2Highlight}
                    </span>
                  </h2>
                  <p
                    className="text-[14px] md:text-[16px] leading-relaxed max-w-[540px] mx-auto text-balance opacity-70 font-medium"
                    style={{ fontFamily: "var(--brutal-comic)" }}
                  >
                    {t.formSection.sub}
                  </p>
                </div>

                <div
                  data-animate
                  className="reveal space-y-5 md:space-y-6 p-4 md:p-8 border-2"
                  style={{
                    borderColor: "rgba(244,244,244,0.3)",
                    background: "#0d0d0d",
                    boxShadow: "5px 5px 0 0 #2a2a2a",
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <Field label={t.fields.name}>
                      <Input value={name} onChange={setName} placeholder={t.fields.namePh} required />
                    </Field>
                    <Field label={t.fields.email}>
                      <Input value={email} onChange={setEmail} placeholder={t.fields.emailPh} type="email" required />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <Field label={t.fields.phone}>
                      <Input value={phone} onChange={setPhone} placeholder={t.fields.phonePh} type="tel" required />
                    </Field>
                    <Field label={t.fields.brand}>
                      {/* No type="url" — the field accepts both a business name
                          and a URL, and the strict URL validator would reject
                          plain names like 'Acme Studio'. */}
                      <Input value={brand} onChange={setBrand} placeholder={t.fields.brandPh} required />
                    </Field>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !name.trim() || !email.trim() || !phone.trim() || !brand.trim()}
                      className="group w-full inline-flex items-center justify-center gap-2 bg-[#f4f4f4] text-[#0d0d0d] font-black uppercase tracking-[0.15em] px-8 py-4 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform text-[14px] md:text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ boxShadow: "4px 4px 0 0 #3a3a3a" }}
                    >
                      <span>{submitting ? t.cta.submitting : t.cta.submit}</span>
                      {!submitting && (
                        <span className="text-[18px] leading-none transition-transform duration-200 group-hover:translate-x-1">→</span>
                      )}
                    </button>
                    {errorMsg && (
                      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-red-400">
                        {errorMsg}
                      </p>
                    )}
                    <p
                      className="mt-4 text-center text-[10px] md:text-[11px] uppercase tracking-[0.1em] opacity-60"
                      style={{ fontFamily: "var(--brutal-pixel)" }}
                    >
                      {t.formSection.submitMicro}
                    </p>
                  </div>
                </div>

                {/* Alt CTAs */}
                <div className="mt-10 pt-8 text-center" style={{ borderTop: "1px solid rgba(244,244,244,0.14)" }}>
                  <p
                    className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] opacity-55 mb-4"
                    style={{ fontFamily: "var(--brutal-pixel)" }}
                  >
                    {t.cta.orBook}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                      data-cal-namespace="30min"
                      data-cal-link="vekto/30min"
                      data-cal-config='{"layout":"month_view","theme":"dark"}'
                      className="inline-flex items-center justify-center gap-2 border-[1.5px] border-[#f4f4f4]/75 text-[#f4f4f4] font-bold uppercase tracking-[0.12em] px-7 py-3 hover:bg-white hover:text-black transition-colors text-[12px] cursor-pointer"
                    >
                      📅 {t.cta.bookCta}
                    </button>
                    <a
                      href="tel:+359882251474"
                      className="inline-flex items-center justify-center gap-2 border-[1.5px] border-[#f4f4f4]/75 text-[#f4f4f4] font-bold uppercase tracking-[0.12em] px-7 py-3 hover:bg-white hover:text-black transition-colors text-[12px]"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />
                      </svg>
                      {t.cta.callCta}
                    </a>
                  </div>
                </div>
              </div>
            </section>
            <StartBelowFold lang={lang} scrollToForm={scrollToForm} />

          </>
        ) : (
          /* ─────────────  SUCCESS STATE  ───────────── */
          <div className="min-h-[70vh] flex items-center justify-center px-5 md:px-8 py-10 md:py-16">
            <div className="text-center max-w-2xl mx-auto animate-[startFade_0.5s_ease-out_both]">
              <div
                className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#f4f4f4] text-[#0d0d0d] mb-7"
                style={{ boxShadow: "5px 5px 0 0 #3a3a3a" }}
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] opacity-55 mb-4"
                style={{ fontFamily: "var(--brutal-pixel)" }}
              >
                {t.meta.eyebrow}
              </p>
              <h1 className="text-3xl md:text-5xl font-black uppercase leading-[1.05] tracking-[-0.02em] mb-5">
                {t.success.title}
              </h1>
              <p className="text-[15px] md:text-lg text-[#a0a0a0] leading-relaxed mb-8 max-w-xl mx-auto">
                {t.success.body}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
                <button
                  data-cal-namespace="30min"
                  data-cal-link="vekto/30min"
                  data-cal-config='{"layout":"month_view","theme":"dark"}'
                  className="inline-flex items-center justify-center gap-2 bg-[#f4f4f4] text-[#0d0d0d] font-black uppercase tracking-[0.15em] px-8 py-3.5 text-[13px] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-pointer"
                  style={{ boxShadow: "4px 4px 0 0 #3a3a3a" }}
                >
                  {t.success.bookCta}
                </button>
                <a
                  href="tel:+359882251474"
                  className="inline-flex items-center justify-center gap-2 border-[1.5px] border-[#f4f4f4]/75 text-[#f4f4f4] font-bold uppercase tracking-[0.12em] px-8 py-3.5 text-[13px] hover:bg-white hover:text-black transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  {t.cta.callCta}
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 border-[1.5px] border-[#f4f4f4]/75 text-[#f4f4f4] px-8 py-3.5 hover:bg-white hover:text-black transition-colors font-mono text-sm uppercase tracking-[0.2em]"
                >
                  {t.success.backHome}
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─────────────  GLOBAL STYLES  ───────────── */}
      <style jsx global>{`
        @keyframes startFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Vector field hero bg — stagger-draw diagonal arrows. The
           literal 'vectors' behind 'Дай му вектор.' wordplay. */
        .vector-field line {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          opacity: 0;
          animation: vector-draw 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .vector-field line:nth-child(1) { animation-delay: 0.25s; }
        .vector-field line:nth-child(2) { animation-delay: 0.32s; }
        .vector-field line:nth-child(3) { animation-delay: 0.42s; }
        .vector-field line:nth-child(4) { animation-delay: 0.55s; }
        .vector-field line:nth-child(5) { animation-delay: 0.62s; }
        .vector-field line:nth-child(6) { animation-delay: 0.72s; }
        .vector-field line:nth-child(7) { animation-delay: 0.82s; }
        .vector-field line:nth-child(8) { animation-delay: 0.92s; }
        .vector-field line:nth-child(9) { animation-delay: 0.50s; }
        .vector-field line:nth-child(10) { animation-delay: 0.65s; }
        @keyframes vector-draw {
          to { stroke-dashoffset: 0; opacity: 0.24; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vector-field line {
            stroke-dashoffset: 0;
            opacity: 0.24;
            animation: none;
          }
        }
        /* Scroll-triggered reveal — fade up when entering viewport */
        [data-animate].reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s cubic-bezier(0.25, 0.8, 0.3, 1), transform 0.7s cubic-bezier(0.25, 0.8, 0.3, 1);
          will-change: opacity, transform;
        }
        [data-animate][data-animate-in="true"].reveal {
          opacity: 1;
          transform: translateY(0);
        }
        /* Social-proof marquee */
        @keyframes spMarquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-33.3333%, 0, 0); }
        }
        .sp-marquee {
          animation: spMarquee 40s linear infinite;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .sp-marquee { animation: none; }
          [data-animate].reveal { opacity: 1; transform: none; }
        }
        /* Custom range slider */
        .vekto-range { height: 28px; }
        .vekto-range::-webkit-slider-runnable-track {
          height: 6px; background: transparent; border-radius: 999px;
        }
        .vekto-range::-moz-range-track {
          height: 6px; background: transparent; border-radius: 999px;
        }
        .vekto-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 22px; height: 22px; margin-top: -8px;
          border-radius: 999px; background: #f4f4f4; border: 3px solid #050505;
          box-shadow: 0 0 0 1px #f4f4f4, 0 0 18px rgba(244, 244, 244, 0.7);
          cursor: grab; transition: transform 0.15s ease;
        }
        .vekto-range:active::-webkit-slider-thumb {
          transform: scale(1.18); cursor: grabbing;
        }
        .vekto-range::-moz-range-thumb {
          width: 22px; height: 22px;
          border-radius: 999px; background: #f4f4f4; border: 3px solid #050505;
          box-shadow: 0 0 0 1px #f4f4f4, 0 0 18px rgba(244, 244, 244, 0.7);
          cursor: grab;
        }
        .vekto-range:active::-moz-range-thumb {
          transform: scale(1.18); cursor: grabbing;
        }
      `}</style>
    </div>
  );
}


/* ───────────  Form building blocks (unchanged)  ─────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#f4f4f4]/85 mb-2"
        style={{ fontFamily: "var(--brutal-pixel)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}


function Input({
  value, onChange, placeholder, type = "text", required,
}: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean; }) {
  const inputMode: React.HTMLAttributes<HTMLInputElement>["inputMode"] =
    type === "email" ? "email" : type === "tel" ? "tel" : type === "url" ? "url" : "text";
  const autoComplete =
    type === "email" ? "email" : type === "tel" ? "tel" : type === "url" ? "url" : "off";
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      inputMode={inputMode}
      autoComplete={autoComplete}
      autoCapitalize={type === "email" || type === "url" ? "off" : "sentences"}
      spellCheck={type === "email" || type === "url" || type === "tel" ? false : undefined}
      className="w-full bg-[#141414] border border-[#f4f4f4]/25 focus:border-[#f4f4f4]/70 focus:outline-none focus:ring-1 focus:ring-[#f4f4f4]/30 px-4 py-3.5 text-base md:text-[15px] text-[#f4f4f4] placeholder-[#555] transition-colors"
    />
  );
}

