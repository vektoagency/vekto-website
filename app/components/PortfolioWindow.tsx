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

// Desktop card preview budget — 9 clips in a 3x3 scrolling window, sized
// small enough that 9 simultaneous mp4 decoders are fine on desktop.
const cardClips = (bunnyData.clips as Clip[])
  .filter((c) => c.thumbnail)
  .slice(0, 9);

// Mobile fullBleed budget — 6 clips spread across 2 wider columns. Each
// tile is ~2x the size of the 3-col card variant, so the mp4 quality
// reads much better, and only ~5 tiles are visible at once → decoder
// pressure stays well below the iOS Safari simultaneous-video ceiling.
const fullBleedClips = (bunnyData.clips as Clip[])
  .filter((c) => c.thumbnail)
  .slice(0, 6);

/**
 * 480p sweet spot — crisp at thumbnail/mid scale, ~300-500 KB per clip,
 * and modern browsers happily decode the in-viewport set in parallel.
 * 720p felt heavy on mobile decoders; animated WebP looked smeary —
 * 480p mp4 threads the needle.
 */
function previewVideoUrl(src: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("/")) return src; // local mp4 — already small
  return src.replace("play_1080p.mp4", "play_480p.mp4");
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
export default function PortfolioWindow({
  mobile = false,
  fullBleed = false,
}: { mobile?: boolean; fullBleed?: boolean } = {}) {
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

  // Split clips into columns, duplicated for seamless loop. Mobile
  // fullBleed uses 2 wide columns (bigger tiles, fewer decoders), desktop
  // card uses 3 columns (classic dense grid).
  const columns = useMemo(() => {
    const source = fullBleed ? fullBleedClips : cardClips;
    const colCount = fullBleed ? 2 : 3;
    const cols: Clip[][] = Array.from({ length: colCount }, () => []);
    source.forEach((c, i) => cols[i % colCount].push(c));
    return cols.map((col) => [...col, ...col]);
  }, [fullBleed]);

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
          className={`group relative block overflow-hidden cursor-pointer transition-all duration-500 ease-out ${
            fullBleed
              ? "w-full h-full"
              : mobile
                ? "w-[78%] max-w-[300px] aspect-[3/4] rounded-2xl"
                : "w-[88%] max-w-[480px] aspect-[3/4] rounded-2xl"
          }`}
          style={{
            background: "#0a0a0a",
            border: fullBleed ? "none" : "1.5px solid rgba(200, 255, 0, 0.4)",
            boxShadow: fullBleed
              ? "none"
              : zoomed
                ? "0 0 80px rgba(200,255,0,0.45)"
                : "0 0 40px -8px rgba(200,255,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.02)",
            // Subtle pull-in: small scale-up + fade. The overlay covers
            // the rest of the visual transition — no huge cropped frame.
            transform: zoomed ? "scale(1.18)" : "scale(1)",
            opacity: zoomed ? 0 : 1,
            transformOrigin: "center",
          }}
        >
          {/* Inner grid — 2 cols on mobile fullBleed (bigger tiles), 3 cols
              everywhere else. Alternating scroll directions for visual life. */}
          <div className={`absolute grid overflow-hidden ${
            fullBleed
              ? "inset-0 gap-1.5 grid-cols-2"
              : `rounded-xl grid-cols-3 ${mobile ? "inset-1.5 gap-1.5" : "inset-2 md:inset-3 gap-2 md:gap-2.5"}`
          }`}>
            {columns.map((col, idx) => (
              <ScrollColumn
                key={idx}
                clips={col}
                direction={idx % 2 === 0 ? "up" : "down"}
                speed={32 + idx * 6}
              />
            ))}
          </div>

          {/* Soft top/bottom fade for cinematic edge — only in card mode */}
          {!fullBleed && (
            <>
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
            </>
          )}

          {/* Hint pill — only in card mode; full-bleed uses external CTAs instead */}
          {!fullBleed && (
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
          )}
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

/**
 * Tile renders the static poster immediately, then upgrades to the
 * playing mp4 after `mountDelay` ms. Stagger means the browser never
 * spins up the full set of decoders simultaneously — they come online
 * ~220 ms apart, so initial paint stays responsive.
 */
function PreviewTile({
  clip,
  mountDelay,
}: {
  clip: Clip;
  mountDelay: number;
}) {
  const [mountVideo, setMountVideo] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMountVideo(true), mountDelay);
    return () => clearTimeout(id);
  }, [mountDelay]);

  const videoSrc = previewVideoUrl(clip.previewMp4);

  return (
    <div className="relative w-full aspect-[9/16] overflow-hidden rounded-md bg-[#0a0a0a] flex-shrink-0">
      {/* Poster — always visible underneath, fades when video paints over */}
      {clip.thumbnail.startsWith("/") ? (
        <Image
          src={clip.thumbnail}
          alt={clip.brand}
          fill
          sizes="(max-width: 768px) 50vw, 200px"
          className="object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={clip.thumbnail}
          alt={clip.brand}
          loading="eager"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Video — mounted after stagger delay, plays on top of poster */}
      {mountVideo && videoSrc && (
        <video
          src={videoSrc}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
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
        {clips.map((c, i) => (
          <PreviewTile
            key={`${c.id}-${i}`}
            clip={c}
            mountDelay={i * 220}
          />
        ))}
      </div>
    </div>
  );
}
