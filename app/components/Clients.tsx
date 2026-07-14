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
  stacked?: boolean;
  // Region badge shown in the tile's corner — the two client arrays
  // used to render as separate sections; now they merge into one grid
  // and this pill preserves the BG vs US split without an extra row.
  region: "BG" | "US";
};

const bgClients: Client[] = [
  { name: "ISOSPORT", logo: "/images/logo-isosport.webp", url: "https://neopak.eu", desc: { bg: "Енергийни и функционални напитки", en: "Energy & functional beverages" }, region: "BG" },
  { name: "MEN'S CARE", logo: "/images/logo-menscare.png", url: "https://menscarebulgaria.com", desc: { bg: "Растеж на брада и коса", en: "Beard & hair growth" }, circular: true, region: "BG" },
  { name: "PARFEN", logo: "/images/logo-parfen.webp", url: "https://parfen.online", desc: { bg: "Дизайнерски инспирирани парфюми", en: "Designer-inspired perfumes" }, invert: true, region: "BG" },
  { name: "BIOTICA", logo: "/images/logo-biotica.webp", url: "https://biotica.bg", desc: { bg: "Натурални хранителни добавки", en: "Natural supplements" }, circular: true, invert: true, region: "BG" },
  { name: "BEMEACNE", logo: "/images/logo-bemeacne.webp", url: "https://bemeacne.bg", desc: { bg: "Грижа за кожа срещу акне", en: "Acne skincare brand" }, region: "BG" },
  { name: "KRISTA G", logo: "/images/logo-krista-g-2022.webp", url: "https://kristag-bg.com", desc: { bg: "Натурална козметика", en: "Natural cosmetics" }, region: "BG" },
  { name: "GIFTO", logo: "/images/logo-adventuresbg.webp", url: "https://gifto.bg", desc: { bg: "Подаръчни ваучери за преживявания", en: "Experience voucher platform" }, region: "BG" },
  { name: "ADVENTURES BG", logo: "/images/logo-gifto2.webp", url: "https://adventures.bg", desc: { bg: "Приключенски туризъм", en: "Adventure tourism" }, region: "BG" },
  { name: "ALPEN PHARMA", logo: "/images/logo-alpenpharma.png", url: "https://alpenpharma.bg", desc: { bg: "Фармацевтичен дистрибутор", en: "Pharma & health distributor" }, invert: true, region: "BG" },
  { name: "NIDO", logo: "/images/logo-nido.png", url: "https://nido.bg", desc: { bg: "Търговски партньор", en: "Trusted partner" }, region: "BG" },
  { name: "ARTE HOTEL", logo: "/images/logo-artehotel.png", url: "https://artehotel.bg", desc: { bg: "Бутиков хотел", en: "Boutique hotel" }, region: "BG" },
  { name: "KASHMIR HOTEL", logo: "/images/logo-kashmirhotel.png", url: "https://kashmirhotel.bg", desc: { bg: "Луксозен хотел", en: "Luxury hotel" }, invert: true, region: "BG" },
  { name: "CARTEL CAFFE", logo: "/images/logo-cartelcaffe.svg", url: "https://www.cartelcaffe.com", desc: { bg: "Кафе бранд", en: "Coffee brand" }, region: "BG" },
  { name: "PHYTOLIFE", logo: "/images/logo-phytolife.webp", url: "https://phytolife.bg", desc: { bg: "Натурални добавки", en: "Natural wellness" }, invert: true, region: "BG" },
  { name: "GOURMET HOUSE", logo: "/images/logo-gourmethouse.png", url: "https://gourmethouse.bg", desc: { bg: "Гурме продукти", en: "Gourmet food" }, invert: true, region: "BG" },
];

const usClients: Client[] = [
  { name: "DUSQ", logo: "/images/logo-dusq.webp", url: "https://dusq.com", desc: { bg: "Уред за по-добър сън", en: "Sleep wearable device" }, invert: true, region: "US" },
  { name: "NUTRIFITT", logo: "/images/logo-nutrifitt.webp", url: "https://nutrifitt.com", desc: { bg: "Добавки за фитнес", en: "Fitness supplements" }, stacked: true, region: "US" },
  { name: "ANOMALY", logo: "/images/logo-anomaly.webp", url: "https://tryanomalyhealth.com", desc: { bg: "Имунитет и чревно здраве за цялото семейство", en: "Family immune & gut supplements" }, invert: true, region: "US" },
  { name: "LUCKY ENERGY", logo: "/images/logo-lucky.webp", url: "https://luckybevco.com", desc: { bg: "Енергийни напитки без захар", en: "Zero-sugar energy drinks" }, invert: true, stacked: true, region: "US" },
  { name: "TASTE FLAVOR CO.", logo: "/images/logo-tasteflavor.webp", url: "https://tasteflavorco.com", desc: { bg: "Гурме сосове с нисък калориен прием", en: "Low-calorie gourmet sauces" }, stacked: true, region: "US" },
  { name: "ETHAN'S", logo: "/images/logo-ethans.webp", url: "https://ethans.com", desc: { bg: "Растителни енергийни напитки", en: "Plant-based energy drinks" }, invert: true, region: "US" },
];

