"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { getCalApi } from "@calcom/embed-react";
import { startCopy, type Lang } from "./translations";
import { submitStartLead } from "../actions/start-lead";
import { trackEvent } from "../components/MetaPixel";

// Lazy-load the below-fold sections (How it works · Stats · Compare ·
// FAQ · Final CTA) — keeps the initial JS bundle for hero+form lean
// so cold paid-traffic landings paint instantly. ssr=true keeps the
// HTML there for crawlers; only the hydration JS is split.
const StartBelowFold = dynamic(() => import("./StartBelowFold"), {
  loading: () => null,
});

const LANG_KEY = "vekto-start-lang";

// Brand logos used in the social-proof marquee. Mirrors the Clients
// component's roster so the landing page reads as the same brand world.
const SOCIAL_PROOF_LOGOS = [
  { name: "DUSQ", logo: "/images/logo-dusq.webp", invert: true },
  { name: "PARFEN", logo: "/images/logo-parfen.webp", invert: true },
  { name: "MEN'S CARE", logo: "/images/logo-menscare.png", circular: true },
  { name: "BIOTICA", logo: "/images/logo-biotica.webp", invert: true, circular: true },
  { name: "ANOMALY", logo: "/images/logo-anomaly.webp", invert: true },
  { name: "ETHAN'S", logo: "/images/logo-ethans.webp", invert: true },
  { name: "NUTRIFITT", logo: "/images/logo-nutrifitt.webp" },
  { name: "ISOSPORT", logo: "/images/logo-isosport.webp" },
  { name: "LUCKY ENERGY", logo: "/images/logo-lucky.webp", invert: true },
  { name: "BEMEACNE", logo: "/images/logo-bemeacne.webp" },
  { name: "KRISTA G", logo: "/images/logo-krista-g-2022.webp" },
  { name: "TASTE FLAVOR CO.", logo: "/images/logo-tasteflavor.webp" },
];

