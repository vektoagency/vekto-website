import { HeroVideosMobile, HeroVideosDesktop } from "./HeroVideos";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex overflow-hidden bg-[#080808]">

      <HeroVideosMobile />
      <HeroVideosDesktop />

      {/* Mobile gradients top/bottom */}
      <div className="lg:hidden absolute inset-x-0 top-0 h-32 z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #080808, transparent)" }} />
      <div className="lg:hidden absolute inset-x-0 bottom-0 h-40 z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to top, #080808, transparent)" }} />

      {/* Mobile dark overlay */}
      <div className="lg:hidden absolute inset-0 bg-[#080808]/70 z-[1]" />

      {/* ── MOBILE text ── */}
      <div className="lg:hidden relative z-10 flex flex-col items-center justify-center text-center px-6 w-full min-h-screen pt-20 pb-12">
        <div className="inline-flex items-center gap-2 border border-[#c8ff00]/40 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse" />
          <span className="text-xs text-[#c8ff00] font-medium tracking-widest uppercase">
            AI-Powered Creative Agency
          </span>
        </div>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight mb-5">
          <em className="not-italic text-[#c8ff00]">AI-Driven Vision</em>
          <br />
          for the Future
          <br />
          of Brands
        </h1>
        <p className="text-base text-[#c0c0c0] leading-relaxed mb-8 max-w-xs">
          From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a href="#contact" className="bg-[#c8ff00] text-black font-semibold px-8 py-4 rounded-full hover:bg-[#d4ff33] transition-colors">
            Get a Free Demo
          </a>
          <a href="#work" className="border border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors">
            See Our Work
          </a>
        </div>
        <p className="text-xs text-[#555] mt-4">Free demo tailored to your business — no strings attached.</p>
      </div>

      {/* ── DESKTOP: text left ── */}
      <div className="hidden lg:flex relative z-10 flex-col justify-center px-16 xl:px-24 pt-24 pb-16 w-[55%] flex-shrink-0">
        <div className="inline-flex items-center gap-2 border border-[#c8ff00]/30 rounded-full px-4 py-1.5 mb-8 w-fit">
          <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse" />
          <span className="text-xs text-[#c8ff00] font-medium tracking-widest uppercase">
            AI-Powered Creative Agency
          </span>
        </div>
        <h1 className="text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
          <em className="not-italic text-[#c8ff00]">AI-Driven Vision</em>
          <br />
          for the Future
          <br />
          of Brands
        </h1>
        <p className="max-w-md text-lg text-[#a0a0a0] leading-relaxed mb-10">
          From cinematic storytelling to AI-powered short-form systems, we create visual ecosystems built to scale.
        </p>
        <div className="flex gap-4">
          <a href="#contact" className="bg-[#c8ff00] text-black font-semibold px-8 py-4 rounded-full hover:bg-[#d4ff33] transition-colors">
            Get a Free Demo
          </a>
          <a href="#work" className="border border-[#333] text-white font-semibold px-8 py-4 rounded-full hover:border-[#555] hover:bg-white/5 transition-colors">
            See Our Work
          </a>
        </div>
        <p className="text-sm text-[#555] mt-4">Free demo tailored to your business — no strings attached.</p>
      </div>

    </section>
  );
}
