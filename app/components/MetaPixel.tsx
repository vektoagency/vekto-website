"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getConsent, type ConsentValue } from "./CookieBanner";

const PIXEL_ID = "2075226313205817";

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
 * Pass `options.eventID` (a UUID) when the same event will also be
 * mirrored via Conversions API server-side — Meta dedupes browser +
 * server fires that share the same event ID within a ~5 min window.
 *
 *   trackEvent("Lead", { value: 2500, currency: "EUR" }, { eventID: id });
 */
export function trackEvent(
  event: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string }
) {
  if (typeof window === "undefined") return;
  if (getConsent() !== "accepted") return;
  if (!window.fbq) return;
  if (options?.eventID) {
    window.fbq("track", event, params, { eventID: options.eventID });
  } else {
    window.fbq("track", event, params);
  }
}

/**
 * Fire a Meta event via BOTH browser pixel and server-side Conversions
 * API in a single call. Generates the shared event ID, runs the browser
 * fire synchronously, and posts to /api/capi in the background (no
 * await — never blocks the user click).
 *
 * Use for Schedule + Contact clicks where we want the full coverage
 * boost on iOS / AdBlock / cookie-rejected users.
 */
export function trackEventBoth(
  event: "Schedule" | "Contact" | "ViewContent",
  params?: { contentName?: string; contentCategory?: string; value?: number; currency?: string }
) {
  if (typeof window === "undefined") return;
  if (getConsent() !== "accepted") return;
  const eventId =
    "randomUUID" in crypto ? crypto.randomUUID() : `${event}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  // Browser fire
  if (window.fbq) {
    window.fbq("track", event, params, { eventID: eventId });
  }
  // Server mirror (fire-and-forget — failure never breaks UX)
  void fetch("/api/capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event,
      eventId,
      sourceUrl: window.location.href,
      customData: params,
    }),
    keepalive: true, // survives page navigation (tel: link, Cal open)
  }).catch(() => {});
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
