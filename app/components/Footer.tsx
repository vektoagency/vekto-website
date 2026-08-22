"use client";

// ============================================================================
// SITE FOOTER — the structure the old theme's footer had (brand column,
// explore links, get in touch, legal bottom bar), rebuilt in the film's
// world: jet ground, hairline rules, brushed-metal wordmark, instrument
// mono for labels. Loads its own faces like SiteHeader so every route
// gets the same typography whether or not the page sets --brutal-*.
// ============================================================================

import Link from "next/link";
import { IBM_Plex_Mono, Space_Grotesk, Onest } from "next/font/google";
import { useT } from "../i18n/LangProvider";

const pixelMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--f-pixel",
  display: "swap",
});
const displayLat = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--f-display-lat",
  display: "swap",
});
const displayCyr = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--f-display-cyr",
  display: "swap",
});

const WORDMARK_METAL =
  "linear-gradient(180deg, #d4d4d4 0%, #a8a8a8 40%, #7a7a7a 70%, #969696 100%)";
const DISPLAY_STACK =
  "var(--f-display-lat), var(--f-display-cyr), system-ui, sans-serif";
const PIXEL_STACK = "var(--f-pixel), ui-monospace, monospace";

const EMAIL = "vektoagency@gmail.com";

export default function Footer() {
  const year = new Date().getFullYear();
  const t = useT({
    bg: {
      tagline:
        "Криейтиви, фунии и AI решения — всичко на едно място. Партньор за растеж на 50+ бизнеса в България и САЩ.",
      based: "България · САЩ",
      explore: "Разгледай",
      exploreLinks: [
        { label: "Начало", href: "/" },
        { label: "Портфолио", href: "/portfolio" },
        { label: "Резултати", href: "/case-studies" },
        { label: "Анкета", href: "/start" },
      ],
      contactH: "Свържи се",
      startProject: "Опиши проекта си",
      bookCall: "Запази разговор",
      rights: "Всички права запазени.",
      privacy: "Поверителност",
      terms: "Условия",
    },
    en: {
      tagline:
        "Creatives, funnels and AI solutions — under one roof. Growth partner to 50+ businesses across Bulgaria and the US.",
      based: "Bulgaria · US",
      explore: "Explore",
      exploreLinks: [
        { label: "Home", href: "/" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Brief", href: "/start" },
      ],
      contactH: "Get in touch",
      startProject: "Describe your project",
      bookCall: "Book a call",
      rights: "All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
    },
  });

  const fontClasses = [
    pixelMono.variable,
    displayLat.variable,
    displayCyr.variable,
  ].join(" ");

  const colLabel =
    "text-[11px] font-bold uppercase tracking-[0.3em] opacity-45 mb-5";
  const linkClass =
    "inline-block text-[13px] md:text-[14px] font-bold uppercase tracking-[0.06em] opacity-70 hover:opacity-100 transition-opacity";

  return (
    <footer
      className={fontClasses}
      style={{
        // Darker than the page's jet (#0d0d0d) and its alt sections
        // (#141414) — the footer reads as the ground everything rests on,
        // not as one more stage. The brighter top rule sells the step down.
        background: "#050505",
        color: "#f4f4f4",
        borderTop: "1px solid rgba(244,244,244,0.28)",
        boxShadow: "inset 0 12px 24px -18px rgba(0,0,0,0.9)",
        fontFamily: DISPLAY_STACK,
      }}
    >
      <div className="px-6 md:px-14 py-14 md:py-20 max-w-[1400px] mx-auto">
        <div className="grid gap-10 md:gap-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.1fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="VEKTO"
              className="block h-9 w-[150px] mb-5"
              style={{
                background: WORDMARK_METAL,
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
            <p className="text-[13.5px] md:text-[14.5px] leading-[1.6] opacity-60 max-w-sm mb-6 font-medium">
              {t.tagline}
            </p>
            <div
              className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.3em] opacity-50"
              style={{ fontFamily: PIXEL_STACK }}
            >
              <span
                aria-hidden
                className="w-[7px] h-[7px] rotate-45"
                style={{ background: "#f4f4f4" }}
              />
              {t.based}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className={colLabel} style={{ fontFamily: PIXEL_STACK }}>
              {t.explore}
            </h4>
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {t.exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h4 className={colLabel} style={{ fontFamily: PIXEL_STACK }}>
              {t.contactH}
            </h4>
            <ul className="flex flex-col gap-3 list-none m-0 p-0 mb-6">
              <li>
                <a href={`mailto:${EMAIL}`} className={`${linkClass} normal-case tracking-normal`}>
                  {EMAIL}
                </a>
              </li>
              <li>
                <Link href="/start" className={linkClass}>
                  {t.startProject}
                </Link>
              </li>
            </ul>
            <button
              type="button"
              data-cal-namespace="30min"
              data-cal-link="vekto/30min"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="inline-flex items-center gap-2 border-[1.5px] px-4 py-2.5 text-[12px] font-black uppercase tracking-[0.14em] transition-colors text-[#f4f4f4] hover:bg-white hover:text-black cursor-pointer"
              style={{ borderColor: "rgba(244,244,244,0.6)" }}
            >
              <span aria-hidden>▦</span>
              {t.bookCall}
            </button>
          </div>
        </div>

        {/* Legal bar */}
        <div
          className="mt-12 md:mt-16 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.2em] opacity-45"
          style={{
            borderTop: "1px solid rgba(244,244,244,0.14)",
            fontFamily: PIXEL_STACK,
          }}
        >
          <p className="m-0">
            © {year} VEKTO. {t.rights}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">
              {t.privacy}
            </Link>
            <Link href="/terms" className="hover:opacity-100 transition-opacity">
              {t.terms}
            </Link>
            <span>vektoagency.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
