"use client";

import Image from "next/image";
import { useT } from "../i18n/LangProvider";

const PHONE = "+359882251474";
const PHONE_DISPLAY = "+359 88 225 1474";

export default function Footer() {
  const year = new Date().getFullYear();
  const t = useT({
    bg: {
      tagline: "AI-Driven визия за бъдещето на компаниите. Cinematic storytelling и AI-powered short-form системи за scale.",
      based: "От България · Работим в цял свят",
      explore: "Изследвай",
      exploreLinks: [
        { label: "Услуги", href: "#services" },
        { label: "Защо VEKTO", href: "#why" },
        { label: "Нашата работа", href: "#work" },
        { label: "Процес", href: "#process" },
      ],
      contactH: "Свържи се",
      startProject: "Започни проект",
      callUs: "Обади се",
      bookCall: "Резервирай безплатен call",
      rights: "Всички права запазени.",
    },
    en: {
      tagline: "AI-Driven Vision for the Future of Companies. Cinematic storytelling and AI-powered short-form systems built to scale.",
      based: "Based in Bulgaria · Working worldwide",
      explore: "Explore",
      exploreLinks: [
        { label: "Services", href: "#services" },
        { label: "Why VEKTO", href: "#why" },
        { label: "Our Work", href: "#work" },
        { label: "Process", href: "#process" },
      ],
      contactH: "Get in Touch",
      startProject: "Start a project",
      callUs: "Call us",
      bookCall: "Book a free call",
      rights: "All rights reserved.",
    },
  });

  return (
    <footer className="border-t border-[#1e1e1c] py-14 px-6" style={{ background: "#060606" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-12 mb-10">
          {/* Brand */}
          <div>
            <Image src="/images/logo.webp" alt="VEKTO" width={110} height={36} className="object-contain mb-4" />
            <p className="text-sm text-[#9a958e] leading-relaxed max-w-sm mb-5">{t.tagline}</p>
            <div className="flex items-center gap-2 text-xs text-[#666]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
              {t.based}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs text-[#4a4540] uppercase tracking-widest mb-4">{t.explore}</h4>
            <ul className="space-y-2.5 text-sm text-[#9a958e]">
              {t.exploreLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h4 className="text-xs text-[#4a4540] uppercase tracking-widest mb-4">{t.contactH}</h4>
            <ul className="space-y-2.5 text-sm text-[#9a958e] mb-5">
              <li>
                <a href="/start" className="hover:text-white transition-colors">
                  {t.startProject}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  <span className="tabular-nums">{PHONE_DISPLAY}</span>
                </a>
              </li>
            </ul>
            <a
              href="/start"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#c8ff00] hover:text-white transition-colors"
            >
              {t.bookCall}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1e1e1c] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#4a4540]">© {year} VEKTO. {t.rights}</p>
          <p className="text-xs text-[#4a4540]">vektoagency.com</p>
        </div>
      </div>
    </footer>
  );
}
