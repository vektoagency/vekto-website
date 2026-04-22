"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { openContactModal } from "../components/ContactModal";

type Project = {
  client: string;
  logo: string;
  circularLogo?: boolean;
  poster: string;          // still fallback
  reel: string[];          // video-webp files that form the reel
  title: string;
  tagline: string;
  categories: string[];
  year: string;
  metric?: { value: string; label: string };
  href?: string | null;
  featured?: boolean;
};

const V = "/images/hero-anim";
const projects: Project[] = [
  {
    client: "MEN'S CARE",
    logo: "/images/logo-menscare.png",
    circularLogo: true,
    poster: "/images/work-menscare.jpg",
    reel: [`${V}/video-1s.webp`, `${V}/video-5s.webp`, `${V}/video-9s.webp`, `${V}/video-3s.webp`],
    title: "Brand Elevation & Content Strategy",
    tagline: "Scaled a premium grooming brand to 2,500+ new orders while holding 4.6x ROAS across 6 months.",
    categories: ["Short-Form", "AI Visuals", "Strategy"],
    year: "2024",
    metric: { value: "4.6x", label: "ROAS" },
    href: "/work/menscare",
    featured: true,
  },
  {
    client: "ISOSPORT",
    logo: "/images/logo-isosport.png",
    poster: "/images/work-isosport.jpg",
    reel: [`${V}/video-2s.webp`, `${V}/video-6s.webp`, `${V}/video-10s.webp`],
    title: "Promotional Video Campaign",
    tagline: "Cinematic promos fused with AI visuals to elevate brand presence across channels.",
    categories: ["Cinematic", "AI Visuals", "Social"],
    year: "2024",
    metric: { value: "6", label: "Films" },
    href: null,
  },
  {
    client: "VEKTO LAB",
    logo: "/images/logo.png",
    poster: "/images/work-menscare.jpg",
    reel: [`${V}/video-4s.webp`, `${V}/video-8s.webp`, `${V}/video-12s.webp`],
    title: "Next Case Study Coming Soon",
    tagline: "A new brand collaboration currently in production — launching soon.",
    categories: ["In Production"],
    year: "2026",
    href: null,
  },
];

const CATEGORIES = ["All", "Short-Form", "Cinematic", "AI Visuals", "Strategy"] as const;
type Category = typeof CATEGORIES[number];

/* ------- CRT-styled ticker ------- */
function Ticker({ text }: { text: string }) {
  const content = Array.from({ length: 12 }).map((_, i) => (
    <span key={i} className="mx-8 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.4em] text-[#c8ff00]/70">
      <span className="inline-block w-1.5 h-1.5 bg-[#c8ff00] rounded-full" />
      {text}
    </span>
  ));
  return (
    <div className="border-y border-[#c8ff00]/15 bg-[#c8ff00]/[0.025] py-3 overflow-hidden">
      <div className="flex whitespace-nowrap scroll-left" style={{ animationDuration: "55s" }}>
        {content}
        {content}
      </div>
    </div>
  );
}

