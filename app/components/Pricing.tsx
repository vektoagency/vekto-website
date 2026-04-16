import AnimateIn from "./AnimateIn";

const factors = [
  {
    title: "Project scope",
    description: "Every brand has different needs. We assess what your project actually requires — not what fits a template.",
  },
  {
    title: "Production depth",
    description: "A quick social clip and a full AI brand film are different beasts. Pricing reflects the real work behind each video.",
  },
  {
    title: "Volume & continuity",
    description: "Working with us on an ongoing basis or larger volumes? We structure the collaboration to make sense for both sides.",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-28 px-6" style={{ background: "linear-gradient(to bottom, #080808, #0a0a0f, #080808)" }}>
      <div className="max-w-7xl mx-auto">

        <AnimateIn className="mb-12 md:mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-3">Transparent Pricing</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Priced around
                <br />
                <span className="text-[#c8ff00]">your business</span>
              </h2>
            </div>
            <p className="text-[#a0a0a0] max-w-sm leading-relaxed">
              We don't believe in one-size-fits-all pricing. Every project is quoted individually — based on what you actually need, not a catalogue rate.
            </p>
          </div>
        </AnimateIn>

        {/* Price + comparison */}
        <AnimateIn>
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center">
              <p className="text-xs text-[#555] uppercase tracking-widest mb-2">Traditional agencies</p>
              <p className="text-3xl md:text-4xl font-bold text-[#333] line-through">€100 – €XXXX</p>
              <p className="text-sm text-[#444] mt-1">per video</p>
            </div>
            <div className="text-[#c8ff00] text-3xl font-bold hidden md:block">→</div>
            <div className="text-3xl md:text-2xl font-bold text-[#c8ff00] md:hidden">↓</div>
            <div className="text-center">
              <div style={{ width: 80, height: 30, backgroundColor: "#c8ff00", maskImage: "url('/images/logo.png')", maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center", WebkitMaskImage: "url('/images/logo.png')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center", margin: "0 auto 8px" }} />
              <p className="text-xs text-[#a0a0a0] uppercase tracking-widest mb-1">Starting from</p>
              <p className="text-3xl md:text-4xl font-bold text-white">€35</p>
              <p className="text-sm text-[#a0a0a0] mt-1">per video, VAT included</p>
            </div>
            <div className="bg-[#c8ff00]/10 border border-[#c8ff00]/20 rounded-xl px-6 py-4 text-center">
              <p className="text-[#c8ff00] text-3xl font-bold">~60%</p>
              <p className="text-sm text-[#a0a0a0] mt-1">less than traditional</p>
            </div>
          </div>
        </AnimateIn>

        {/* What affects the price */}
        <AnimateIn>
          <p className="text-xs text-[#555] uppercase tracking-widest mb-6">What shapes the price</p>
        </AnimateIn>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {factors.map((f, i) => (
            <AnimateIn key={f.title} delay={i * 100}>
              <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 h-full hover:border-[#c8ff00]/20 hover:shadow-[0_0_20px_rgba(200,255,0,0.04)] transition-all duration-300">
                <div className="w-8 h-8 rounded-full border border-[#c8ff00]/30 flex items-center justify-center text-[#c8ff00] text-sm font-mono mb-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-[#a0a0a0] leading-relaxed">{f.description}</p>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* CTA */}
        <AnimateIn className="text-center">
          <p className="text-[#a0a0a0] mb-6">Book a meeting and we'll create a <span className="text-white font-medium">free demo video for your business</span> — so you see exactly what we can do before spending a cent.</p>
          <button
            data-cal-namespace="30min"
            data-cal-link="vekto/30min"
            data-cal-config='{"layout":"month_view","theme":"dark"}'
            className="inline-block bg-[#c8ff00] text-black font-semibold px-10 py-4 rounded-full hover:bg-[#d4ff33] transition-colors cursor-pointer"
          >
            Book a free demo →
          </button>
        </AnimateIn>

      </div>
    </section>
  );
}
