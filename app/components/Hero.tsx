import { HeroVideosMobile } from "./HeroVideos";
import HeroPravec from "./HeroPravec";
import HeroLeftCurtain from "./HeroLeftCurtain";
import PortfolioTriggerButton from "./PortfolioTriggerButton";

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
  return (
    <section id="hero" className="relative min-h-screen flex overflow-hidden bg-[#080808]">

      <HeroVideosMobile />

      {/* Desktop atmosphere + HUD ornaments. Sits behind the transparent
          canvas so CRT shader covers these naturally during zoom.
          Reads as a dim studio: cool ceiling, warm desk glow, lime CRT
          halo, a soft horizon line where wall meets floor. */}
      <div aria-hidden className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">
        {/* Base wash — cool navy top fading into warm near-black floor */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(to bottom,
              #0a1016 0%,
              #080a0d 30%,
              #09090a 58%,
              #0a0806 82%,
              #0c0805 100%)
          `,
        }} />

        {/* Off-screen key light from top-left — cool teal spill,
            like a window or softbox raking the scene. */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 50% at 12% 8%, rgba(120,200,220,0.10) 0%, rgba(80,160,200,0.04) 35%, transparent 70%)",
        }} />

        {/* Warm practical light from behind/above the desk — amber wash
            on the right wall, like a lamp or window catching dust. */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 55% 65% at 92% 25%, rgba(235,180,110,0.09) 0%, rgba(200,140,80,0.03) 40%, transparent 75%)",
        }} />

        {/* Lime CRT bounce — the Mac screen spills its own light onto
            the wall and desk in front of it. */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 48% 58% at 74% 48%, rgba(200,255,0,0.13) 0%, rgba(200,255,0,0.04) 40%, transparent 78%)",
        }} />

        {/* Horizon line — a faint bright band where wall meets desk;
            makes the scene read as a 3D space instead of a flat panel. */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: "74%",
            height: "1px",
            background: "linear-gradient(to right, transparent 0%, rgba(200,255,0,0.28) 18%, rgba(235,190,110,0.22) 55%, rgba(200,255,0,0.10) 85%, transparent 100%)",
            boxShadow: "0 0 24px rgba(200,255,0,0.10)",
          }}
        />

        {/* Floor: subtle amber sheen that fades toward camera — desk
            surface catching the warm practical light from above. */}
        <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(120,80,45,0.10) 55%, rgba(55,35,20,0.18) 100%)",
        }} />

        {/* Ceiling: a shallow darker cap to keep eyes centered. */}
        <div className="absolute inset-x-0 top-0 h-[22%]" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)",
        }} />

        {/* Blueprint grid — dim lime, masked soft around the screen so it
            reads like a technical schematic fading out at the edges. */}
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

        {/* Faint dust motes — two offset radial spots on the warm side. */}
        <div className="absolute inset-0 opacity-40" style={{
          background: `
            radial-gradient(circle 2px at 82% 34%, rgba(235,200,150,0.55), transparent 60%),
            radial-gradient(circle 1.5px at 68% 22%, rgba(235,200,150,0.45), transparent 60%),
            radial-gradient(circle 1px at 88% 62%, rgba(200,255,0,0.5), transparent 60%)
          `,
        }} />

        {/* Very subtle horizontal scanlines over the right half */}
        <div
          className="absolute inset-y-0 right-0 w-[50%]"
          style={{
            opacity: 0.04,
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(200,255,0,0.6) 0px, rgba(200,255,0,0.6) 1px, transparent 1px, transparent 4px)",
          }}
        />

        {/* Bottom-right technical caption */}
        <div className="absolute bottom-10 right-28 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00]/40">
          MACINTOSH 128K · 1984 — VEKTO/OS
        </div>

        {/* Floor glow directly under the Mac for grounding */}
        <div
          className="absolute bottom-0 right-[8%] w-[52%] h-[16%]"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(200,255,0,0.14), transparent 70%)" }}
        />

        {/* Edge vignette — soft dark corners pull focus to the Mac. */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 110% 90% at 70% 50%, transparent 45%, rgba(0,0,0,0.45) 95%)",
        }} />
      </div>

      {/* Desktop: canvas is fullscreen and transparent; Mac is panned
          visually onto the right via the idle camera. The left curtain
          below covers the rest so the layout reads the same as before.
          On click, camera zooms while the curtain fades out — one
          directionless motion, no rect expansion. */}
      <div className="hidden lg:block absolute inset-0">
        <HeroPravec />
      </div>

      {/* Mobile gradients top/bottom */}
      <div className="lg:hidden absolute inset-x-0 top-0 h-32 z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #080808, transparent)" }} />
      <div className="lg:hidden absolute inset-x-0 bottom-0 h-40 z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to top, #080808, transparent)" }} />

      {/* Mobile dark overlay */}
      <div className="lg:hidden absolute inset-0 bg-[#060606]/82 z-[1]" />
      <div className="lg:hidden absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, transparent 70%)" }} />

      {/* ── MOBILE text ── */}
      <div className="lg:hidden relative z-10 flex flex-col items-center justify-center text-center px-6 w-full min-h-screen pt-20 pb-12">
        <Stagger delay={0}>
          <div className="inline-flex items-center gap-2 border border-[#c8ff00]/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse" />
            <span className="text-xs text-[#c8ff00] font-medium tracking-widest uppercase">
              AI-Powered Creative Agency
            </span>
          </div>
        </Stagger>
        <Stagger delay={150}>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight mb-5 text-white"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}>
            <em className="not-italic text-[#c8ff00]">AI-Driven Vision</em>
            <br />
            for the Future
            <br />
            of Companies
          </h1>
        </Stagger>
        <Stagger delay={300}>
          <p className="text-base text-[#d8d8d8] leading-relaxed mb-8 max-w-xs"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}>
            From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.
          </p>
        </Stagger>
        <Stagger delay={450}>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <a href="#contact" className="bg-[#c8ff00] text-black font-semibold px-8 py-4 rounded-full hover:bg-[#d4ff33] transition-colors text-center">
              Let&apos;s Talk
            </a>
            <PortfolioTriggerButton className="border border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors text-center cursor-pointer">
              See Our Work
            </PortfolioTriggerButton>
          </div>
        </Stagger>
      </div>

      {/* ── DESKTOP: text left (curtain fades out on zoom) ── */}
      <HeroLeftCurtain
        className="hidden lg:flex absolute inset-y-0 left-0 w-[62%] z-10 flex-col justify-center px-16 xl:px-24 pt-24 pb-16"
        style={{ background: "linear-gradient(to right, #080808 0%, #080808 72%, transparent 100%)" }}
      >
        <Stagger delay={0} className="w-fit">
          <div className="inline-flex items-center gap-2 border border-[#c8ff00]/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse" />
            <span className="text-xs text-[#c8ff00] font-medium tracking-widest uppercase">
              AI-Powered Creative Agency
            </span>
          </div>
        </Stagger>
        <Stagger delay={150}>
          <h1 className="text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            <em className="not-italic text-[#c8ff00]">AI-Driven Vision</em>
            <br />
            for the Future
            <br />
            of Companies
          </h1>
        </Stagger>
        <Stagger delay={300}>
          <p className="max-w-md text-lg text-[#a0a0a0] leading-relaxed mb-10">
            From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.
          </p>
        </Stagger>
        <Stagger delay={450}>
          <div className="flex gap-4">
            <a href="#contact" className="bg-[#c8ff00] text-black font-semibold px-8 py-4 rounded-full hover:bg-[#d4ff33] transition-colors">
              Let&apos;s Talk
            </a>
            <PortfolioTriggerButton className="border border-[#333] text-white font-semibold px-8 py-4 rounded-full hover:border-[#555] hover:bg-white/5 transition-colors cursor-pointer">
              See Our Work
            </PortfolioTriggerButton>
          </div>
        </Stagger>
      </HeroLeftCurtain>

    </section>
  );
}
