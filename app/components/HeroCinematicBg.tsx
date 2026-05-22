"use client";

import { useEffect, useRef, useState } from "react";
import bunnyData from "../data/bunny-clips.json";

type Clip = {
  id: string;
  brand: string;
  thumbnail: string;
  previewMp4: string | null;
  featured?: boolean;
};

// Best 6 Bunny-hosted clips for the hero showreel. Prefer "featured"
// clips when there are enough; otherwise fall back to whatever Bunny
// clips are available. Local mp4 clips are excluded so the URL rewrite
// to /play_720p.mp4 always works.
const heroClips: Clip[] = (() => {
  const all = (bunnyData.clips as Clip[]).filter(
    (c) => c.previewMp4 && !c.previewMp4.startsWith("/")
  );
  const featured = all.filter((c) => c.featured);
  return (featured.length >= 4 ? featured : all).slice(0, 6);
})();

// 720p MP4 — only one clip is ever fully visible, and only two are ever
// mounted (active + preloading next). Decoder pressure is fixed at ~2,
// so we can afford the sharper file. 720p is native source resolution
// for these clips, so no upscale artifacts.
function videoUrl(src: string | null): string | null {
  if (!src) return null;
  return src.replace("play_1080p.mp4", "play_720p.mp4");
}

const SLIDE_DURATION_MS = 6500;
const CROSSFADE_MS = 900;

/**
 * Mobile hero cinematic background — single fullscreen reel that cycles
 * through the best brand clips with smooth crossfades. Two video tags
 * are mounted (current visible + next preloading silently), so peak
 * decoder pressure is always 2 — independent of how many clips are in
 * the rotation. Tap anywhere dispatches "vekto:open-portfolio", which
 * the (hidden) desktop PortfolioWindow's listener picks up and opens
 * the shared overlay.
 */
export default function HeroCinematicBg() {
  const [activeA, setActiveA] = useState(true);
  const [idxA, setIdxA] = useState(0);
  const [idxB, setIdxB] = useState(heroClips.length > 1 ? 1 : 0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // Pause the rotation + playback when the hero scrolls offscreen so we
  // don't burn cycles on a background section the user isn't looking at.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Crossfade rotation: flip active layer every SLIDE_DURATION_MS, then
  // after the fade completes, advance the now-inactive layer's clip
  // index so it's preloaded and ready for the *next* crossfade.
  useEffect(() => {
    if (!inView || heroClips.length < 2) return;
    const id = setInterval(() => {
      setActiveA((prev) => {
        const next = !prev;
        setTimeout(() => {
          if (next) {
            setIdxB((b) => (b + 2) % heroClips.length);
          } else {
            setIdxA((a) => (a + 2) % heroClips.length);
          }
        }, CROSSFADE_MS + 100);
        return next;
      });
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [inView]);

  const onTap = () => {
    window.dispatchEvent(new Event("vekto:open-portfolio"));
  };

  const clipA = heroClips[idxA];
  const clipB = heroClips[idxB];

  return (
    <div ref={wrapRef} className="relative w-full h-full overflow-hidden bg-black">
      <button
        type="button"
        onClick={onTap}
        aria-label="Open portfolio"
        className="absolute inset-0 w-full h-full cursor-pointer"
      >
        {clipA && (
          <video
            src={videoUrl(clipA.previewMp4) ?? undefined}
            poster={clipA.thumbnail}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover transition-opacity ease-out"
            style={{
              opacity: activeA ? 1 : 0,
              transitionDuration: `${CROSSFADE_MS}ms`,
            }}
          />
        )}
        {clipB && (
          <video
            src={videoUrl(clipB.previewMp4) ?? undefined}
            poster={clipB.thumbnail}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover transition-opacity ease-out"
            style={{
              opacity: activeA ? 0 : 1,
              transitionDuration: `${CROSSFADE_MS}ms`,
            }}
          />
        )}

        {/* Slight letterbox-style cinematic vignette overlay for added depth */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 110% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </button>
    </div>
  );
}
