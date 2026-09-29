"use client";

// ============================================================================
// /cv — VEKTO's AI video work, presented by someone else.
//
// A partner agency hands this page to its own clients, so it reads as a
// profile of ONE capability, not a funnel: video made with AI. What we
// make, the work, the brands, three cases, one contact line. No nav, no
// "describe your project", no calendar, no footer links — the reader
// belongs to the partner. Every claim, number and logo here already
// stands on the public site; nothing is written fresh for this page.
// ============================================================================

import { useEffect, useState } from "react";
import Image from "next/image";
import bunnyData from "../data/bunny-clips.json";
import { ROSTER } from "../data/roster";
import { ClipTile, ClipLightbox, type Clip } from "../portfolio/PortfolioClient";
import HeroCinematicBg from "../components/HeroCinematicBg";
import { useLang } from "../i18n/LangProvider";

const SILVER_H =
  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 22%, #8a8a8a 45%, #eaeaea 62%, #c8c8c8 78%, #ffffff 100%)";
const WORDMARK_METAL =
  "linear-gradient(180deg, #d4d4d4 0%, #a8a8a8 40%, #7a7a7a 70%, #969696 100%)";
const PIXEL = "var(--brutal-pixel), ui-monospace, monospace";
const COMIC = "var(--brutal-comic), system-ui, sans-serif";

// Dark-ink marks flipped so they read on a jet card — same treatment the
// homepage case cards give them.
const CASE_LOGOS: Record<string, { src: string; invert?: boolean }> = {
  menscare: { src: "/images/logo-menscare.png", invert: true },
  parfen: { src: "/images/logo-parfen.webp", invert: true },
  dusq: { src: "/images/logo-dusq.webp", invert: true },
};

// The portfolio's public clips, minus the "Organic" cuts — those are
// edits of supplied footage, and this page promises video made with AI.
// Featured first, capped so the page stays a profile, not the portfolio.
const CLIPS: Clip[] = (() => {
  const visible = (bunnyData.clips as Clip[]).filter(
    (c) => !c.excludeFromPortfolio && c.category !== "Organic",
  );
  const featured = visible.filter((c) => c.featured);
  const rest = visible.filter((c) => !c.featured);
  return [...featured, ...rest].slice(0, 12);
})();

