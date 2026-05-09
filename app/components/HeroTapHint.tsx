"use client";

import { useEffect, useState } from "react";

/**
 * Mobile-only "Tap the screen to open our reel" pill.
 * Stays hidden until the 3D Mac is mounted (HeroPravec dispatches
 * `vekto:hero-ready`), then reveals with a soft fade-in. Also fades
 * out during the zoom-in animation so it doesn't overlap the camera
 * cinemagraph.
 */
export default function HeroTapHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onReady = () => setShow(true);
    const onZoomStart = () => setShow(false);
    const onZoomEnd = () => setShow(true);
    window.addEventListener("vekto:hero-ready", onReady);
    window.addEventListener("vekto:zoom-started", onZoomStart);
    window.addEventListener("vekto:zoom-ended", onZoomEnd);
    return () => {
      window.removeEventListener("vekto:hero-ready", onReady);
      window.removeEventListener("vekto:zoom-started", onZoomStart);
      window.removeEventListener("vekto:zoom-ended", onZoomEnd);
    };
  }, []);

  return (
    <div
      className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-[#c8ff00]/40 bg-black/55 backdrop-blur-sm hero-tap-hint transition-opacity duration-700"
      style={{
        opacity: show ? 1 : 0,
        boxShadow: "0 0 18px -2px rgba(200,255,0,0.35)",
      }}
    >
      <span aria-hidden className="hero-tap-arrow text-[#c8ff00] text-[13px] leading-none">↑</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c8ff00]">
        Tap the screen to open our reel
      </span>
    </div>
  );
}
