"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import PortfolioOverlay from "./PortfolioOverlay";

const MacintoshScene = dynamic(() => import("./three/MacintoshScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5a5048] animate-pulse">
        Booting…
      </div>
    </div>
  ),
});

export default function HeroPravec() {
  const [zoomedIn, setZoomedIn] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const handleScreenClick = () => {
    if (zoomedIn) return;
    setZoomedIn(true);
    // Phase 1 (~0–520ms) — camera drives deep into the screen; phosphor
    // grows to fill the visible right-half of the viewport.
    // Phase 2 (~520ms) — promote the canvas container to fixed fullscreen
    // so the shader becomes the true page background across the whole screen.
    // Phase 3 (~700ms) — mount the overlay; its content fades in on top of
    // the living shader. No circles, no color shift.
    setTimeout(() => setFullscreen(true), 520);
    setTimeout(() => setOverlayOpen(true), 720);
  };

  const handleOverlayClose = () => {
    setOverlayOpen(false);
    // Reverse the chain so the shader recedes back to the Mac bezel
    setTimeout(() => setFullscreen(false), 380);
    setTimeout(() => setZoomedIn(false), 420);
  };

  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  // Global trigger — "See Our Work" button dispatches this
  useEffect(() => {
    const onTrigger = () => handleScreenClick();
    window.addEventListener("vekto:open-portfolio", onTrigger);
    return () => window.removeEventListener("vekto:open-portfolio", onTrigger);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomedIn]);

  return (
    <>
      <div
        className={
          fullscreen
            ? "fixed inset-0 z-[60] transition-[inset] duration-500"
            : "absolute inset-0"
        }
      >
        <MacintoshScene zoomedIn={zoomedIn} onScreenClick={handleScreenClick} />
      </div>
      <PortfolioOverlay open={overlayOpen} onClose={handleOverlayClose} />
    </>
  );
}
