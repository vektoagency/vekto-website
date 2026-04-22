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

  const handleScreenClick = () => {
    if (zoomedIn) return;
    setZoomedIn(true);
    // Camera drives into the screen (~500ms at lerp 0.14). The
    // PortfolioOverlay then crossfades in — its phosphor background and
    // scanlines fade in everywhere uniformly via pure opacity. No DOM
    // expansion, no side bias.
    setTimeout(() => setOverlayOpen(true), 500);
  };

  const handleOverlayClose = () => {
    setOverlayOpen(false);
    setTimeout(() => setZoomedIn(false), 420);
  };

  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  useEffect(() => {
    const onTrigger = () => handleScreenClick();
    window.addEventListener("vekto:open-portfolio", onTrigger);
    return () => window.removeEventListener("vekto:open-portfolio", onTrigger);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomedIn]);

  return (
    <>
      <div className="absolute inset-0">
        <MacintoshScene zoomedIn={zoomedIn} onScreenClick={handleScreenClick} />
      </div>
      <PortfolioOverlay open={overlayOpen} onClose={handleOverlayClose} />
    </>
  );
}
