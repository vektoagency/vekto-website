"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import bunnyData from "../data/bunny-clips.json";

// Lazy-load the heavy overlay — same pattern as before.
const PortfolioOverlay = dynamic(() => import("./PortfolioOverlay"), { ssr: false });

type Clip = {
  id: string;
  brand: string;
  thumbnail: string;
  previewMp4: string | null;
  portrait?: boolean;
};

const clips = (bunnyData.clips as Clip[]).filter((c) => c.thumbnail);

/**
 * Bunny preview URLs ship as /play_1080p.mp4 which is ~10-30 MB and far
 * too heavy for nine thumbnails autoplaying in a hero. Swap to 360p so
 * total payload stays under ~3-5 MB for the whole grid.
 */
function lightenedVideoUrl(src: string | null): string | null {
  if (!src) return null;
  return src.replace("play_1080p.mp4", "play_360p.mp4");
}

/**
 * Portfolio "window" — minimal lime-bordered card containing three
 * vertically-scrolling columns of clip thumbnails. Clicking the
 * window (or the "See our work" button via the global event) zooms
 * the card into the viewport and reveals the existing PortfolioOverlay.
 *
 * Replaces the 3D Mac CRT as the hero's portfolio trigger — lighter,
 * shows actual brand work above the fold, and keeps the same overlay
 * behaviour downstream.
 */
export default function PortfolioWindow({ mobile = false }: { mobile?: boolean } = {}) {
  const [zoomed, setZoomed] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [inView, setInView] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pause scrolling when the window is offscreen — saves CPU/GPU as the
  // user reads the rest of the homepage. Resumes the moment it scrolls
  // back into view.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Split clips into 3 columns, duplicated for seamless loop.
  const columns = useMemo(() => {
    const cols: Clip[][] = [[], [], []];
    clips.forEach((c, i) => cols[i % 3].push(c));
    return cols.map((col) => [...col, ...col]);
  }, []);

  // Open / close flow — subtle "pull-in" feel: window scales slightly +
  // fades, the overlay fades in over the top before the scale ever gets
  // ugly. Keeps the transition cinematic without cropping the grid.
  const startZoom = () => {
    window.dispatchEvent(new Event("vekto:zoom-started"));
    setZoomed(true);
    // Overlay slides in midway through the scale → no awkward static frame
    setTimeout(() => setOverlayOpen(true), 250);
  };

  const handleClose = () => {
    setOverlayOpen(false);
    setTimeout(() => {
      setZoomed(false);
      window.dispatchEvent(new Event("vekto:zoom-ended"));
    }, 300);
  };

  // External trigger from "See our work" buttons elsewhere on the page.
  useEffect(() => {
    const onTrigger = () => {
      if (!zoomed) startZoom();
    };
    window.addEventListener("vekto:open-portfolio", onTrigger);
    return () => window.removeEventListener("vekto:open-portfolio", onTrigger);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomed]);

  return (
    <>
      <div
        ref={wrapperRef}
        className={`portfolio-window ${zoomed ? "is-zoomed" : ""} ${inView ? "" : "is-offscreen"}`}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          onClick={startZoom}
          aria-label="Open portfolio"
          className={`group relative block rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out ${
            mobile
              ? "w-[78%] max-w-[300px] aspect-[3/4]"
              : "w-[88%] max-w-[480px] aspect-[3/4]"
          }`}
          style={{
            background: "#0a0a0a",
            border: "1.5px solid rgba(200, 255, 0, 0.4)",
            boxShadow: zoomed
              ? "0 0 80px rgba(200,255,0,0.45)"
              : "0 0 40px -8px rgba(200,255,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.02)",
            // Subtle pull-in: small scale-up + fade. The overlay covers
            // the rest of the visual transition — no huge cropped frame.
            transform: zoomed ? "scale(1.18)" : "scale(1)",
            opacity: zoomed ? 0 : 1,
            transformOrigin: "center",
          }}
        >
          {/* Inner grid — 3 columns scrolling vertically at different speeds */}
          <div className={`absolute grid grid-cols-3 overflow-hidden rounded-xl ${
            mobile ? "inset-1.5 gap-1.5" : "inset-2 md:inset-3 gap-2 md:gap-2.5"
          }`}>
            {columns.map((col, idx) => (
              <ScrollColumn key={idx} clips={col} direction={idx === 1 ? "down" : "up"} speed={28 + idx * 6} />
            ))}
          </div>

          {/* Soft top/bottom fade for cinematic edge */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-10 z-[3]"
            style={{ background: "linear-gradient(to bottom, #0a0a0a 0%, transparent 100%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 z-[3]"
            style={{ background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)" }}
          />

          {/* Hint pill — always visible on mobile (no hover), hover-only on desktop */}
          <div
            className={`absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#c8ff00]/40 transition-opacity duration-300 ${
              mobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
            <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-[#c8ff00]">
              Натисни за разглеждане
            </span>
          </div>
        </button>
      </div>

      <PortfolioOverlay open={overlayOpen} onClose={handleClose} />

      <style jsx global>{`
        @keyframes pwScrollUp {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(0, -50%, 0); }
        }
        @keyframes pwScrollDown {
          from { transform: translate3d(0, -50%, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
        .pw-col {
          will-change: transform;
        }
        .pw-col.dir-up   { animation-name: pwScrollUp; }
        .pw-col.dir-down { animation-name: pwScrollDown; }
        .pw-col {
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        /* Animation keeps running on hover — feels alive even when the
           cursor lingers over the window. Only the zoom-in transition
           AND offscreen state pause the columns. */
        .portfolio-window.is-zoomed .pw-col,
        .portfolio-window.is-offscreen .pw-col {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .pw-col { animation: none; }
        }
      `}</style>
    </>
  );
}

function ScrollColumn({
  clips,
  direction,
  speed,
}: {
  clips: Clip[];
  direction: "up" | "down";
  speed: number;
}) {
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={`pw-col dir-${direction} flex flex-col gap-2 md:gap-2.5`}
        style={{ animationDuration: `${speed}s` }}
      >
        {clips.map((c, i) => {
          const videoSrc = lightenedVideoUrl(c.previewMp4);
          return (
            <div
              key={`${c.id}-${i}`}
              className="relative w-full aspect-[9/16] overflow-hidden rounded-md bg-[#0a0a0a] flex-shrink-0"
            >
              {videoSrc ? (
                // Auto-playing muted video preview — feels like the reels
                // are actually running in the hero. Poster keeps the slot
                // pretty while the mp4 is still downloading.
                <video
                  src={videoSrc}
                  poster={c.thumbnail}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : c.thumbnail.startsWith("/") ? (
                <Image
                  src={c.thumbnail}
                  alt={c.brand}
                  fill
                  sizes="(max-width: 768px) 30vw, 150px"
                  className="object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.thumbnail}
                  alt={c.brand}
                  loading="lazy"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
