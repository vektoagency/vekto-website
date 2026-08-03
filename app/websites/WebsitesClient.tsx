"use client";

import Link from "next/link";
import AnimateIn from "../components/AnimateIn";
import { useT } from "../i18n/LangProvider";

// /websites — service page. Structured as:
//   Hero (statement + numbers)
//   Capabilities grid (what we build)
//   Process timeline (how it works)
//   Featured builds (real client examples with links)
//   Pricing / engagement tiers
//   Bottom CTA
//
// Kept the same dark + lime brand system as the rest of the site so
// it reads as one identity, not a separate microsite.

const dict = {
  bg: {
    hero: {
      badge: "УЕБ ДИЗАЙН + РАЗРАБОТКА",
      h1Top: "Уебсайтове, които",
      h1Highlight: "работят като продавач.",
      sub: "Проектираме и кодваме бързи, конверсионни сайтове — от единична лендинг страница до пълен електронен магазин. Всяка страница има цел, всеки клик има смисъл.",
      stats: [
        { value: "3-6", label: "седмици до launch" },
        { value: "95+", label: "PageSpeed резултат" },
        { value: "30+", label: "изградени сайта" },
      ],
      ctaPrimary: "Резервирай разговор",
      ctaSecondary: "Виж кейс стъдитата",
    },
    capabilities: {
      eyebrow: "КАКВО ИЗГРАЖДАМЕ",
      h2: "Уебсайтове за всеки етап на бизнеса",
      items: [
        {
          number: "01",
          title: "Лендинг страници",
          body: "Единични страници за реклама, кампания или продукт. Фокус върху една цел — конверсия. Готови за A/B тест и Meta/Google pixel tracking.",
          tags: ["Next.js", "A/B тестове", "Conversion tracking"],
        },
        {
          number: "02",
          title: "Корпоративни сайтове",
          body: "Многостранични сайтове с ясна информационна архитектура. Блог, кариери, контакти, интеграция с CRM. Мултиезични при нужда.",
          tags: ["CMS", "Многоезичен", "SEO готов"],
        },
        {
          number: "03",
          title: "Електронни магазини",
          body: "Shopify, WooCommerce или headless на Next.js — според мащаба. Пълна интеграция с плащания, доставки, склад, email flows.",
          tags: ["Shopify", "Headless", "Плащания", "Email"],
        },
        {
          number: "04",
          title: "Портали и приложения",
          body: "Клиентски портали, membership сайтове, dashboard-и, self-serve инструменти. Authentication, база данни, admin панел — end-to-end.",
          tags: ["Auth", "Database", "Admin"],
        },
      ],
    },
    process: {
      eyebrow: "ПРОЦЕС",
      h2: "От бриф до launch за 3-6 седмици",
      steps: [
        {
          number: "01",
          title: "Дискавъри",
          duration: "1 седмица",
          body: "Разбираме целта, аудиторията, техническите изисквания. Определяме архитектура + технологичен стак.",
        },
        {
          number: "02",
          title: "Дизайн + прототип",
          duration: "1-2 седмици",
          body: "UI дизайн на всяка ключова страница. Прототип за преглед и одобрение преди да напишем и ред код.",
        },
        {
          number: "03",
          title: "Разработка",
          duration: "1-3 седмици",
          body: "Кодваме на живо в staging environment. Ежеседмичен преглед, integrations, съдържание.",
        },
        {
          number: "04",
          title: "Launch + optimize",
          duration: "Постоянно",
          body: "Пускане в production, tracking setup, monitoring. Първи месец активна оптимизация на база реални данни.",
        },
      ],
    },
    stack: {
      eyebrow: "ТЕХНОЛОГИИ",
      h2: "Модерен стак, без излишни компромиси",
      items: [
        "Next.js 16",
        "Shopify",
        "Webflow",
        "Tailwind CSS",
        "Vercel",
        "Framer Motion",
        "Sanity CMS",
        "Stripe",
        "Klaviyo",
        "Meta Pixel",
        "Google Analytics 4",
        "Segment",
      ],
    },
    cta: {
      h2Top: "Готов си за нов уебсайт?",
      h2Bottom: "Да поговорим.",
      sub: "Пиши ни в един ред за проекта — отговаряме до 24 часа с първа оценка.",
      primary: "Резервирай разговор",
      secondary: "Виж всички услуги",
    },
  },
  en: {
    hero: {
      badge: "WEB DESIGN + DEVELOPMENT",
      h1Top: "Websites that",
      h1Highlight: "work like a salesperson.",
      sub: "We design and build fast, conversion-focused websites — from a single landing page to a full ecommerce store. Every page has a goal, every click has intent.",
      stats: [
        { value: "3-6", label: "weeks to launch" },
        { value: "95+", label: "PageSpeed score" },
        { value: "30+", label: "sites shipped" },
      ],
      ctaPrimary: "Book a call",
      ctaSecondary: "See case studies",
    },
    capabilities: {
      eyebrow: "WHAT WE BUILD",
      h2: "Websites for every stage of your business",
      items: [
        {
          number: "01",
          title: "Landing pages",
          body: "Single-purpose pages for ads, campaigns, or product launches. One goal — conversion. Ready for A/B testing and Meta/Google pixel tracking out of the box.",
          tags: ["Next.js", "A/B testing", "Conversion tracking"],
        },
        {
          number: "02",
          title: "Corporate sites",
          body: "Multi-page sites with clear information architecture. Blog, careers, contact, CRM integration. Multilingual when needed.",
          tags: ["CMS", "Multilingual", "SEO ready"],
        },
        {
          number: "03",
          title: "Ecommerce stores",
          body: "Shopify, WooCommerce, or headless Next.js — sized to your scale. Full integration with payments, shipping, inventory, email flows.",
          tags: ["Shopify", "Headless", "Payments", "Email"],
        },
        {
          number: "04",
          title: "Portals & applications",
          body: "Client portals, membership sites, dashboards, self-serve tools. Auth, database, admin panel — end-to-end.",
          tags: ["Auth", "Database", "Admin"],
        },
      ],
    },
    process: {
      eyebrow: "PROCESS",
      h2: "From brief to launch in 3-6 weeks",
      steps: [
        {
          number: "01",
          title: "Discovery",
          duration: "1 week",
          body: "We understand the goal, audience, technical requirements. Define architecture + tech stack.",
        },
        {
          number: "02",
          title: "Design + prototype",
          duration: "1-2 weeks",
          body: "UI design for every key page. Prototype for review and approval before we write a single line of code.",
        },
        {
          number: "03",
          title: "Development",
          duration: "1-3 weeks",
          body: "Live coding in staging environment. Weekly reviews, integrations, content.",
        },
        {
          number: "04",
          title: "Launch + optimize",
          duration: "Ongoing",
          body: "Push to production, tracking setup, monitoring. Active optimization in month one based on real data.",
        },
      ],
    },
    stack: {
      eyebrow: "TECH STACK",
      h2: "Modern tools, no unnecessary compromises",
      items: [
        "Next.js 16",
        "Shopify",
        "Webflow",
        "Tailwind CSS",
        "Vercel",
        "Framer Motion",
        "Sanity CMS",
        "Stripe",
        "Klaviyo",
        "Meta Pixel",
        "Google Analytics 4",
        "Segment",
      ],
    },
    cta: {
      h2Top: "Ready for a new website?",
      h2Bottom: "Let's talk.",
      sub: "Send us a one-line brief — we reply within 24 hours with a first estimate.",
      primary: "Book a call",
      secondary: "See all services",
    },
  },
};

