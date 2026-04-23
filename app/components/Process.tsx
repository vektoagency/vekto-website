"use client";

import AnimateIn from "./AnimateIn";

const steps = [
  {
    number: "01",
    tag: "Discover",
    title: "We learn your brand inside out",
    body:
      "Deep-dive call, audit of your current content + positioning, and a crystal-clear brief on the audience we need to move.",
  },
  {
    number: "02",
    tag: "Strategy",
    title: "Angles + funnel, mapped",
    body:
      "We build a creative system: hook banks, series formats, and the journey from scroll to sale. No one-off guesses.",
  },
  {
    number: "03",
    tag: "Production",
    title: "AI + cinematic pipeline",
    body:
      "Our in-house stack fuses AI visuals, real footage, and cinematic direction — fast output without the usual agency drag.",
  },
  {
    number: "04",
    tag: "Scale",
    title: "Ship, measure, double down",
    body:
      "We track what lands, cut what doesn't, and compound the winners. Content becomes a growth engine, not a cost centre.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="py-28 px-6"
      style={{ background: "linear-gradient(to bottom, #080808, #0a0a0d, #080808)" }}
    >
      <div className="max-w-6xl mx-auto">
        <AnimateIn className="mb-16 max-w-3xl">
          <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            From first call to
            <br />
            <span className="text-[#c8ff00]">compounding content</span>
          </h2>
          <p className="mt-5 text-[#a0a0a0] leading-relaxed">
            A four-stage funnel designed to turn your brand into a content engine —
            not another agency deliverable.
          </p>
        </AnimateIn>

        <div className="relative">
          {/* Vertical spine on desktop — a dim lime line that connects the steps. */}
          <div
            aria-hidden
            className="hidden md:block absolute left-[46px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[#c8ff00]/25 to-transparent"
          />

          <ol className="flex flex-col gap-6 md:gap-8">
            {steps.map((s, i) => (
              <AnimateIn key={s.number} delay={i * 90} from="left">
                <li className="group relative flex gap-5 md:gap-8 items-start rounded-2xl border border-[#161616] bg-[#0c0c0c] hover:border-[#c8ff00]/25 hover:bg-[#0e0e0e] transition-colors p-6 md:p-8">
                  <div className="shrink-0 w-[60px] md:w-[76px] flex flex-col items-start">
                    <span className="font-mono text-[40px] md:text-[54px] leading-none font-bold text-[#c8ff00]/80 group-hover:text-[#c8ff00] transition-colors">
                      {s.number}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#c8ff00] mb-2">
                      {s.tag}
                    </p>
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-2.5 leading-tight">
                      {s.title}
                    </h3>
                    <p className="text-[#a0a0a0] text-sm md:text-base leading-relaxed max-w-2xl">
                      {s.body}
                    </p>
                  </div>
                </li>
              </AnimateIn>
            ))}
          </ol>
        </div>

        <AnimateIn delay={120}>
          <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-[#c8ff00]/20 rounded-2xl p-6 md:p-8 bg-[#0a0a0a]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-1.5">Ready when you are</p>
              <p className="text-white font-semibold text-lg md:text-xl">
                Most brands see their first cut live within two weeks.
              </p>
            </div>
            <a
              href="#contact"
              className="shrink-0 bg-[#c8ff00] text-black font-semibold px-7 py-3.5 rounded-full hover:bg-[#d4ff33] transition-colors"
            >
              Start a project
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
