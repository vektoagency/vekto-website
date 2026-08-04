"use client";

// ============================================================================
// SCRUB REEL — canvas frame-sequence player driven by scroll position.
//
// This is the mechanism every prompt in the One-Prompt Website Pack is built
// around: scrolling does not play the video, it *is* the playhead. Frames are
// decoded once into memory and blitted to a canvas, so scrubbing backwards is
// exactly as smooth as scrubbing forwards.
//
// Why frames and not <video>.currentTime: seeking an inter-frame-encoded mp4
// forces the decoder back to the nearest keyframe on every scroll tick, which
// stutters badly on anything but a fast machine. Re-encoding the source with
// a keyframe on every frame fixes seeking but ballooned this 26s reel from
// 4.7MB to 9.2MB. An 84-frame WebP sequence at 480px is 1.67MB and decodes
// once.
//
// The source is VEKTO's real showreel, not generated footage — and it is
// vertical, because vertical is what the agency actually ships. So the reel
// scrubs inside a hard-edged housing rather than as a full-bleed backdrop.
// ============================================================================

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 84;
const frameSrc = (i: number) =>
  `/scrub/showreel/${String(i + 1).padStart(3, "0")}.webp`;

// Native size of the extracted frames. Used to size the backing store so the
// canvas is never upscaled past its source.
const FRAME_W = 480;
const FRAME_H = 862;

export default function ScrubReel({
  progress,
  className,
  onReady,
}: {
  progress: number;
  className?: string;
  onReady?: (ready: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const [loaded, setLoaded] = useState(0);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const rafRef = useRef(0);

  // --- Decode the sequence --------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    const frames: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    framesRef.current = frames;
    let done = 0;

    // Fetched in order so the opening frames are usable before the tail
    // arrives, but with a small concurrency window — one-at-a-time wastes the
    // connection, all-at-once starves the first frames that matter most.
    const CONCURRENCY = 6;
    let next = 0;

    const pump = () => {
      if (cancelled || next >= FRAME_COUNT) return;
      const i = next++;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        frames[i] = img;
        done += 1;
        setLoaded(done);
        pump();
      };
      img.onerror = () => {
        if (cancelled) return;
        // A missing frame must not stall the loader: the draw step falls back
        // to the nearest decoded neighbour.
        done += 1;
        setLoaded(done);
        pump();
      };
      img.src = frameSrc(i);
    };
    for (let k = 0; k < CONCURRENCY; k++) pump();

    return () => {
      cancelled = true;
    };
  }, []);

  const ready = loaded >= FRAME_COUNT;
  useEffect(() => {
    onReady?.(ready);
  }, [ready, onReady]);

  // --- Draw -----------------------------------------------------------------
  // One draw path, scheduled from two places: a scroll-driven progress change,
  // and a frame finishing its decode (otherwise the canvas would sit on the
  // first frame until the visitor happened to scroll again).
  const scheduleRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    canvas.width = FRAME_W;
    canvas.height = FRAME_H;

    let shown = -1;
    const draw = () => {
      rafRef.current = 0;
      const p = Math.max(0, Math.min(1, progressRef.current));
      const want = Math.round(p * (FRAME_COUNT - 1));

      // Walk outward for the nearest frame that actually decoded, so a
      // still-loading sequence scrubs against what it has instead of blanking.
      let idx = -1;
      for (let d = 0; d < FRAME_COUNT; d++) {
        if (framesRef.current[want - d]) { idx = want - d; break; }
        if (framesRef.current[want + d]) { idx = want + d; break; }
      }
      if (idx < 0 || idx === shown) return;
      const img = framesRef.current[idx];
      if (!img) return;
      ctx.drawImage(img, 0, 0, FRAME_W, FRAME_H);
      shown = idx;
    };

    scheduleRef.current = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(draw);
    };
    scheduleRef.current();

    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, []);

  useEffect(() => { scheduleRef.current(); }, [progress, loaded]);

  const pct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <div className={className} style={{ position: "relative", background: "#0d0d0d" }}>
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ display: "block", width: "100%", height: "auto" }}
      />
      {/* Loader readout. Deliberately a readout and not a spinner: the page
          already speaks in instrument plates, and a real percentage tells the
          visitor the reel is arriving rather than that something is stuck. */}
      {!ready && (
        <div
          className="absolute inset-0 flex items-end justify-start p-3 pointer-events-none"
          style={{ background: "rgba(13,13,13,0.72)" }}
        >
          <div
            className="text-[11px] uppercase tracking-[0.3em] tabular-nums"
            style={{ fontFamily: "var(--cine-pixel)", color: "#f4f4f4" }}
          >
            {String(pct).padStart(3, "0")}%
          </div>
        </div>
      )}
    </div>
  );
}
