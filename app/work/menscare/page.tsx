import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: "2,500+", label: "New Orders" },
  { value: "4.6x",  label: "ROAS" },
  { value: "50%",   label: "Ad Spend Scaled" },
  { value: "91%",   label: "Users Reporting Results" },
];

export default function MensCarePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Back */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/#work" className="flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-white transition-colors">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 4l-6 6 6 6" />
          </svg>
          Back
        </Link>
      </div>

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end px-6 pb-16 pt-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/work-menscare.jpg" alt="Men's Care" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto w-full">
          <div className="mb-4">
            <div style={{ position: "relative", width: "80px", height: "80px" }}>
              <Image src="/images/logo-menscare.png" alt="Men's Care" fill className="object-contain" />
            </div>
          </div>
          <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-3">Case Study</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Brand Elevation &<br />Content Strategy</h1>
          <p className="text-[#a0a0a0] max-w-xl text-lg">
            How we helped a premium grooming brand scale to 2,500+ new orders while maintaining 4.6x ROAS.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16 border-y border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#c8ff00] mb-2">{s.value}</div>
              <div className="text-sm text-[#a0a0a0]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-4">The Brand</p>
            <h2 className="text-3xl font-bold mb-6">Premium grooming,<br />powered by nature</h2>
            <p className="text-[#a0a0a0] leading-relaxed mb-4">
              Men's Care is a premium grooming brand specializing in beard and hair growth products made with natural ingredients — backed by a 120-day money-back guarantee and a community of over 10,000 customers, with 91% reporting new hair growth.
            </p>
            <p className="text-[#a0a0a0] leading-relaxed">
              They came to us with one goal: aggressive yet sustainable scaling of online sales over a 6-month period — reaching a broader audience and maximizing order volume without spiking their Cost Per Acquisition.
            </p>
          </div>
          <div>
            <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-4">Our Approach</p>
            <h2 className="text-3xl font-bold mb-6">Creative testing<br />at scale</h2>
            <div className="space-y-4 text-[#a0a0a0] leading-relaxed">
              <p>We rapidly produced and tested a massive variety of marketing angles using AI-enhanced tools for script generation and dynamic editing — identifying viral hooks and pain points that resonated.</p>
              <p>Alongside the creative output, we restructured their Meta Ads setup with proper top-of-funnel prospecting and bottom-of-funnel retargeting — enabling efficient scaling without wasted spend.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services used */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-6">Services Used</p>
          <div className="flex flex-wrap gap-3">
            {["Short-Form Authority Series", "AI Product Visuals", "AI Content Automation", "Cinematic Styling"].map((s) => (
              <span key={s} className="border border-[#222] text-[#a0a0a0] px-4 py-2 rounded-full text-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center border-t border-[#1a1a1a]">
        <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-4">Ready to scale?</p>
        <h2 className="text-4xl font-bold mb-6">Let's build your<br /><span className="text-[#c8ff00]">success story</span></h2>
        <Link
          href="/#contact"
          className="inline-block bg-[#c8ff00] text-black font-semibold px-10 py-4 rounded-full hover:bg-[#d4ff33] transition-colors"
        >
          Let's Talk
        </Link>
      </section>

    </div>
  );
}
