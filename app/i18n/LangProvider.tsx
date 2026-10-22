"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/** The site's languages. English is the default everywhere; German and
 *  Bulgarian are one pick away in the header's language menu. */
export type Lang = "bg" | "en" | "de";
/** Kept as an alias for code written while German lived only on /brief. */
export type AnyLang = Lang;

type Ctx = {
  lang: Lang;
  fullLang: AnyLang;
  setLang: (l: AnyLang) => void;
  /** True on routes that lock the language — consumers hide the toggle. */
  pinned: boolean;
};

const LangContext = createContext<Ctx>({ lang: "en", fullLang: "en", setLang: () => {}, pinned: false });

export function useLang() {
  return useContext(LangContext);
}

const COOKIE_KEY = "vekto-lang3";

function readCookie(): AnyLang | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)vekto-lang3=(bg|en|de)/);
  return (m?.[1] as AnyLang) ?? null;
}

function writeCookie(lang: AnyLang) {
  if (typeof document === "undefined") return;
  // A session cookie on purpose: every new visit opens in English, wherever
  // the visitor is. A pick from the language menu holds only until the
  // browser closes. (The old one-year vekto-lang2 cookie is ignored.)
  document.cookie = `${COOKIE_KEY}=${lang}; path=/; samesite=lax`;
}

export function LangProvider({
  initialLang,
  pin = false,
  children,
}: {
  initialLang: AnyLang;
  /**
   * Locks the language to `initialLang` for this render tree. Used on
   * English-only routes (/hospitality), where the middleware pins the
   * language for a reader who will never want the Bulgarian copy. While
   * pinned we skip the cookie sync and ignore setLang, so the visitor's own
   * saved preference is neither read nor overwritten here.
   */
  pin?: boolean;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<AnyLang>(initialLang);

  // After hydration, prefer the client-side cookie if it disagrees with
  // SSR (handles cases where the cookie was set by the middleware on the
  // same request — SSR will see the new value next time, but until then
  // we keep state in sync without a flicker).
  useEffect(() => {
    if (pin) return;
    const c = readCookie();
    if (c && c !== lang) setLangState(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  const setLang = useCallback(
    (l: AnyLang) => {
      if (pin) return;
      writeCookie(l);
      setLangState(l);
      // Sync <html lang> for accessibility
      if (typeof document !== "undefined") {
        document.documentElement.lang = l;
      }
    },
    [pin]
  );

  return (
    <LangContext.Provider value={{ lang, fullLang: lang, setLang, pinned: pin }}>
      {children}
    </LangContext.Provider>
  );
}

/**
 * Convenience helper for components that hold their dict inline.
 * Usage:
 *   const copy = useT({ bg: {...}, en: {...} });
 */
export function useT<T>(dict: { bg: T; en: T; de?: T }): T {
  const { fullLang: lang } = useLang();
  // German exists only on the brief; any component without German copy
  // falls back to English there.
  return (lang === "de" ? dict.de : dict[lang]) ?? dict.en;
}
