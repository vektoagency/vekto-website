"use client";

import { useEffect, useRef, useState } from "react";
import AnimateIn from "./AnimateIn";
import { useT, useLang } from "../i18n/LangProvider";

type Client = {
  name: string;
  logo: string;
  url: string;
  desc: { bg: string; en: string };
  circular?: boolean;
  invert?: boolean;
  // Multi-row / stacked marks (logo above word, etc.) — render taller so
  // each glyph stays legible at the marquee scale.
  stacked?: boolean;
};

const bgClients: Client[] = [
  { name: "ISOSPORT", logo: "/images/logo-isosport.webp", url: "https://neopak.eu", desc: { bg: "Енергийни и функционални напитки", en: "Energy & functional beverages" } },
  { name: "PARFEN", logo: "/images/logo-parfen.webp", url: "https://parfen.online", desc: { bg: "Дизайнерски инспирирани парфюми", en: "Designer-inspired perfumes" }, invert: true },
  { name: "BIOTICA", logo: "/images/logo-biotica.webp", url: "https://biotica.bg", desc: { bg: "Натурални хранителни добавки", en: "Natural supplements" }, circular: true, invert: true },
  { name: "BEMEACNE", logo: "/images/logo-bemeacne.webp", url: "https://bemeacne.bg", desc: { bg: "Грижа за кожа срещу акне", en: "Acne skincare brand" } },
  { name: "KRISTA G", logo: "/images/logo-krista-g-2022.webp", url: "https://kristag-bg.com", desc: { bg: "Натурална козметика", en: "Natural cosmetics" } },
  { name: "GIFTO", logo: "/images/logo-adventuresbg.webp", url: "https://gifto.bg", desc: { bg: "Подаръчни ваучери за преживявания", en: "Experience voucher platform" } },
  { name: "ADVENTURES BG", logo: "/images/logo-gifto2.webp", url: "https://adventures.bg", desc: { bg: "Приключенски туризъм", en: "Adventure tourism" } },
  // Added 2026-07-02 — 7 new BG partners. Everything runs on the standard
  // dark tile; dark-ink marks get `invert` so they read in white on the
  // black surface. If we ever want the real brand colours preserved, the
  // move is to source a light/white variant of each logo from the brand
  // — not to switch the whole marquee to a mixed light+dark aesthetic.
  { name: "ALPEN PHARMA", logo: "/images/logo-alpenpharma.png", url: "https://alpenpharma.bg", desc: { bg: "Фармацевтичен дистрибутор", en: "Pharma & health distributor" }, invert: true },
  { name: "NIDO", logo: "/images/logo-nido.png", url: "https://nido.bg", desc: { bg: "Търговски партньор", en: "Trusted partner" } },
  { name: "ARTE HOTEL", logo: "/images/logo-artehotel.png", url: "https://artehotel.bg", desc: { bg: "Бутиков хотел", en: "Boutique hotel" } },
  { name: "KASHMIR HOTEL", logo: "/images/logo-kashmirhotel.png", url: "https://kashmirhotel.bg", desc: { bg: "Луксозен хотел", en: "Luxury hotel" }, invert: true },
  { name: "CARTEL CAFFE", logo: "/images/logo-cartelcaffe.svg", url: "https://www.cartelcaffe.com", desc: { bg: "Кафе бранд", en: "Coffee brand" } },
  { name: "PHYTOLIFE", logo: "/images/logo-phytolife.webp", url: "https://phytolife.bg", desc: { bg: "Натурални добавки", en: "Natural wellness" }, invert: true },
  { name: "GOURMET HOUSE", logo: "/images/logo-gourmethouse.png", url: "https://gourmethouse.bg", desc: { bg: "Гурме продукти", en: "Gourmet food" }, invert: true },
];

