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
  window.dispatchEvent(new CustomEvent("vekto:consent-changed", { detail: v }));
}

/**
 * Minimal cookie consent — compact pill at bottom-right.
 * GDPR-compliant: explicit Accept + reject option (as a small text link
 * so the visual hierarchy nudges accept without breaking opt-out access).
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const t = useT({
    bg: {
      body: "Използваме бисквитки за по-добро изживяване.",
      accept: "Приеми",
      reject: "Откажи",
      learn: "Научи повече",
    },
    en: {
      body: "We use cookies for a better experience.",
      accept: "Accept",
      reject: "Decline",
      learn: "Learn more",
    },
  });

  useEffect(() => {
    if (getConsent() === null) {
      // Slight delay so the banner doesn't fight the hero animation on load
      const id = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(id);
    }
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
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-[340px] z-[1000] animate-[cookieSlide_0.45s_ease-out_both]"
    >
      <div
        className="flex items-center gap-3 bg-[#0d0d0d] border border-[#c8ff00]/30 rounded-full pl-4 pr-1.5 py-1.5 shadow-xl"
        style={{
          boxShadow: "0 12px 36px -8px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,255,0,0.12)",
        }}
      >
        <span aria-hidden className="text-[15px] shrink-0">🍪</span>
        <p className="flex-1 text-[12px] md:text-[13px] text-[#cfcbc4] leading-tight">
          {t.body}{" "}
          <Link href="/privacy" className="text-[#c8ff00]/80 hover:text-[#c8ff00] underline-offset-2 hover:underline">
            {t.learn}
          </Link>
        </p>
        <button
          onClick={() => handle("accepted")}
          className="shrink-0 bg-[#c8ff00] text-black font-semibold text-[11px] md:text-xs uppercase tracking-[0.12em] px-4 py-2 rounded-full hover:bg-[#d4ff33] transition-colors"
          style={{ boxShadow: "0 0 14px rgba(200,255,0,0.4)" }}
        >
          {t.accept}
        </button>
      </div>
      {/* Reject — much smaller, neutral. Still accessible (GDPR) but
          visually subordinate so default behaviour favours Accept. */}
      <button
        onClick={() => handle("rejected")}
        className="block ml-auto mr-3 mt-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#666] hover:text-[#9a958e] transition-colors"
      >
        {t.reject}
      </button>

      <style jsx>{`
        @keyframes cookieSlide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
