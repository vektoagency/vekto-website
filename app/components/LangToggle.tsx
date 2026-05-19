"use client";

import { useLang } from "../i18n/LangProvider";

export default function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "bg" ? "en" : "bg")}
      aria-label="Toggle language"
      className={`font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#c8ff00]/85 hover:text-[#c8ff00] transition-colors ${className}`}
    >
      {lang === "bg" ? "EN" : "БГ"}
    </button>
  );
}
