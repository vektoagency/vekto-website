"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "../i18n/LangProvider";

const CONSENT_KEY = "vekto-cookie-consent";
const AUTO_ACCEPT_AFTER_MS = 8000;

export type ConsentValue = "accepted" | "rejected" | null;

export function getConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

function setConsent(v: "accepted" | "rejected") {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("vekto:consent-changed", { detail: v }));
}

/**
 * Slim horizontal cookie consent toast — bottom-centre, single row.
 * Auto-accepts after 8s if the user ignores.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const t = useT({
    bg: {
      body: "Бисквитки за по-добро изживяване.",
      accept: "Приеми",
      reject: "Откажи",
      learn: "Научи повече",
    },
    en: {
      body: "Cookies for a better experience.",
      accept: "Accept",
      reject: "Decline",
      learn: "Learn more",
    },
  });

  useEffect(() => {
    if (getConsent() !== null) return;
    const id = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (getConsent() !== null) return;
    const id = setTimeout(() => {
      setConsent("accepted");
      setVisible(false);
    }, AUTO_ACCEPT_AFTER_MS);
    return () => clearTimeout(id);
  }, [visible]);

  const handle = (v: "accepted" | "rejected") => {
    setConsent(v);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-1rem)] max-w-[440px] animate-[cookieFade_0.4s_ease-out_both]"
    >
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5 bg-[#0d0d0d] border border-[#c8ff00]/25 rounded-lg px-3 py-2.5"
        style={{
          boxShadow:
            "0 10px 30px -8px rgba(0,0,0,0.85), 0 0 0 1px rgba(200,255,0,0.1)",
        }}
      >
        {/* Body row: emoji + text wraps cleanly without competing with
            the button row on narrow mobile widths. */}
        <div className="flex items-start sm:items-center gap-2 flex-1">
          <span aria-hidden className="text-[14px] leading-none shrink-0 mt-0.5 sm:mt-0">
            🍪
          </span>
          <p className="text-[11px] md:text-[12px] text-[#cfcbc4] leading-snug">
            {t.body}{" "}
            <Link
              href="/privacy"
              className="text-[#c8ff00]/70 hover:text-[#c8ff00] underline-offset-2 hover:underline"
            >
              {t.learn}
            </Link>
          </p>
        </div>
        {/* Button row: right-aligned on mobile (its own line), inline on sm+ */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={() => handle("rejected")}
            className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.12em] text-[#666] hover:text-[#aaa] transition-colors px-2 py-1"
            aria-label={t.reject}
          >
            {t.reject}
          </button>
          <button
            onClick={() => handle("accepted")}
            className="bg-[#c8ff00] text-black font-semibold text-[10px] md:text-[11px] uppercase tracking-[0.1em] px-3.5 py-1.5 rounded-md hover:bg-[#d4ff33] transition-colors whitespace-nowrap"
          >
            {t.accept}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes cookieFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
