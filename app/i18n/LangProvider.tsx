"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "bg" | "en";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** True on routes that lock the language — consumers hide the toggle. */
  pinned: boolean;
};

const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {}, pinned: false });

export function useLang() {
  return useContext(LangContext);
}

const COOKIE_KEY = "vekto-lang";

function readCookie(): Lang | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)vekto-lang=(bg|en)/);
  return (m?.[1] as Lang) ?? null;
}

function writeCookie(lang: Lang) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_KEY}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export function LangProvider({
  initialLang,
  pin = false,
  children,
}: {
  initialLang: Lang;
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
  const [lang, setLangState] = useState<Lang>(initialLang);

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
    (l: Lang) => {
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
    <LangContext.Provider value={{ lang, setLang, pinned: pin }}>{children}</LangContext.Provider>
  );
}

/**
 * Convenience helper for components that hold their dict inline.
 * Usage:
 *   const copy = useT({ bg: {...}, en: {...} });
 */
export function useT<T>(dict: { bg: T; en: T }): T {
  const { lang } = useLang();
  return dict[lang];
}
