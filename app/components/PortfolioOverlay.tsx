"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Project = {
  client: string;
  title: string;
  tagline: string;
  categories: string[];
  year: string;
  metric?: { value: string; label: string };
  reel: string[];
  href?: string | null;
  featured?: boolean;
  logo: string;
  circularLogo?: boolean;
};

const V = "/images/hero-anim";
const projects: Project[] = [
  {
    client: "MEN'S CARE",
    logo: "/images/logo-menscare.png",
    circularLogo: true,
    reel: [`${V}/video-1s.webp`, `${V}/video-5s.webp`, `${V}/video-9s.webp`, `${V}/video-3s.webp`],
    title: "Brand Elevation & Content Strategy",
    tagline: "Scaled a premium grooming brand to 2,500+ new orders at 4.6x ROAS.",
    categories: ["Short-Form", "AI Visuals", "Strategy"],
    year: "2024",
    metric: { value: "4.6x", label: "ROAS" },
    href: "/work/menscare",
    featured: true,
  },
  {
    client: "ISOSPORT",
    logo: "/images/logo-isosport.png",
    reel: [`${V}/video-2s.webp`, `${V}/video-6s.webp`, `${V}/video-10s.webp`],
    title: "Promotional Video Campaign",
    tagline: "Cinematic promos fused with AI visuals across channels.",
    categories: ["Cinematic", "AI Visuals", "Social"],
    year: "2024",
    metric: { value: "6", label: "Films" },
    href: null,
  },
  {
    client: "VEKTO LAB",
    logo: "/images/logo.png",
    reel: [`${V}/video-4s.webp`, `${V}/video-8s.webp`, `${V}/video-12s.webp`],
    title: "Next Case Study Coming Soon",
    tagline: "A new brand collaboration currently in production.",
    categories: ["In Production"],
    year: "2026",
    href: null,
  },
];

const BOOT_LOG = [
  "> VEKTO/PORTFOLIO.DB",
  "> SYS_INIT ........ OK",
  "> LOADING ASSETS ... OK",
  "> DECRYPT REELS ... OK",
  "> READY.",
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PortfolioOverlay({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const [current, setCurrent] = useState<number[]>(projects.map(() => 0));
  const reelIntervals = useRef<ReturnType<typeof setInterval>[]>([]);

  // Sync URL with open state (deep link, back-button closes)
  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;
    const prevPath = window.location.pathname + window.location.search;
    window.history.pushState({ vektoOverlay: true }, "", "/work");
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      // If overlay closed by other means, restore URL
      if (window.location.pathname === "/work") {
        window.history.replaceState({}, "", prevPath);
      }
    };
  }, [open, onClose]);

  // Mount/unmount with animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      setBootLine(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => setMounted(false), 700);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Boot log type-out
  useEffect(() => {
    if (!open) return;
    let cancel = false;
    const run = async () => {
      for (let i = 0; i <= BOOT_LOG.length; i++) {
        if (cancel) return;
        setBootLine(i);
        await new Promise((r) => setTimeout(r, 130 + Math.random() * 120));
      }
    };
    run();
    return () => { cancel = true; };
  }, [open]);

  // Reel rotation per card
  useEffect(() => {
    if (!open) return;
    reelIntervals.current.forEach(clearInterval);
    reelIntervals.current = projects.map((p, idx) =>
      setInterval(() => {
        setCurrent((c) => {
          const next = [...c];
          next[idx] = (next[idx] + 1) % p.reel.length;
          return next;
        });
      }, 3400 + idx * 200)
    );
    return () => {
      reelIntervals.current.forEach(clearInterval);
    };
  }, [open]);

  // Keyboard: ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      aria-modal
      role="dialog"
      className={`fixed inset-0 z-[80] ${open ? "po-open" : "po-closing"}`}
    >
      {/* The live CRT shader is the background (rendered by the Canvas
          below). Only the CRT *frame* effects layer on top of it. */}
      {/* Subtle darkening wash for legibility over the bright phosphor */}
      <div aria-hidden className="absolute inset-0 po-dim" />
      {/* Scanlines */}
      <div aria-hidden className="absolute inset-0 po-scanlines" />
      {/* Vignette + glass curvature suggestion */}
      <div aria-hidden className="absolute inset-0 po-vignette" />

      {/* CONTENT */}
      <div className="relative z-10 h-full w-full overflow-y-auto po-content">
        {/* Top terminal bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-10 py-3 border-b border-[#c8ff00]/25 bg-black/55 backdrop-blur-sm font-mono text-[10px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-3 text-[#c8ff00]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
            VEKTO/PORTFOLIO.DB — 2024—26
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#c8ff00]/70 hover:text-[#c8ff00] transition-colors border border-[#c8ff00]/25 hover:border-[#c8ff00]/60 rounded-sm px-3 py-1.5"
            aria-label="Close portfolio"
          >
            <span>× EJECT</span>
          </button>
        </div>

        {/* Boot log */}
        <section className="px-6 md:px-10 pt-6 md:pt-10 max-w-[1400px] mx-auto">
          <pre className="font-mono text-[11px] md:text-[12px] text-[#c8ff00] leading-relaxed">
            {BOOT_LOG.slice(0, bootLine).map((l, i) => (
              <div key={i} className="po-type">{l}</div>
            ))}
            {bootLine < BOOT_LOG.length && (
              <div className="po-type">{BOOT_LOG[bootLine]}<span className="po-caret">▊</span></div>
            )}
          </pre>
        </section>

        {/* Hero heading */}
        <section className="px-6 md:px-10 pt-8 md:pt-10 pb-10 max-w-[1400px] mx-auto">
          <h1 className="font-black leading-[0.9] tracking-[-0.04em] text-[#eaffb8] text-5xl md:text-7xl lg:text-[7rem] po-glow">
            Selected
            <br />
            <span className="italic text-[#c8ff00]">work, on loop.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[#bfd88a] text-base md:text-lg leading-relaxed font-mono">
            A cinematic index of the brands we scale — short-form systems,
            AI visuals, and data-driven creative strategy.
          </p>
        </section>

        {/* Project cards as Mac OS windows */}
        <section className="px-6 md:px-10 pb-16 max-w-[1400px] mx-auto space-y-6 md:space-y-8">
          {projects.map((p, i) => (
            <ProjectWindow
              key={p.client}
              p={p}
              idx={i}
              currentReel={current[i]}
              delay={i * 160}
            />
          ))}
        </section>

        {/* CTA */}
        <section className="relative px-6 md:px-10 pt-10 pb-20 max-w-[1100px] mx-auto text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-4">] NEXT UP</p>
          <h2 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-5 text-[#eaffb8] po-glow">
            Want to be our<br />
            <span className="text-[#c8ff00]">next case study?</span>
          </h2>
          <p className="text-[#b6d47a] text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed font-mono">
            We take on a handful of brand partnerships per quarter.
          </p>
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
    </div>
  );
}

