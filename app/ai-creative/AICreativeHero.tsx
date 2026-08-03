"use client";

import Link from "next/link";
import { useT } from "../i18n/LangProvider";

// Simpler, focused hero for the AI Creative page. Doesn't try to
// clone the homepage's cinematic video-BG + PortfolioWindow layout —
// this page's job is to sell the AI creative capability specifically,
// so the hero is text-forward with a big claim about AI production
// speed + quality. Video work lives on /portfolio (linked below).

function Stagger({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-hero-fade-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function AICreativeHero() {
  const t = useT({
    bg: {
      badge: "AI CREATIVE STUDIO",
      h1Top: "AI визия",
      h1Highlight: "за бъдещето",
      h1Bottom: "на бизнеса ти.",
      sub: "Кинематографични филми, кратки видеа, AI аватари, продуктови визии — създадени с AI на скорост и цена, каквито традиционните студия не могат да предложат.",
      stats: [
        { value: "3×", label: "по-бързо от студио" },
        { value: "60%", label: "по-евтино" },
        { value: "50+", label: "бранда използват" },
      ],
      ctaPrimary: "Резервирай разговор",
      ctaSecondary: "Виж работата ни",
    },
    en: {
      badge: "AI CREATIVE STUDIO",
      h1Top: "AI-driven vision",
      h1Highlight: "for the future",
      h1Bottom: "of your brand.",
      sub: "Cinematic films, short-form video, AI avatars, product visualization — produced with AI at speeds and prices traditional studios can't match.",
      stats: [
        { value: "3×", label: "faster than studios" },
        { value: "60%", label: "lower cost" },
        { value: "50+", label: "brands using it" },
      ],
      ctaPrimary: "Book a call",
      ctaSecondary: "See our work",
    },
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080808] pt-24 pb-16 px-6">
      {/* Ambient lime halos — atmosphere without a video wall */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[720px] h-[720px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200,255,0,0.16) 0%, rgba(200,255,0,0) 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-60 -left-40 w-[720px] h-[720px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200,255,0,0.08) 0%, rgba(200,255,0,0) 60%)",
        }}
      />
      {/* Blueprint grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(200,255,0,0.85) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,255,0,0.85) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 85%)",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 85%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <Stagger delay={0}>
          <div className="inline-flex items-center gap-2 border border-[#c8ff00]/35 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse" />
            <span className="font-mono text-[10px] md:text-xs text-[#c8ff00] tracking-[0.3em]">
              {t.badge}
            </span>
          </div>
        </Stagger>

        <Stagger delay={150}>
          <h1 className="text-[44px] sm:text-[64px] md:text-[88px] lg:text-[104px] font-bold leading-[1.02] tracking-tight mb-8 text-balance">
            <span className="text-white">{t.h1Top}</span>{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)",
                filter: "drop-shadow(0 2px 28px rgba(200,255,0,0.4))",
              }}
            >
              {t.h1Highlight}
            </span>{" "}
            <span className="text-white">{t.h1Bottom}</span>
          </h1>
        </Stagger>

        <Stagger delay={280}>
          <p className="max-w-3xl mx-auto text-base md:text-lg lg:text-xl text-[#a0a0a0] leading-relaxed mb-10 text-balance">
            {t.sub}
          </p>
        </Stagger>

        {/* Stats row — replaces the video wall as the credibility signal */}
        <Stagger delay={380}>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 mb-12 py-6 border-y border-[#1e1e1c]/70">
            {t.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-[#c8ff00] tabular-nums leading-none mb-1.5">
                  {s.value}
                </div>
                <div className="text-[11px] md:text-[13px] text-[#7a7a7a] uppercase tracking-[0.2em]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Stagger>

        <Stagger delay={500}>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-bold px-8 py-4 rounded-full hover:bg-[#d4ff33] active:scale-[0.98] transition-all text-[15px] md:text-[16px]"
              style={{
                boxShadow:
                  "0 18px 50px -10px rgba(200,255,0,0.55), 0 0 38px -4px rgba(200,255,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <span>{t.ctaPrimary}</span>
              <span className="text-[17px] leading-none transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 border border-[#333] text-white font-semibold px-8 py-4 rounded-full hover:border-[#c8ff00]/50 hover:bg-white/5 transition-all text-[15px]"
            >
              <span>{t.ctaSecondary}</span>
              <span className="text-[15px]">↗</span>
            </Link>
          </div>
        </Stagger>
      </div>
    </section>
  );
}