/* ------- Video wall hero ------- */
function VideoWallHero() {
  // 6 tiles forming an asymmetric grid with autoplay videos
  const tiles = [
    { src: `${V}/video-5s.webp`, col: "md:col-span-3 md:row-span-2", title: "MEN'S CARE · AI Reel" },
    { src: `${V}/video-2s.webp`, col: "md:col-span-2", title: "ISOSPORT · Promo" },
    { src: `${V}/video-9s.webp`, col: "md:col-span-2", title: "MEN'S CARE · Studio" },
    { src: `${V}/video-6s.webp`, col: "md:col-span-2", title: "ISOSPORT · Field" },
    { src: `${V}/video-12s.webp`, col: "md:col-span-2", title: "VEKTO LAB · WIP" },
    { src: `${V}/video-1s.webp`, col: "md:col-span-2", title: "MEN'S CARE · Spot" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 auto-rows-[180px] md:auto-rows-[240px]">
      {tiles.map((t, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-xl md:rounded-2xl border border-[#1a1a1a] group ${t.col}`}
          style={{
            animation: `heroFadeIn 0.7s ease-out ${i * 110}ms backwards`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.src} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]" loading="eager" />
          {/* CRT phosphor tint overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%)" }} />
          <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30"
            style={{ background: "radial-gradient(ellipse at center, rgba(200,255,0,0.1), transparent 70%)" }} />
          {/* Caption */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#c8ff00]/90">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
              {String(i + 1).padStart(2, "0")} / {t.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------- Project reel card ------- */
function ProjectCard({ p, idx, active, featured = false }: { p: Project; idx: number; active: boolean; featured?: boolean }) {
  const [current, setCurrent] = useState(0);
  const hoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Rotate reel index every 3s when card is visible
    const el = hoverRef.current;
    if (!el) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    const id = setInterval(() => {
      if (visible) setCurrent((c) => (c + 1) % p.reel.length);
    }, 3400);
    return () => { io.disconnect(); clearInterval(id); };
  }, [p.reel.length]);

  const Inner = (
    <div
      ref={hoverRef}
      className={`group relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#1a1a1a] bg-[#0b0b0b] h-full transition-all duration-500 ${
        active ? "opacity-100" : "opacity-20 saturate-0"
      } ${p.href ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* Reel — layered webp videos with crossfade */}
      <div className="absolute inset-0">
        {p.reel.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms]"
            style={{ opacity: i === current ? 1 : 0 }}
            loading="eager"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
        <div className="absolute inset-0 mix-blend-screen opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(200,255,0,0.12), transparent 65%)" }} />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 100%, rgba(200,255,0,0.25) 0%, transparent 55%)" }} />
      </div>

      {/* Hover border glow */}
      <div className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: "inset 0 0 0 1px rgba(200,255,0,0.5), 0 0 60px -20px rgba(200,255,0,0.5)" }} />

      {/* Huge numeral watermark */}
      <div className="absolute top-3 right-5 text-[120px] md:text-[180px] font-black leading-none text-white/[0.04] pointer-events-none select-none tracking-tighter">
        {String(idx + 1).padStart(2, "0")}
      </div>

      {/* Scanline flicker on hover */}
      <div className="absolute inset-0 pointer-events-none work-scanlines opacity-[0.15] group-hover:opacity-40 transition-opacity duration-700" />

      {/* Top row */}
      <div className="relative z-10 p-5 md:p-8 flex items-start justify-between">
        <div
          style={{
            position: "relative",
            width: p.circularLogo ? 44 : 100,
            height: p.circularLogo ? 44 : 26,
          }}
        >
          <Image src={p.logo} alt={p.client} fill className="object-contain object-left" />
        </div>
        <div className="flex items-center gap-2">
          {/* Reel dots */}
          <div className="flex items-center gap-1">
            {p.reel.map((_, i) => (
              <span
                key={i}
                className="block h-1 rounded-full transition-all duration-500"
                style={{
                  width: i === current ? 18 : 6,
                  background: i === current ? "#c8ff00" : "#333",
                }}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888] border border-[#222] rounded-full px-2.5 py-0.5 bg-black/40 backdrop-blur-sm">
            {p.year}
          </span>
        </div>
      </div>

      {/* Content bottom */}
      <div className="relative z-10 flex flex-col justify-end p-5 md:p-8 pt-0" style={{ minHeight: "100%" }}>
        <div className="mt-auto">
          {featured && p.metric && (
            <div className="inline-flex items-baseline gap-2 mb-5">
              <span className="text-5xl md:text-6xl font-bold text-[#c8ff00] leading-none">{p.metric.value}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888]">{p.metric.label}</span>
            </div>
          )}

          <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#c8ff00] mb-2">
            ] {p.client}
          </p>
          <h3 className={`font-bold text-white tracking-tight leading-[1.05] mb-3 ${featured ? "text-3xl md:text-5xl lg:text-6xl" : "text-2xl md:text-3xl"}`}>
            {p.title}
          </h3>
          <p className={`text-[#b0b0b0] leading-relaxed ${featured ? "text-base md:text-lg max-w-xl" : "text-sm"}`}>
            {p.tagline}
          </p>

          <div className="flex items-center justify-between gap-4 mt-5 pt-5 border-t border-white/5">
            <div className="flex flex-wrap gap-2">
              {p.categories.map((c) => (
                <span key={c} className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999] border border-[#1f1f1f] bg-black/40 px-2.5 py-1 rounded-full">
                  {c}
                </span>
              ))}
            </div>
            {p.href ? (
              <span className="text-xs text-[#c8ff00] font-semibold whitespace-nowrap inline-flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-x-1">
                View case <span aria-hidden>→</span>
              </span>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] whitespace-nowrap">
                {p.categories[0] === "In Production" ? "Stay tuned" : "Private"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return p.href ? (
    <Link href={p.href} className="block h-full">{Inner}</Link>
  ) : Inner;
}

/* ------- Stats ------- */
function Stat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <div className="animate-hero-fade-in" style={{ animationDelay: `${delay}ms`, opacity: 0 }}>
      <div className="text-4xl md:text-5xl font-bold text-white mb-1.5 tracking-tight">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#888]">{label}</div>
    </div>
  );
}

export default function WorkClient() {
  const [filter, setFilter] = useState<Category>("All");
  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((p) => p.categories.includes(filter));
  }, [filter]);

  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setStatsVisible(true), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative text-white work-crt crt-emerge">
      {/* Soft dark wash so the persistent CRT canvas glows through but text stays legible */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[2]"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(10,8,5,0.25) 0%, rgba(10,8,5,0.82) 65%, rgba(10,8,5,0.96) 100%)" }} />
      {/* Global CRT overlays — sit on top of the canvas AND the content wash */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[50] work-scanlines opacity-[0.22]" />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[50] work-vignette" />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[51] work-bootsweep" />
      {/* Lingering phosphor curtain — fades over 2.4s so transition feels continuous */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[52] phosphor-curtain" />

      {/* ----------- HERO ----------- */}
      <section className="relative pt-8 md:pt-14 pb-6 px-5 md:px-8">
        <div className="relative max-w-[1400px] mx-auto">
          {/* Terminal header bar */}
          <div className="animate-hero-fade-in flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[#c8ff00]/90 pb-4 border-b border-[#c8ff00]/15 mb-6"
            style={{ animationDelay: "0ms" }}>
            <span className="inline-flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
              ] PORTFOLIO.DB · 2024—26 · READY
            </span>
            <Link href="/" className="text-[#888] hover:text-white transition-colors inline-flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              HOME
            </Link>
          </div>

          <h1
            className="animate-hero-fade-in text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] font-black leading-[0.9] tracking-[-0.04em] mb-6"
            style={{ animationDelay: "120ms" }}
          >
            <span className="block text-white">Selected</span>
            <span className="block italic text-[#c8ff00]" style={{ fontStyle: "italic" }}>work, on loop.</span>
          </h1>

          <div
            className="animate-hero-fade-in max-w-3xl text-[#a0a0a0] text-lg md:text-xl leading-relaxed mb-10"
            style={{ animationDelay: "260ms" }}
          >
            A cinematic index of the brands we scale — short-form systems, AI visuals
            and data-driven creative. Every tile below is a clip from a real campaign.
          </div>

          {/* Video wall */}
          <div className="animate-hero-fade-in" style={{ animationDelay: "380ms" }}>
            <VideoWallHero />
          </div>
        </div>
      </section>

      <Ticker text="· BROADCAST ACTIVE · REEL IN PROGRESS · PORTFOLIO.DB · VEKTO ARCHIVE · " />

      {/* ----------- FILTER ----------- */}
      <section className="py-4 px-5 md:px-8 border-b border-[#1a1a1a] bg-black/40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((c) => {
              const isActive = filter === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`relative whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] font-semibold px-4 py-2 rounded-full transition-colors duration-300 ${
                    isActive ? "text-black" : "text-[#888] hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span aria-hidden className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #c8ff00 0%, #9ed600 100%)",
                        boxShadow: "0 6px 20px -6px rgba(200,255,0,0.6)",
                      }}
                    />
                  )}
                  <span className="relative">{c}</span>
                </button>
              );
            })}
          </div>
          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] whitespace-nowrap">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </span>
        </div>
      </section>

      {/* ----------- FEATURED ----------- */}
      {featured && (filter === "All" || featured.categories.includes(filter)) && (
        <section className="px-5 md:px-8 pt-10">
          <div className="max-w-[1400px] mx-auto" style={{ minHeight: 560 }}>
            <div style={{ height: 640 }}>
              <ProjectCard p={featured} idx={0} active={true} featured />
            </div>
          </div>
        </section>
      )}

      {/* ----------- REST ----------- */}
      <section className="px-5 md:px-8 py-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6" style={{ gridAutoRows: "minmax(440px, auto)" }}>
          {rest.map((p, i) => {
            const active = filter === "All" || p.categories.includes(filter);
            return (
              <div
                key={p.client}
                className="h-[440px]"
                style={{ animation: `heroFadeIn 0.6s ease-out ${i * 130}ms backwards` }}
              >
                <ProjectCard p={p} idx={i + 1} active={active} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------- STATS ----------- */}
      <section ref={statsRef} className="px-5 md:px-8 py-16 border-y border-[#141414]" style={{ background: "linear-gradient(to bottom, #060606, #0a0a0a)" }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          {statsVisible && [
            { value: "2.5k+", label: "Orders Generated" },
            { value: "4.6x", label: "Average ROAS" },
            { value: "8", label: "Industries Served" },
            { value: "40M+", label: "Combined Views" },
          ].map((s, i) => (
            <Stat key={s.label} value={s.value} label={s.label} delay={i * 120} />
          ))}
        </div>
      </section>

      <Ticker text="· NEXT CASE STUDY LOADING · READY TO SCALE? · BOOK A CALL · VEKTO.AGENCY · " />

      {/* ----------- CTA ----------- */}
      <section className="relative px-5 md:px-8 py-24 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.12]"
          style={{ background: "radial-gradient(ellipse at center, #c8ff00 0%, transparent 60%)" }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-4">] NEXT UP</p>
          <h2 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            Want to be our
            <br />
            <span className="text-[#c8ff00]">next case study?</span>
          </h2>
          <p className="text-[#a0a0a0] text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            We take on a handful of brand partnerships every quarter.
            If you&apos;re ready to scale, let&apos;s talk.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              data-cal-namespace="30min"
              data-cal-link="vekto/30min"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="inline-flex items-center justify-center gap-2 bg-[#c8ff00] text-black font-semibold px-10 py-4 rounded-full hover:bg-[#d4ff33] transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{ boxShadow: "0 14px 40px -12px rgba(200,255,0,0.55)" }}
            >
              Book a Call
            </button>
            <button
              onClick={() => openContactModal("message")}
              className="inline-flex items-center justify-center gap-2 border border-[#222] text-white font-semibold px-10 py-4 rounded-full hover:border-[#c8ff00]/40 hover:bg-[#c8ff00]/5 transition-colors cursor-pointer"
            >
              Send Message
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
