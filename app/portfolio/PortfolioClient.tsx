"use client";

import Link from "next/link";
import type { CaseStudy } from "../case-studies/CaseStudiesClient";
import { useEffect, useRef, useState } from "react";
import { getCalApi } from "@calcom/embed-react";
import bunnyData from "../data/bunny-clips.json";
import { useT } from "../i18n/LangProvider";

// Lighter preview-video URL — Bunny: 1080p → 480p; local: file.mp4 → file-480p.mp4.
// Both forms exist in /public/videos for our local clips, and Bunny serves the
// 480p rendition for every uploaded clip. Lightbox keeps the original 1080p/full.
function previewVideoUrl(src: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("/")) return src.replace(/\.mp4$/, "-480p.mp4");
  return src.replace("play_1080p.mp4", "play_480p.mp4");
}

export type Clip = {
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
  // Hero-only flag — clip stays in bunny-clips.json so the homepage Hero
  // (heroFeaturedClipIds in hero-featured-clips.ts) can keep referencing
  // it, but it does NOT appear in the /portfolio grid. Used for the
  // no-subtitles "atmospheric" version of vekto-showreel which is
  // duplicated by the subtitled 06b550bb agency reel in the portfolio.
  excludeFromPortfolio?: boolean;
  // Spoken / on-screen language. The site is English only, so Bulgarian
  // cuts stay in the data (hero, /hospitality) but out of the grid.
  language?: "en" | "bg";
  // Filmed with real people and places, or made with AI. Drives the
  // homepage work tabs.
  kind?: "real" | "ai";
  // Groups a clip onto /hospitality — the English-only tab we send to
  // hotels and villa owners. "hotel" = a place people stay in, "property"
  // = a building we sold on camera. Kept apart so the page never implies
  // a residential development was a hotel client.
  hospitality?: "hotel" | "property";
};

const clips = (bunnyData.clips as Clip[]).filter((c) => !c.excludeFromPortfolio);

