"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Global full-screen overlay that survives navigation. Listens for
 * `vekto:enter-pravec` and:
 *   1. "covering" — radial lime cover expands from the Pravec screen position
 *   2. "holding"  — stays fully covered while router.push renders /work
 *   3. "revealing" — fades out, revealing the new page
 *
 * Also covers direct-link /work loads briefly for consistency.
 */
type Phase = "idle" | "covering" | "holding" | "revealing";

export default function TransitionBridge() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimer = (t: ReturnType<typeof setTimeout>) => { timers.current.push(t); };

  const trigger = useCallback(() => {
    setPhase((current) => {
      if (current !== "idle") return current;
      router.prefetch("/work");
      // Schedule the cover → hold → navigate sequence
      addTimer(setTimeout(() => {
        setPhase("holding");
        router.push("/work");
      }, 780));
      return "covering";
    });
  }, [router]);

  // When /work finishes mounting during hold, begin reveal
  useEffect(() => {
    if (phase === "holding" && pathname === "/work") {
      const rafId = requestAnimationFrame(() => {
        addTimer(setTimeout(() => setPhase("revealing"), 90));
      });
      addTimer(setTimeout(() => setPhase("idle"), 1500));
      return () => cancelAnimationFrame(rafId);
    }
  }, [phase, pathname]);

  // External trigger
  useEffect(() => {
    const onTrigger = () => trigger();
    window.addEventListener("vekto:enter-pravec", onTrigger);
    return () => window.removeEventListener("vekto:enter-pravec", onTrigger);
  }, [trigger]);

  // Direct-load bridge (legacy sessionStorage flag)
  useEffect(() => {
    if (pathname !== "/work" || phase !== "idle") return;
    let flag: string | null = null;
    try { flag = sessionStorage.getItem("vekto-entering-pravec"); } catch {}
    if (flag !== "1") return;
    try { sessionStorage.removeItem("vekto-entering-pravec"); } catch {}
    setPhase("revealing");
    addTimer(setTimeout(() => setPhase("idle"), 1200));
  }, [pathname, phase]);

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
      style={{
        background:
          "radial-gradient(circle at 75% 50%, #e8ff5a 0%, #c8ff00 12%, #34420a 38%, #0a0805 65%, #0a0805 100%)",
      }}
    />
  );
}
