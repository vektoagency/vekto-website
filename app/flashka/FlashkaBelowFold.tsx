"use client";

import { useEffect, useRef, useState } from "react";
import { flashkaCopy, type Lang } from "./translations";

// Pre-form sections (the EDUCATIONAL leg of the funnel for cold paid
// traffic). Visitor flow: hero → here (proof + about + inside +
// qualify) → form. Order matches direct-response funnel best practice:
//
//   1. PROOF      — instant credibility (30+ brands, $10M+, 4.8x ROAS)
//   2. ABOUT      — who VEKTO is + what the flash drive metaphor means
//   3. INSIDE     — what's actually inside (4 system modules)
//   4. QUALIFY    — yes/no fit check (filters tire-kickers pre-form)
//
// FAQ + Final CTA live in FlashkaPostForm — those sections only matter
// to visitors who scrolled past the form without filling it.

type Props = { lang: Lang };

export default function FlashkaBelowFold({ lang }: Props) {
  const t = flashkaCopy[lang];

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-animate-fk]");
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
      {/* ─────────────  1. PROOF (instant credibility right after hero)  ───────────── */}
      <section className="border-b border-[#1e1e1c] py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div data-animate-fk className="reveal-fk text-center mb-10 md:mb-14">
            <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
              {t.proof.eyebrow}
            </p>
            <h2 className="text-[28px] sm:text-4xl md:text-[48px] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
              {t.proof.h2}{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)" }}
              >
                {t.proof.h2Highlight}
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {t.proof.items.map((s) => (
              <div
                key={s.label}
                data-animate-fk
                className="reveal-fk text-center px-3 py-5 md:p-7 rounded-2xl border border-[#1e1e1c] bg-[#0d0d0d] hover:border-[#c8ff00]/25 transition-colors"
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

      {/* ─────────────  2. ABOUT (who we are + what the drive is)  ───────────── */}
      <section className="border-b border-[#1e1e1c] bg-[#0a0a0a] py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div data-animate-fk className="reveal-fk text-center mb-8 md:mb-12">
            <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
              {t.about.eyebrow}
            </p>
            <h2 className="text-[28px] sm:text-4xl md:text-[44px] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
              <span className="text-white">{t.about.h2}</span>{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)" }}
              >
                {t.about.h2Highlight}
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div
              data-animate-fk
              className="reveal-fk p-6 md:p-8 rounded-2xl border border-[#1e1e1c] bg-[#0d0d0d] hover:border-[#c8ff00]/25 transition-colors"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c8ff00]/85 mb-3">
                {t.about.vektoLabel}
              </p>
              <p className="text-[14px] md:text-[15.5px] text-[#cfcbc4] leading-relaxed">
                {t.about.vektoBody}
              </p>
            </div>
            <div
              data-animate-fk
              className="reveal-fk p-6 md:p-8 rounded-2xl border border-[#c8ff00]/30 bg-[#c8ff00]/[0.04] hover:border-[#c8ff00]/45 transition-colors"
              style={{ boxShadow: "0 12px 36px -16px rgba(200,255,0,0.18)" }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c8ff00] mb-3">
                {t.about.driveLabel}
              </p>
              <p className="text-[14px] md:text-[15.5px] text-[#dcdcd6] leading-relaxed">
                {t.about.driveBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────  3. INSIDE (what's on the flash drive)  ───────────── */}
      <section className="border-b border-[#1e1e1c] py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div data-animate-fk className="reveal-fk text-center mb-10 md:mb-14">
            <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
              {t.inside.eyebrow}
            </p>
            <h2 className="text-[28px] sm:text-4xl md:text-[48px] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
              {t.inside.h2}{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)" }}
              >
                {t.inside.h2Highlight}
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {t.inside.items.map((s) => (
              <div
                key={s.number}
                data-animate-fk
                className="reveal-fk group relative p-6 md:p-7 rounded-2xl border border-[#1e1e1c] bg-[#0d0d0d] hover:border-[#c8ff00]/40 hover:bg-[#101010] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_rgba(200,255,0,0.18)] transition-all duration-200"
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

      {/* ─────────────  4. QUALIFY (yes/no fit check — pre-screens before form)  ───────────── */}
      <section className="border-b border-[#1e1e1c] bg-[#0a0a0a] py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div data-animate-fk className="reveal-fk text-center mb-10 md:mb-12">
            <p className="font-mono text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
              {t.qualify.eyebrow}
            </p>
            <h2 className="text-[28px] sm:text-4xl md:text-[48px] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
              {t.qualify.h2}{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)" }}
              >
                {t.qualify.h2Highlight}
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div
              data-animate-fk
              className="reveal-fk p-6 md:p-8 rounded-2xl border border-[#c8ff00]/30 bg-[#c8ff00]/[0.03]"
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#c8ff00] mb-5">
                {t.qualify.yesTitle}
              </h3>
              <ul className="space-y-3">
                {t.qualify.yesItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] md:text-[15px] text-[#dcdcd6] leading-relaxed">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              data-animate-fk
              className="reveal-fk p-6 md:p-8 rounded-2xl border border-[#1e1e1c] bg-[#0d0d0d]"
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#888] mb-5">
                {t.qualify.noTitle}
              </h3>
              <ul className="space-y-3">
                {t.qualify.noItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] md:text-[15px] text-[#888] leading-relaxed">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        [data-animate-fk].reveal-fk {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s cubic-bezier(0.25, 0.8, 0.3, 1), transform 0.7s cubic-bezier(0.25, 0.8, 0.3, 1);
          will-change: opacity, transform;
        }
        [data-animate-fk][data-animate-in="true"].reveal-fk {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          [data-animate-fk].reveal-fk { opacity: 1; transform: none; }
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
