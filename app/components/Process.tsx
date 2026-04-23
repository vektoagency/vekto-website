"use client";

import { useEffect, useState } from "react";
import AnimateIn from "./AnimateIn";

const steps = [
  {
    number: "01",
    tag: "Discover",
    title: "We learn your brand inside out",
    body:
      "Deep-dive call, audit of your current content + positioning, and a crystal-clear brief on the audience we need to move.",
    bullets: ["Brand + audience audit", "Competitor scan", "Positioning brief"],
  },
  {
    number: "02",
    tag: "Strategy",
    title: "Angles + funnel, mapped",
    body:
      "We build a creative system: hook banks, series formats, and the journey from scroll to sale. No one-off guesses.",
    bullets: ["Hook + angle library", "Series formats", "Funnel mapping"],
  },
  {
    number: "03",
    tag: "Production",
    title: "AI + cinematic pipeline",
    body:
      "Our in-house stack fuses AI visuals, real footage, and cinematic direction — fast output without the usual agency drag.",
    bullets: ["AI-assisted shots", "Cinematic direction", "Weekly output"],
  },
  {
    number: "04",
    tag: "Scale",
    title: "Ship, measure, double down",
    body:
      "We track what lands, cut what doesn't, and compound the winners. Content becomes a growth engine, not a cost centre.",
    bullets: ["Performance tracking", "Winner compounding", "Quarterly reviews"],
  },
];

export default function Process() {
  const [active, setActive] = useState(0);

  // Gentle auto-advance so the panel demonstrates its own interactivity.
  // Any user interaction (hover/click) restarts the timer from the new step.
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 5000);
    return () => clearInterval(id);
  }, [active]);

  const current = steps[active];

  return (
    <section
      id="process"
      className="py-20 px-6"
      style={{ background: "linear-gradient(to bottom, #080808, #0a0a0d, #080808)" }}
    >
      <div className="max-w-6xl mx-auto">
        <AnimateIn className="mb-10 max-w-3xl">
          <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            From first call to
            <br />
            <span className="text-[#c8ff00]">compounding content</span>
          </h2>
        </AnimateIn>

        <AnimateIn>
          <div className="relative rounded-2xl border border-[#161616] bg-[#0b0b0b] overflow-hidden">
            {/* Step selector row — the connecting line sits behind the pills */}
            <div className="relative">
              <div aria-hidden className="absolute inset-x-6 top-1/2 h-px bg-[#1d1d1d]" />
              <div
                aria-hidden
                className="absolute top-1/2 h-px bg-[#c8ff00]/70 transition-all duration-500 ease-out"
                style={{
                  left: "1.5rem",
                  width: `calc((100% - 3rem) * ${active / (steps.length - 1)})`,
                }}
              />
              <div className="relative grid grid-cols-4">
                {steps.map((s, i) => {
                  const isActive = i === active;
                  const isPast = i < active;
                  return (
                    <button
                      key={s.number}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className="group flex flex-col items-center justify-center py-6 md:py-8 px-2 text-center cursor-pointer outline-none"
                      aria-pressed={isActive}
                    >
                      <span
                        className={`relative z-[1] w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-mono text-[11px] md:text-xs font-bold transition-all duration-300 ${
                          isActive
                            ? "bg-[#c8ff00] text-black scale-110 shadow-[0_0_25px_rgba(200,255,0,0.45)]"
                            : isPast
                              ? "bg-[#c8ff00]/25 text-[#c8ff00] border border-[#c8ff00]/40"
                              : "bg-[#0d0d0d] text-[#666] border border-[#1c1c1c] group-hover:border-[#c8ff00]/30 group-hover:text-[#c8ff00]"
                        }`}
                      >
                        {s.number}
                      </span>
                      <span
                        className={`mt-2.5 font-mono text-[9px] md:text-[11px] uppercase tracking-[0.25em] transition-colors ${
                          isActive ? "text-[#c8ff00]" : "text-[#666] group-hover:text-[#aaa]"
                        }`}
                      >
                        {s.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detail panel — swaps in/out when active step changes */}
            <div className="border-t border-[#161616] px-6 md:px-10 py-7 md:py-9">
              <div key={current.number} className="animate-[fadeInUp_0.45s_ease_both]">
                <h3 className="text-xl md:text-3xl font-semibold text-white leading-tight mb-3">
                  {current.title}
                </h3>
                <p className="text-[#a0a0a0] text-sm md:text-base leading-relaxed max-w-3xl mb-5">
                  {current.body}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {current.bullets.map((b) => (
                    <li
                      key={b}
                      className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] border border-[#c8ff00]/25 text-[#c8ff00]/90 bg-[#c8ff00]/[0.04] px-3 py-1.5 rounded-full"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer bar — auto-play progress + CTA */}
            <div className="border-t border-[#161616] flex items-center justify-between gap-4 px-6 md:px-10 py-4 bg-[#0a0a0a]">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#c8ff00]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
                Step {active + 1} / {steps.length}
              </div>
              <a
                href="#contact"
                className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-black bg-[#c8ff00] hover:bg-[#d4ff33] px-4 py-2 rounded-full transition-colors"
              >
                Start a project →
              </a>
            </div>
          </div>
        </AnimateIn>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