export default function StartClient() {
  const [lang, setLang] = useState<Lang>("bg");
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState("");
  const [phone, setPhone] = useState("");
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState(2500);
  const [message, setMessage] = useState("");
  const [utm, setUtm] = useState<{
    source?: string; medium?: string; campaign?: string;
    content?: string; term?: string; referrer?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  // Show sticky mobile CTA only after user has scrolled past the hero.
  const [showStickyCta, setShowStickyCta] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "bg" || saved === "en") setLang(saved);
    } catch {}
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

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(LANG_KEY, lang); } catch {}
  }, [lang, hydrated]);

  // Cal.com namespace registration — deferred to idle so it doesn't
  // block the landing page's critical render path.
  useEffect(() => {
    const initCal = async () => {
      try {
        const cal = await getCalApi({ namespace: "30min" });
        cal("ui", {
          theme: "dark",
          cssVarsPerTheme: {
            light: { "cal-brand": "#c8ff00" },
            dark: { "cal-brand": "#c8ff00" },
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

  // Scroll listener — show sticky mobile CTA once hero is out of view.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { rootMargin: "-50% 0px 0px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
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
    if (!email.trim()) {
      setErrorMsg(t.error.requiredEmail);
      return;
    }
    setSubmitting(true);
    const ctLabels = contentTypes
      .map((id) => t.fields.contentTypeOptions.find((o) => o.id === id)?.label)
      .filter(Boolean)
      .join(", ");
    const budgetLabel =
      budget >= 10000
        ? t.fields.budgetMaxLabel
        : `${budget.toLocaleString(lang === "bg" ? "bg-BG" : "en-US")} ${t.fields.budgetSuffix}`;
    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const res = await submitStartLead({
      lang, name, email, brand, phone,
      contentType: contentTypes.join(","),
      contentTypeLabel: ctLabels,
      budget: String(budget),
      budgetLabel,
      message,
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
        { value: budget, currency: "EUR", content_name: ctLabels },
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
    <div className="min-h-screen bg-[#080808] text-[#ece8e1] flex flex-col">
      {/* ─────────────────  HEADER (sticky, minimal)  ───────────────── */}
      <header className="border-b border-[#1e1e1c] bg-[#080808]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-3 md:py-4 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#9a958e] hover:text-[#c8ff00] transition-colors"
          >
            {t.meta.home}
          </Link>
          <button
            onClick={() => setLang(lang === "bg" ? "en" : "bg")}
            className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#c8ff00] border border-[#c8ff00]/40 px-2.5 md:px-3 py-1 md:py-1.5 rounded-sm hover:bg-[#c8ff00]/10 transition-colors"
            aria-label="Toggle language"
          >
            {t.meta.langToggle}
          </button>
        </div>
      </header>

      <main className="flex-1">
        {!done ? (
          <>
            {/* ─────────────  HERO (above the fold, brand promise)  ───────────── */}
            <section ref={heroRef} className="relative overflow-hidden">
              {/* Modern hero background — Linear/Vercel-style.
                  Three layered radial gradients (mesh) drifting slowly +
                  a subtle 1px dot grid overlay. Pure CSS, GPU-accelerated,
                  zero images. Replaces the old single ambient glow with
                  something that reads 2026-modern. */}
              <div aria-hidden className="absolute inset-0 hero-mesh-bg pointer-events-none" />
              <div aria-hidden className="absolute inset-0 hero-grid-overlay pointer-events-none" />
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
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#c8ff00" opacity="0.55" />
                    </marker>
                  </defs>
                  <g
                    className="vector-field"
                    stroke="#c8ff00"
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
              <div className="relative max-w-5xl mx-auto px-5 md:px-8 pt-7 md:pt-16 pb-6 md:pb-10 text-center">
                {/* Pulsing eyebrow chip */}
                <div
                  className="inline-flex items-center gap-2 mb-5 md:mb-7 px-3.5 py-1.5 rounded-full border border-[#c8ff00]/40 bg-[#c8ff00]/[0.06] animate-[startFade_0.4s_ease-out_both]"
                  style={{ boxShadow: "0 0 24px -6px rgba(200,255,0,0.4)" }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 rounded-full bg-[#c8ff00] animate-ping opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#c8ff00]" />
                  </span>
                  <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-[#c8ff00] font-semibold">
                    {t.meta.eyebrow}
                  </span>
                </div>

                {/* Hero h1 — Academy-style layered composition.
                    Smaller white top with italic-lime keyword (set apart),
                    centered arrow, then MASSIVE lime gradient bottom.
                    Two distinct typographic moments inside one headline. */}
                <h1
                  className="mb-4 md:mb-6 animate-[startFade_0.55s_0.05s_ease-out_both]"
                  style={{ textShadow: "0 2px 30px rgba(0,0,0,0.5)" }}
                >
                  {/* Top — smaller, white + italic-lime keyword */}
                  <span
                    className="block text-[24px] sm:text-[36px] md:text-[48px] lg:text-[60px] font-bold leading-[1.1] tracking-[-0.02em] text-white/95 text-balance"
                  >
                    {(() => {
                      const parts = t.meta.h1Top.split(/\{italic\}(.+?)\{\/italic\}/);
                      return parts.map((part, i) =>
                        i % 2 === 1 ? (
                          <em
                            key={i}
                            className="not-italic-fallback"
                            style={{
                              fontStyle: "italic",
                              fontWeight: 700,
                              backgroundImage:
                                "linear-gradient(135deg, #eaff7a 0%, #c8ff00 45%, #a8e600 100%)",
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                              color: "transparent",
                            }}
                          >
                            {part}
                          </em>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      );
                    })()}
                  </span>
                  {/* Centered lime arrow connector */}
                  <span
                    className="block my-2 md:my-3 text-[#c8ff00] text-2xl md:text-4xl leading-none animate-[startFade_0.6s_0.12s_ease-out_both]"
                    aria-hidden
                  >
                    ↓
                  </span>
                  {/* Bottom — massive lime gradient resolution */}
                  <span
                    className="block text-[40px] sm:text-[56px] md:text-[80px] lg:text-[104px] font-extrabold leading-[0.98] tracking-[-0.035em] text-balance bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #eaff7a 0%, #c8ff00 45%, #a8e600 100%)",
                      filter: "drop-shadow(0 2px 28px rgba(200,255,0,0.42))",
                    }}
                  >
                    {t.meta.h1Bottom}
                  </span>
                </h1>

                {/* Trust badges row — hard numbers + safety claim */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-7 gap-y-2 mb-6 md:mb-8 animate-[startFade_0.65s_0.15s_ease-out_both]">
                  {t.meta.trustBadges.map((b) => (
                    <div key={b} className="flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-[12.5px] md:text-sm text-[#cfcbc4] font-medium">{b}</span>
                    </div>
                  ))}
                </div>

                {/* Primary CTA — scrolls to form */}
                <button
                  onClick={scrollToForm}
                  className="group inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-bold px-7 md:px-9 py-3.5 md:py-4 rounded-full hover:bg-[#d4ff33] active:scale-[0.98] transition-all text-[15px] md:text-[16px] animate-[startFade_0.7s_0.2s_ease-out_both]"
                  style={{ boxShadow: "0 18px 50px -10px rgba(200,255,0,0.7), 0 0 38px -4px rgba(200,255,0,0.4), inset 0 1px 0 rgba(255,255,255,0.45)" }}
                >
                  <span>{t.cta.submit}</span>
                  <span className="text-[17px] leading-none transition-transform duration-200 group-hover:translate-x-1">↓</span>
                </button>
                <p className="mt-3 text-[11px] md:text-[12px] text-[#888] tracking-wide animate-[startFade_0.75s_0.25s_ease-out_both]">
                  {t.meta.ctaMicro}
                </p>
              </div>
            </section>

            {/* ─────────────  SOCIAL PROOF MARQUEE  ───────────── */}
            <section className="border-y border-[#1e1e1c] bg-[#0a0a0a] py-4 md:py-6 relative overflow-hidden">
              <p className="text-center font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#c8ff00]/85 mb-5 md:mb-6">
                {t.socialProof.heading}
              </p>
              <div
                className="relative overflow-hidden"
                style={{
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
                  maskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
                }}
              >
                <div className="flex sp-marquee gap-6 md:gap-10 w-max">
                  {[...SOCIAL_PROOF_LOGOS, ...SOCIAL_PROOF_LOGOS, ...SOCIAL_PROOF_LOGOS].map((c, i) => (
                    <div
                      key={`${c.name}-${i}`}
                      className="shrink-0 h-12 md:h-14 flex items-center justify-center px-3 md:px-4 opacity-75 hover:opacity-100 transition-opacity"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.logo}
                        alt={c.name}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                        className="h-7 md:h-9 w-auto object-contain"
                        style={{ filter: c.invert ? "brightness(0) invert(1)" : undefined }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ─────────────  FORM SECTION (the conversion point)  ───────────── */}
            <section ref={formRef} className="relative scroll-mt-20">
              <div className="max-w-2xl mx-auto px-5 md:px-8 py-8 md:py-14">
                <div data-animate className="reveal text-center mb-8 md:mb-10">
                  <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
                    {t.formSection.eyebrow}
                  </p>
                  <h2 className="text-[28px] sm:text-4xl md:text-[44px] font-extrabold leading-[1.08] tracking-[-0.02em] mb-3 md:mb-4 text-balance">
                    {t.formSection.h2}{" "}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)",
                      }}
                    >
                      {t.formSection.h2Highlight}
                    </span>
                  </h2>
                  <p className="text-[14px] md:text-[16px] text-[#a8a8a8] leading-relaxed max-w-[540px] mx-auto text-balance">
                    {t.formSection.sub}
                  </p>
                </div>

                <div
                  data-animate
                  className="reveal space-y-5 md:space-y-6 p-5 md:p-8 rounded-2xl border border-[#1e1e1c] bg-[#0a0a0a]"
                  style={{ boxShadow: "0 24px 70px -24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)" }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <Field label={t.fields.name}>
                      <Input value={name} onChange={setName} placeholder={t.fields.namePh} />
                    </Field>
                    <Field label={t.fields.email}>
                      <Input value={email} onChange={setEmail} placeholder={t.fields.emailPh} type="email" required />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <Field label={t.fields.brand}>
                      <Input value={brand} onChange={setBrand} placeholder={t.fields.brandPh} type="url" />
                    </Field>
                    <Field label={t.fields.phone}>
                      <Input value={phone} onChange={setPhone} placeholder={t.fields.phonePh} type="tel" />
                    </Field>
                  </div>

                  <Field label={t.fields.contentType}>
                    <PillsMulti
                      values={contentTypes}
                      onToggle={(id) =>
                        setContentTypes((cur) =>
                          cur.includes(id) ? cur.filter((v) => v !== id) : [...cur, id]
                        )
                      }
                      options={t.fields.contentTypeOptions}
                    />
                  </Field>

                  <Field label={t.fields.budget}>
                    <BudgetSlider
                      value={budget}
                      onChange={setBudget}
                      max={10000}
                      step={250}
                      suffix={t.fields.budgetSuffix}
                      maxLabel={t.fields.budgetMaxLabel}
                      lang={lang}
                    />
                  </Field>

                  <Field label={t.fields.message}>
                    <Textarea
                      value={message}
                      onChange={setMessage}
                      placeholder={t.fields.messagePh}
                      rows={4}
                    />
                  </Field>

                  <div className="pt-2">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !email.trim()}
                      className="group w-full inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-bold px-8 py-4 rounded-full hover:bg-[#d4ff33] active:scale-[0.98] transition-all text-[16px] md:text-[17px] disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ boxShadow: "0 18px 50px -10px rgba(200,255,0,0.7), 0 0 38px -4px rgba(200,255,0,0.4), inset 0 1px 0 rgba(255,255,255,0.45)" }}
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
                    <p className="mt-4 text-center text-[11px] md:text-[12px] text-[#888] tracking-wide">
                      {t.formSection.submitMicro}
                    </p>
                  </div>
                </div>

                {/* Alt CTAs */}
                <div className="mt-10 pt-8 border-t border-[#1e1e1c] text-center">
                  <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#9a958e] mb-4">
                    {t.cta.orBook}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                      data-cal-namespace="30min"
                      data-cal-link="vekto/30min"
                      data-cal-config='{"layout":"month_view","theme":"dark"}'
                      className="inline-flex items-center justify-center gap-2 border border-[#c8ff00]/55 text-[#c8ff00] font-semibold px-7 py-3 rounded-full hover:bg-[#c8ff00]/10 transition-colors text-sm cursor-pointer"
                    >
                      📅 {t.cta.bookCta}
                    </button>
                    <a
                      href="tel:+359882251474"
                      className="inline-flex items-center justify-center gap-2 border border-[#c8ff00]/55 text-[#c8ff00] font-semibold px-7 py-3 rounded-full hover:bg-[#c8ff00]/10 transition-colors text-sm"
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

            {/* ─────────────  STICKY MOBILE CTA  ───────────── */}
            <div
              className={`md:hidden fixed bottom-3 left-3 right-3 z-40 transition-all duration-300 ${
                showStickyCta ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0 pointer-events-none"
              }`}
            >
              <button
                onClick={scrollToForm}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-bold px-6 py-3.5 rounded-full text-[15px] active:scale-[0.98] transition-all"
                style={{ boxShadow: "0 18px 50px -8px rgba(200,255,0,0.85), 0 0 40px -4px rgba(200,255,0,0.5), inset 0 1px 0 rgba(255,255,255,0.45)" }}
              >
                <span>{t.stickyMobile.cta}</span>
                <span className="text-[17px] leading-none">↓</span>
              </button>
            </div>
          </>
        ) : (
          /* ─────────────  SUCCESS STATE  ───────────── */
          <div className="min-h-[70vh] flex items-center justify-center px-5 md:px-8 py-10 md:py-16">
            <div className="text-center max-w-2xl mx-auto animate-[startFade_0.5s_ease-out_both]">
              <div
                className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#c8ff00] text-black mb-7"
                style={{ boxShadow: "0 0 60px rgba(200,255,0,0.55)" }}
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-4">
                {t.meta.eyebrow}
              </p>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-5">
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
                  className="inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-bold px-8 py-3.5 rounded-full hover:bg-[#d4ff33] transition-colors cursor-pointer"
                  style={{ boxShadow: "0 14px 40px -12px rgba(200,255,0,0.55)" }}
                >
                  {t.success.bookCta}
                </button>
                <a
                  href="tel:+359882251474"
                  className="inline-flex items-center justify-center gap-2 border border-[#c8ff00]/55 text-[#c8ff00] font-semibold px-8 py-3.5 rounded-full hover:bg-[#c8ff00]/10 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  {t.cta.callCta}
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 border border-[#c8ff00]/40 text-[#c8ff00] font-semibold px-8 py-3.5 rounded-full hover:bg-[#c8ff00]/10 transition-colors font-mono text-sm uppercase tracking-[0.2em]"
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
        /* Modern hero mesh — three layered radial-gradients drifting
           via translate-only transforms (GPU-accelerated, no repaint).
           ~0.5KB CSS, no images, no JS. */
        .hero-mesh-bg {
          background:
            radial-gradient(60% 50% at 22% 18%, rgba(200, 255, 0, 0.22), transparent 65%),
            radial-gradient(55% 45% at 78% 38%, rgba(200, 255, 0, 0.14), transparent 70%),
            radial-gradient(70% 55% at 50% 88%, rgba(180, 240, 0, 0.10), transparent 72%);
          animation: heroMeshDrift 24s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes heroMeshDrift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          33%      { transform: translate3d(2.5%, -2%, 0); }
          66%      { transform: translate3d(-1.5%, 1.5%, 0); }
        }
        /* Subtle 1px dot grid overlay — Linear-style background detail.
           Single CSS background-image, no DOM cost. Masks fade to
           transparent at edges so it doesn't fight the gradient mesh. */
        .hero-grid-overlay {
          background-image:
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.045) 1px, transparent 0);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%);
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-mesh-bg { animation: none; }
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
          border-radius: 999px; background: #c8ff00; border: 3px solid #050505;
          box-shadow: 0 0 0 1px #c8ff00, 0 0 18px rgba(200, 255, 0, 0.7);
          cursor: grab; transition: transform 0.15s ease;
        }
        .vekto-range:active::-webkit-slider-thumb {
          transform: scale(1.18); cursor: grabbing;
        }
        .vekto-range::-moz-range-thumb {
          width: 22px; height: 22px;
          border-radius: 999px; background: #c8ff00; border: 3px solid #050505;
          box-shadow: 0 0 0 1px #c8ff00, 0 0 18px rgba(200, 255, 0, 0.7);
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
      <label className="block font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#c8ff00]/85 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function Textarea({
  value, onChange, placeholder, rows = 4,
}: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-[#0d0d0d] border border-[#1e1e1c] focus:border-[#c8ff00]/60 focus:outline-none focus:ring-1 focus:ring-[#c8ff00]/30 rounded-md px-4 py-3 text-base md:text-[15px] text-[#ece8e1] placeholder-[#555] transition-colors resize-y leading-relaxed"
    />
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
      className="w-full bg-[#0d0d0d] border border-[#1e1e1c] focus:border-[#c8ff00]/60 focus:outline-none focus:ring-1 focus:ring-[#c8ff00]/30 rounded-md px-4 py-3.5 text-base md:text-[15px] text-[#ece8e1] placeholder-[#555] transition-colors"
    />
  );
}

function PillsMulti({
  values, onToggle, options,
}: { values: string[]; onToggle: (id: string) => void; options: ReadonlyArray<{ id: string; label: string }>; }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = values.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onToggle(o.id)}
            className={`flex items-center gap-2 text-left px-4 py-3 md:py-2.5 rounded-md text-sm md:text-sm min-h-[44px] md:min-h-0 transition-all ${
              active
                ? "bg-[#c8ff00] text-black font-semibold border border-[#c8ff00]"
                : "bg-[#0d0d0d] text-[#ece8e1] border border-[#1e1e1c] hover:border-[#c8ff00]/40 hover:text-[#c8ff00]"
            }`}
          >
            <span
              aria-hidden
              className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center shrink-0 ${
                active ? "border-black bg-black" : "border-[#c8ff00]/40"
              }`}
            >
              {active && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function BudgetSlider({
  value, onChange, max, step, suffix, maxLabel, lang,
}: { value: number; onChange: (v: number) => void; max: number; step: number; suffix: string; maxLabel: string; lang: "bg" | "en"; }) {
  const pct = Math.min(100, (value / max) * 100);
  const display =
    value >= max ? maxLabel
      : `${value.toLocaleString(lang === "bg" ? "bg-BG" : "en-US")} ${suffix}`;
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-[#c8ff00] tabular-nums">
          {display}
        </span>
      </div>
      <div className="relative">
        <div className="absolute inset-y-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-[#1e1e1c] rounded-full pointer-events-none" />
        <div
          aria-hidden
          className="absolute inset-y-1/2 -translate-y-1/2 left-0 h-1.5 bg-[#c8ff00] rounded-full pointer-events-none transition-[width] duration-150"
          style={{
            width: `${pct}%`,
            boxShadow: "0 0 18px rgba(200,255,0,0.55)",
          }}
        />
        <input
          type="range"
          min={500}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="vekto-range relative w-full bg-transparent appearance-none cursor-pointer"
        />
      </div>
      <div className="flex justify-between mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#666]">
        <span>500 €</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
