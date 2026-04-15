"use client";

import Image from "next/image";
import { useState } from "react";
import AnimateIn from "./AnimateIn";

const services = [
  {
    number: "01",
    title: "Short-Form Authority Series",
    image: "/images/service-1.jpg",
    description: "Engaging, high-impact short-form videos for social media that position your brand as an authority in your space — optimized for maximum reach and engagement.",
    tags: ["Social Media", "Short-Form", "Strategy"],
  },
  {
    number: "02",
    title: "AI Digital Avatars & Virtual Spokespersons",
    image: "/images/service-2.jpg",
    description: "Custom AI-powered avatars for brand representation. Deliver multilingual content at scale with consistent, high-quality presentations — no studio needed.",
    tags: ["AI Avatar", "Multilingual", "Automation"],
  },
  {
    number: "03",
    title: "Cinematic Brand Films",
    image: "/images/service-3.jpg",
    description: "High-end immersive storytelling with full production pipeline from concept to post-processing. AI-enhanced for a premium cinematic finish.",
    tags: ["Cinematic", "Brand Film", "Production"],
  },
  {
    number: "04",
    title: "AI Product Visual Engineering",
    image: "/images/service-4.jpg",
    description: "Hyper-realistic AI-enhanced product visuals optimized for eCommerce and marketing assets. Premium presentation that converts.",
    tags: ["Product Visuals", "eCommerce", "AI"],
  },
];

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="py-28 px-6" style={{ background: "linear-gradient(to bottom, #080808, #0a0a0f, #080808)" }}>
      <div className="max-w-7xl mx-auto">
        <AnimateIn className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs text-[#c8ff00] uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Services built
              <br />
              to scale your brand
            </h2>
          </div>
          <p className="max-w-sm text-[#a0a0a0] leading-relaxed">
            Every service is powered by AI and designed to deliver results that traditional agencies can&apos;t match.
          </p>
        </AnimateIn>

        {/* Desktop layout */}
        <div className="hidden lg:grid grid-cols-2 gap-12 items-start">
          {/* Left — service list */}
          <div className="divide-y divide-[#1a1a1a]">
            {services.map((s, i) => (
              <div
                key={s.number}
                className="group py-6 cursor-pointer"
                onMouseEnter={() => setActive(i)}
              >
                <div className="flex items-start gap-5">
                  <span className={`text-sm font-mono mt-1 transition-colors ${active === i ? "text-[#c8ff00]" : "text-[#4a4540]"}`}>
                    {s.number}
                  </span>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 transition-colors ${active === i ? "text-[#c8ff00]" : "text-[#ece8e1]"}`}>
                      {s.title}
                    </h3>
                    <div
                      className="overflow-hidden transition-all duration-500"
                      style={{ maxHeight: active === i ? "120px" : "0px", opacity: active === i ? 1 : 0 }}
                    >
                      <p className="text-sm text-[#a0a0a0] leading-relaxed mb-3">{s.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {s.tags.map((t) => (
                          <span key={t} className="text-xs border border-[#333] text-[#666] px-3 py-1 rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right — sticky image preview */}
          <div className="sticky top-24">
            <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              {services.map((s, i) => (
                <div
                  key={s.number}
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ opacity: active === i ? 1 : 0 }}
                >
                  <Image src={s.image} alt={s.title} fill className="object-cover" sizes="600px" />
                </div>
              ))}
              {/* overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden divide-y divide-[#1a1a1a]">
          {services.map((s, i) => (
            <AnimateIn key={s.number} delay={i * 80}>
              <div className="group py-8">
                <div className="relative w-full rounded-xl overflow-hidden mb-4" style={{ aspectRatio: "16/9" }}>
                  <Image src={s.image} alt={s.title} fill className="object-cover" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-[#333] text-sm font-mono mt-1">{s.number}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                    <p className="text-[#a0a0a0] text-sm leading-relaxed mb-3">{s.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span key={t} className="text-xs border border-[#222] text-[#666] px-3 py-1 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
