"use client";

import { useLang } from "../i18n/LangProvider";

/**
 * Segment-control style language toggle with a sliding lime pill.
 * Both languages stay visible; the active one is highlighted as the
 * pill animates between them on switch. Reads as a deliberate piece
 * of UI rather than a tiny text link.
 */
export default function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  const isBg = lang === "bg";

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={`relative inline-flex items-center bg-[#0d0d0d] border border-[#1e1e1c] rounded-full p-[3px] ${className}`}
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)" }}
    >
      {/* Sliding lime pill */}
      <span
        aria-hidden
        className="absolute top-[3px] bottom-[3px] w-[38px] rounded-full bg-[#c8ff00] transition-transform duration-300 ease-out"
        style={{
          transform: isBg ? "translateX(0)" : "translateX(38px)",
          boxShadow: "0 0 14px rgba(200,255,0,0.55)",
        }}
      />

      <button
        type="button"
        role="radio"
        aria-checked={isBg}
        onClick={() => setLang("bg")}
        className={`relative z-10 w-[38px] py-1 md:py-1.5 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] transition-colors ${
          isBg ? "text-black font-bold" : "text-[#9a958e] hover:text-white"
        }`}
      >
        БГ
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={!isBg}
        onClick={() => setLang("en")}
        className={`relative z-10 w-[38px] py-1 md:py-1.5 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] transition-colors ${
          !isBg ? "text-black font-bold" : "text-[#9a958e] hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