const usClients: Client[] = [
  { name: "DUSQ", logo: "/images/logo-dusq.webp", url: "https://dusq.com", desc: { bg: "Уред за по-добър сън", en: "Sleep wearable device" }, invert: true },
  { name: "NUTRIFITT", logo: "/images/logo-nutrifitt.webp", url: "https://nutrifitt.com", desc: { bg: "Добавки за фитнес", en: "Fitness supplements" }, stacked: true },
  // Dark wordmarks — invert to white so they're visible on the dark tile.
  // Mirrors the BG row pattern (PARFEN, BIOTICA use the same trick).
  { name: "ANOMALY", logo: "/images/logo-anomaly.webp", url: "https://tryanomalyhealth.com", desc: { bg: "Имунитет и чревно здраве за цялото семейство", en: "Family immune & gut supplements" }, invert: true },
  { name: "LUCKY ENERGY", logo: "/images/logo-lucky.webp", url: "https://luckybevco.com", desc: { bg: "Енергийни напитки без захар", en: "Zero-sugar energy drinks" }, invert: true, stacked: true },
  // Orange wordmark — visible on dark, no invert.
  { name: "TASTE FLAVOR CO.", logo: "/images/logo-tasteflavor.webp", url: "https://tasteflavorco.com", desc: { bg: "Гурме сосове с нисък калориен прием", en: "Low-calorie gourmet sauces" }, stacked: true },
  { name: "ETHAN'S", logo: "/images/logo-ethans.webp", url: "https://ethans.com", desc: { bg: "Растителни енергийни напитки", en: "Plant-based energy drinks" }, invert: true },
];