// One flat roster — BG entries first so their tiles land at the top of
// the grid where the eye enters. US tiles fill in after; the region pill
// in each tile's corner keeps the split visible without an extra header.
const allClients: Client[] = [...bgClients, ...usClients];
const bgCount = bgClients.length;
const usCount = usClients.length;

/**
 * BrandTile — wide compact grid cell. Aspect 2:1 keeps each tile short
 * enough that 3-4 rows fit the whole roster, so the section stays under
 * ~260 px of vertical space vs the ~700 px the taller aspect-4/3 grid
 * used. Logo centred, region pill in the corner, hover slides up a
 * name + description overlay from the bottom.
 */
function BrandTile({ c, lang }: { c: Client; lang: "bg" | "en" }) {
  // Hue-preserving lightness invert — dark hues become their light
  // counterpart while pure-black still renders as white. See earlier
  // commit for the filter breakdown.
  const invert = c.invert ? "invert(1) hue-rotate(180deg) saturate(1.15)" : undefined;
  const desc = c.desc[lang];
  return (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-[2/1] rounded-md overflow-hidden bg-[#0a0a0a] border border-[#161616] hover:border-[#c8ff00]/55 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgba(200,255,0,0.45)]"
      aria-label={`${c.name} — open website`}
    >
      {/* Region pill — tiny, only visible on desktop so mobile stays clean */}
      <span
        aria-hidden
        className="hidden md:block absolute top-1 left-1 z-[2] font-mono text-[7px] uppercase tracking-[0.2em] text-[#c8ff00]/50 bg-black/50 backdrop-blur-sm px-1 py-[1px] rounded-[2px]"
      >
        {c.region}
      </span>

      {/* Phosphor glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(200,255,0,0.20) 0%, transparent 70%)",
        }}
      />

      {/* Logo — centred, sized so wide + circular + stacked marks all
          read at similar visual weight. Fades on hover so overlay copy
          stays legible. */}
      <div className="absolute inset-0 flex items-center justify-center px-2 md:px-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.name}
          draggable={false}
          loading="lazy"
          decoding="async"
          className={`w-auto object-contain opacity-95 transition-all duration-500 group-hover:opacity-30 group-hover:scale-95 ${
            c.circular
              ? "h-[26px] md:h-[34px] max-w-[55%]"
              : c.stacked
                ? "h-[22px] md:h-[30px] max-w-[80%]"
                : "h-[16px] md:h-[22px] max-w-[85%]"
          }`}
          style={{ filter: invert }}
        />
      </div>

      {/* Hover overlay — slides up on hover with name + description */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out px-2 md:px-3 py-1.5 md:py-2 text-center bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent"
      >
        <div className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.18em] text-[#c8ff00] font-semibold truncate">
          {c.name}
        </div>
        <div className="hidden md:block text-[9px] text-[#cfcbc4] leading-tight line-clamp-1 mt-0.5">
          {desc}
        </div>
      </div>
    </a>
  );
}

/**
 * Clients section — compact static grid, one merged roster.
 *
 * Layout math: 21 brands ÷ N columns = rows
 *   mobile 4 cols  → 6 rows × ~52 px = ~310 px grid
 *   sm     5 cols  → 5 rows × ~72 px = ~360 px
 *   md     7 cols  → 3 rows × ~78 px = ~235 px  (dense)
 *   lg     8 cols  → 3 rows × ~90 px = ~270 px
 *
 * Whole section including header + gaps: ~250-350 px vs the ~700 px
 * the two-region aspect-4/3 grid used before.
 */
export default function Clients() {
  const { lang } = useLang();
  const t = useT({
    bg: {
      title: "Бизнес партньори, които ни се довериха",
      subtitle: `${bgCount + usCount} бранда · ${bgCount} БГ · ${usCount} САЩ`,
    },
    en: {
      title: "Trusted by forward-thinking brands",
      subtitle: `${bgCount + usCount} brands · ${bgCount} BG · ${usCount} US`,
    },
  });

  return (
    <section
      className="py-6 md:py-10 border-y border-[#1e1e1c] relative"
      style={{ background: "linear-gradient(to bottom, #070707 0%, #0a0a0a 50%, #070707 100%)" }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/30 to-transparent" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8ff00]/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-4 md:mb-6 text-center">
        <AnimateIn>
          <p className="text-[10px] md:text-xs text-[#c8ff00] uppercase tracking-widest mb-1 md:mb-1.5">
            {t.title}
          </p>
          <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-[#7a7a7a]">
            {t.subtitle}
          </p>
        </AnimateIn>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-1.5 md:gap-2">
          {allClients.map((c) => (
            <BrandTile key={`${c.region}-${c.name}`} c={c} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
