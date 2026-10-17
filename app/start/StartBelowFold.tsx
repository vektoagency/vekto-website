"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import SectionPlate from "../components/SectionPlate";
import { startCopy, type Lang } from "./translations";
import { COPY as HOME_COPY, StageCast, StageCases } from "../preview-brutalism/BrutalismHomepage";

// Below-the-fold of /start, now speaking the homepage's funnel language:
// 03 · ROSTER + THE WORK (the homepage's own sections)
// 04 · WHAT YOU GET (the homepage's stamped promise)
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
  const home = HOME_COPY[lang];
  const castRef = useRef<HTMLElement | null>(null);
  const casesRef = useRef<HTMLElement | null>(null);

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
      {/* ───────────── 03 · ROSTER + THE WORK — същите секции като началната
           страница (Явор, 17.10: „тук използвай секции от home page“), вместо
           старите карти с казуси. ───────────── */}
      <StageCast targetRef={castRef} t={home.stage4} />
      <StageCases targetRef={casesRef} t={home.stageCases} />

      {/* ───────────── 04 · WHAT YOU GET — the homepage's stamped pass,
           rendered statically here: the homepage earns its 190vh sticky
           scroll, a landing page should not spend it. ───────────── */}
      <section className="relative overflow-hidden py-14 md:py-24" style={{ background: "#0d0d0d" }}>
        <SectionPlate src="ai" />
        <div data-animate-bf className="reveal-bf relative max-w-3xl mx-auto px-5 md:px-8">
          <div
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] mb-4 opacity-55"
            style={{ fontFamily: FONTS.pixel }}
          >
            {t.promise.eyebrow}
          </div>
          <h2
            className="font-black uppercase leading-[1.02] tracking-[-0.03em] mb-8 md:mb-10"
            style={{ fontSize: "calc(clamp(24px, 4vw, 44px) * var(--bgk, 1))" }}
          >
            {t.promise.h2}{" "}
            <span
              className="italic pr-[0.08em]"
              style={{
                background: SILVER_H,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.promise.h2Highlight}
            </span>
          </h2>
          <div
            className="border-2"
            style={{
              borderColor: "rgba(244,244,244,0.3)",
              background: "#0d0d0d",
              boxShadow: "5px 5px 0 0 #2a2a2a",
            }}
          >
            {t.promise.items.map((item, i) => (
              <div
                key={item}
                className="flex items-start gap-3 md:gap-4 px-3.5 md:px-6 py-3.5 md:py-4"
                style={{
                  borderBottom:
                    i < t.promise.items.length - 1
                      ? "1px solid rgba(244,244,244,0.14)"
                      : "none",
                }}
              >
                <span
                  aria-hidden
                  className="mt-0.5 w-7 h-7 shrink-0 border-2 flex items-center justify-center font-black text-[#0d0d0d]"
                  style={{ background: SILVER_H, borderColor: "rgba(244,244,244,0.5)" }}
                >
                  ✓
                </span>
                <span className="text-sm md:text-base leading-[1.4] font-bold uppercase">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

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
        className="relative overflow-hidden py-16 md:py-28"
        style={{ background: "#0d0d0d", borderTop: "1px solid rgba(244,244,244,0.14)" }}
      >
        <SectionPlate src="websites" />
        <div data-animate-bf className="reveal-bf relative max-w-4xl mx-auto px-5 md:px-8 text-center">
          <p
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] opacity-55 mb-5"
            style={{ fontFamily: FONTS.pixel }}
          >
            {t.finalCta.eyebrow}
          </p>
          <h2
            className="font-black uppercase leading-[0.95] tracking-[-0.03em] mb-5 md:mb-7"
            style={{ fontSize: "calc(clamp(34px, 6vw, 76px) * var(--bgk, 1))" }}
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

      <Footer />
    </>
  );
}

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
