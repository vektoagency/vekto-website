"use client";

import HeroCinematicBg from "./HeroCinematicBg";
import HeroLeftCurtain from "./HeroLeftCurtain";
import PortfolioTriggerButton from "./PortfolioTriggerButton";
import PortfolioWindow from "./PortfolioWindow";
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
  const t = useT({
    bg: {
      badge: "Креативна агенция с AI",
      h1Em: "AI визия",
      h1RestDesktop: ["за бъдещето", "на бизнеса ти"],
      h1RestMobile: "за бизнеса ти",
      sub: "От кинематографични филми до видеа за социалните мрежи — създаваме съдържание, което продава и расте с бизнеса ти.",
      subMobile: "Кинематографични филми и видеа за социалните мрежи.",
      ctaPrimary: "Свържи се",
      ctaSecondary: "Виж работата ни",
    },
    en: {
      badge: "AI-Powered Creative Agency",
      h1Em: "AI-Driven Vision",
      h1RestDesktop: ["for the Future", "of Companies"],
      h1RestMobile: "for your business",
      sub: "From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.",
      subMobile: "Cinematic films and short-form content for social.",
      ctaPrimary: "Get in Touch",
      ctaSecondary: "See Our Work",
    },
  });
  return (
    <section id="hero" className="relative min-h-screen flex overflow-hidden bg-[#080808]">

      {/* MOBILE: single cinematic clip as full-bleed background, cycling
          smoothly through the curated heroFeaturedClipIds. Peak 2 decoders
          (active + preloading next), zero grid chaos — feels like a brand
          reel playing behind the text. */}
      <div className="lg:hidden absolute inset-0 z-[1]">
        <HeroCinematicBg />
      </div>

      {/* MOBILE readability scrims — strong top + bottom dark gradients
          frame the cinematic video band in the middle. No glass panel:
          text and CTAs sit naturally in the dark zones, video breathes
          uninterrupted in the middle ~30% of the screen. Reads as a
          cinematic "letterbox" rather than a UI overlay. */}
      <div
        aria-hidden
        className="lg:hidden absolute inset-x-0 top-0 h-[42%] z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.78) 45%, rgba(8,8,8,0.32) 80%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="lg:hidden absolute inset-x-0 bottom-0 h-[38%] z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.75) 45%, rgba(8,8,8,0.3) 82%, transparent 100%)",
        }}
      />

      {/* Edge vignette — pulls focus to the center video band */}
      <div
        aria-hidden
        className="lg:hidden absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 110% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.4) 100%)",
        }}
      />

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

      {/* Desktop: canvas is fullscreen and transparent; Mac is panned
          visually onto the right via the idle camera. The left curtain
          below covers the rest so the layout reads the same as before.
          On click, camera zooms while the curtain fades out — one
          directionless motion, no rect expansion. */}
      {/* DESKTOP: Portfolio window lives on the right side of the hero.
          Top padding clears the fixed Navbar so the thumbnails don't bleed
          into the logo / nav links area. */}
      <div className="hidden lg:flex absolute right-0 top-24 bottom-10 w-[44%] items-center justify-center">
        <PortfolioWindow />
      </div>

      {/* ── MOBILE: text/CTAs floated over the video background.
          Container is pointer-events-none so taps fall through to the
          PortfolioWindow's tap-to-open button; only the CTAs themselves
          capture taps. Text gets a strong shadow + the dark gradient
          scrim above does the heavy lifting on readability. */}
      <HeroLeftCurtain className="lg:hidden relative z-10 flex flex-col items-center justify-center text-center px-5 w-full min-h-svh pt-[13vh] pb-[10vh] pointer-events-none">
        {/* Single cluster (H1 + sub + CTAs) — justify-center keeps the
            whole block in the vertical middle of the viewport, so CTAs
            land in the 55-75% thumb zone on every phone size from
            iPhone SE up to Pro Max. No flex-1 spacer = no "buttons
            stuck to the bottom" on tall phones. min-h-[100svh] uses the
            *small* viewport height so layout is stable while iOS Safari
            shows/hides its URL bar (no jump on first scroll). */}
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

        {/* CTAs — minimal refinement: primary keeps its prominent lime
            fill, secondary moves from flat text link to a soft pill so
            it reads as clearly clickable without competing with primary.
            Visual hierarchy stays strict. */}
        <Stagger delay={300} className="w-full mt-10 pointer-events-auto">
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
