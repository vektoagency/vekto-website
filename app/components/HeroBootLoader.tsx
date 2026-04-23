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

          {/* typed lines — each line fades/types in on its own animation-delay */}
          <pre className="font-mono text-[11px] md:text-[12px] text-[#c8ff00] leading-[1.6] whitespace-pre-wrap">
            {LINES.map((l, i) => (
              <div key={i} className="boot-line" style={{ animationDelay: `${i * 180}ms` }}>
                {l}
              </div>
            ))}
            <div className="boot-line boot-rendering" style={{ animationDelay: `${LINES.length * 180 + 120}ms` }}>
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

      <style jsx>{`
        @keyframes bootShimmer {
          0% { left: -35%; }
          100% { left: 100%; }
        }
        :global(.boot-shimmer) {
          animation: bootShimmer 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes bootSpin {
          0%   { content: "|"; }
          25%  { content: "/"; }
          50%  { content: "—"; }
          75%  { content: "\\\\"; }
          100% { content: "|"; }
        }
        /* Not all browsers animate content — use transform rotation on a pseudo span as fallback */
        :global(.boot-spinner) {
          animation: bootSpinRotate 0.8s linear infinite;
          transform-origin: center;
        }
        @keyframes bootSpinRotate {
          to { transform: rotate(360deg); }
        }

        @keyframes bootDots {
          0%   { content: ""; }
          25%  { content: "."; }
          50%  { content: ".."; }
          75%  { content: "..."; }
          100% { content: ""; }
        }
        :global(.boot-dots)::after {
          content: "";
          animation: bootDots 1.2s steps(4, jump-none) infinite;
        }

        @keyframes bootLineIn {
          0%   { opacity: 0; transform: translateX(-4px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        :global(.boot-line) {
          opacity: 0;
          animation: bootLineIn 220ms cubic-bezier(0.25,0.8,0.3,1) forwards;
        }

        @keyframes bootCaret {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        :global(.boot-caret) {
          animation: bootCaret 0.9s steps(2, jump-none) infinite;
        }
      `}</style>
    </div>
  );
}
