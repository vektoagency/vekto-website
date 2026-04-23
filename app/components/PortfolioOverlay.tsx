"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Clip = {
  id: string;
  client: string;
  logo?: string;
  src: string;               // webp / mp4 / webm — component auto-detects
  category: string;          // e.g. "Short-Form", "AI Visuals", "Cinematic"
  metric?: string;           // small badge, e.g. "4.6x ROAS"
  href?: string | null;      // case study link
  featured?: boolean;        // gets 2×2 tile span on desktop
};

const V = "/images/hero-anim";

// NOTE: until real 9:16 clips are uploaded, we reuse hero animations as
// placeholders. Replace `src` values with paths to real vertical clips
// (e.g. /videos/clips/menscare-01.mp4). The component renders <video>
// for .mp4/.webm/.mov and <img> for webp/gif/png/jpg automatically.
const clips: Clip[] = [
  { id: "mc-01", client: "MEN'S CARE", logo: "/images/logo-menscare.png", src: `${V}/video-1s.webp`, category: "Short-Form", metric: "4.6x ROAS", href: "/work/menscare", featured: true },
  { id: "mc-02", client: "MEN'S CARE", logo: "/images/logo-menscare.png", src: `${V}/video-5s.webp`, category: "Short-Form", href: "/work/menscare" },
  { id: "mc-03", client: "MEN'S CARE", logo: "/images/logo-menscare.png", src: `${V}/video-9s.webp`, category: "AI Visuals", href: "/work/menscare" },
  { id: "mc-04", client: "MEN'S CARE", logo: "/images/logo-menscare.png", src: `${V}/video-3s.webp`, category: "Short-Form", href: "/work/menscare" },
  { id: "iso-01", client: "ISOSPORT", logo: "/images/logo-isosport.png", src: `${V}/video-2s.webp`, category: "Cinematic" },
  { id: "iso-02", client: "ISOSPORT", logo: "/images/logo-isosport.png", src: `${V}/video-6s.webp`, category: "AI Visuals" },
  { id: "iso-03", client: "ISOSPORT", logo: "/images/logo-isosport.png", src: `${V}/video-10s.webp`, category: "Cinematic" },
  { id: "lab-01", client: "VEKTO LAB", logo: "/images/logo.png", src: `${V}/video-4s.webp`, category: "Experimental" },
  { id: "lab-02", client: "VEKTO LAB", logo: "/images/logo.png", src: `${V}/video-8s.webp`, category: "Experimental" },
  { id: "lab-03", client: "VEKTO LAB", logo: "/images/logo.png", src: `${V}/video-12s.webp`, category: "AI Visuals" },
];

type Props = { open: boolean; onClose: () => void };

