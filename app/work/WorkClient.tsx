"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { openContactModal } from "../components/ContactModal";

type Project = {
  client: string;
  logo: string;
  circularLogo?: boolean;
  image: string;
  title: string;
  tagline: string;
  categories: string[];
  year: string;
  metric?: { value: string; label: string };
  href?: string | null;
  span: "lg" | "md" | "sm"; // bento size
  featured?: boolean;
};

const projects: Project[] = [
  {
    client: "MEN'S CARE",
    logo: "/images/logo-menscare.png",
    circularLogo: true,
    image: "/images/work-menscare.jpg",
    title: "Brand Elevation & Content Strategy",
    tagline: "Scaled a premium grooming brand to 2,500+ new orders while holding 4.6x ROAS across 6 months.",
    categories: ["Short-Form", "AI Visuals", "Strategy"],
    year: "2024",
    metric: { value: "4.6x", label: "ROAS" },
    href: "/work/menscare",
    span: "lg",
    featured: true,
  },
  {
    client: "ISOSPORT",
    logo: "/images/logo-isosport.png",
    image: "/images/work-isosport.jpg",
    title: "Promotional Video Campaign",
    tagline: "Cinematic promos fused with AI visuals to elevate brand presence across channels.",
    categories: ["Cinematic", "AI Visuals", "Social"],
    year: "2024",
    metric: { value: "6", label: "Films" },
    href: null,
    span: "md",
  },
  {
    client: "VEKTO LAB",
    logo: "/images/logo.png",
    image: "/images/work-menscare.jpg",
    title: "Next Case Study Coming Soon",
    tagline: "A new brand collaboration currently in production — launching soon.",
    categories: ["In Production"],
    year: "2026",
    href: null,
    span: "md",
  },
];

const CATEGORIES = ["All", "Short-Form", "Cinematic", "AI Visuals", "Strategy"] as const;
type Category = typeof CATEGORIES[number];

function Stat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <div
      className="animate-hero-fade-in"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="text-4xl md:text-5xl font-bold text-white mb-1.5 tracking-tight">
        {value}
      </div>
      <div className="text-xs uppercase tracking-widest text-[#666]">{label}</div>
    </div>
  );
}

