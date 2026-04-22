"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import AnimateIn from "./AnimateIn";
import { openContactModal } from "./ContactModal";

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
          <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-4">Get in Touch</p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Ready to build
            <br />
            <span className="text-[#c8ff00]">something iconic?</span>
          </h2>
          <p className="text-[#a0a0a0] text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Pick what fits you best — hop on a quick call or drop us a message.
            Either way, we&apos;ll come back with a tailored plan.
          </p>
        </AnimateIn>

        <AnimateIn>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              data-cal-namespace="30min"
              data-cal-link="vekto/30min"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="group inline-flex items-center justify-center gap-2.5 bg-[#c8ff00] text-black font-semibold px-8 py-4 rounded-full hover:bg-[#d4ff33] transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{ boxShadow: "0 14px 40px -12px rgba(200,255,0,0.55)" }}
            >
              <CalendarIcon />
              Book a Call
              <span className="text-black/60 text-xs font-normal ml-1">30 min · free</span>
            </button>
            <button
              onClick={() => openContactModal("message")}
              className="inline-flex items-center justify-center gap-2.5 border border-[#222] text-white font-semibold px-8 py-4 rounded-full hover:border-[#c8ff00]/40 hover:bg-[#c8ff00]/5 transition-colors cursor-pointer"
            >
              <MessageIcon />
              Send Message
              <span className="text-[#666] text-xs font-normal ml-1">reply in 24h</span>
            </button>
          </div>
        </AnimateIn>

        <AnimateIn>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12 text-sm text-[#888]">
            {[
              "Proposal within 24h",
              "No commitments",
            ].map((item) => (
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
