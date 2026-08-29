"use client";

import Link from "next/link";
import AnimateIn from "../components/AnimateIn";
import { useT, useLang } from "../i18n/LangProvider";

// Case study index page. Data structure is intentionally verbose
// (hero image, metric block, service tags) so each entry translates
// 1:1 into a full /case-studies/[slug] page later without needing
// a schema migration. Placeholder metrics ('TBD') mark cases where
// we don't have client-approved numbers yet — replace once approved.

type CaseStudy = {
  slug: string;
  brand: string;
  brandLogo?: string;
  category: string;
  headline: { bg: string; en: string };
  metric: {
    value: string;
    label: { bg: string; en: string };
  };
  cover: string;
  services: string[];
  live?: boolean;
  /** Real destination when the case has a finished page of its own. */
  href?: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "menscare",
    brand: "MEN'S CARE",
    brandLogo: "/images/logo-menscare.png",
    category: "Beauty · DTC",
    headline: {
      bg: "Ръст на приходите чрез AI видео и реклами",
      en: "Revenue growth via AI video + performance",
    },
    metric: { value: "AI видео", label: { bg: "Продукция и реклами", en: "Production and ads" } },
    cover: "/images/work-menscare.webp",
    services: ["Видео", "Реклами", "Лендинг страници"],
    live: true,
    href: "/work/menscare",
  },
  {
    slug: "isosport",
    brand: "ISOSPORT",
    brandLogo: "/images/logo-isosport.webp",
    category: "Beverage · Retail",
    headline: {
      bg: "Кинематографична брандова идентичност + мащабируема кампания",
      en: "Cinematic brand identity + scalable campaign",
    },
    metric: { value: "Кампания", label: { bg: "Бранд и реклами", en: "Brand and ads" } },
    cover: "/images/work-isosport.webp",
    services: ["Кинематографичен филм", "Бранд", "Реклами"],
    live: false,
  },
  {
    slug: "parfen",
    brand: "PARFEN",
    brandLogo: "/images/logo-parfen.webp",
    category: "Perfumes · Ecom",
    headline: {
      bg: "Система за постоянен поток от нови криейтиви",
      en: "AI UGC system for continuous fresh creative",
    },
    metric: { value: "UGC поток", label: { bg: "Постоянен креатив", en: "A steady creative flow" } },
    cover: "/images/logo-parfen.webp",
    services: ["AI UGC", "Ads creative", "Meta"],
    live: false,
  },
  {
    slug: "dusq",
    brand: "DUSQ",
    brandLogo: "/images/logo-dusq.webp",
    category: "Wearable · US Market",
    headline: {
      bg: "Кинематографичен филм за старт на продукт в САЩ",
      en: "Cinematic reel for US product launch",
    },
    metric: { value: "Старт", label: { bg: "Пускане на пазара", en: "Bringing it to market" } },
    cover: "/images/logo-dusq.webp",
    services: ["Cinematic", "Product visuals", "Launch"],
    live: false,
  },
  {
    slug: "gourmet-house",
    brand: "GOURMET HOUSE",
    brandLogo: "/images/logo-gourmethouse.png",
    category: "Food · DTC",
    headline: {
      bg: "Пълен старт на онлайн магазин — от нула до първи продажби",
      en: "Full ecommerce launch — brand to first sales",
    },
    metric: { value: "Онлайн магазин", label: { bg: "От нула до продажби", en: "Zero to first sales" } },
    cover: "/images/logo-gourmethouse.png",
    services: ["Уебсайт", "Бранд", "Реклами"],
    live: false,
  },
  {
    slug: "beme",
    brand: "beMe",
    brandLogo: "/images/logo-bemeacne.webp",
    category: "Skincare · DTC",
    headline: {
      bg: "От клик до поръчка — конверсия при студен трафик",
      en: "Click to order — cold-traffic conversion",
    },
    metric: { value: "Конверсия", label: { bg: "От клик до поръчка", en: "Click to order" } },
    cover: "/images/logo-bemeacne.webp",
    services: ["Статични банери", "Реклами", "Оптимизация на конверсии"],
    live: false,
  },
  {
    slug: "nedelya",
    brand: "NEDELYA",
    brandLogo: "/images/logo-nedelya.svg",
    category: "Bakery · Retail",
    headline: {
      bg: "Съдържание за социални мрежи и разказване на историята",
      en: "Social content + storytelling",
    },
    metric: { value: "Съдържание", label: { bg: "Разказ за бранда", en: "The brand story" } },
    cover: "/images/logo-nedelya.svg",
    services: ["Съдържание за мрежите", "Видео", "Стратегия"],
    live: false,
  },
];

