"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import AnimateIn from "./AnimateIn";
import { useT } from "../i18n/LangProvider";

const PHONE = "+359882251474";
const PHONE_DISPLAY = "+359 88 225 1474";

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function Contact() {
  const t = useT({
    bg: {
      eyebrow: "Свържи се",
      h2: ["Готов ли си да построиш", "нещо култово?"],
      sub: "Избери това, което ти пасва — онлайн среща или попълни кратка анкета. Във всеки случай ще се върнем с план, направен за теб.",
      bookCall: "Резервирай среща",
      bookSuffix: "30 мин · безплатно",
      startForm: "Попълни анкетата",
      startFormSuffix: "≈ 1 минута",
      callBtn: "Обади се",
      perks: ["Предложение до 24ч", "Без обвързване"],
    },
    en: {
      eyebrow: "Get in Touch",
      h2: ["Ready to build", "something iconic?"],
      sub: "Pick what fits you best — book an online meeting or fill out a quick survey. Either way, we'll come back with a plan made for you.",
      bookCall: "Book an Online Meeting",
      bookSuffix: "30 min · free",
      startForm: "Fill out the survey",
      startFormSuffix: "≈ 1 minute",
      callBtn: "Call now",
      perks: ["Proposal within 24h", "No commitments"],
    },
  });

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  return (
    <section id="contact" className="relative py-28 px-6 overflow-hidden" style={{ background: "linear-gradient(to bottom, #060606, #0a0a0f)" }}>
      <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none opacity-[0.10]"
        style={{ background: "radial-gradient(circle, #c8ff00 0%, transparent 60%)" }} />

      <div className="relative max-w-3xl mx-auto text-center">
        <AnimateIn>
          <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-4">{t.eyebrow}</p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {t.h2[0]}
            <br />
            <span className="text-[#c8ff00]">{t.h2[1]}</span>
          </h2>
          <p className="text-[#a0a0a0] text-lg leading-relaxed mb-10 max-w-xl mx-auto">{t.sub}</p>
        </AnimateIn>

        <AnimateIn>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <button
              data-cal-namespace="30min"
              data-cal-link="vekto/30min"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="group inline-flex items-center justify-center gap-2.5 bg-[#c8ff00] text-black font-semibold px-6 py-3.5 rounded-full hover:bg-[#d4ff33] transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{ boxShadow: "0 14px 40px -12px rgba(200,255,0,0.55)" }}
            >
              <CalendarIcon />
              {t.bookCall}
              <span className="text-black/60 text-xs font-normal ml-1">{t.bookSuffix}</span>
            </button>
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center justify-center gap-2.5 border border-[#c8ff00]/50 text-[#c8ff00] font-semibold px-6 py-3.5 rounded-full hover:bg-[#c8ff00]/10 transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />
              </svg>
              {t.callBtn}
              <span className="text-[#c8ff00]/60 text-xs font-normal ml-1 tabular-nums">{PHONE_DISPLAY}</span>
            </a>
            <a
              href="/start"
              className="inline-flex items-center justify-center gap-2.5 border border-[#222] text-white font-semibold px-6 py-3.5 rounded-full hover:border-[#c8ff00]/40 hover:bg-[#c8ff00]/5 transition-colors cursor-pointer"
            >
              <MessageIcon />
              {t.startForm}
              <span className="text-[#666] text-xs font-normal ml-1">{t.startFormSuffix}</span>
            </a>
          </div>
        </AnimateIn>

        <AnimateIn>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12 text-sm text-[#888]">
            {t.perks.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-[#c8ff00]">✓</span>
                {item}
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