export default function PortfolioOverlay({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<string>("ALL");
  const [expanded, setExpanded] = useState<Clip | null>(null);

  // Explicit category list so filters show up even before clips for that
  // category exist on Bunny. Add/remove here as the reel library grows.
  const categories = useMemo(
    () => ["ALL", "Short-Form", "Organic", "AI Visuals", "Cinematic", "Experimental"],
    []
  );

  const visible = useMemo(
    () => (filter === "ALL" ? clips : clips.filter((c) => c.category === filter)),
    [filter]
  );

  // Back-button closes the overlay without changing the URL. The overlay is
  // a UI state, not a routable page — a real /work route still exists for
  // case study links (e.g. /work/menscare), and we don't want refresh to
  // land on a duplicate "portfolio" page.
  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open, onClose]);

  // Mount/unmount with animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => setMounted(false), 700);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ESC closes (overlay + expanded preview)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (expanded) setExpanded(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, expanded]);

  if (!mounted) return null;

  return (
    <div
      aria-modal
      role="dialog"
      className={`fixed inset-0 z-[80] ${open ? "po-open" : "po-closing"}`}
    >
      <div aria-hidden className="absolute inset-0 po-dim" />
      <div aria-hidden className="absolute inset-0 po-scanlines" />
      <div aria-hidden className="absolute inset-0 po-vignette" />

      <div className="relative z-10 h-full w-full overflow-y-auto po-content">
        {/* Terminal bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-10 py-3 border-b border-[#c8ff00]/25 bg-black/55 backdrop-blur-sm font-mono text-[10px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-3 text-[#c8ff00]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
            VEKTO/REEL.DB — {visible.length} CLIPS
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#c8ff00]/70 hover:text-[#c8ff00] transition-colors border border-[#c8ff00]/25 hover:border-[#c8ff00]/60 rounded-sm px-3 py-1.5"
            aria-label="Close portfolio"
          >
            <span>× EJECT</span>
          </button>
        </div>

        {/* Single compact filter row — terminal-style pipe-separated tabs.
            No boot log, no giant h1: sticky bar above already says
            "VEKTO/REEL.DB — N CLIPS" so nothing is lost. */}
        <section className="px-6 md:px-10 pt-4 pb-3 max-w-[1500px] mx-auto">
          <nav
            aria-label="Filter clips by category"
            className="flex flex-wrap items-center font-mono text-[10px] uppercase tracking-[0.22em] text-[#c8ff00]/55"
          >
            <span className="opacity-60 mr-2">&gt; FILTER</span>
            {categories.map((cat, i) => {
              const active = filter === cat;
              return (
                <span key={cat} className="flex items-center">
                  {i > 0 && <span aria-hidden className="mx-1.5 opacity-40">|</span>}
                  <button
                    onClick={() => setFilter(cat)}
                    className={`py-0.5 transition-colors ${
                      active
                        ? "text-[#c8ff00] font-bold"
                        : "text-[#c8ff00]/55 hover:text-[#c8ff00]"
                    }`}
                  >
                    {active ? `[${cat}]` : cat}
                  </button>
                </span>
              );
            })}
          </nav>
        </section>

        {/* Reel grid — 9:16 tiles */}
        <section className="px-6 md:px-10 pb-12 max-w-[1500px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {visible.map((c, i) => (
              <ClipTile key={c.id} clip={c} idx={i} onExpand={() => setExpanded(c)} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative px-6 md:px-10 pt-6 pb-20 max-w-[1100px] mx-auto text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-4">] NEXT UP</p>
          <h2 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight mb-5 text-[#eaffb8] po-glow">
            Want to be our<br />
            <span className="text-[#c8ff00]">next case study?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              data-cal-namespace="30min"
              data-cal-link="vekto/30min"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-semibold px-10 py-4 rounded-sm hover:bg-[#d4ff33] transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{ boxShadow: "0 14px 40px -12px rgba(200,255,0,0.55)" }}
            >
              Book a Call
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 border border-[#c8ff00]/40 text-[#c8ff00] font-semibold px-10 py-4 rounded-sm hover:bg-[#c8ff00]/10 transition-colors cursor-pointer font-mono text-sm uppercase tracking-[0.2em]"
            >
              ← Back to desktop
            </button>
          </div>
        </section>
      </div>

      {/* Fullscreen clip preview */}
      {expanded && <ClipLightbox clip={expanded} onClose={() => setExpanded(null)} />}
    </div>
  );
}

/* ---------- Tile ---------- */
function ClipTile({ clip, idx, onExpand }: { clip: Clip; idx: number; onExpand: () => void }) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(clip.src);
  const spanClasses = clip.featured
    ? "md:col-span-2 md:row-span-2"
    : "";

  const Media = (
    <>
      {isVideo ? (
        <video
          src={clip.src}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={clip.src}
          alt={clip.client}
          className="absolute inset-0 w-full h-full object-cover"
          loading={idx < 8 ? "eager" : "lazy"}
        />
      )}

      {/* Phosphor + scanlines + bottom fade */}
      <div className="absolute inset-0 mix-blend-screen opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(200,255,0,0.20), transparent 65%)" }} />
      <div className="absolute inset-0 po-scanlines opacity-60 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78), transparent)" }} />

      {/* Top overlays — logo + metric */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2 pointer-events-none">
        {clip.logo ? (
          <div className="relative w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 p-1">
            <Image src={clip.logo} alt={clip.client} fill className="object-contain p-0.5" />
          </div>
        ) : (
          <span />
        )}
        {clip.metric && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-[#c8ff00] text-black px-1.5 py-0.5 rounded-sm font-bold">
            {clip.metric}
          </span>
        )}
      </div>

      {/* Bottom overlay — client + category */}
      <div className="absolute bottom-2 left-2.5 right-2.5 pointer-events-none">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white font-bold leading-tight">
          {clip.client}
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#c8ff00]/80">
          {clip.category}
        </div>
      </div>

      {/* Hover play indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="w-10 h-10 rounded-full border border-[#c8ff00] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="#c8ff00"><path d="M2 1l9 5-9 5V1z" /></svg>
        </div>
      </div>
    </>
  );

  const tileClass = `group relative aspect-[9/16] overflow-hidden rounded-sm border border-[#c8ff00]/20 hover:border-[#c8ff00]/60 bg-black transition-colors cursor-pointer ${spanClasses}`;

  const bootDelay = Math.min(idx, 14) * 70;
  const sweepDelay = bootDelay + 380;

  return (
    <button
      onClick={onExpand}
      className={tileClass}
      style={{
        animation: `poTileBoot 0.9s cubic-bezier(0.2,0.75,0.35,1) ${bootDelay}ms backwards`,
        transformOrigin: "center",
      }}
    >
      {Media}
      {/* Bright green scan-sweep that rolls through each tile on entry */}
      <div
        aria-hidden
        className="absolute inset-x-0 h-[14%] pointer-events-none mix-blend-screen"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(200,255,0,0.55) 45%, rgba(232,255,120,0.9) 50%, rgba(200,255,0,0.55) 55%, transparent)",
          filter: "blur(1px)",
          animation: `poTileSweep 0.75s cubic-bezier(0.35,0,0.6,1) ${sweepDelay}ms backwards`,
        }}
      />
      {clip.href && (
        <Link
          href={clip.href}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2 right-2 z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-[#c8ff00] hover:text-white bg-black/50 border border-[#c8ff00]/40 px-1.5 py-0.5 rounded-sm"
        >
          case →
        </Link>
      )}
    </button>
  );
}

