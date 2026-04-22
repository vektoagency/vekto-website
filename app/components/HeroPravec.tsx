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
  const [flash, setFlash] = useState(false);

  const handleScreenClick = () => {
    if (zoomedIn) return;
    setZoomedIn(true);
    // Phase 1: camera charges into the screen (~600ms at lerp 0.14).
    // Phase 2: at peak fill, trigger a brief phosphor flash that masks the
    // handoff from canvas → DOM.
    // Phase 3: overlay fades in over matching phosphor colors.
    setTimeout(() => setFlash(true), 580);
    setTimeout(() => setOverlayOpen(true), 640);
    setTimeout(() => setFlash(false), 1100);
  };

  const handleOverlayClose = () => {
    setOverlayOpen(false);
    setTimeout(() => setZoomedIn(false), 420);
  };

  // Safety: clear body overflow if anything crashes mid-transition
  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  return (
    <div className="absolute inset-0">
      <MacintoshScene zoomedIn={zoomedIn} onScreenClick={handleScreenClick} />
      {/* Phosphor flash masks the visual seam between 3D canvas and DOM overlay */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[75] transition-opacity duration-[420ms] ${flash ? "opacity-100" : "opacity-0"}`}
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(232,255,120,0.9) 0%, rgba(200,255,0,0.65) 18%, rgba(80,110,20,0.35) 45%, rgba(6,10,2,0) 80%)",
          mixBlendMode: "screen",
        }}
      />
      <PortfolioOverlay open={overlayOpen} onClose={handleOverlayClose} />
    </div>
  );
}
