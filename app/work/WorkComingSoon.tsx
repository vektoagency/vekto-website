"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function WorkComingSoon() {
  const [cursor, setCursor] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 520);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden text-[#ece8e1]">
      {/* Soft inner shadow to anchor the content over the canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,8,5,0.3) 0%, rgba(10,8,5,0.75) 60%, rgba(10,8,5,0.92) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col items-center justify-center px-6 text-center animate-hero-fade-in" style={{ animationDelay: "650ms" }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c8ff00]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#c8ff00] align-middle mr-2 animate-pulse" />
          SYSTEM BOOTING — VEKTO/WORK
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
          Our work reel is<br />
          <span className="text-[#c8ff00]">loading{cursor ? "_" : " "}</span>
        </h1>

        <p className="mt-6 max-w-xl text-[#9a958e] text-base sm:text-lg leading-relaxed">
          We&apos;re cutting together the showcase — cinematic spots, AI-driven
          short-form and brand systems built for scale. It drops soon.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-full bg-[#c8ff00] px-6 py-3 text-sm font-semibold text-[#0a0805] hover:bg-[#d4ff33] transition"
          >
            Get an early preview
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#2a2a28] px-6 py-3 text-sm font-semibold text-[#ece8e1] hover:border-[#c8ff00] hover:text-[#c8ff00] transition"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-14 font-mono text-[11px] uppercase tracking-[0.3em] text-[#5d5951]">
          [ STATUS: IN PRODUCTION ] &nbsp;•&nbsp; EST. RELEASE: Q2 2026
        </div>
      </div>
    </section>
  );
}
