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
  stacked?: boolean;
};

const bgClients: Client[] = [
  { name: "ISOSPORT", logo: "/images/logo-isosport.webp", url: "https://neopak.eu", desc: { bg: "Енергийни и функционални напитки", en: "Energy & functional beverages" } },
  { name: "MEN'S CARE", logo: "/images/logo-menscare.png", url: "https://menscarebulgaria.com", desc: { bg: "Растеж на брада и коса", en: "Beard & hair growth" }, circular: true },
  { name: "PARFEN", logo: "/images/logo-parfen.webp", url: "https://parfen.online", desc: { bg: "Дизайнерски инспирирани парфюми", en: "Designer-inspired perfumes" }, invert: true },
  { name: "BIOTICA", logo: "/images/logo-biotica.webp", url: "https://biotica.bg", desc: { bg: "Натурални хранителни добавки", en: "Natural supplements" }, circular: true, invert: true },
  { name: "BEMEACNE", logo: "/images/logo-bemeacne.webp", url: "https://bemeacne.bg", desc: { bg: "Грижа за кожа срещу акне", en: "Acne skincare brand" } },
  { name: "KRISTA G", logo: "/images/logo-krista-g-2022.webp", url: "https://kristag-bg.com", desc: { bg: "Натурална козметика", en: "Natural cosmetics" } },
  { name: "GIFTO", logo: "/images/logo-adventuresbg.webp", url: "https://gifto.bg", desc: { bg: "Подаръчни ваучери за преживявания", en: "Experience voucher platform" } },
  { name: "ADVENTURES BG", logo: "/images/logo-gifto2.webp", url: "https://adventures.bg", desc: { bg: "Приключенски туризъм", en: "Adventure tourism" } },
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
  { name: "ANOMALY", logo: "/images/logo-anomaly.webp", url: "https://tryanomalyhealth.com", desc: { bg: "Имунитет и чревно здраве за цялото семейство", en: "Family immune & gut supplements" }, invert: true },
  { name: "LUCKY ENERGY", logo: "/images/logo-lucky.webp", url: "https://luckybevco.com", desc: { bg: "Енергийни напитки без захар", en: "Zero-sugar energy drinks" }, invert: true, stacked: true },
  { name: "TASTE FLAVOR CO.", logo: "/images/logo-tasteflavor.webp", url: "https://tasteflavorco.com", desc: { bg: "Гурме сосове с нисък калориен прием", en: "Low-calorie gourmet sauces" }, stacked: true },
  { name: "ETHAN'S", logo: "/images/logo-ethans.webp", url: "https://ethans.com", desc: { bg: "Растителни енергийни напитки", en: "Plant-based energy drinks" }, invert: true },
];

// Split a list roughly in half for the two-row staggered marquee.
// Even indices → row A, odd → row B. Every other brand alternates rows,
// which gives the staggered/checkerboard pattern the user asked for
// once the two rows scroll at slightly different speeds in opposite
// directions.
function splitAlternating<T>(arr: T[]): [T[], T[]] {
  const a: T[] = [];
  const b: T[] = [];
  arr.forEach((item, i) => (i % 2 === 0 ? a.push(item) : b.push(item)));
  return [a, b];
}

const [bgRowA, bgRowB] = splitAlternating(bgClients);
const [usRowA, usRowB] = splitAlternating(usClients);

/**
 * BrandTile — marquee cell. Fixed width so wide + circular + stacked
 * logos land in the same slot with equal visual weight. Aspect 3:2
 * gives enough vertical room for the hover overlay to fit both name +
 * description without cramping.
 */
