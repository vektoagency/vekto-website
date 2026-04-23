"use client";

/**
 * Mobile-native Mac hero — a CSS-drawn CRT portal that echoes the
 * desktop 3D scene without shipping three.js / a GLB model to phones.
 * Tap anywhere on the screen → dispatches vekto:open-portfolio, same
 * event the desktop Mac fires.
 */
export default function HeroMobileMac() {
  const onTap = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("vekto:open-portfolio"));
    }
  };

  return (
    <button
      onClick={onTap}
      className="group relative block w-full max-w-[260px] mx-auto text-left outline-none"
      aria-label="Open VEKTO portfolio"
    >
      {/* Beige Mac shell */}
      <div
        className="relative rounded-[14px] p-3 pb-4 border border-black/40"
        style={{
          background: "linear-gradient(180deg, #d8cdb2 0%, #c6b897 55%, #a89a7c 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.2), 0 18px 40px -18px rgba(0,0,0,0.65), 0 0 38px rgba(200,255,0,0.15)",
        }}
      >
        {/* Brand row */}
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-black/55">
            Macintosh
          </span>
          <span aria-hidden className="w-1 h-1 rounded-full bg-black/25" />
        </div>

        {/* CRT bezel — dark inner frame around the phosphor */}
        <div
          className="relative rounded-[8px] overflow-hidden"
          style={{
            background: "#1a1a14",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(0,0,0,0.4)",
          }}
        >
          {/* Phosphor surface */}
          <div
            className="relative aspect-[4/3]"
            style={{
              background:
                "radial-gradient(ellipse 100% 90% at 50% 50%, #151a0a 0%, #0b0f05 60%, #050602 100%)",
            }}
          >
            {/* Animated CRT text — our own inline keyframes so it works without globals */}
            <div className="absolute inset-0 flex items-center justify-center px-2">
              <div className="font-mono text-[10px] leading-[1.55] text-[#c8ff00] text-center hm-crt-text">
                <div className="opacity-90">&gt; VEKTO/OS v1.0</div>
                <div className="opacity-80">&gt; LOADING REEL...</div>
                <div className="mt-1 text-[#eaffb8] font-bold uppercase tracking-[0.22em] text-[11px]">
                  TAP TO ENTER
                </div>
                <div className="mt-1 inline-block w-1.5 h-3 bg-[#c8ff00] hm-crt-cursor align-middle" />
              </div>
            </div>

            {/* Scanlines */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(200,255,0,0.35) 0px, rgba(200,255,0,0.35) 1px, transparent 1px, transparent 3px)",
              }}
            />

            {/* Vignette */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 45%, rgba(0,0,0,0.65) 100%)",
              }}
            />

            {/* Phosphor glow pulse */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none hm-crt-glow"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 55%, rgba(200,255,0,0.18) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>

        {/* Disk slot + brand */}
        <div className="flex items-center justify-between mt-3 px-1">
          <span className="inline-block w-14 h-1 rounded-sm bg-black/30" />
          <span className="font-mono text-[7px] tracking-[0.22em] uppercase text-black/40">
            VEKTO
          </span>
        </div>
      </div>

      {/* Tap hint */}
      <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#c8ff00]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
        <span className="group-active:opacity-60">Tap the screen ↓</span>
      </div>

      <style jsx>{`
        @keyframes hmCrtFlicker {
          0%, 100% { opacity: 1; }
          42% { opacity: 0.92; }
          45% { opacity: 1; }
          93% { opacity: 0.95; }
        }
        @keyframes hmCursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes hmGlowPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        .hm-crt-text { animation: hmCrtFlicker 4.5s ease-in-out infinite; }
        .hm-crt-cursor { animation: hmCursorBlink 1s steps(1) infinite; }
        .hm-crt-glow { animation: hmGlowPulse 3.2s ease-in-out infinite; }
      `}</style>
    </button>
  );
}
