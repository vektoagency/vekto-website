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

// Curated set sourced from hero-featured-clips.ts. Spotlight grid is a
// fixed 2x2 (4 tiles) — extra clips beyond 4 are ignored. Accepts both
// Bunny CDN clips and local mp4.
const heroClips: Clip[] = (() => {
  const all = (bunnyData.clips as Clip[]).filter(
    (c) => c.thumbnail && c.previewMp4
  );
  const curated = heroFeaturedClipIds
    .map((id) => all.find((c) => c.id === id))
    .filter((c): c is Clip => c != null);
  return (curated.length > 0 ? curated : all).slice(0, 4);
})();

function videoUrl(src: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("/")) return src; // local mp4 — already small
  return src.replace("play_1080p.mp4", "play_720p.mp4");
}

const ROTATION_MS = 6500;

/**
 * Mobile hero background — "Spotlight Mosaic": a 2x2 grid of curated
 * brand tiles where one tile at a time is the spotlight (plays its
 * video, scaled up, lime ring + glow). Spotlight rotates sequentially
 * every ROTATION_MS, so each brand gets equal screen time.
 *
 * Perf: only the spotlight tile + the next-up tile mount their <video>
 * tags (next one is preloading silently behind its poster). Peak 2
 * decoders. Other tiles are pure poster images, dimmed to ~55% so the
 * spotlight pops and the hero text overlay stays readable.
 *
 * Tap anywhere → fires "vekto:open-portfolio" which the (hidden) desktop
 * PortfolioWindow listener picks up to open the overlay.
 */
export default function HeroSpotlightGrid() {
  const [spotIdx, setSpotIdx] = useState(0);
  const [inView, setInView] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Pause rotation + decoders when offscreen
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

  useEffect(() => {
    if (!inView || heroClips.length < 2) return;
    const id = setInterval(() => {
      setSpotIdx((i) => (i + 1) % heroClips.length);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, [inView]);

  const onTap = () => {
    window.dispatchEvent(new Event("vekto:open-portfolio"));
  };

  const nextSpotIdx = (spotIdx + 1) % heroClips.length;
  const tiles = heroClips.slice(0, 4);

  return (
    <div ref={wrapRef} className="relative w-full h-full bg-black overflow-hidden">
      <button
        type="button"
        onClick={onTap}
        aria-label="Open portfolio"
        className="absolute inset-0 w-full h-full cursor-pointer"
      >
        <div className="absolute inset-2.5 grid grid-cols-2 grid-rows-2 gap-2.5">
          {tiles.map((clip, i) => (
            <SpotlightTile
              key={clip.id}
              clip={clip}
              isSpot={i === spotIdx}
              isPreloading={i === nextSpotIdx}
            />
          ))}
        </div>
      </button>
    </div>
  );
}

function SpotlightTile({
  clip,
  isSpot,
  isPreloading,
}: {
  clip: Clip;
  isSpot: boolean;
  isPreloading: boolean;
}) {
  const url = videoUrl(clip.previewMp4);
  // Mount the video when this tile is either the spot OR about to be
  // (preloading). That way the next rotation crossfades into a video
  // that's already buffered, instead of going through a brief
  // "poster → first frame" flash.
  const shouldMountVideo = isSpot || isPreloading;

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-[#0a0a0a]"
      style={{
        transform: isSpot ? "scale(1.025)" : "scale(0.985)",
        opacity: isSpot ? 1 : 0.55,
        transition: "transform 700ms ease, opacity 700ms ease, box-shadow 700ms ease",
        boxShadow: isSpot
          ? "0 0 0 1.5px rgba(200,255,0,0.85), 0 0 38px -6px rgba(200,255,0,0.55), 0 18px 44px -16px rgba(200,255,0,0.4)"
          : "0 0 0 1px rgba(255,255,255,0.04), 0 4px 14px rgba(0,0,0,0.35)",
        zIndex: isSpot ? 2 : 1,
      }}
    >
      {/* Poster — always visible underneath, hides any video mount delay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={clip.thumbnail}
        alt={clip.brand}
        loading="eager"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Video — mounted for spot + preload-next, opacity gates visibility */}
      {shouldMountVideo && url && (
        <video
          src={url}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: isSpot ? 1 : 0 }}
        />
      )}

      {/* Brand chip — only on spotlight, fades with rotation */}
      <div
        className="absolute inset-x-0 bottom-0 px-2 py-2 flex items-center justify-center gap-1.5 transition-opacity duration-500"
        style={{
          opacity: isSpot ? 1 : 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
        }}
      >
        <span className="w-1 h-1 rounded-full bg-[#c8ff00] animate-pulse" />
        <span
          className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/95"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,1)" }}
        >
          {clip.brand}
        </span>
      </div>
    </div>
  );
}