// The work in two runs: English first, then a labelled rule, then the
// Bulgarian cuts. The site is English, so the English work leads; the
// Bulgarian work stays visible below the line instead of being hidden.
export function ClipSections({
  clips,
  onExpand,
}: {
  clips: Clip[];
  onExpand: (c: Clip) => void;
}) {
  const en = clips.filter((c) => c.language !== "bg");
  const bg = clips.filter((c) => c.language === "bg");
  const grid =
    "grid grid-flow-dense grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-7 auto-rows-auto";
  return (
    <>
      <div className={grid}>
        {en.map((c, i) => (
          <ClipTile key={c.id} clip={c} idx={i} onExpand={() => onExpand(c)} />
        ))}
      </div>
      {bg.length > 0 && (
        <>
          <div className="flex items-center gap-4 md:gap-6 my-10 md:my-14" role="separator" aria-label="Bulgarian-language work">
            <span aria-hidden className="h-px flex-1" style={{ background: "rgba(244,244,244,0.3)" }} />
            <span className="shrink-0 font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-[#f4f4f4]/70">
              Bulgarian-language work · {bg.length}
            </span>
            <span aria-hidden className="h-px flex-1" style={{ background: "rgba(244,244,244,0.3)" }} />
          </div>
          <div className={grid}>
            {bg.map((c, i) => (
              <ClipTile key={c.id} clip={c} idx={en.length + i} onExpand={() => onExpand(c)} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

// The portfolio is split into tabs, one per kind of work. Tabs with
// nothing in them yet show a "Coming soon" panel until content lands. The open tab lives in the URL
// hash (/portfolio#cases), so every tab has its own link.
type WorkTabId = "ai" | "real" | "sites" | "cases";

// Websites the owner will add: a screenshot in /images/sites, name, type
// of build, a few tags; `href` only for a site on its own domain.
const SITES: { name: string; type: string; img: string; href?: string; tags: string[] }[] = [];

// Case studies shown on this page. Empty for now, by the owner's call;
// fill with entries shaped like the case-studies page data.
const CASES: CaseStudy[] = [];

function WorkTabs({ clips, onExpand }: { clips: Clip[]; onExpand: (c: Clip) => void }) {
  const ai = clips.filter((c) => c.kind !== "real");
  const real = clips.filter((c) => c.kind === "real");
  const tabs: { id: WorkTabId; label: string; count: number }[] = [
    { id: "ai", label: "AI videos", count: ai.length },
    { id: "real", label: "Real videos", count: real.length },
    { id: "sites", label: "Websites", count: SITES.length },
    { id: "cases", label: "Case studies", count: CASES.length },
  ];

  const [tab, setTab] = useState<WorkTabId>("ai");

  // Open the tab named in the hash, and follow back/forward between tabs.
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "") as WorkTabId;
      if (tabs.some((tb) => tb.id === h)) setTab(h);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (id: WorkTabId) => {
    setTab(id);
    history.replaceState(null, "", id === "ai" ? window.location.pathname : `#${id}`);
  };

  const tag = "px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] opacity-75 font-mono";
  const tagStyle = { border: "1px solid rgba(244,244,244,0.35)" };

  return (
    <>
      <div
        role="tablist"
        aria-label="Work by type"
        className="flex gap-2 md:gap-3 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 mb-8 md:mb-10 [scrollbar-width:none]"
      >
        {tabs.map((tb) => {
          const active = tb.id === tab;
          return (
            <button
              key={tb.id}
              type="button"
              role="tab"
              id={`work-tab-${tb.id}`}
              aria-selected={active}
              aria-controls="work-panel"
              onClick={() => pick(tb.id)}
              className={`shrink-0 flex items-center gap-2.5 border-[1.5px] px-4 md:px-5 py-2.5 md:py-3 font-black uppercase text-[12px] md:text-[13px] tracking-[0.14em] transition-colors ${
                active
                  ? "bg-[#f4f4f4] text-[#0d0d0d] border-[#f4f4f4]"
                  : "bg-transparent text-[#f4f4f4] border-[#f4f4f4]/55 hover:bg-white hover:text-black"
              }`}
              style={{ boxShadow: active ? "4px 4px 0 0 #3a3a3a" : undefined }}
            >
              {tb.label}
              {tb.count > 0 && (
                <span className="font-mono text-[10px] font-bold tabular-nums opacity-60">{tb.count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div id="work-panel" role="tabpanel" aria-labelledby={`work-tab-${tab}`}>
        {(tab === "ai" || tab === "real") && (tab === "real" ? real : ai).length > 0 && (
          <ClipSections clips={tab === "real" ? real : ai} onExpand={onExpand} />
        )}

        {((tab === "real" && real.length === 0) ||
          (tab === "sites" && SITES.length === 0) ||
          (tab === "cases" && CASES.length === 0)) && (
          <div className="border-2 border-dashed border-[#f4f4f4]/25 px-6 py-16 md:py-24 flex flex-col items-center text-center gap-3">
            <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.35em] text-[#f4f4f4]/55">
              {tab === "real" ? "Real videos" : tab === "sites" ? "Websites" : "Case studies"}
            </p>
            <p className="font-black uppercase text-[26px] md:text-[40px] leading-none tracking-[-0.02em] text-[#f4f4f4]">
              Coming soon.
            </p>
          </div>
        )}

        {tab === "sites" && SITES.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {SITES.map((st) => {
              const body = (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={st.img} alt={`${st.name} website`} loading="lazy" className="w-full aspect-[1200/616] object-cover object-top border-b-2 border-[#f4f4f4]/25" />
                  <div className="p-5 md:p-6 flex flex-col gap-3 text-[#f4f4f4]">
                    <h3 className="font-black uppercase text-[18px] md:text-[20px]">{st.name}</h3>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] opacity-60">{st.type}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {st.tags.map((tg) => (
                        <span key={tg} className={tag} style={tagStyle}>{tg}</span>
                      ))}
                    </div>
                  </div>
                </>
              );
              const cls = "block border-2 border-[#f4f4f4]/30 bg-[#141414] overflow-hidden";
              return st.href ? (
                <a key={st.name} href={st.href} target="_blank" rel="noopener noreferrer" className={`${cls} transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5`} style={{ boxShadow: "6px 6px 0 0 #2a2a2a" }}>{body}</a>
              ) : (
                <div key={st.name} className={cls} style={{ boxShadow: "6px 6px 0 0 #2a2a2a" }}>{body}</div>
              );
            })}
          </div>
        )}

        {tab === "cases" && CASES.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {CASES.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies#${cs.slug}`}
                className="flex flex-col border-2 border-[#f4f4f4]/30 bg-[#141414] overflow-hidden text-[#f4f4f4] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{ boxShadow: "6px 6px 0 0 #2a2a2a" }}
              >
                <div className="h-24 md:h-28 flex items-center justify-center bg-white px-8 border-b-2 border-black">
                  {cs.brandLogo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={cs.brandLogo} alt={cs.brand} loading="lazy" className="max-h-12 md:max-h-14 max-w-[70%] object-contain" />
                  ) : (
                    <span className="font-black uppercase text-[#0d0d0d]">{cs.brand}</span>
                  )}
                </div>
                <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">
                    {cs.brand} · {cs.category}
                  </p>
                  <h3 className="font-black text-[17px] md:text-[19px] leading-[1.2] text-balance">{cs.headline.en}</h3>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {cs.services.map((sv) => (
                      <span key={sv} className={tag} style={tagStyle}>{sv}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function PortfolioClient() {
  const [expanded, setExpanded] = useState<Clip | null>(null);
  const t = useT({
    bg: {
      header: "РАБОТАТА",
      clipsSuffix: "ВИДЕА",
      back: "Назад",
      filter: "> ФИЛТЪР",
      categories: [
        { id: "ALL", label: "ВСИЧКИ" },
        { id: "Product", label: "Продуктово" },
        { id: "Organic", label: "Органично" },
        { id: "UGC", label: "UGC" },
        { id: "Cinematic", label: "Кинематографично" },
        { id: "Animation", label: "Анимация" },
        { id: "Experimental", label: "Експериментално" },
      ],
      ctaH2Top: "Искаш ли да си",
      ctaH2Bottom: "следващата ни история?",
      bookCta: "Резервирай разговор",
      backToHome: "← Обратно към сайта",
    },
    en: {
      header: "THE WORK",
      clipsSuffix: "VIDEOS",
      back: "Back",
      filter: "> FILTER",
      categories: [
        { id: "ALL", label: "ALL" },
        { id: "Product", label: "Product" },
        { id: "Organic", label: "Organic" },
        { id: "UGC", label: "UGC" },
        { id: "Cinematic", label: "Cinematic" },
        { id: "Animation", label: "Animation" },
        { id: "Experimental", label: "Experimental" },
      ],
      ctaH2Top: "Want to be our",
      ctaH2Bottom: "next case study?",
      bookCta: "Book a Call",
      backToHome: "← Back to home",
    },
  });
  const visible = clips;

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
          light: { "cal-brand": "#f4f4f4" },
          dark: { "cal-brand": "#f4f4f4" },
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
        className="sticky top-[56px] md:top-[76px] z-30 flex items-center justify-between px-6 md:px-10 py-3 border-b border-[#f4f4f4]/45 font-mono text-[11px] uppercase tracking-[0.3em]"
        style={{
          background: "#161616",
          boxShadow: "0 2px 0 rgba(244,244,244,0.18), 0 10px 24px -12px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-center gap-3 text-[#f4f4f4]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f4f4f4] animate-pulse" />
          {t.header}
        </div>
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#0d0d0d] bg-[#f4f4f4] px-4 py-2 font-black transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          style={{ boxShadow: "3px 3px 0 0 #3a3a3a" }}
          aria-label={t.back}
        >
          <span aria-hidden>←</span>
          <span>{t.back}</span>
        </Link>
      </div>

      <section className="px-6 md:px-12 pt-6 md:pt-8 pb-16 max-w-[1240px] mx-auto">
        {/* grid-flow-dense lets portrait tiles backfill the empty cells
            that landscape (col-span-2) clips would otherwise leave when
            they don't fit at the end of a row. */}
        <WorkTabs clips={visible} onExpand={setExpanded} />
      </section>

      <section className="relative px-6 md:px-10 pt-6 pb-20 max-w-[1100px] mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight mb-5 text-[#f4f4f4] po-glow text-balance">
          {t.ctaH2Top}<br />
          <span className="text-[#f4f4f4]">{t.ctaH2Bottom}</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            data-cal-namespace="30min"
            data-cal-link="vekto/30min"
            data-cal-config='{"layout":"month_view","theme":"dark"}'
            className="inline-flex items-center justify-center gap-2 bg-[#f4f4f4] text-[#0d0d0d] font-black uppercase tracking-[0.15em] text-[13px] px-10 py-4 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-pointer"
            style={{ boxShadow: "4px 4px 0 0 #3a3a3a" }}
          >
            {t.bookCta}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-[1.5px] border-[#f4f4f4]/75 text-[#f4f4f4] px-10 py-4 hover:bg-white hover:text-black transition-colors cursor-pointer font-mono text-sm uppercase tracking-[0.2em] font-bold"
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

/**
 * ClipTile — interactive grid cell. Hover-to-play preview:
 *
 * - DESKTOP (fine pointer): on first mouseenter, lazy-mounts the -480p
 *   video and crossfades it in over the static thumbnail; mouseleave
 *   pauses + rewinds + crossfades back to thumb. Click → lightbox plays
 *   the full clip with audio.
 *
 * - MOBILE (coarse pointer): stays as a static thumbnail. Tap opens the
 *   lightbox where the full clip plays with audio.
 *
 * Why no autoplay on mobile: iOS Safari caps concurrent video decoders,
 * and even the -480p variants are 1-3 MB each — 20+ of them auto-fetching
 * as the user scrolls would burn ~50 MB on a metered connection for a
 * single page view.
 */
export function ClipTile({
  clip,
  idx,
  onExpand,
}: {
  clip: Clip;
  idx: number;
  onExpand: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hover state — desktop only (devices with a fine pointer). Detected on
  // first mouseenter so we never mount the <video> on touch screens.
  const [isHovered, setIsHovered] = useState(false);
  // The <video> element only enters the DOM after the first hover.
  const [hasMountedVideo, setHasMountedVideo] = useState(false);
  // Pause our tile while a lightbox is playing (vekto:player-open event).
  // Frees the watched clip's decoder + bandwidth.
  const [coveredByOverlay, setCoveredByOverlay] = useState(false);
  // Video painted over the thumbnail (crossfade opacity target).
  const [videoVisible, setVideoVisible] = useState(false);

  const isLandscape = clip.portrait === false;
  // Landscape tiles are centered on the wider grids — looks more deliberate
  // than the dense-flow default which parks them at whichever edge has a
  // 2-wide gap. lg:col-start-2 puts a col-span-2 tile in the middle 2 of
  // 4 cols (cols 2-3). sm has 3 cols so col-span-3 takes the whole row.
  // Mobile (2 cols) is already full-width via col-span-2 alone.
  const cellClass = isLandscape
    ? "aspect-video col-span-2 sm:col-span-3 lg:col-start-2 lg:col-span-2"
    : "aspect-[9/16]";
  const tileClass = `group relative ${cellClass} overflow-hidden rounded-sm border border-[#f4f4f4]/20 hover:border-[#f4f4f4]/60 bg-black transition-colors cursor-pointer`;
  const bootDelay = Math.min(idx, 8) * 18;
  const durationLabel = formatDuration(clip.duration);
  const videoSrc = previewVideoUrl(clip.previewMp4);

  useEffect(() => {
    const onOpen = () => setCoveredByOverlay(true);
    const onClose = () => setCoveredByOverlay(false);
    window.addEventListener("vekto:player-open", onOpen);
    window.addEventListener("vekto:player-closed", onClose);
    return () => {
      window.removeEventListener("vekto:player-open", onOpen);
      window.removeEventListener("vekto:player-closed", onClose);
    };
  }, []);

  // Hover handlers — fine-pointer only. The first hover is what flips
  // hasMountedVideo, so the <video> element doesn't exist in the DOM
  // until the user actively interacts with this tile.
  const handlePointerEnter: React.PointerEventHandler<HTMLButtonElement> = (e) => {
    if (e.pointerType !== "mouse") return;
    setIsHovered(true);
    if (!hasMountedVideo) setHasMountedVideo(true);
  };
  const handlePointerLeave: React.PointerEventHandler<HTMLButtonElement> = (e) => {
    if (e.pointerType !== "mouse") return;
    setIsHovered(false);
  };

  const shouldPlay = !coveredByOverlay && isHovered;
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (shouldPlay) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [shouldPlay]);

  return (
    <button
      onClick={onExpand}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
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
        className={`absolute inset-0 w-full h-full object-cover transition-[transform,opacity] duration-700 ${
          videoVisible ? "opacity-0" : "opacity-100"
        } ${isHovered ? "scale-[1.04]" : "scale-100"}`}
        loading={idx < 6 ? "eager" : "lazy"}
        decoding="async"
      />

      {hasMountedVideo && videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="metadata"
          onPlaying={() => setVideoVisible(true)}
          onPause={() => setVideoVisible(false)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            videoVisible && shouldPlay ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {durationLabel && (
        <div className="absolute top-2 right-2 z-[2] font-mono text-[9px] tracking-[0.15em] text-white/90 bg-black/65 border border-[#f4f4f4]/30 px-1.5 py-0.5 rounded-sm pointer-events-none">
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
        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#f4f4f4]/80">
          {clip.category}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="w-12 h-12 rounded-full border border-[#f4f4f4] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="#f4f4f4">
            <path d="M2 1l9 5-9 5V1z" />
          </svg>
        </div>
      </div>
    </button>
  );
}

export function ClipLightbox({ clip, onClose }: { clip: Clip; onClose: () => void }) {
  const isLandscape = clip.portrait === false;
  const frameStyle: React.CSSProperties = isLandscape
    ? {
        aspectRatio: "16 / 9",
        width: "min(92vw, 1280px)",
        maxHeight: "85vh",
        boxShadow: "0 30px 80px -20px rgba(244,244,244,0.35)",
      }
    : {
        aspectRatio: "9 / 16",
        height: "min(85vh, 780px)",
        maxWidth: "92vw",
        boxShadow: "0 30px 80px -20px rgba(244,244,244,0.35)",
      };
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative rounded-sm overflow-hidden border border-[#f4f4f4]/40 bg-black vekto-player"
        onClick={(e) => e.stopPropagation()}
        style={frameStyle}
      >
        {clip.embedUrl ? (
          <iframe
            src={(() => {
              const u = new URL(clip.embedUrl);
              u.searchParams.delete("preload");
              u.searchParams.set("iframe_color", "f4f4f4");
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
            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#f4f4f4]/80 truncate">
              {clip.category}
            </div>
          </div>
          <button
            onClick={onClose}
            className="pointer-events-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] border border-[#f4f4f4]/50 text-[#f4f4f4] bg-black/60 px-3 py-1.5 rounded-sm hover:bg-[#f4f4f4]/10"
            aria-label="Close preview"
          >
            × close
          </button>
        </div>
      </div>
    </div>
  );
}
