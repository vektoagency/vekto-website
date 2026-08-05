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
    // Loader state is BATCHED (every 12th frame + the final one): a setState
    // per decoded frame re-rendered the whole journey ~400 times during the
    // initial load, which is exactly when the main thread is busiest.
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
        if (done === frames.count || done % 12 === 0) setLoaded(done);
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
    // Assigning width/height resets ALL context state, so the resampling
    // quality hint must be re-applied after every size().
    const size = () => {
      if (!cover) {
        canvas.width = frames.w;
        canvas.height = frames.h;
      } else {
        const r = host.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(2, Math.round(r.width * dpr));
        canvas.height = Math.max(2, Math.round(r.height * dpr));
      }
      ctx.imageSmoothingQuality = "high";
    };
    size();

    const drawOne = (img: HTMLImageElement, alpha: number) => {
      ctx.globalAlpha = alpha;
      if (!cover) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        // object-fit: cover — scale to fill, center, crop the overflow.
        const s = Math.max(canvas.width / frames.w, canvas.height / frames.h);
        const dw = frames.w * s;
        const dh = frames.h * s;
        ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
      }
      ctx.globalAlpha = 1;
    };

    // Nearest decoded frame, so an in-flight sequence scrubs against what it
    // has instead of blanking.
    const nearest = (want: number) => {
      for (let d = 0; d < frames.count; d++) {
        if (imgsRef.current[want - d]) return want - d;
        if (imgsRef.current[want + d]) return want + d;
      }
      return -1;
    };

    // --- Smoothed playhead -------------------------------------------------
    // The displayed position CHASES the scroll position with a critically
    // damped exponential (dt-correct, so 60Hz and 120Hz screens feel the
    // same). Wheel ticks and touch momentum arrive as discrete jumps of
    // several frames; Lenis softens the wheel on desktop but touch scroll is
    // native, so on phones those jumps used to map 1:1 onto the film. The
    // chase turns every jump into a short glide — and because it happens at
    // the playhead, not the scroll, it can never fight the browser's own
    // scrolling (no jank, no scroll hijack).
    let shown = -1;
    let display = -1; // smoothed playhead, -1 = not initialised
    let lastTs = 0;

    const render = (f: number) => {
      const i0 = Math.floor(f);
      const mix = f - i0;
      const base = nearest(i0);
      if (base < 0) return;
      // Skip sub-visible redraws (finer gate than the pre-smoothing 1/32:
      // the glide moves in small steps and must not quantise into stutter).
      const key = Math.round(f * 128);
      if (key === shown) return;
      const img0 = imgsRef.current[base];
      if (!img0) return;
      drawOne(img0, 1);
      const next = base + 1 < frames.count ? imgsRef.current[base + 1] : null;
      if (next && base === i0 && mix > 0.02) drawOne(next, mix);
      shown = key;
    };

    const step = (ts: number) => {
      rafRef.current = 0;
      const target = Math.max(0, Math.min(1, progressRef.current));
      const dt = lastTs ? Math.min(0.1, (ts - lastTs) / 1000) : 1 / 60;
      lastTs = ts;

      if (display < 0) display = target; // first paint: no glide from 0
      const delta = target - display;
      // Big jumps (rail clicks) converge faster so navigation stays snappy;
      // scroll-sized deltas glide at ~100ms.
      const tau = Math.abs(delta) > 0.12 ? 0.05 : 0.1;
      display += delta * (1 - Math.exp(-dt / tau));

      // Converged: snap, draw once, go idle until the next schedule().
      if (Math.abs(target - display) < 0.35 / ((frames.count - 1) * 128)) {
        display = target;
        render(display * (frames.count - 1));
        lastTs = 0;
        return;
      }
      render(display * (frames.count - 1));
      rafRef.current = requestAnimationFrame(step);
    };

    scheduleRef.current = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(step);
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

  return (
    <div
      ref={hostRef}
      className={className}
      // No hardcoded position here: in cover mode the CALLER positions the
      // host (absolute inset-0 over the film area), and an inline
      // position:relative would override that class and collapse the host to
      // zero height — a black page with a working HUD. Outside cover mode the
      // host still needs to anchor the loader overlay, so relative applies
      // only then.
      style={{
        background: "#0d0d0d",
        overflow: "hidden",
        ...(cover ? {} : { position: "relative" as const }),
      }}
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
      {/* No loader chip: the sequence draws progressively via the
          nearest-decoded fallback, and a second corner instrument stacked
          under the HUD read as clutter. The film simply sharpens as frames
          arrive. */}
    </div>
  );
}
