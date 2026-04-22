"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
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

const EASE = "cubic-bezier(0.45, 0, 0.15, 1)";
const EXPAND_MS = 720;

export default function HeroPravec() {
  const [zoomedIn, setZoomedIn] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [expandStyle, setExpandStyle] = useState<React.CSSProperties | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const handleScreenClick = () => {
    if (zoomedIn) return;
    const el = wrapperRef.current;
    if (!el) return;

    // 1. Pin the wrapper to its current viewport pixel coords with no visual
    //    change. Promoting to `position: fixed` at exact measured rect means
    //    nothing moves yet.
    const r = el.getBoundingClientRect();
    rectRef.current = r;
    setZoomedIn(true);
    setExpandStyle({
      position: "fixed",
      top: `${r.top}px`,
      left: `${r.left}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
      zIndex: 60,
      willChange: "top, left, width, height",
    });

    // 2. Two RAFs later, transition to full viewport. Two RAFs so the
    //    browser commits the pinned state first, then sees the diff and
    //    animates rather than jumping.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setExpandStyle({
          position: "fixed",
          top: "0px",
          left: "0px",
          width: "100vw",
          height: "100vh",
          zIndex: 60,
          willChange: "top, left, width, height",
          transition: `top ${EXPAND_MS}ms ${EASE}, left ${EXPAND_MS}ms ${EASE}, width ${EXPAND_MS}ms ${EASE}, height ${EXPAND_MS}ms ${EASE}`,
        });
      });
    });

    // 3. Mount overlay once zoom + expansion are ~done
    setTimeout(() => setOverlayOpen(true), EXPAND_MS + 40);
  };

  const handleOverlayClose = () => {
    setOverlayOpen(false);

    // Wait for overlay fade-out to start, then reverse the canvas
    // expansion back to its original rect.
    setTimeout(() => {
      const r = rectRef.current;
      if (!r) {
        setExpandStyle(null);
        setZoomedIn(false);
        return;
      }
      setExpandStyle({
        position: "fixed",
        top: `${r.top}px`,
        left: `${r.left}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
        zIndex: 60,
        willChange: "top, left, width, height",
        transition: `top ${EXPAND_MS}ms ${EASE}, left ${EXPAND_MS}ms ${EASE}, width ${EXPAND_MS}ms ${EASE}, height ${EXPAND_MS}ms ${EASE}`,
      });
    }, 120);

    // After the reverse expansion finishes, unpin and release zoom
    setTimeout(() => {
      setExpandStyle(null);
      setZoomedIn(false);
    }, 120 + EXPAND_MS + 20);
  };

  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  // Global trigger — "See Our Work" button
  useEffect(() => {
    const onTrigger = () => handleScreenClick();
    window.addEventListener("vekto:open-portfolio", onTrigger);
    return () => window.removeEventListener("vekto:open-portfolio", onTrigger);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomedIn]);

  return (
    <>
      <div
        ref={wrapperRef}
        className={expandStyle ? "" : "absolute inset-0"}
        style={expandStyle ?? undefined}
      >
        <MacintoshScene zoomedIn={zoomedIn} onScreenClick={handleScreenClick} />
      </div>
      <PortfolioOverlay open={overlayOpen} onClose={handleOverlayClose} />
    </>
  );
}
