"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AnimateIn from "./AnimateIn";

const projects = [
  {
    client: "ISOSPORT",
    logo: "/images/logo-isosport.png",
    image: "/images/work-isosport.jpg",
    title: "Promotional Video Campaign",
    description: "A series of high-impact promotional videos combining cinematic production with AI-enhanced visuals to elevate the brand's presence across digital channels.",
    tags: ["Cinematic Film", "AI Visuals", "Social Media"],
    category: "Brand Campaign",
    href: null,
  },
  {
    client: "MEN'S CARE",
    logo: "/images/logo-menscare.png",
    circular: true,
    image: "/images/work-menscare.jpg",
    title: "Brand Elevation & Content Strategy",
    description: "Full content strategy and execution — from AI product visuals to short-form authority series — designed to position the brand as a premium player in a competitive market.",
    tags: ["Product Visuals", "Short-Form", "Strategy"],
    category: "Brand Elevation",
    href: "/work/menscare",
  },
];

export default function Work() {
  const router = useRouter();
  return (
    <section id="work" className="py-28 px-6" style={{ background: "linear-gradient(to bottom, #080808, #0b0a08, #080808)" }}>
      <div className="max-w-7xl mx-auto">
        <AnimateIn className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-3">Our Work</p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Results that
              <br />
              speak for themselves
            </h2>
          </div>
          <a href="/work" className="text-sm text-[#a0a0a0] hover:text-white transition-colors underline underline-offset-4">
            View all projects →
          </a>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <AnimateIn key={p.client} delay={i * 120} from={i === 0 ? "left" : "right"}>
              <div className={`group bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-8 hover:border-[#c8ff00]/20 hover:shadow-[0_0_30px_rgba(200,255,0,0.04)] transition-all duration-300 h-full ${p.href ? "cursor-pointer" : ""}`}
                onClick={() => p.href && router.push(p.href)}
              >
                <div className="flex items-center justify-between mb-6" style={{ minHeight: "52px" }}>
                  <div style={{ position: "relative", height: p.circular ? "52px" : "32px", width: p.circular ? "52px" : "100px" }}>
                    <Image src={p.logo} alt={p.client} fill className={p.circular ? "object-contain" : "object-contain object-left"} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs border border-[#222] text-[#666] px-3 py-1 rounded-full">{p.category}</span>
                    {p.href && (
                      <span className="text-xs text-[#c8ff00] group-hover:underline">View case study →</span>
                    )}
                  </div>
                </div>
                <div className="relative w-full rounded-xl mb-6 overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={p.image}
                    alt={p.client}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                   
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{p.title}</h3>
                <p className="text-sm text-[#a0a0a0] leading-relaxed mb-4">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs bg-[#111] border border-[#1a1a1a] text-[#666] px-3 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
