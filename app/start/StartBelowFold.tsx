"use client";

import { useEffect, useState } from "react";
import FlightPlan from "../components/FlightPlan";
import { startCopy, type Lang } from "./translations";

// Below-the-fold of /start, now speaking the homepage's funnel language:
// 03 · CASES (the homepage's hard-shadow case cards with silver counters)
// 04 · PROCESS (the shared FlightPlan trajectory)
// 05 · FAQ (naked hairline accordion)
// 06 · THE TALK (final ask — big display + white slab)
// Stats counters and the comparison table are gone — the numbers live in
// the cases, and the funnel stays terse.

const SILVER_H =
  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 22%, #8a8a8a 45%, #eaeaea 62%, #c8c8c8 78%, #ffffff 100%)";

const FONTS = {
  display: "var(--brutal-display), system-ui, sans-serif",
  pixel: "var(--brutal-pixel), ui-monospace, monospace",
  comic: "var(--brutal-comic), system-ui, sans-serif",
};

type Props = {
  lang: Lang;
  scrollToForm: () => void;
};

export default function StartBelowFold({ lang, scrollToForm }: Props) {
  const t = startCopy[lang];

  // Scroll-triggered reveal — same single-observer pattern as the parent.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-animate-bf]");
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
  }, []);

  return (
    <>
      {/* ───────────── 03 · CASES — the homepage's case-card grammar ───────────── */}
      <section className="py-14 md:py-24" style={{ background: "#0d0d0d" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] mb-8 md:mb-10 opacity-55"
            style={{ fontFamily: FONTS.pixel }}
          >
            {t.cases.eyebrow}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {t.cases.items.map((c, i) => (
              <CaseCard key={c.brand} c={c} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 04 · PROCESS — shared FlightPlan trajectory ───────────── */}
      <FlightPlan
        eyebrow={t.process.eyebrow}
        headline1={t.process.h2}
        headline2Prefix=""
        headline2Highlight={t.process.h2Highlight}
        steps={t.process.steps.map((s) => ({
          num: s.number,
          title: s.title,
          duration: s.duration,
          body: s.body,
        }))}
        fonts={FONTS}
      />

      {/* ───────────── 05 · FAQ — naked hairline accordion ───────────── */}
      <section
        className="py-14 md:py-24"
        style={{ background: "#141414", borderTop: "1px solid rgba(244,244,244,0.14)" }}
      >
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] mb-4 opacity-55"
            style={{ fontFamily: FONTS.pixel }}
          >
            {t.faq.eyebrow}
          </div>
          <h2
            className="font-black uppercase leading-[1.02] tracking-[-0.03em] mb-8 md:mb-10"
            style={{ fontSize: "calc(clamp(24px, 4vw, 44px) * var(--bgk, 1))" }}
          >
            {t.faq.h2}{" "}
            <span
              className="italic pr-[0.08em]"
              style={{
                background: SILVER_H,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.faq.h2Highlight}
            </span>
          </h2>
          <div>
            {t.faq.items.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} last={i === t.faq.items.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 06 · THE TALK — final ask ───────────── */}
      <section
        className="py-16 md:py-28"
        style={{ background: "#0d0d0d", borderTop: "1px solid rgba(244,244,244,0.14)" }}
      >
        <div data-animate-bf className="reveal-bf max-w-4xl mx-auto px-5 md:px-8 text-center">
          <p
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] opacity-55 mb-5"
            style={{ fontFamily: FONTS.pixel }}
          >
            {t.finalCta.eyebrow}
          </p>
          <h2
            className="font-black uppercase leading-[0.98] tracking-[-0.03em] mb-5 md:mb-7 text-balance"
            style={{ fontSize: "calc(clamp(32px, 6.4vw, 84px) * var(--bgk, 1))" }}
          >
            {t.finalCta.h2}{" "}
            <span
              className="italic pr-[0.08em]"
              style={{
                background: SILVER_H,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.finalCta.h2Highlight}
            </span>
          </h2>
          <p
            className="text-[14px] md:text-[16px] leading-relaxed max-w-[560px] mx-auto mb-8 md:mb-10 text-balance opacity-70 font-medium"
            style={{ fontFamily: FONTS.comic }}
          >
            {t.finalCta.sub}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <button
              onClick={scrollToForm}
              className="group inline-flex items-center justify-center gap-2 bg-[#f4f4f4] text-[#0d0d0d] font-black uppercase tracking-[0.15em] px-8 py-4 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform text-[13px] md:text-[14px]"
              style={{ boxShadow: "4px 4px 0 0 #3a3a3a" }}
            >
              {t.finalCta.scrollToForm}
            </button>
            <button
              data-cal-namespace="30min"
              data-cal-link="vekto/30min"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="inline-flex items-center justify-center gap-2 border-[1.5px] border-[#f4f4f4]/75 text-[#f4f4f4] font-bold uppercase tracking-[0.12em] px-8 py-3.5 hover:bg-white hover:text-black transition-colors text-[12px] md:text-[13px] cursor-pointer"
            >
              ▦ {t.finalCta.orBook}
            </button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        [data-animate-bf].reveal-bf {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s cubic-bezier(0.25, 0.8, 0.3, 1), transform 0.7s cubic-bezier(0.25, 0.8, 0.3, 1);
          will-change: opacity, transform;
        }
        [data-animate-bf][data-animate-in="true"].reveal-bf {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          [data-animate-bf].reveal-bf { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  );
}

// ───────────── Case card — the homepage's CaseCard, reveal-driven ─────────────
// Hard offset shadow, hairline internal borders, silver-fill metric that
// ticks up once the card enters the viewport.
function CaseCard({
  c,
  idx,
}: {
  c: {
    brand: string;
    category: string;
    metric: string;
    metricLabel: string;
    duration: string;
    highlight: string;
  };
  idx: number;
}) {
  const match = c.metric.match(/(\d+(?:\.\d+)?)(.*)/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : c.metric;
  const decimals = c.metric.includes(".") ? 1 : 0;

  const [inView, setInView] = useState(false);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const delay = idx * 160 + 350;
    const duration = 1300;
    let raf = 0;
    const timer = setTimeout(() => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        // ease-out cubic
        const e = 1 - Math.pow(1 - p, 3);
        setDisplayed(target * e);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [inView, idx, target]);

  const displayStr =
    decimals > 0 ? displayed.toFixed(1) + suffix : Math.round(displayed) + suffix;
  const rot = idx % 2 === 0 ? -1.5 : 1.5;

  return (
    <div
      ref={(el) => {
        if (!el || inView) return;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setInView(true);
              obs.disconnect();
            }
          },
          { threshold: 0.15 }
        );
        obs.observe(el);
      }}
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
      <div
        className="px-5 py-4 border-b-2 flex items-center justify-between"
        style={{ borderColor: "rgba(244,244,244,0.25)" }}
      >
        <div className="font-black text-lg uppercase tracking-tight">{c.brand}</div>
        <div
          className="text-[12px] uppercase tracking-[0.2em] opacity-60"
          style={{ fontFamily: FONTS.pixel }}
        >
          {c.category}
        </div>
      </div>
      <div className="px-5 py-8 md:py-10 flex-1 flex flex-col justify-center">
        <div
          className="font-black leading-none tabular-nums"
          style={{
            fontSize: "calc(clamp(56px, 7vw, 96px) * var(--bgk, 1))",
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
          style={{ fontFamily: FONTS.pixel }}
        >
          {c.metricLabel}
        </div>
      </div>
      <div className="p-5 space-y-3" style={{ borderTop: "1px solid rgba(244,244,244,0.18)" }}>
        <div
          className="inline-block px-2 py-1 border text-[12px] font-bold uppercase tracking-[0.2em]"
          style={{ fontFamily: FONTS.pixel, borderColor: "rgba(244,244,244,0.4)" }}
        >
          {c.duration}
        </div>
        <p className="text-[13px] leading-[1.5] font-medium" style={{ fontFamily: FONTS.comic }}>
          {c.highlight}
        </p>
      </div>
    </div>
  );
}

// ───────────── FAQ item — naked hairline accordion row ─────────────
function FaqItem({ q, a, last }: { q: string; a: string; last: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderTop: "1px solid rgba(244,244,244,0.16)",
        borderBottom: last ? "1px solid rgba(244,244,244,0.16)" : undefined,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 py-4 md:py-5 text-left"
        aria-expanded={open}
      >
        <span
          className={`text-[14px] md:text-[16px] font-bold uppercase tracking-tight leading-snug transition-opacity ${
            open ? "opacity-100" : "opacity-75"
          }`}
        >
          {q}
        </span>
        <span
          aria-hidden
          className={`shrink-0 w-7 h-7 flex items-center justify-center border-2 transition-all duration-300 ${
            open
              ? "bg-[#f4f4f4] border-[#f4f4f4] text-black rotate-180"
              : "border-[#f4f4f4]/45 text-[#f4f4f4]"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p
            className="pb-5 pr-10 text-[13.5px] md:text-[14.5px] leading-relaxed opacity-70 font-medium"
            style={{ fontFamily: FONTS.comic }}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
