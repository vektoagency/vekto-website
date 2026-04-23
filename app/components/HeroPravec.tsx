"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MacintoshScene from "./three/MacintoshScene";

// Lazy-load the overlay only when needed — keeps the initial bundle lean.
const PortfolioOverlay = dynamic(() => import("./PortfolioOverlay"), { ssr: false });

export default function HeroPravec() {
  const [zoomedIn, setZoomedIn] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  // Gate WebGL mount until after hydrate — Canvas needs window/document.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const startZoom = () => {
    window.dispatchEvent(new Event("vekto:zoom-started"));
    setZoomedIn(true);
    setTimeout(() => setOverlayOpen(true), 820);
  };

  const handleScreenClick = () => {
    if (zoomedIn) return;
    if (typeof window !== "undefined" && window.scrollY > 8) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(startZoom, 340);
    } else {
      startZoom();
    }
  };

  const handleOverlayClose = () => {
    setOverlayOpen(false);
    setTimeout(() => {
      setZoomedIn(false);
      window.dispatchEvent(new Event("vekto:zoom-ended"));
    }, 420);
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
      <div className={zoomedIn ? "fixed inset-0 z-[55]" : "absolute inset-0"}>
        {mounted && <MacintoshScene zoomedIn={zoomedIn} onScreenClick={handleScreenClick} />}
      </div>
      <PortfolioOverlay open={overlayOpen} onClose={handleOverlayClose} />
    </>
  );
}