function ProjectCard({ p, idx, active }: { p: Project; idx: number; active: boolean }) {
  const CardInner = (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-[#1a1a1a] bg-[#0b0b0b] h-full transition-all duration-500 ${
        active ? "opacity-100" : "opacity-25 saturate-0"
      } ${p.href ? "cursor-pointer" : "cursor-default"}`}
      style={{
        boxShadow: active ? "0 20px 60px -30px rgba(0,0,0,0.8)" : undefined,
      }}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <Image
          src={p.image}
          alt={p.client}
          fill
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        {/* lime tint on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "radial-gradient(circle at 50% 100%, rgba(200,255,0,0.22) 0%, transparent 60%)" }} />
      </div>

      {/* lime border glow on hover */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: "inset 0 0 0 1px rgba(200,255,0,0.45)" }} />

      {/* Huge number watermark */}
      <div className="absolute top-4 right-6 text-[120px] md:text-[160px] font-black leading-none text-white/[0.04] pointer-events-none select-none tracking-tighter">
        {String(idx + 1).padStart(2, "0")}
      </div>

      {/* Top row */}
      <div className="relative p-6 md:p-8 flex items-start justify-between z-10">
        <div className="flex items-center gap-3">
          <div
            style={{
              position: "relative",
              width: p.circularLogo ? 44 : 100,
              height: p.circularLogo ? 44 : 26,
            }}
          >
            <Image src={p.logo} alt={p.client} fill className="object-contain object-left" />
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#888] border border-[#222] rounded-full px-3 py-1 bg-black/40 backdrop-blur-sm">
          {p.year}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end p-6 md:p-8 pt-0" style={{ minHeight: "100%" }}>
        {/* Push to bottom */}
        <div className="mt-auto">
          {/* Metric (for featured only) */}
          {p.featured && p.metric && (
            <div className="inline-flex items-baseline gap-2 mb-5">
              <span className="text-5xl md:text-6xl font-bold text-[#c8ff00] leading-none">{p.metric.value}</span>
              <span className="text-xs uppercase tracking-widest text-[#888]">{p.metric.label}</span>
            </div>
          )}

          <p className="text-[11px] uppercase tracking-[0.2em] text-[#c8ff00] mb-2">{p.client}</p>
          <h3 className={`font-bold text-white tracking-tight leading-[1.1] mb-3 ${p.featured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}>
            {p.title}
          </h3>
          <p className={`text-[#a0a0a0] leading-relaxed ${p.featured ? "text-base md:text-lg max-w-xl" : "text-sm"}`}>
            {p.tagline}
          </p>

          {/* Tags + CTA */}
          <div className="flex items-center justify-between gap-4 mt-5 pt-5 border-t border-white/5">
            <div className="flex flex-wrap gap-2">
              {p.categories.map((c) => (
                <span key={c} className="text-[10px] uppercase tracking-wider text-[#888] border border-[#1a1a1a] bg-black/40 px-2.5 py-1 rounded-full">
                  {c}
                </span>
              ))}
            </div>
            {p.href ? (
              <span className="text-xs text-[#c8ff00] font-semibold whitespace-nowrap flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-x-1">
                View case <span aria-hidden>→</span>
              </span>
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-[#555] whitespace-nowrap">
                {p.categories[0] === "In Production" ? "Stay tuned" : "Private"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return p.href ? (
    <Link href={p.href} className="block h-full">{CardInner}</Link>
  ) : (
    CardInner
  );
}

export default function WorkClient() {
  const [filter, setFilter] = useState<Category>("All");
  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((p) => p.categories.includes(filter));
  }, [filter]);

  // Stats counter animation
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStatsVisible(true),
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative text-white work-crt">
      {/* Global CRT scan overlay — subtle continuation of Pravec aesthetic */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[50] work-scanlines opacity-[0.25]" />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[50] work-vignette" />
      {/* One-time boot sweep */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[51] work-bootsweep" />

      {/* ---------- Hero ---------- */}
      <section className="relative pt-10 pb-10 px-6 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <div className="animate-hero-fade-in" style={{ animationDelay: "0ms" }}>
            <div className="inline-flex items-center gap-2.5 border border-[#c8ff00]/30 rounded-full px-3.5 py-1 mb-6 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c8ff00] font-semibold">
                ] PORTFOLIO.DB · 2024—26
              </span>
            </div>
          </div>

          <h1
            className="animate-hero-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-[-0.03em] mb-6"
            style={{ animationDelay: "120ms" }}
          >
            <span className="block text-white">The Work</span>
            <span className="block italic font-serif" style={{ color: "#c8ff00", fontStyle: "italic" }}>speaks for itself.</span>
          </h1>

          <div className="animate-hero-fade-in flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl"
            style={{ animationDelay: "280ms" }}
          >
            <p className="text-[#a0a0a0] text-lg md:text-xl leading-relaxed max-w-2xl">
              A selection of recent collaborations — brands we helped scale through
              cinematic storytelling, AI-powered visuals and data-driven creative strategy.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors whitespace-nowrap"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              Back to home
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Filter bar ---------- */}
      <section className="py-4 px-6 border-y border-[#1a1a1a] bg-black/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((c) => {
              const isActive = filter === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`relative whitespace-nowrap text-xs uppercase tracking-widest font-semibold px-4 py-2 rounded-full transition-colors duration-300 ${
                    isActive ? "text-black" : "text-[#888] hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full"
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
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-[#555] whitespace-nowrap">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"}
          </span>
        </div>
      </section>

      {/* ---------- Bento grid ---------- */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-5 md:gap-6 auto-rows-[minmax(380px,auto)]">
            {projects.map((p, idx) => {
              const active = filter === "All" || p.categories.includes(filter);
              // Span logic
              const colSpan = p.span === "lg" ? "md:col-span-6 md:row-span-2 md:min-h-[640px]" : "md:col-span-3";
              return (
                <div
                  key={p.client + idx}
                  className={`${colSpan} transition-all duration-500`}
                  style={{
                    animation: `heroFadeIn 0.6s ease-out ${idx * 100}ms backwards`,
                  }}
                >
                  <ProjectCard p={p} idx={idx} active={active} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Stats strip ---------- */}
      <section ref={statsRef} className="px-6 py-20 border-y border-[#141414]" style={{ background: "linear-gradient(to bottom, #060606, #0a0a0a)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
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

      {/* ---------- CTA ---------- */}
      <section className="relative px-6 py-28 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.12]"
          style={{ background: "radial-gradient(ellipse at center, #c8ff00 0%, transparent 60%)" }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c8ff00] mb-4">Next up</p>
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
