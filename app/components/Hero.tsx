"use client";

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
      h1RestMobile: "за бъдещето на бизнеса ти",
      sub: "От кинематографични филми до видеа за социалните мрежи — създаваме съдържание, което продава и расте с бизнеса ти.",
      ctaPrimary: "Свържи се",
      ctaSecondary: "Виж работата ни",
    },
    en: {
      badge: "AI-Powered Creative Agency",
      h1Em: "AI-Driven Vision",
      h1RestDesktop: ["for the Future", "of Companies"],
      h1RestMobile: "for the Future of Companies",
      sub: "From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.",
      ctaPrimary: "Get in Touch",
      ctaSecondary: "See Our Work",
    },
  });
  return (
    <section id="hero" className="relative min-h-screen flex overflow-hidden bg-[#080808]">

      {/* MOBILE: PortfolioWindow grid as full-bleed animated background. */}
      <div className="lg:hidden absolute inset-0 z-[1]">
        <PortfolioWindow mobile fullBleed />
      </div>

      {/* MOBILE readability scrim — lighter than before because the
          frosted glass command panel below carries most of the text
          readability work. These now exist mainly to soften the video
          edges into the nav/footer instead of as a heavy text scrim. */}
      <div
        aria-hidden
        className="lg:hidden absolute inset-x-0 top-0 h-[28%] z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.5) 50%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="lg:hidden absolute inset-x-0 bottom-0 h-[24%] z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.45) 55%, transparent 100%)",
        }}
      />

      {/* Subtle edge vignette — pulls focus to the center cluster */}
      <div
        aria-hidden
        className="lg:hidden absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 110% 70% at 50% 50%, transparent 45%, rgba(0,0,0,0.45) 100%)",
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
      <HeroLeftCurtain className="lg:hidden relative z-10 flex flex-col items-center text-center px-5 w-full min-h-screen pt-[15vh] pb-10 pointer-events-none">
        {/* Glass command panel — frosted card around badge / H1 / sub / CTAs
            so the whole cluster reads as a single focal anchor sitting
            crisply above the moving footage instead of floating text and
            buttons that blend into the busy background. */}
        <div className="relative w-full max-w-[400px] mx-auto pointer-events-auto">
          <div
            aria-hidden
            className="absolute -inset-x-5 -inset-y-7 rounded-[28px] border border-white/10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,10,0.62) 0%, rgba(8,8,8,0.78) 100%)",
              backdropFilter: "blur(16px) saturate(115%)",
              WebkitBackdropFilter: "blur(16px) saturate(115%)",
              boxShadow:
                "0 30px 70px -20px rgba(0,0,0,0.85), 0 0 70px -10px rgba(200,255,0,0.07), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          />

          <div className="relative flex flex-col items-center">
            <Stagger delay={0}>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5 border border-[#c8ff00]/55"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(200,255,0,0.22) 0%, rgba(200,255,0,0.08) 100%)",
                  boxShadow:
                    "0 0 22px -6px rgba(200,255,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
                <span className="text-[10px] text-[#c8ff00] font-semibold tracking-[0.24em] uppercase">
                  {t.badge}
                </span>
              </div>
            </Stagger>
            <Stagger delay={100}>
              <h1 className="text-[38px] sm:text-[44px] font-extrabold leading-[1.04] tracking-[-0.02em] text-white mb-3">
                <em className="not-italic text-[#c8ff00]">{t.h1Em}</em>
                <br />
                {t.h1RestMobile}
              </h1>
            </Stagger>
            <Stagger delay={200}>
              <p className="text-[14px] sm:text-[15px] text-[#d8d8d8] leading-[1.55] max-w-[340px] mb-7">
                {t.sub}
              </p>
            </Stagger>
            <Stagger delay={350} className="w-full">
              <div className="flex flex-col gap-3 w-full max-w-[320px] mx-auto">
                <a
                  href="#contact"
                  className="group inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-bold px-7 py-4 rounded-full hover:bg-[#d4ff33] active:scale-[0.98] transition-all text-[15px]"
                  style={{
                    boxShadow:
                      "0 16px 44px -10px rgba(200,255,0,0.7), 0 0 32px -4px rgba(200,255,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
                  }}
                >
                  <span>{t.ctaPrimary}</span>
                  <span className="text-[17px] leading-none transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <PortfolioTriggerButton
                  className="inline-flex items-center justify-center gap-2 border border-[#c8ff00]/55 text-[#c8ff00] font-bold px-7 py-4 rounded-full bg-black/40 backdrop-blur-md hover:bg-[#c8ff00]/10 active:scale-[0.98] transition-all cursor-pointer text-[15px]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>{t.ctaSecondary}</span>
                </PortfolioTriggerButton>
              </div>
            </Stagger>
          </div>
        </div>
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
