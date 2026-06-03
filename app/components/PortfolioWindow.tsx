"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import bunnyData from "../data/bunny-clips.json";
import { heroFeaturedClipIds } from "../data/hero-featured-clips";

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

// Mobile fullBleed budget — clips hand-picked in hero-featured-clips.ts.
// 6 clips across 2 wider columns; tiles sized so ~2.5 fit vertically in
// viewport. Combined with per-tile IO lazy mount + pause-when-offscreen,
// peak decoder count stays at ~5 — well inside the iOS Safari ceiling.
// Falls back to the first 6 valid Bunny clips if the curated list is
// empty or all IDs miss.
const fullBleedClips: Clip[] = (() => {
  const allBunny = (bunnyData.clips as Clip[]).filter(
    (c) => c.thumbnail && c.previewMp4 && !c.previewMp4.startsWith("/")
  );
  const curated = heroFeaturedClipIds
    .map((id) => allBunny.find((c) => c.id === id))
    .filter((c): c is Clip => c != null);
  return (curated.length > 0 ? curated : allBunny).slice(0, 6);
})();

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
  // fullBleed uses 2 columns (tiles sized to fit inside viewport, not
  // overflow). Desktop card uses 3 columns (classic dense grid).
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
          {/* Inner grid — 2 cols on mobile fullBleed (in-viewport tiles,
              alternating scroll), 3 cols everywhere else. */}
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

          {/* Hint pill — only in card mode; full-bleed uses external CTAs
              instead. Always visible (no hover-gating) so visitors immediately
              know the card is clickable. Subtle scale-up on hover gives the
              feedback that the hover state used to communicate. */}
          {!fullBleed && (
            <div
              className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/75 backdrop-blur-md border border-[#c8ff00]/55 transition-transform duration-300 group-hover:scale-105"
              style={{
                boxShadow:
                  "0 6px 20px -6px rgba(0,0,0,0.7), 0 0 18px -4px rgba(200,255,0,0.25)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
              <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-[#c8ff00]">
                Натисни за разглеждане
              </span>
              <span className="text-[#c8ff00] text-[11px] md:text-[12px] leading-none" aria-hidden>
                ↗
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
 * Tile renders the static poster immediately. The <video> element is
 * lazy-mounted only after the tile has scrolled into view at least once
 * — that means initial pageload only fetches videos for the handful of
 * tiles actually visible above the fold, not the full 12-tile DOM set.
 * Once mounted, the video stays mounted, and an IntersectionObserver
 * pauses it the instant it leaves the viewport (freeing its decoder
 * slot) and resumes it on re-entry. Net effect: active decoder count
 * never exceeds what's actually on screen — usually 4-5, well under
 * the iOS Safari simultaneous-video ceiling.
 *
 * `mountDelay` is preserved as a small staggered play kickoff so the
 * 4-5 visible tiles don't all hit the decoder at the same millisecond.
 */
function PreviewTile({
  clip,
  mountDelay,
}: {
  clip: Clip;
  mountDelay: number;
}) {
  const tileRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [staggerPassed, setStaggerPassed] = useState(false);
  // True while the portfolio overlay is open OR a clip is actively
  // playing in the lightbox. Tiles are covered/invisible to the user
  // at that point, but their videos keep consuming decoder slots +
  // network bandwidth → the watched clip in the lightbox stutters.
  // Pausing here gives full decoder + bandwidth to the watched clip.
  const [coveredByOverlay, setCoveredByOverlay] = useState(false);
  useEffect(() => {
    const onOpen = () => setCoveredByOverlay(true);
    const onClose = () => setCoveredByOverlay(false);
    window.addEventListener("vekto:zoom-started", onOpen);
    window.addEventListener("vekto:zoom-ended", onClose);
    window.addEventListener("vekto:player-open", onOpen);
    window.addEventListener("vekto:player-closed", onClose);
    return () => {
      window.removeEventListener("vekto:zoom-started", onOpen);
      window.removeEventListener("vekto:zoom-ended", onClose);
      window.removeEventListener("vekto:player-open", onOpen);
      window.removeEventListener("vekto:player-closed", onClose);
    };
  }, []);

  // Hold off video mounts until the browser hits an idle moment after
  // first paint. Then apply the small per-tile stagger so the first
  // wave of visible tiles spin up decoders ~220 ms apart rather than
  // all at once. Result: initial paint isn't blocked by video network
  // fetches + decoder spin-up; poster images carry the hero card
  // visually for ~1 s while the page finishes hydrating, then videos
  // pop in smoothly.
  useEffect(() => {
    let stopped = false;
    const apply = () => {
      if (stopped) return;
      setTimeout(() => {
        if (!stopped) setStaggerPassed(true);
      }, mountDelay);
    };
    type W = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    const w = typeof window !== "undefined" ? (window as W) : null;
    if (w?.requestIdleCallback) {
      w.requestIdleCallback(apply, { timeout: 1500 });
    } else {
      setTimeout(apply, 400);
    }
    return () => {
      stopped = true;
    };
  }, [mountDelay]);

  // Track this tile's intersection with the viewport. rootMargin of
  // 30% pre-mounts the video slightly before the tile is on screen so
  // there's no visible "poster → first frame" flash on scroll-in.
  useEffect(() => {
    const el = tileRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenVisible(true);
      },
      { threshold: 0, rootMargin: "30% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Drive play/pause off visibility AND overlay state. Paused videos
  // release their decoder, so total decoder pressure tracks on-screen
  // tile count + frees up completely while the lightbox is playing.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isVisible && staggerPassed && !coveredByOverlay) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isVisible, staggerPassed, hasBeenVisible, coveredByOverlay]);

  const videoSrc = previewVideoUrl(clip.previewMp4);

  return (
    <div
      ref={tileRef}
      className="relative w-full aspect-[9/16] overflow-hidden rounded-md bg-[#0a0a0a] flex-shrink-0"
    >
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

      {/* Video — lazy-mounted on first visibility, IO controls play/pause */}
      {hasBeenVisible && videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
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
