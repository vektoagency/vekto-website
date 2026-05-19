"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "bg" | "en";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {} });

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
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // After hydration, prefer the client-side cookie if it disagrees with
  // SSR (handles cases where the cookie was set by the middleware on the
  // same request — SSR will see the new value next time, but until then
  // we keep state in sync without a flicker).
  useEffect(() => {
    const c = readCookie();
    if (c && c !== lang) setLangState(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = useCallback((l: Lang) => {
    writeCookie(l);
    setLangState(l);
    // Sync <html lang> for accessibility
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  }, []);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
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
