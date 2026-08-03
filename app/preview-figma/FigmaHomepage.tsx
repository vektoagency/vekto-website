"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Studio-as-live-Figma homepage. The site IS the workspace: infinite
// canvas with dot grid, floating frames (case study cards), sticky
// notes with team annotations, animated collaborator cursors moving
// along paths, comments popping in from real client testimonials.
// You aren't LOOKING at a marketing site — you're INSIDE the studio
// while they work.

const CURSORS = [
  { name: "Николай", color: "#F24E1E", path: [[10, 20], [30, 25], [55, 40], [70, 60], [45, 75], [25, 55], [10, 20]] },
  { name: "Мария",   color: "#0ACF83", path: [[80, 15], [65, 30], [50, 20], [30, 45], [55, 65], [80, 50], [80, 15]] },
  { name: "Алекс",   color: "#A259FF", path: [[45, 85], [25, 70], [15, 45], [35, 30], [60, 40], [70, 65], [45, 85]] },
];

const STICKIES = [
  { x: "8%",  y: "22%", rot: "-3deg", color: "#FFEB3B", text: "Растежът е не проект. Система." },
  { x: "62%", y: "18%", rot: "2deg",  color: "#FF9800", text: "12 нови бранда / год." },
  { x: "12%", y: "68%", rot: "1.5deg", color: "#B39DDB", text: "50+ бранда · BG + US" },
  { x: "70%", y: "70%", rot: "-2deg", color: "#81C784", text: "4.8× ROAS средно" },
];

const FRAMES = [
  { title: "MEN'S CARE",     brief: "Beauty · DTC",           metric: "5.2× revenue" },
  { title: "ISOSPORT",       brief: "Beverage · Brand",       metric: "3.8× ROAS"    },
  { title: "PARFEN",         brief: "Perfumes · Ecom",        metric: "40+ AI vids"  },
  { title: "DUSQ",           brief: "Wearable · US launch",   metric: "1.2M reach"   },
];

const COMMENTS = [
  { author: "Ivan Petrov",   role: "Founder, ISOSPORT",   text: "Cinematic reel-ът им ни направи брандът за 3 седмици.", after: 1200 },
  { author: "Anna Kostova",  role: "CMO, MEN'S CARE",     text: "Ръст 5×+ в месечния оборот. Работят като разширение на екипа ни.", after: 3400 },
  { author: "Marc Halloran", role: "VP Growth, DUSQ (US)", text: "Only agency delivering both creative + performance we've kept 12 months.", after: 6000 },
];

const SERVICES_CANVAS = [
  { name: "Ads",      x: "18%", y: "42%", w: 148 },
  { name: "Creative", x: "42%", y: "38%", w: 168 },
  { name: "Web",      x: "62%", y: "48%", w: 138 },
  { name: "Strategy", x: "78%", y: "40%", w: 156 },
];

