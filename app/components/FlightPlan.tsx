"use client";

// ============================================================================
// FLIGHT PLAN — the process, told as the Vector's trajectory.
//
// Both previews used to present "how it happens" as a stack of bordered
// plate cards — the same furniture the rest of both pages already leans on.
// This is the replacement, and it borrows the film's world instead: a jet
// ground, one silver line, naked type. The line IS the animation — it draws
// itself as the visitor scrolls, a small arrowhead riding its tip, and each
// station ignites the moment the tip passes it. No borders, no plates, no
// shadows: the trajectory is the only graphic.
//
// Shared by /preview-cinematic and /preview-brutalism; the caller passes its
// own font stacks so each page keeps its typography variables.
// ============================================================================

import { useEffect, useRef, useState } from "react";

const SILVER_H =
  "linear-gradient(90deg, #b0b0b0 0%, #f4f4f4 22%, #8a8a8a 45%, #eaeaea 62%, #c8c8c8 78%, #ffffff 100%)";

export type FlightStep = {
  num: string;
  title: string;
  duration: string;
  body: string;
};

export default function FlightPlan({
  eyebrow,
  headline1,
  headline2Prefix,
  headline2Highlight,
  note,
  steps,
  fonts,
}: {
  eyebrow: string;
  headline1: string;
  headline2Prefix: string;
  headline2Highlight: string;
  note?: string;
  steps: readonly FlightStep[];
  fonts: { display: string; pixel: string; comic: string };
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [p, setP] = useState(0);
  // Ignition thresholds measured from the real station offsets, so the tip
  // and the light-ups can never drift apart when copy wraps differently
  // across languages and viewports.
  const [marks, setMarks] = useState<number[]>([]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      const h = el.offsetHeight || 1;
      setMarks(stepRefs.current.map((s) => (s ? (s.offsetTop + 30) / h : 0)));
    };
    const compute = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // The line starts drawing as the trajectory enters the lower fifth of
      // the viewport and completes just before its end scrolls past centre.
      setP(Math.max(0, Math.min(1, (vh * 0.82 - r.top) / Math.max(1, r.height))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    measure();
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const ro = new ResizeObserver(() => {
      measure();
      compute();
    });
    ro.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [steps.length]);

  return (
    <div
      className="px-6 md:px-14 py-16 md:py-32"
      style={{ background: "#0d0d0d", color: "#f4f4f4", fontFamily: fonts.display }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div
          className="text-xs font-bold uppercase tracking-[0.35em] mb-5 opacity-55"
          style={{ fontFamily: fonts.pixel }}
        >
          {eyebrow}
        </div>
        <h2
          className="font-black leading-[0.94] tracking-[-0.03em] uppercase"
          style={{ fontSize: "calc(clamp(30px, 4.4vw, 68px) * var(--bgk, 1))" }}
        >
          {headline1}
          <br />
          {headline2Prefix}{" "}
          <span
            className="italic pr-[0.08em]"
            style={{
              background: SILVER_H,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {headline2Highlight}
          </span>
        </h2>
        {note && (
          <p
            className="mt-5 text-sm md:text-base leading-[1.55] opacity-60 max-w-md font-medium"
            style={{ fontFamily: fonts.comic }}
          >
            {note}
          </p>
        )}

        <div ref={wrapRef} className="relative max-w-3xl mt-16 md:mt-24">
          {/* Rail (dim, full height) + the drawn flight line over it. */}
          <div
            aria-hidden
            className="absolute left-[7px] top-0 bottom-0 w-[2px]"
            style={{ background: "rgba(244,244,244,0.13)" }}
          />
          <div
            aria-hidden
            className="absolute left-[7px] top-0 w-[2px] origin-top"
            style={{
              height: "100%",
              transform: `scaleY(${p})`,
              background: "linear-gradient(180deg, #6d6d6d 0%, #f4f4f4 100%)",
            }}
          />
          {/* The vector's tip — a small arrowhead riding the drawn end. */}
          <div
            aria-hidden
            className="absolute left-[8px] -translate-x-1/2 z-10"
            style={{ top: `calc(${p * 100}% - 4px)` }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: "9px solid #f4f4f4",
                filter: "drop-shadow(0 0 5px rgba(244,244,244,0.65))",
              }}
            />
          </div>

          <ol className="space-y-16 md:space-y-24 list-none m-0 p-0">
            {steps.map((s, i) => {
              const on = p >= (marks[i] ?? (i + 0.4) / steps.length);
              return (
                <li
                  key={s.num}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className="relative pl-10 md:pl-14"
                >
                  {/* Station node: an outline diamond that fills silver the
                      moment the tip reaches it. */}
                  <span
                    aria-hidden
                    className="absolute left-[8px] top-[9px] -translate-x-1/2 block w-[10px] h-[10px] rotate-45 border-2 transition-all duration-500"
                    style={{
                      borderColor: on ? "#f4f4f4" : "rgba(244,244,244,0.35)",
                      background: on ? "#f4f4f4" : "transparent",
                      boxShadow: on ? "0 0 10px rgba(244,244,244,0.5)" : "none",
                    }}
                  />
                  <div
                    style={{
                      opacity: on ? 1 : 0.22,
                      transform: on ? "translateX(0)" : "translateX(14px)",
                      transition:
                        "opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 650ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span
                        className="text-sm md:text-base font-bold tabular-nums"
                        style={{
                          fontFamily: fonts.pixel,
                          background: SILVER_H,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {s.num}
                      </span>
                      <h3 className="font-black text-xl md:text-3xl uppercase tracking-tight">
                        {s.title}
                      </h3>
                      <span
                        className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.25em] opacity-60"
                        style={{ fontFamily: fonts.pixel }}
                      >
                        {s.duration}
                      </span>
                    </div>
                    <p
                      className="mt-2 text-sm md:text-base leading-[1.55] max-w-xl opacity-70 font-medium"
                      style={{ fontFamily: fonts.comic }}
                    >
                      {s.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
