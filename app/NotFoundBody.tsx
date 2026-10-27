"use client";

import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import { useLang } from "./i18n/LangProvider";

// The 404's words. A client component so the page reads the visitor's
// language pick in the browser and the server render stays cacheable.

const SILVER_H =
  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 22%, #8a8a8a 45%, #eaeaea 62%, #c8c8c8 78%, #ffffff 100%)";

const COPY = {
  bg: {
    eyebrow: "404 · ГРЕШЕН АДРЕС",
    h1: "ТУК НЯМА",
    hl: "НИЩО.",
    body: "Адресът не съществува — или страницата вече не е на сайта. Ето откъде да продължиш.",
    home: "Към началото",
    work: "Виж работата",
    start: "Опиши проекта си",
  },
  en: {
    eyebrow: "404 · WRONG ADDRESS",
    h1: "THERE IS",
    hl: "NOTHING HERE.",
    body: "This address does not exist, or the page is no longer on the site. Here is where to go instead.",
    home: "Back to home",
    work: "See the work",
    start: "Describe your project",
  },
  de: {
    eyebrow: "404 · FALSCHE ADRESSE",
    h1: "HIER GIBT ES",
    hl: "NICHTS.",
    body: "Diese Adresse existiert nicht, oder die Seite ist nicht mehr auf der Website. Hier geht es weiter.",
    home: "Zur Startseite",
    work: "Arbeiten ansehen",
    start: "Projekt beschreiben",
  },
} as const;

export default function NotFoundBody({ fontClass }: { fontClass: string }) {
  const { lang } = useLang();
  const t = COPY[lang];

  return (
    <div
      className={fontClass}
      style={
        {
          "--brutal-display":
            "var(--f-display-lat), var(--f-display-cyr), system-ui, sans-serif",
          "--brutal-pixel": "var(--f-pixel), ui-monospace, monospace",
          "--brutal-comic":
            "var(--f-comic-lat), var(--f-comic-cyr), system-ui, sans-serif",
          "--bgk": lang === "bg" ? "0.92" : "1",
        } as React.CSSProperties
      }
    >
      <SiteHeader solid />
      <main
        className="min-h-[68vh] flex items-center"
        style={{
          background: "#0d0d0d",
          color: "#f4f4f4",
          fontFamily: "var(--brutal-display), system-ui, sans-serif",
        }}
      >
        <div className="w-full max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24">
          <p
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] opacity-55 mb-5"
            style={{ fontFamily: "var(--brutal-pixel)" }}
          >
            {t.eyebrow}
          </p>
          <h1
            className="font-black uppercase leading-[0.98] tracking-[-0.03em] mb-5 text-balance"
            style={{ fontSize: "calc(clamp(34px, 7vw, 84px) * var(--bgk, 1))" }}
          >
            {t.h1}{" "}
            <span
              className="italic pr-[0.08em]"
              style={{
                background: SILVER_H,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.hl}
            </span>
          </h1>
          <p
            className="text-[14px] md:text-[16px] leading-relaxed max-w-[520px] mb-9 opacity-70 font-medium"
            style={{ fontFamily: "var(--brutal-comic)" }}
          >
            {t.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[#f4f4f4] text-[#0d0d0d] font-black uppercase tracking-[0.15em] px-7 py-3.5 text-[13px] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform"
              style={{ boxShadow: "4px 4px 0 0 #3a3a3a" }}
            >
              <span aria-hidden>←</span>
              {t.home}
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center gap-2 border-[1.5px] border-[#f4f4f4]/75 text-[#f4f4f4] font-bold uppercase tracking-[0.12em] px-7 py-3.5 text-[12px] hover:bg-white hover:text-black transition-colors"
            >
              ▶ {t.work}
            </Link>
            <Link
              href="/start"
              className="inline-flex items-center justify-center gap-2 border-[1.5px] border-[#f4f4f4]/75 text-[#f4f4f4] font-bold uppercase tracking-[0.12em] px-7 py-3.5 text-[12px] hover:bg-white hover:text-black transition-colors"
            >
              ✎ {t.start}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
