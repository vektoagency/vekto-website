"use client";

// ============================================================================
// SITE HEADER — the homepage (brutalism) header, extracted for every other
// route. Same grammar everywhere: brushed-metal wordmark alone on the left,
// nav + language + white CTA grouped right, hamburger → fullscreen jet menu
// on phones. Transparent over dark heroes, solid jet with a hairline once
// scrolled (or from the start via `solid` for pages whose content begins at
// the top edge — those also get an in-flow spacer so nothing hides under it).
//
// Language runs through the global LangProvider (vekto-lang cookie), so the
// toggle here switches the whole page's copy on client pages and persists
// for server-rendered ones.
// ============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { IBM_Plex_Mono, Space_Grotesk, Onest } from "next/font/google";
import { useLang } from "../i18n/LangProvider";

// Same faces + config as the homepage loads, so the header typography is
// identical on every route (and Next dedupes the font payloads).
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

export default function SiteHeader({
  solid = false,
  ctaHref = "/start",
}: {
  /** Always-solid jet bar + in-flow spacer — for pages without a full-bleed
      dark hero under the header. Default is the homepage behaviour:
      transparent until scrolled. */
  solid?: boolean;
  /** Where the white CTA points. /start everywhere except on /start itself,
      which passes an in-page anchor. */
  ctaHref?: string;
}) {
  const { lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const headerSolid = solid || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The portfolio zoom overlay dims the page behind a semi-transparent
  // backdrop; the header would bleed through and fight its sticky bar, so
  // it slides away while the overlay is open (same contract the old Navbar
  // honoured).
  useEffect(() => {
    const onZoomStart = () => setHidden(true);
    const onZoomEnd = () => setHidden(false);
    window.addEventListener("vekto:zoom-started", onZoomStart);
    window.addEventListener("vekto:zoom-ended", onZoomEnd);
    return () => {
      window.removeEventListener("vekto:zoom-started", onZoomStart);
      window.removeEventListener("vekto:zoom-ended", onZoomEnd);
    };
  }, []);

  const NAV_LINKS =
    lang === "bg"
      ? [
          { label: "Портфолио", href: "/portfolio" },
          { label: "Резултати", href: "/case-studies" },
          { label: "Анкета", href: "/start" },
        ]
      : [
          { label: "Portfolio", href: "/portfolio" },
          { label: "Case Studies", href: "/case-studies" },
          { label: "Brief", href: "/start" },
        ];

  const ctaLabel = lang === "bg" ? "Опиши проекта си" : "Describe your project";
  const fontClasses = [
    pixelMono.variable,
    displayLat.variable,
    displayCyr.variable,
  ].join(" ");

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-50 ${fontClasses}`}
        style={{
          background: headerSolid ? "rgba(13,13,13,0.94)" : "transparent",
          borderBottom: headerSolid
            ? "1px solid rgba(244,244,244,0.18)"
            : "1px solid transparent",
          backdropFilter: headerSolid ? "blur(8px)" : undefined,
          transform: hidden ? "translateY(-110%)" : "none",
          transition:
            "background-color 300ms ease, border-color 300ms ease, transform 300ms ease",
          fontFamily: DISPLAY_STACK,
        }}
      >
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center gap-x-5 md:gap-x-7">
          <Link
            href="/"
            aria-label="VEKTO"
            className="h-8 md:h-11 w-[112px] md:w-[180px] shrink-0 mr-auto"
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
          <nav
            aria-label={lang === "bg" ? "Основна навигация" : "Main navigation"}
            className="hidden md:contents"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hidden md:inline text-sm font-bold uppercase tracking-[0.2em] opacity-95 hover:opacity-100 transition-opacity"
                style={{
                  color: "#f4f4f4",
                  textShadow:
                    "0 0 1px #0d0d0d, 0 0 3px rgba(13,13,13,0.9), 0 1px 6px rgba(13,13,13,0.55)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setLang(lang === "bg" ? "en" : "bg")}
            className="px-2.5 md:px-3 py-2 font-bold uppercase text-xs tracking-[0.25em] shrink-0 transition-colors text-[#f4f4f4] hover:bg-white hover:text-black"
            style={{
              background: "transparent",
              border: "1.5px solid rgba(244,244,244,0.75)",
              textShadow: "0 0 1px #0d0d0d, 0 0 3px rgba(13,13,13,0.9)",
              filter: "drop-shadow(0 0 1px rgba(13,13,13,0.7))",
            }}
            aria-label={
              lang === "bg" ? "Switch to English" : "Превключи на български"
            }
          >
            {lang === "bg" ? "EN" : "БГ"}
          </button>
          <Link
            href={ctaHref}
            className="hidden sm:inline-flex items-center gap-2 px-3 md:px-4 py-2 uppercase text-[12px] md:text-[13px] tracking-[0.2em] font-black transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 shrink-0"
            style={{
              background: "#f4f4f4",
              color: "#0d0d0d",
              boxShadow: "3px 3px 0 0 #3a3a3a",
            }}
          >
            <span aria-hidden>→</span>
            <span>{ctaLabel}</span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={lang === "bg" ? "Меню" : "Menu"}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] shrink-0"
            style={{ border: "1.5px solid rgba(244,244,244,0.75)" }}
          >
            <span className="block w-4 h-[2px]" style={{ background: "#f4f4f4" }} />
            <span className="block w-4 h-[2px]" style={{ background: "#f4f4f4" }} />
            <span className="block w-4 h-[2px]" style={{ background: "#f4f4f4" }} />
          </button>
        </div>
      </div>

      {/* Spacer keeps in-flow content clear of the fixed bar on pages that
          start at the top edge (solid mode only — hero pages run under it). */}
      {solid && <div aria-hidden className="h-[56px] md:h-[76px]" />}

      {/* ============= MOBILE MENU OVERLAY ============= */}
      {menuOpen && (
        <div
          className={`fixed inset-0 z-[120] flex flex-col md:hidden ${fontClasses}`}
          style={{ background: "rgba(13,13,13,0.97)", fontFamily: DISPLAY_STACK }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid rgba(244,244,244,0.18)" }}
          >
            <span
              className="text-xs font-bold uppercase tracking-[0.35em] opacity-60"
              style={{ fontFamily: PIXEL_STACK, color: "#f4f4f4" }}
            >
              VEKTO
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={lang === "bg" ? "Затвори" : "Close"}
              className="w-9 h-9 font-black text-xl leading-none"
              style={{ border: "1.5px solid rgba(244,244,244,0.75)", color: "#f4f4f4" }}
            >
              ×
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center gap-7 px-8">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-black uppercase tracking-tight text-4xl"
                style={{ color: "#f4f4f4" }}
              >
                <span
                  className="text-sm align-middle mr-4 opacity-40"
                  style={{ fontFamily: PIXEL_STACK }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="px-8 pb-10">
            <Link
              href={ctaHref}
              onClick={() => setMenuOpen(false)}
              className="block w-full py-4 text-center font-black uppercase text-base tracking-[0.12em]"
              style={{
                background: "#f4f4f4",
                color: "#0d0d0d",
                boxShadow: "5px 5px 0 0 #3a3a3a",
              }}
            >
              → {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
