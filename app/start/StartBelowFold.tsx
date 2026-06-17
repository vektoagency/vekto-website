"use client";

import { useEffect, useRef, useState } from "react";
import { startCopy, type Lang } from "./translations";

// Below-the-fold sections of /start, lazy-loaded via next/dynamic from
// StartClient. Keeps the initial JS bundle for hero+form lean so the
// page paints instantly for cold paid-traffic landings. Hydrates only
// after the main bundle is idle / when these sections approach view.
//
// Sections: How it works · Stats counters · Comparison table · FAQ
// accordion · Final CTA. The sticky mobile CTA stays in the parent
// component because it depends on the hero IntersectionObserver.

type Props = {
  lang: Lang;
  scrollToForm: () => void;
};

export default function StartBelowFold({ lang, scrollToForm }: Props) {
  const t = startCopy[lang];

  // Scroll-triggered reveal — same single-observer pattern as the
  // parent. Lives here so the below-fold sections animate in on their
  // own once this chunk mounts; the parent's observer would never see
  // these nodes before the chunk loaded.
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
      {/* ─────────────  HOW IT WORKS (3-step process)  ───────────── */}
      <section className="bg-[#0a0a0a] border-y border-[#1e1e1c] py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div data-animate-bf className="reveal-bf text-center mb-10 md:mb-14">
            <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
              {t.process.eyebrow}
            </p>
            <h2 className="text-[28px] sm:text-4xl md:text-[48px] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
              {t.process.h2}{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)" }}
              >
                {t.process.h2Highlight}
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
            {t.process.steps.map((s, i) => (
              <div
                key={s.number}
                data-animate-bf
                className="reveal-bf relative p-6 md:p-7 rounded-2xl border border-[#1e1e1c] bg-[#0d0d0d] hover:border-[#c8ff00]/35 hover:bg-[#101010] transition-colors"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#c8ff00]/85 mb-3 inline-block">
                  / {s.number}
                </span>
                <h3 className="font-bold text-lg md:text-xl text-white mb-2.5 leading-tight">
                  {s.title}
                </h3>
                <p className="text-[13.5px] md:text-[14.5px] text-[#9a958e] leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────  STATS (animated counters)  ───────────── */}
      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div data-animate-bf className="reveal-bf text-center mb-10 md:mb-14">
            <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
              {t.stats.eyebrow}
            </p>
            <h2 className="text-[28px] sm:text-4xl md:text-[48px] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
              {t.stats.h2}{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)" }}
              >
                {t.stats.h2Highlight}
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {t.stats.items.map((s) => (
              <div
                key={s.label}
                data-animate-bf
                className="reveal-bf text-center px-3 py-5 md:p-7 rounded-2xl border border-[#1e1e1c] bg-[#0d0d0d]"
              >
                <div className="font-extrabold text-[#c8ff00] tabular-nums tracking-tight text-[40px] md:text-6xl leading-none mb-2 md:mb-3">
                  <CountUp target={s.value} decimals={s.decimals} />
                  <span>{s.suffix}</span>
                </div>
                <p className="text-[11.5px] md:text-[13.5px] text-[#a0a0a0] leading-snug text-balance">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────  COMPARISON (us vs agency vs in-house)  ───────────── */}
      <section className="bg-[#0a0a0a] border-y border-[#1e1e1c] py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div data-animate-bf className="reveal-bf text-center mb-10 md:mb-14">
            <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
              {t.compare.eyebrow}
            </p>
            <h2 className="text-[28px] sm:text-4xl md:text-[48px] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
              {t.compare.h2}{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)" }}
              >
                {t.compare.h2Highlight}
              </span>
            </h2>
          </div>
          <div data-animate-bf className="reveal-bf overflow-x-auto rounded-2xl border border-[#1e1e1c]">
            <table className="w-full text-[12px] md:text-sm" style={{ minWidth: "560px" }}>
              <thead>
                <tr className="bg-[#0d0d0d] border-b border-[#1e1e1c]">
                  {t.compare.headers.map((h, i) => (
                    <th
                      key={h}
                      className={`py-3 md:py-4 px-3 md:px-5 text-left font-medium ${
                        i === 1 ? "text-[#c8ff00]" : "text-[#666]"
                      }`}
                    >
                      {i === 1 ? (
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden
                            style={{ width: 56, height: 22, backgroundColor: "#c8ff00", maskImage: "url('/images/logo.webp')", maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center", WebkitMaskImage: "url('/images/logo.webp')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }}
                          />
                        </div>
                      ) : (
                        h
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161616]">
                {t.compare.rows.map((row) => (
                  <tr key={row[0]} className="hover:bg-white/[0.01] transition-colors">
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className={`py-3 md:py-3.5 px-3 md:px-5 ${
                          i === 0
                            ? "text-[#888] font-medium"
                            : i === 1
                            ? "text-white font-semibold bg-[#c8ff00]/5"
                            : "text-[#666]"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─────────────  FAQ (objection handling accordion)  ───────────── */}
      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div data-animate-bf className="reveal-bf text-center mb-10 md:mb-12">
            <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
              {t.faq.eyebrow}
            </p>
            <h2 className="text-[28px] sm:text-4xl md:text-[44px] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
              {t.faq.h2}{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)" }}
              >
                {t.faq.h2Highlight}
              </span>
            </h2>
          </div>
          <div data-animate-bf className="reveal-bf space-y-3 md:space-y-4">
            {t.faq.items.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────  FINAL CTA  ───────────── */}
      <section className="relative bg-[#0a0a0a] border-t border-[#1e1e1c] py-16 md:py-24 overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none opacity-[0.10]"
          style={{ background: "radial-gradient(circle, #c8ff00 0%, transparent 60%)" }}
        />
        <div data-animate-bf className="reveal-bf relative max-w-3xl mx-auto px-5 md:px-8 text-center">
          <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-4">
            {t.finalCta.eyebrow}
          </p>
          <h2 className="text-[32px] sm:text-5xl md:text-[60px] font-extrabold leading-[1.04] tracking-[-0.02em] mb-5 md:mb-6 text-balance">
            {t.finalCta.h2}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)",
                filter: "drop-shadow(0 2px 28px rgba(200,255,0,0.42))",
              }}
            >
              {t.finalCta.h2Highlight}
            </span>
          </h2>
          <p className="text-[14px] md:text-[17px] text-[#a0a0a0] leading-relaxed max-w-[560px] mx-auto mb-8 md:mb-10 text-balance">
            {t.finalCta.sub}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <button
              onClick={scrollToForm}
              className="group inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-bold px-8 py-4 rounded-full hover:bg-[#d4ff33] active:scale-[0.98] transition-all text-[15px] md:text-[16px]"
              style={{ boxShadow: "0 18px 50px -10px rgba(200,255,0,0.7), 0 0 38px -4px rgba(200,255,0,0.4), inset 0 1px 0 rgba(255,255,255,0.45)" }}
            >
              {t.finalCta.scrollToForm}
            </button>
            <button
              data-cal-namespace="30min"
              data-cal-link="vekto/30min"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="inline-flex items-center justify-center gap-2 border border-[#c8ff00]/55 text-[#c8ff00] font-semibold px-8 py-3.5 rounded-full hover:bg-[#c8ff00]/10 transition-colors text-[14px] md:text-[15px] cursor-pointer"
            >
              📅 {t.finalCta.orBook}
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

function CountUp({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 40;
          const inc = target / steps;
          let cur = 0;
          const id = setInterval(() => {
            cur = Math.min(cur + inc, target);
            setVal(cur);
            if (cur >= target) clearInterval(id);
          }, 1400 / steps);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toFixed(decimals)}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-xl border transition-colors ${
        open ? "border-[#c8ff00]/35 bg-[#0d0d0d]" : "border-[#1e1e1c] bg-[#0a0a0a] hover:border-[#c8ff00]/20"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 md:px-6 md:py-5 text-left"
        aria-expanded={open}
      >
        <span className={`text-[14px] md:text-[16px] font-semibold leading-snug ${open ? "text-white" : "text-[#cfcbc4]"}`}>
          {q}
        </span>
        <span
          aria-hidden
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
            open
              ? "bg-[#c8ff00] border-[#c8ff00] text-black rotate-180"
              : "border-[#c8ff00]/45 text-[#c8ff00]"
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
          <p className="px-5 pb-5 md:px-6 md:pb-6 text-[13.5px] md:text-[14.5px] text-[#a8a8a8] leading-relaxed">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
