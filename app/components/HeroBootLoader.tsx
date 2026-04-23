"use client";

import { useEffect, useState } from "react";

const LINES = [
  "> VEKTO/OS",
  "> INIT CRT BUFFER ........ OK",
  "> MOUNT SHADERS .......... OK",
  "> LOAD MAC-128K.GLB ...... OK",
  "> BOOTING DESKTOP .......",
];

// Classic unix spinner — rotates through at ~10 fps.
const SPINNER = ["|", "/", "—", "\\"];

export default function HeroBootLoader() {
  const [step, setStep] = useState(0);
  const [spin, setSpin] = useState(0);
  const [dots, setDots] = useState(0);

  // Typewriter for the boot lines.
  useEffect(() => {
    let cancel = false;
    const run = async () => {
      for (let i = 0; i <= LINES.length; i++) {
        if (cancel) return;
        setStep(i);
        await new Promise((r) => setTimeout(r, 140 + Math.random() * 110));
      }
    };
    run();
    return () => {
      cancel = true;
    };
  }, []);

  // Always-running spinner (shows it's alive even if typewriter finishes).
  useEffect(() => {
    const id = setInterval(() => setSpin((s) => (s + 1) % SPINNER.length), 100);
    return () => clearInterval(id);
  }, []);

  // Dots animation on the current line.
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 320);
    return () => clearInterval(id);
  }, []);

  const typingDone = step >= LINES.length;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-[74%] -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[360px]">
        <div
          className="relative rounded-sm border border-[#c8ff00]/30 bg-black/40 backdrop-blur-sm px-5 py-4 overflow-hidden"
          style={{ boxShadow: "0 10px 40px -10px rgba(200,255,0,0.35)" }}
        >
          {/* scanlines */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(200,255,0,0.6) 0px, rgba(200,255,0,0.6) 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* Header with prominent spinner + LOADING label */}
          <div className="flex items-center justify-between mb-3 font-mono text-[10px] uppercase tracking-[0.3em]">
            <span className="flex items-center gap-2 text-[#c8ff00]">
              <span className="inline-flex w-4 justify-center font-bold">{SPINNER[spin]}</span>
              LOADING{".".repeat(dots)}
            </span>
            <span className="text-[#c8ff00]/45">VEKTO/BOOT</span>
          </div>

          {/* typed lines */}
          <pre className="font-mono text-[11px] md:text-[12px] text-[#c8ff00] leading-[1.6] whitespace-pre-wrap">
            {LINES.slice(0, step).map((l, i) => (
              <div key={i}>{l}</div>
            ))}
            {step < LINES.length && (
              <div>
                {LINES[step]}
                <span className="inline-block w-[7px] h-[13px] bg-[#c8ff00] ml-1 align-middle animate-pulse" />
              </div>
            )}
            {typingDone && (
              <div className="text-[#c8ff00]">
                <span className="inline-block w-[7px] h-[13px] bg-[#c8ff00] mr-1 align-middle animate-pulse" />
                RENDERING{".".repeat(dots)}
              </div>
            )}
          </pre>

          {/* Indeterminate shimmer bar — constantly moving to signal activity,
              regardless of the typewriter progress. */}
          <div className="mt-4 h-1 bg-[#c8ff00]/10 rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 w-1/3 rounded-full boot-shimmer"
              style={{ background: "linear-gradient(to right, transparent, #c8ff00, transparent)" }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bootShimmer {
          0% { left: -35%; }
          100% { left: 100%; }
        }
        .boot-shimmer {
          animation: bootShimmer 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
