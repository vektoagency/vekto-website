"use client";

import { useEffect, useState } from "react";

const LINES = [
  "> VEKTO/OS",
  "> INIT CRT BUFFER ........ OK",
  "> MOUNT SHADERS .......... OK",
  "> LOAD MAC-128K.GLB ...... OK",
  "> BOOTING DESKTOP .......",
];

export default function HeroBootLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let cancel = false;
    const run = async () => {
      for (let i = 0; i <= LINES.length; i++) {
        if (cancel) return;
        setStep(i);
        await new Promise((r) => setTimeout(r, 120 + Math.random() * 90));
      }
    };
    run();
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-[74%] -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[340px]">
        {/* Scan-line + vignette backdrop card */}
        <div
          className="relative rounded-sm border border-[#c8ff00]/25 bg-black/35 backdrop-blur-sm px-5 py-4 overflow-hidden"
          style={{ boxShadow: "0 10px 40px -10px rgba(200,255,0,0.25)" }}
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

          {/* status bar */}
          <div className="flex items-center justify-between mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[#c8ff00]/70">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
              VEKTO/BOOT
            </span>
            <span className="text-[#c8ff00]/45">v1.0</span>
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
            {step >= LINES.length && (
              <div className="text-[#c8ff00]">
                <span className="inline-block w-[7px] h-[13px] bg-[#c8ff00] mr-1 align-middle animate-pulse" />
                READY_
              </div>
            )}
          </pre>

          {/* progress bar */}
          <div className="mt-4 h-0.5 bg-[#c8ff00]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c8ff00] transition-all duration-200"
              style={{ width: `${Math.min((step / LINES.length) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
