"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import AnimateIn from "./AnimateIn";
import { useT } from "../i18n/LangProvider";
import { trackEventBoth } from "./MetaPixel";


function CalendarIcon() {
  return (
    <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function Contact() {
  const t = useT({
    bg: {
      eyebrow: "Свържи се",
      h2: ["Готов да създадем", "нещо незабравимо?"],
      sub: "Избери — онлайн среща или кратка форма. Връщаме се с план, направен за теб.",
      bookCall: "Резервирай среща",
      bookSuffix: "30 мин · безплатно",
      startForm: "Опиши проекта си",
      startFormSuffix: "≈ 1 минута",
      perks: ["Предложение до 24ч", "Без обвързване"],
    },
    en: {
      eyebrow: "Get in Touch",
      h2: ["Ready to build", "something iconic?"],
      sub: "Pick what fits you best — book an online meeting or fill out a quick survey. Either way, we'll come back with a plan made for you.",
      bookCall: "Book an Online Meeting",
      bookSuffix: "30 min · free",
      startForm: "Describe your project",
      startFormSuffix: "≈ 1 minute",
      perks: ["Proposal within 24h", "Growth partner"],
    },
  });

  // Defer Cal.com embed init until the browser is idle — pulls ~30 KB of
  // their player JS off the critical path. With a 2.5 s timeout fallback
  // for browsers without requestIdleCallback. Namespace registration still
  // happens before the user can plausibly click the button.
  useEffect(() => {
    const initCal = async () => {
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

  return (
    <section id="contact" className="relative py-20 md:py-28 px-6 overflow-hidden" style={{ background: "linear-gradient(to bottom, #060606, #0a0a0f)" }}>
      <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none opacity-[0.10]"
        style={{ background: "radial-gradient(circle, #f4f4f4 0%, transparent 60%)" }} />

      <div className="relative max-w-3xl mx-auto text-center">
        <AnimateIn>
          {/* Eyebrow — pulse dot + lime label, matches Hero badge treatment */}
          <div className="inline-flex items-center gap-2 mb-5 md:mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-[#f4f4f4] animate-ping opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#f4f4f4]" />
            </span>
            <p className="text-[10px] md:text-xs text-[#f4f4f4] uppercase tracking-[0.3em] font-medium">
              {t.eyebrow}
            </p>
          </div>

          {/* H2 — bigger on mobile, lime gradient + drop-shadow glow on
              the highlighted second line. Mirrors the Hero H1 treatment
              so the two read as one design system. */}
          <h2
            className="text-[32px] sm:text-5xl md:text-[64px] font-extrabold leading-[1.05] sm:leading-[1.02] tracking-[-0.02em] mb-5 md:mb-6 text-balance"
            style={{
              textShadow: "0 2px 24px rgba(0,0,0,0.5)",
            }}
          >
            <span className="text-white">{t.h2[0]}</span>
            <br />
            <span
              className="relative inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 22%, #8a8a8a 45%, #eaeaea 62%, #c8c8c8 78%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                filter: "drop-shadow(0 2px 28px rgba(244,244,244,0.4))",
              }}
            >
              {t.h2[1]}
            </span>
          </h2>

          <p className="text-[#a8a8a8] text-[15px] md:text-lg leading-relaxed mb-10 max-w-[520px] md:max-w-xl mx-auto text-balance">
            {t.sub}
          </p>
        </AnimateIn>

        <AnimateIn>
          <div className="flex flex-col items-center gap-3">
            {/* Primary CTA — compact on mobile (px-5/py-3 + suffix hidden),
                expanded on sm+ (px-7/py-4 + suffix inline). Same shape as
                the hero primary so the two read as one design system. */}
            <button
              data-cal-namespace="30min"
              data-cal-link="vekto/30min"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              onClick={() => trackEventBoth("Schedule", { contentName: "contact_section" })}
              className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-[#f4f4f4] text-black font-bold px-5 sm:px-7 py-3 sm:py-4 rounded-full hover:bg-[#ffffff] active:scale-[0.98] transition-all hover:-translate-y-0.5 cursor-pointer text-[14px] sm:text-[15px]"
              style={{
                boxShadow:
                  "0 16px 44px -10px rgba(244,244,244,0.7), 0 0 32px -4px rgba(244,244,244,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <CalendarIcon />
              {t.bookCall}
              <span className="hidden sm:inline text-black/60 text-xs font-normal ml-1">{t.bookSuffix}</span>
            </button>

            {/* Secondary CTA — the written brief. */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/start"
                className="inline-flex items-center justify-center gap-2 sm:gap-2.5 border border-white/25 text-white font-bold px-5 sm:px-7 py-3 sm:py-4 rounded-full bg-black/40 backdrop-blur-md hover:border-[#f4f4f4]/40 hover:bg-[#f4f4f4]/5 active:scale-[0.98] transition-all cursor-pointer text-[14px] sm:text-[15px]"
              >
                <MessageIcon />
                {t.startForm}
                <span className="hidden sm:inline text-white/55 text-xs font-normal ml-1">{t.startFormSuffix}</span>
              </a>
            </div>
          </div>
        </AnimateIn>

        <AnimateIn>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12 text-sm text-[#888]">
            {t.perks.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-[#f4f4f4]">✓</span>
                {item}
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
