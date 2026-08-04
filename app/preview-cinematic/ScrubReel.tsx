"use client";

// ============================================================================
// SCRUB REEL — canvas frame-sequence player driven by scroll position.
//
// Scroll does not play the video; it IS the playhead. Frames are decoded once
// into memory and blitted to a canvas, so scrubbing backwards is exactly as
// smooth as scrubbing forwards.
//
// Why frames and not <video>.currentTime: seeking an inter-frame-encoded mp4
// forces the decoder back to the nearest keyframe on every scroll tick, which
// stutters on anything but a fast machine; an all-intra re-encode fixes the
// seek but doubles the file. A WebP sequence decodes once and scrubs free.
//
// v2: generalized for the full-page Vector journey — frame set is passed in,
// and `cover` mode draws like CSS object-fit: cover so the sequence can run
// full-bleed behind pinned type at any viewport shape.
// ============================================================================

import { useEffect, useRef, useState } from "react";

export type FrameSet = {
  dir: string;   // public path, e.g. "/scrub/vector"
  count: number; // total frames, files named 001.webp .. NNN.webp
  w: number;     // native frame width
  h: number;     // native frame height
};

const frameSrc = (dir: string, i: number) =>
  `${dir}/${String(i + 1).padStart(3, "0")}.webp`;

export default function ScrubReel({
  progress,
  frames,
  cover = false,
  className,
  onReady,
}: {
  progress: number;
  frames: FrameSet;
  /** true: fill the host box like object-fit cover; false: intrinsic aspect */
  cover?: boolean;
  className?: string;
  onReady?: (ready: boolean) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgsRef = useRef<(HTMLImageElement | null)[]>([]);
  const [loaded, setLoaded] = useState(0);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const rafRef = useRef(0);
  const scheduleRef = useRef<() => void>(() => {});

  // --- Decode the sequence -------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    const arr: (HTMLImageElement | null)[] = new Array(frames.count).fill(null);
    imgsRef.current = arr;
    setLoaded(0);
    let done = 0;

    // Ordered fetch with a small concurrency window: the opening frames are
    // usable before the tail arrives, without starving the connection.
    const CONCURRENCY = 6;
    let next = 0;
    const pump = () => {
      if (cancelled || next >= frames.count) return;
      const i = next++;
      const img = new Image();
      img.decoding = "async";
      const advance = () => {
        if (cancelled) return;
        done += 1;
        setLoaded(done);
        pump();
      };
      img.onload = () => { arr[i] = img; advance(); };
      img.onerror = advance; // a missing frame must not stall the loader
      img.src = frameSrc(frames.dir, i);
    };
    for (let k = 0; k < CONCURRENCY; k++) pump();
    return () => { cancelled = true; };
  }, [frames.dir, frames.count]);

  const ready = loaded >= frames.count;
  useEffect(() => { onReady?.(ready); }, [ready, onReady]);

  // --- Draw ----------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // In cover mode the backing store tracks the host box (so there is no
    // CSS upscale blur); in intrinsic mode it is simply the frame size.
    const size = () => {
      if (!cover) {
        canvas.width = frames.w;
        canvas.height = frames.h;
        return;
      }
      const r = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(2, Math.round(r.width * dpr));
      canvas.height = Math.max(2, Math.round(r.height * dpr));
    };
    size();

    let shown = -1;
    const draw = () => {
      rafRef.current = 0;
      const p = Math.max(0, Math.min(1, progressRef.current));
      const want = Math.round(p * (frames.count - 1));
      // Nearest decoded frame, so an in-flight sequence scrubs against what
      // it has instead of blanking.
      let idx = -1;
      for (let d = 0; d < frames.count; d++) {
        if (imgsRef.current[want - d]) { idx = want - d; break; }
        if (imgsRef.current[want + d]) { idx = want + d; break; }
      }
      if (idx < 0 || idx === shown) return;
      const img = imgsRef.current[idx];
      if (!img) return;

      if (!cover) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        // object-fit: cover — scale to fill, center, crop the overflow.
        const s = Math.max(canvas.width / frames.w, canvas.height / frames.h);
        const dw = frames.w * s;
        const dh = frames.h * s;
        ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
      }
      shown = idx;
    };

    scheduleRef.current = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(draw);
    };
    scheduleRef.current();

    const ro = new ResizeObserver(() => {
      size();
      shown = -1; // backing store was cleared by the resize — force redraw
      scheduleRef.current();
    });
    ro.observe(host);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [cover, frames.dir, frames.count, frames.w, frames.h]);

  useEffect(() => { scheduleRef.current(); }, [progress, loaded]);

  const pct = Math.round((loaded / frames.count) * 100);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ position: "relative", background: "#0d0d0d", overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        style={
          cover
            ? { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }
            : { display: "block", width: "100%", height: "auto" }
        }
      />
      {/* Loader readout — a percentage, not a spinner: it reports arrival,
          in the same instrument voice the rest of the page speaks. */}
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
