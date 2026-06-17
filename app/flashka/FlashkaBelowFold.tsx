"use client";

import { useEffect, useRef, useState } from "react";
import { flashkaCopy, type Lang } from "./translations";

// Brand logos for the client trust strip — mirrors the /start roster
// so the same brand world reads as 'these are the businesses on the
// system the page is selling'. Order picked so visually-loud brands
// alternate with quieter ones.
const FLASHKA_CLIENTS = [
  { name: "DUSQ", logo: "/images/logo-dusq.webp", invert: true },
  { name: "PARFEN", logo: "/images/logo-parfen.webp", invert: true },
  { name: "MEN'S CARE", logo: "/images/logo-menscare.png" },
  { name: "BIOTICA", logo: "/images/logo-biotica.webp", invert: true },
  { name: "ANOMALY", logo: "/images/logo-anomaly.webp", invert: true },
  { name: "ETHAN'S", logo: "/images/logo-ethans.webp", invert: true },
  { name: "NUTRIFITT", logo: "/images/logo-nutrifitt.webp" },
  { name: "ISOSPORT", logo: "/images/logo-isosport.webp" },
  { name: "LUCKY ENERGY", logo: "/images/logo-lucky.webp", invert: true },
  { name: "BEMEACNE", logo: "/images/logo-bemeacne.webp" },
  { name: "KRISTA G", logo: "/images/logo-krista-g-2022.webp" },
  { name: "TASTE FLAVOR CO.", logo: "/images/logo-tasteflavor.webp" },
];

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

      {/* ─────────────  CLIENTS (lean trust strip after the stats)  ─────
          Deliberately styled DIFFERENT from other sections: no big
          white+lime h2, just a small eyebrow + a single supporting
          line + the logo marquee. Reads as a 'credit line', not a
          competing section heading — gives visual variety to the
          stack of identically-shaped section h2's across the page. */}
      <section className="border-b border-[#1e1e1c] py-8 md:py-12 overflow-hidden">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div data-animate-fk className="reveal-fk text-center mb-5 md:mb-7">
            <p className="font-mono text-[10px] md:text-[11px] text-[#c8ff00]/85 uppercase tracking-[0.32em] mb-2">
              {t.clients.eyebrow}
            </p>
            <p className="text-[13px] md:text-[14.5px] text-[#9a958e] leading-relaxed">
              {t.clients.sub}
            </p>
          </div>
        </div>
        {/* Marquee row — full-bleed, masks edges so logos fade in/out */}
        <div
          className="relative overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div className="flex flashka-marquee gap-8 md:gap-12 w-max items-center">
            {[...FLASHKA_CLIENTS, ...FLASHKA_CLIENTS, ...FLASHKA_CLIENTS].map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                className="shrink-0 h-10 md:h-12 flex items-center justify-center px-2 md:px-3 opacity-70 hover:opacity-100 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.logo}
                  alt={c.name}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="h-6 md:h-8 w-auto object-contain"
                  style={{ filter: c.invert ? "brightness(0) invert(1)" : undefined }}
                />
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
        /* Client logos marquee — slow drift across the 3x-replicated
           row so the loop is seamless. GPU-accelerated transform-only
           animation, no layout work. */
        @keyframes flashkaMarquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-33.3333%, 0, 0); }
        }
        .flashka-marquee {
          animation: flashkaMarquee 42s linear infinite;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        @media (prefers-reduced-motion: reduce) {
          [data-animate-fk].reveal-fk { opacity: 1; transform: none; }
          .flashka-marquee { animation: none; }
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
