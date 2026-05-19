"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useT } from "../i18n/LangProvider";
import LangToggle from "./LangToggle";

const PHONE = "+359882251474";
const PHONE_DISPLAY = "+359 88 225 1474";

type NavLink =
  | { label: string; href: string; action?: undefined }
  | { label: string; action: "portfolio"; href?: undefined };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useT({
    bg: { services: "Услуги", why: "Защо VEKTO", portfolio: "Портфолио", contact: "Контакт", cta: "Започни", callAria: "Обади се" },
    en: { services: "Services", why: "Why VEKTO", portfolio: "Portfolio", contact: "Contact", cta: "Get Started", callAria: "Call us" },
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide the Navbar while the portfolio overlay is open — its po-dim
  // background is semi-transparent, so the Navbar would otherwise bleed
  // through and collide visually with the overlay's sticky header.
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

  const links: NavLink[] = [
    { label: t.services, href: "#services" },
    { label: t.why, href: "#why" },
    { label: t.portfolio, action: "portfolio" },
    { label: t.contact, href: "#contact" },
  ];

  const handlePortfolio = () => {
    setMenuOpen(false);
    if (pathname === "/") {
      window.dispatchEvent(new Event("vekto:open-portfolio"));
    } else {
      router.push("/work");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#080808]/95 backdrop-blur border-b border-[#1e1e1c]" : "bg-transparent"
      } ${hidden ? "opacity-0 pointer-events-none -translate-y-2" : "opacity-100"}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center h-10 w-[120px]">
          <Image src="/images/logo.webp" alt="VEKTO" width={120} height={40} className="object-contain" priority />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            l.action === "portfolio" ? (
              <button
                key="portfolio"
                onClick={handlePortfolio}
                className="text-sm text-white/85 hover:text-white transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/85 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            )
          )}
        </nav>

        {/* Right cluster — call, lang toggle, primary CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`tel:${PHONE}`}
            aria-label={t.callAria}
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-white/85 hover:text-[#c8ff00] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />
            </svg>
            <span className="tabular-nums">{PHONE_DISPLAY}</span>
          </a>
          <LangToggle />
          <a
            href="/start"
            className="inline-flex items-center gap-2 bg-[#c8ff00] text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#d4ff33] transition-colors"
          >
            {t.cta}
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111110] border-t border-[#1e1e1c] px-6 py-4 flex flex-col gap-4">
          {links.map((l) =>
            l.action === "portfolio" ? (
              <button
                key="portfolio"
                onClick={handlePortfolio}
                className="text-left text-white/85 hover:text-white transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ) : (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/85 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            )
          )}
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.14em] text-white/85"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />
            </svg>
            {PHONE_DISPLAY}
          </a>
          <div className="flex items-center justify-between gap-3 pt-1">
            <LangToggle />
            <a
              href="/start"
              onClick={() => setMenuOpen(false)}
              className="bg-[#c8ff00] text-black font-semibold px-5 py-2.5 rounded-full text-center hover:bg-[#d4ff33] transition-colors flex-1"
            >
              {t.cta}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
