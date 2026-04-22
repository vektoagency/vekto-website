"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";
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

const EXPAND_MS = 780;

export default function HeroPravec() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [zoomedIn, setZoomedIn] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [rectStyle, setRectStyle] = useState<CSSProperties | undefined>(undefined);

  const startZoom = () => {
    const el = wrapRef.current;
    if (!el) {
      setZoomedIn(true);
      setTimeout(() => setOverlayOpen(true), EXPAND_MS + 100);
      return;
    }
    // Snapshot current on-screen rect so the wrapper can be pinned exactly
    // where it already sits (right-column position), then smoothly expanded
    // to the full viewport. No layout jump at the start — the animation
    // literally starts from where everything is placed.
    const r = el.getBoundingClientRect();
    setRectStyle({
      position: "fixed",
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
      zIndex: 55,
      transition: "none",
    });

    // Next frame: kick off the rect expansion AND the camera zoom at the
    // same time, so the Mac grows into the viewport as the camera drives
    // into its screen. One continuous motion.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setZoomedIn(true);
        setRectStyle({
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 55,
          transition: `top ${EXPAND_MS}ms cubic-bezier(0.22,0.61,0.36,1), left ${EXPAND_MS}ms cubic-bezier(0.22,0.61,0.36,1), width ${EXPAND_MS}ms cubic-bezier(0.22,0.61,0.36,1), height ${EXPAND_MS}ms cubic-bezier(0.22,0.61,0.36,1)`,
        });
      });
    });

    window.setTimeout(() => setOverlayOpen(true), EXPAND_MS + 60);
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
    window.setTimeout(() => {
      setZoomedIn(false);
      setRectStyle(undefined);
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
      {/* Opaque backdrop fades in with the zoom — blocks hero text from
          bleeding through transparent canvas regions or the translucent
          overlay layers. */}
      {(zoomedIn || rectStyle) && (
        <div
          aria-hidden
          className="fixed inset-0 z-[54] pointer-events-none bg-[#050804]"
          style={{ animation: `poBackdropFade ${EXPAND_MS}ms ease-out both` }}
        />
      )}

      <div
        ref={wrapRef}
        className={rectStyle ? "" : "absolute inset-0"}
        style={rectStyle}
      >
        <MacintoshScene zoomedIn={zoomedIn} onScreenClick={handleScreenClick} />
      </div>
      <PortfolioOverlay open={overlayOpen} onClose={handleOverlayClose} />
    </>
  );
}