/* ---------- Mac-OS-style project window ---------- */
function ProjectWindow({
  p,
  idx,
  currentReel,
  delay,
}: {
  p: Project;
  idx: number;
  currentReel: number;
  delay: number;
}) {
  const Content = (
    <article
      className="po-window group relative overflow-hidden"
      style={{ animation: `poWindowIn 0.75s cubic-bezier(0.25,0.8,0.3,1) ${delay}ms backwards` }}
    >
      {/* Window title bar */}
      <header className="po-titlebar">
        <div className="po-titlebar-close" />
        <div className="po-titlebar-label">
          {String(idx + 1).padStart(2, "0")} — {p.client}.PRJ
        </div>
        <div className="po-titlebar-controls">
          <span className="font-mono text-[10px] tracking-[0.2em] text-black/70">{p.year}</span>
        </div>
      </header>

      {/* Window body */}
      <div className={`relative grid ${p.featured ? "md:grid-cols-[1.2fr_1fr]" : "md:grid-cols-[1fr_1fr]"} gap-0`}>
        {/* Left — reel */}
        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px] overflow-hidden bg-black">
          {p.reel.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms]"
              style={{ opacity: i === currentReel ? 1 : 0 }}
              loading="eager"
            />
          ))}
          {/* Phosphor tint + scanlines over media */}
          <div className="absolute inset-0 mix-blend-screen opacity-25 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(200,255,0,0.18), transparent 65%)" }} />
          <div className="absolute inset-0 po-scanlines opacity-70 pointer-events-none" />
          {/* Reel indicator */}
          <div className="absolute bottom-3 left-3 flex gap-1">
            {p.reel.map((_, i) => (
              <span key={i} className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: i === currentReel ? 20 : 6,
                  background: i === currentReel ? "#c8ff00" : "rgba(200,255,0,0.3)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Right — metadata */}
        <div className="p-6 md:p-8 bg-[#efe9c9] text-[#1a1a0e] flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div
              style={{
                position: "relative",
                width: p.circularLogo ? 40 : 100,
                height: p.circularLogo ? 40 : 24,
              }}
            >
              <Image src={p.logo} alt={p.client} fill className="object-contain object-left" />
            </div>
            {p.metric && (
              <div className="text-right">
                <div className="text-3xl md:text-4xl font-black leading-none text-[#1a1a0e]">{p.metric.value}</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#1a1a0e]/60">{p.metric.label}</div>
              </div>
            )}
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#1a1a0e]/70 mb-2">] {p.client}</p>
          <h3 className={`font-black leading-[1.05] tracking-tight mb-3 ${p.featured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"}`}>
            {p.title}
          </h3>
          <p className="text-[#1a1a0e]/75 text-sm md:text-base leading-relaxed mb-5">{p.tagline}</p>

          <div className="mt-auto pt-4 border-t border-[#1a1a0e]/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {p.categories.map((c) => (
                <span key={c} className="font-mono text-[9px] uppercase tracking-[0.15em] bg-[#1a1a0e]/5 border border-[#1a1a0e]/15 px-2 py-0.5 rounded-sm">
                  {c}
                </span>
              ))}
            </div>
            {p.href ? (
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#1a1a0e] font-bold inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                Open <span aria-hidden>→</span>
              </span>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1a1a0e]/50">
                {p.categories[0] === "In Production" ? "Stay tuned" : "Private"}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );

  return p.href ? (
    <Link href={p.href} className="block">{Content}</Link>
  ) : Content;
}