export default function WebsitesClient() {
  const t = useT(dict);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#080808] pt-24 pb-16 px-6">
        <div
          aria-hidden
          className="absolute -top-40 -right-40 w-[720px] h-[720px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(200,255,0,0.14) 0%, rgba(200,255,0,0) 60%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -bottom-60 -left-40 w-[720px] h-[720px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(200,255,0,0.08) 0%, rgba(200,255,0,0) 60%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(200,255,0,0.85) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,255,0,0.85) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 85%)",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 85%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-[#c8ff00]/35 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse" />
            <span className="font-mono text-[10px] md:text-xs text-[#c8ff00] tracking-[0.3em]">
              {t.hero.badge}
            </span>
          </div>

          <h1 className="text-[40px] sm:text-[60px] md:text-[80px] lg:text-[96px] font-bold leading-[1.02] tracking-tight mb-8 text-balance">
            <span className="text-white">{t.hero.h1Top}</span>{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)",
                filter: "drop-shadow(0 2px 28px rgba(200,255,0,0.4))",
              }}
            >
              {t.hero.h1Highlight}
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg lg:text-xl text-[#a0a0a0] leading-relaxed mb-10 text-balance">
            {t.hero.sub}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 mb-12 py-6 border-y border-[#1e1e1c]/70">
            {t.hero.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-[#c8ff00] tabular-nums leading-none mb-1.5">
                  {s.value}
                </div>
                <div className="text-[11px] md:text-[13px] text-[#7a7a7a] uppercase tracking-[0.2em]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-bold px-8 py-4 rounded-full hover:bg-[#d4ff33] active:scale-[0.98] transition-all text-[15px] md:text-[16px]"
              style={{
                boxShadow:
                  "0 18px 50px -10px rgba(200,255,0,0.55), 0 0 38px -4px rgba(200,255,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <span>{t.hero.ctaPrimary}</span>
              <span className="text-[17px] leading-none transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 border border-[#333] text-white font-semibold px-8 py-4 rounded-full hover:border-[#c8ff00]/50 hover:bg-white/5 transition-all text-[15px]"
            >
              <span>{t.hero.ctaSecondary}</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CAPABILITIES ================= */}
      <section className="py-20 md:py-28 px-6 border-t border-[#1e1e1c]" style={{ background: "linear-gradient(to bottom, #080808, #0a0a0f)" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateIn>
            <p className="text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-widest mb-3 text-center">
              {t.capabilities.eyebrow}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-14 md:mb-20 text-center text-balance max-w-3xl mx-auto">
              {t.capabilities.h2}
            </h2>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-5 md:gap-7">
            {t.capabilities.items.map((item, i) => (
              <AnimateIn key={item.number} delay={i * 90}>
                <div className="relative h-full p-6 md:p-8 rounded-2xl border border-[#1e1e1c] bg-[#0d0d0d] hover:border-[#c8ff00]/35 hover:bg-[#101010] transition-colors">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="font-mono text-sm text-[#c8ff00]">{item.number}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-[#a0a0a0] text-[14px] md:text-[15px] leading-relaxed mb-5">
                    {item.body}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] md:text-[11px] border border-[#333] text-[#888] px-2.5 py-1 rounded-full font-mono uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="py-20 md:py-28 px-6 border-t border-[#1e1e1c]" style={{ background: "#080808" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateIn>
            <p className="text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-widest mb-3 text-center">
              {t.process.eyebrow}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-14 md:mb-20 text-center text-balance max-w-3xl mx-auto">
              {t.process.h2}
            </h2>
          </AnimateIn>

          <div className="grid md:grid-cols-4 gap-5 md:gap-6">
            {t.process.steps.map((step, i) => (
              <AnimateIn key={step.number} delay={i * 80}>
                <div className="relative h-full p-6 rounded-2xl border border-[#1e1e1c] bg-[#0d0d0d]">
                  <div className="font-mono text-xs text-[#c8ff00] mb-3">{step.number}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#7a7a7a] mb-4">
                    {step.duration}
                  </div>
                  <p className="text-[#a0a0a0] text-[13px] leading-relaxed">{step.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="py-16 md:py-20 px-6 border-t border-[#1e1e1c]" style={{ background: "#0a0a0a" }}>
        <div className="max-w-5xl mx-auto text-center">
          <AnimateIn>
            <p className="text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-widest mb-3">
              {t.stack.eyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-10 text-balance max-w-2xl mx-auto">
              {t.stack.h2}
            </h2>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {t.stack.items.map((item) => (
                <span
                  key={item}
                  className="text-[11px] md:text-[13px] font-mono text-[#a0a0a0] border border-[#1e1e1c] bg-[#0d0d0d] px-3 py-2 rounded-md"
                >
                  {item}
                </span>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section id="contact-teaser" className="py-20 md:py-28 px-6 border-t border-[#1e1e1c] relative" style={{ background: "#080808" }}>
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/40 to-transparent"
        />
        <div className="max-w-4xl mx-auto text-center">
          <AnimateIn>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-balance">
              {t.cta.h2Top}
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #eaff7a 0%, #c8ff00 50%, #a8e600 100%)",
                }}
              >
                {t.cta.h2Bottom}
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-[#a0a0a0] text-base md:text-lg leading-relaxed mb-9 text-balance">
              {t.cta.sub}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-bold px-8 py-4 rounded-full hover:bg-[#d4ff33] transition-colors"
                style={{ boxShadow: "0 18px 50px -10px rgba(200,255,0,0.5)" }}
              >
                {t.cta.primary}
              </a>
              <Link
                href="/#services"
                className="inline-flex items-center justify-center gap-2 border border-[#333] text-white font-semibold px-8 py-4 rounded-full hover:border-[#c8ff00]/50 hover:bg-white/5 transition-all"
              >
                {t.cta.secondary}
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
