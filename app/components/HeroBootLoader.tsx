"use client";

const LINES = [
  "> VEKTO/OS",
  "> INIT CRT BUFFER ........ OK",
  "> MOUNT SHADERS .......... OK",
  "> LOAD MAC-128K.GLB ...... OK",
  "> BOOTING DESKTOP .......",
];

/**
 * Pure-CSS loader card — all animation comes from CSS keyframes, so it is
 * alive from the very first paint (no wait for React hydration/effects).
 */
export default function HeroBootLoader() {
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

          {/* Header with CSS spinner + LOADING label */}
          <div className="flex items-center justify-between mb-3 font-mono text-[10px] uppercase tracking-[0.3em]">
            <span className="flex items-center gap-2 text-[#c8ff00]">
              <span className="boot-spinner inline-flex w-4 justify-center font-bold">|</span>
              <span className="relative">
                LOADING
                <span aria-hidden className="boot-dots absolute left-full" />
              </span>
            </span>
            <span className="text-[#c8ff00]/45">VEKTO/BOOT</span>
          </div>

          {/* typed lines — each line fades/types in on its own animation-delay.
              Inline `opacity:0` guarantees the starting state from first paint,
              even before globals.css is applied. */}
          <pre className="font-mono text-[11px] md:text-[12px] text-[#c8ff00] leading-[1.6] whitespace-pre-wrap">
            {LINES.map((l, i) => (
              <div key={i} className="boot-line" style={{ opacity: 0, animationDelay: `${i * 180}ms` }}>
                {l}
              </div>
            ))}
            <div className="boot-line boot-rendering" style={{ opacity: 0, animationDelay: `${LINES.length * 180 + 120}ms` }}>
              <span className="boot-caret inline-block w-[7px] h-[13px] bg-[#c8ff00] mr-1 align-middle" />
              RENDERING
              <span aria-hidden className="boot-dots relative" />
            </div>
          </pre>

          {/* Indeterminate shimmer bar */}
          <div className="mt-4 h-1 bg-[#c8ff00]/10 rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 w-1/3 rounded-full boot-shimmer"
              style={{ background: "linear-gradient(to right, transparent, #c8ff00, transparent)" }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
