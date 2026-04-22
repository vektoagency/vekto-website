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

  const startZoom = () => {
    setZoomedIn(true);
    // Camera drives into the screen, phosphor grows to fill the viewport.
    // Overlay content fades in once the camera has saturated the canvas.
    setTimeout(() => setOverlayOpen(true), 620);
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
      {/* Opaque backdrop pinned behind the canvas during zoom — hides hero
          text from bleeding through transparent canvas regions or the
          translucent overlay layers above. */}
      {zoomedIn && (
        <div
          aria-hidden
          className="fixed inset-0 z-[54] pointer-events-none bg-[#050804]"
          style={{ animation: "poBackdropFade 220ms ease-out both" }}
        />
      )}

      <div className={zoomedIn ? "fixed inset-0 z-[55]" : "absolute inset-0"}>
        <MacintoshScene zoomedIn={zoomedIn} onScreenClick={handleScreenClick} />
      </div>
      <PortfolioOverlay open={overlayOpen} onClose={handleOverlayClose} />
    </>
  );
}