function BrandTile({ c, lang }: { c: Client; lang: "bg" | "en" }) {
  const invert = c.invert ? "invert(1) hue-rotate(180deg) saturate(1.15)" : undefined;
  const desc = c.desc[lang];
  return (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative shrink-0 w-[130px] md:w-[190px] aspect-[3/2] mx-1 md:mx-2 rounded-lg overflow-hidden bg-[#0a0a0a] border border-[#161616] hover:border-[#c8ff00]/55 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_36px_-16px_rgba(200,255,0,0.42)]"
      aria-label={`${c.name} — open website`}
    >
      {/* Inner sheen — subtle top-lit gradient so the tile doesn't read
          as a flat black rectangle. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0) 60%, rgba(200,255,0,0.03) 100%)",
        }}
      />
      {/* Hover phosphor glow — bottom-up sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(200,255,0,0.22) 0%, transparent 70%)",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center px-3 md:px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.name}
          draggable={false}
          loading="lazy"
          decoding="async"
          className={`w-auto object-contain opacity-95 transition-all duration-500 group-hover:opacity-30 group-hover:scale-95 ${
            c.circular
              ? "h-[34px] md:h-[48px] max-w-[55%]"
              : c.stacked
                ? "h-[32px] md:h-[44px] max-w-[80%]"
                : "h-[22px] md:h-[32px] max-w-[85%]"
          }`}
          style={{ filter: invert }}
        />
      </div>

      {/* Hover overlay — slides up from bottom with name + description */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out px-2.5 md:px-3.5 py-2 md:py-2.5 text-center bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent"
      >
        <div className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-[#c8ff00] font-semibold truncate mb-0.5">
          {c.name}
        </div>
        <div className="text-[9px] md:text-[10px] text-[#cfcbc4] leading-tight line-clamp-1 md:line-clamp-2">
          {desc}
        </div>
      </div>
    </a>
  );
}

/**
 * MarqueeRow — one scrolling row. Loops seamlessly by tripling the
 * client array and translating -33.33% at animation end. `direction`
 * toggles between the base keyframe (right-to-left) and its reverse.
 * `offset` shifts the row visually by half a tile width so the two
 * rows in a region interleave rather than vertically aligning — the
 * "chess"-style pattern the user asked for.
 */
function MarqueeRow({
  clients,
  lang,
  direction,
  duration,
  offset,
  paused,
}: {
  clients: Client[];
  lang: "bg" | "en";
  direction: "ltr" | "rtl";
  duration: number;
  offset: boolean;
  paused: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <div
        className={`flex py-1.5 md:py-2 ${
          direction === "rtl" ? "feed-track" : "feed-track-reverse"
        } ${paused ? "feed-paused" : ""}`}
        style={{
          width: "max-content",
          willChange: "transform",
          animationDuration: `${duration}s`,
          // Half-tile visual offset so the two rows interleave in a
          // staggered/chess pattern instead of stacking on top of each
          // other. Uses padding-left rather than transform so the mask
          // fade at both edges still lines up correctly.
          paddingLeft: offset ? undefined : undefined,
          marginLeft: offset ? "clamp(65px, 8vw, 100px)" : undefined,
        }}
      >
        {[...clients, ...clients, ...clients].map((c, i) => (
          <BrandTile key={`${c.name}-${i}`} c={c} lang={lang} />
        ))}
      </div>
    </div>
  );
}

function RegionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 mb-2.5 md:mb-3 flex items-center gap-2.5 md:gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse shrink-0" />
      <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#c8ff00] whitespace-nowrap">
        {label}
      </span>
      <span className="font-mono text-[9px] md:text-[10px] tabular-nums text-[#c8ff00]/45 whitespace-nowrap">
        {count.toString().padStart(2, "0")}
      </span>
      <span className="flex-1 h-px bg-gradient-to-r from-[#c8ff00]/25 via-[#c8ff00]/10 to-transparent" />
    </div>
  );
}

/**
 * Clients section — dual two-row staggered marquees, one per region.
 *
 * Each region shows two rows: row A (even-index brands) scrolls right-
 * to-left, row B (odd-index brands) scrolls left-to-right and is
 * offset by ~half a tile width. As the two rows move at slightly
 * different speeds and in opposite directions, the tiles interleave
 * in a shifting checkerboard pattern rather than sitting on a rigid
 * grid.
 */
export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const { lang } = useLang();
  const t = useT({
    bg: {
      title: "Бизнес партньори, които ни се довериха",
      regionBg: "БЪЛГАРИЯ",
      regionUs: "САЩ / СВЯТ",
    },
    en: {
      title: "Trusted by forward-thinking brands",
      regionBg: "BULGARIA",
      regionUs: "USA / WORLDWIDE",
    },
  });

  // Pause the marquees whenever the section is offscreen — same as the
  // original single-row marquee had. Saves GPU cycles and keeps the
  // animations from drifting out of phase while nothing's watching.
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

  const paused = !inView;

  return (
    <section
      ref={sectionRef}
      className="py-8 md:py-14 border-y border-[#1e1e1c] relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #070707 0%, #0a0a0a 50%, #070707 100%)" }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/30 to-transparent" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-5 md:mb-8 text-center">
        <AnimateIn>
          <p className="text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-[0.28em]">
            {t.title}
          </p>
        </AnimateIn>
      </div>

      {/* Region — Bulgaria */}
      <RegionHeader label={t.regionBg} count={bgClients.length} />
      <div className="space-y-1.5 md:space-y-2 mb-6 md:mb-8">
        <MarqueeRow clients={bgRowA} lang={lang} direction="rtl" duration={45} offset={false} paused={paused} />
        <MarqueeRow clients={bgRowB} lang={lang} direction="ltr" duration={52} offset={true} paused={paused} />
      </div>

      {/* Region — USA / Worldwide */}
      <RegionHeader label={t.regionUs} count={usClients.length} />
      <div className="space-y-1.5 md:space-y-2">
        <MarqueeRow clients={usRowA} lang={lang} direction="rtl" duration={40} offset={false} paused={paused} />
        <MarqueeRow clients={usRowB} lang={lang} direction="ltr" duration={48} offset={true} paused={paused} />
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
        .feed-track {
          animation: feedScroll linear infinite;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        .feed-track-reverse {
          animation: feedScrollReverse linear infinite;
          backface-visibility: hidden;
          transform: translateZ(0);
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
