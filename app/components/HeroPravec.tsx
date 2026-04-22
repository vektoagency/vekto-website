"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
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

  const handleScreenClick = () => {
    if (zoomedIn) return;
    setZoomedIn(true);
    // Camera drives into the screen; once CRT content fills the viewport,
    // expand the portfolio overlay from the same origin. No route change.
    setTimeout(() => setOverlayOpen(true), 520);
  };

  const handleOverlayClose = () => {
    setOverlayOpen(false);
    setZoomedIn(false);
  };

  return (
    <div className="absolute inset-0">
      <MacintoshScene zoomedIn={zoomedIn} onScreenClick={handleScreenClick} />
      <PortfolioOverlay open={overlayOpen} onClose={handleOverlayClose} />
    </div>
  );
}
