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

      {/* Mobile atmospheric backdrop — cleaner, more cinematic studio
          setup tuned for portrait. Reads as a single-subject photograph:
          deep moody black with a soft cool ambient, one strong warm
          key light from top-left raking the Mac, a lime CRT halo behind
          the monitor, and a heavy floor puddle grounding the machine. */}
      <div aria-hidden className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
        {/* Base — near-pure black with subtle cool lift so highlights pop */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to bottom,
            #060a10 0%,
            #050608 40%,
            #060504 78%,
            #080503 100%)`,
        }} />

        {/* Big warm key light spill from top-left — the main light source */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 90% 65% at 18% 12%, rgba(240,190,130,0.14) 0%, rgba(200,140,80,0.05) 45%, transparent 80%)",
        }} />

        {/* Cool fill from the opposite side for shape separation */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 70% 55% at 95% 75%, rgba(70,110,170,0.14) 0%, rgba(40,70,130,0.05) 50%, transparent 85%)",
        }} />

        {/* Lime CRT halo behind the monitor — tighter + brighter than before */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 55% 32% at 58% 44%, rgba(200,255,0,0.22) 0%, rgba(200,255,0,0.07) 40%, transparent 75%)",
        }} />

        {/* Secondary lime spill bleeding upward onto 'ceiling' */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 25% at 58% 28%, rgba(200,255,0,0.06) 0%, transparent 75%)",
        }} />

        {/* Heavy floor puddle directly under the Mac — anchors the machine */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: "15%",
            width: "75%",
            height: "18%",
            background: "radial-gradient(ellipse at 58% 100%, rgba(200,255,0,0.22) 0%, rgba(200,255,0,0.08) 35%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />

        {/* Floor gradient — warm soft kiss fading toward the camera */}
        <div className="absolute inset-x-0 bottom-0 h-[38%]" style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(90,60,35,0.12) 55%, rgba(30,18,10,0.3) 100%)",
        }} />

        {/* Strong ceiling cap — keeps eyes on the Mac */}
        <div className="absolute inset-x-0 top-0 h-[28%]" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
        }} />

        {/* Horizon line — subtle seam where 'wall' meets 'floor', right where Mac's keyboard sits */}
        <div className="absolute inset-x-0" style={{
          top: "68%",
          height: "1px",
          background: "linear-gradient(to right, transparent 10%, rgba(200,255,0,0.15) 50%, transparent 90%)",
        }} />

        {/* Strong edge vignette — pulls focus dramatically to Mac */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 95% 75% at 58% 50%, transparent 30%, rgba(0,0,0,0.75) 95%)",
        }} />
      </div>

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

        {/* Right-side accent gradient — a warm-to-cool horizontal wash
            that adds depth behind the Mac. Spans full width so the
            fade reaches all the way to the left edge with no visible
            seam where the layer starts. */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(to left,
              rgba(60,110,140,0.22) 0%,
              rgba(40,70,110,0.14) 35%,
              rgba(30,40,80,0.05) 70%,
              transparent 100%)
          `,
        }} />

        {/* Deep indigo sheen top-right — a pool of color that reads as
            a colored gel on the backdrop. */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 50% 55% at 88% 12%, rgba(90,120,200,0.18) 0%, rgba(60,80,160,0.07) 35%, transparent 72%)",
        }} />

        {/* Warm magenta/amber catch on the right edge — sunset-window
            vibe that warms the bottom-right corner. */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 45% 55% at 98% 70%, rgba(210,130,100,0.16) 0%, rgba(180,90,70,0.06) 40%, transparent 75%)",
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

        {/* Very subtle horizontal scanlines — masked so the strip has
            no hard left edge that would read as a seam. */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.04,
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(200,255,0,0.6) 0px, rgba(200,255,0,0.6) 1px, transparent 1px, transparent 4px)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 30%, black 65%, black 100%)",
            maskImage: "linear-gradient(to right, transparent 0%, transparent 30%, black 65%, black 100%)",
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

        {/* Edge vignette — centered so the falloff is symmetric and
            the left side doesn't darken into a visible band. */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 130% 110% at 55% 50%, transparent 55%, rgba(0,0,0,0.32) 100%)",
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

      {/* ── MOBILE hero — Mac renders fullscreen behind the content (same
          architecture as desktop) so the tap-to-zoom animation runs edge
          to edge with no container resize. Text sits on top with dark
          gradients for readability. */}
      <div className="lg:hidden absolute inset-0 z-[1]">
        <HeroPravec mobile />
      </div>

      {/* Top gradient — makes badge + H1 readable over the Mac */}
      <div className="lg:hidden absolute inset-x-0 top-0 h-[42%] z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.7) 55%, transparent 100%)" }} />
      {/* Bottom gradient — same for CTAs */}
      <div className="lg:hidden absolute inset-x-0 bottom-0 h-[40%] z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.75) 50%, transparent 100%)" }} />

      {/* Mobile content — overlays the Canvas with justify-between so Mac
          sits in the middle third, clear of the text at top/bottom.
          Wrapped in HeroLeftCurtain so the whole text stack fades out on
          zoom-start and fades back in on zoom-end (mirrors desktop). */}
      <HeroLeftCurtain className="lg:hidden relative z-10 flex flex-col items-center text-center px-6 w-full min-h-screen pt-20 pb-24 pointer-events-none">
        {/* Top cluster — pointer-events-auto only on interactive children */}
        <div className="flex flex-col items-center">
          <Stagger delay={0}>
            <div className="inline-flex items-center gap-2 border border-[#c8ff00]/35 rounded-full px-3.5 py-1 mb-4 bg-black/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
              <span className="text-[10px] text-[#c8ff00] font-medium tracking-[0.22em] uppercase">
                AI-Powered Creative Agency
              </span>
            </div>
          </Stagger>
          <Stagger delay={100}>
            <h1 className="text-[32px] sm:text-[36px] font-bold leading-[1.05] tracking-tight text-white"
              style={{ textShadow: "0 2px 22px rgba(0,0,0,0.85)" }}>
              <em className="not-italic text-[#c8ff00]">AI-Driven Vision</em>
              <br />
              for the Future of Companies
            </h1>
          </Stagger>
        </div>

        {/* Flexible spacer so the bottom cluster hugs the footer */}
        <div className="flex-1" />

        {/* Bottom cluster */}
        <div className="flex flex-col items-center">
          <Stagger delay={420}>
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-[#c8ff00]/40 bg-black/55 backdrop-blur-sm hero-tap-hint"
              style={{ boxShadow: "0 0 18px -2px rgba(200,255,0,0.35)" }}>
              <span aria-hidden className="hero-tap-arrow text-[#c8ff00] text-[13px] leading-none">↑</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c8ff00]">
                Tap the screen to open our reel
              </span>
            </div>
          </Stagger>
          <Stagger delay={520}>
            <div className="flex flex-col gap-3 w-full max-w-[280px] pointer-events-auto">
              <a href="#contact" className="bg-[#c8ff00] text-black font-semibold px-8 py-3.5 rounded-full hover:bg-[#d4ff33] transition-colors text-center">
                Let&apos;s Talk
              </a>
              <PortfolioTriggerButton className="border border-white/25 text-white font-semibold px-8 py-3.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-white/10 transition-colors text-center cursor-pointer">
                See Our Work
              </PortfolioTriggerButton>
            </div>
          </Stagger>
        </div>
      </HeroLeftCurtain>

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
