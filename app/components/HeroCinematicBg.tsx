"use client";

import { useEffect, useRef, useState } from "react";
import bunnyData from "../data/bunny-clips.json";
import { heroFeaturedClipIds } from "../data/hero-featured-clips";

type Clip = {
  id: string;
  brand: string;
  thumbnail: string;
  previewMp4: string | null;
};

// Curated rotation — sourced from app/data/hero-featured-clips.ts so the
// same hand-picked list drives both the grid variant and this cinematic
// variant. Accepts both Bunny CDN clips and local mp4 clips. Falls back
// to first 6 valid clips if the curated list is empty.
const heroClips: Clip[] = (() => {
  const all = (bunnyData.clips as Clip[]).filter(
    (c) => c.thumbnail && c.previewMp4
  );
  const curated = heroFeaturedClipIds
    .map((id) => all.find((c) => c.id === id))
    .filter((c): c is Clip => c != null);
  return (curated.length > 0 ? curated : all).slice(0, 6);
})();

// 480p MP4 for Bunny clips — same quality target as the grid variant.
// Roughly 40% smaller than 720p (~3MB vs ~5MB), so the first frame
// paints noticeably faster on mobile networks. At ~400px wide phone
// viewports there's no visible quality drop.
function videoUrl(src: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("/")) return src; // local mp4 — already small
  return src.replace("play_1080p.mp4", "play_480p.mp4");
}

const SLIDE_DURATION_MS = 8000; // each clip plays ~8s before next crossfade
const CROSSFADE_MS = 1200; // slow, premium crossfade

/**
 * Mobile hero cinematic background — full-bleed single-clip showreel
 * that cycles smoothly through 6 curated brand clips. Two video layers
 * are mounted (current visible + next preloading silently behind), so
 * peak decoder count is always 2 — independent of rotation length.
 *
 * Crossfade animates opacity over CROSSFADE_MS so transitions read as
 * cinematic dissolves, not abrupt cuts. After each fade completes, the
 * now-invisible layer's source advances to the next clip, so it's fully
 * preloaded and playing silently by the time it becomes visible again.
 *
 * Tap anywhere on the background → fires "vekto:open-portfolio" which
 * the (hidden) desktop PortfolioWindow listener picks up to open the
 * shared overlay.
 */
export default function HeroCinematicBg() {
  const [activeA, setActiveA] = useState(true);
  const [idxA, setIdxA] = useState(0);
  const [idxB, setIdxB] = useState(heroClips.length > 1 ? 1 : 0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // Pause rotation + playback when the hero scrolls offscreen so we
  // don't burn cycles on a section the user isn't looking at.
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
  // index so it's preloaded for the next swap.
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

        {/* Soft cinematic vignette — pulls focus to the center of frame
            without competing with the readability scrims rendered by the
            parent Hero section. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 110% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)",
          }}
        />

        {/* Tiny "now playing" brand chip — bottom-left, fades with the
            active clip. Adds context without crowding the design. */}
        {clipA && clipB && (
          <div
            aria-hidden
            className="absolute bottom-[14vh] left-4 flex items-center gap-2 pointer-events-none transition-opacity duration-700"
          >
            <span className="w-1 h-1 rounded-full bg-[#c8ff00] animate-pulse" />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/85"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.95)" }}
            >
              {(activeA ? clipA : clipB).brand}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