const COPY = {
  bg: {
    toggle: "EN",
    heroEyebrow: "VEKTO · AI ВИДЕО ПРОДУКЦИЯ",
    h1a: "ВИДЕО БЕЗ",
    h1b: "СНИМАЧЕН ДЕН.",
    sub: "Кинематографични спотове, UGC, AI аватари и продуктови визии — създадени с AI за 50+ бизнеса в България и САЩ.",
    stats: [
      { num: "500+", label: "ВИДЕА НА МЕСЕЦ" },
      { num: "50+", label: "БИЗНЕСА" },
      { num: "БГ · САЩ", label: "ДВА ПАЗАРА" },
    ],
    formatsEyebrow: "01 · AI ВИДЕО · ЧЕТИРИ ФОРМАТА",
    formatsTitle: "КАКВО ПРАВИМ",
    formats: [
      {
        title: "Кратки видеа за социалните мрежи",
        text: "Кратки силни видеа, които правят бизнеса ти експерт в твоята сфера. Стигат до повече хора и държат вниманието им.",
        tags: ["Социални мрежи", "Кратки формати", "Стратегия"],
      },
      {
        title: "AI аватари и говорители",
        text: "Персонални AI аватари за бизнеса ти. Правим съдържание на много езици с еднакво качество — без снимачен екип и снимачен ден.",
        tags: ["AI аватар", "Многоезичен", "Автоматизация"],
      },
      {
        title: "Кинематографични филми за бизнеса",
        text: "Премиум филми с пълен процес — от идея до финален монтаж. AI добавя кинематографично качество от висок клас.",
        tags: ["Кинематографичен", "Корпоративен филм", "Продукция"],
      },
      {
        title: "AI визуализации на продукти",
        text: "Реалистични AI визуализации за продукти — готови за онлайн магазини и реклами. Премиум визия, която продава.",
        tags: ["Продуктови визуализации", "Електронна търговия", "AI"],
      },
    ],
    workEyebrow: "02 · ИЗБРАНА РАБОТА",
    workTitle: "ВИДЕАТА",
    brandsEyebrow: "03 · СЪСТАВЪТ",
    brandsTitle: "БРАНДОВЕ, С КОИТО РАБОТИМ",
    casesEyebrow: "04 · РЕЗУЛТАТИ",
    casesTitle: "ТРИ ПРИМЕРА",
    cases: [
      {
        slug: "menscare",
        brand: "MEN'S CARE",
        category: "Козметика · BG",
        focus: "AI ПРОДУКЦИЯ",
        highlight: "Заменихме външната видео продукция със собствен AI поток — видеа за реклами и съдържание.",
      },
      {
        slug: "parfen",
        brand: "PARFEN",
        category: "Парфюмерия · BG",
        focus: "AI UGC ПОТОК",
        highlight: "Система за постоянен поток от нови криейтиви за рекламите в Meta.",
      },
      {
        slug: "dusq",
        brand: "DUSQ",
        category: "Носимо устройство · САЩ",
        focus: "КИНЕМАТОГРАФИЧЕН ФИЛМ",
        highlight: "Филм и продуктови визии за старт на продукт на пазара в САЩ.",
      },
    ],
    contactEyebrow: "05 · КОНТАКТ",
    contactTitle: "ДА ГОВОРИМ.",
    based: "БЪЛГАРИЯ · САЩ",
    region: { BG: "БГ", US: "САЩ" } as const,
    rights: "Всички права запазени.",
  },
  en: {
    toggle: "БГ",
    heroEyebrow: "VEKTO · AI VIDEO PRODUCTION",
    h1a: "VIDEO WITHOUT",
    h1b: "A SHOOT DAY.",
    sub: "Cinematic spots, UGC, AI avatars and product visuals — produced with AI for 50+ businesses across Bulgaria and the US.",
    stats: [
      { num: "500+", label: "VIDEOS / MONTH" },
      { num: "50+", label: "BUSINESSES" },
      { num: "BG · US", label: "TWO MARKETS" },
    ],
    formatsEyebrow: "01 · AI VIDEO · FOUR FORMATS",
    formatsTitle: "WHAT WE MAKE",
    formats: [
      {
        title: "Short-Form Authority Series",
        text: "Engaging, high-impact short-form videos for social media that position your brand as an authority in your space — optimized for maximum reach and engagement.",
        tags: ["Social Media", "Short-Form", "Strategy"],
      },
      {
        title: "AI Digital Avatars & Virtual Spokespersons",
        text: "Custom AI-powered avatars for brand representation. Deliver multilingual content at scale with consistent, high-quality presentations — no full production needed.",
        tags: ["AI Avatar", "Multilingual", "Automation"],
      },
      {
        title: "Cinematic Brand Films",
        text: "High-end immersive storytelling with full production pipeline from concept to post-processing. AI-enhanced for a premium cinematic finish.",
        tags: ["Cinematic", "Brand Film", "Production"],
      },
      {
        title: "AI Product Visual Engineering",
        text: "Hyper-realistic AI-enhanced product visuals optimized for eCommerce and marketing assets. Premium presentation that converts.",
        tags: ["Product Visuals", "eCommerce", "AI"],
      },
    ],
    workEyebrow: "02 · SELECTED WORK",
    workTitle: "THE VIDEOS",
    brandsEyebrow: "03 · THE ROSTER",
    brandsTitle: "BRANDS WE WORK WITH",
    casesEyebrow: "04 · RESULTS",
    casesTitle: "THREE EXAMPLES",
    cases: [
      {
        slug: "menscare",
        brand: "MEN'S CARE",
        category: "Beauty · BG",
        focus: "AI PRODUCTION",
        highlight: "Replaced outsourced video production with an in-house AI pipeline — video for ads and content.",
      },
      {
        slug: "parfen",
        brand: "PARFEN",
        category: "Perfume · BG",
        focus: "AI UGC SYSTEM",
        highlight: "A system for a continuous flow of fresh creative for Meta ads.",
      },
      {
        slug: "dusq",
        brand: "DUSQ",
        category: "Wearable · US",
        focus: "CINEMATIC FILM",
        highlight: "A film and product visuals for a US product launch.",
      },
    ],
    contactEyebrow: "05 · CONTACT",
    contactTitle: "LET'S TALK.",
    based: "BULGARIA · US",
    region: { BG: "BG", US: "US" } as const,
    rights: "All rights reserved.",
  },
} as const;