export default function FigmaHomepage() {
  const [showComment, setShowComment] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Comments arrive one-by-one, staying visible once shown
    const timers = COMMENTS.map((c, i) =>
      setTimeout(() => setShowComment(i), c.after)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-[#e5e5e5] text-[#1a1a1a] font-sans relative overflow-x-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle, #cfcfcf 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* ===== TOP TOOLBAR ===== */}
      <div className="fixed top-0 left-0 right-0 h-11 bg-white border-b border-[#e0e0e0] z-40 flex items-center px-4 gap-3 shadow-sm">
        <div className="flex items-center gap-2 font-mono text-[12px] text-[#333]">
          <svg width="18" height="18" viewBox="0 0 38 57" fill="none">
            <path d="M19 28.5C19 33.7 14.7 38 9.5 38S0 33.7 0 28.5 4.3 19 9.5 19 19 23.3 19 28.5z" fill="#1ABCFE"/>
            <path d="M0 47.5C0 42.3 4.3 38 9.5 38H19v9.5C19 52.7 14.7 57 9.5 57S0 52.7 0 47.5z" fill="#0ACF83"/>
            <path d="M19 0v19h9.5C33.7 19 38 14.7 38 9.5S33.7 0 28.5 0H19z" fill="#FF7262"/>
            <path d="M0 9.5C0 14.7 4.3 19 9.5 19H19V0H9.5C4.3 0 0 4.3 0 9.5z" fill="#F24E1E"/>
            <path d="M19 28.5c0 5.2 4.3 9.5 9.5 9.5S38 33.7 38 28.5 33.7 19 28.5 19 19 23.3 19 28.5z" fill="#A259FF"/>
          </svg>
          <span className="font-semibold">VEKTO / Studio</span>
          <span className="text-[#999]">— Untitled Growth Project</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {CURSORS.map((c) => (
              <div
                key={c.name}
                className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold text-white"
                style={{ background: c.color }}
                title={c.name}
              >
                {c.name[0]}
              </div>
            ))}
          </div>
          <a
            href="mailto:vektoagency@gmail.com"
            className="ml-3 text-[12px] bg-[#0D99FF] text-white font-medium px-3 py-1.5 rounded hover:bg-[#0084dd] transition-colors"
          >
            Share
          </a>
        </div>
      </div>

      {/* ===== CANVAS ===== */}
      <div className="pt-20 pb-40 relative min-h-screen">
        {/* Animated collaborator cursors */}
        {CURSORS.map((c) => (
          <FigmaCursor key={c.name} name={c.name} color={c.color} path={c.path} />
        ))}

        {/* Hero frame — the main "artboard" */}
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 mt-6">
          <FrameHeader label="hero" tags={["1440 × 900", "Auto Layout"]} />
          <div className="bg-white border-2 border-[#0D99FF] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] rounded-md p-8 md:p-16 relative">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#666] mb-6">
              # H1 · Editable text · 96pt
            </div>
            <h1 className="text-[52px] md:text-[104px] font-extrabold leading-[0.9] tracking-[-0.03em] mb-8">
              Растеж като{" "}
              <span className="relative inline-block">
                система
                <svg className="absolute -bottom-1 left-0 w-full" height="10" viewBox="0 0 300 10" preserveAspectRatio="none">
                  <path d="M0 6 Q75 -2 150 5 T300 5" stroke="#F24E1E" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              .<br />
              Не проект.
            </h1>
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#666] mb-3">
              # p · Description · 18pt
            </div>
            <p className="text-lg md:text-xl leading-[1.55] max-w-2xl mb-8 text-[#333]">
              Независимо студио за растеж, което работи с 50+ бранда в
              България и САЩ. Реклами, съдържание, уебсайтове, стратегия
              — под един покрив.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:vektoagency@gmail.com"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white font-medium px-6 py-3 rounded hover:bg-black transition-colors"
              >
                Book a call →
              </a>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 border border-[#333] text-[#1a1a1a] font-medium px-6 py-3 rounded hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                See work
              </Link>
            </div>
          </div>
        </div>

        {/* Sticky notes floating around hero */}
        {STICKIES.map((s, i) => (
          <div
            key={i}
            className="absolute w-40 md:w-52 p-4 shadow-lg font-medium text-[13px] md:text-[14px] leading-tight z-20 hidden md:block"
            style={{
              left: s.x,
              top: s.y,
              background: s.color,
              transform: `rotate(${s.rot})`,
              boxShadow: "0 8px 24px -8px rgba(0,0,0,0.25)",
            }}
          >
            {s.text}
          </div>
        ))}

        {/* Services scattered as small canvas objects */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-32 relative">
          <FrameHeader label="services" tags={["4 objects", "Grouped"]} />
          <div className="relative h-[280px] md:h-[360px] bg-white/60 border border-[#e0e0e0] rounded-md overflow-hidden">
            {SERVICES_CANVAS.map((s) => (
              <div
                key={s.name}
                className="absolute bg-white border-2 border-[#0D99FF] rounded px-5 py-3 md:px-7 md:py-4 shadow-md hover:border-[#F24E1E] transition-colors cursor-pointer"
                style={{ left: s.x, top: s.y, width: s.w }}
              >
                <div className="font-mono text-[9px] uppercase tracking-widest text-[#888] mb-1">
                  Layer
                </div>
                <div className="text-xl md:text-2xl font-bold">{s.name}</div>
              </div>
            ))}
            {/* Connecting lines between service objects */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
              <path d="M 90,42% Q 30%,20% 42%,38%" stroke="#0D99FF" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.4" />
              <path d="M 42%,38% Q 55%,20% 62%,48%" stroke="#0D99FF" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.4" />
              <path d="M 62%,48% Q 75%,20% 78%,40%" stroke="#0D99FF" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Case study frames */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-32">
          <FrameHeader label="case-studies" tags={[`${FRAMES.length} components`, "Instance"]} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {FRAMES.map((f) => (
              <div key={f.title} className="bg-white border border-[#e0e0e0] rounded-md overflow-hidden hover:border-[#0D99FF] transition-colors group">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8] flex items-center justify-center border-b border-[#e0e0e0]">
                  <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-[#999]">
                    {f.title}
                  </span>
                </div>
                <div className="p-3 md:p-4">
                  <div className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-[#666] mb-1">
                    {f.brief}
                  </div>
                  <div className="text-sm md:text-base font-semibold group-hover:text-[#F24E1E] transition-colors">
                    {f.metric}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact frame */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-32 mb-16">
          <FrameHeader label="contact" tags={["Component", "Live"]} />
          <div className="bg-white border-2 border-[#0D99FF] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] rounded-md p-8 md:p-14">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#666] mb-4">
              # heading · CTA · 64pt
            </div>
            <h2 className="text-[36px] md:text-[68px] font-extrabold leading-[0.98] tracking-tight mb-6">
              Готов да си в canvas-а{" "}
              <span className="text-[#F24E1E]">на VEKTO?</span>
            </h2>
            <p className="text-lg text-[#555] max-w-xl mb-8">
              12 нови партньорства годишно. Личен review, отговор до 24 часа.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="mailto:vektoagency@gmail.com"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white font-medium px-7 py-4 rounded hover:bg-black transition-colors text-base"
              >
                vektoagency@gmail.com →
              </a>
              <span className="font-mono text-[13px] text-[#666]">
                or +359 88 225 1474
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comment popups arriving from side */}
      {COMMENTS.map((c, i) => (
        <div
          key={i}
          className="fixed left-4 md:left-8 bottom-24 md:bottom-8 w-72 md:w-80 bg-white border border-[#e0e0e0] rounded-lg shadow-2xl p-4 z-50 transition-all duration-500"
          style={{
            transform: showComment !== null && showComment >= i ? "translateY(0)" : "translateY(120%)",
            opacity: showComment !== null && showComment >= i ? 1 : 0,
            marginBottom: showComment !== null && showComment > i ? `${(showComment - i) * 100}px` : "0",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
              style={{ background: ["#F24E1E", "#0ACF83", "#A259FF"][i % 3] }}
            >
              {c.author[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold leading-tight">{c.author}</div>
              <div className="font-mono text-[10px] text-[#888] mb-2">{c.role}</div>
              <p className="text-[13px] leading-snug text-[#333]">{c.text}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Bottom status bar — Figma-style */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e0e0e0] h-9 flex items-center px-4 gap-4 z-40 font-mono text-[11px] text-[#666]">
        <span>100%</span>
        <span className="w-px h-4 bg-[#e0e0e0]" />
        <span>3 collaborators editing</span>
        <span className="w-px h-4 bg-[#e0e0e0]" />
        <span>Saved · just now</span>
        <span className="ml-auto text-[#0ACF83]">● Live</span>
      </div>
    </div>
  );
}

function FrameHeader({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div className="flex items-center gap-3 mb-2 font-mono text-[11px] text-[#666]">
      <span className="text-[#F24E1E]">▸</span>
      <span className="font-semibold uppercase tracking-wider">{label}</span>
      {tags.map((t) => (
        <span key={t} className="text-[10px] bg-[#f0f0f0] px-1.5 py-0.5 rounded">{t}</span>
      ))}
    </div>
  );
}

function FigmaCursor({ name, color, path }: { name: string; color: string; path: number[][] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setI((v) => (v + 1) % path.length), 1800);
    return () => clearInterval(timer);
  }, [path.length]);
  const [x, y] = path[i];
  return (
    <div
      aria-hidden
      className="absolute z-30 pointer-events-none transition-all duration-[1800ms] ease-in-out hidden md:block"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
        <path d="M2 2 L18 12 L11 13 L14 21 L10 22 L7 14 L2 18 Z" fill={color} stroke="white" strokeWidth="1" />
      </svg>
      <div
        className="text-white text-[11px] font-medium px-2 py-0.5 rounded mt-1 whitespace-nowrap"
        style={{ background: color }}
      >
        {name}
      </div>
    </div>
  );
}
