import AnimateIn from "./AnimateIn";

const comparisons = [
  { aspect: "Speed",             vekto: "2–3 days",              traditional: "2–4 weeks",       inhouse: "1–2 weeks" },
  { aspect: "Cost",              vekto: "Predictable & lean",     traditional: "High & variable", inhouse: "High fixed cost" },
  { aspect: "Quality",           vekto: "AI + human craft",       traditional: "Human only",      inhouse: "Varies" },
  { aspect: "Brand Consistency", vekto: "AI-enforced",            traditional: "Manual",          inhouse: "Varies" },
  { aspect: "Availability",      vekto: "24/7",                   traditional: "Business hours",  inhouse: "Business hours" },
  { aspect: "Languages",         vekto: "Multilingual natively",  traditional: "Extra cost",      inhouse: "Rarely supported" },
];

const pillars = [
  { icon: "⚡", title: "Speed at Scale",         description: "AI-powered pipelines deliver content in days. No waiting, no bottlenecks — just results." },
  { icon: "🎯", title: "Strategic Creativity",   description: "Every piece of content is built with intent — designed to convert, engage, and grow your brand." },
  { icon: "🤖", title: "AI-Native Workflow",     description: "We don't bolt AI onto old processes. Our entire workflow is built around AI from day one." },
  { icon: "🌍", title: "Multilingual by Default",description: "Reach global audiences with AI avatars and content that speaks every language natively." },
];

export default function WhyVekto() {
  return (
    <section id="why" className="py-28 px-6" style={{ background: "linear-gradient(to bottom, #060606, #0a0a0f, #060606)" }}>
      <div className="max-w-7xl mx-auto">

        <AnimateIn className="text-center mb-20">
          <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-3">Why VEKTO</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            The creative partner
            <br />
            <span className="text-[#c8ff00]">your brand deserves</span>
          </h2>
        </AnimateIn>

        {/* Pillars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
          {pillars.map((p, i) => (
            <AnimateIn key={p.title} delay={i * 100}>
              <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 md:p-6 hover:border-[#c8ff00]/30 hover:shadow-[0_0_20px_rgba(200,255,0,0.05)] transition-all duration-300 h-full">
                <div className="text-2xl md:text-3xl mb-3">{p.icon}</div>
                <h3 className="font-semibold text-white text-sm md:text-base mb-2">{p.title}</h3>
                <p className="text-xs md:text-sm text-[#a0a0a0] leading-relaxed">{p.description}</p>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Comparison table */}
        <AnimateIn>
          <h3 className="text-2xl font-bold text-center mb-4">How we stack up</h3>

          {/* Mobile scroll hint */}
          <p className="text-center text-xs text-[#444] mb-6 md:hidden">← swipe to compare →</p>

          <div className="overflow-x-auto rounded-2xl border border-[#1a1a1a] -mx-2 px-2 md:mx-0 md:px-0">
            <table className="w-full text-xs md:text-sm" style={{ minWidth: "560px" }}>
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
                  <th className="text-left py-4 px-4 md:px-6 text-[#555] font-medium w-[28%]">Aspect</th>
                  <th className="py-4 px-4 md:px-6 text-[#c8ff00] font-semibold w-[24%]">
                    <div style={{ width: 72, height: 28, backgroundColor: "#c8ff00", maskImage: "url('/images/logo.png')", maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center", WebkitMaskImage: "url('/images/logo.png')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center", margin: "0 auto" }} />
                  </th>
                  <th className="py-4 px-4 md:px-6 text-[#555] font-medium w-[24%]">Traditional Agency</th>
                  <th className="py-4 px-4 md:px-6 text-[#555] font-medium w-[24%]">In-House</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111]">
                {comparisons.map((row) => (
                  <tr key={row.aspect} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 md:py-4 md:px-6 text-[#666]">{row.aspect}</td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-center text-white font-medium bg-[#c8ff00]/5">{row.vekto}</td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-center text-[#444]">{row.traditional}</td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-center text-[#444]">{row.inhouse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimateIn>

      </div>
    </section>
  );
}
