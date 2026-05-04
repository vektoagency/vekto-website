"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MacintoshScene from "./three/MacintoshScene";
import HeroBootLoader from "./HeroBootLoader";

// Lazy-load the overlay only when needed — keeps the initial bundle lean.
const PortfolioOverlay = dynamic(() => import("./PortfolioOverlay"), { ssr: false });

export default function HeroPravec({ mobile = false }: { mobile?: boolean } = {}) {
  const [zoomedIn, setZoomedIn] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  // Gate WebGL mount until after hydrate — Canvas needs window/document.
  const [mounted, setMounted] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  useEffect(() => setMounted(true), []);

  // The portfolio overlay fires these when a lightbox opens/closes —
  // we pause the WebGL loop while a video is playing so all GPU goes
  // to the Bunny iframe.
  useEffect(() => {
    const onOpen = () => setPlayerOpen(true);
    const onClose = () => setPlayerOpen(false);
    window.addEventListener("vekto:player-open", onOpen);
    window.addEventListener("vekto:player-closed", onClose);
    return () => {
      window.removeEventListener("vekto:player-open", onOpen);
      window.removeEventListener("vekto:player-closed", onClose);
    };
  }, []);

  // Unmount the loader after its fade-out completes.
  useEffect(() => {
    if (!sceneReady) return;
    const t = setTimeout(() => setLoaderGone(true), 600);
    return () => clearTimeout(t);
  }, [sceneReady]);

  const startZoom = () => {
    window.dispatchEvent(new Event("vekto:zoom-started"));
    setZoomedIn(true);
    // Wait for the full camera lerp to settle before revealing the reel wall,
    // so the Mac reads as "fully zoomed in" before the DOM overlay paints over it.
    setTimeout(() => setOverlayOpen(true), 1450);
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
        {mounted && (
          <div
            className="absolute inset-0 transition-opacity ease-out"
            style={{
              opacity: sceneReady ? 1 : 0,
              transitionDuration: "700ms",
              transform: sceneReady ? "scale(1)" : "scale(0.985)",
              transformOrigin: mobile ? "50% 50%" : "74% 50%",
            }}
          >
            <MacintoshScene
              zoomedIn={zoomedIn}
              paused={playerOpen}
              mobile={mobile}
              onScreenClick={handleScreenClick}
              onReady={() => setSceneReady(true)}
            />
          </div>
        )}
        {!loaderGone && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity ease-out"
            style={{
              opacity: sceneReady ? 0 : 1,
              transitionDuration: "500ms",
            }}
          >
            <HeroBootLoader mobile={mobile} />
          </div>
        )}
      </div>
      <PortfolioOverlay open={overlayOpen} onClose={handleOverlayClose} />
    </>
  );
}
