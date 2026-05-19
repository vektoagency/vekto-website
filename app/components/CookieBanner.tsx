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
      className="fixed bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-1rem)] max-w-[440px] animate-[cookieSlide_0.45s_ease-out_both]"
    >
      <div
        className="flex items-center gap-2.5 bg-[#0d0d0d] border border-[#c8ff00]/25 rounded-lg px-3 py-2"
        style={{
          boxShadow:
            "0 10px 30px -8px rgba(0,0,0,0.85), 0 0 0 1px rgba(200,255,0,0.1)",
        }}
      >
        <span aria-hidden className="text-[14px] leading-none shrink-0">🍪</span>
        <p className="flex-1 text-[11px] md:text-[12px] text-[#cfcbc4] leading-tight">
          {t.body}{" "}
          <Link
            href="/privacy"
            className="text-[#c8ff00]/70 hover:text-[#c8ff00] underline-offset-2 hover:underline"
          >
            {t.learn}
          </Link>
        </p>
        <button
          onClick={() => handle("accepted")}
          className="shrink-0 bg-[#c8ff00] text-black font-semibold text-[10px] md:text-[11px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-md hover:bg-[#d4ff33] transition-colors"
        >
          {t.accept}
        </button>
        <button
          onClick={() => handle("rejected")}
          className="shrink-0 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.12em] text-[#555] hover:text-[#888] transition-colors"
          aria-label={t.reject}
        >
          {t.reject}
        </button>
      </div>

      <style jsx>{`
        @keyframes cookieSlide {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
