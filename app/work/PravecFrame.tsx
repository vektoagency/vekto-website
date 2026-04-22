"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  "ПРАВЕЦ 8A · VEKTO ARCHIVE v2.6",
  "COPYRIGHT (C) 1986 VEKTO AGENCY",
  "",
  "] RAM CHECK........... 64K OK",
  "] ROM CHECK........... OK",
  "] LOADING PORTFOLIO.DB",
  "] INDEXING PROJECTS...",
  "] READY_",
];

function BootSequence({ onDone }: { onDone: () => void }) {
  const [line, setLine] = useState(0);
  useEffect(() => {
    if (line >= BOOT_LINES.length) {
      const t = setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }
    const delay = BOOT_LINES[line] === "" ? 60 : 130;
    const t = setTimeout(() => setLine(line + 1), delay);
    return () => clearTimeout(t);
  }, [line, onDone]);

  return (
    <div className="absolute inset-0 z-30 bg-black flex items-start justify-start p-6 md:p-10 font-mono text-[#c8ff00] overflow-hidden">
      <div className="text-sm md:text-base leading-relaxed">
        {BOOT_LINES.slice(0, line).map((l, i) => (
          <div key={i} style={{ textShadow: "0 0 8px rgba(200,255,0,0.8)" }}>
            {l || "\u00A0"}
          </div>
        ))}
        {line < BOOT_LINES.length && (
          <span className="inline-block w-2.5 h-4 bg-[#c8ff00] align-middle animate-[blink_1s_steps(2)_infinite]"
            style={{ boxShadow: "0 0 8px rgba(200,255,0,0.8)" }} />
        )}
      </div>
    </div>
  );
}

export default function PravecFrame({ children }: { children: React.ReactNode }) {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const skipped = sessionStorage.getItem("vekto-pravec-booted");
    if (skipped === "1") setBooted(true);
  }, []);

  const handleDone = () => {
    sessionStorage.setItem("vekto-pravec-booted", "1");
    setBooted(true);
  };

  return (
    <div className="pravec-stage relative px-3 sm:px-6 pt-20 pb-10">
      {/* Soft ambient glow behind the machine */}
      <div aria-hidden className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] max-w-full h-[600px] rounded-full opacity-[0.08] pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(ellipse, #c8ff00 0%, transparent 60%)" }} />

      {/* Monitor case */}
      <div className="relative max-w-[1280px] mx-auto">
        <div
          className="relative rounded-[22px] p-3 sm:p-5"
          style={{
            background: "linear-gradient(180deg, #d9cfbb 0%, #c2b89f 50%, #a89d82 100%)",
            boxShadow: [
              "inset 0 2px 0 rgba(255,255,255,0.55)",
              "inset 0 -3px 0 rgba(0,0,0,0.25)",
              "0 30px 80px -20px rgba(0,0,0,0.8)",
            ].join(", "),
          }}
        >
          {/* Top label bar */}
          <div className="flex items-center justify-between px-2 sm:px-4 mb-3 text-[10px] sm:text-xs tracking-[0.25em] uppercase font-mono"
            style={{ color: "#3a2e1f" }}>
            <span className="font-bold">ПРАВЕЦ 8A</span>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4a7] shadow-[0_0_6px_rgba(80,200,120,0.8)] animate-pulse" />
                PWR
              </span>
              <span>VEKTO · ARCHIVE</span>
            </div>
          </div>

          {/* Screen bezel */}
          <div
            className="relative rounded-[14px] p-2 sm:p-3"
            style={{
              background: "linear-gradient(180deg, #2a2623 0%, #1a1714 100%)",
              boxShadow: "inset 0 2px 12px rgba(0,0,0,0.8), inset 0 -2px 6px rgba(255,255,255,0.04)",
            }}
          >
            {/* Screen */}
            <div className="relative rounded-md overflow-hidden bg-black crt-screen"
              style={{ minHeight: "70vh" }}
            >
              {/* The actual content */}
              <div className="relative z-10">{children}</div>

              {/* CRT overlays */}
              <div aria-hidden className="pointer-events-none absolute inset-0 z-20 scanlines" />
              <div aria-hidden className="pointer-events-none absolute inset-0 z-20 crt-vignette" />

              {/* Boot sequence */}
              {!booted && <BootSequence onDone={handleDone} />}
            </div>

            {/* Bezel bottom: brand plate */}
            <div className="flex items-center justify-between mt-2 sm:mt-3 px-2 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-mono text-[#5a4a38]">
              <span>MODEL 8A · SOFIA</span>
              <span className="hidden sm:inline">{new Date().getFullYear()} © VEKTO</span>
            </div>
          </div>

          {/* Vents / keyboard strip */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex-1 grid grid-cols-[repeat(auto-fit,minmax(6px,1fr))] gap-[3px]">
              {Array.from({ length: 80 }).map((_, i) => (
                <span key={i} className="h-1 rounded-full"
                  style={{ background: "rgba(0,0,0,0.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)" }} />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d14] shadow-[0_0_6px_rgba(220,30,50,0.6)]" />
              <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: "#3a2e1f" }}>HDD</span>
            </div>
          </div>
        </div>

        {/* Base/stand */}
        <div className="mx-auto mt-[-6px] h-3 w-[60%] rounded-b-2xl"
          style={{
            background: "linear-gradient(180deg, #a89d82, #6b5f48)",
            boxShadow: "0 14px 30px -8px rgba(0,0,0,0.7)",
          }}
        />
        <div className="mx-auto mt-1 h-1.5 w-[45%] rounded-full"
          style={{ background: "#45382a", opacity: 0.8 }}
        />
      </div>

      {/* Subtle caption under the machine */}
      <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#5a5048]">
        <span className="text-[#c8ff00]">●</span> A Bulgarian machine. Loaded with Bulgarian craft.
      </p>
    </div>
  );
}
