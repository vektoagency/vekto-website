"use client";

import Link from "next/link";
import HeroLeftCurtain from "./HeroLeftCurtain";
import PortfolioTriggerButton from "./PortfolioTriggerButton";
import { useT } from "../i18n/LangProvider";

function Stagger({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <div
      className={`animate-hero-fade-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Hero() {
  // Premium repositioning — restraint + confidence pattern that
  // Wieden+Kennedy, Mother, Droga5, Anomaly all use. Instead of
  // enumerating services (which every agency does — that's table
  // stakes, not premium), the hero states ONE claim and lets the
  // work + client roster do the selling below the fold.
  //
  // The claim itself is a selectivity signal: 'we choose 12 new
  // brands per year' (scarcity + curation) paired with the real
  // proof numbers (50+ brands total, 4.8× ROAS, BG + US markets).
  const t = useT({
    bg: {
      badge: "НЕЗАВИСИМА АГЕНЦИЯ ЗА РАСТЕЖ",
      h1Em: "12 нови бранда",
      h1RestDesktop: ["на година.", "Твоят следващ."],
      h1RestMobile: "на година.",
      sub: "50+ бранда в България и САЩ. 4.8× среден ROAS. Един екип, един стандарт — от стратегия до резултат.",
      subMobile: "50+ бранда · България и САЩ · 4.8× ROAS",
      ctaPrimary: "Резервирай разговор",
      ctaSecondary: "Виж работата",
      credentialsEyebrow: "ДОКАЗАНО В ЦИФРИ",
      credentialsStats: [
        { value: "50+", label: "Бранда в България и САЩ" },
        { value: "4.8×", label: "Среден ROAS от кампаниите" },
        { value: "12", label: "Нови партньорства годишно" },
      ],
      credentialsCta: "Виж кейс стъдитата",
    },
    en: {
      badge: "INDEPENDENT GROWTH AGENCY",
      h1Em: "12 new brands",
      h1RestDesktop: ["a year.", "Yours next."],
      h1RestMobile: "a year.",
      sub: "50+ brands across Bulgaria and the US. 4.8× average ROAS. One team, one standard — from strategy through scale.",
      subMobile: "50+ brands · BG + US · 4.8× ROAS",
      ctaPrimary: "Book a call",
      ctaSecondary: "See the work",
      credentialsEyebrow: "PROVEN IN NUMBERS",
      credentialsStats: [
        { value: "50+", label: "Brands in Bulgaria and the US" },
        { value: "4.8×", label: "Average campaign ROAS" },
        { value: "12", label: "New partnerships per year" },
      ],
      credentialsCta: "See case studies",
    },
  });
  return (
    <section id="hero" className="relative min-h-screen flex overflow-hidden bg-[#080808]">

      {/* MOBILE atmospheric background — was a cinematic video wall (AI
          videos cycling), now a static premium dark surface with subtle
          lime accents. Removes the 'AI video studio' signal that
          dominated the umbrella positioning. AI portfolio work lives on
          /ai-creative and /portfolio subpages now. */}
      <div aria-hidden className="lg:hidden absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ background: "#080808" }} />
        {/* Lime glow — top-right */}
        <div
          className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,255,0,0.14) 0%, rgba(200,255,0,0) 65%)",
          }}
        />
        {/* Lime glow — bottom-left */}
        <div
          className="absolute -bottom-60 -left-40 w-[560px] h-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,255,0,0.08) 0%, rgba(200,255,0,0) 65%)",
          }}
        />
        {/* Subtle blueprint grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(200,255,0,0.85) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,255,0,0.85) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 70% at 50% 50%, black 20%, transparent 80%)",
            maskImage:
              "radial-gradient(ellipse 90% 70% at 50% 50%, black 20%, transparent 80%)",
          }}
        />
      </div>

      {/* Desktop atmosphere — kept minimal: flat black base + subtle
          warm bottom + lime CRT halo + blueprint grid + floor glow.
          No multi-stop linear gradients = no banding. */}
      <div aria-hidden className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ background: "#080808" }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, transparent 65%, rgba(60,40,20,0.16) 100%)",
        }} />

        {/* Lime CRT bounce — soft halo behind the monitor */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 36% 42% at 74% 48%, rgba(200,255,0,0.14) 0%, rgba(200,255,0,0.04) 42%, transparent 78%)",
        }} />

        {/* Blueprint grid — soft-masked schematic fade */}
        <div
          className="absolute inset-y-0 right-0 w-[55%]"
          style={{
            opacity: 0.055,
            backgroundImage:
              "linear-gradient(to right, rgba(200,255,0,0.85) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,255,0,0.85) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            WebkitMaskImage: "radial-gradient(ellipse 65% 70% at 45% 50%, black 30%, transparent 85%)",
            maskImage: "radial-gradient(ellipse 65% 70% at 45% 50%, black 30%, transparent 85%)",
          }}
        />

        <div
          className="absolute bottom-0 right-[8%] w-[52%] h-[16%]"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(200,255,0,0.12), transparent 70%)" }}
        />
      </div>

      {/* DESKTOP right side — was a scrolling PortfolioWindow of video
          thumbnails (which read as 'AI video studio'). Replaced with a
          static credentials panel that fits the umbrella positioning:
          three big proof numbers + a featured brands strip + a link to
          the deep case studies page. Reads as premium 'here's who we
          are + what we've delivered', not 'here are our videos'. */}
      <div className="hidden lg:flex absolute right-0 top-24 bottom-10 w-[44%] items-center justify-center px-8">
        <div
          className="relative w-full max-w-md bg-[#0a0a0a] border border-[#1e1e1c] rounded-2xl p-8 xl:p-10"
          style={{
            boxShadow:
              "0 20px 60px -20px rgba(0,0,0,0.6), 0 0 60px -20px rgba(200,255,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Corner lime accent */}
          <span
            aria-hidden
            className="absolute -top-px -right-px w-24 h-24 rounded-tr-2xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(200,255,0,0.22) 0%, transparent 65%)",
            }}
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-6">
            {t.credentialsEyebrow}
          </p>
          <div className="space-y-6 mb-8">
            {t.credentialsStats.map((s: { value: string; label: string }) => (
              <div key={s.label} className="flex items-baseline justify-between gap-4 pb-4 border-b border-[#1e1e1c] last:border-0 last:pb-0">
                <div className="text-4xl xl:text-5xl font-extrabold text-[#c8ff00] tabular-nums leading-none">
                  {s.value}
                </div>
                <div className="text-[11px] xl:text-[12px] uppercase tracking-[0.2em] text-[#7a7a7a] text-right max-w-[180px]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[#c8ff00] hover:text-[#e0ff4a] transition-colors"
          >
            <span>{t.credentialsCta}</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* ── MOBILE: text/CTAs floated over the video background.
          Container is pointer-events-none so taps fall through to the
          PortfolioWindow's tap-to-open button; only the CTAs themselves
          capture taps. Text gets a strong shadow + the dark gradient
          scrim above does the heavy lifting on readability. */}
      <HeroLeftCurtain className="lg:hidden relative z-10 flex flex-col items-center text-center px-5 w-full min-h-svh pt-[12vh] pb-[20vh] pointer-events-none">
        {/* Two-anchor layout: text glues to the top (right under the
            nav), CTAs glue to the bottom thumb-zone (16vh above the
            bottom edge). flex-1 spacer absorbs the middle, so the video
            band gets the whole center of the screen as breathing room.
            Result: CTAs sit around 70-80% of viewport — comfortable
            thumb reach without "stuck to the edge" feeling. */}
        <div className="w-full max-w-[420px] mx-auto">
          <Stagger delay={0}>
            <h1
              className="text-[44px] font-extrabold leading-[1.02] tracking-[-0.025em] text-white text-balance"
              style={{
                textShadow:
                  "0 4px 36px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.9)",
              }}
            >
              <em className="not-italic text-[#c8ff00]">{t.h1Em}</em>
              <br />
              {t.h1RestMobile}
            </h1>
          </Stagger>
          <Stagger delay={120}>
            <p
              className="mt-5 text-[15px] text-white/85 font-medium leading-[1.55] max-w-[320px] mx-auto text-balance"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.98), 0 0 8px rgba(0,0,0,0.95)" }}
            >
              {t.subMobile}
            </p>
          </Stagger>
        </div>

        {/* flex-1 spacer between text and CTAs — middle of viewport
            becomes pure video band, CTAs anchor to the bottom thumb-zone. */}
        <div className="flex-1" />

        <Stagger delay={300} className="w-full pointer-events-auto">
          <div className="flex flex-col items-center gap-3.5 w-full max-w-[340px] mx-auto">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-bold w-full px-7 py-4 rounded-full hover:bg-[#d4ff33] active:scale-[0.98] transition-all text-[16px]"
              style={{
                boxShadow:
                  "0 18px 50px -10px rgba(200,255,0,0.75), 0 0 38px -4px rgba(200,255,0,0.4), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              <span>{t.ctaPrimary}</span>
              <span className="text-[17px] leading-none transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
            <PortfolioTriggerButton
              className="inline-flex items-center gap-1.5 text-[#c8ff00] hover:text-white font-semibold text-[13px] tracking-[0.04em] px-5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 backdrop-blur-sm cursor-pointer transition-all"
            >
              <span>{t.ctaSecondary}</span>
              <span className="text-[14px]">↗</span>
            </PortfolioTriggerButton>
          </div>
        </Stagger>
      </HeroLeftCurtain>

      {/* ── DESKTOP: text left (curtain fades out on zoom) ── */}
      <HeroLeftCurtain
        className="hidden lg:flex absolute inset-y-0 left-0 w-[64%] z-10 flex-col justify-center px-12 xl:px-20 pt-24 pb-16"
        style={{
          background:
            "linear-gradient(to right, #080808 0%, #080808 60%, rgba(8,8,8,0.92) 75%, rgba(8,8,8,0.7) 86%, rgba(8,8,8,0.4) 94%, transparent 100%)",
        }}
      >
        <Stagger delay={0} className="w-fit">
          <div className="inline-flex items-center gap-2 border border-[#c8ff00]/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse" />
            <span className="text-xs text-[#c8ff00] font-medium tracking-widest uppercase">
              {t.badge}
            </span>
          </div>
        </Stagger>
        <Stagger delay={150}>
          <h1 className="text-[64px] xl:text-[88px] font-bold leading-[1.04] tracking-tight mb-7">
            <em className="not-italic text-[#c8ff00]">{t.h1Em}</em>
            <br />
            {t.h1RestDesktop[0]}
            <br />
            {t.h1RestDesktop[1]}
          </h1>
        </Stagger>
        <Stagger delay={300}>
          <p className="max-w-xl text-lg xl:text-xl text-[#a0a0a0] leading-relaxed mb-10">
            {t.sub}
          </p>
        </Stagger>
        <Stagger delay={450}>
          <div className="flex gap-4">
            <a href="#contact" className="bg-[#c8ff00] text-black font-semibold px-8 py-4 rounded-full hover:bg-[#d4ff33] transition-colors">
              {t.ctaPrimary}
            </a>
            <PortfolioTriggerButton className="border border-[#333] text-white font-semibold px-8 py-4 rounded-full hover:border-[#555] hover:bg-white/5 transition-colors cursor-pointer">
              {t.ctaSecondary}
            </PortfolioTriggerButton>
          </div>
        </Stagger>
      </HeroLeftCurtain>

    </section>
  );
}
