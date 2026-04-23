"use client";

import { useEffect, useMemo, useState } from "react";
import bunnyData from "../data/bunny-clips.json";

type Clip = {
  id: string;
  brand: string;
  logo?: string;
  category: string;
  description: string;
  thumbnail: string;            // static image (Bunny CDN or local placeholder)
  previewMp4: string | null;    // Bunny direct MP4 — used as fallback if iframe fails
  hlsPlaylist: string | null;   // Bunny HLS .m3u8 — reserved for future hls.js use
  embedUrl: string | null;      // Bunny iframe embed — used inside lightbox
  duration: number | null;
  metric?: string | null;
  href?: string | null;
  featured?: boolean;
};

const clips = bunnyData.clips as Clip[];

type Props = { open: boolean; onClose: () => void };

export default function PortfolioOverlay({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<string>("ALL");
  const [expanded, setExpanded] = useState<Clip | null>(null);

  // Explicit category list — must match the values used in Bunny titles
  // ("BRAND | CATEGORY | DESCRIPTION"). scripts/fetch-bunny-clips.mjs warns
  // if a clip's category doesn't match one of these.
  const categories = useMemo(
    () => ["ALL", "Short-Form", "Organic", "AI Visuals", "Cinematic", "Experimental"],
    []
  );

  const visible = useMemo(
    () => (filter === "ALL" ? clips : clips.filter((c) => c.category === filter)),
    [filter]
  );

  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open, onClose]);

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
      <div aria-hidden className="absolute inset-0 po-vignette" />

      <div className="relative z-10 h-full w-full overflow-y-auto po-content">
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-10 py-3 border-b border-[#c8ff00]/25 bg-black/90 font-mono text-[10px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-3 text-[#c8ff00]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
            VEKTO/REEL.DB — {visible.length} CLIPS
          </div>
          <button
            onClick={onClose}
            className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-black bg-[#c8ff00] hover:bg-[#e0ff4a] border border-[#c8ff00] px-4 py-2 rounded-sm font-bold transition-colors shadow-[0_0_20px_rgba(200,255,0,0.35)]"
            aria-label="Close portfolio"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M6 1L2 5L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
            <span>Back</span>
          </button>
        </div>

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

        <section className="px-6 md:px-12 pb-16 max-w-[1240px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-7">
            {visible.map((c, i) => (
              <ClipTile key={c.id} clip={c} idx={i} onExpand={() => setExpanded(c)} />
            ))}
          </div>
        </section>

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

      {expanded && <ClipLightbox clip={expanded} onClose={() => setExpanded(null)} />}
    </div>
  );
}

/* ---------- Tile — static thumbnail, description reveal on hover ---------- */
function ClipTile({ clip, idx, onExpand }: { clip: Clip; idx: number; onExpand: () => void }) {
  // Light staggered offset so the grid reads as a layout rather than
  // a spreadsheet. Pattern repeats every 4 cols: 0, 12, 6, 18 px down.
  const mod = idx % 4;
  const staggerClass =
    mod === 1 ? "lg:translate-y-3" : mod === 2 ? "lg:translate-y-6" : mod === 3 ? "lg:translate-y-9" : "";
  const tileClass = `group relative aspect-[9/16] overflow-hidden rounded-sm border border-[#c8ff00]/20 hover:border-[#c8ff00]/60 bg-black transition-colors cursor-pointer ${staggerClass}`;
  const bootDelay = Math.min(idx, 14) * 50;

  return (
    <button
      onClick={onExpand}
      className={tileClass}
      style={{
        animation: `poTileBoot 0.55s cubic-bezier(0.25,0.8,0.3,1) ${bootDelay}ms backwards`,
        transformOrigin: "center",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={clip.thumbnail}
        alt={`${clip.brand} — ${clip.description}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        loading={idx < 6 ? "eager" : "lazy"}
        decoding="async"
      />

      <div className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0.3) 60%, transparent)" }} />

      <div className="absolute bottom-2 left-2.5 right-2.5 pointer-events-none">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white font-bold leading-tight">
          {clip.brand}
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#c8ff00]/80 mb-1">
          {clip.category}
        </div>
        <p className="text-[11px] leading-snug text-white/85 max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-300 line-clamp-3">
          {clip.description}
        </p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="w-12 h-12 rounded-full border border-[#c8ff00] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="#c8ff00"><path d="M2 1l9 5-9 5V1z" /></svg>
        </div>
      </div>

    </button>
  );
}

/* ---------- Lightbox — Bunny iframe embed when available, MP4 fallback ---------- */
function ClipLightbox({ clip, onClose }: { clip: Clip; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative rounded-sm overflow-hidden border border-[#c8ff00]/40 bg-black vekto-player"
        onClick={(e) => e.stopPropagation()}
        style={{
          aspectRatio: "9 / 16",
          height: "min(85vh, 780px)",
          maxWidth: "92vw",
          boxShadow: "0 30px 80px -20px rgba(200,255,0,0.35)",
        }}
      >
        {clip.embedUrl ? (
          <iframe
            src={clip.embedUrl}
            className="absolute inset-0 w-full h-full"
            loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${clip.brand} — ${clip.description}`}
          />
        ) : clip.previewMp4 ? (
          <video
            src={clip.previewMp4}
            poster={clip.thumbnail}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            playsInline
            controls
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={clip.thumbnail} alt={clip.brand} className="absolute inset-0 w-full h-full object-cover" />
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 font-mono text-[10px] uppercase tracking-[0.25em] border border-[#c8ff00]/50 text-[#c8ff00] bg-black/60 px-3 py-1.5 rounded-sm hover:bg-[#c8ff00]/10"
          aria-label="Close preview"
        >
          × close
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-white font-bold leading-tight">
            {clip.brand}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#c8ff00]/80 mb-1">
            {clip.category}
          </div>
          {clip.description && (
            <p className="text-[12px] leading-snug text-white/85">{clip.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
