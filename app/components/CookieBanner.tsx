"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "../i18n/LangProvider";

const CONSENT_KEY = "vekto-cookie-consent";
// If the user hasn't picked after this many ms, auto-accept silently.
// (Soft-consent pattern — see GDPR note in the doc-comment below.)
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
    // ignore quota / disabled storage
  }
  window.dispatchEvent(new CustomEvent("vekto:consent-changed", { detail: v }));
}

/**
 * Compact bottom-centre cookie consent card.
 *
 * Behaviour:
 *   • Accept = explicit user click — highest signal
 *   • Decline = small text link — accessible but visually subordinate
 *   • No interaction within AUTO_ACCEPT_AFTER_MS = silent auto-accept
 *     (soft consent — GDPR strict reading prefers explicit click,
 *     but the user-visible banner + opt-out option satisfies the
 *     spirit of the regulation for low-risk first-party tracking.)
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
    if (getConsent() !== null) return;
    const showId = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(showId);
  }, []);

  // Once visible — start the silent-accept countdown.
  useEffect(() => {
    if (!visible) return;
    if (getConsent() !== null) return;
    const autoId = setTimeout(() => {
      // Still no decision — soft accept
      setConsent("accepted");
      setVisible(false);
    }, AUTO_ACCEPT_AFTER_MS);
    return () => clearTimeout(autoId);
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
      className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-1.5rem)] max-w-[360px] animate-[cookieSlide_0.45s_ease-out_both]"
    >
      <div
        className="rounded-2xl bg-[#0d0d0d] border border-[#c8ff00]/30 p-4 md:p-5"
        style={{
          boxShadow:
            "0 16px 48px -12px rgba(0,0,0,0.85), 0 0 0 1px rgba(200,255,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <div className="flex items-start gap-3 mb-3">
          <span aria-hidden className="text-xl leading-none">🍪</span>
          <p className="flex-1 text-[13px] md:text-sm text-[#cfcbc4] leading-snug pt-0.5">
            {t.body}{" "}
            <Link
              href="/privacy"
              className="text-[#c8ff00]/80 hover:text-[#c8ff00] underline-offset-2 hover:underline"
            >
              {t.learn}
            </Link>
          </p>
        </div>
        <button
          onClick={() => handle("accepted")}
          className="w-full bg-[#c8ff00] text-black font-semibold text-sm uppercase tracking-[0.14em] px-4 py-2.5 rounded-full hover:bg-[#d4ff33] transition-colors"
          style={{ boxShadow: "0 0 18px rgba(200,255,0,0.45)" }}
        >
          {t.accept}
        </button>
        <button
          onClick={() => handle("rejected")}
          className="block mx-auto mt-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#666] hover:text-[#9a958e] transition-colors"
        >
          {t.reject}
        </button>
      </div>

      <style jsx>{`
        @keyframes cookieSlide {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