const copy = {
  bg: {
    badge: "CASE STUDIES",
    h1Top: "Реални резултати",
    h1Highlight: "за реални бизнеси.",
    sub: "50+ бизнеса в България и САЩ. Всеки проект тук е партньорство — от първия разговор до пускането и след него.",
    stats: [
      { value: "50+", label: "Партньорства" },
    ],
    viewCase: "Виж резултатите",
    comingSoon: "Скоро",
    ctaH2Top: "Готов да си следващият?",
    ctaH2Bottom: "Да поговорим.",
    ctaSub: "Работим с 12 нови бизнеса годишно. Едно въведение, лично прочитане, отговор до 24ч.",
    ctaPrimary: "Резервирай разговор",
    ctaSecondary: "← Обратно към сайта",
  },
  en: {
    badge: "CASE STUDIES",
    h1Top: "Real results",
    h1Highlight: "for real brands.",
    sub: "50+ brands across Bulgaria and the US. Every case here is a partnership — from brief through launch and beyond.",
    stats: [
      { value: "50+", label: "Partnerships" },
    ],
    viewCase: "View case",
    comingSoon: "Coming soon",
    ctaH2Top: "Ready to be next?",
    ctaH2Bottom: "Let's talk.",
    ctaSub: "We take on 12 new partners a year. One intro, personal review, reply within 24h.",
    ctaPrimary: "Book a call",
    ctaSecondary: "← Back to home",
  },
};

