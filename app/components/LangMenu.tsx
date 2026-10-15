"use client";

// The language menu: EN first (the site's default), then DE and BG.
// Drawn in the site's own style (square outline button, jet panel with a
// hard offset shadow, mono labels) instead of the browser's native list.
// Hidden on routes that pin the language (/hospitality). Colours live in
// classes so hover fills win over the resting ground.
import { useEffect, useRef, useState } from "react";
import { useLang, type Lang } from "../i18n/LangProvider";

const OPTIONS: { id: Lang; short: string; name: string }[] = [
  { id: "en", short: "EN", name: "English" },
  { id: "de", short: "DE", name: "Deutsch" },
  { id: "bg", short: "БГ", name: "Български" },
];

const MONO = "var(--f-pixel), ui-monospace, monospace";

export default function LangMenu({ className = "" }: { className?: string }) {
  const { fullLang, setLang, pinned } = useLang();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  // Close on a click outside or on Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (pinned) return null;
  const current = OPTIONS.find((o) => o.id === fullLang) ?? OPTIONS[0];

  return (
    <div ref={wrap} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.name}`}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-2.5 md:px-3 py-2 font-bold uppercase text-xs tracking-[0.25em] border-[1.5px] transition-colors ${
          open
            ? "bg-[#f4f4f4] text-[#0d0d0d] border-[#f4f4f4]"
            : "bg-transparent text-[#f4f4f4] border-[#f4f4f4]/75 hover:bg-white hover:text-black"
        }`}
        style={{ fontFamily: MONO }}
      >
        {current.short}
        <span aria-hidden className={`text-[8px] transition-transform ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-[calc(100%+6px)] z-[200] min-w-[150px] border-[1.5px] border-[#f4f4f4]/75 bg-[#0d0d0d] py-1"
          style={{ boxShadow: "4px 4px 0 0 #3a3a3a" }}
        >
          {OPTIONS.map((o) => {
            const active = o.id === current.id;
            return (
              <li key={o.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    setLang(o.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-4 px-3 py-2.5 text-left transition-colors ${
                    active ? "text-[#f4f4f4]" : "text-[#f4f4f4]/70 hover:bg-white hover:text-black"
                  }`}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-bold uppercase text-xs tracking-[0.25em] w-6" style={{ fontFamily: MONO }}>
                      {o.short}
                    </span>
                    <span className="text-[13px] font-medium normal-case tracking-normal">{o.name}</span>
                  </span>
                  {active && (
                    <span aria-hidden className="w-[7px] h-[7px] rotate-45 bg-[#f4f4f4] shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
