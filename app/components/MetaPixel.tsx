"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getConsent, type ConsentValue } from "./CookieBanner";

const PIXEL_ID = "1015468071151075";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * Track a Meta standard or custom event. Used by Lead form submit,
 * Contact button clicks, Calendly bookings, etc. No-ops until the
 * user has explicitly accepted marketing cookies.
 *
 *   trackEvent("Lead", { value: 2500, currency: "EUR" });
 */
export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (getConsent() !== "accepted") return;
  if (window.fbq) window.fbq("track", event, params);
}

/**
 * Site-wide Meta Pixel installer.
 * - Loads the fbq base script only AFTER the user accepts cookies.
 * - Re-fires PageView on every client-side route change.
 * - Listens for `vekto:consent-changed` so the pixel boots immediately
 *   once consent is granted (no full page reload required).
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const [consent, setConsentState] = useState<ConsentValue>(null);

  // Read initial consent + watch for changes
  useEffect(() => {
    setConsentState(getConsent());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<"accepted" | "rejected">).detail;
      setConsentState(detail);
    };
    window.addEventListener("vekto:consent-changed", onChange);
    return () => window.removeEventListener("vekto:consent-changed", onChange);
  }, []);

  // Fire PageView on route change (only if consent given AND fbq loaded)
  useEffect(() => {
    if (consent !== "accepted") return;
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, consent]);

  // Don't even inject the script until the user has accepted.
  if (consent !== "accepted") return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