export default function CaseStudiesClient() {
  const { lang } = useLang();
  const t = useT(copy);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative flex items-center justify-center overflow-hidden bg-[#080808] pt-32 pb-16 px-6">
        <div
          aria-hidden
          className="absolute -top-40 -right-40 w-[720px] h-[720px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(244,244,244,0.14) 0%, rgba(244,244,244,0) 60%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(244,244,244,0.85) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,244,244,0.85) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 85%)",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 85%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-[#f4f4f4]/35 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#f4f4f4] animate-pulse" />
            <span className="font-mono text-[10px] md:text-xs text-[#f4f4f4] tracking-[0.3em]">
              {t.badge}
            </span>
          </div>
          <h1 className="text-[40px] sm:text-[56px] md:text-[76px] lg:text-[88px] font-bold leading-[1.02] tracking-tight mb-6 text-balance">
            <span className="text-white">{t.h1Top}</span>{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 22%, #8a8a8a 45%, #eaeaea 62%, #c8c8c8 78%, #ffffff 100%)",
              }}
            >
              {t.h1Highlight}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-[#a0a0a0] leading-relaxed mb-10 text-balance">
            {t.sub}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 py-6 border-y border-[#1e1e1c]/70 max-w-2xl mx-auto">
            {t.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-[#f4f4f4] tabular-nums leading-none mb-1.5">
                  {s.value}
                </div>
                <div className="text-[11px] md:text-[13px] text-[#7a7a7a] uppercase tracking-[0.2em]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CASE STUDY GRID ================= */}
      <section className="py-16 md:py-24 px-6 border-t border-[#1e1e1c]" style={{ background: "linear-gradient(to bottom, #080808, #0a0a0f)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {CASE_STUDIES.map((cs, i) => (
              <AnimateIn key={cs.slug} delay={i * 60}>
                <CaseCard cs={cs} lang={lang} viewLabel={t.viewCase} comingSoonLabel={t.comingSoon} />
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="py-20 md:py-28 px-6 border-t border-[#1e1e1c] relative" style={{ background: "#080808" }}>
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f4f4f4]/40 to-transparent"
        />
        <div className="max-w-3xl mx-auto text-center">
          <AnimateIn>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-balance">
              {t.ctaH2Top}
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 22%, #8a8a8a 45%, #eaeaea 62%, #c8c8c8 78%, #ffffff 100%)",
                }}
              >
                {t.ctaH2Bottom}
              </span>
            </h2>
            <p className="text-[#a0a0a0] text-base md:text-lg leading-relaxed mb-9 max-w-xl mx-auto text-balance">
              {t.ctaSub}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#f4f4f4] text-black font-bold px-8 py-4 rounded-full hover:bg-[#ffffff] transition-colors"
                style={{ boxShadow: "0 18px 50px -10px rgba(244,244,244,0.5)" }}
              >
                {t.ctaPrimary}
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-[#333] text-white font-semibold px-8 py-4 rounded-full hover:border-[#f4f4f4]/50 hover:bg-white/5 transition-all"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}

function CaseCard({
  cs,
  lang,
  viewLabel,
  comingSoonLabel,
}: {
  cs: CaseStudy;
  lang: "bg" | "en";
  viewLabel: string;
  comingSoonLabel: string;
}) {
  const isLive = Boolean(cs.live && cs.metric.value !== "TBD");
  const destination = cs.href ?? `/case-studies/${cs.slug}`;
  const inner = (
    <article id={cs.slug} className="group relative scroll-mt-28 rounded-2xl border border-[#1e1e1c] bg-[#0d0d0d] overflow-hidden hover:border-[#f4f4f4]/40 transition-colors h-full flex flex-col">
      {/* Cover — brand mark centred on tinted panel. Real page-level
          case study covers can be swapped in once each brand's cover
          image is designed. */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0a] border-b border-[#1e1e1c]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(244,244,244,0.08), transparent 65%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cs.cover}
          alt={cs.brand}
          className="absolute inset-0 w-full h-full object-contain p-10 md:p-14 opacity-90 group-hover:scale-[1.02] transition-transform duration-500"
        />
        {!isLive && (
          <div className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[#f4f4f4]/80 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-[#f4f4f4]/30">
            {comingSoonLabel}
          </div>
        )}
      </div>

      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#f4f4f4]">
            {cs.brand}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#333]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7a7a7a]">
            {cs.category}
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-5 text-balance">
          {cs.headline[lang]}
        </h3>

        {/* Metric block — the premium 'proof at a glance' element */}
        <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-[#1e1e1c]">
          <div className="text-3xl md:text-4xl font-extrabold text-[#f4f4f4] tabular-nums leading-none">
            {cs.metric.value}
          </div>
          <div className="text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-[#7a7a7a]">
            {cs.metric.label[lang]}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {cs.services.map((s) => (
            <span
              key={s}
              className="text-[10px] md:text-[11px] font-mono border border-[#222] text-[#888] px-2 py-1 rounded-sm uppercase tracking-wider"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-2">
          <span
            className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
              isLive ? "text-[#f4f4f4] group-hover:text-[#ffffff]" : "text-[#4a4540]"
            }`}
          >
            <span>{isLive ? viewLabel : comingSoonLabel}</span>
            {isLive && <span>→</span>}
          </span>
        </div>
      </div>
    </article>
  );

  return isLive ? (
    <Link href={destination} className="block h-full">
      {inner}
    </Link>
  ) : (
    <div className="h-full opacity-70">{inner}</div>
  );
}
