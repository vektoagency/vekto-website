"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "../i18n/LangProvider";

const CONSENT_KEY = "vekto-cookie-consent";

export type ConsentValue = "accepted" | "rejected" | null;

/**
 * Returns the current cookie consent value (client-side only).
 * Other components — e.g. MetaPixel — should call this to decide
 * whether to fire tracking events.
 */
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
    // ignore quota / disabled storage
  }
  // Notify peers (e.g. MetaPixel listener) that consent state changed
  window.dispatchEvent(new CustomEvent("vekto:consent-changed", { detail: v }));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const t = useT({
    bg: {
      title: "Бисквитки",
      body: "Използваме бисквитки за работа на сайта и за измерване на ефективността на рекламите ни. Можеш да приемеш всички или само необходимите.",
      accept: "Приеми всички",
      reject: "Само необходимите",
      privacy: "Поверителност",
      terms: "Условия",
    },
    en: {
      title: "Cookies",
      body: "We use cookies for site functionality and to measure our ad performance. You can accept all or only necessary cookies.",
      accept: "Accept all",
      reject: "Only necessary",
      privacy: "Privacy",
      terms: "Terms",
    },
  });

  useEffect(() => {
    // Show only if user hasn't made a choice yet.
    if (getConsent() === null) setVisible(true);
  }, []);

  const handle = (v: "accepted" | "rejected") => {
    setConsent(v);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 md:inset-x-auto md:right-4 md:bottom-4 md:max-w-md z-[1000] bg-[#0d0d0d] border border-[#c8ff00]/30 rounded-lg shadow-2xl p-4 md:p-5"
      style={{ boxShadow: "0 20px 60px -10px rgba(0,0,0,0.9), 0 0 0 1px rgba(200,255,0,0.15)" }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span aria-hidden className="text-xl leading-none">🍪</span>
        <h3 className="font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-[#c8ff00] flex-1 pt-1">
          {t.title}
        </h3>
      </div>
      <p className="text-[13px] md:text-sm text-[#cfcbc4] leading-relaxed mb-4">
        {t.body}{" "}
        <Link href="/privacy" className="text-[#c8ff00] hover:underline">
          {t.privacy}
        </Link>{" "}
        ·{" "}
        <Link href="/terms" className="text-[#c8ff00] hover:underline">
          {t.terms}
        </Link>
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => handle("accepted")}
          className="flex-1 bg-[#c8ff00] text-black font-semibold px-4 py-2.5 rounded-full hover:bg-[#d4ff33] transition-colors text-sm"
        >
          {t.accept}
        </button>
        <button
          onClick={() => handle("rejected")}
          className="flex-1 border border-[#1e1e1c] text-[#9a958e] hover:text-white hover:border-[#333] font-mono uppercase tracking-[0.2em] text-[10px] md:text-[11px] px-4 py-2.5 rounded-full transition-colors"
        >
          {t.reject}
        </button>
      </div>
    </div>
  );
}
