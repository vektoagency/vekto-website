"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { getCalApi } from "@calcom/embed-react";
import { flashkaCopy, type Lang } from "./translations";
import { submitStartLead } from "../actions/start-lead";
import { trackEvent } from "../components/MetaPixel";
import FlashkaDrive from "./FlashkaDrive";

// Lazy-load below-fold (inside · proof · qualify · faq · finalCta) so
// the hero+form chunk stays lean for cold paid-traffic landings.
// Funnel split into two lazy chunks: pre-form sections (proof + about
// + inside + qualify) educate the visitor before the form, post-form
// sections (faq + finalCta) handle objections + last-chance close for
// visitors who scrolled past the form. Both lazy-imported so the
// initial JS bundle stays small for cold paid-traffic landings.
const FlashkaBelowFold = dynamic(() => import("./FlashkaBelowFold"), {
  loading: () => null,
});
const FlashkaPostForm = dynamic(() => import("./FlashkaPostForm"), {
  loading: () => null,
});

const LANG_KEY = "vekto-flashka-lang";

export default function FlashkaClient() {
  const [lang, setLang] = useState<Lang>("bg");
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState("");
  const [utm, setUtm] = useState<{
    source?: string; medium?: string; campaign?: string;
    content?: string; term?: string; referrer?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const t = flashkaCopy[lang];

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

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!email.trim()) {
      setErrorMsg(t.error.requiredEmail);
      return;
    }
    setSubmitting(true);
    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `flashka_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const res = await submitStartLead({
      lang,
      source: "flashka",
      name, email, brand,
      phone: "",
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
        { content_name: "flashka" },
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
            {/* ─────────────  HERO  ───────────── */}
            <section className="relative">
              <div aria-hidden className="absolute inset-0 flashka-mesh-bg pointer-events-none" />
              <div aria-hidden className="absolute inset-0 flashka-grid-overlay pointer-events-none" />

              <div className="relative max-w-5xl mx-auto px-5 md:px-8 pt-6 md:pt-12 pb-12 md:pb-20 text-center">
                <h1
                  className="text-[30px] sm:text-[48px] md:text-[68px] lg:text-[84px] font-extrabold leading-[1.04] tracking-[-0.03em] mb-4 md:mb-6 text-balance animate-[startFade_0.55s_0.05s_ease-out_both]"
                  style={{ textShadow: "0 2px 30px rgba(0,0,0,0.5)" }}
                >
                  <span className="text-white">{t.meta.h1Top}</span>
                  <br />
                  <span
                    className="inline-block bg-clip-text text-transparent"
                    style={{
                      backgroundImage: "linear-gradient(135deg, #eaff7a 0%, #c8ff00 45%, #a8e600 100%)",
                      filter: "drop-shadow(0 2px 28px rgba(200,255,0,0.42))",
                    }}
                  >
                    {t.meta.h1Bottom}
                  </span>
                </h1>

                <p className="text-[14.5px] md:text-[18px] text-[#a8a8a8] leading-relaxed max-w-[560px] md:max-w-[620px] mx-auto mb-6 md:mb-8 text-balance animate-[startFade_0.6s_0.1s_ease-out_both]">
                  {t.meta.sub}
                </p>

                <button
                  onClick={scrollToForm}
                  className="group inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-bold px-8 md:px-10 py-4 md:py-4 min-h-[52px] rounded-full hover:bg-[#d4ff33] active:scale-[0.96] transition-all text-[16px] md:text-[17px] animate-[startFade_0.7s_0.2s_ease-out_both] touch-manipulation"
                  style={{ boxShadow: "0 18px 50px -10px rgba(200,255,0,0.7), 0 0 38px -4px rgba(200,255,0,0.4), inset 0 1px 0 rgba(255,255,255,0.45)" }}
                >
                  <span>{t.meta.ctaPrimary}</span>
                  <span className="text-[18px] leading-none transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-2">→</span>
                </button>
                {/* CTA micro chips — three lime-check trust beats
                    instead of dot-separated muted text. More designed,
                    more readable, scans as social-proof badges. */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 animate-[startFade_0.75s_0.25s_ease-out_both]">
                  {t.meta.ctaMicroItems.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 text-[11.5px] md:text-[12.5px] text-[#cfcbc4]"
                    >
                      <svg
                        width="11" height="11"
                        viewBox="0 0 24 24"
                        fill="none" stroke="#c8ff00"
                        strokeWidth="3"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="shrink-0"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>

                {/* Embedded USB drive — pure inline SVG plugged into a
                    'port milled into the page'. LED pulses lime. This
                    is the hero's visual full-stop: the eye lands on it
                    after reading the CTA, the LED pulls focus down
                    toward the form section below. Same composition on
                    mobile (uses clamp(), no media queries). */}
                <FlashkaDrive />
              </div>
            </section>

            {/* ─────────────  FORM (the application)  ─────────────
                Form sits IMMEDIATELY under the hero — minimal scroll
                from the hero CTA. Goal is form fills, so we trade
                'educate-before-asking' for 'capture-the-ready-now'.
                Visitors who scroll past form get the education + last-
                chance CTA below. */}
            <section ref={formRef} className="relative scroll-mt-20">
              <div className="max-w-2xl mx-auto px-5 md:px-8 py-10 md:py-16">
                <div className="text-center mb-8 md:mb-10">
                  <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
                    {t.formSection.eyebrow}
                  </p>
                  <h2 className="text-[24px] sm:text-3xl md:text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 md:mb-4">
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
                  <p className="text-[13.5px] md:text-[15px] text-[#a8a8a8] leading-relaxed max-w-[520px] mx-auto text-balance">
                    {t.formSection.sub}
                  </p>
                </div>

                <div
                  className="space-y-5 md:space-y-6 p-5 md:p-8 rounded-2xl border border-[#1e1e1c] bg-[#0a0a0a]"
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

                  <Field label={t.fields.brand}>
                    <Input value={brand} onChange={setBrand} placeholder={t.fields.brandPh} type="url" />
                  </Field>

                  <div className="pt-2">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !email.trim()}
                      className="group w-full inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-bold px-8 py-4 min-h-[56px] rounded-full hover:bg-[#d4ff33] active:scale-[0.97] transition-all text-[16px] md:text-[17px] disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                      style={{ boxShadow: "0 18px 50px -10px rgba(200,255,0,0.7), 0 0 38px -4px rgba(200,255,0,0.4), inset 0 1px 0 rgba(255,255,255,0.45)" }}
                    >
                      <span>{submitting ? t.cta.submitting : t.cta.submit}</span>
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

            {/* Education + credibility for visitors who scrolled past
                form without converting. Proof (4 stats) -> About (who we
                are + what the drive is) -> Inside (4 modules) -> Qualify
                (yes/no fit). Each section is a touch point that can pull
                the visitor back up to the form via hero/sticky CTA. */}
            <FlashkaBelowFold lang={lang} />

            {/* Final recovery layer — FAQ handles their remaining
                objections; Final CTA gives them a scarcity push back
                to the form OR an alternate call-booking path. */}
            <FlashkaPostForm lang={lang} scrollToForm={scrollToForm} />
          </>
        ) : (
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

      <style jsx global>{`
        @keyframes startFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Embedded USB drive — photoreal cap+body with CSS 3D tilt
           + specular sweep + reflection underneath. All GPU-cheap
           (transform/opacity/filter only). The 3D-feel comes from
           perspective on the outer wrap and a slow rotateY+rotateX
           wobble on the inner wrap. */
        @keyframes flashkaLed {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
        @keyframes flashkaInsert {
          from { opacity: 0; transform: translate3d(0, 28px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes flashkaTilt {
          /* Symmetric, gentler tilt — large amplitudes made the drive
             look off-center at the extremes of the loop. */
          0%, 100% { transform: rotateY(-9deg) rotateX(4deg)  translateY(0); }
          50%      { transform: rotateY( 9deg) rotateX(-3deg) translateY(-6px); }
        }
        @keyframes flashkaSpec {
          /* Specular highlight that slides across the body */
          0%, 100% { transform: translateX(-30%); opacity: 0; }
          40%      { opacity: 1; }
          60%      { opacity: 1; }
          100%     { transform: translateX( 30%); opacity: 0; }
        }
        .flashka-drive-perspective {
          /* Balanced hero centerpiece — big enough to dominate but
             not so big it hogs the viewport. Tightened upper end
             from 520 -> 460 (desktop) so the drive shares more
             space with the headline above. */
          width: clamp(280px, 52vw, 460px);
          margin: clamp(16px, 3vh, 32px) auto clamp(6px, 2vh, 16px);
          perspective: 1400px;
          perspective-origin: 50% 50%;
          animation: flashkaInsert 0.9s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .flashka-drive-wrap {
          transform-style: preserve-3d;
          animation: flashkaTilt 7s ease-in-out infinite;
          will-change: transform;
        }
        .flashka-drive-svg {
          width: 100%;
          height: auto;
          aspect-ratio: 380 / 170;
          display: block;
          filter:
            drop-shadow(0 4px 6px rgba(0, 0, 0, 0.55))
            drop-shadow(0 16px 28px rgba(0, 0, 0, 0.55))
            drop-shadow(0 0 36px rgba(200, 255, 0, 0.22));
        }
        .flashka-drive-led {
          transform-origin: center;
          animation: flashkaLed 2.4s ease-in-out infinite;
        }
        .flashka-drive-spec {
          mix-blend-mode: screen;
          animation: flashkaSpec 5s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .flashka-drive-caption {
          margin-top: 14px;
          text-align: center;
          font-family: ui-monospace, 'Geist Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(200, 255, 0, 0.6);
        }
        @media (prefers-reduced-motion: reduce) {
          .flashka-drive-perspective { animation: none; }
          .flashka-drive-wrap { animation: none; transform: none; }
          .flashka-drive-led  { animation: none; opacity: 0.85; }
          .flashka-drive-spec { animation: none; opacity: 0; }
        }
        .flashka-mesh-bg {
          background:
            radial-gradient(60% 50% at 22% 18%, rgba(200, 255, 0, 0.24), transparent 65%),
            radial-gradient(55% 45% at 78% 38%, rgba(200, 255, 0, 0.16), transparent 70%),
            radial-gradient(70% 55% at 50% 88%, rgba(180, 240, 0, 0.12), transparent 72%);
          animation: flashkaMeshDrift 24s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes flashkaMeshDrift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          33%      { transform: translate3d(2.5%, -2%, 0); }
          66%      { transform: translate3d(-1.5%, 1.5%, 0); }
        }
        .flashka-grid-overlay {
          background-image:
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%);
        }
        @media (prefers-reduced-motion: reduce) {
          .flashka-mesh-bg { animation: none; }
        }
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

/* ───────────  Form building blocks  ─────────── */

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
      className="w-full bg-[#0d0d0d] border border-[#1e1e1c] focus:border-[#c8ff00]/60 focus:outline-none focus:ring-2 focus:ring-[#c8ff00]/35 rounded-md px-4 py-4 md:py-3.5 min-h-[52px] md:min-h-0 text-[16px] md:text-[15px] text-[#ece8e1] placeholder-[#555] transition-all hover:border-[#2a2a28] touch-manipulation"
    />
  );
}

