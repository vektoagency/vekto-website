"use client";

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
  { name: "MEN'S CARE", logo: "/images/logo-menscare.png", url: "https://menscarebulgaria.com", desc: { bg: "Растеж на брада и коса", en: "Beard & hair growth" }, circular: true },
  { name: "PARFEN", logo: "/images/logo-parfen.webp", url: "https://parfen.online", desc: { bg: "Дизайнерски инспирирани парфюми", en: "Designer-inspired perfumes" }, invert: true },
  { name: "BIOTICA", logo: "/images/logo-biotica.webp", url: "https://biotica.bg", desc: { bg: "Натурални хранителни добавки", en: "Natural supplements" }, circular: true, invert: true },
  { name: "BEMEACNE", logo: "/images/logo-bemeacne.webp", url: "https://bemeacne.bg", desc: { bg: "Грижа за кожа срещу акне", en: "Acne skincare brand" } },
  { name: "KRISTA G", logo: "/images/logo-krista-g-2022.webp", url: "https://kristag-bg.com", desc: { bg: "Натурална козметика", en: "Natural cosmetics" } },
  { name: "GIFTO", logo: "/images/logo-adventuresbg.webp", url: "https://gifto.bg", desc: { bg: "Подаръчни ваучери за преживявания", en: "Experience voucher platform" } },
  { name: "ADVENTURES BG", logo: "/images/logo-gifto2.webp", url: "https://adventures.bg", desc: { bg: "Приключенски туризъм", en: "Adventure tourism" } },
  // Added 2026-07-02 — 7 new BG partners.
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

const TOTAL_BRANDS = bgClients.length + usClients.length;

/**
 * BrandTile — grid cell that shows the logo prominently by default and
 * slides up a name + description overlay on hover. Sized for a dense
 * 3/4/5-column grid layout (was previously a marquee tile). All the
 * old flags (circular / stacked / invert) still apply the same way.
 */
function BrandTile({ c, lang }: { c: Client; lang: "bg" | "en" }) {
  // Hue-preserving lightness invert — same trick as before. Dark hues
  // become their light counterpart (dark-green → light-green, deep-red
  // → soft-red) while pure-black logos still render as white.
  const invert = c.invert ? "invert(1) hue-rotate(180deg) saturate(1.15)" : undefined;
  const desc = c.desc[lang];
  return (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-[4/3] rounded-md overflow-hidden bg-[#0a0a0a] border border-[#161616] hover:border-[#c8ff00]/55 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-14px_rgba(200,255,0,0.45)]"
      aria-label={`${c.name} — open website`}
    >
      {/* Phosphor glow — bottom-up sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(200,255,0,0.20) 0%, transparent 70%)",
        }}
      />

      {/* Logo — fills the cell, centred. Fades slightly on hover so the
          overlay copy stays legible over it. */}
      <div className="absolute inset-0 flex items-center justify-center px-3 md:px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.name}
          draggable={false}
          loading="lazy"
          decoding="async"
          className={`w-auto object-contain opacity-95 transition-all duration-500 group-hover:opacity-40 group-hover:scale-95 ${
            c.circular
              ? "h-[42px] md:h-[54px] max-w-[60%]"
              : c.stacked
                ? "h-[36px] md:h-[48px] max-w-[80%]"
                : "h-[28px] md:h-[36px] max-w-[85%]"
          }`}
          style={{ filter: invert }}
        />
      </div>

      {/* Hover overlay — slides up from bottom, name + description */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out px-3 md:px-4 py-3 md:py-3.5 text-center bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent"
      >
        <div className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-[#c8ff00] font-semibold mb-1 truncate">
          {c.name}
        </div>
        <div className="text-[10px] md:text-[11px] text-[#cfcbc4] leading-tight line-clamp-2">
          {desc}
        </div>
      </div>
    </a>
  );
}

function RegionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
      <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[#c8ff00]/70 whitespace-nowrap">
        {label}
      </span>
      <span className="font-mono text-[9px] md:text-[10px] tabular-nums text-[#c8ff00]/45 whitespace-nowrap">
        {count.toString().padStart(2, "0")}
      </span>
      <span className="flex-1 h-px bg-gradient-to-r from-[#c8ff00]/25 to-transparent" />
    </div>
  );
}

/**
 * Clients section — dense static grid. All 21 partners visible at once
 * instead of scrolling through a marquee, so visitors see the full
 * roster in a single glance without waiting for a full loop.
 *
 * Layout:
 *   mobile   → 3 cols  (BG: 5 rows, US: 2 rows)
 *   sm  ≥640 → 4 cols  (BG: 4 rows, US: 2 rows)
 *   md  ≥768 → 5 cols  (BG: 3 rows, US: 2 rows — exact fit)
 *
 * Each tile is aspect-4:3 so the wall reads as a proper grid regardless
 * of viewport. Hover triggers a bottom-up overlay with the brand name +
 * description (no permanent text strip like the old marquee had, so
 * more logos fit per row without cropping).
 */
export default function Clients() {
  const { lang } = useLang();
  const t = useT({
    bg: {
      title: "Бизнес партньори, които ни се довериха",
      subtitle: `${TOTAL_BRANDS} бранда · България и САЩ`,
      regionBg: "◆ България",
      regionUs: "◆ САЩ / Свят",
    },
    en: {
      title: "Trusted by forward-thinking brands",
      subtitle: `${TOTAL_BRANDS} brands · Bulgaria & USA`,
      regionBg: "◆ Bulgaria",
      regionUs: "◆ USA / Worldwide",
    },
  });

  return (
    <section
      className="py-10 md:py-16 border-y border-[#1e1e1c] relative"
      style={{ background: "linear-gradient(to bottom, #070707 0%, #0a0a0a 50%, #070707 100%)" }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/30 to-transparent" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-6 md:mb-10 text-center">
        <AnimateIn>
          <p className="text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-widest mb-1.5 md:mb-2">
            {t.title}
          </p>
          <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#7a7a7a]">
            {t.subtitle}
          </p>
        </AnimateIn>
      </div>

      {/* Region — Bulgaria */}
      <RegionHeader label={t.regionBg} count={bgClients.length} />
      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-8 md:mb-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
          {bgClients.map((c) => (
            <BrandTile key={`bg-${c.name}`} c={c} lang={lang} />
          ))}
        </div>
      </div>

      {/* Region — USA / Worldwide */}
      <RegionHeader label={t.regionUs} count={usClients.length} />
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
          {usClients.map((c) => (
            <BrandTile key={`us-${c.name}`} c={c} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