/* ---------- Fullscreen preview ---------- */
function ClipLightbox({ clip, onClose }: { clip: Clip; onClose: () => void }) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(clip.src);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[420px] aspect-[9/16] rounded-sm overflow-hidden border border-[#c8ff00]/40 bg-black"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 30px 80px -20px rgba(200,255,0,0.35)" }}
      >
        {isVideo ? (
          <video
            src={clip.src}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            playsInline
            controls
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={clip.src} alt={clip.client} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 po-scanlines opacity-40 pointer-events-none" />
        <div className="absolute top-2 right-2 flex gap-2">
          {clip.href && (
            <Link
              href={clip.href}
              className="font-mono text-[10px] uppercase tracking-[0.25em] bg-[#c8ff00] text-black px-3 py-1.5 rounded-sm font-bold"
            >
              case →
            </Link>
          )}
          <button
            onClick={onClose}
            className="font-mono text-[10px] uppercase tracking-[0.25em] border border-[#c8ff00]/50 text-[#c8ff00] bg-black/60 px-3 py-1.5 rounded-sm hover:bg-[#c8ff00]/10"
            aria-label="Close preview"
          >
            × close
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 pointer-events-none">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-white font-bold">{clip.client}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#c8ff00]/80">{clip.category}</div>
          </div>
          {clip.metric && (
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] bg-[#c8ff00] text-black px-2 py-1 rounded-sm font-bold">
              {clip.metric}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
