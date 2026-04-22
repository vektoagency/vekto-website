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

// Timings
const CAMERA_ZOOM_MS = 520; // time to let camera zoom so canvas is uniform phosphor
const RECT_EXPAND_MS = 520; // smooth grow from column rect → viewport
const OVERLAY_DELAY = CAMERA_ZOOM_MS + RECT_EXPAND_MS - 140;

export default function HeroPravec() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [zoomedIn, setZoomedIn] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [rectStyle, setRectStyle] = useState<CSSProperties | undefined>(undefined);

  const startZoom = () => {
    const el = wrapRef.current;
    if (!el) {
      setZoomedIn(true);
      setTimeout(() => setOverlayOpen(true), OVERLAY_DELAY);
      return;
    }
    // Snapshot current rect and pin wrapper as fixed at those coords so the
    // camera can zoom without any layout change.
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
    setZoomedIn(true);

    // After the camera has mostly filled the canvas with uniform phosphor,
    // grow the wrapper to full viewport. Because contents are now a flat
    // lime color, the growth reads as a clean fade-to-fullscreen — no
    // directional bias.
    window.setTimeout(() => {
      setRectStyle({
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 55,
        transition: `top ${RECT_EXPAND_MS}ms cubic-bezier(0.22,0.61,0.36,1), left ${RECT_EXPAND_MS}ms cubic-bezier(0.22,0.61,0.36,1), width ${RECT_EXPAND_MS}ms cubic-bezier(0.22,0.61,0.36,1), height ${RECT_EXPAND_MS}ms cubic-bezier(0.22,0.61,0.36,1)`,
      });
    }, CAMERA_ZOOM_MS);

    window.setTimeout(() => setOverlayOpen(true), OVERLAY_DELAY);
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
      {/* Opaque backdrop pinned behind the canvas during zoom — blocks the
          hero text from bleeding through transparent canvas regions or the
          translucent overlay layers above. */}
      {zoomedIn && (
        <div
          aria-hidden
          className="fixed inset-0 z-[54] pointer-events-none bg-[#050804]"
          style={{ animation: "poBackdropFade 260ms ease-out both" }}
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
