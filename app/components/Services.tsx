"use client";

import Image from "next/image";
import { useState } from "react";
import AnimateIn from "./AnimateIn";
import { useT } from "../i18n/LangProvider";

// Reframed from 4 AI-focused deliverables to the 4-pillar full-stack
// growth system (CTC / NoGood pattern). PPC + creative + web +
// strategy — all four under one roof. AI moves to Pillar 2 as a
// production advantage (3× faster, 60% cheaper), not a headline
// product. Reads as one integrated system, not a menu of vendor
// services.
const dict = {
  bg: {
    eyebrow: "СИСТЕМАТА",
    h2: ["Един екип за", "целия ти маркетинг"],
    sub: "Реклами, съдържание, уебсайтове и стратегия — четирите стълба на растежа под един покрив. Един екип с една цел: приходи.",
    services: [
      {
        number: "01",
        title: "Реклами",
        image: "/images/service-4.webp",
        description: "Meta, Google, TikTok — от стартиране до мащабиране. Пълно проследяване, оптимизация на ROAS, готови за шестцифрени месечни бюджети. Средно 4.8× ROAS от нашите кампании.",
        tags: ["Meta", "Google", "TikTok", "Проследяване", "Мащабиране"],
      },
      {
        number: "02",
        title: "Съдържание и продукция",
        image: "/images/service-3.webp",
        description: "AI-задвижена продукция + екип за живи снимки. Видео, кратки формати, кинематографични филми, продуктови визуализации. 3× по-бързо и 60% по-евтино от традиционните продукции — без компромис в качеството.",
        tags: ["Видео", "Кратки формати", "Живи снимки", "Продукт"],
      },
      {
        number: "03",
        title: "Уебсайтове и инфраструктура",
        image: "/images/service-1.webp",
        description: "Уебсайтове, лендинги, фунии, имейл автоматизации, CRM интеграции, инсталация на проследяване. Цялата техническа основа, която превръща трафика в приходи.",
        tags: ["Уебсайт", "Фунии", "Имейл", "CRM", "Проследяване"],
      },
      {
        number: "04",
        title: "Стратегия",
        image: "/images/service-2.webp",
        description: "Позициониране, дизайн на офертата, тримесечно планиране на растежа, стратегическо ръководство. Слоят, който свързва всичко в система — не в списък от услуги.",
        tags: ["Позициониране", "Оферта", "Планиране", "Ръководство"],
      },
    ],
  },
  en: {
    eyebrow: "THE SYSTEM",
    h2: ["One partner for", "your entire marketing"],
    sub: "PPC, creative, funnels, and strategy — the four pillars of growth under one roof. No vendor chains, one team with one goal: revenue.",
    services: [
      {
        number: "01",
        title: "Performance / PPC",
        image: "/images/service-4.webp",
        description: "Meta, Google, TikTok ads — from setup to scaling. Full-funnel attribution, ROAS optimization, ready for 6+ figure monthly budgets. 4.8× average ROAS.",
        tags: ["Meta Ads", "Google Ads", "TikTok", "Attribution", "Scaling"],
      },
      {
        number: "02",
        title: "Creative Engine",
        image: "/images/service-3.webp",
        description: "AI-native production system + live-action team. Video, UGC, cinematic films, product visualization. 3× faster and 60% cheaper than traditional productions — no quality compromise.",
        tags: ["AI Video", "UGC", "Live-action", "Product Visuals"],
      },
      {
        number: "03",
        title: "Infrastructure",
        image: "/images/service-1.webp",
        description: "Websites, landing pages, funnels, email automation, CRM setup, tracking + pixels. The full tech stack that turns traffic into revenue and revenue into LTV.",
        tags: ["Web", "Funnels", "Email", "CRM", "Tracking"],
      },
      {
        number: "04",
        title: "Strategy",
        image: "/images/service-2.webp",
        description: "Positioning, offer design, quarterly growth planning, fractional CMO. The layer that ties everything into a system — not a shopping list.",
        tags: ["Positioning", "Offer Design", "Fractional CMO"],
      },
    ],
  },
};

export default function Services() {
  const [active, setActive] = useState(0);
  const t = useT(dict);
  const services = t.services;

  return (
    <section id="services" className="py-20 md:py-28 px-6" style={{ background: "linear-gradient(to bottom, #080808, #0a0a0f, #080808)" }}>
      <div className="max-w-7xl mx-auto">
        <AnimateIn className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 md:mb-16">
          <div>
            <p className="text-xs text-[#f4f4f4] uppercase tracking-widest mb-3">{t.eyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-balance">
              {t.h2[0]}
              <br />
              {t.h2[1]}
            </h2>
          </div>
          <p className="max-w-sm text-[#a0a0a0] text-sm md:text-base leading-relaxed text-balance">{t.sub}</p>
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
                  <span className={`text-sm font-mono mt-1 transition-colors ${active === i ? "text-[#f4f4f4]" : "text-[#4a4540]"}`}>
                    {s.number}
                  </span>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 transition-colors ${active === i ? "text-[#f4f4f4]" : "text-[#ece8e1]"}`}>
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
              <div className="group py-6">
                <div className="relative w-full rounded-xl overflow-hidden mb-4" style={{ aspectRatio: "16/9" }}>
                  <Image src={s.image} alt={s.title} fill className="object-cover" />
                </div>
                <div className="flex items-start gap-3.5">
                  <span className="text-[#f4f4f4]/70 text-sm font-mono mt-1 shrink-0">{s.number}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 text-balance leading-snug">{s.title}</h3>
                    <p className="text-[#a0a0a0] text-[13px] leading-relaxed mb-3 text-balance">{s.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.tags.map((t) => (
                        <span key={t} className="text-[10px] border border-[#222] text-[#888] px-2.5 py-0.5 rounded-full">
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
