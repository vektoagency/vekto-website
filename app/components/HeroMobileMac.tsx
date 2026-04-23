"use client";

/**
 * Mobile-native Mac hero — CSS-drawn 128K-style shell with a
 * live CRT screen that loops one of our hero clips inside. No
 * WebGL, no GLB: cheap on battery, fast LCP, still on-brand.
 *
 * Tap the Mac → dispatches vekto:open-portfolio, same event the
 * desktop 3D scene fires when the user clicks the screen.
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
      className="group relative block w-full max-w-[320px] mx-auto text-left outline-none"
      aria-label="Open VEKTO portfolio"
    >
      {/* Floor reflection / atmospheric halo under the Mac */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-[90%] h-8 blur-2xl opacity-80 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(200,255,0,0.35), transparent 70%)" }}
      />

      {/* Beige Mac 128K shell */}
      <div
        className="relative rounded-[18px] px-4 pt-4 pb-5 border border-black/40"
        style={{
          background: "linear-gradient(180deg, #e0d5ba 0%, #cdbd9e 50%, #ac9d7e 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -3px 0 rgba(0,0,0,0.22), 0 26px 50px -22px rgba(0,0,0,0.75), 0 0 55px rgba(200,255,0,0.18)",
        }}
      >
        {/* Brand strip */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span aria-hidden className="w-1 h-1 rounded-full bg-black/30" />
          <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-black/55 font-bold">
            Macintosh
          </span>
          <span aria-hidden className="w-1 h-1 rounded-full bg-black/30" />
        </div>

        {/* CRT bezel */}
        <div
          className="relative rounded-[10px] overflow-hidden"
          style={{
            background: "#18160f",
            boxShadow: "inset 0 3px 10px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(0,0,0,0.45)",
          }}
        >
          {/* Phosphor surface showing a looping clip */}
          <div
            className="relative aspect-[4/3]"
            style={{
              background:
                "radial-gradient(ellipse 100% 90% at 50% 50%, #0f140a 0%, #080b04 65%, #030402 100%)",
            }}
          >
            {/* Looped hero clip — webp already preloaded in layout.tsx */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-anim/video-5s.webp"
              alt=""
              className="absolute inset-0 w-full h-full object-cover hm-crt-video"
              style={{ mixBlendMode: "screen" }}
              loading="eager"
              decoding="async"
            />

            {/* Lime phosphor tint overlay */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(200,255,0,0.08), rgba(200,255,0,0.02))",
                mixBlendMode: "screen",
              }}
            />

            {/* CRT text overlay — thin bottom strip */}
            <div className="absolute inset-x-0 bottom-1.5 flex justify-center px-2 pointer-events-none">
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#c8ff00] bg-black/55 border border-[#c8ff00]/30 px-2 py-0.5 rounded-sm hm-crt-flicker">
                VEKTO/REEL · TAP
                <span className="inline-block w-1 h-2 bg-[#c8ff00] ml-1 align-middle hm-crt-cursor" />
              </div>
            </div>

            {/* Scanlines */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(200,255,0,0.35) 0px, rgba(200,255,0,0.35) 1px, transparent 1px, transparent 3px)",
              }}
            />

            {/* CRT curvature vignette */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 115% 95% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
              }}
            />

            {/* Phosphor glow pulse */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none hm-crt-glow"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 55%, rgba(200,255,0,0.22) 0%, transparent 70%)",
                mixBlendMode: "screen",
              }}
            />
          </div>
        </div>

        {/* Lower face — disk slot + rainbow apple bar hint */}
        <div className="flex items-center justify-between mt-4 px-1">
          <div className="flex items-center gap-1.5">
            <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#c8ff00]/70 animate-pulse" />
            <span className="font-mono text-[8px] tracking-[0.22em] uppercase text-black/55 font-bold">
              VEKTO/OS
            </span>
          </div>
          <span
            aria-hidden
            className="inline-block w-16 h-1 rounded-sm"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.2) 100%)",
            }}
          />
        </div>
      </div>

      {/* Keyboard base — a narrower block stacked below the shell */}
      <div
        className="relative mx-auto mt-2 w-[88%] rounded-[10px] border border-black/40"
        style={{
          height: "22px",
          background: "linear-gradient(180deg, #d0c3a4 0%, #b4a384 60%, #9b8a6c 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.18), 0 14px 22px -14px rgba(0,0,0,0.7)",
        }}
      >
        {/* Key grid illusion */}
        <div
          aria-hidden
          className="absolute inset-x-3 top-1.5 bottom-1.5 rounded-[3px] opacity-70"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 11px)",
          }}
        />
      </div>

      {/* Tap hint */}
      <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#c8ff00]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
        <span className="group-active:opacity-60">Tap the screen ↓</span>
      </div>

      <style jsx>{`
        @keyframes hmCrtFlicker {
          0%, 100% { opacity: 1; }
          42% { opacity: 0.86; }
          45% { opacity: 1; }
          93% { opacity: 0.92; }
        }
        @keyframes hmCursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes hmGlowPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes hmCrtVideo {
          0%, 100% { filter: brightness(0.85) contrast(1.15) saturate(0.85); }
          50%     { filter: brightness(0.95) contrast(1.25) saturate(0.9); }
        }
        .hm-crt-flicker { animation: hmCrtFlicker 4.5s ease-in-out infinite; }
        .hm-crt-cursor  { animation: hmCursorBlink 1s steps(1) infinite; }
        .hm-crt-glow    { animation: hmGlowPulse 3.2s ease-in-out infinite; }
        .hm-crt-video   { animation: hmCrtVideo 6s ease-in-out infinite; }
      `}</style>
    </button>
  );
}
