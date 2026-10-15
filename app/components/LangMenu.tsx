"use client";

// The language menu: EN first (the site's default), then DE and BG.
// Hidden on routes that pin the language (/hospitality). Colours live in
// classes so the hover fill actually wins over the resting ground.
import { useLang, type Lang } from "../i18n/LangProvider";

export default function LangMenu({ className = "" }: { className?: string }) {
  const { fullLang, setLang, pinned } = useLang();
  if (pinned) return null;
  return (
    <label className={`relative shrink-0 ${className}`}>
      <span className="sr-only">Language</span>
      <select
        value={fullLang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="appearance-none cursor-pointer pl-3 pr-7 py-2 font-bold uppercase text-xs tracking-[0.2em] bg-[#0d0d0d] text-[#f4f4f4] hover:bg-white hover:text-black transition-colors"
        style={{ border: "1.5px solid rgba(244,244,244,0.75)", fontFamily: "var(--f-pixel), ui-monospace, monospace" }}
      >
        <option value="en">EN</option>
        <option value="de">DE</option>
        <option value="bg">БГ</option>
      </select>
      <span aria-hidden className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px]">▼</span>
    </label>
  );
}
