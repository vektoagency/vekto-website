"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCalApi } from "@calcom/embed-react";
import bunnyData from "../data/bunny-clips.json";
import { useT } from "../i18n/LangProvider";

type Clip = {
  id: string;
  brand: string;
  logo?: string;
  category: string;
  description: string;
  thumbnail: string;
  previewMp4: string | null;
  hlsPlaylist: string | null;
  embedUrl: string | null;
  duration: number | null;
  width?: number | null;
  height?: number | null;
  portrait?: boolean;
  metric?: string | null;
  href?: string | null;
  featured?: boolean;
};

const clips = bunnyData.clips as Clip[];

export default function PortfolioClient() {
  const [filter, setFilter] = useState<string>("ALL");
  const [expanded, setExpanded] = useState<Clip | null>(null);
  const t = useT({
    bg: {
      header: "ИЗБРАНА РАБОТА",
      clipsSuffix: "ФИЛМА",
      back: "Назад",
      filter: "> ФИЛТЪР",
      categories: [
        { id: "ALL", label: "ВСИЧКИ" },
        { id: "Product", label: "Продуктово" },
        { id: "Organic", label: "Органично" },
        { id: "UGC", label: "UGC" },
        { id: "Cinematic", label: "Кинематографично" },
        { id: "Experimental", label: "Експериментално" },
      ],
      nextUp: "СЛЕДВАЩ",
      ctaH2Top: "Искаш ли да си",
      ctaH2Bottom: "следващата ни история?",
      bookCta: "Резервирай разговор",
      backToHome: "← Обратно към сайта",
    },
    en: {
      header: "SELECTED WORK",
      clipsSuffix: "FILMS",
      back: "Back",
      filter: "> FILTER",
      categories: [
        { id: "ALL", label: "ALL" },
        { id: "Product", label: "Product" },
        { id: "Organic", label: "Organic" },
        { id: "UGC", label: "UGC" },
        { id: "Cinematic", label: "Cinematic" },
        { id: "Experimental", label: "Experimental" },
      ],
      nextUp: "NEXT UP",
      ctaH2Top: "Want to be our",
      ctaH2Bottom: "next case study?",
      bookCta: "Book a Call",
      backToHome: "← Back to home",
    },
  });
  const categories = t.categories;

  const visible = useMemo(
    () => (filter === "ALL" ? clips : clips.filter((c) => c.category === filter)),
    [filter]
  );

  // ESC closes the lightbox (page itself stays open).
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  // Cal.com embed init — bottom CTA opens a 30-min booking modal in
  // the lime VEKTO brand colour. Same pattern as /, /start, /flashka.
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#c8ff00" },
          dark: { "cal-brand": "#c8ff00" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  // Signal the rest of the app (Hero R3F bg, mobile preview tiles)
  // to pause expensive work while a clip is playing in the lightbox.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(expanded ? "vekto:player-open" : "vekto:player-closed"));
    return () => {
      if (expanded) window.dispatchEvent(new Event("vekto:player-closed"));
    };
  }, [expanded]);

  return (
    <>
      {/* DB-style page header — matches the look the overlay used */}
      <div
        className="sticky top-16 z-30 flex items-center justify-between px-6 md:px-10 py-3 border-b border-[#c8ff00]/45 font-mono text-[11px] uppercase tracking-[0.3em]"
        style={{
          background: "#161616",
          boxShadow: "0 2px 0 rgba(200,255,0,0.18), 0 10px 24px -12px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-center gap-3 text-[#c8ff00]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
          {t.header} — {visible.length} {t.clipsSuffix}
        </div>
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-black bg-[#c8ff00] hover:bg-[#e0ff4a] border border-[#c8ff00] px-4 py-2 rounded-sm font-bold transition-colors shadow-[0_0_20px_rgba(200,255,0,0.35)]"
          aria-label={t.back}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M6 1L2 5L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
          <span>{t.back}</span>
        </Link>
      </div>

      <section className="px-6 md:px-10 pt-5 pb-4 max-w-[1500px] mx-auto">
        <nav
          aria-label="Filter clips by category"
          className="flex flex-wrap items-center gap-x-0.5 md:gap-x-1 gap-y-1.5 font-mono text-[10px] md:text-[14px] uppercase tracking-[0.14em] md:tracking-[0.18em] text-[#c8ff00] rounded-md border border-[#c8ff00]/25 px-2.5 md:px-3 py-1.5 md:py-2.5 font-semibold"
          style={{
            background: "linear-gradient(135deg, rgba(200,255,0,0.06) 0%, rgba(200,255,0,0.02) 100%)",
            boxShadow: "inset 0 0 0 1px rgba(200,255,0,0.05), 0 0 22px -10px rgba(200,255,0,0.35)",
          }}
        >
          <span className="mr-1.5 md:mr-3 text-[9px] md:text-[12px] text-[#c8ff00]">{t.filter}</span>
          {categories.map((cat, i) => {
            const active = filter === cat.id;
            return (
              <span key={cat.id} className="flex items-center">
                {i > 0 && <span aria-hidden className="mx-1 md:mx-2 text-[#c8ff00]/45">|</span>}
                <button
                  onClick={() => setFilter(cat.id)}
                  className={`py-0.5 md:py-1 px-0.5 md:px-1 transition-colors ${
                    active
                      ? "text-[#c8ff00] font-bold"
                      : "text-[#c8ff00] hover:text-white"
                  }`}
                >
                  {active ? `[${cat.label}]` : cat.label}
                </button>
              </span>
            );
          })}
        </nav>
      </section>

      <section className="px-6 md:px-12 pb-16 max-w-[1240px] mx-auto">
        {/* grid-flow-dense lets portrait tiles backfill the empty cells
            that landscape (col-span-2) clips would otherwise leave when
            they don't fit at the end of a row. */}
        <div className="grid grid-flow-dense grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-7 auto-rows-auto">
          {visible.map((c, i) => (
            <ClipTile key={c.id} clip={c} idx={i} onExpand={() => setExpanded(c)} />
          ))}
        </div>
      </section>

      <section className="relative px-6 md:px-10 pt-6 pb-20 max-w-[1100px] mx-auto text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-4">{t.nextUp}</p>
        <h2 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight mb-5 text-[#eaffb8] po-glow text-balance">
          {t.ctaH2Top}<br />
          <span className="text-[#c8ff00]">{t.ctaH2Bottom}</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            data-cal-namespace="30min"
            data-cal-link="vekto/30min"
            data-cal-config='{"layout":"month_view","theme":"dark"}'
            className="inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-semibold px-10 py-4 rounded-sm hover:bg-[#d4ff33] transition-all hover:-translate-y-0.5 cursor-pointer"
            style={{ boxShadow: "0 14px 40px -12px rgba(200,255,0,0.55)" }}
          >
            {t.bookCta}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-[#c8ff00]/40 text-[#c8ff00] font-semibold px-10 py-4 rounded-sm hover:bg-[#c8ff00]/10 transition-colors cursor-pointer font-mono text-sm uppercase tracking-[0.2em]"
          >
            {t.backToHome}
          </Link>
        </div>
      </section>

      {expanded && <ClipLightbox clip={expanded} onClose={() => setExpanded(null)} />}
    </>
  );
}

function formatDuration(seconds: number | null | undefined): string | null {
  if (!seconds || seconds < 1) return null;
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function ClipTile({ clip, idx, onExpand }: { clip: Clip; idx: number; onExpand: () => void }) {
  const isLandscape = clip.portrait === false;
  const aspectClass = isLandscape ? "aspect-video col-span-2" : "aspect-[9/16]";
  const tileClass = `group relative ${aspectClass} overflow-hidden rounded-sm border border-[#c8ff00]/20 hover:border-[#c8ff00]/60 bg-black transition-colors cursor-pointer`;
  const bootDelay = Math.min(idx, 8) * 18;
  const durationLabel = formatDuration(clip.duration);

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

      {durationLabel && (
        <div className="absolute top-2 right-2 z-[2] font-mono text-[9px] tracking-[0.15em] text-white/90 bg-black/65 border border-[#c8ff00]/30 px-1.5 py-0.5 rounded-sm pointer-events-none">
          {durationLabel}
        </div>
      )}

      <div
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0.3) 60%, transparent)" }}
      />

      <div className="absolute bottom-2 left-2.5 right-2.5 pointer-events-none">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white font-bold leading-tight">
          {clip.brand}
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#c8ff00]/80">
          {clip.category}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="w-12 h-12 rounded-full border border-[#c8ff00] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="#c8ff00"><path d="M2 1l9 5-9 5V1z" /></svg>
        </div>
      </div>
    </button>
  );
}

function ClipLightbox({ clip, onClose }: { clip: Clip; onClose: () => void }) {
  const isLandscape = clip.portrait === false;
  const frameStyle: React.CSSProperties = isLandscape
    ? {
        aspectRatio: "16 / 9",
        width: "min(92vw, 1280px)",
        maxHeight: "85vh",
        boxShadow: "0 30px 80px -20px rgba(200,255,0,0.35)",
      }
    : {
        aspectRatio: "9 / 16",
        height: "min(85vh, 780px)",
        maxWidth: "92vw",
        boxShadow: "0 30px 80px -20px rgba(200,255,0,0.35)",
      };
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative rounded-sm overflow-hidden border border-[#c8ff00]/40 bg-black vekto-player"
        onClick={(e) => e.stopPropagation()}
        style={frameStyle}
      >
        {clip.embedUrl ? (
          <iframe
            src={(() => {
              const u = new URL(clip.embedUrl);
              u.searchParams.delete("preload");
              u.searchParams.set("iframe_color", "c8ff00");
              return u.toString();
            })()}
            className="absolute inset-0 w-full h-full"
            loading="eager"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${clip.brand} — ${clip.description}`}
          />
        ) : clip.previewMp4 ? (
          <video
            src={clip.previewMp4}
            poster={clip.thumbnail}
            className="absolute inset-0 w-full h-full object-cover vekto-native-video"
            autoPlay
            playsInline
            controls
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={clip.thumbnail} alt={clip.brand} className="absolute inset-0 w-full h-full object-cover" />
        )}

        <div className="absolute top-0 left-0 right-0 z-10 flex items-start justify-between gap-2 p-2.5 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none">
          <div className="min-w-0 flex-1 py-1.5">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white font-bold leading-tight truncate">
              {clip.brand}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#c8ff00]/80 truncate">
              {clip.category}
            </div>
          </div>
          <button
            onClick={onClose}
            className="pointer-events-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] border border-[#c8ff00]/50 text-[#c8ff00] bg-black/60 px-3 py-1.5 rounded-sm hover:bg-[#c8ff00]/10"
            aria-label="Close preview"
          >
            × close
          </button>
        </div>
      </div>
    </div>
  );
}