export default function CvClient() {
  const { lang, setLang } = useLang();
  const t = COPY[lang];

  const [solid, setSolid] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [expanded, setExpanded] = useState<Clip | null>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The hero's spot is a desktop-only asset; phones run the clients reel.
  // Resolved after mount so a phone never downloads the mp4.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Lets the hero reel pause while the lightbox plays, same contract as the
  // portfolio page.
  useEffect(() => {
    window.dispatchEvent(new Event(expanded ? "vekto:player-open" : "vekto:player-closed"));
  }, [expanded]);

  // "AI UGC" and friends mix scripts inside one line; on Bulgarian the
  // Cyrillic-capable face draws the Latin letters too, so a heading never
  // switches typeface mid-word.
  const displayMixed =
    lang === "bg"
      ? "var(--f-display-cyr), var(--f-display-lat), system-ui, sans-serif"
      : "var(--f-display-lat), var(--f-display-cyr), system-ui, sans-serif";

  const eyebrow = "text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] opacity-55";
  const sectionTitle = "font-black uppercase leading-[0.96] tracking-[-0.03em]";
  const altSection = {
    background: "#141414",
    borderTop: "1px solid rgba(244,244,244,0.14)",
    borderBottom: "1px solid rgba(244,244,244,0.14)",
  } as const;

  return (
    <div
      className="relative"
      style={{
        background: "#0d0d0d",
        color: "#f4f4f4",
        fontFamily: "var(--brutal-display), system-ui, sans-serif",
        ...({ "--bgk": lang === "bg" ? "0.92" : "1" } as React.CSSProperties),
        overflowX: "clip",
      }}
    >
      {/* CRT scanlines — the film's texture, same as the homepage */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* ============ HEADER — wordmark and the language toggle, nothing else ============ */}
      <div
        className="fixed inset-x-0 top-0 z-50"
        style={{
          background: solid ? "rgba(13,13,13,0.94)" : "transparent",
          borderBottom: solid ? "1px solid rgba(244,244,244,0.18)" : "1px solid transparent",
          backdropFilter: solid ? "blur(8px)" : undefined,
          transition: "background-color 300ms ease, border-color 300ms ease",
        }}
      >
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div
            role="img"
            aria-label="VEKTO"
            className="h-8 md:h-11 w-[112px] md:w-[180px] shrink-0"
            style={{
              background: WORDMARK_METAL,
              filter:
                "drop-shadow(0 0 1px rgba(13,13,13,0.95)) drop-shadow(0 1px 5px rgba(13,13,13,0.75))",
              WebkitMaskImage: "url(/images/logo.png)",
              maskImage: "url(/images/logo.png)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "left center",
              maskPosition: "left center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
          <button
            type="button"
            onClick={() => setLang(lang === "bg" ? "en" : "bg")}
            className="px-2.5 md:px-3 py-2 font-bold uppercase text-xs tracking-[0.25em] shrink-0 transition-colors text-[#f4f4f4] hover:bg-white hover:text-black"
            style={{
              border: "1.5px solid rgba(244,244,244,0.75)",
              textShadow: "0 0 1px #0d0d0d, 0 0 3px rgba(13,13,13,0.9)",
            }}
            aria-label={lang === "bg" ? "Switch to English" : "Превключи на български"}
          >
            {t.toggle}
          </button>
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section
        className="relative flex flex-col justify-end overflow-hidden"
        style={{ minHeight: "100dvh" }}
      >
        <div className="absolute inset-0 z-0">
          {isDesktop === true && (
            <video
              src="/videos/hero-bg-brutal.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          )}
          {isDesktop === false && <HeroCinematicBg />}
        </div>
        <div aria-hidden className="absolute inset-0 z-[1] pointer-events-none" style={{ background: "rgba(13,13,13,0.62)" }} />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[38%] z-[1] pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(13,13,13,0.96) 0%, rgba(13,13,13,0.6) 55%, transparent 100%)" }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[46%] z-[1] pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(13,13,13,0.98) 0%, rgba(13,13,13,0.7) 55%, transparent 100%)" }}
        />

        <div className="relative z-10 px-6 md:px-14 pb-14 md:pb-20 max-w-[1400px] w-full mx-auto">
          <p className={`${eyebrow} mb-5`} style={{ fontFamily: PIXEL }}>
            {t.heroEyebrow}
          </p>
          <h1
            className="font-black uppercase leading-[0.94] tracking-[-0.03em] mb-6 max-w-5xl"
            style={{
              fontSize: "calc(clamp(38px, 7.2vw, 108px) * var(--bgk, 1))",
              fontFamily: displayMixed,
            }}
          >
            {t.h1a}
            <br />
            <span
              className="italic pr-[0.08em]"
              style={{
                background: SILVER_H,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.h1b}
            </span>
          </h1>
          <p
            className="text-[15px] md:text-lg leading-relaxed max-w-2xl opacity-75 font-medium mb-10 md:mb-12"
            style={{ fontFamily: COMIC }}
          >
            {t.sub}
          </p>

          {/* Three numbers the homepage already claims, on one hairline */}
          <div
            className="grid grid-cols-3 gap-4 md:gap-10 pt-5"
            style={{ borderTop: "1px solid rgba(244,244,244,0.25)" }}
          >
            {t.stats.map((s) => (
              <div key={s.label}>
                <div
                  className="font-black leading-none tabular-nums"
                  style={{
                    fontSize: "calc(clamp(22px, 3vw, 44px) * var(--bgk, 1))",
                    letterSpacing: "-0.03em",
                    background: SILVER_H,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.num}
                </div>
                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.22em] opacity-65 mt-1.5" style={{ fontFamily: PIXEL }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 01 · FOUR FORMATS ============ */}
      <section className="px-6 md:px-14 py-16 md:py-28 max-w-[1400px] mx-auto">
        <p className={`${eyebrow} mb-4`} style={{ fontFamily: PIXEL }}>
          {t.formatsEyebrow}
        </p>
        <h2
          className={`${sectionTitle} mb-10 md:mb-14`}
          style={{ fontSize: "calc(clamp(34px, 5.4vw, 80px) * var(--bgk, 1))" }}
        >
          {t.formatsTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {t.formats.map((f, i) => (
            <div
              key={f.title}
              className="border-2 p-6 md:p-7 flex flex-col"
              style={{
                background: "#0d0d0d",
                borderColor: "rgba(244,244,244,0.3)",
                boxShadow: "6px 6px 0 0 #2a2a2a",
              }}
            >
              <span
                className="inline-block self-start px-2 py-1 border-2 border-black text-[11px] font-bold uppercase tracking-[0.25em] mb-5"
                style={{ background: SILVER_H, color: "#0d0d0d", fontFamily: PIXEL }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="font-black uppercase leading-[1] tracking-[-0.02em] mb-4 text-balance"
                style={{ fontSize: "calc(clamp(20px, 1.7vw, 26px) * var(--bgk, 1))", fontFamily: displayMixed }}
              >
                {f.title}
              </h3>
              <p className="text-[13.5px] leading-[1.55] font-medium opacity-80 mb-7" style={{ fontFamily: COMIC }}>
                {f.text}
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5">
                {f.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] opacity-75"
                    style={{ border: "1px solid rgba(244,244,244,0.35)", fontFamily: PIXEL }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 02 · THE WORK ============ */}
      <section className="py-16 md:py-28" style={altSection}>
        <div className="px-6 md:px-14 max-w-[1400px] mx-auto">
          <p className={`${eyebrow} mb-4`} style={{ fontFamily: PIXEL }}>
            {t.workEyebrow} · {CLIPS.length}
          </p>
          <h2
            className={`${sectionTitle} mb-10 md:mb-14`}
            style={{ fontSize: "calc(clamp(34px, 5.4vw, 80px) * var(--bgk, 1))" }}
          >
            {t.workTitle}
          </h2>
          <div className="grid grid-flow-dense grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-7 auto-rows-auto">
            {CLIPS.map((c, i) => (
              <ClipTile key={c.id} clip={c} idx={i} onExpand={() => setExpanded(c)} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 03 · THE ROSTER ============ */}
      <section className="px-6 md:px-14 py-16 md:py-28 max-w-[1400px] mx-auto">
        <p className={`${eyebrow} mb-4`} style={{ fontFamily: PIXEL }}>
          {t.brandsEyebrow}
        </p>
        <h2
          className={`${sectionTitle} mb-10 md:mb-14 text-balance`}
          style={{ fontSize: "calc(clamp(30px, 4.6vw, 72px) * var(--bgk, 1))" }}
        >
          {t.brandsTitle}
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 md:gap-3">
          {ROSTER.map((c) => (
            <div
              key={c.name}
              className="border-2 border-white bg-white flex flex-col"
              style={{
                background: c.dark ? "#0d0d0d" : undefined,
                borderColor: c.dark ? "rgba(244,244,244,0.45)" : undefined,
                aspectRatio: "5/4",
                boxShadow: "5px 5px 0 0 #8a8a8a",
              }}
            >
              <div className="flex-1 flex items-center justify-center p-1.5 md:p-3 min-h-0">
                <Image
                  src={c.logo}
                  alt={c.name}
                  width={220}
                  height={110}
                  className="w-full h-full object-contain"
                  style={{ filter: c.invert ? "invert(1)" : undefined }}
                  unoptimized
                />
              </div>
              <div
                className="hidden md:flex items-center justify-between gap-1.5 border-t-2 border-black px-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] leading-none"
                style={{ color: c.dark ? "#f4f4f4" : "#0d0d0d", borderColor: c.dark ? "rgba(244,244,244,0.35)" : undefined }}
              >
                <span className="truncate">{c.name}</span>
                <span className="shrink-0 opacity-45 text-[10px] tracking-[0.12em]" style={{ fontFamily: PIXEL }}>
                  {t.region[c.region]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 04 · THREE CASES ============ */}
      <section className="py-16 md:py-28" style={altSection}>
        <div className="px-6 md:px-14 max-w-[1400px] mx-auto">
          <p className={`${eyebrow} mb-4`} style={{ fontFamily: PIXEL }}>
            {t.casesEyebrow}
          </p>
          <h2
            className={`${sectionTitle} mb-10 md:mb-14`}
            style={{ fontSize: "calc(clamp(34px, 5.4vw, 80px) * var(--bgk, 1))" }}
          >
            {t.casesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {t.cases.map((c) => {
              const mark = CASE_LOGOS[c.slug];
              return (
                <div
                  key={c.slug}
                  className="border-2 flex flex-col overflow-hidden"
                  style={{
                    background: "#0d0d0d",
                    borderColor: "rgba(244,244,244,0.3)",
                    boxShadow: "6px 6px 0 0 #2a2a2a",
                  }}
                >
                  <div
                    className="px-4 md:px-5 py-3.5 md:py-4 border-b-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 justify-between"
                    style={{ borderColor: "rgba(244,244,244,0.25)" }}
                  >
                    {mark ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={mark.src}
                        alt={c.brand}
                        loading="lazy"
                        decoding="async"
                        className="h-5 md:h-6 w-auto max-w-[130px] object-contain"
                        style={{ filter: mark.invert ? "invert(1) hue-rotate(180deg) saturate(1.15)" : undefined }}
                      />
                    ) : (
                      <div className="font-black text-lg uppercase tracking-tight">{c.brand}</div>
                    )}
                    <div className="text-[12px] uppercase tracking-[0.2em] opacity-60" style={{ fontFamily: PIXEL }}>
                      {c.category}
                    </div>
                  </div>
                  <div className="px-4 md:px-5 py-7 md:py-9 flex-1 flex items-center">
                    <div
                      className="font-black uppercase leading-[0.98] tracking-[-0.02em] text-balance"
                      style={{
                        fontSize: "calc(clamp(26px, 2.4vw, 36px) * var(--bgk, 1))",
                        background: SILVER_H,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontFamily: displayMixed,
                      }}
                    >
                      {c.focus}
                    </div>
                  </div>
                  <div className="p-4 md:p-5" style={{ borderTop: "1px solid rgba(244,244,244,0.18)" }}>
                    <p className="text-[13px] leading-[1.5] font-medium opacity-85" style={{ fontFamily: COMIC }}>
                      {c.highlight}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 05 · CONTACT ============ */}
      <section className="px-6 md:px-14 py-16 md:py-28 max-w-[1400px] mx-auto">
        <p className={`${eyebrow} mb-4`} style={{ fontFamily: PIXEL }}>
          {t.contactEyebrow}
        </p>
        <h2
          className={`${sectionTitle} mb-8 md:mb-10`}
          style={{ fontSize: "calc(clamp(38px, 7vw, 108px) * var(--bgk, 1))" }}
        >
          {t.contactTitle}
        </h2>
        <div
          className="flex flex-col sm:flex-row sm:flex-wrap gap-x-10 gap-y-3 text-sm md:text-base font-bold uppercase tracking-[0.12em]"
          style={{ fontFamily: PIXEL }}
        >
          <a href="mailto:vektoagency@gmail.com" className="normal-case tracking-normal opacity-85 hover:opacity-100">
            vektoagency@gmail.com
          </a>
          <a href="tel:+359882251474" className="tabular-nums opacity-85 hover:opacity-100">
            +359 88 225 1474
          </a>
          <span className="opacity-50">{t.based}</span>
        </div>
        <div
          className="mt-14 md:mt-20 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] uppercase tracking-[0.2em] opacity-40"
          style={{ borderTop: "1px solid rgba(244,244,244,0.14)", fontFamily: PIXEL }}
        >
          <span>© {new Date().getFullYear()} VEKTO. {t.rights}</span>
          <span>vektoagency.com</span>
        </div>
      </section>

      {expanded && <ClipLightbox clip={expanded} onClose={() => setExpanded(null)} />}
    </div>
  );
}