// Single fixed-size logo frame ensures every logo lands in the same slot,
// scaled to fit. Wide logos fill horizontally, circular ones fill the
// shorter axis — but the *container* size is identical for all tiles, so
// the visual rhythm stays consistent across the whole feed.
function BrandTile({ c, lang }: { c: Client; lang: "bg" | "en" }) {
  // Hue-preserving lightness invert. Old filter was `brightness(0) invert(1)`
  // which collapsed every logo to pure white silhouette (killing any
  // brand-red/green/blue in two-colour marks). `invert(1) hue-rotate(180)`
  // inverts only the LIGHTNESS channel — dark hues become their light
  // counterpart (dark green → light green, deep red → soft red) while
  // pure black/white logos still render as white on the black tile.
  // Extra saturate(1.15) gives the recovered hue a bit more presence
  // against the black surface so it doesn't wash out.
  const invert = c.invert ? "invert(1) hue-rotate(180deg) saturate(1.15)" : undefined;
  const desc = c.desc[lang];
  return (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative shrink-0 w-[140px] md:w-[230px] h-[88px] md:h-[140px] mx-1 md:mx-2.5 rounded-md overflow-hidden bg-[#0a0a0a] border border-[#161616] hover:border-[#c8ff00]/55 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_16px_48px_-16px_rgba(200,255,0,0.35)]"
      aria-label={`${c.name} — open website`}
    >
      {/* Phosphor glow on hover — bottom-up sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(200,255,0,0.22) 0%, transparent 75%)",
        }}
      />

      {/* Logo — fixed visual HEIGHT for ALL marks so wide and square
          logos read at equal weight across the marquee. Width is auto
          (capped via max-w-*) so wide marks don't push past the tile. */}
      <div className="absolute inset-x-0 top-0 bottom-[36px] md:bottom-[56px] flex items-center justify-center px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.name}
          draggable={false}
          className={`opacity-95 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 w-auto max-w-[115px] md:max-w-[185px] ${
            c.circular
              ? "h-[44px] md:h-[68px]"
              : c.stacked
                ? "h-[42px] md:h-[60px]"
                : "h-[32px] md:h-[48px]"
          }`}
          style={{ objectFit: "contain", filter: invert }}
        />
      </div>

      {/* Brand name + description — bottom strip */}
      <div className="absolute inset-x-0 bottom-0 px-2 md:px-3 py-1.5 md:py-2.5 flex flex-col items-center text-center border-t border-[#161616] group-hover:border-[#c8ff00]/30 transition-colors duration-500">
        <span className="font-mono text-[8px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-[0.2em] text-[#c8ff00]/85 group-hover:text-[#c8ff00] transition-colors duration-500 truncate w-full">
          {c.name}
        </span>
        <span className="text-[8px] md:text-[10px] text-[#7a7a7a] group-hover:text-[#a0a0a0] transition-colors duration-500 truncate w-full leading-tight mt-0.5">
          {desc}
        </span>
      </div>
    </a>
  );
}

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const { lang } = useLang();
  const t = useT({
    bg: {
      title: "Бизнес партньори, които ни се довериха",
      regionBg: "◆ България",
      regionUs: "◆ САЩ / Свят",
    },
    en: {
      title: "Trusted by forward-thinking brands",
      regionBg: "◆ Bulgaria",
      regionUs: "◆ USA / Worldwide",
    },
  });

  // Pause the marquee whenever the section is offscreen — saves GPU work
  // and prevents the animation from drifting/desyncing while invisible.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-6 md:py-14 border-y border-[#1e1e1c] relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #070707 0%, #0a0a0a 50%, #070707 100%)" }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/30 to-transparent" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-4 md:mb-8">
        <AnimateIn>
          <p className="text-center text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-widest">
            {t.title}
          </p>
        </AnimateIn>
      </div>

      {/* Region label — Bulgaria */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-2 md:mb-3 flex items-center gap-2 md:gap-3">
        <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[#c8ff00]/70 whitespace-nowrap">
          {t.regionBg}
        </span>
        <span className="flex-1 h-px bg-gradient-to-r from-[#c8ff00]/25 to-transparent" />
      </div>

      {/* Marquee track — Bulgaria — left-scrolling, edges masked */}
      <div
        className="relative overflow-hidden"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div
          className={`flex feed-track py-3 ${inView ? "" : "feed-paused"}`}
          style={{
            width: "max-content",
            willChange: "transform",
          }}
        >
          {[...bgClients, ...bgClients, ...bgClients].map((c, i) => (
            <BrandTile key={`bg-${c.name}-${i}`} c={c} lang={lang} />
          ))}
        </div>
      </div>

      {/* Region label — USA / Worldwide */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-4 md:mt-5 mb-2 md:mb-3 flex items-center gap-2 md:gap-3">
        <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[#c8ff00]/70 whitespace-nowrap">
          {t.regionUs}
        </span>
        <span className="flex-1 h-px bg-gradient-to-r from-[#c8ff00]/25 to-transparent" />
      </div>

      {/* Marquee track — USA — right-scrolling (opposite direction), edges masked */}
      <div
        className="relative overflow-hidden"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div
          className={`flex feed-track-reverse py-3 ${inView ? "" : "feed-paused"}`}
          style={{
            width: "max-content",
            willChange: "transform",
          }}
        >
          {[...usClients, ...usClients, ...usClients].map((c, i) => (
            <BrandTile key={`us-${c.name}-${i}`} c={c} lang={lang} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes feedScroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-33.3333%, 0, 0); }
        }
        @keyframes feedScrollReverse {
          from { transform: translate3d(-33.3333%, 0, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
        .feed-track,
        .feed-track-reverse {
          /* Slower duration smooths perceived motion — eye reads it as
             premium glide rather than busy scroll. Mobile gets a faster
             cycle because tiles are narrower → otherwise the same brand
             takes too long to come back into view. */
          animation: feedScroll 35s linear infinite;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        .feed-track-reverse {
          animation-name: feedScrollReverse;
        }
        @media (min-width: 768px) {
          .feed-track,
          .feed-track-reverse { animation-duration: 50s; }
        }
        .feed-paused {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .feed-track,
          .feed-track-reverse { animation: none; }
        }
      `}</style>
    </section>
  );
}
