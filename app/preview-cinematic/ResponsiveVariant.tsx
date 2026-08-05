"use client";

// The film journey is a desktop experience: on phones the 16:9 shot never
// carried the composition (even the 9:16 re-crop fought the framing), so
// below md the page IS the brutalism funnel — the design already tuned for
// small screens — and the film runs from md up. Decided on the client from
// one media query; until it resolves we hold a jet screen for a frame
// rather than mounting the wrong variant (the film preloads ~400 frames —
// mounting it on a phone just to swap it out would burn the visitor's data).

import { useEffect, useState } from "react";

export default function ResponsiveVariant({
  film,
  brutalism,
}: {
  film: React.ReactNode;
  brutalism: React.ReactNode;
}) {
  const [mobile, setMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  if (mobile === null) {
    return <div aria-hidden style={{ minHeight: "100dvh", background: "#0d0d0d" }} />;
  }
  return <>{mobile ? brutalism : film}</>;
}
