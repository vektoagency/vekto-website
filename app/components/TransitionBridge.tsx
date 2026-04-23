"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Global CRT-style page transition. When someone triggers
 * `vekto:enter-pravec` (with optional { x, y } percent origin),
 * a full-screen phosphor overlay expands from the click point,
 * holds while /work mounts underneath, then collapses CRT-style.
 */
type Phase = "idle" | "covering" | "holding" | "revealing";

export default function TransitionBridge() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimer = (t: ReturnType<typeof setTimeout>) => { timers.current.push(t); };

  const setOrigin = (x?: number, y?: number) => {
    const root = document.documentElement;
    if (x != null && y != null) {
      root.style.setProperty("--tb-x", `${x}%`);
      root.style.setProperty("--tb-y", `${y}%`);
    } else {
      const isMobile = window.innerWidth < 1024;
      root.style.setProperty("--tb-x", isMobile ? "50%" : "75%");
      root.style.setProperty("--tb-y", "50%");
    }
  };

  const trigger = useCallback((detail?: { x?: number; y?: number }) => {
    setPhase((current) => {
      if (current !== "idle") return current;
      setOrigin(detail?.x, detail?.y);
      router.prefetch("/work");
      addTimer(setTimeout(() => {
        setPhase("holding");
        router.push("/work");
      }, 820));
      return "covering";
    });
  }, [router]);

  // When /work mounts during hold, begin reveal
  useEffect(() => {
    if (phase === "holding" && pathname === "/work") {
      const rafId = requestAnimationFrame(() => {
        addTimer(setTimeout(() => setPhase("revealing"), 120));
      });
      addTimer(setTimeout(() => setPhase("idle"), 1400));
      return () => cancelAnimationFrame(rafId);
    }
  }, [phase, pathname]);

  // External trigger (from button or Pravec screen click)
  useEffect(() => {
    const onTrigger = (e: Event) => {
      const ce = e as CustomEvent<{ x?: number; y?: number } | undefined>;
      trigger(ce.detail);
    };
    window.addEventListener("vekto:enter-pravec", onTrigger);
    return () => window.removeEventListener("vekto:enter-pravec", onTrigger);
  }, [trigger]);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  if (phase === "idle") return null;

  const cls =
    phase === "covering" ? "tb-covering" :
    phase === "holding"  ? "tb-holding" :
                           "tb-revealing";

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[70] ${cls}`}
    >
      {/* Phosphor wash — radial lime from click origin */}
      <div
        className="absolute inset-0 tb-phosphor"
        style={{
          background:
            "radial-gradient(circle at var(--tb-x, 75%) var(--tb-y, 50%), #e8ff5a 0%, #c8ff00 10%, #4a5c0d 34%, #0a0805 62%, #0a0805 100%)",
        }}
      />
      {/* White flash at peak of covering */}
      {phase === "covering" && <div className="absolute inset-0 bg-white tb-flash" />}
    </div>
  );
}
